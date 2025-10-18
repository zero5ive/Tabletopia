package com.tabletopia.restaurantservice.domain.restaurantMenu.controller;

import com.tabletopia.restaurantservice.domain.restaurantMenu.dto.RestaurantMenuResponse;
import com.tabletopia.restaurantservice.domain.restaurantMenu.service.RestaurantMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자용 레스토랑 메뉴 컨트롤러
 * 메뉴 조회 API를 제공한다.
 *
 * @author 김지민
 * @since 2025-10-10
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/menus")
@RequiredArgsConstructor
public class UserRestaurantMenuController {

  private final RestaurantMenuService menuService;

  // 특정 매장의 메뉴 목록 조회
  @GetMapping
  public List<RestaurantMenuResponse> getMenus(@PathVariable Long restaurantId) {
    return menuService.getMenusByRestaurant(restaurantId);
  }
}
