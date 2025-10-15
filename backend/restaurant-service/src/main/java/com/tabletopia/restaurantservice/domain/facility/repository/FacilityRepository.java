package com.tabletopia.restaurantservice.domain.facility.repository;

import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 편의시설 마스터 데이터에 접근하는 레포지토리
 *
 * Facility 엔티티에 대한 기본 CRUD 기능을 제공한다.
 * 추가적인 쿼리 메서드는 필요 시 정의한다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
