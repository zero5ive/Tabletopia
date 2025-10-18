package com.tabletopia.restaurantservice.domain.restaurantFacility.controller;

import com.tabletopia.restaurantservice.domain.restaurantFacility.dto.RestaurantFacilityResponse;
import com.tabletopia.restaurantservice.domain.restaurantFacility.service.RestaurantFacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 관리자용 매장별 편의시설 컨트롤러
 * 매장에 연결된 편의시설 조회, 추가, 삭제 기능을 제공한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@RestController
@RequestMapping("/api/admin/restaurants/{restaurantId}/facilities")
public class AdminRestaurantFacilityController {

  private final RestaurantFacilityService restaurantFacilityService;

  public AdminRestaurantFacilityController(RestaurantFacilityService restaurantFacilityService) {
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

  /**
   * 매장에 새로운 편의시설 추가
   *
   * @param restaurantId 매장 ID
   * @param request facilityId 포함 요청 바디
   * @return 성공 시 200 OK
   */
  @PostMapping
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
  @DeleteMapping("/{facilityId}")
  public ResponseEntity<Void> removeFacility(
      @PathVariable Long restaurantId,
      @PathVariable Long facilityId
  ) {
    restaurantFacilityService.removeFacility(restaurantId, facilityId);
    return ResponseEntity.noContent().build();
  }
}
