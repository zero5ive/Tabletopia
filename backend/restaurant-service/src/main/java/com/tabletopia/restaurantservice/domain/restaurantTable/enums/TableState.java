package com.tabletopia.restaurantservice.domain.restaurantTable.enums;

/**
 * 테이블 상태 이넘
 *
 * @author 서예닮
 * @since 2025-10-18
 */
public enum TableState {
  AVAILABLE("사용 가능"),
  OCCUPIED("사용 중"),
  RESERVED("예약됨"),
  CLEANING("정리 중"),
  OUT_OF_ORDER("사용 불가");

  private final String description;

  TableState(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
