package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto;

import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity.RestaurantSpecialHour;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 레스토랑 특별 운영시간 Response
 * 특정 날짜의 단축영업 / 연장영업 / 휴무 정보를 전달한다.
 * DB의 restaurant_special_hour 테이블과 매핑되는 데이터 전송 객체.
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSpecialHourResponse {

  /** 특별 운영시간 고유 ID */
  private Long id;

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

  /**
   * 엔티티 → Response 변환 메서드
   * @param entity RestaurantSpecialHour 엔티티
   * @return RestaurantSpecialHourResponse
   */
  public static RestaurantSpecialHourResponse fromEntity(RestaurantSpecialHour entity) {
    return RestaurantSpecialHourResponse.builder()
        .id(entity.getId())
        .specialDate(entity.getSpecialDate())
        .openTime(entity.getOpenTime())
        .closeTime(entity.getCloseTime())
        .isClosed(entity.getIsClosed())
        .specialInfo(entity.getSpecialInfo())
        .build();
  }
}
