package com.tabletopia.restaurantservice.domain.controller;

import com.tabletopia.restaurantservice.domain.dto.TimeSlotResponse;
import com.tabletopia.restaurantservice.domain.service.ReservationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 레스토랑 예약 관리 컨트롤러
 * 특정 레스토랑의 예약 가능 시간 슬롯을 조회할 수 있는 API를 제공한다.
 * @author 김지민
 * @since 2025-09-26
 */
@RestController
@RequestMapping("/restaurant/reservations")
@RequiredArgsConstructor
public class ReservationController {

  private final ReservationService service;

  /**
   * 특정 레스토랑, 특정 요일의 예약 가능 슬롯 조회
   * @param restaurantId 조회할 레스토랑의 고유 ID
   * @param dayOfWeek 조회할 요일 (0=일요일, 6=토요일)
   * @return ResponseEntity<List<TimeSlotResponse>> 예약 가능한 시간 슬롯 목록
   * @throws IllegalArgumentException restaurantId가 유효하지 않거나 dayOfWeek 값이 0~6 범위를 벗어난 경우
   * @author 김지민
   * @since 2025-09-26
   */
  @GetMapping("/{restaurantId}/{dayOfWeek}")
  public ResponseEntity<List<TimeSlotResponse>> getSlots(
      @PathVariable Long restaurantId,
      @PathVariable int dayOfWeek
  ) {
    return ResponseEntity.ok(service.getAvailableSlots(restaurantId, dayOfWeek));
  }
}
