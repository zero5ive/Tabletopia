package com.tabletopia.realtimeservice.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 테이블 선택 응답
 *
 * @author 김예진
 * @since 2025-09-29
 */
@Data
@AllArgsConstructor
public class TableSelectionResult {
  private boolean success;
  private String message;
  private Long tableId;
  private TableSelectionInfo selectionInfo;

  public static TableSelectionResult success(Long tableId, String message, TableSelectionInfo info) {
    return new TableSelectionResult(true, message, tableId, info);
  }

  public static TableSelectionResult failure(Long tableId, String message) {
    return new TableSelectionResult(false, message, tableId, null);
  }
}
