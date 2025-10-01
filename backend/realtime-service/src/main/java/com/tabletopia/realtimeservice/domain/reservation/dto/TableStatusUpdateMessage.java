package com.tabletopia.realtimeservice.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableStatusUpdateMessage {
  private boolean success;
  private String message;
  private Long tableId;
  private TableStatus tableStatus;
}
