package com.tabletopia.restaurantservice.domain.restaurantFacility.repository;

import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 매장별 편의시설 데이터 접근 레포지토리
 *
 * RestaurantFacility 엔티티에 대한 기본 CRUD 및
 * 매장별 시설 조회, 특정 시설 삭제 기능을 제공한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Repository
public interface RestaurantFacilityRepository extends JpaRepository<RestaurantFacility, Long> {

  /**
   * 특정 매장의 모든 편의시설 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 연결된 편의시설 리스트
   */
  List<RestaurantFacility> findByRestaurantId(Long restaurantId);

  /**
   * 매장에서 특정 시설 삭제
   *
   * @param restaurantId 매장 ID
   * @param facilityId 시설 ID
   */
  void deleteByRestaurantIdAndFacilityId(Long restaurantId, Long facilityId);
}
