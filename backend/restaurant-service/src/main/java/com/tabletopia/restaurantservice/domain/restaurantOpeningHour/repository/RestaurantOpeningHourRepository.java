package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.repository;

import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 레스토랑 운영시간 Repository
 * 특정 레스토랑의 요일별 기본 운영시간 정보를 관리한다.
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Repository
public interface RestaurantOpeningHourRepository extends JpaRepository<RestaurantOpeningHour, Long> {

  /**
   * 특정 레스토랑의 모든 운영시간 조회
   *
   * @param restaurantId 매장 ID
   * @return 운영시간 리스트
   */
  List<RestaurantOpeningHour> findByRestaurantId(Long restaurantId);

  /**
   * 특정 레스토랑의 특정 요일 운영시간 조회
   *
   * @param restaurantId 매장 ID
   * @param dayOfWeek 요일 (0=일요일, 1=월요일, ... 6=토요일)
   * @return 해당 요일의 운영시간
   */
  RestaurantOpeningHour findByRestaurantIdAndDayOfWeek(Long restaurantId, int dayOfWeek);

  /**
   * 특정 레스토랑의 모든 운영시간 삭제 (기존 데이터 초기화용)
   *
   * @param restaurantId 매장 ID
   */
  @Modifying
  @Query("DELETE FROM RestaurantOpeningHour r WHERE r.restaurant.id = :restaurantId")
  void deleteByRestaurantId(@Param("restaurantId") Long restaurantId);
}
