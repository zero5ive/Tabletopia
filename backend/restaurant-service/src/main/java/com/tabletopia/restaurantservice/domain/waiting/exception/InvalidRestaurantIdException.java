package com.tabletopia.restaurantservice.domain.waiting.exception;

/**
 * 레스토랑 ID가 유효하지 않을 때 발생하는 예외
 *
 * @author 성유진
 * @since 2025-12-15
 */
public class InvalidRestaurantIdException extends RuntimeException {
  private static final String DEFAULT_MESSAGE = "유효하지 않은 레스토랑 ID입니다.";

  public InvalidRestaurantIdException() {
    super(DEFAULT_MESSAGE);
  }

  public InvalidRestaurantIdException(String message) {
    super(message);
  }

  public InvalidRestaurantIdException(String message, Throwable cause) {
    super(message, cause);
  }

  public InvalidRestaurantIdException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
