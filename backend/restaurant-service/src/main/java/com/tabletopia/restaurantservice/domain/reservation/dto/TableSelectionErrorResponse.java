package com.tabletopia.restaurantservice.domain.reservation.dto;

/**
 * 테이블 선점 에러 응답
 *
 * @author 김예진
 * @since 2025-10-15
 */
public class TableSelectionErrorResponse {

  /**
   * 성공 여부 (항상 false)
   */
  private final boolean success;

  /**
   * 선점 실패한 테이블 ID
   */
  private final Long tableId;

  /**
   * 사용자에게 보여줄 에러 메시지
   */
  private final String message;

  /**
   * 에러 발생 시각 (밀리초)
   */
  private final long timestamp;

  /**
   * private 생성자
   * @author 김예진
   * @since 2025-10-15
   */
  private TableSelectionErrorResponse(boolean success, Long tableId, String message, long timestamp) {
    this.success = success;
    this.tableId = tableId;
    this.message = message;
    this.timestamp = timestamp;
  }

  /**
   * 에러 응답 생성
   * @author 김예진
   * @since 2025-10-11
   */
  public static TableSelectionErrorResponse of(Long tableId, String message) {
    return new TableSelectionErrorResponse(
        false,
        tableId,
        message,
        System.currentTimeMillis()
    );
  }
}
