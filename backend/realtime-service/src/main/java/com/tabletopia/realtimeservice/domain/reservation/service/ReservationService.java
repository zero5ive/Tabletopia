package com.tabletopia.realtimeservice.domain.reservation.service;

import com.tabletopia.realtimeservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import com.tabletopia.realtimeservice.domain.reservation.repository.ReservationRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

  private final ReservationRepository reservationRepository;

  /**
   * 예약 전체 조회
   *
   * @return
   */
  public List<Reservation> findAllReservations() {
    return reservationRepository.findAll();
  }

  /**
   * 특정 레스토랑의 예약 조회
   */
  public List<Reservation> findReservationsByRestaurantId(Long restaurantId) {
    return reservationRepository.findReservationsByRestaurantId(restaurantId);
  }


  /**
   * 특정 시간대의 예약 목록 조회
   */
  public List<Reservation> getReservationsAt(Long restaurantId, LocalDateTime time) {
    return reservationRepository.findReservationsByRestaurantIdAndReservationAt(restaurantId, time);
  }

  /**
   * 특정 시간에 예약 불가능한 테이블 조회
   */
  public List<UnavailableTableResponse> getUnavailableTablesAt(Long restaurantId, LocalDateTime reservation_at) {
    // 해당 시간에 예약된 테이블들 조회
    List<Reservation> reservations = reservationRepository.findReservationsByRestaurantIdAndReservationAt(restaurantId, reservation_at);

    // DTO로 변환
    return reservations.stream()
        .map(UnavailableTableResponse::fromReservation)
        .collect(Collectors.toList());
  }
}