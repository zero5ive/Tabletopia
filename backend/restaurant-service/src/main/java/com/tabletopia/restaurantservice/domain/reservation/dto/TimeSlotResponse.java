package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.Data;

@Data
public class TimeSlotResponse {
  String startTime;
  String endTime;
}