package com.tabletopia.userservice.exception.member;

/**
 * 회원을 찾을 수 없을 때 발생하는 예외
 *
 * @author 김예진
 * @since 2025-08-25
 */
public class MemberNotFoundException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "이메일 또는 비밀번호가 올바르지 않습니다.";

  public MemberNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public MemberNotFoundException(String message) {
    super(message);
  }

  public MemberNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public MemberNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}