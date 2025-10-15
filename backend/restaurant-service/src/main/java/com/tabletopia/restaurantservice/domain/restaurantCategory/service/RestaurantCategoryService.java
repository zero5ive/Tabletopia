package com.tabletopia.restaurantservice.domain.restaurantCategory.service;

import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.CategorySimpleResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantCategory.repository.RestaurantCategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 레스토랑 카테고리 서비스
 *
 * @author 성유진
 * @since 2025-10-13
 */
@Service
@RequiredArgsConstructor
public class RestaurantCategoryService {

  private final RestaurantCategoryRepository restaurantCategoryRepository;


  public List<CategorySimpleResponse> getRestaurantCategories() {
    List<RestaurantCategory> categoryList = restaurantCategoryRepository.findAllByOrderByDisplayOrderAsc();

    return categoryList.stream()
        .map(category -> new CategorySimpleResponse(
            category.getId(),
            category.getName(),
            category.getDisplayOrder()
        ))
        .toList();
  }



}
