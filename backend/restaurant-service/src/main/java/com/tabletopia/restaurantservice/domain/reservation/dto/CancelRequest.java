package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.Data;

@Data
public class CancelRequest {
  private Long restaurantId;
  private Long tableId;
  private String date;
  private String time;
}
