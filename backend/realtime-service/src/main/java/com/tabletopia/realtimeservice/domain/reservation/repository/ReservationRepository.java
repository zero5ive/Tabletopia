package com.tabletopia.realtimeservice.domain.reservation.repository;

import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 예약 리포지토리
 *
 * @author 김예진
 * @since 2025-09-23
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  /**
   * 특정 레스토랑의 예약 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findReservationsByRestaurantId(Long restaurantId);

  /**
   * 특정 레스토랑의 특정 예약일시의 예약 목록 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findReservationsByRestaurantIdAndReservationAt(Long restaurantId, LocalDateTime reservationAt);
}
