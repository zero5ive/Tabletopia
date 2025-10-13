package com.tabletopia.realtimeservice.domain.reservation.controller;

import com.tabletopia.realtimeservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.realtimeservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.dto.ApiResponse;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class ReservationController {
  private final ReservationService reservationService;





  /**
   * 전체 예약 조회
   * @return
   */
  @GetMapping("/reservations")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservations(){
    List<Reservation> reservations = reservationService.findAllReservations();

    return ResponseEntity.ok(ApiResponse.success("예약 전체 조회 성공", reservations));
  }

  /**
   * 특정 레스토랑의 예약 조회
   * @param restaurantId
   * @return
   */
  @GetMapping("/reservations/restaurants/{restaurantId}")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservationsByRestaurantId(@PathVariable Long restaurantId){
    List<Reservation> reservations = reservationService.findReservationsByRestaurantId(restaurantId);

    return ResponseEntity.ok(ApiResponse.success("예약 조회 성공", reservations));
  }

  /**
   * 예약이 불가한 테이블들 조회
      * TODO 예약이 가능한 테이블 조회로 바꾸기
   */
  @GetMapping("/restaurants/{restaurantId}/unavailable-tables")
  public ResponseEntity<ApiResponse<List<UnavailableTableResponse>>> getUnavailableTablesAt(
      @PathVariable Long restaurantId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reservation_at) {

    List<UnavailableTableResponse> unavailableTables = reservationService.getUnavailableTablesAt(restaurantId, reservation_at);

    return ResponseEntity.ok(
        ApiResponse.success("예약 불가능한 테이블 조회 성공", unavailableTables)
    );
  }



 }
