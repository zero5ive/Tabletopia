package com.tabletopia.restaurantservice.domain.restaurantreview.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.repository.RestaurantReviewRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 레스토랑 서비스
 *
 * @author 김예진
 * @since 2025-10-16
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantReviewService {

  private final RestaurantReviewRepository restaurantReviewRepository;

  /**
   * 사용자의 리뷰 조회
   * @author 김예진
   * @since 2025-10-16
   */
//  public List<RestaurantReview> getReviewsByUser(Long userId){
//
//  }

  /**
   * 레스토랑의 리뷰 조회
   * @author 김예진
   * @since 2025-10-16
   */
  public List<RestaurantReview> getRestaurantReviews(Long restaurantId){
    return restaurantReviewRepository.getRestaurantReviewsByRestaurant_Id(restaurantId);
  }
}
