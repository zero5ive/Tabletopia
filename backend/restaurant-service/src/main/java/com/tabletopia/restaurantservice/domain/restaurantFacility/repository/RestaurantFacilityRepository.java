package com.tabletopia.restaurantservice.domain.restaurantFacility.repository;

import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 매장별 편의시설 데이터 접근 레포지토리
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Repository
public interface RestaurantFacilityRepository extends JpaRepository<RestaurantFacility, Long> {

  List<RestaurantFacility> findByRestaurantId(Long restaurantId);

  void deleteByRestaurantIdAndFacilityId(Long restaurantId, Long facilityId);

}
