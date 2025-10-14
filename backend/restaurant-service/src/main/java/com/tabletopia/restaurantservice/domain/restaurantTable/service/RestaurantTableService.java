package com.tabletopia.restaurantservice.domain.restaurantTable.service;

import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

  private final RestaurantTableRepository restaurantTableRepository;

  public List<RestaurantTable> getTablesByRestaurant(Long restaurantId) {
    return restaurantTableRepository.findByRestaurantId(restaurantId);
  }
}
