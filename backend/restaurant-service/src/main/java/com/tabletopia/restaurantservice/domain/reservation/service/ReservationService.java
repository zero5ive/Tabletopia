package com.tabletopia.restaurantservice.domain.reservation.service;

import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest.CustomerInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatus;
import com.tabletopia.restaurantservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.restaurantservice.domain.reservation.entity.Reservation;
import com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus;
import com.tabletopia.restaurantservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.restaurantservice.domain.reservation.repository.ReservationRepository;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import com.tabletopia.restaurantservice.domain.reservation.dto.RestaurantSnapshot;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSnapshot;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 예약 서비스
 *
 * @author 김예진
 * @since 2025-09-23
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

  private final ReservationRepository reservationRepository;
  private final RestaurantTableService restaurantTableService;
  private final TableSelectionService tableSelectionService;
  private final UserService userService;

  private final SimpMessagingTemplate messagingTemplate;

  /**
   * 예약 등록 (검증 포함)
   *
   * @param request 예약 요청 정보
   * @param authenticatedEmail JWT에서 추출한 인증된 사용자 이메일
   * @return 생성된 예약 ID
   * @throws IllegalStateException 검증 실패 시
   * @author 김예진
   * @since 2025-10-16
   */
  @Transactional
  public Long createReservationWithValidation(ReservationRequest request, String authenticatedEmail) {
    log.debug("예약 생성 요청 (검증 포함): {}, 인증 이메일: {}", request, authenticatedEmail);

    // 1. 선점 키 생성
    String selectionKey = createSelectionKey(
        request.getRestaurantId(),
        request.getRestaurantTableId(),
        request.getDate(),
        request.getTime()
    );

    // 2. Redis에서 선점 정보 조회
    TableSelectionInfo selection = tableSelectionService.getTableSelection(selectionKey);

    // 3. 검증 로직
    validateReservation(selection, authenticatedEmail);

    // 4. DB에 예약 등록
    Long reservationId = createReservation(request);
    log.debug("예약 등록 완료: ID={}", reservationId);

    // 5. Redis 상태 업데이트 (예약 완료)
    TableSelectionInfo reservedInfo = new TableSelectionInfo(
        request.getRestaurantTableId(),
        selection.getSessionId(),
        authenticatedEmail,
        LocalDateTime.now(),
        LocalDateTime.now().plusHours(24), // 충분히 긴 시간
        TableSelectStatus.RESERVED
    );
    tableSelectionService.saveTableSelection(selectionKey, reservedInfo);

    // 6. 캐시 무효화
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    tableSelectionService.deleteCachedReservationStatus(
        request.getRestaurantId(),
        request.getRestaurantTableId(),
        timeSlot
    );

    // 7. 웹소켓 브로드캐스트
    sendReservationCompletedBroadcast(request);

    return reservationId;
  }

  /**
   * 예약 검증 로직
   *
   * @param selection Redis 선점 정보
   * @param authenticatedEmail JWT에서 추출한 인증된 이메일
   * @throws IllegalStateException 검증 실패 시
   * @author 김예진
   * @since 2025-10-16
   */
  private void validateReservation(TableSelectionInfo selection, String authenticatedEmail) {
    // Redis에 선점 정보가 없음
    if (selection == null) {
      log.warn("선점 정보 없음: 인증 이메일={}", authenticatedEmail);
      throw new IllegalStateException("선점되지 않은 테이블입니다. 테이블을 먼저 선택해주세요.");
    }

    // 선점 만료됨
    if (tableSelectionService.isSelectionExpired(selection)) {
      log.warn("선점 시간 만료: 만료시간={}, 현재시간={}", selection.getExpiryTime(), LocalDateTime.now());
      throw new IllegalStateException("선점 시간이 만료되었습니다. 테이블을 다시 선택해주세요.");
    }

    // 선점자와 예약자가 다름 (보안 체크)
    if (!selection.getEmail().equals(authenticatedEmail)) {
      log.warn("선점자 불일치: 선점자={}, 요청자={}", selection.getEmail(), authenticatedEmail);
      throw new IllegalStateException("본인이 선점한 테이블만 예약할 수 있습니다.");
    }

    // 이미 예약 완료 상태
    if (selection.getStatus() == TableSelectStatus.RESERVED) {
      log.warn("이미 예약 완료됨: 테이블ID={}", selection.getTableId());
      throw new IllegalStateException("이미 예약된 테이블입니다.");
    }

    log.debug("예약 검증 통과: 이메일={}, 테이블ID={}", authenticatedEmail, selection.getTableId());
  }

  /**
   * 예약 완료 브로드캐스트
   *
   * @param request 예약 요청 정보
   * @author 김예진
   * @since 2025-10-16
   */
  private void sendReservationCompletedBroadcast(ReservationRequest request) {
    TableStatus tableStatus = new TableStatus();
    tableStatus.setTableId(request.getRestaurantTableId());
    tableStatus.setStatus(TableSelectStatus.RESERVED);

    messagingTemplate.convertAndSend(
        String.format("/topic/restaurant/%d/tables/status", request.getRestaurantId()),
        tableStatus
    );
    log.debug("예약 완료 브로드캐스트 전송: 레스토랑ID={}, 테이블ID={}",
        request.getRestaurantId(), request.getRestaurantTableId());
  }

  /**
   * 선점 키 생성
   */
  private String createSelectionKey(Long restaurantId, Long tableId, String date, String time) {
    return String.format("%d_%d_%s_%s", restaurantId, tableId, date, time);
  }

  /**
   * 시간대 문자열 생성
   */
  private String formatTimeSlot(String date, String time) {
    return String.format("%sT%s", date, time);
  }

  /**
   * 예약 등록
   *
   * @author 김예진
   * @since 2025-09-24
   */
  private Long createReservation(ReservationRequest request){
    log.debug("예약 생성 요청: {}", request);
    // 요청에서 예약자 정보 꺼내기
    CustomerInfo reservationCustomerInfo = request.getCustomerInfo();

    RestaurantSnapshot restaurantSnapshot = new RestaurantSnapshot(1L, request.getRestaurantName(), request.getRestaurantAddress(),
        request.getRestaurantPhone());
    TableSnapshot tableSnapshot = new TableSnapshot(request.getRestaurantTableNameSnapshot(), request.getPeopleCount());

    Reservation reservation = Reservation.createReservation(
        userService.findByEmail(reservationCustomerInfo.getEmail()).getId(),
        request.getRestaurantId(),
        request.getRestaurantTableId(),
        request.getPeopleCount(),
        request.getReservationDateTime(),
        restaurantSnapshot,
        tableSnapshot
    );

    // 예약 저장
    Reservation saveReservation = reservationRepository.save(reservation);

    return saveReservation.getId();
  }


  /**
   * 테이블이 이미 예약되어있는지 조회
   */
  public boolean isTableReserved(Long restaurantId, Long restaurantTableId, String reservationAt) {
    return reservationRepository
        .findReservationByRestaurantIdAndRestaurantTableIdAndReservationAt(
            restaurantId, restaurantTableId, LocalDateTime.parse(reservationAt)
        ) != null;
  }





  /**
   * 예약 전체 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findAllReservations() {
    return reservationRepository.findAll();
  }

  /**
   * 특정 레스토랑의 예약 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findReservationsByRestaurantId(Long restaurantId) {
    return reservationRepository.findReservationsByRestaurantId(restaurantId);
  }


  /**
   * 레스토랑의 시간대의 예약 목록 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> getReservationsAt(Long restaurantId, LocalDateTime time) {
    return reservationRepository.findReservationsByRestaurantIdAndReservationAt(restaurantId, time);
  }

  /**
   * 특정 시간에 예약 불가능한 테이블 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<UnavailableTableResponse> getUnavailableTablesAt(Long restaurantId, LocalDateTime reservation_at) {
    // 해당 시간에 예약된 테이블들 조회
    List<Reservation> reservations = reservationRepository.findReservationsByRestaurantIdAndReservationAt(
        restaurantId, reservation_at);

    // DTO로 변환
    return reservations.stream()
        .map(UnavailableTableResponse::fromReservation)
        .collect(Collectors.toList());
  }

  /**
   * 레스토랑의 테이블 목록 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<RestaurantTable> getTablesAt(Long restaurantId) {
    List<RestaurantTable> tables;
    try {
      tables = restaurantTableService.getTablesByRestaurant(restaurantId);
      return tables;
    } catch (Exception e) {
      log.error("레스토랑 정보 조회 실패 - restaurantId: {}", restaurantId, e);
      return null;
    }
  }

  /**
   * 예약 내역 상태별 조회
   * 프론트엔드 4개 탭: PENDING(대기중), CONFIRMED(확정), COMPLETED(완료), COMPLETED_GROUP(취소+노쇼)
   *
   * @author 서예닮
   * @since 2025-10-16
   */
  public List<Reservation> getReservations(Long userId, String status) {
    // status가 null이면 전체 조회
    if (status == null || status.isEmpty()) {
      return reservationRepository.findByUserId(userId);
    }

    switch (status.toUpperCase()) {
      case "PENDING":
        return reservationRepository.findByUserIdAndReservationState(userId, ReservationStatus.PENDING);
      case "CONFIRMED":
        return reservationRepository.findByUserIdAndReservationState(userId, ReservationStatus.CONFIRMED);
      case "COMPLETED":
        return reservationRepository.findByUserIdAndReservationState(userId, ReservationStatus.COMPLETED);
      case "COMPLETED_GROUP":  // 취소 + 노쇼 그룹 탭
        return reservationRepository.findByUserIdAndReservationStateIn(
            userId,
            List.of(ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW)
        );
      default:
        return reservationRepository.findByUserId(userId);
    }
  }

}