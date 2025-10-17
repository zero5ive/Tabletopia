package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.controller;

import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.service.RestaurantSpecialHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자용 레스토랑 특별 운영시간 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/hours")
@RequiredArgsConstructor
public class UserRestaurantSpecialHourController {

  private final RestaurantSpecialHourService specialHourService;

  /**
   * 특정 매장의 특별 운영시간 전체 조회
   *
   * @param restaurantId 매장 ID
   * @return 해당 매장의 특별 운영시간 리스트
   */
  @GetMapping("/special")
  public ResponseEntity<List<RestaurantSpecialHourResponse>> getSpecialHours(
      @PathVariable Long restaurantId) {

    List<RestaurantSpecialHourResponse> result = specialHourService.getSpecialHours(restaurantId);
    return ResponseEntity.ok(result);
  }
}
