package com.tabletopia.restaurantservice.domain.facility.repository;

import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 편의시설 마스터 데이터에 접근하는 레포지토리
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
