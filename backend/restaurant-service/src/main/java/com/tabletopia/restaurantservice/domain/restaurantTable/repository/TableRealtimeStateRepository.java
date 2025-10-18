package com.tabletopia.restaurantservice.domain.restaurantTable.repository;

import com.tabletopia.restaurantservice.domain.restaurantTable.entity.TableRealtimeState;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 실시간 테이블 상태 Repository
 *
 * @author 서예닮
 * @since 2025-10-18
 */
@Repository
public interface TableRealtimeStateRepository extends JpaRepository<TableRealtimeState, Long> {

  /**
   * restaurant_table_id로 실시간 테이블 상태 조회
   * (UNIQUE 제약 조건이 있으므로 Optional 반환)
   */
  Optional<TableRealtimeState> findByRestaurantTableId(Long restaurantTableId);

  /**
   * restaurant_table_id로 실시간 테이블 상태 삭제
   */
  void deleteByRestaurantTableId(Long restaurantTableId);
}
