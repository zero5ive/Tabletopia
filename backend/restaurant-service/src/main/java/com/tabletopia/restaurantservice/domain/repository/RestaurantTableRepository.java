package com.tabletopia.restaurantservice.domain.repository;

import com.tabletopia.restaurantservice.domain.entity.RestaurantTable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
  // 특정 레스토랑의 모든 테이블 조회
  List<RestaurantTable> findByRestaurantId(Long restaurantId);
}
