package com.tabletopia.restaurantservice.domain.facility.controller;

import com.tabletopia.restaurantservice.domain.facility.dto.FacilityResponse;
import com.tabletopia.restaurantservice.domain.facility.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 편의시설 관련 요청을 처리하는 컨트롤러
 *
 * @author 김지민
 * @since 2025-10-13
 */
@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

  private final FacilityService facilityService;

  public FacilityController(FacilityService facilityService) {
    this.facilityService = facilityService;
  }

  /**
   * 전체 편의시설 목록 조회
   *
   * @return 편의시설 응답 DTO 리스트
   */
  @GetMapping
  public ResponseEntity<List<FacilityResponse>> getAllFacilities() {
    List<FacilityResponse> response = facilityService.getAllFacilities();
    return ResponseEntity.ok(response);
  }
}
