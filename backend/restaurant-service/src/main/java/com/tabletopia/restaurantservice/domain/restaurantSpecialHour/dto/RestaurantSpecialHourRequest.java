package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 레스토랑 특별 운영시간 Request
 * 클라이언트(관리자 페이지 등)에서 전달되는 입력 데이터용 객체.
 *
 * 특정 날짜(명절, 휴무일 등)의 임시 영업시간을 등록/수정할 때 사용된다.
 * DB의 restaurant_special_hour 테이블과 매핑되는 일부 필드만 포함한다.
 *
 * 예:
 * - 설날 단축영업
 * - 크리스마스 연장영업
 * - 특정일 휴무
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSpecialHourRequest {

  /** 특정 날짜 (예: 2025-02-09 설날) */
  private LocalDate specialDate;

  /** 오픈 시간 (null이면 휴무) */
  private LocalTime openTime;

  /** 마감 시간 (null이면 휴무) */
  private LocalTime closeTime;

  /** 완전 휴무 여부 */
  private Boolean isClosed;

  /** 메모 (예: 설날 단축영업, 크리스마스 연장영업) */
  private String specialInfo;
}
