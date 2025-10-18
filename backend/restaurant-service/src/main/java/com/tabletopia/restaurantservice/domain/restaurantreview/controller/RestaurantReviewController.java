package com.tabletopia.restaurantservice.domain.restaurantreview.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
import com.tabletopia.restaurantservice.domain.restaurantreview.dto.RestaurantReviewResponse;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.service.RestaurantReviewService;
import java.util.List;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 레스토랑 리뷰 컨트롤러
 *
 * @author 김예진
 * @since 2025-10-16
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class RestaurantReviewController {

  private final RestaurantReviewService restaurantReviewService;

  /**
   *
   * @param restaurantId
   * @return
   */
  @GetMapping("/restaurants/{restaurantId}/reviews")
  public List<RestaurantReviewResponse> getRestaurantReviews(@PathVariable Long restaurantId){
    List<RestaurantReview> reviews = restaurantReviewService.getRestaurantReviews(restaurantId);
    return reviews
        .stream()
        .map(RestaurantReviewResponse::from)
        .toList();
  }


}
