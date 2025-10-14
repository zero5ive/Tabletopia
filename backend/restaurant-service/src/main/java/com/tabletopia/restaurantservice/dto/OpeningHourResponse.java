package com.tabletopia.restaurantservice.dto;

import lombok.Data;

@Data
public class OpeningHourResponse{
    Long restaurantId;
    int dayOfWeek;
    String openTime;
    String closeTime;
    String breakStartTime;
    String breakEndTime;
    int reservationInterval;
    boolean isHoliday;
}
