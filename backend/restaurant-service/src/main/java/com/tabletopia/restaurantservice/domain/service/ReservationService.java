package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.TimeSlotResponse;
import com.tabletopia.restaurantservice.domain.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.repository.RestaurantOpeningHourRepository;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 예약 서비스
 * 특정 레스토랑의 요일별 운영 시간과 예약 간격을 기준으로
 * 예약 가능한 시간 슬롯을 계산하여 반환한다.
 * @author 김지민
 * @since 2025-09-26
 */
@Service
@RequiredArgsConstructor
public class ReservationService {

  private final RestaurantOpeningHourRepository repository;

  /**
   * 예약 가능한 슬롯 조회
   * @param restaurantId 레스토랑 ID
   * @param dayOfWeek 요일 (0=일요일 ~ 6=토요일)
   * @return 예약 가능한 시간 구간 리스트 (시작~종료 시간)
   * @throws RuntimeException 해당 레스토랑의 운영 시간이 없을 때
   * @throws IllegalStateException 운영 시간(Open/Close)이 등록되지 않았을 때
   * @throws IllegalArgumentException 예약 간격이 0 이하일 때
   */
  public List<TimeSlotResponse> getAvailableSlots(Long restaurantId, int dayOfWeek) {
    // 1. DB에서 레스토랑 운영 시간 조회 (없으면 예외)
    RestaurantOpeningHour openingHour = repository
        .findByRestaurantIdAndDayOfWeek(restaurantId, dayOfWeek)
        .orElseThrow(() -> new RuntimeException("해당 레스토랑의 운영시간이 없습니다."));

    // 2. 휴무일이면 빈 리스트 반환
    if (Boolean.TRUE.equals(openingHour.getIsHoliday())) {
      return List.of();
    }

    // 3. 오픈/마감 시간이 없으면 예외
    if (openingHour.getOpenTime() == null || openingHour.getCloseTime() == null) {
      throw new IllegalStateException("운영시간이 등록되지 않았습니다.");
    }

    // 4. 예약 간격 유효성 검사
    int interval = openingHour.getReservationInterval();
    if (interval <= 0) {
      throw new IllegalArgumentException("예약 간격이 잘못되었습니다: " + interval);
    }

    LocalTime open = openingHour.getOpenTime();
    LocalTime close = openingHour.getCloseTime();

    // 5. 예약 가능 슬롯 생성
    List<TimeSlotResponse> slots = new ArrayList<>();
    LocalTime current = open;

    while (current.isBefore(close)) {
      LocalTime next = current.plusMinutes(interval);

      // 마지막 슬롯이 종료 시간을 넘어가면 중단
      if (next.isAfter(close)) {
        break;
      }

      // 시작~종료 시간 구간을 슬롯으로 추가
      slots.add(new TimeSlotResponse(current.toString(), next.toString()));

      // 다음 슬롯 계산을 위해 current 이동
      current = next;
    }

    return slots;
  }
}
