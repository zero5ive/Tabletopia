package com.tabletopia.restaurantservice.exception;

import com.tabletopia.restaurantservice.domain.admin.exception.AdminNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.exception.InvalidReservationStatusException;
import com.tabletopia.restaurantservice.domain.reservation.exception.ReservationNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.exception.TableSelectionNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.exception.UnauthorizedReservationAccessException;
import com.tabletopia.restaurantservice.dto.ErrorResponse;
import com.tabletopia.restaurantservice.domain.user.exception.UserAlreadyExistsException;
import com.tabletopia.restaurantservice.domain.user.exception.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.filters.ExpiresFilter.XHttpServletResponse;
import org.apache.coyote.Response;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties.Http;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

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
   * ResponseStatusException 처리
   *
   * @author 서예닮
   * @since 2025-10-19
   */
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException e) {
    log.warn("ResponseStatusException: {}", e.getReason());
    return ResponseEntity
        .status(e.getStatusCode())
        .body(ErrorResponse.of(e.getReason(), e.getStatusCode().toString()));
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

    /**
     * admin(지점) 찾을 수 없음 예외 처리
     *
     * @author 이세형
     * @since 2025-10-14
     */
    @ExceptionHandler(AdminNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAdminNotFoundException(UserNotFoundException e) {
        log.warn("admin 로그인 실패: {}", e.getMessage());
        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.of(e.getMessage(), "USER_NOT_FOUND"));
    }

  /**
   * ===========================================================
   * Reservation 예외처리
   * ===========================================================
   */

  /**
   * 유효하지 않은 예약 상태일 때 예외 처리
   * @author 김예진
   * @since 2025-12-05
   */
  @ExceptionHandler(InvalidReservationStatusException.class)
  public ResponseEntity<ErrorResponse> handleInvalidReservationStatusException(InvalidReservationStatusException e){
    log.warn("예약 상태 변경 실패: {}", e.getMessage());
    return ResponseEntity
        .badRequest()
        .body(ErrorResponse.of(e.getMessage(), "INVALID_RESERVATION_STATUS_EXCEPTION"));
  }

  /**
   * 예약을 찾을 수 없을 때 예외 처리
   * @author 김예진
   * @since 2025-12-05
   */
  @ExceptionHandler(ReservationNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleReservationNotFoundException(ReservationNotFoundException e){
    log.warn("예약을 찾을 수 없음: {}", e.getMessage());
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND) // 404 not found
        .body(ErrorResponse.of(e.getMessage(), "RESERVATION_NOT_FOUND"));
  }

  /**
   * 테이블 선점 정보를 찾을 수 없을 때 예외 처리
   * @author 김예진
   * @since 2025-12-05
   */
  @ExceptionHandler(TableSelectionNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTableSelectionNotFoundException(TableSelectionNotFoundException e){
    log.warn("테이블 선점 정보 없음: {}", e.getMessage());
    return ResponseEntity
        .badRequest()
        .body(ErrorResponse.of(e.getMessage(), "TABLE_SELECTION_NOT_FOUND"));
  }

  /**
   * 권한이 없는 예약에 접근할 때 예외 처리
   * @author 김예진
   * @since 2025-12-05
   */
  @ExceptionHandler(UnauthorizedReservationAccessException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorizedReservationAccessException(UnauthorizedReservationAccessException e){
    log.warn("예약 접근 권한 없음: {}", e.getMessage());
    return ResponseEntity
        .status(HttpStatus.FORBIDDEN) // 403 forbidden
        .body(ErrorResponse.of(e.getMessage(), "UNAUTHORIZED_RESERVATION_ACCESS"));
  }



}
