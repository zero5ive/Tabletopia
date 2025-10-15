package com.tabletopia.restaurantservice.domain.restaurantCategory.dto;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

/**
 * 레스토랑 카테고리 디티오
 *
 * @author 성유진
 * @since 2025-10-13
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCategoryResponse {

  private Long id;
  private String name;
  private Integer displayOrder;
  private Page<RestaurantResponse> restaurants;
}
