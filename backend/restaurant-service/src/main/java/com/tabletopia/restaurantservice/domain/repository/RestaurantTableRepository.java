package com.tabletopia.restaurantservice.domain.repository;

import com.tabletopia.restaurantservice.domain.entity.RestaurantTable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 레스토랑 테이블 Repository
 * restaurant_table 테이블과 매핑된 엔티티에 대한 CRUD 및
 * 커스텀 조회 기능을 제공한다.
 * @author 김지민
 * @since 2025-09-26
 */
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

  /**
   * 특정 레스토랑의 모든 테이블을 조회한다.
   * @param restaurantId 레스토랑 ID
   * @return 해당 레스토랑에 등록된 테이블 리스트
   */
  List<RestaurantTable> findByRestaurantId(Long restaurantId);
}
