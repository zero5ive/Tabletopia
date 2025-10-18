package com.tabletopia.restaurantservice.domain.restaurantFacility.controller;

import com.tabletopia.restaurantservice.domain.restaurantFacility.dto.RestaurantFacilityResponse;
import com.tabletopia.restaurantservice.domain.restaurantFacility.service.RestaurantFacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자용 매장별 편의시설 컨트롤러
 * 매장에 연결된 편의시설 조회 기능을 제공한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/facilities")
public class UserRestaurantFacilityController {

  private final RestaurantFacilityService restaurantFacilityService;

  public UserRestaurantFacilityController(RestaurantFacilityService restaurantFacilityService) {
    this.restaurantFacilityService = restaurantFacilityService;
  }

  /**
   * 특정 매장의 편의시설 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 연결된 편의시설 DTO 리스트
   */
  @GetMapping
  public ResponseEntity<List<RestaurantFacilityResponse>> getFacilitiesByRestaurant(@PathVariable Long restaurantId) {
    List<RestaurantFacilityResponse> response = restaurantFacilityService.getFacilitiesByRestaurant(restaurantId);
    return ResponseEntity.ok(response);
  }
}
