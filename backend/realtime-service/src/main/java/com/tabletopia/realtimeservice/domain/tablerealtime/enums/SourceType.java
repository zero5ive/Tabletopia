package com.tabletopia.realtimeservice.domain.tablerealtime.enums;

public enum SourceType {
  RESERVATION("예약"),
  WALK_IN("현장 방문"),
  WAITING("웨이팅");

  private final String description;

  SourceType(String description){
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
