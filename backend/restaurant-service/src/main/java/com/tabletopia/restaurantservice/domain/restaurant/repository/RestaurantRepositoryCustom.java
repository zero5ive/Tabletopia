package com.tabletopia.restaurantservice.domain.restaurant.repository;

import com.tabletopia.restaurantservice.domain.restaurant.dto.SearchCondition;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 레스토랑 커스텀 리포지토리 
 * Querydsl를 사용한 동적 쿼리 메서드 정의
 *
 * @author 김예진
 * @since 2025-10-15
 */
public interface RestaurantRepositoryCustom {

  /**
   * 동적 조건으로 레스토랑 검색 및 페이징
   *
   * @param searchCondition 검색 조건 (이름, 지역코드, 카테고리)
   * @param pageable 페이징 정보
   * @return 검색
   *
   * @author 김예진
   * @since 2025-10-15
   */
  Page<Restaurant> searchRestaurants(SearchCondition searchCondition, Pageable pageable);

}
