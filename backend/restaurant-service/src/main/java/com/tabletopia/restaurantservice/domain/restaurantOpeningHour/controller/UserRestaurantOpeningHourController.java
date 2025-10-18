package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.controller;

import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantOpeningHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantEffectiveHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.service.RestaurantOpeningHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 사용자용 레스토랑 기본 운영시간 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/hours")
@RequiredArgsConstructor
public class UserRestaurantOpeningHourController {

  private final RestaurantOpeningHourService openingHourService;

  /**
   * 특정 매장의 기본 운영시간 전체 조회
   *
   * @param restaurantId 매장 ID
   * @return 운영시간 리스트
   */
  @GetMapping("/opening")
  public ResponseEntity<List<RestaurantOpeningHourResponse>> getOpeningHours(
      @PathVariable Long restaurantId) {

    List<RestaurantOpeningHourResponse> result = openingHourService.getOpeningHours(restaurantId);
    return ResponseEntity.ok(result);
  }

  /**
   * 특정 날짜의 실제 영업시간 조회 (특별 운영시간 포함)
   *
   * @param restaurantId 매장 ID
   * @param date 조회 날짜 (없으면 오늘 날짜로 기본 처리)
   * @return 실제 적용되는 운영시간 정보
   */
  @GetMapping("/effective")
  public ResponseEntity<RestaurantEffectiveHourResponse> getEffectiveHours(
      @PathVariable Long restaurantId,
      @RequestParam(name = "date", required = false)
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
      LocalDate date) {

    RestaurantEffectiveHourResponse result = openingHourService.getEffectiveHour(restaurantId, date);
    return ResponseEntity.ok(result);
  }
}
