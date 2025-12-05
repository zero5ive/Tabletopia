package com.tabletopia.restaurantservice.domain.reservation.exception;

/**
 * 예약을 찾을 수 없을 때 발생하는 예외
 *
 * @author 김예진
 * @since 2025-12-05
 */
public class ReservationNotFoundException extends RuntimeException{
  private static final String DEFAULT_MESSAGE = "해당 예약이 존재하지 않습니다.";

  public ReservationNotFoundException() {
    super(DEFAULT_MESSAGE);
  }

  public ReservationNotFoundException(String message) {
    super(message);
  }

  public ReservationNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public ReservationNotFoundException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
