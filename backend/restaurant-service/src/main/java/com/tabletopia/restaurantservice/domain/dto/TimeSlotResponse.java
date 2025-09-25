package com.tabletopia.restaurantservice.domain.dto;

public record TimeSlotResponse(
    String startTime,
    String endTime
) {}