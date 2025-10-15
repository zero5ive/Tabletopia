package com.tabletopia.restaurantservice.domain.restaurant.dto;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@AllArgsConstructor
public class RestaurantCategoryWithPage {
  private RestaurantCategory category;
  private Page<Restaurant> restaurantPage;
}
