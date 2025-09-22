package com.tabletopia.realtimeservice.dto;

import java.time.LocalDateTime;
import lombok.Getter;

/**
 * 에러 응답 DTO
 *
 * @author 김예진
 * @since 2025-09-19
 */
@Getter // 불변 DTO는 @Setter 불필요(불변성 유지)
public class ErrorResponse {

  private final boolean success;
  private final String message;
  private final String errorCode;
  private final LocalDateTime timestamp;

  private ErrorResponse(boolean success, String message, String errorCode) {
    this.success = success;
    this.message = message;
    this.errorCode = errorCode;
    this.timestamp = LocalDateTime.now();
  }

  // 기본 에러 응답 (에러 코드 없음)
  public static ErrorResponse of(String message) {
    return new ErrorResponse(false, message, null);
  }

  // 에러 코드와 함께
  public static ErrorResponse of(String message, String errorCode) {
    return new ErrorResponse(false, message, errorCode);
  }
}
