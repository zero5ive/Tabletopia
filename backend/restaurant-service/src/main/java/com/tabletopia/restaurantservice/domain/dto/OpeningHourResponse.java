package com.tabletopia.restaurantservice.domain.dto;

public record OpeningHourResponse(
    Long restaurantId,
    int dayOfWeek,
    String openTime,
    String closeTime,
    String breakStartTime,
    String breakEndTime,
    int reservationInterval,
    boolean isHoliday
) {}
