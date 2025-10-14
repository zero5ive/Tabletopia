package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto;

import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour;
import lombok.*;
import java.time.LocalTime;

/**
 * 레스토랑 운영시간 DTO
 * 클라이언트와 서버 간 운영시간 데이터 전송용 객체.
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOpeningHourResponse {

  /** 운영시간 고유 ID */
  private Long id;

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
  /**
   * 엔티티 → Response 변환 메서드
   * @param entity RestaurantOpeningHour 엔티티
   * @return RestaurantOpeningHourResponse
   */
  public static RestaurantOpeningHourResponse fromEntity(RestaurantOpeningHour entity) {
    return RestaurantOpeningHourResponse.builder()
        .id(entity.getId())
        .dayOfWeek(entity.getDayOfWeek())
        .openTime(entity.getOpenTime())
        .closeTime(entity.getCloseTime())
        .isHoliday(entity.getIsHoliday())
        .breakStartTime(entity.getBreakStartTime())
        .breakEndTime(entity.getBreakEndTime())
        .reservationInterval(
            entity.getReservationInterval() != null
                ? entity.getReservationInterval()
                : null
        )
        .build();
  }
}
