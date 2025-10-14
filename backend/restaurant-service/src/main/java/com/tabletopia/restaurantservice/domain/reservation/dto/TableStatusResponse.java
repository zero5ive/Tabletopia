package com.tabletopia.restaurantservice.domain.reservation.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 테이블 상태 조회 응답 DTO
 *
 * @author 김예진
 * @since 2025-10-01
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TableStatusResponse {

  private boolean success; // 성공여부
  private String message; // 메시지
  private List<TableStatus> tables; // 테이블 상태 목록
  private String date; // 조회날짜
  private String time; // 조회시간
  private LocalDateTime timestamp; // 응답 생성 시간

  /**
   * 성공 응답 생성
   * @author 김예진
   * @since 2025-10-01
   */
  public static TableStatusResponse success(List<TableStatus> tableStatuses, String date, String time) {
    return new TableStatusResponse(
        true,
        "테이블 상태 조회 성공",
        tableStatuses,
        date,
        time,
        LocalDateTime.now()
    );
  }

  /**
   * 실패 응답 생성
   * @author 김예진
   * @since 2025-10-01
   */
  public static TableStatusResponse error(String message) {
    return new TableStatusResponse(
        false,
        message,
        null,
        null,
        null,
        LocalDateTime.now()
    );
  }
}