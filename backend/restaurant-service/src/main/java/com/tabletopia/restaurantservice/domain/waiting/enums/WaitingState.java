package com.tabletopia.restaurantservice.domain.waiting.enums;
/**
 * 웨이팅 이넘
 *
 * @author 성유진
 * @since 2025-09-26
 */

public enum WaitingState {
  WAITING("웨이팅 중"),
  CANCELLED("취소됨"),
  CALLED("호출됨"),
  EXPIRED("만료됨"),
  SEATED("착석됨");

  private final String description;

  WaitingState(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
