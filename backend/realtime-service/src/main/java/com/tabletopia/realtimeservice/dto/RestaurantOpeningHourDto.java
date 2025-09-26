package com.tabletopia.realtimeservice.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.Data;

/**
 * 레스토랑 운영 시간 DTO
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Data
public class RestaurantOpeningHourDto {
  private Long id;
  private Long restaurantId;
  private int dayOfWeak;
  private LocalTime openTime;
  private LocalTime closeTime;
  private boolean isHoliday;
  private LocalTime breakStartTime;
  private LocalTime breakEndTime;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private int reservationInterval;
}
