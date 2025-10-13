package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.repository;

import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity.RestaurantSpecialHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 레스토랑 특별 운영시간 Repository
 * 특정 날짜의 임시 운영시간 또는 휴무 정보를 관리한다.
 */
@Repository
public interface RestaurantSpecialHourRepository extends JpaRepository<RestaurantSpecialHour, Long> {

  /** 특정 레스토랑의 모든 특별 운영시간 조회 */
  List<RestaurantSpecialHour> findByRestaurantId(Long restaurantId);

  /** 특정 레스토랑의 특정 날짜 특별 운영시간 조회 */
  Optional<RestaurantSpecialHour> findByRestaurantIdAndSpecialDate(Long restaurantId, LocalDate specialDate);

  /** 특정 레스토랑의 모든 특별 운영시간 삭제 (물리 삭제) */
  @Modifying
  @Query("DELETE FROM RestaurantSpecialHour r WHERE r.restaurant.id = :restaurantId")
  void deleteByRestaurantId(@Param("restaurantId") Long restaurantId);
}
