package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.controller;

import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourRequest;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.service.RestaurantSpecialHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자용 레스토랑 특별 운영시간 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/admin/restaurants/{restaurantId}/hours")
@RequiredArgsConstructor
public class AdminRestaurantSpecialHourController {

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

  /**
   * 특정 매장의 특별 운영시간 등록/수정
   *
   * @param restaurantId 매장 ID
   * @param requestList 프론트엔드에서 전달된 특별 운영시간 요청 리스트
   * @return 성공 메시지
   */
  @PostMapping("/special")
  public ResponseEntity<String> saveSpecialHours(
      @PathVariable Long restaurantId,
      @RequestBody List<RestaurantSpecialHourRequest> requestList) {

    specialHourService.saveSpecialHours(restaurantId, requestList);
    return ResponseEntity.ok("특별 운영시간이 성공적으로 저장되었습니다.");
  }
}
