package com.tabletopia.restaurantservice.dto;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * API 공통 응답 DTO
 *
 * @author 김예진
 * @since 2025-09-19
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApiResponse<T> {

  private boolean success;
  private String message;
  private T data;

  /**
   * 성공 응답 생성
   */
  public static <T> ApiResponse<T> success(String message, T data) {
    return ApiResponse.<T>builder()
        .success(true)
        .message(message)
        .data(data)
        .build();
  }

  /**
   * 성공 응답 생성 (데이터 없음)
   */
  public static ApiResponse<Void> success(String message) {
    return ApiResponse.<Void>builder()
        .success(true)
        .message(message)
        .data(null)
        .build();
  }
}
