package com.tabletopia.restaurantservice.domain.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 타임슬롯별 예약 가능 여부 응답 DTO
 *
 * @author 김예진
 * @since 2025-10-17
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotAvailabilityResponse {

  private Long restaurantId;
  private LocalDate date;
  private Boolean isOpen; // 영업일 여부
  private LocalTime openTime;
  private LocalTime closeTime;
  private Integer reservationInterval; // 예약텀
  private List<TimeSlotInfo> timeSlots; // 타임슬롯 목록

  /**
   * 타임슬롯 정보 객체
   * 시간, 예약 가능 여부, 예약 가능 테이블 수
   */
  @Getter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TimeSlotInfo {

    /**
     * 11:00 형식의 시간
     */
    private String time; 
    private Boolean isAvailable; // 예약 가능 여부
    private Integer availableTableCount; // 예약 가능한 테이블 수
  }
}
