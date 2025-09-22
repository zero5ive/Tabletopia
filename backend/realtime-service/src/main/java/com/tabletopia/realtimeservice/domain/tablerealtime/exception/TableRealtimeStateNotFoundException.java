package com.tabletopia.realtimeservice.domain.tablerealtime.exception;

/**
 * 레스토랑 테이블 비즈니스 예외
 *
 * @author 김예진
 * @since 2025-09-20
 */
public class TableRealtimeStateNotFoundException extends RuntimeException{
  private static final String DEFAULT_MESSAGE = "해당 레스토랑의 테이블 정보가 없습니다..";

  public TableRealtimeStateNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public TableRealtimeStateNotFoundException(String message) {
    super(message);
  }

  public TableRealtimeStateNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public TableRealtimeStateNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
