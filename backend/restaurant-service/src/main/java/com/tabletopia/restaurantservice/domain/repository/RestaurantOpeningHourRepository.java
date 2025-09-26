package com.tabletopia.restaurantservice.domain.repository;

import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 레스토랑 운영 시간 Repository
 * restaurant_opening_hour 테이블과 매핑된 엔티티에 대한 CRUD 및
 * 커스텀 조회 기능을 제공한다.
 * @author 김지민
 * @since 2025-09-26
 */
public interface RestaurantOpeningHourRepository extends JpaRepository<RestaurantOpeningHour, Long> {

  /**
   * 레스토랑의 전체 운영 시간을 조회한다.
   * @param restaurantId 레스토랑 ID
   * @return 요일별 운영 시간 리스트
   */
  List<RestaurantOpeningHour> findByRestaurantId(Long restaurantId);

  /**
   * 특정 레스토랑의 특정 요일 운영 시간을 조회한다.
   * @param restaurantId 레스토랑 ID
   * @param dayOfWeek 요일 (0=일요일 ~ 6=토요일)
   * @return 해당 요일의 운영 시간 (없으면 Optional.empty())
   */
  Optional<RestaurantOpeningHour> findByRestaurantIdAndDayOfWeek(Long restaurantId, int dayOfWeek);
}
