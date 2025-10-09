package com.tabletopia.restaurantservice.domain.controller;

import com.tabletopia.restaurantservice.domain.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.service.RestaurantService;
import lombok.RequiredArgsConstructor;
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
 * @since 2025-09-26
 */
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
}
