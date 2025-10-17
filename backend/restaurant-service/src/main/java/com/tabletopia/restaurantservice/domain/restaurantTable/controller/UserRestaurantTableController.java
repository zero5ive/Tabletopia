package com.tabletopia.restaurantservice.domain.restaurantTable.controller;

import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자용 레스토랑 테이블 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-17
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/tables")
@RequiredArgsConstructor
public class UserRestaurantTableController {

  private final RestaurantTableService restaurantTableService;

  @GetMapping
  public List<RestaurantTable> getTables(@PathVariable Long restaurantId) {
    return restaurantTableService.getTablesByRestaurant(restaurantId);
  }
}
