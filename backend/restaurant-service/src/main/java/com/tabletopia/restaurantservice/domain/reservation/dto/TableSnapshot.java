package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 레스토랑 스냅샷 정보
 */
@Getter
@AllArgsConstructor
public class TableSnapshot {

  private String restaurantTableName;

  private Integer restaurantTableCapacity;
}
