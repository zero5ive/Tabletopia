package com.tabletopia.restaurantservice.domain.restaurantTable.controller;

import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

  private final RestaurantTableService restaurantTableService;

  @GetMapping("/{restaurantId}")
  public List<RestaurantTable> getTables(@PathVariable Long restaurantId) {
    return restaurantTableService.getTablesByRestaurant(restaurantId);
  }
}
