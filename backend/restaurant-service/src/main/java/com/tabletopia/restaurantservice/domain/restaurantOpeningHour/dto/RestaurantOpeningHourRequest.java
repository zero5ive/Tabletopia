package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto;

import lombok.*;
import java.time.LocalTime;

/**
 * 레스토랑 기본 운영시간 Request DTO
 *
 * 프론트엔드에서 등록/수정 요청 시 사용하는 데이터 전송 객체.
 * DB 엔티티로 변환되어 RestaurantOpeningHourService 에서 처리된다.
 *
 * 예시:
 * {
 *   "dayOfWeek": 1,
 *   "openTime": "09:00",
 *   "closeTime": "22:00",
 *   "isHoliday": false,
 *   "breakStartTime": "15:00",
 *   "breakEndTime": "17:00",
 *   "reservationInterval": 30
 * }
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOpeningHourRequest {

  /** 요일 (0=일요일 ~ 6=토요일) */
  private int dayOfWeek;

  /** 오픈 시간 */
  private LocalTime openTime;

  /** 마감 시간 */
  private LocalTime closeTime;

  /** 휴무 여부 */
  private Boolean isHoliday;

  /** 브레이크 시작 시간 */
  private LocalTime breakStartTime;

  /** 브레이크 종료 시간 */
  private LocalTime breakEndTime;

  /** 예약 간격(분 단위) */
  private Integer reservationInterval;
}
