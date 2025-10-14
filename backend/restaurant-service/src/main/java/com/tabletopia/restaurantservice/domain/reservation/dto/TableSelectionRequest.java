package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.Data;

/**
 * 예약을 하고자하는 정보 dto
 *
 * @author 김예진
 * @since 2025-09-26
 */
@Data
public class TableSelectionRequest {
  private String userEmail;
  private String userName;
  private int peopleCount;
  private String date;
  private String time;
}
