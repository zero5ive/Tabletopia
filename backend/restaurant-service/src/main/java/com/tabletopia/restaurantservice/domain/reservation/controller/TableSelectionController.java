package com.tabletopia.restaurantservice.domain.reservation.controller;

import com.tabletopia.restaurantservice.domain.payment.dto.PaymentSuccessDTO;
import com.tabletopia.restaurantservice.domain.reservation.dto.ConnectionMessage;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.SessionInfoResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionErrorResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatus;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatusRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatusResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatusUpdateMessage;
import com.tabletopia.restaurantservice.domain.reservation.dto.UserConnectedResponse;
import com.tabletopia.restaurantservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.restaurantservice.domain.reservation.service.TableSelectionService;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import com.tabletopia.restaurantservice.domain.user.dto.UserInfoDTO;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 실시간 테이블 선택 웹소켓 컨트롤러 테이블 선택 시 실시간으로 상태 변경 (빨간불/초록불)
 *
 * @author 김예진
 * @since 2025-09-26
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class TableSelectionController {

  private final SimpMessagingTemplate messagingTemplate;

  private final ReservationService reservationService;
  private final TableSelectionService tableSelectionService;
  private final RestaurantTableService restaurantTableService;
  private final UserService userService;

  // =============== 테이블 실시간 선택 로직 =============== //

  /**
   * 레스토랑 테이블 예약 접속 처리
   *
   * @param restaurantId 레스토랑 id
   * @param accessor     STOMP 헤더 접근자
   * @param message      접속 메시지
   * @author 김예진
   * @since 2025-09-25
   */
  @MessageMapping("/reservation/{restaurantId}/connect")
  public void connectToReservation(
      @DestinationVariable Long restaurantId,
      SimpMessageHeaderAccessor accessor,
      ConnectionMessage message) {

    String sessionId = accessor.getSessionId();

    // 사용자 이메일을 저장할 변수 초기화
    String userEmail = getUserEmail(accessor, sessionId);

    log.debug("레스토랑 {} 접속 요청: 사용자 {} 세션 {}", restaurantId, userEmail, sessionId);

    // Redis에 접속자 추가
    tableSelectionService.addConnectedUser(restaurantId, userEmail, sessionId);

    // TODO 프론트엔드에 수신이 안되어, 현재는 처음 받는 브로드 캐스트의 세션 id를 자신의 세션 id로 저장하게 해놓았음
    // 1. 개별 사용자에게만 자신의 세션 ID 전송 (개인 메시지)
    messagingTemplate.convertAndSendToUser(
        sessionId,
        "/queue/session-info",
        SessionInfoResponse.of(sessionId)
    );

    // Redis에서 접속자 목록 조회
    Set<Object> connectedUsers = tableSelectionService.getConnectedUsers(restaurantId);
    Set<String> connectedUserIds = connectedUsers.stream()
        .map(Object::toString)
        .collect(Collectors.toSet());

    // 2. 모든 사용자에게 새 접속자 알림 (브로드캐스트)
    messagingTemplate.convertAndSend(
        String.format("/topic/reservation/%d/table-status", restaurantId),
//        UserConnectedResponse.of(sessionId, connectedUsers.get(restaurantId))
        UserConnectedResponse.of(sessionId, userEmail, connectedUserIds)
    );

    log.debug("이메일 {} 세션 {} 정보 전송 완료 (접속자 수: {})", userEmail, sessionId, connectedUserIds.size());
  }

  /**
   * 웹소켓 세션에서 인증 정보를 확인하고 사용자의 email을 받아오는 메서드
   *
   * @param accessor
   * @param sessionId
   * @return
   * @author 김예진
   * @since 2025-10-16
   */
  @Nullable
  private static String getUserEmail(SimpMessageHeaderAccessor accessor, String sessionId) {
    String userEmail = null;

    // WebSocket 세션에서 인증 정보 확인
    if (accessor.getUser() != null) {
      // User 객체의 getName()은 일반적으로 username(이메일)을 반환
      // CONNECT 시 setUser()로 설정한 Authentication 객체가 반환됨
      userEmail = accessor.getUser().getName();
      log.debug("WebSocket 세션에서 인증 정보 확인: 이메일 {}", userEmail);
    } else {
      // 인증 정보가 없는 경우 (JWT 토큰이 없거나 유효하지 않은 경우)
      log.warn("WebSocket 세션에 인증 정보가 없습니다. 세션 ID: {}", sessionId);
      // 이 경우 userEmail은 null로 남음
    }
    return userEmail;
  }

  /**
   * 테이블 선택 요청 사용자가 선택한 레스토랑의 특정 테이블을 선점
   *
   * @param restaurantId 레스토랑 ID
   * @param tableId      테이블 ID
   * @param request      예약 요청 정보 (날짜, 시간 등)
   * @param accessor     WebSocket 세션 정보 접근자
   * @author 김예진
   * @since 2025-09-29
   */
  @MessageMapping("/restaurant/{restaurantId}/tables/{tableId}/select")
  public void selectTable(
      @DestinationVariable Long restaurantId,
      @DestinationVariable Long tableId,
      TableSelectionRequest request,
      SimpMessageHeaderAccessor accessor // 헤더 접근
  ) {
    // 웹소켓 세션 ID 추출
    String sessionId = accessor.getSessionId();

    String userEmail = getUserEmail(accessor, sessionId);

    // 선점 키 생성
    String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(),
        request.getTime());
    log.debug("생성된 선점키 {}", selectionKey);

    // 1. 이미 예약이 완료된 테이블인지 확인
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    if (isTableReserved(restaurantId, tableId, timeSlot)) {
      log.debug("테이블 {} 이미 예약됨", tableId);

      // 해당 사용자에게 에러 메시지 전송
      sendTableSelectionError(sessionId, tableId, "이미 예약된 테이블입니다.");
      return;
    }

    // 2. 선점 정보 생성
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime expiryTime = now.plusMinutes(5);

    // 테이블 선점 정보 생성
    TableSelectionInfo selectionInfo = new TableSelectionInfo(
        tableId,
        sessionId,
        userEmail,
        now,
        expiryTime, // 만료시간: +5분
        TableSelectStatus.PENDING // 결제 대기 상태 부여
    );

    // 3. Redis에 원자적으로 선점 시도
    // SETNX 방식으로 동시에 여러 사용자가 선택해도 한 명만 성공하도록
    boolean success = tableSelectionService.trySelectTable(selectionKey, selectionInfo);

    if (success) {
      // 3-1. 선점 성공
      // 3-1-1. 실제 예약 여부 재확인
      if (isTableReserved(restaurantId, tableId, timeSlot)) {
        // 이미 예약된 테이블이므로 선점 정보를 삭제하여 선점 롤백
        tableSelectionService.deleteTableSelection(selectionKey);
        log.debug("선점 후 예약 확인 - 이미 예약된 테이블이므로 선점 롤백: 테이블 {}", tableId);
        sendTableSelectionError(sessionId, tableId, "이미 예약된 테이블입니다.");
        return;
      }
      // 3-1-2. 선점 정상 성공
      log.debug("테이블 선점 성공: 테이블 {}, 세션 {}, 사용자 {}, 만료시간 {}", tableId, sessionId, userEmail,
          selectionInfo.getExpiryTime());

      // 모든 클라이언트에게 보낼 테이블 상태 정보 생성
      TableStatus updatedTableStatus = new TableStatus();
      updatedTableStatus.setTableId(tableId);
      updatedTableStatus.setStatus(TableSelectStatus.PENDING); // 결제 대기 중 (선점 상태)
      updatedTableStatus.setSelectedBy(sessionId);
      updatedTableStatus.setUserEmail(userEmail);
      updatedTableStatus.setSelectedAt(now);
      updatedTableStatus.setExpiryTime(expiryTime);

      // 모든 클라이언트들에 상태 변경을 브로드 캐스트
      sendTableStatusUpdate(restaurantId, tableId, updatedTableStatus, true, "테이블이 선택되었습니다.");
    } else {
      // 3-2. 선점 실패
      log.debug("테이블 선점 실패: 테이블 {}, 세션 {}", tableId, sessionId);

      // 선점 실패한 사용자에게만 에러 메시지 전송
      sendTableSelectionError(sessionId, tableId, "다른 사용자가 먼저 선택 중인 테이블입니다.");
    }
  }

  /**
   * 특정 시간대의 테이블 상태 조회 테이블 선택 팝업이 열릴 때 호출
   *
   * @param restaurantId 레스토랑 ID
   * @param request      날짜, 시간 정보
   * @return 각 테이블의 현재 상태 (초록불/빨간불)
   * @author 김예진
   * @since 2025-09-25
   */
  @MessageMapping("/restaurant/{restaurantId}/tables/status")
  @SendTo("/topic/restaurant/{restaurantId}/tables/status")
  public TableStatusResponse getTableStatus(
      @DestinationVariable Long restaurantId,
      TableStatusRequest request) {
    log.debug("테이블 상태 조회: 레스토랑 {}, 날짜 {}, 시간 {}", restaurantId, request.getDate(),
        request.getTime());

    try {
      // 레스토랑 테이블 목록 조회
      List<RestaurantTable> tables = restaurantTableService.getTablesByRestaurant(restaurantId);

      // 테이블 및 선점 상태를 저장할 배열
      List<TableStatus> tableStatuses = new ArrayList<>();

      // 사용자가 예약하려는 시간대 생성
      String timeSlot = formatTimeSlot(request.getDate(), request.getTime());

      // 각 테이블별 상태 확인
      for (RestaurantTable table : tables) {
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

        // Redis에서 테이블 상태 판단
        String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(),
            request.getTime());
        TableSelectionInfo selection = tableSelectionService.getTableSelection(selectionKey);

        if (selection != null && !tableSelectionService.isSelectionExpired(selection)) {
          // Redis에 선점 정보가 있고, 만료되지 않음
          if (selection.getStatus() == TableSelectStatus.RESERVED) {
            // 예약 완료된 상태
            status.setStatus(TableSelectStatus.RESERVED);
          } else {
            // 다른 사용자가 임시 선점한 상태 (PENDING)
            status.setStatus(TableSelectStatus.PENDING);
            status.setUserEmail(selection.getEmail());
            status.setSelectedAt(selection.getSelectedAt());
            status.setExpiryTime(selection.getExpiryTime());
          }
        } else if (isTableReserved(restaurantId, tableId, timeSlot)) {
          // Redis에는 없고 DB에만 있는 경우
          status.setStatus(TableSelectStatus.RESERVED);
        } else {
          // 선택 가능한 상태
          status.setStatus(TableSelectStatus.AVAILABLE);
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
   * 예약 등록 (사용자용)
   *
   * @param request   예약 요청 정보
   * @param principal JWT 인증 정보 (Spring Security)
   * @return 예약 결과
   * @author 김예진
   * @since 2025-09-24
   */
  @PostMapping("/api/user/reservations")
  @ResponseBody
  public Map<String, Object> registerReservation(
      @RequestBody ReservationRequest request,
      Principal principal) {
    log.debug("예약 등록 요청: {}", request);
//    tableSelectionService.sendReservationInfo(request);
    return tableSelectionService.registerReservation(request,principal);
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
   * 실제 예약 여부 확인
   */
  private boolean isTableReserved(Long restaurantId, Long restaurantTableId, String timeSlot) {
    try {
      // Redis 캐시 확인
      Boolean cachedResult = tableSelectionService.getCachedReservationStatus(restaurantId,
          restaurantTableId, timeSlot);

      // 캐시 히트인 경우
      if (cachedResult != null) {
        log.debug("예약 확인 (캐시): tableId={}, timeSlot={}, result={}", restaurantTableId, timeSlot,
            cachedResult);
        return cachedResult;
      }

      // 캐시 미스
      boolean isReserved = reservationService.isTableReserved(restaurantId, restaurantTableId,
          timeSlot);

      // 결과를 Redis에 캐싱 (10분 TTL)
      tableSelectionService.cacheReservationStatus(restaurantId, restaurantTableId, timeSlot,
          isReserved);

      log.debug("예약 확인 (DB): tableId={}, timeSlot={}, result={}", restaurantTableId, timeSlot,
          isReserved);
      return isReserved;
    } catch (Exception e) {
      log.error("예약 확인 실패: tableId={}, timeSlot={}", restaurantTableId, timeSlot, e);
      return false;
    }
  }

  /**
   * 테이블 상태 업데이트 전송
   *
   * @author 김예진
   * @since 2025-10-01
   */
  private void sendTableStatusUpdate(Long restaurantId, Long tableId, TableStatus tableStatus,
      boolean success, String message) {

    TableStatusUpdateMessage updateMessage = new TableStatusUpdateMessage(
        success, message, tableId, tableStatus
    );

    messagingTemplate.convertAndSend(
        "/topic/restaurant/" + restaurantId + "/tables/status",
        updateMessage
    );
  }

  /**
   * 특정 사용자에게만 에러 메시지 전송
   *
   * @param sessionId 에러를 받을 사용자의 세션 ID
   * @param tableId   선점 실패한 테이블 ID
   * @param message   에러 메시지
   * @author 김예진
   * @since 2025-10-11
   */
  private void sendTableSelectionError(String sessionId, Long tableId, String message) {
    TableSelectionErrorResponse response = TableSelectionErrorResponse.of(tableId, message);
    messagingTemplate.convertAndSendToUser( // 특정 사용자에게만 메시지 전송
        sessionId, // 해당 세션 id의 사용자에게만 전송
        "/queue/errors", // 에러 전용 큐
        response
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
