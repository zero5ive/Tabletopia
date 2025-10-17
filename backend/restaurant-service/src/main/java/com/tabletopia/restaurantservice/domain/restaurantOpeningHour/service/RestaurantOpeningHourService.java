package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantOpeningHourRequest;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantOpeningHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.repository.RestaurantOpeningHourRepository;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity.RestaurantSpecialHour;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.repository.RestaurantSpecialHourRepository;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantEffectiveHourResponse;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 레스토랑 기본 운영시간 서비스
 *
 * 요일별 영업시간, 휴무 여부, 브레이크타임 등을 관리한다.
 * 기존 데이터를 삭제 후 새로 저장하는 방식으로 동작한다.
 *
 * 주요 기능:
 * 1. 기본 운영시간 조회
 * 2. 기본 운영시간 등록 및 수정 (시간 유효성 검사 포함)
 * 3. 특정 날짜 기준 실제 적용 영업시간 조회 (특별일 포함)
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantOpeningHourService {

  private final RestaurantOpeningHourRepository openingHourRepository;
  private final RestaurantRepository restaurantRepository;
  private final RestaurantSpecialHourRepository specialHourRepository;

  /** 매장의 기본 운영시간 전체 조회 */
  @Transactional(readOnly = true)
  public List<RestaurantOpeningHourResponse> getOpeningHours(Long restaurantId) {
    return openingHourRepository.findByRestaurantId(restaurantId).stream()
        .map(RestaurantOpeningHourResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * 매장의 기본 운영시간 전체 저장 (기존 데이터 삭제 후 재등록)
   *
   * 프론트에서 전달된 요일별 운영시간 정보를 모두 삭제 후 다시 저장한다.
   * 휴무일(isHoliday=true)은 모든 시간 필드를 null로 처리한다.
   * openTime < closeTime 이어야 하며,
   * 브레이크타임은 영업시간 범위 내에 포함되어야 한다.
   */
  public void saveOpeningHours(Long restaurantId, List<RestaurantOpeningHourRequest> requestList) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("해당 매장을 찾을 수 없습니다."));

    // 기존 데이터 삭제
    openingHourRepository.deleteByRestaurantId(restaurantId);

    if (requestList == null || requestList.isEmpty()) return;

    List<RestaurantOpeningHour> newHours = requestList.stream().map(req -> {

      // 휴무일이면 모든 시간은 null로 처리
      if (Boolean.TRUE.equals(req.getIsHoliday())) {
        return RestaurantOpeningHour.builder()
            .dayOfWeek(req.getDayOfWeek())
            .isHoliday(true)
            .openTime(null)
            .closeTime(null)
            .breakStartTime(null)
            .breakEndTime(null)
            .reservationInterval(req.getReservationInterval())
            .restaurant(restaurant)
            .build();
      }

      // 필수값 검증
      if (req.getOpenTime() == null || req.getCloseTime() == null) {
        throw new IllegalArgumentException("영업 시작 및 종료 시간은 필수입니다.");
      }

      // 시작시간은 종료시간보다 빨라야 함
      if (!req.getOpenTime().isBefore(req.getCloseTime())) {
        throw new IllegalArgumentException("영업 시작 시간은 종료 시간보다 빨라야 합니다.");
      }

      // 브레이크타임 검증
      if (req.getBreakStartTime() != null && req.getBreakEndTime() != null) {
        if (!req.getBreakStartTime().isBefore(req.getBreakEndTime())) {
          throw new IllegalArgumentException("브레이크 시작 시간은 종료 시간보다 빨라야 합니다.");
        }

        if (req.getBreakStartTime().isBefore(req.getOpenTime()) ||
            req.getBreakEndTime().isAfter(req.getCloseTime())) {
          throw new IllegalArgumentException("브레이크타임은 영업시간 범위 내에 있어야 합니다.");
        }
      }

      return RestaurantOpeningHour.builder()
          .dayOfWeek(req.getDayOfWeek())
          .isHoliday(false)
          .openTime(req.getOpenTime())
          .closeTime(req.getCloseTime())
          .breakStartTime(req.getBreakStartTime())
          .breakEndTime(req.getBreakEndTime())
          .reservationInterval(req.getReservationInterval())
          .restaurant(restaurant)
          .build();
    }).toList();

    openingHourRepository.saveAll(newHours);
  }

  /**
   * 특정 날짜 기준 실제 적용되는 영업시간 조회
   *
   * 1. 특별 운영시간이 있으면 우선 적용
   * 2. 없으면 요일별 기본 운영시간을 반환
   * 3. 둘 다 없으면 "운영시간 정보 없음" 반환
   */
  @Transactional(readOnly = true)
  public RestaurantEffectiveHourResponse getEffectiveHour(Long restaurantId, LocalDate date) {
    if (date == null) date = LocalDate.now();
    int dayOfWeek = date.getDayOfWeek().getValue();

    if (dayOfWeek == 7) dayOfWeek = 0; // 일요일은 0으로 보정

    // 기본 운영시간 조회
    // 예약 인터벌을 조회하고자 기본 운영시간을 조회
    RestaurantOpeningHour regular =
        openingHourRepository.findByRestaurantIdAndDayOfWeek(restaurantId, dayOfWeek);

    // 특별 운영시간 조회
    Optional<RestaurantSpecialHour> specialOpt =
        specialHourRepository.findByRestaurantIdAndSpecialDate(restaurantId, date);

    // 특별 운영시간이 있는 경우
    if (specialOpt.isPresent()) {
      RestaurantSpecialHour special = specialOpt.get();

      // specialInfo가 null 이거나 빈 문자열일 때 괄호 안 없애기
      String info = (special.getSpecialInfo() != null && !special.getSpecialInfo().isBlank())
          ? " (" + special.getSpecialInfo() + ")"
          : "";

      // 완전 휴무일 처리
      if (special.getIsClosed()) {
        return RestaurantEffectiveHourResponse.builder()
            .restaurantId(restaurantId)
            .date(date)
            .type("SPECIAL")
            .isClosed(true)
            .openTime(null)
            .closeTime(null)
            .message("특별휴무일" + info)
            .build();
      }

      // 단축/임시 운영일 처리 (시간 표시)
      return RestaurantEffectiveHourResponse.builder()
          .restaurantId(restaurantId)
          .date(date)
          .type("SPECIAL")
          .isClosed(false)
          .openTime(special.getIsClosed() ? null : special.getOpenTime())
          .reservationInterval(regular.getReservationInterval()) // 기본 운영시간의 예약 인터벌 추가
          .closeTime(special.getIsClosed() ? null : special.getCloseTime())
          .message("특별 운영시간 적용" + info)
          .build();
    }

    if (regular == null) {
      return RestaurantEffectiveHourResponse.builder()
          .restaurantId(restaurantId)
          .date(date)
          .type("NONE")
          .isClosed(true)
          .message("운영시간 정보 없음")
          .build();
    }

    // 정기휴무일
    if (Boolean.TRUE.equals(regular.getIsHoliday())) {
      return RestaurantEffectiveHourResponse.builder()
          .restaurantId(restaurantId)
          .date(date)
          .type("REGULAR")
          .isClosed(true)
          .openTime(null)
          .closeTime(null)
          .message("정기휴무일")
          .build();
    }

    // 일반일
    return RestaurantEffectiveHourResponse.builder()
        .restaurantId(restaurantId)
        .date(date)
        .type("REGULAR")
        .isClosed(false)
        .openTime(regular.getOpenTime())
        .reservationInterval(regular.getReservationInterval())
        .closeTime(regular.getCloseTime())
        .message(null)
        .build();
  }
}
