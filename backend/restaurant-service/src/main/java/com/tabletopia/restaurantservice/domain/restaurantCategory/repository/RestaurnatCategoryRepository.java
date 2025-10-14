package com.tabletopia.restaurantservice.domain.restaurantCategory.repository;

import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 레스토랑 카테고리 리파지토리
 *
 * @author 성유진
 * @since 2025-10-13
 */

public interface RestaurnatCategoryRepository extends JpaRepository<RestaurantCategory, Long> {

  //OrderByDisplay 오름차순으로 리스트 찾기
  List<RestaurantCategory>findAllByOrderByDisplayOrderAsc();

}
