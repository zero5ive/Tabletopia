package com.tabletopia.userservice.exception.snsprovider;

/**
 * SNS 제공자를 찾을 수 없을 때 발생하는 예외
 *
 * @author 김예진
 * @since 2025-09-19
 */
public class SnsProviderNotFoundException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "소셜 정보를 찾을 수 없습니다.";

  public SnsProviderNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public SnsProviderNotFoundException(String message) {
    super(message);
  }

  public SnsProviderNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public SnsProviderNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}