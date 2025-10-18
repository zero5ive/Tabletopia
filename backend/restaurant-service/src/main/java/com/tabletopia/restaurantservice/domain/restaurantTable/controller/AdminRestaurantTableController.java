package com.tabletopia.restaurantservice.domain.restaurantTable.controller;

import com.tabletopia.restaurantservice.domain.restaurantTable.dto.CreateTableRequest;
import com.tabletopia.restaurantservice.domain.restaurantTable.dto.SaveLayoutRequest;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 관리자용 레스토랑 테이블 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-17
 */
@RestController
@RequestMapping("/api/admin/restaurants/{restaurantId}/tables")
@RequiredArgsConstructor
public class AdminRestaurantTableController {

  private final RestaurantTableService restaurantTableService;

  @GetMapping
  public List<RestaurantTable> getTables(@PathVariable Long restaurantId) {
    return restaurantTableService.getTablesByRestaurant(restaurantId);
  }


  @PostMapping
  public RestaurantTable createTable(
      @PathVariable Long restaurantId,
      @RequestBody CreateTableRequest request) {
    return restaurantTableService.createTable(restaurantId, request);
  }

  @PutMapping("/{tableId}")
  public RestaurantTable updateTable(
      @PathVariable Long tableId,
      @RequestBody CreateTableRequest request) {
    return restaurantTableService.updateTable(tableId, request);
  }

  @DeleteMapping("/{tableId}")
  public void deleteTable(@PathVariable Long tableId) {
    restaurantTableService.deleteTable(tableId);
  }

  /**
   * 등록한 테이블 전체 레이아웃 저장
   * @param restaurantId
   * @param request
   * @return
   * @author 김예진
   * @since 2025-10-18
   */
  @PostMapping("/layout")
  public List<RestaurantTable> saveLayout(
      @PathVariable Long restaurantId,
      @RequestBody SaveLayoutRequest request) {
    return restaurantTableService.saveLayout(restaurantId, request);
  }
}
