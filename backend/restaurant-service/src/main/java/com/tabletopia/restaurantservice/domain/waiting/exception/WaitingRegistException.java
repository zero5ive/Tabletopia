package com.tabletopia.restaurantservice.domain.waiting.exception;

public class WaitingRegistException extends RuntimeException{

  public WaitingRegistException(String message) {
    super(message);
  }

  public WaitingRegistException(String message, Throwable cause) {
    super(message, cause);
  }

  public WaitingRegistException(Throwable cause) {
    super(cause);
  }

}
