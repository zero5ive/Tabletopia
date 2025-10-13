package com.tabletopia.restaurantservice.domain.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {

  private Long id;
  private String name;
  private String address;
  private String regionCode;

}
