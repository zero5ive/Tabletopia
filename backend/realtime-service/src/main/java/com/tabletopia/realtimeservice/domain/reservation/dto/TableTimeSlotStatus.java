package com.tabletopia.realtimeservice.domain.reservation.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TableTimeSlotStatus {
  private String timeSlot;
  private String tableId;
  private String tableName;
  private Integer minCapacity;
  private Integer maxCapacity;
  private String status;
  private String sessionId;
  private LocalDateTime selectedAt;
  private LocalDateTime expiryTime;
}