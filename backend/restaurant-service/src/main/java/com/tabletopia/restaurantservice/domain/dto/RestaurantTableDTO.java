package com.tabletopia.restaurantservice.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTableDTO {
  private Long id;
  private String name;
  private Integer minCapacity;
  private Integer maxCapacity;
  private Integer xPosition;
  private Integer yPosition;
  private String shape;
}
