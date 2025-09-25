package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.RestaurantTableDTO;
import com.tabletopia.restaurantservice.domain.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

  private final RestaurantTableRepository tableRepository;

  public List<RestaurantTableDTO> getTablesByRestaurant(Long restaurantId) {
    return tableRepository.findByRestaurantId(restaurantId)
        .stream()
        .map(table -> RestaurantTableDTO.builder()
            .id(table.getId())
            .name(table.getName())
            .minCapacity(table.getMinCapacity())
            .maxCapacity(table.getMaxCapacity())
            .xPosition(table.getXPosition())
            .yPosition(table.getYPosition())
            .shape(table.getShape())
            .build()
        )
        .toList();
  }
}