package com.tabletopia.restaurantservice.domain.reservation.exception;

/**
 * 권한이 없는 예약에 접근할 때 (비즈니스 규칙/보안)
 * 예: 내 예약이 아닌데 취소하려 할 때
 *
 * @author 김예진
 * @since 2025-12-05
 */
public class UnauthorizedReservationAccessException extends RuntimeException{
  private static final String DEFAULT_MESSAGE = "해당 예약을 처리할 권한이 없거나, 접근할 수 없는 예약입니다.";

  public UnauthorizedReservationAccessException() {
    super(DEFAULT_MESSAGE);
  }

  public UnauthorizedReservationAccessException(String message) {
    super(message);
  }

  public UnauthorizedReservationAccessException(String message, Throwable cause) {
    super(message, cause);
  }

  public UnauthorizedReservationAccessException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
