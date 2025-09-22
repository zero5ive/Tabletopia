package com.tabletopia.realtimeservice.domain.tablerealtime.enums;

public enum TableState {
  AVAILABLE("이용가능"),
  OCCUPIED("사용 중"),
  RESERVED("예약됨"),
  CLEANING("정리 중"),
  OUT_OF_ORDER("사용 불가");

  private final String description;

  TableState(String description){
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
