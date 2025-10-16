package com.tabletopia.restaurantservice.domain.restaurantreview.repository;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.w3c.dom.stylesheets.LinkStyle;

/**
 * 레스토랑 리뷰 리포지토리
 *
 * @author 김예진
 * @since 2025-10-16
 */
public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long> {

  /**
   * 레스토랑의 리뷰 목록 조회
   * @author 김예진
   * @since 2025-10-16
   * @param restaurantId
   * @return
   */
  List<RestaurantReview> getRestaurantReviewsByRestaurant_Id(Long restaurantId);
}
