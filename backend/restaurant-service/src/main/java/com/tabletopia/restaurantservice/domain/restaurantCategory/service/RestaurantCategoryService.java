package com.tabletopia.restaurantservice.domain.restaurantCategory.service;

import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantCategory.repository.RestaurnatCategoryRepository;
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

  private final RestaurnatCategoryRepository restaurnatCategoryRepository;

  public List<RestaurantCategory> getRestaurantCategories() {
    return restaurnatCategoryRepository.findAllByOrderByDisplayOrderAsc();
  }

  public RestaurantCategory getRestaurantCategoryById(Long id) {
    return restaurnatCategoryRepository.findById(id).orElseThrow(()->new RuntimeException("카테고리를 찾을 수 없습니다."));
  }


}
