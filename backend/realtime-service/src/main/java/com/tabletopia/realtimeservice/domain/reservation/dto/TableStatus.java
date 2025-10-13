package com.tabletopia.realtimeservice.domain.reservation.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 테이블의 정보와 선점 정보를 담는 DTO
 *
 * @author 김예진
 * @since 2025-09-26
 */
@Data
public class TableStatus {
  private Long tableId;
  private String tableName;
  private Integer minCapacity;
  private Integer maxCapacity;
  private Integer xPosition;
  private Integer yPosition;
  private String shape;
  private String status; // "AVAILABLE", "SELECTED", "RESERVED", "OCCUPIED"
  private String selectedBy; // 선점한 사용자 ID
  private LocalDateTime selectedAt; // 선택 시작 시각
  private LocalDateTime expiryTime; // 만료 시각
}
