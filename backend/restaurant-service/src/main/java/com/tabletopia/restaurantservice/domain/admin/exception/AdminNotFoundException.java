package com.tabletopia.restaurantservice.domain.admin.exception;

/**
 * 회원을 찾을 수 없을 때 발생하는 예외
 *
 * @author 이세형
 * @since 2025-09-25
 */
public class AdminNotFoundException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "이메일 또는 비밀번호가 올바르지 않습니다.";

  public AdminNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public AdminNotFoundException(String message) {
    super(message);
  }

  public AdminNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public AdminNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}