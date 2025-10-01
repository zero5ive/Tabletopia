package com.tabletopia.realtimeservice.domain.reservation.controller;

import com.tabletopia.realtimeservice.domain.reservation.dto.ConnectionMessage;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionResult;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatus;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusResponse;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusUpdateMessage;
import com.tabletopia.realtimeservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.dto.RestaurantTableDto;
import com.tabletopia.realtimeservice.feign.RestaurantServiceClient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 실시간 테이블 선택 웹소켓 컨트롤러
 * 테이블 선택 시 실시간으로 상태 변경 (빨간불/초록불)
 *
 * @author 김예진
 * @since 2025-09-26
 */
@Slf4j
@Controller
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class RealtimeTableSelectionController {

  private final SimpMessagingTemplate messagingTemplate;
  private final ReservationService reservationService;
  private final RestaurantServiceClient restaurantServiceClient;

  // =============== 메모리 캐시 =============== //
  /**
   * 테이블 선점 상태 저장소
   * Key: "restaurantId_tableId_date_time", Value: 선점 정보
   */
  private final Map<String, TableSelectionInfo> selectedTables = new ConcurrentHashMap<>();

  /**
   * 레스토랑별 접속 중인 사용자들
   */
  private final Map<Long, Set<String>> connectedUsers = new ConcurrentHashMap<>();


  // =============== 테이블 실시간 선택 로직 =============== //
  /**
   * 레스토랑 테이블 예약 접속 처리
   * @author 김예진
   * @since 2025-09-25
   *
   * @param restaurantId 레스토랑 id
   * @param message 접속 메시지
   * @return 현재 접속 중인 사용자 목록
   */
  @MessageMapping("/reservation/{restaurantId}/connect")
  @SendTo("/topic/reservation/{restaurantId}/table-status")
  private Set<String> connectToReservation(
      @DestinationVariable Long restaurantId,
      ConnectionMessage message) {
    // STOMP의 @DestinationVariable = HTTP에서 파라미터 값을 받아오기 위해 사용한 @PathVariable
    log.debug("레스토랑 {}에 사용자 {} 접속 요청", restaurantId, message.getUserEmail());

    // 접속자 목록에 추가
    connectedUsers
        .computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet())
        .add(message.getUserEmail());

    return connectedUsers.get(restaurantId);
  }

  /**
   * 테이블 선택 요청
   * 사용자가 선택한 레스토랑의 특정 테이블을 선점
   *
   * @author 김예진
   * @since 2025-09-29
   */
  @MessageMapping("/restaurant/{restaurantId}/tables/{tableId}/select")
//  @SendTo("/topic/restaurant/{restaurantId}/tables/status")
  public void selectTable(
      @DestinationVariable Long restaurantId,
      @DestinationVariable Long tableId,
      TableSelectionRequest request,
      SimpMessageHeaderAccessor accessor // 헤더 접근
      ){
    // 웹소켓 세션 ID 추출
    String sessionId = accessor.getSessionId();

    // 선점 키 생성
    String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
    log.debug("생성된 선점키 {}", selectionKey);

    // 기존 선점 정보 확인
    TableSelectionInfo existSelectionInfo = selectedTables.get(selectionKey);

    // 기존 선점 정보가 아직 존재하고, 만료 이전인 경우
    if (existSelectionInfo != null && !isSelectionExpired(existSelectionInfo)){
      log.debug("사용자 {}가 테이블 {} 점유 중", existSelectionInfo.getSessionId(), tableId);

      // TODO 처리필요

      return;
    }

    // 4. 예약 확정 여부 확인
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    if (isTableReserved(restaurantId, tableId, timeSlot)) {
      log.debug("테이블 {} 이미 예약됨", tableId);

//      sendTableSelectionError(restaurantId, tableId, "이미 예약이 확정된 테이블입니다.");
      return;
    }

    LocalDateTime now =  LocalDateTime.now();
    LocalDateTime expiryTime = now.plusMinutes(5);

    // 테이블 선점 정보 생성
    TableSelectionInfo selectionInfo = new TableSelectionInfo(
        tableId,
        sessionId,
        now,
        expiryTime, // 만료시간: +5분
        TableSelectStatus.PENDING // 결제 대기 상태 부여
    );

    // 모든 클라이언트에게 상태 변경 브로드캐스트
    TableStatus updatedTableStatus = new TableStatus();
    updatedTableStatus.setTableId(tableId);
    updatedTableStatus.setStatus("SELECTED");
    updatedTableStatus.setSelectedBy(request.getUserName());
    updatedTableStatus.setSelectedAt(now);
    updatedTableStatus.setExpiryTime(expiryTime);

    selectedTables.put(selectionKey, selectionInfo);
    log.debug("테이블 {}을 사용자 {}가 선점. 만료시간 {}", tableId, sessionId, selectionInfo.getExpiryTime());

    // 모든 클라이언트들에 상태 변경을 브로드 캐스트
    sendTableStatusUpdate(restaurantId, tableId, updatedTableStatus, true, "테이블이 선택되었습니다.");
  }

  /**
   * TODO 테이블 선택 취소 요청
   * @author 김예진
   * @since 2025-10-01
   */

  /**
   * 테이블 상태 업데이트 전송
   * @author 김예진
   * @since 2025-10-01
   */
  private void sendTableStatusUpdate(Long restaurantId, Long tableId, TableStatus tableStatus, boolean success, String message) {

    TableStatusUpdateMessage updateMessage = new TableStatusUpdateMessage(
        success, message, tableId, tableStatus
    );

    messagingTemplate.convertAndSend(
        "/topic/restaurant/" + restaurantId + "/tables/status",
        updateMessage
    );
  }


  /**
   * 특정 시간대의 테이블 상태 조회
   * 테이블 선택 팝업이 열릴 때 호출
   * @auther 김예진
   * @since 2025-09-25
   *
   * @param restaurantId 레스토랑 ID
   * @param request 날짜, 시간 정보
   * @return 각 테이블의 현재 상태 (초록불/빨간불)
   */
  @MessageMapping("/restaurant/{restaurantId}/tables/status")
  @SendTo("/topic/restaurant/{restaurantId}/tables/status")
  public TableStatusResponse getTableStatus(
      @DestinationVariable Long restaurantId,
      TableStatusRequest request) {
    log.debug("테이블 상태 조회: 레스토랑 {}, 날짜 {}, 시간 {}", restaurantId, request.getDate(), request.getTime());

    try {
      // 레스토랑 테이블 목록 조회
      List<RestaurantTableDto> tables = restaurantServiceClient.getRestaurantTables(restaurantId);

      // 테이블 및 선점 상태를 저장할 배열
      List<TableStatus> tableStatuses = new ArrayList<>();

      // 사용자가 예약하려는 시간대 생성
      String timeSlot = formatTimeSlot(request.getDate(), request.getTime());

      // 각 테이블별 상태 확인
      for (RestaurantTableDto table : tables) {
        Long tableId = table.getId();

        // 각 테이블마다 현재 상태를 계산해서 저장할 배열
        TableStatus status = new TableStatus();
        status.setTableId(tableId);
        status.setTableName(table.getName());
        status.setMinCapacity(table.getMinCapacity());
        status.setMaxCapacity(table.getMaxCapacity());
        status.setXPosition(table.getXPosition());
        status.setYPosition(table.getYPosition());
        status.setShape(table.getShape());

        // 테이블 상태 판단
        String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
        TableSelectionInfo selection = selectedTables.get(selectionKey);

        if (selection != null && !isSelectionExpired(selection)) {
          // 다른 사용자가 임시 선점한 상태 (선택불가)
          status.setStatus("SELECTED");
//          status.setSelectedBy(selection.getUserEmail());
          status.setSelectedAt(selection.getSelectedAt());
          status.setExpiryTime(selection.getExpiryTime());

        } else if (isTableReserved(restaurantId, tableId, timeSlot)) {
          // 이미 예약 확정된 상태 (선택불가)
          status.setStatus("RESERVED");

        } else {
          // 선택 가능한 상태
          status.setStatus("AVAILABLE");
        }

        log.debug("테이블 {} 조회 결과 {}", table.getId(), status.getStatus());
        tableStatuses.add(status);
      }

      return TableStatusResponse.success(tableStatuses, request.getDate(), request.getTime());

    } catch (Exception e) {
      log.error("테이블 상태 조회 실패: restaurantId={}", restaurantId, e);
      return TableStatusResponse.error("테이블 상태를 불러올 수 없습니다.");
    }
  }

  /**
   * 시간대 문자열 생성: "2025-09-26T18:00"
   */
  private String formatTimeSlot(String date, String time) {
    return String.format("%sT%s", date, time);
  }

  /**
   * 선점 키 생성: "restaurantId_tableId_date_time"
   */
  private String createSelectionKey(Long restaurantId, Long tableId, String date, String time) {
    return String.format("%d_%d_%s_%s", restaurantId, tableId, date, time);
  }

  /**
   * 선점 만료 여부 확인
   */
  private boolean isSelectionExpired(TableSelectionInfo selection) {
    return LocalDateTime.now().isAfter(selection.getExpiryTime());
  }



  /**
   * 실제 예약 여부 확인
   */
  private boolean isTableReserved(Long restaurantId, Long restaurantTableId, String timeSlot) {
    try {
      return reservationService.isTableReserved(restaurantId, restaurantTableId, timeSlot);
    } catch (Exception e) {
      log.error("예약 확인 실패: tableId={}, timeSlot={}", restaurantTableId, timeSlot, e);
      return false;
    }
  }

}
