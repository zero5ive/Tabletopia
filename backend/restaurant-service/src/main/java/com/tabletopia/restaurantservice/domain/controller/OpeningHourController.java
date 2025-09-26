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

@RestController
@RequestMapping("/restaurant/opening-hours")
@RequiredArgsConstructor
public class OpeningHourController {

  private final OpeningHourService service;

  // 특정 레스토랑의 전체 운영시간 조회
  @GetMapping("/{restaurantId}")
  public ResponseEntity<List<OpeningHourResponse>> getOpeningHours(
      @PathVariable Long restaurantId
  ) {
    return ResponseEntity.ok(service.getOpeningHours(restaurantId));
  }
}
