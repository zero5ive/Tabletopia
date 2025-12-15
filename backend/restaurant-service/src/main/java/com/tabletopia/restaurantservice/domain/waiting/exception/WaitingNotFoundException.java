package com.tabletopia.restaurantservice.domain.waiting.exception;

/**
 * 웨이팅을 찾을 수 없을 때 발생하는 예외
 *
 * @author 성유진
 * @since 2025-12-15
 */
public class WaitingNotFoundException extends RuntimeException {
  private static final String DEFAULT_MESSAGE = "웨이팅을 찾을 수 없습니다.";

  public WaitingNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public WaitingNotFoundException(String message) {
    super(message);
  }

  public WaitingNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public WaitingNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
