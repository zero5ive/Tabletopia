package com.tabletopia.realtimeservice.domain.reservation.repository;

import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

  /**
   * 특정 레스토랑의 예약 조회
   */
  public List<Reservation> findReservationsByRestaurantId(Long restaurantId);

  /**
   * 특정 레스토랑의 특정 예약일시의 예약 목록 조회
   */
  public List<Reservation> findReservationsByRestaurantIdAndReservationAt(Long restaurantId, LocalDateTime reservation_at);
}
