package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.controller;

import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourRequest;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.service.RestaurantSpecialHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 레스토랑 특별 운영시간 컨트롤러
 *
 * - 특정 날짜(명절, 휴무일 등)의 임시 영업시간을 관리하는 REST API
 * - /restaurant/api/hours/special 하위 엔드포인트로 구성됨
 *
 * 주요 기능:
 * 1. 매장의 특별 운영시간 조회 (GET)
 * 2. 매장의 특별 운영시간 등록/수정 (POST)
 *
 * 예시:
 * GET  /restaurant/api/hours/special/{restaurantId}
 * POST /restaurant/api/hours/special/{restaurantId}
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/hours/special")
@RequiredArgsConstructor
public class RestaurantSpecialHourController {

  private final RestaurantSpecialHourService specialHourService;

  /**
   * 특정 매장의 특별 운영시간 전체 조회
   *
   * @param restaurantId 매장 ID
   * @return 해당 매장의 특별 운영시간 리스트
   */
  @GetMapping("/{restaurantId}")
  public ResponseEntity<List<RestaurantSpecialHourResponse>> getSpecialHours(
      @PathVariable Long restaurantId) {

    List<RestaurantSpecialHourResponse> result = specialHourService.getSpecialHours(restaurantId);
    return ResponseEntity.ok(result);
  }

  /**
   * 특정 매장의 특별 운영시간 등록/수정
   *
   * 기존 데이터를 삭제하고 전달받은 요청 리스트로 재등록한다.
   *
   * @param restaurantId 매장 ID
   * @param requestList 프론트엔드에서 전달된 특별 운영시간 요청 리스트
   * @return 성공 메시지
   */
  @PostMapping("/{restaurantId}")
  public ResponseEntity<String> saveSpecialHours(
      @PathVariable Long restaurantId,
      @RequestBody List<RestaurantSpecialHourRequest> requestList) {

    specialHourService.saveSpecialHours(restaurantId, requestList);
    return ResponseEntity.ok(" 특별 운영시간이 성공적으로 저장되었습니다.");
  }
}
