package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 특정 날짜 기준으로 실제 적용되는 영업시간 정보를 담는 DTO
 *
 * 특별 운영시간이 있으면 우선 적용되고
 * 없으면 요일별 기본 운영시간이 적용된다
 * 완전 휴무인 경우 isClosed 가 true 로 표시된다
 *
 * 사용 예시
 * GET /api/hours/effective/{restaurantId}?date=2025-12-25
 * 예시 응답
 * { "type": "SPECIAL", "openTime": "12:00:00", "closeTime": "18:00:00" }
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantEffectiveHourResponse {

  /** 매장 ID */
  private Long restaurantId;

  /** 요청 날짜 */
  private LocalDate date;

  /** 적용 타입 (SPECIAL, REGULAR, CLOSED) */
  private String type;

  /** 휴무 여부 */
  private boolean isClosed;

  /** 오픈 시간 */
  private LocalTime openTime;

  /** 마감 시간 */
  private LocalTime closeTime;

  /** 설명 메시지 */
  private String message;


}
