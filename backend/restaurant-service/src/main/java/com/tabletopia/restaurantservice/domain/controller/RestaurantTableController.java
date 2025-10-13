package com.tabletopia.restaurantservice.domain.controller;
import com.tabletopia.restaurantservice.domain.dto.RestaurantTableResponse;
import com.tabletopia.restaurantservice.domain.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 레스토랑 테이블 관리 컨트롤러
 * 특정 레스토랑의 보유 테이블 목록을 조회할 수 있는 API를 제공한다.
 * @author 김지민
 * @since 2025-09-26
 */
@RestController
@RequestMapping("/restaurant/{restaurantId}/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

  private final RestaurantTableService tableService;

  /**
   * 특정 레스토랑의 테이블 목록 조회
   * @param restaurantId 조회할 레스토랑의 고유 ID
   * @return List<RestaurantTableDTO> 레스토랑의 테이블 정보 목록
   * @throws IllegalArgumentException restaurantId가 null이거나 존재하지 않는 경우
   * @author 김지민
   * @since 2025-09-26
   */
  @GetMapping
  public List<RestaurantTableResponse> getTables(@PathVariable Long restaurantId) {
    return tableService.getTablesByRestaurant(restaurantId);
  }
}
