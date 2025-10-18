package com.tabletopia.restaurantservice.domain.restaurantCategory.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantCategoryWithPage;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.service.RestaurantService;
import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.CategorySimpleResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.RestaurantCategoryResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantCategory.service.RestaurantCategoryService;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 * 레스토랑 카테고리 컨트롤러
 *
 * @author 성유진
 * @since 2025-10-13
 */


@RestController
@RequestMapping("/api/user/categories")
@RequiredArgsConstructor
public class RestaurantCategoryController {

  private final RestaurantCategoryService restaurantCategoryService;
  private final RestaurantService restaurantService;

  //카테고리 리스트
  @GetMapping
  public ResponseEntity<List<CategorySimpleResponse>> findAll() {
    List<CategorySimpleResponse> response = restaurantCategoryService.getRestaurantCategories();
    return ResponseEntity.ok(response);
  }

  //카테고리별 레스토랑 리스트
  @GetMapping("/{id}/restaurants")
  public ResponseEntity<RestaurantCategoryResponse> getRestaurantsByCategory(
      @PathVariable Long id,
      @PageableDefault(size = 3, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

    RestaurantCategoryResponse response = restaurantService.getRestaurantsByCategory(id, pageable);
    return ResponseEntity.ok(response);
  }
}


