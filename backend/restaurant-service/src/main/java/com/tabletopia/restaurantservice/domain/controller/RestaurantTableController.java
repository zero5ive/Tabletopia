package com.tabletopia.restaurantservice.domain.controller;

import com.tabletopia.restaurantservice.domain.dto.RestaurantTableDto;
import com.tabletopia.restaurantservice.domain.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurant/{restaurantId}/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

  private final RestaurantTableService tableService;

  @GetMapping
  public List<RestaurantTableDto> getTables(@PathVariable Long restaurantId) {
    return tableService.getTablesByRestaurant(restaurantId);
  }
}

