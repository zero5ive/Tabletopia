package com.tabletopia.restaurantservice.domain.facility.service;

import com.tabletopia.restaurantservice.domain.facility.dto.FacilityResponse;
import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import com.tabletopia.restaurantservice.domain.facility.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 편의시설 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Service
public class FacilityService {

  private final FacilityRepository facilityRepository;

  public FacilityService(FacilityRepository facilityRepository) {
    this.facilityRepository = facilityRepository;
  }

  /**
   * 전체 편의시설 목록 조회
   *
   * @return FacilityResponseDto 리스트
   */
  public List<FacilityResponse> getAllFacilities() {
    List<Facility> facilities = facilityRepository.findAll();
    return facilities.stream()
        .map(FacilityResponse::new)
        .toList();
  }
}
