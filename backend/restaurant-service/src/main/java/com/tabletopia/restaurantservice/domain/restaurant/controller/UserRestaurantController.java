package com.tabletopia.restaurantservice.domain.restaurant.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestuarantLocationResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.SearchCondition;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * UserRestaurantController
 *
 * 사용자용 레스토랑 조회 API를 처리하는 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-09
 */
@Slf4j
@RestController
@RequestMapping("/api/user/restaurants")
@RequiredArgsConstructor
public class UserRestaurantController {

  private final RestaurantService restaurantService;

  /** 전체 레스토랑 조회 */
  @GetMapping
  public ResponseEntity<List<Restaurant>> getAll() {
      return ResponseEntity.ok(restaurantService.getAllRestaurants());
  }

  /** 단일 레스토랑 조회 */
  @GetMapping("/{id}")
  public ResponseEntity<Restaurant> getById(@PathVariable Long id) {
    return ResponseEntity.ok(restaurantService.getRestaurant(id));
  }

  /**
   * 레스토랑 검색
   * @param searchCondition 검색 조건
   * @return 검색 결과 페이지
   */
  @GetMapping("/search")
  public ResponseEntity<Page<RestaurantSearchResponse>> searchRestaurants(@ModelAttribute SearchCondition searchCondition){
    log.info("레스토랑 검색 요청: 조건 - {}", searchCondition);
    Page<Restaurant> restaurants = restaurantService.searchRestaurants(searchCondition);
    Page<RestaurantSearchResponse> result = restaurants.map(RestaurantSearchResponse::from);
    return ResponseEntity.ok(result);
  }

  /**
   * 상세레스토랑 조회
   */
  @GetMapping("/{id}/detail")
  public ResponseEntity<RestaurantSearchResponse> getRestaurantDetail(@PathVariable Long id) {
    return ResponseEntity.ok(restaurantService.getRestaurantDetail(id));
  }

  /**
   * 레스토랑 위치 조회
   */
  @GetMapping("/{id}/location")
  public ResponseEntity<RestuarantLocationResponse> getRestaurantLocation(@PathVariable Long id) {
    return ResponseEntity.ok(restaurantService.getRestuarantLocation(id));
  }

}
