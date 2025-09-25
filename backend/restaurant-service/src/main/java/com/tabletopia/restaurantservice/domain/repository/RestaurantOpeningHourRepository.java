package com.tabletopia.restaurantservice.domain.repository;

import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantOpeningHourRepository extends JpaRepository<RestaurantOpeningHour, Long> {

  // 레스토랑 전체 운영시간 조회 (요일별 다수 반환)
  List<RestaurantOpeningHour> findByRestaurantId(Long restaurantId);

  // 특정 레스토랑의 특정 요일 운영시간 조회
  Optional<RestaurantOpeningHour> findByRestaurantIdAndDayOfWeek(Long restaurantId, int dayOfWeek);
}
