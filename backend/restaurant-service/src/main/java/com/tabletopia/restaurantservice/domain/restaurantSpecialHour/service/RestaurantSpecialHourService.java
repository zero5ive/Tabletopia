package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourRequest;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.dto.RestaurantSpecialHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity.RestaurantSpecialHour;
import com.tabletopia.restaurantservice.domain.restaurantSpecialHour.repository.RestaurantSpecialHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 레스토랑 특별 운영시간 서비스
 * 특정 날짜(명절, 휴무일 등)의 임시 영업시간을 관리한다.

 * 주요 기능:
 * 1. 매장의 특별 운영시간 조회 (GET)
 * 2. 매장의 특별 운영시간 등록/수정 (POST)

 * 처리 방식:
 * - 기존 데이터는 모두 삭제 후 전달받은 요청 리스트로 재등록한다.
 * - 휴무일인 경우(openTime, closeTime은 null로 저장)

 * 예시:
 * GET  /restaurant/api/hours/special/{restaurantId}
 * POST /restaurant/api/hours/special/{restaurantId}
 * @author 김지민
 * @since 2025-10-13
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantSpecialHourService {

  private final RestaurantSpecialHourRepository specialHourRepository;
  private final RestaurantRepository restaurantRepository;

  /** 매장의 특별 운영시간 전체 조회 */
  public List<RestaurantSpecialHourResponse> getSpecialHours(Long restaurantId) {
    return specialHourRepository.findByRestaurantId(restaurantId).stream()
        .map(RestaurantSpecialHourResponse::fromEntity)
        .peek(dto -> {
          if (Boolean.TRUE.equals(dto.getIsClosed())) {
            dto.setOpenTime(null);
            dto.setCloseTime(null);
          }
        })
        .collect(Collectors.toList());
  }

  /** 매장의 특별 운영시간 전체 저장 (기존 데이터 삭제 후 재등록) */
  public void saveSpecialHours(Long restaurantId, List<RestaurantSpecialHourRequest> requestList) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 매장을 찾을 수 없습니다. ID=" + restaurantId));

    // 기존 데이터 삭제
    specialHourRepository.deleteByRestaurantId(restaurantId);

    if (requestList == null || requestList.isEmpty()) return;

    List<RestaurantSpecialHour> entities = requestList.stream()
        .map(req -> RestaurantSpecialHour.builder()
            .restaurant(restaurant)
            .specialDate(req.getSpecialDate())
            .openTime(req.getIsClosed() ? null : req.getOpenTime())
            .closeTime(req.getIsClosed() ? null : req.getCloseTime())
            .isClosed(req.getIsClosed())
            .specialInfo(req.getSpecialInfo())
            .build())
        .collect(Collectors.toList());

    specialHourRepository.saveAll(entities);
  }
}
