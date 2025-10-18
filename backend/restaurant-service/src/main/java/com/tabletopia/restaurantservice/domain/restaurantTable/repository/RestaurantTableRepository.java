package com.tabletopia.restaurantservice.domain.restaurantTable.repository;

import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
  List<RestaurantTable> findByRestaurantId(Long restaurantId);


  void deleteByRestaurantId(Long restaurantId);
}
