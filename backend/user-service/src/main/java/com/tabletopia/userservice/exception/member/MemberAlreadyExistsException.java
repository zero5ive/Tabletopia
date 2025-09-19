package com.tabletopia.userservice.exception.member;

/**
 * 이미 존재하는 회원에 대한 예외
 *
 * @author 김예진
 * @since 2025-08-25
 */
public class MemberAlreadyExistsException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "이미 존재하는 이메일입니다.";

  public MemberAlreadyExistsException() {
    super(DEFAULT_MESSAGE);
  }

  public MemberAlreadyExistsException(String message) {
    super(message);
  }

  public MemberAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }

  public MemberAlreadyExistsException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}