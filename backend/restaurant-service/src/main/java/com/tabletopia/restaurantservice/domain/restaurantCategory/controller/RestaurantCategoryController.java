package com.tabletopia.restaurantservice.domain.restaurantCategory.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.CategorySimpleResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.RestaurantCategoryResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantCategory.service.RestaurantCategoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/restaurantcategories")
@RequiredArgsConstructor
public class RestaurantCategoryController {

  private final RestaurantCategoryService restaurantCategoryService;

  @GetMapping
  public ResponseEntity<List<CategorySimpleResponse>> findAll() {
    List<RestaurantCategory> categoryList = restaurantCategoryService.getRestaurantCategories();

    List<CategorySimpleResponse> response = categoryList.stream()
        .map(category -> new CategorySimpleResponse(
            category.getId(),
            category.getName(),
            category.getDisplayOrder()
        ))

        .toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<RestaurantCategoryResponse>getRestaurantsByCategory ( @PathVariable Long id) {
    RestaurantCategory category = restaurantCategoryService.getRestaurantCategoryById(id);
    RestaurantCategoryResponse response = new RestaurantCategoryResponse(
        category.getId(),
        category.getName(),
        category.getDisplayOrder(),

        category.getRestaurants().stream()
            .map(restaurant ->  new RestaurantResponse(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getAddress(),
                restaurant.getRegionCode()
            ))
            .toList()
    );

    return ResponseEntity.ok(response);
  }



}


