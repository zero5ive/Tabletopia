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

@RestController
@RequestMapping("/restaurant/reservations")
@RequiredArgsConstructor
public class ReservationController {

  private final ReservationService service;

  // 특정 레스토랑, 특정 요일의 예약 가능 슬롯 조회
  @GetMapping("/{restaurantId}/{dayOfWeek}")
  public ResponseEntity<List<TimeSlotResponse>> getSlots(
      @PathVariable Long restaurantId,
      @PathVariable int dayOfWeek
  ) {
    return ResponseEntity.ok(service.getAvailableSlots(restaurantId, dayOfWeek));
  }
}