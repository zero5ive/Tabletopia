package com.tabletopia.restaurantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 레스토랑 스냅샷 정보
 */
@Getter
@AllArgsConstructor
public class RestaurantSnapshot {
  private Long id;
  private String name;
  private String address;
  private String tel;
}