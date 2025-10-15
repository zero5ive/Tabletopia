package com.tabletopia.restaurantservice.domain.restaurant.repository;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * RestaurantRepository
 * 레스토랑 엔티티에 대한 데이터베이스 접근을 담당한다.
 * Spring Data JPA를 사용하여 기본적인 CRUD 메서드를 자동으로 제공
 * @author 김지민
 * @since 2025-10-09
 */
//@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, RestaurantRepositoryCustom {

  Page<Restaurant> findByRestaurantCategory(RestaurantCategory category, Pageable pageable);


}
