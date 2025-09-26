package com.tabletopia.restaurantservice.domain.dto;
/**
 * 예약 가능 시간 슬롯 응답 DTO
 * 특정 레스토랑의 예약 가능한 시간 구간을 표현한다.
 * 불변 객체로, 예약 조회 API의 응답으로 사용된다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: record 타입으로 불변성을 보장하며,
 *       직렬화/역직렬화 시 필드명이 자동 매핑된다.
 */
public record TimeSlotResponse(
    String startTime,
    String endTime
) {}