package com.tabletopia.restaurantservice.domain.reservation.service;

import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest.CustomerInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.RestaurantSnapshot;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableSnapshot;
import com.tabletopia.restaurantservice.domain.reservation.dto.TableStatus;
import com.tabletopia.restaurantservice.domain.reservation.dto.TimeSlotAvailabilityResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.TimeSlotAvailabilityResponse.TimeSlotInfo;
import com.tabletopia.restaurantservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.UpdateReservationStatusRequest;
import com.tabletopia.restaurantservice.domain.reservation.entity.Reservation;
import com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus;
import com.tabletopia.restaurantservice.domain.reservation.enums.TableSelectStatus;
import com.tabletopia.restaurantservice.domain.reservation.exception.InvalidReservationStatusException;
import com.tabletopia.restaurantservice.domain.reservation.exception.ReservationNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.exception.TableSelectionNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.exception.UnauthorizedReservationAccessException;
import com.tabletopia.restaurantservice.domain.reservation.repository.ReservationRepository;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantEffectiveHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.service.RestaurantOpeningHourService;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
  private final RestaurantOpeningHourService openingHourService;

  private final SimpMessagingTemplate messagingTemplate;

  /**
   * 예약 등록 (검증 포함)
   *
   * @param request            예약 요청 정보
   * @param authenticatedEmail JWT에서 추출한 인증된 사용자 이메일
   * @return 생성된 예약 ID
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
    Reservation savedReservation = createReservation(request);
    log.debug("예약 등록 완료: ID={}", savedReservation.getId());

    // 6. Redis 상태 업데이트 (예약 완료)
    TableSelectionInfo reservedInfo = new TableSelectionInfo(
        request.getRestaurantTableId(),
        selection.getSessionId(),
        authenticatedEmail,
        LocalDateTime.now(),
        LocalDateTime.now().plusHours(24), // 충분히 긴 시간
        TableSelectStatus.RESERVED
    );
    tableSelectionService.saveTableSelection(selectionKey, reservedInfo);

    // 7. 캐시 무효화
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    tableSelectionService.deleteCachedReservationStatus(
        request.getRestaurantId(),
        request.getRestaurantTableId(),
        timeSlot
    );

    // 8. 웹소켓 브로드캐스트
    sendReservationCompletedBroadcast(request);

    return savedReservation.getId();
  }

  /**
   * 예약 검증 로직
   *
   * @param selection Redis 선점 정보
   * @param authenticatedEmail JWT에서 추출한 인증된 이메일
   * @throws TableSelectionNotFoundException 테이블 선점 정보를 찾을 수 없을 때
   * @throws InvalidReservationStatusException 예약이 유효하지 않은 상태일 때
   * @throws UnauthorizedReservationAccessException 예약 상태를 변경할 권한이 없을 때
   * @author 김예진
   * @since 2025-10-16
   */
  private void validateReservation(TableSelectionInfo selection, String authenticatedEmail) {
    // Redis에 선점 정보가 없는 경우
    if (selection == null) {
      log.warn("선점 정보 없음: 인증 이메일={}", authenticatedEmail);
      // 데이터 없음 예외 발생
      throw new TableSelectionNotFoundException();
    }

    // 선점 시간이 만료되었을 경우
    if (tableSelectionService.isSelectionExpired(selection)) {
      log.warn("선점 시간 만료: 만료 시간={}, 현재 시간={}", selection.getExpiryTime(), LocalDateTime.now());
      // 유효하지 않은 상태 예외 발생
      throw new InvalidReservationStatusException("선점 시간이 만료되었습니다. 테이블을 다시 선택해주세요.");
    }

    // 선점자와 예약자가 다른 경우 (보안 체크)
    if (!selection.getEmail().equals(authenticatedEmail)) {
      log.warn("선점자 불일치: 선점자={}, 요청자={}", selection.getEmail(), authenticatedEmail);
      // 권한 없음 예외 발생
      throw new UnauthorizedReservationAccessException("본인이 선점한 테이블만 예약할 수 있습니다.");
    }

    // 이미 예약 완료 상태인 경우
    if (selection.getStatus() == TableSelectStatus.RESERVED) {
      log.warn("이미 예약 완료됨: 테이블ID={}", selection.getTableId());
      // 유효하지 않은 상태 예외 발생
      throw new InvalidReservationStatusException("이미 예약된 테이블입니다.");
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

    // 1. 테이블 상태 업데이트 브로드캐스트 (모든 사용자 + 관리자)
    messagingTemplate.convertAndSend(
        String.format("/topic/restaurant/%d/tables/status", request.getRestaurantId()),
        tableStatus
    );

    // 2. 관리자에게 새 예약 알림 전송
    messagingTemplate.convertAndSend(
        String.format("/topic/restaurant/%d/tables/status", request.getRestaurantId()),
        Map.of(
            "type", "NEW_RESERVATION",
            "restaurantId", request.getRestaurantId(),
            "tableId", request.getRestaurantTableId(),
            "tableName", request.getRestaurantTableNameSnapshot(),
            "customerName", request.getCustomerInfo().getName(),
            "peopleCount", request.getPeopleCount(),
            "reservationDate", request.getDate(),
            "reservationTime", request.getTime(),
            "message", "새로운 예약이 들어왔습니다!"
        )
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
  public Reservation createReservation(ReservationRequest request) {
    log.debug("예약 생성 요청: {}", request);
    // 요청에서 예약자 정보 꺼내기
    CustomerInfo reservationCustomerInfo = request.getCustomerInfo();

    TableSnapshot tableSnapshot = new TableSnapshot(request.getRestaurantTableNameSnapshot(), request.getPeopleCount());

// 사용자 ID 조회
    Long userId = userService.findByEmail(reservationCustomerInfo.getEmail()).getId();

// Reservation 엔티티 생성
    Reservation reservation = Reservation.fromRequest(
        userId,
        request,
        tableSnapshot.getRestaurantTableCapacity()
    );

    // 예약 저장
    return reservationRepository.save(reservation);
  }

  /**
   * 결제 완료 후 예약 등록 (Payment 포함)
   *
   * @param request 예약 요청 정보
   * @param payment 결제 정보
   * @param authenticatedEmail 인증된 이메일
   * @return 생성된 예약 ID
   * @author 김예진
   * @since 2025-10-19
   */
  @Transactional
  public Long createReservationWithPayment(ReservationRequest request, Payment payment, String authenticatedEmail) {
    log.debug("예약 생성 요청 (Payment 포함): {}, payment_id={}", request, payment.getId());

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

    // 4. 사용자 ID 조회
    Long userId = userService.findByEmail(authenticatedEmail).getId();

    // 5. Reservation 엔티티 생성
    TableSnapshot tableSnapshot = new TableSnapshot(request.getRestaurantTableNameSnapshot(), request.getPeopleCount());
    Reservation reservation = Reservation.fromRequest(
            userId,
            request,
            tableSnapshot.getRestaurantTableCapacity()
    );

    // 6. Payment 설정
    reservation.setPayment(payment);

    // 7. DB에 예약 등록
    Reservation savedReservation = reservationRepository.save(reservation);
    log.debug("예약 등록 완료: ID={}, payment_id={}", savedReservation.getId(), payment.getId());

    // 8. Redis 상태 업데이트 (예약 완료)
    TableSelectionInfo reservedInfo = new TableSelectionInfo(
            request.getRestaurantTableId(),
            selection.getSessionId(),
            authenticatedEmail,
            LocalDateTime.now(),
            LocalDateTime.now().plusHours(24),
            TableSelectStatus.RESERVED
    );
    tableSelectionService.saveTableSelection(selectionKey, reservedInfo);

    // 9. 캐시 무효화
    String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
    tableSelectionService.deleteCachedReservationStatus(
            request.getRestaurantId(),
            request.getRestaurantTableId(),
            timeSlot
    );

    // 10. 웹소켓 브로드캐스트
    sendReservationCompletedBroadcast(request);

    return savedReservation.getId();
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
   * 예약 내역 상태별 조회 프론트엔드 4개 탭: PENDING(대기중), CONFIRMED(확정), COMPLETED(완료), COMPLETED_GROUP(취소+노쇼)
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

  /**
   * 특정 날짜의 타임슬롯별 예약 가능 여부 조회 각 타임슬롯마다 예약 가능한 테이블이 1개라도 있으면 예약 가능으로 프론트엔드에서 표시하기 위한 메서드
   *
   * @param restaurantId 레스토랑 아이디
   * @param date         조회날짜
   * @return 타임슬롯별 예약 가능 여부
   * @author 김예진
   * @since 2025-10-17
   */
  public TimeSlotAvailabilityResponse getAvailableTimeSlots(Long restaurantId, LocalDate date) {
    // 운영시간 조회
    RestaurantEffectiveHourResponse effectiveHour = openingHourService.getEffectiveHour(restaurantId, date);

    // 휴무일인 경우 빈 타임슬롯 반환
    if (effectiveHour.isClosed()) {
      return TimeSlotAvailabilityResponse.builder()
          .restaurantId(restaurantId)
          .date(date)
          .isOpen(false)
          .timeSlots(List.of())
          .build();
    }

    // 레스토랑의 모든 테이블 조회
    List<RestaurantTable> tables = restaurantTableService.getTablesByRestaurant(restaurantId);

    // 타임슬롯 생성
    List<LocalTime> timeSlots = generateTimeSlot(effectiveHour);

    // 타임슬롯 별 예약 가능 여부 확인
    List<TimeSlotInfo> timeSlotInfoList = timeSlots.stream()
        .map(timeSlot -> {
          // 예약 일시 포맷팅
          // date(LocalDate)와 timeSlot(LocalTime)을 넣어서 reservationDateTime(LocalDateTime)으로 포맷팅
          LocalDateTime reservationDateTime = LocalDateTime.of(date, timeSlot);

          // 해당 일시에 예약된 테이블 id 목록
          List<Long> reservedTablesIds = reservationRepository
              .findReservationsByRestaurantIdAndReservationAt(restaurantId, reservationDateTime)
              .stream()
              .map(Reservation::getRestaurantTableId)
              .toList();

          // 예약 가능한 테이블 수 계산
          int avaliableTableCount = tables.size() - reservedTablesIds.size();

          // 타임슬롯 정보 객체 반환
          return TimeSlotInfo.builder()
              .time(timeSlot.toString()) // 11:00 형식
              .isAvailable(avaliableTableCount > 0) // 0보다 크면 true, 아니면 false
              .availableTableCount(avaliableTableCount) // 예약 가능 테이블 수
              .build();
        }).toList();

    return TimeSlotAvailabilityResponse.builder()
        .date(date)
        .restaurantId(restaurantId)
        .isOpen(true)
        .openTime(effectiveHour.getOpenTime())
        .closeTime(effectiveHour.getCloseTime())
        .timeSlots(timeSlotInfoList)
        .reservationInterval(effectiveHour.getReservationInterval())
        .build();
  }

  /**
   * 타임슬롯을 생성하는 메서드
   * TODO 레스토랑 예약시간 클래스로 이동
   *
   * @param effectiveHour 실제 영업시간 정보
   * @return 타임슬롯
   * @author 김예진
   * @since 2025-10-17
   */
  public List<LocalTime> generateTimeSlot(RestaurantEffectiveHourResponse effectiveHour) {
    // 영업시간 정보 추출
    LocalTime openTime = effectiveHour.getOpenTime();
    LocalTime closeTime = effectiveHour.getCloseTime();
    Integer reservationInterval = effectiveHour.getReservationInterval();

    // 타임슬롯 생성
    List<LocalTime> slots = new ArrayList<>();
    LocalTime currentTime = openTime;
    while (currentTime.isBefore(closeTime)) {
      slots.add(currentTime);
      currentTime = currentTime.plusMinutes(reservationInterval);
    }

    return slots;
  }


  /**
   * 예약 상태를 변경
   *
   * @param restaurantId 레스토랑 ID
   * @param reservationId 예약 ID
   * @param request 상태 변경 요청 정보
   * @throws ReservationNotFoundException 해당 ID의 예약을 찾을 수 없는 경우
   * @throws UnauthorizedReservationAccessException 예약을 변경할 권한이 없는 경우
   * @author 김예진
   */
  @Transactional
  public void updateReservationStatus(
      Long restaurantId,
      Long reservationId,
      UpdateReservationStatusRequest request) {
    // 1. 예약 조회
    Reservation reservation = reservationRepository.findById(reservationId)
        // 존재하지 않는 예약일 경우 데이터 없음 예외 발생
        .orElseThrow(ReservationNotFoundException::new);

    // 2. 레스토랑 ID 검증
    // 예약 상태를 변경하고자하는 레스토랑이 알맞은지 확인
    if (!reservation.getRestaurantId().equals(restaurantId)) {
      // 요청된 레스토랑 ID와 예약 객체의 레스토랑 ID가 불일치하면 권한 없음 예외 발생
      throw new UnauthorizedReservationAccessException();
    }

    // 3. 상태 변경 전 웹소켓 알림용 정보 저장
    Long tableId = reservation.getRestaurantTableId();
    LocalDateTime reservationAt = reservation.getReservationAt();

    // 4. 상태 변경
    String status = request.getStatus();
    switch (status) {
      case "APPROVED":
        // PENDING -> CONFIRMED
        reservation.confirmReservation();
        break;

      case "CANCELED":
        // PENDING/CONFIRMED -> CANCELLED
        reservation.cancelReservation(request.getReason());
        break;

      case "VISITED":
        // CONFIRMED -> COMPLETED
        reservation.completeReservation();
        break;

      case "NO_SHOW":
        // CONFIRMED -> NO_SHOW
        reservation.markAsNoShow();
        break;

      default:
        throw new InvalidReservationStatusException();
    }

    // 5. 저장 (JPA dirty checking으로 자동 저장되지만 명시적으로 호출 가능)
    reservationRepository.save(reservation);

    // 6. Redis 캐시 무효화
    // 예약 취소 시 해당 시간대의 좌석을 다시 예약 가능하게 하도록
    if (status.equals("CANCELED")) {
      String timeSlot = formatTimeSlot(reservationAt);
      tableSelectionService.deleteCachedReservationStatus(reservationId, tableId, timeSlot);
      log.debug("취소로 예약 캐시 무효화: restaurantId={}, tableId={}, timeSlot={}", restaurantId, tableId, timeSlot);
    }

    // 7. 웹소켓으로 사용자들에게 테이블 상태 변경 알림
    notifyTableStatusChange(restaurantId, tableId, reservationAt, reservation.getReservationState());
  }

  /**
   * 예약 상태 변경을 웹소켓으로 알림
   * @param restaurantId 레스토랑 id
   * @param tableId 테이블 id
   * @param reservationAt 예약 시간
   * @param newStatus 변경된 상태
   */
  private void notifyTableStatusChange(Long restaurantId, Long tableId, LocalDateTime reservationAt, ReservationStatus newStatus) {
    try{
    TableStatus tableStatus = new TableStatus();
    tableStatus.setTableId(tableId);

    if (newStatus == ReservationStatus.CANCELLED) {
      tableStatus.setStatus(TableSelectStatus.AVAILABLE);
    }

    // 웹소켓 메시지 발송
    messagingTemplate.convertAndSend(
        String.format("/topic/restaurant/%d/tables/status", restaurantId),
        Map.of(
            "success", true,
            "message", "예약 상태 변경",
            "tableId", tableId,
            "tableStatus", tableStatus
        )
    );

    log.debug("테이블 상태 변경 알림 발송: restaurantId={}, tableId = {}, newStatus = {}", restaurantId, tableId, newStatus);
  } catch(Exception e) {
      log.error("테이블 상태 변경 알림 발송 실패: restaurantId={}, tableId = {}", restaurantId, tableId, e);
        // 웹소켓 알림 실패해도 예약 상태 변경은 성공으로 처리
  }
  }

  /**
   * 사용자가 자신의 예약을 취소
   * <p>
   * 1. 예약 존재 여부 검증
   * 2. 본인 예약 여부(권한) 검증
   * 3. 취소 가능 상태(PENDING, CONFIRMED) 검증
   * 4. DB 예약 상태 변경 (-> CANCELLED)
   * 5. Redis 타임슬롯 선점 캐시 무효화 (다른 사용자가 예약 가능하도록 처리)
   * 6. WebSocket을 통해 실시간으로 테이블 상태 변경 알림 전송 (AVAILABLE)
   * @param reservationId 예약 ID
   * @param userId 사용자 ID
   * @author 김예진
   * @since 2025-10-20
   */
  @Transactional
  public void cancelReservationByUser(Long reservationId, Long userId) {
    // 1. 예약 조회
    Reservation reservation = reservationRepository.findById(reservationId)
        // 조회되지 않을 경우 데이터 없음 예외
        .orElseThrow(ReservationNotFoundException::new);

    // 2. 본인의 예약인지 검증
    if (!reservation.getUserId().equals(userId)) {
      // 아닐 경우 권한 없음 예외
      throw new UnauthorizedReservationAccessException();
    }

    // 3. 취소 가능한 상태인지 검증 (PENDING 또는 CONFIRMED만 취소 가능)
    if (reservation.getReservationState() != ReservationStatus.PENDING &&
        reservation.getReservationState() != ReservationStatus.CONFIRMED) {
      throw new InvalidReservationStatusException("취소할 수 없는 예약 상태입니다.");
    }

    // 4. 상태 변경 전 웹소켓 알림용 정보 저장
    Long restaurantId = reservation.getRestaurantId();
    Long tableId = reservation.getRestaurantTableId();
    LocalDateTime reservationAt = reservation.getReservationAt();

    // 5. 예약 취소
    reservation.cancelReservation("사용자 취소");

    // 6. 저장
    reservationRepository.save(reservation);

    // 7. Redis 캐시 무효화
    String timeSlot = formatTimeSlot(reservationAt);
    tableSelectionService.deleteCachedReservationStatus(restaurantId, tableId, timeSlot);

    // 8. 웹소켓 브로드캐스트 (테이블 상태를 AVAILABLE로 변경)
    try {
      messagingTemplate.convertAndSend(
          String.format("/topic/restaurant/%d/tables/status", restaurantId),
          Map.of(
              "success", true,
              "message", "예약 취소",
              "tableId", tableId,
              "status", "AVAILABLE",
              "date", reservationAt.toLocalDate().toString(),
              "time", reservationAt.toLocalTime().toString().substring(0, 5)
          )
      );

      log.debug("테이블 상태 변경 알림 발송: restaurantId={}, tableId={}, status=AVAILABLE", restaurantId, tableId);
    } catch (Exception e) {
      log.error("테이블 상태 변경 알림 발송 실패: restaurantId={}, tableId={}", restaurantId, tableId, e);
      // 웹소켓 알림 실패해도 예약 취소는 성공으로 처리
    }
  }

  /**
 * LocalDateTime을 "yyyy-MM-ddTHH:mm" 형식으로 변환
 *
 * @param dateTime
 * @return yyyy-MM-ddTHH:mm
 * @author 김예진
 * @since 2025-10-18
 */
private String formatTimeSlot(LocalDateTime dateTime) {
  return dateTime.toString().substring(0, 16);
}

}
