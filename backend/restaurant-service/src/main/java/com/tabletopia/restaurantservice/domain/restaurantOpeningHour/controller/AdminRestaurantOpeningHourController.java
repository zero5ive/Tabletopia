package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.controller;

import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantOpeningHourRequest;
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
 * 관리자용 레스토랑 기본 운영시간 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/admin/restaurants/{restaurantId}/hours")
@RequiredArgsConstructor
public class AdminRestaurantOpeningHourController {

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
   * 특정 매장의 기본 운영시간 등록 및 수정
   *
   * @param restaurantId 매장 ID
   * @param requestList 프론트엔드에서 전달된 운영시간 요청 리스트
   * @return 성공 메시지
   */
  @PostMapping("/opening")
  public ResponseEntity<String> saveOpeningHours(
      @PathVariable Long restaurantId,
      @RequestBody List<RestaurantOpeningHourRequest> requestList) {

    openingHourService.saveOpeningHours(restaurantId, requestList);
    return ResponseEntity.ok("기본 운영시간이 성공적으로 저장되었습니다.");
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
