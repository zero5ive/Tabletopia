package com.tabletopia.restaurantservice.domain.reservation.exception;

/**
 * 테이블 선점 정보를 찾을 수 없을 때 발생하는 예외
 *
 * @author 김예진
 * @since 2025-12-05
 */
public class TableSelectionNotFoundException extends RuntimeException{
  private static final String DEFAULT_MESSAGE = "테이블 선점 정보를 찾을 수 없습니다.";

  public TableSelectionNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public TableSelectionNotFoundException(String message) {
    super(message);
  }

  public TableSelectionNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public TableSelectionNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
