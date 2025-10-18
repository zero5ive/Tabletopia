package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.Data;

/**
 * 예약 상태 변경 요청 DTO
 */
@Data
public class UpdateReservationStatusRequest {
  private String status; // "APPROVED", "CANCELED", "VISITED", "NO_SHOW"
  private String reason; // 취소 사유

}
