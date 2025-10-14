package com.tabletopia.realtimeservice.feign;

import com.tabletopia.realtimeservice.dto.OpeningHourResponse;
import com.tabletopia.realtimeservice.dto.RestaurantTableDto;
import com.tabletopia.realtimeservice.dto.TimeSlotResponse;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Restaurant Service와 통신하기 위한 Feign 클라이언트
 *
 * @author 김예진
 * @since 2025-09-24
 */
@FeignClient(
    name = "restaurant-service" // 유레카에 등록된 서비스명
//    ,url = "${feign.client.restaurant-service.url:}" // 로컬 테스트용 URL
)
public interface RestaurantServiceClient {

  /**
   * 레스토랑 테이블 정보 조회
   *
   * @param restaurantId 레스토랑 ID
   * @return 테이블 정보 리스트
   */
  @GetMapping("/api/restaurants/{restaurantId}/tables")
  List<RestaurantTableDto> getRestaurantTables(@PathVariable("restaurantId") Long restaurantId);

  /**
   * 레스토랑의 전체 운영시간 조회
   *
   * @param restaurantId 레스토랑 ID
   * @return 운영시간 DTO 리스트
   */
  @GetMapping("/api/restaurants/opening-hours/{restaurantId}")
  List<OpeningHourResponse> getOpeningHours(@PathVariable("restaurantId") Long restaurantId);

  /**
   * 레스토랑의 특정 요일의 예약 가능 슬롯 조회
   *
   * @param restaurantId 레스토랑 ID
   * @param dayOfWeek 요일 (0: 일요일 ~ 6: 토요일)
   * @return {시작 시간, 끝 시간}
   */
  @GetMapping("/api/restaurants/reservations/{restaurantId}/{dayOfWeek}")
  public List<TimeSlotResponse> getSlots(
      @PathVariable Long restaurantId,
      @PathVariable int dayOfWeek
  );
}