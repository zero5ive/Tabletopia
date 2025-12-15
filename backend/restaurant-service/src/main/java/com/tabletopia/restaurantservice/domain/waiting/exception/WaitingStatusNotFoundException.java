package com.tabletopia.restaurantservice.domain.waiting.exception;

/**
 * 웨이팅 상태를 찾을 수 없을 때 발생하는 예외
 *
 * @author 성유진
 * @since 2025-12-15
 */
public class WaitingStatusNotFoundException extends RuntimeException {
  private static final String DEFAULT_MESSAGE = "웨이팅 상태를 조회할 수 없습니다.";

  public WaitingStatusNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public WaitingStatusNotFoundException(String message) {
    super(message);
  }

  public WaitingStatusNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public WaitingStatusNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
