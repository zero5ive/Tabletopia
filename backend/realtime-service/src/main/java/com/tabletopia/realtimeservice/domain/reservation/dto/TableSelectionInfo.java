package com.tabletopia.realtimeservice.domain.reservation.dto;

import com.tabletopia.realtimeservice.domain.reservation.enums.TableSelectStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableSelectionInfo {
  private Long tableId;
  private String sessionId;
//  private String userEmail;
  private LocalDateTime selectedAt;
  private LocalDateTime expiryTime;
  private TableSelectStatus status;
}
