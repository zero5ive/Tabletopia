package com.tabletopia.restaurantservice.domain.waiting.exception;

/**
 * 웨이팅 상태가 유효하지 않을 때 발생하는 예외
 *
 * @author 성유진
 * @since 2025-12-15
 */
public class InvalidWaitingStateException extends RuntimeException {
  private static final String DEFAULT_MESSAGE = "유효하지 않은 웨이팅 상태입니다.";

  public InvalidWaitingStateException() {
    super(DEFAULT_MESSAGE);
  }

  public InvalidWaitingStateException(String message) {
    super(message);
  }

  public InvalidWaitingStateException(String message, Throwable cause) {
    super(message, cause);
  }

  public InvalidWaitingStateException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
