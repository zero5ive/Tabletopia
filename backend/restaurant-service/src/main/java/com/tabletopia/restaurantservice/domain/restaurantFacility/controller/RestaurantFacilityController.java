package com.tabletopia.restaurantservice.domain.restaurantFacility.controller;

import com.tabletopia.restaurantservice.domain.restaurantFacility.dto.RestaurantFacilityResponse;
import com.tabletopia.restaurantservice.domain.restaurantFacility.service.RestaurantFacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 매장별 편의시설 관련 요청을 처리하는 컨트롤러
 *
 * 매장(Restaurant)에 연결된 편의시설(Facility)을
 * 조회, 추가, 삭제하는 기능을 제공한다.
 *
 * - GET /api/facilities/{restaurantId} : 매장의 시설 목록 조회
 * - POST /api/facilities/{restaurantId} : 매장에 시설 추가
 * - DELETE /api/facilities/{restaurantId}/{facilityId} : 매장에서 시설 제거
 *
 * DB 스키마는 restaurant_facility 중간 테이블을 기준으로 한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@RestController
@RequestMapping("/api/facilities")
public class RestaurantFacilityController {

  private final RestaurantFacilityService restaurantFacilityService;

  public RestaurantFacilityController(RestaurantFacilityService restaurantFacilityService) {
    this.restaurantFacilityService = restaurantFacilityService;
  }

  /**
   * 특정 매장의 편의시설 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 연결된 편의시설 DTO 리스트
   */
  @GetMapping("/{restaurantId}")
  public ResponseEntity<List<RestaurantFacilityResponse>> getFacilitiesByRestaurant(@PathVariable Long restaurantId) {
    List<RestaurantFacilityResponse> response = restaurantFacilityService.getFacilitiesByRestaurant(restaurantId);
    return ResponseEntity.ok(response);
  }

  /**
   * 매장에 새로운 편의시설 추가
   *
   * @param restaurantId 매장 ID
   * @param request facilityId 포함 요청 바디
   * @return 성공 시 200 OK
   */
  @PostMapping("/{restaurantId}")
  public ResponseEntity<Void> addFacility(
      @PathVariable Long restaurantId,
      @RequestBody Map<String, Long> request
  ) {
    Long facilityId = request.get("facilityId");
    restaurantFacilityService.addFacility(restaurantId, facilityId);
    return ResponseEntity.ok().build();
  }

  /**
   * 매장에서 특정 편의시설 삭제
   *
   * @param restaurantId 매장 ID
   * @param facilityId 시설 ID
   * @return 성공 시 204 No Content
   */
  @DeleteMapping("/{restaurantId}/{facilityId}")
  public ResponseEntity<Void> removeFacility(
      @PathVariable Long restaurantId,
      @PathVariable Long facilityId
  ) {
    restaurantFacilityService.removeFacility(restaurantId, facilityId);
    return ResponseEntity.noContent().build();
  }
}
