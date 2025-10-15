package com.tabletopia.restaurantservice.domain.user.exception;

/**
 * 회원을 찾을 수 없을 때 발생하는 예외
 *
 * @author 이세형
 * @since 2025-09-25
 */
public class UserNotFoundException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "이메일 또는 비밀번호가 올바르지 않습니다.";

  public UserNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public UserNotFoundException(String message) {
    super(message);
  }

  public UserNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public UserNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}