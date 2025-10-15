package com.tabletopia.restaurantservice.domain.facility.service;

import com.tabletopia.restaurantservice.domain.facility.dto.FacilityResponse;
import com.tabletopia.restaurantservice.domain.facility.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 편의시설 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * Facility 마스터 테이블에 대한 조회 로직을 담당하며,
 * 모든 시설 목록을 클라이언트에 전달 가능한 DTO 형태로 변환한다.
 *
 * @author 김지민
 * @since 2025-10-14
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
   * @return FacilityResponse DTO 리스트
   */
  public List<FacilityResponse> getAllFacilities() {
    return facilityRepository.findAll().stream()
        .map(FacilityResponse::new)
        .toList();
  }
}
