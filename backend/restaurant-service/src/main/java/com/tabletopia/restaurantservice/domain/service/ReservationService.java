package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.TimeSlotResponse;
import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.repository.RestaurantOpeningHourRepository;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

  private final RestaurantOpeningHourRepository repository;

  public List<TimeSlotResponse> getAvailableSlots(Long restaurantId, int dayOfWeek) {
    RestaurantOpeningHour openingHour = repository
        .findByRestaurantIdAndDayOfWeek(restaurantId, dayOfWeek)
        .orElseThrow(() -> new RuntimeException("해당 레스토랑의 운영시간이 없습니다."));

    if (Boolean.TRUE.equals(openingHour.getIsHoliday())) {
      return List.of();
    }

    if (openingHour.getOpenTime() == null || openingHour.getCloseTime() == null) {
      throw new IllegalStateException("운영시간이 등록되지 않았습니다.");
    }

    int interval = openingHour.getReservationInterval();
    if (interval <= 0) {
      throw new IllegalArgumentException("예약 간격이 잘못되었습니다: " + interval);
    }

    LocalTime open = openingHour.getOpenTime();
    LocalTime close = openingHour.getCloseTime();

    List<TimeSlotResponse> slots = new ArrayList<>();
    LocalTime current = open;

    while (current.isBefore(close)) {
      LocalTime next = current.plusMinutes(interval);

      // next가 close를 넘어가면 종료
      if (next.isAfter(close)) {
        break;
      }

      slots.add(new TimeSlotResponse(current.toString(), next.toString()));
      current = next;
    }

    return slots;
  }
}
