package com.tabletopia.realtimeservice.domain.reservation.dto;

import lombok.Data;

@Data
public class TableStatusRequest {

  private String date; // "2025-09-26"
  private String time; // "18:00"
}
