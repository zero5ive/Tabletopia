package com.tabletopia.restaurantservice.domain.user.exception;

/**
 * 이미 존재하는 회원에 대한 예외
 *
 * @author 이세형
 * @since 2025-09-25
 */
public class UserAlreadyExistsException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "이미 존재하는 이메일입니다.";

  public UserAlreadyExistsException() {
    super(DEFAULT_MESSAGE);
  }

  public UserAlreadyExistsException(String message) {
    super(message);
  }

  public UserAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }

  public UserAlreadyExistsException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}