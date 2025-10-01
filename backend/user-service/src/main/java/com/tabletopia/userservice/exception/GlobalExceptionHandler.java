package com.tabletopia.userservice.exception;

import com.tabletopia.userservice.dto.ErrorResponse;
import com.tabletopia.userservice.exception.user.UserAlreadyExistsException;
import com.tabletopia.userservice.exception.user.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리
 *
 * @author 김예진
 * @since 2025-09-19
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * 회원을 찾을 수 없음 예외 처리
   *
   * @author 이세형
   * @since 2025-09-25
   */
  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException e) {
    log.warn("회원 로그인 실패: {}", e.getMessage());
    return ResponseEntity
        .badRequest()
        .body(ErrorResponse.of(e.getMessage(), "USER_NOT_FOUND"));
  }

  /**
   * 존재하는 회원 예외 처리
   *
   * @author 이세형
   * @since 2025-09-25
   */
  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(
      UserAlreadyExistsException e) {
    log.warn("회원가입 실패: {}", e.getMessage());
    return ResponseEntity
        .badRequest()
        .body(ErrorResponse.of(e.getMessage(), "USER_ALREADY_EXISTS"));
  }

  /**
   * 입력값 검증 실패 예외 처리
   *
   * @author 이세형
   * @since 2025-10-01
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
    log.warn("입력값 검증 실패: {}", e.getMessage());

    return ResponseEntity.badRequest()
        .body(ErrorResponse.of(e.getMessage(), "INVALID_INPUT"));
  }

  /**
   * DTO의 Bean Validation 예외 처리
   *
   * @author 이세형
   * @since 2025-10-01
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException e) {
    String message = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    log.warn("유효성 검사 실패: {}", message);

    return ResponseEntity.badRequest()
        .body(ErrorResponse.of(message, "VALIDATION_FAILED"));
  }

  /**
   * 서버 내부 오류
   *
   * @author 이세형
   * @since 2025-10-01
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
    log.error("서버 내부 오류 발생", e);
    return ResponseEntity
        .internalServerError()
        .body(ErrorResponse.of("서버 내부 오류가 발생했습니다.", "INTERNAL_SERVER_ERROR"));
  }
}
