package com.tabletopia.restaurantservice.domain.reservation.exception;

/**
 * 유효하지 않은 예약 상태로, 예약 상태 변경이 불가능할 때 발생하는 예외 (비즈니스 규칙)
 * 예: 이미 취소된 예약을 승인하려 할 때 등
 *
 * @author 김예진
 * @since 2025-12-05
 */
public class InvalidReservationStatusException extends RuntimeException{
  private static final String DEFAULT_MESSAGE = "유효하지 않은 예약 상태입니다.";

  public InvalidReservationStatusException() {
    super(DEFAULT_MESSAGE);
  }

  public InvalidReservationStatusException(String message) {
    super(message);
  }

  public InvalidReservationStatusException(String message, Throwable cause) {
    super(message, cause);
  }

  public InvalidReservationStatusException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
