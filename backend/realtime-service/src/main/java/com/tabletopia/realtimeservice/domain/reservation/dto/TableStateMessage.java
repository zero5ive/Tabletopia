package com.tabletopia.realtimeservice.domain.reservation.dto;

import com.tabletopia.realtimeservice.domain.reservation.enums.TableSelectStatus;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 테이블 상태 변경용 메시지
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Data
@NoArgsConstructor
public class TableStateMessage {
  private Long tableId;
  private String userEmail;
  private String timeSlot;
  private Integer peopleCount;
}
