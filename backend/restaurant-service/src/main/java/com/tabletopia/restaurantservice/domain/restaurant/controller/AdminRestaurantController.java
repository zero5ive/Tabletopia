package com.tabletopia.restaurantservice.domain.restaurant.controller;

import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.service.RestaurantService;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.dto.RestaurantEffectiveHourResponse;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.service.RestaurantOpeningHourService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminRestaurantController
 *
 * 관리자용 레스토랑 관리 API를 처리하는 컨트롤러
 * CRUD 작업을 수행
 *
 * @author 김지민
 * @since 2025-10-09
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/restaurants")
@RequiredArgsConstructor
public class AdminRestaurantController {

  private final RestaurantService restaurantService;
  private final ReservationService reservationService;
  private final RestaurantOpeningHourService openingHourService;
  private final ObjectMapper objectMapper;

  /** SUPERADMIN 전용 - 전체 매장 조회 */
  @GetMapping
  public ResponseEntity<List<Restaurant>> getAllRestaurantsForSuperAdmin() {
    return ResponseEntity.ok(restaurantService.getAllRestaurants());
  }

  /** 단일 레스토랑 조회 */
  @GetMapping("/{id}")
  public ResponseEntity<Restaurant> getById(@PathVariable Long id) {
    return ResponseEntity.ok(restaurantService.getRestaurant(id));
  }

  /**
   *  매장 등록 (SUPERADMIN 전용)
   * 요청 body 예시:
   * {
   *   "adminId": 2,
   *   "restaurant": {
   *     "name": "정미스시",
   *     "address": "서울 강남구 역삼동",
   *     "phoneNumber": "010-1234-5678",
   *     "description": "신선한 스시 전문점",
   *     "latitude": 37.4979,
   *     "longitude": 127.0276,
   *     "regionCode": "서울",
   *     "restaurantCategory": { "id": 3 }
   *   }
   * }
   */
  @PostMapping
  public ResponseEntity<Restaurant> create(@RequestBody Map<String, Object> payload) {
    try {
      Restaurant restaurant = objectMapper.convertValue(payload.get("restaurant"), Restaurant.class);
      Long adminId = Long.valueOf(payload.get("adminId").toString());

      Restaurant saved = restaurantService.createRestaurant(restaurant, adminId);
      return ResponseEntity.ok(saved);
    } catch (Exception e) {
      log.error("❌ 매장 등록 실패", e);
      return ResponseEntity.badRequest().build();
    }
  }

  /** 레스토랑 수정 */
  @PutMapping("/{id}")
  public ResponseEntity<Restaurant> update(@PathVariable Long id, @RequestBody Restaurant restaurant) {
    return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
  }

  /** 레스토랑 삭제 (Soft Delete) */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    restaurantService.deleteRestaurant(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * 레스토랑의 타임슬롯 조회
   */
  @GetMapping("/{id}/time-slots")
  public ResponseEntity<List<LocalTime>> getTimeSlots(
      @PathVariable("id") Long restaurantId,
      @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
  ) {
    // 운영시간 조회
    RestaurantEffectiveHourResponse effectiveHour = openingHourService.getEffectiveHour(restaurantId, date);
    List<LocalTime> timeSlots = new ArrayList<>();

    if (!effectiveHour.isClosed()) {
      timeSlots = reservationService.generateTimeSlot(effectiveHour); // public 메서드 사용
    }

    return ResponseEntity.ok(timeSlots);
  }

  /** 로그인한 관리자 본인 소유의 레스토랑 조회 */
  @GetMapping("/my")
  public ResponseEntity<List<Restaurant>> getMyRestaurants() {
    List<Restaurant> restaurants = restaurantService.getRestaurantsByCurrentAdmin();
    return ResponseEntity.ok(restaurants);
  }

}
