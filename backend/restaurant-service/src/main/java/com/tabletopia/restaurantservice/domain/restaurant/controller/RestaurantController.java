package com.tabletopia.restaurantservice.domain.restaurant.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
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
 * RestaurantController

 * 레스토랑 관련 REST API 요청을 처리하는 컨트롤러이다.
 * Service 계층을 호출하여 CRUD 작업을 수행하며,
 * JSON 형태의 응답을 반환한다.

 * 주요 기능:
 * - 전체 레스토랑 조회
 * - 단일 레스토랑 조회
 * - 레스토랑 등록
 * - 레스토랑 수정
 * - 레스토랑 삭제 (Soft Delete)

 * @author 김지민
 * @since 2025-10-09
 */
@Slf4j
@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

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
    // 레스토랑 조회
    Page<Restaurant> restaurants = restaurantService.searchRestaurants(searchCondition);

    // entity -> dto
    Page<RestaurantSearchResponse> result = restaurants.map(RestaurantSearchResponse::from);
    return ResponseEntity.ok(result);
  }

  /** 레스토랑 등록 */
  @PostMapping
  public ResponseEntity<Restaurant> create(@RequestBody Restaurant restaurant) {
    return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
  }

  /** 레스토랑 수정 */
  @PutMapping("/{id}")
  public ResponseEntity<Restaurant> update(@PathVariable Long id, @RequestBody Restaurant restaurant) {
    return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
  }

  /** 레스토랑 삭제 (Soft Delete) */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    restaurantService.deleteRestaurant(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * 상세레스토랑 조회 (유저)
   */
  @GetMapping("/{id}/detail")
  public ResponseEntity<RestaurantSearchResponse> getRestaurantDetail(@PathVariable Long id) {
    return ResponseEntity.ok(restaurantService.getRestaurantDetail(id));
  }

}
