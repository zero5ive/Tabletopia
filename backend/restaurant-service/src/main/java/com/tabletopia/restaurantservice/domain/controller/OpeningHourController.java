package com.tabletopia.restaurantservice.domain.controller;

import com.tabletopia.restaurantservice.domain.dto.OpeningHourResponse;
import com.tabletopia.restaurantservice.domain.service.OpeningHourService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 레스토랑 운영시간 관리 컨트롤러
 * 특정 레스토랑의 전체 운영시간을 조회할 수 있는 API를 제공한다.
 *
 * @author 김지민
 * @since 2025-09-26
 */
@RestController
@RequestMapping("/restaurant/opening-hours")
@RequiredArgsConstructor
public class OpeningHourController {

  private final OpeningHourService service;

  /**
   * 특정 레스토랑의 전체 운영시간 조회
   * @param restaurantId 조회할 레스토랑의 고유 ID
   * @return ResponseEntity<List<OpeningHourResponse>> 레스토랑의 운영시간 리스트
   * @throws IllegalArgumentException restaurantId가 null이거나 잘못된 경우
   * @author 김지민
   * @since 2025-09-26
   */
  @GetMapping("/{restaurantId}")
  public ResponseEntity<List<OpeningHourResponse>> getOpeningHours(
      @PathVariable Long restaurantId
  ) {
    return ResponseEntity.ok(service.getOpeningHours(restaurantId));
  }
}
