package com.tabletopia.restaurantservice.domain.restaurantMenu.controller;

import com.tabletopia.restaurantservice.domain.restaurantMenu.dto.RestaurantMenuRequest;
import com.tabletopia.restaurantservice.domain.restaurantMenu.dto.RestaurantMenuResponse;
import com.tabletopia.restaurantservice.domain.restaurantMenu.service.RestaurantMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 레스토랑 메뉴 컨트롤러
 * 메뉴 등록, 조회, 수정, 삭제 API를 제공한다.
 * FormData를 통한 이미지 업로드를 지원한다.
 * Soft Delete 방식으로 메뉴 삭제가 처리된다.
 *
 * @author 김지민
 * @since 2025-10-10
 */
@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menus")
@RequiredArgsConstructor
public class RestaurantMenuController {

  private final RestaurantMenuService menuService;

  // 특정 매장의 메뉴 목록 조회
  @GetMapping
  public List<RestaurantMenuResponse> getMenus(@PathVariable Long restaurantId) {
    return menuService.getMenusByRestaurant(restaurantId);
  }

  // 새 메뉴 등록 (이미지 포함)
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public RestaurantMenuResponse createMenu(
      @PathVariable Long restaurantId,
      @ModelAttribute RestaurantMenuRequest dto
  ) {
    return menuService.createMenu(restaurantId, dto);
  }

  // 메뉴 수정 (이미지 포함 가능)
  @PutMapping(value = "/{menuId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public RestaurantMenuResponse updateMenu(
      @PathVariable Long restaurantId,
      @PathVariable Long menuId,
      @ModelAttribute RestaurantMenuRequest dto
  ) {
    return menuService.updateMenu(restaurantId, menuId, dto);
  }

  // 메뉴 삭제 (Soft Delete)
  @DeleteMapping("/{menuId}")
  public void deleteMenu(@PathVariable Long menuId) {
    menuService.deleteMenu(menuId);
  }
}
