package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "restaurant_opening_hour")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOpeningHour {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long restaurantId;
  private int dayOfWeek;

  private LocalTime openTime;
  private LocalTime closeTime;

  private Boolean isHoliday;

  private LocalTime breakStartTime;
  private LocalTime breakEndTime;

  private int reservationInterval; // 예약 간격(분)

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
