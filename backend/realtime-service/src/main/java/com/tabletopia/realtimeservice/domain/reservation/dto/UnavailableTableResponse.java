package com.tabletopia.realtimeservice.domain.reservation.dto;

import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

/**
 * 예약 불가능한 테이블 응답 DTO
 *
 * @author 김예진
 * @since 2025-09-22
 */
@Getter
@Builder
public class UnavailableTableResponse {
  private Long tableId;

  /**
   * 이미 예약된 테이블 응답 생성
   * Reservation으로부터 UnavailableTable 응답 생성
   */
  public static UnavailableTableResponse fromReservation(Reservation reservation) {
    return UnavailableTableResponse.builder()
        .tableId(reservation.getRestaurantTableId())
        .build();
  }
}
