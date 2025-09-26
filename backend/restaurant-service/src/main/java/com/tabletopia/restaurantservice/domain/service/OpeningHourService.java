package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.OpeningHourResponse;
import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.repository.RestaurantOpeningHourRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OpeningHourService {

  private final RestaurantOpeningHourRepository repository;

  public List<OpeningHourResponse> getOpeningHours(Long restaurantId) {
    List<RestaurantOpeningHour> hours = repository.findByRestaurantId(restaurantId);

    return hours.stream()
        .map(this::toResponse)
        .toList();
  }

  private OpeningHourResponse toResponse(RestaurantOpeningHour entity) {
    return new OpeningHourResponse(
        entity.getRestaurantId(),
        entity.getDayOfWeek(),
        entity.getOpenTime() != null ? entity.getOpenTime().toString() : null,
        entity.getCloseTime() != null ? entity.getCloseTime().toString() : null,
        entity.getBreakStartTime() != null ? entity.getBreakStartTime().toString() : null,
        entity.getBreakEndTime() != null ? entity.getBreakEndTime().toString() : null,
        entity.getReservationInterval(),
        Boolean.TRUE.equals(entity.getIsHoliday())
    );
  }
}
