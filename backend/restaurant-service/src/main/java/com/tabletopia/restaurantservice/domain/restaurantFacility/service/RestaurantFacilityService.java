package com.tabletopia.restaurantservice.domain.restaurantFacility.service;

import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import com.tabletopia.restaurantservice.domain.facility.repository.FacilityRepository;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantFacility.dto.RestaurantFacilityResponse;
import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import com.tabletopia.restaurantservice.domain.restaurantFacility.repository.RestaurantFacilityRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 매장별 편의시설 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 주요 기능:
 * - 특정 매장의 편의시설 목록 조회
 * - 매장에 새 시설 추가
 * - 매장에서 시설 제거
 *
 * 매장(Restaurant)과 편의시설(Facility) 간의 중간 테이블을 관리한다.
 * 별도의 활성/비활성 상태(isActive)는 없으며, 단순 추가/삭제로만 관리한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Service
public class RestaurantFacilityService {

  private final RestaurantFacilityRepository restaurantFacilityRepository;
  private final FacilityRepository facilityRepository;
  private final RestaurantRepository restaurantRepository;

  public RestaurantFacilityService(
      RestaurantFacilityRepository restaurantFacilityRepository,
      FacilityRepository facilityRepository,
      RestaurantRepository restaurantRepository
  ) {
    this.restaurantFacilityRepository = restaurantFacilityRepository;
    this.facilityRepository = facilityRepository;
    this.restaurantRepository = restaurantRepository;
  }

  /**
   * 특정 매장의 편의시설 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 등록된 편의시설 목록 DTO
   */
  public List<RestaurantFacilityResponse> getFacilitiesByRestaurant(Long restaurantId) {
    List<RestaurantFacility> list = restaurantFacilityRepository.findByRestaurantId(restaurantId);
    return list.stream()
        .map(RestaurantFacilityResponse::new)
        .toList();
  }

  /**
   * 매장에 새로운 시설 추가
   *
   * @param restaurantId 매장 ID
   * @param facilityId 시설 ID
   */
  @Transactional
  public void addFacility(Long restaurantId, Long facilityId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 매장을 찾을 수 없습니다."));
    Facility facility = facilityRepository.findById(facilityId)
        .orElseThrow(() -> new IllegalArgumentException("해당 시설을 찾을 수 없습니다."));

    // 중복 등록 방지
    boolean exists = restaurantFacilityRepository.findByRestaurantId(restaurantId).stream()
        .anyMatch(rf -> rf.getFacility().getId().equals(facilityId));

    if (exists) {
      throw new IllegalStateException("이미 등록된 시설입니다.");
    }

    RestaurantFacility entity = new RestaurantFacility();
    entity.setRestaurant(restaurant);
    entity.setFacility(facility);
    restaurantFacilityRepository.save(entity);
  }

  /**
   * 매장에서 특정 시설 삭제
   *
   * @param restaurantId 매장 ID
   * @param facilityId 시설 ID
   */
  @Transactional
  public void removeFacility(Long restaurantId, Long facilityId) {
    restaurantFacilityRepository.deleteByRestaurantIdAndFacilityId(restaurantId, facilityId);
  }
}
