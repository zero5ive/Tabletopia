package com.tabletopia.restaurantservice.domain.reservation.controller;

import com.tabletopia.restaurantservice.domain.reservation.dto.TimeSlotAvailabilityResponse;
import com.tabletopia.restaurantservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.restaurantservice.domain.reservation.entity.Reservation;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.repository.JpaUserRepository;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import com.tabletopia.restaurantservice.dto.ApiResponse;
import com.tabletopia.restaurantservice.util.SecurityUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 예약 컨트롤러
 *
 * @author 김예진
 * @since 2025-09-23
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class ReservationController {

  private final ReservationService reservationService;
  private final UserService userService;

  /**
   * 전체 예약 조회 (관리자용)
   * @return
   */
  @GetMapping("/api/admin/reservations")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservations(){
    List<Reservation> reservations = reservationService.findAllReservations();

    return ResponseEntity.ok(ApiResponse.success("예약 전체 조회 성공", reservations));
  }

  /**
   * 특정 레스토랑의 예약 조회 (관리자용)
   * @param restaurantId
   * @return
   */
  @GetMapping("/api/admin/restaurants/{restaurantId}/reservations")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservationsByRestaurantId(@PathVariable Long restaurantId){
    List<Reservation> reservations = reservationService.findReservationsByRestaurantId(restaurantId);

    return ResponseEntity.ok(ApiResponse.success("예약 조회 성공", reservations));
  }

//  /**
//   * 예약이 불가한 테이블들 조회
//   */
//  @GetMapping("/restaurants/{restaurantId}/unavailable-tables")
//  public ResponseEntity<ApiResponse<List<UnavailableTableResponse>>> getUnavailableTablesAt(
//      @PathVariable Long restaurantId,
//      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reservation_at) {
//
//    List<UnavailableTableResponse> unavailableTables = reservationService.getUnavailableTablesAt(restaurantId, reservation_at);
//
//    return ResponseEntity.ok(
//        ApiResponse.success("예약 불가능한 테이블 조회 성공", unavailableTables)
//    );
//  }

  /**
   * 예약 내역 조회 메서드 (사용자용)
   *
   * @author 서예닮
   * @since 2025-10-16
   */
  @GetMapping("/api/user/reservations/my")
  public ResponseEntity<ApiResponse<List<Reservation>>> getMyReservations(@RequestParam(required = false) String status){
    String currentUserEmail = SecurityUtil.getCurrentUserEmail();
    User user = userService.findByEmail(currentUserEmail);

    List<Reservation> reservationsList= reservationService.getReservations(user.getId(),status);
    return ResponseEntity.ok(
        ApiResponse.success("예약 내역 조회 성공", reservationsList)
    );
  }

  /**
   * 특정 날짜의 타임슬롯별 예약 가능 여부 조회 (사용자용)
   *
   * @param restaurantId 레스토랑 id
   * @param date 요청날짜
   * @return 타임슬롯별 예약가능여부
   * @author 김예진
   * @since 2025-10-17
   */
  @GetMapping("/api/user/restaurants/{restaurantId}/timeslots")
  public ResponseEntity<ApiResponse<TimeSlotAvailabilityResponse>> getAvailableTimeSlots(
      @PathVariable Long restaurantId,
      LocalDate date
  ){
    log.debug("타임슬롯별 예약 가능 여부 조회 api 호출: restaurantId={}, date={}", restaurantId, date);

    TimeSlotAvailabilityResponse response = reservationService.getAvailableTimeSlots(restaurantId, date);

    return ResponseEntity.ok(
        ApiResponse.success("타임슬롯 예약 가능 여부 조회 성공", response)
    );
  }

 }
