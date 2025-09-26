package com.tabletopia.realtimeservice.feign;

import com.tabletopia.realtimeservice.dto.RestaurantTableResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

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
  @GetMapping("/restaurant/{restaurantId}/tables")
  List<RestaurantTableResponse> getRestaurantTables(@PathVariable("restaurantId") Long restaurantId);
}