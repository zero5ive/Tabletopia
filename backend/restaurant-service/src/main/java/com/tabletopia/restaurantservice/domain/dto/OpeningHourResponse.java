package com.tabletopia.restaurantservice.domain.dto;

/**
 * 레스토랑 운영시간 응답 DTO
 * 특정 레스토랑의 요일별 운영시간 및 예약 관련 정보를 담는다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: record 타입으로 정의되어 불변성을 보장하며,
 *       JSON 직렬화/역직렬화 시 자동으로 필드명이 매핑된다.
 */
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
