package com.tabletopia.restaurantservice.domain.dto;

/**
 * 레스토랑 테이블 응답 DTO
 * 특정 레스토랑의 테이블 배치 및 속성 정보를 담는다.
 * Response 전용 객체로, 불변성을 보장한다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: record 타입으로 정의되어 불변성을 보장하며,
 *       JSON 직렬화/역직렬화 시 자동으로 필드명이 매핑된다.
 */
public record RestaurantTableResponse(
    Long id,
    String name,
    Integer minCapacity,
    Integer maxCapacity,
    Integer xPosition,
    Integer yPosition,
    String shape
) {}
