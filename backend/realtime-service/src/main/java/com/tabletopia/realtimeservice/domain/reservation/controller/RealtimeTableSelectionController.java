package com.tabletopia.realtimeservice.domain.reservation.controller;

import com.tabletopia.realtimeservice.domain.reservation.dto.CancelRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.ConnectResponse;
import com.tabletopia.realtimeservice.domain.reservation.dto.ConnectionMessage;
import com.tabletopia.realtimeservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.SessionInfoResponse;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatus;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusResponse;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableStatusUpdateMessage;
import com.tabletopia.realtimeservice.domain.reservation.dto.UserConnectedResponse;
import com.tabletopia.realtimeservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.realtimeservice.domain.reservation.service.RedisTableSelectionService;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.dto.RestaurantTableDto;
import com.tabletopia.realtimeservice.feign.RestaurantServiceClient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 실시간 테이블 선택 웹소켓 컨트롤러
 * 테이블 선택 시 실시간으로 상태 변경 (빨간불/초록불)
 *
 * TODO Redis로 개선
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
  private final RedisTableSelectionService redisTableSelectionService;

  // =============== 메모리 캐시 =============== //
  // Redis로 개선 중
//  /**
//   * 테이블 선점 상태 저장소
//   * Key: "restaurantId_tableId_date_time", Value: 선점 정보
//   */
//  private final Map<String, TableSelectionInfo> selectedTables = new ConcurrentHashMap<>();
//
//  /**
//   * 레스토랑별 접속 중인 사용자들
//   */
//  private final Map<Long, Set<String>> connectedUsers = new ConcurrentHashMap<>();


  // =============== 테이블 실시간 선택 로직 =============== //
  /**
   * 레스토랑 테이블 예약 접속 처리
   * @author 김예진
   * @since 2025-09-25
   *
   * @param restaurantId 레스토랑 id
   * @param accessor STOMP 헤더 접근자
   * @param message 접속 메시지
   */
  @MessageMapping("/reservation/{restaurantId}/connect")
  public void connectToReservation(
      @DestinationVariable Long restaurantId,
      SimpMessageHeaderAccessor accessor,
      ConnectionMessage message) {

    String sessionId = accessor.getSessionId();

    log.debug("레스토랑 {} 접속 요청: 사용자 {} 세션 {}", restaurantId, message.getUserEmail(), sessionId);

    // 접속자 목록에 추가
//    connectedUsers
//        .computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet())
//        .add(sessionId);
    // Redis에 접속자 추가
    redisTableSelectionService.addConnectedUser(restaurantId, sessionId);


    // TODO 프론트엔드에 수신이 안되어, 현재 처음 받는 브로드 캐스트의 세션 id를 자신의 세션 id로 저장하게 해놓았음
    //      추후 수정 필요
    // 1. 개별 사용자에게만 자신의 세션 ID 전송 (개인 메시지)
    messagingTemplate.convertAndSendToUser(
        sessionId,
        "/queue/session-info",
        SessionInfoResponse.of(sessionId)
    );


    // Redis에서 접속자 목록 조회
    Set<Object> connectedUsers = redisTableSelectionService.getConnectedUsers(restaurantId);
    Set<String> connectedUserIds = connectedUsers.stream()
        .map(Object::toString)
        .collect(Collectors.toSet());

    // 2. 모든 사용자에게 새 접속자 알림 (브로드캐스트)
    messagingTemplate.convertAndSend(
        String.format("/topic/reservation/%d/table-status", restaurantId),
//        UserConnectedResponse.of(sessionId, connectedUsers.get(restaurantId))
        UserConnectedResponse.of(sessionId, connectedUserIds)
    );

    log.debug("세션 {} 정보 전송 완료 (접속자 수: {})", sessionId, connectedUserIds.size());
  }

  /**
   * 테이블 선택 요청
   * 사용자가 선택한 레스토랑의 특정 테이블을 선점
   *
   * @author 김예진
   * @since 2025-09-29
   */
  @MessageMapping("/restaurant/{restaurantId}/tables/{tableId}/select")
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
//    TableSelectionInfo existSelectionInfo = selectedTables.get(selectionKey);

    // Redis에서 기존 선점 정보 확인
    TableSelectionInfo existSelectionInfo = redisTableSelectionService.getTableSelection(selectionKey);


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

//    selectedTables.put(selectionKey, selectionInfo);
    // Redis에 선점 정보 저장 (5분 TTL)
    redisTableSelectionService.saveTableSelection(selectionKey, selectionInfo);

    log.debug("테이블 선점 생성: 테이블 {}, 세션 {}, 만료시간 {}", tableId, sessionId, selectionInfo.getExpiryTime());


    // 모든 클라이언트에게 상태 변경 브로드캐스트
    TableStatus updatedTableStatus = new TableStatus();
    updatedTableStatus.setTableId(tableId);
    updatedTableStatus.setStatus("SELECTED");
    updatedTableStatus.setSelectedBy(sessionId);
    updatedTableStatus.setSelectedAt(now);
    updatedTableStatus.setExpiryTime(expiryTime);

    // 모든 클라이언트들에 상태 변경을 브로드 캐스트
    sendTableStatusUpdate(restaurantId, tableId, updatedTableStatus, true, "테이블이 선택되었습니다.");
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

//        // 테이블 상태 판단
//        String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
//        TableSelectionInfo selection = selectedTables.get(selectionKey);

        // Redis에서 테이블 상태 판단
        String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
        TableSelectionInfo selection = redisTableSelectionService.getTableSelection(selectionKey);


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
   * 예약 등록
   *
   * @author 김예진
   * @since 2025-09-24
   */
  @PostMapping("/reservation")
  public void registerReservation(@RequestBody ReservationRequest request){
    log.debug("예약 정보 - {}", request);

    Long reservationId = reservationService.createReservation(request);

    log.debug("예약 등록 id - {}", reservationId);

    // PENDING 제거
//    String selectionKey = createSelectionKey(request.getRestaurantId(), request.getRestaurantTableId(), request.getDate(), request.getTime());
//    selectedTables.remove(selectionKey);

    // Redis에서 PENDING 제거
    String selectionKey = createSelectionKey(request.getRestaurantId(), request.getRestaurantTableId(), request.getDate(), request.getTime());
    redisTableSelectionService.deleteTableSelection(selectionKey);

    // 새로 예약되었으므로 예약 캐시 무효화
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    redisTableSelectionService.deleteCachedReservationStatus(request.getRestaurantId(), request.getRestaurantTableId(), timeSlot);

    // 예약 완료 상태 브로드캐스트
    TableStatus tableStatus = new TableStatus();
    tableStatus.setTableId(request.getRestaurantTableId());
    tableStatus.setStatus("RESERVED");
    sendTableStatusUpdate(request.getRestaurantId(), request.getRestaurantTableId(), tableStatus, true, "예약이 완료되었습니다.");
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
//      return reservationService.isTableReserved(restaurantId, restaurantTableId, timeSlot);
      // Redis 캐시 확인
      Boolean cachedResult = redisTableSelectionService.getCachedReservationStatus(restaurantId, restaurantTableId, timeSlot);

      // 캐시 히트인 경우
      if (cachedResult != null) {
        log.debug("예약 확인 (캐시): tableId={}, timeSlot={}, result={}", restaurantTableId, timeSlot, cachedResult);
        return cachedResult;
      }

      // 캐시 미스
       boolean isReserved = reservationService.isTableReserved(restaurantId, restaurantTableId, timeSlot);

      // 결과를 Redis에 캐싱 (10분 TTL)
      redisTableSelectionService.cacheReservationStatus(restaurantId, restaurantTableId, timeSlot, isReserved);

      log.debug("예약 확인 (DB): tableId={}, timeSlot={}, result={}", restaurantTableId, timeSlot, isReserved);
      return isReserved;
    } catch (Exception e) {
      log.error("예약 확인 실패: tableId={}, timeSlot={}", restaurantTableId, timeSlot, e);
      return false;
    }
  }


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

  //
  //  /**
  //   * 테이블 선택 취소 요청
  //   * @author 김예진
  //   * @since 2025-10-02
  //   */
//  @MessageMapping("/restaurant/{restaurantId}/tables/{tableId}/cancel")
//  public void cancelSelectTable(
//      @DestinationVariable Long restaurantId,
//      @DestinationVariable Long tableId,
//      TableSelectionRequest request,
//      SimpMessageHeaderAccessor accessor
//  ){
//    // 세션 아이디 조회
//    String sessionId = accessor.getSessionId();
//    // 선점키 조회
//    String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
//
//    // 기존 선점 정보 확인
//    TableSelectionInfo existSelectionInfo = selectedTables.get(selectionKey);
//
//    // 기존 선점 정보가 없거나 이미 만료됨
//    if (existSelectionInfo == null || isSelectionExpired(existSelectionInfo)){
//      log.debug("취소할 선점 정보가 없습니다.");
//      return;
//    }
//
//    // 본인이 선점한 테이블이 맞는지 확인
//    if (!existSelectionInfo.getSessionId().equals(sessionId)){
//      log.debug("본인이 선점한 테이블이 아닙니다.");
//      return;
//    }
//
//    // 선점 정보 삭제
//    selectedTables.remove(selectionKey);
//    log.debug("테이블 선점 삭제: 테이블 {} 세션 {}", tableId, sessionId);
//
//    // 상태 변경 브로드 캐스트
//    TableStatus tableStatus = new TableStatus();
//    tableStatus.setTableId(tableId);
//    tableStatus.setStatus(String.valueOf(TableSelectStatus.AVAILABLE));
//    tableStatus.setSelectedBy(null);
//    tableStatus.setSelectedAt(null);
//    tableStatus.setExpiryTime(null);
//
//    sendTableStatusUpdate(restaurantId, tableId, tableStatus, true, "테이블 선택이 취소되었습니다.");
//  }
}
