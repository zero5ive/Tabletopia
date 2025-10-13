package com.tabletopia.restaurantservice.domain.restaurantcaCategory.dto;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCategoryResponse {

  private Long id;
  private String name;
  private Integer displayOrder;
  private List<RestaurantResponse> restaurants;
}
