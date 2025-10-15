package com.tabletopia.restaurantservice.domain.restaurantImage.repository;

import com.tabletopia.restaurantservice.domain.restaurantImage.entity.RestaurantImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 매장 이미지 관련 데이터베이스 접근 레포지토리
 *
 * 매장별 이미지 목록 조회 및 CRUD 연산을 처리한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
public interface RestaurantImageRepository extends JpaRepository<RestaurantImage, Long> {
  List<RestaurantImage> findByRestaurantIdOrderBySortOrderAsc(Long restaurantId);
}
