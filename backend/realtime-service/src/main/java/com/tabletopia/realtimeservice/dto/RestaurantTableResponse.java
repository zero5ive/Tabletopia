package com.tabletopia.realtimeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTableResponse {
  private Long id;
  private String name;
  private Integer minCapacity;
  private Integer maxCapacity;
  private Integer xPosition;
  private Integer yPosition;
  private String shape;
}
