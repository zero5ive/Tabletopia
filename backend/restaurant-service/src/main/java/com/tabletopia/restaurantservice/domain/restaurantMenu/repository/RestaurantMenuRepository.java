package com.tabletopia.restaurantservice.domain.restaurantMenu.repository;

import com.tabletopia.restaurantservice.domain.restaurantMenu.entity.RestaurantMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 레스토랑 메뉴 레포지토리
 * 메뉴 관련 CRUD 및 매장별 조회 기능을 제공한다.
 * Soft Delete(@SQLDelete, @Where)로 인해 삭제된 메뉴는 자동으로 제외된다.
 * @author 김지민
 * @since 2025-10-10
 */
@Repository
public interface RestaurantMenuRepository extends JpaRepository<RestaurantMenu, Long> {

  /** 특정 매장의 메뉴 목록 조회 */
  List<RestaurantMenu> findByRestaurantId(Long restaurantId);
}
