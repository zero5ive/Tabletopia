package com.tabletopia.restaurantservice.domain.repository;

import com.tabletopia.restaurantservice.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * RestaurantRepository
 * 레스토랑 엔티티에 대한 데이터베이스 접근을 담당한다.
 * Spring Data JPA를 사용하여 기본적인 CRUD 메서드를 자동으로 제공
 * @author 김지민
 * @since 2025-10-09
 */
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
