package com.tabletopia.restaurantservice.domain.facility.controller;

import com.tabletopia.restaurantservice.domain.facility.dto.FacilityResponse;
import com.tabletopia.restaurantservice.domain.facility.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 편의시설 관련 요청을 처리하는 컨트롤러
 *
 * 공통 마스터 테이블인 Facility 데이터를 조회하는 기능을 제공한다.
 * 프론트엔드에서는 매장 등록 또는 수정 시
 * 선택 가능한 편의시설 목록을 불러올 때 사용한다.
 *
 * - GET /api/facilities : 전체 편의시설 목록 조회
 *
 * @author 김지민
 * @since 2025-10-14
 */
@RestController
@RequestMapping("/api/user/facilities")
public class FacilityController {

  private final FacilityService facilityService;

  public FacilityController(FacilityService facilityService) {
    this.facilityService = facilityService;
  }

  /**
   * 전체 편의시설 목록 조회
   *
   * @return 편의시설 목록 DTO 리스트
   */
  @GetMapping
  public ResponseEntity<List<FacilityResponse>> getAllFacilities() {
    List<FacilityResponse> response = facilityService.getAllFacilities();
    return ResponseEntity.ok(response);
  }
}
