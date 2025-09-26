package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.OpeningHourResponse;
import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.repository.RestaurantOpeningHourRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 레스토랑 운영 시간 Service
 * RestaurantOpeningHour 엔티티를 조회하여
 * OpeningHourResponse DTO로 변환하는 비즈니스 로직을 담당한다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: Repository에서 조회한 엔티티를 DTO로 매핑하여
 *       Controller에서 바로 사용할 수 있도록 가공한다.
 */
@Service
@RequiredArgsConstructor
public class OpeningHourService {

  private final RestaurantOpeningHourRepository repository;

  /**
   * 특정 레스토랑의 전체 운영 시간을 조회한다.
   * @param restaurantId 레스토랑 ID
   * @return 요일별 운영 시간 리스트 (OpeningHourResponse DTO)
   */
  public List<OpeningHourResponse> getOpeningHours(Long restaurantId) {
    List<RestaurantOpeningHour> hours = repository.findByRestaurantId(restaurantId);

    return hours.stream()
        .map(this::toResponse)
        .toList();
  }

  /**
   * RestaurantOpeningHour 엔티티를 OpeningHourResponse DTO로 변환한다.
   * @param entity RestaurantOpeningHour 엔티티
   * @return OpeningHourResponse DTO
   */
  private OpeningHourResponse toResponse(RestaurantOpeningHour entity) {
    return new OpeningHourResponse(
        entity.getRestaurant().getId(),
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
