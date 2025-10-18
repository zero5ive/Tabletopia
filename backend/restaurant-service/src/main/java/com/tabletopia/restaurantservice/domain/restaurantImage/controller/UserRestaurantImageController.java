package com.tabletopia.restaurantservice.domain.restaurantImage.controller;

import com.tabletopia.restaurantservice.domain.restaurantImage.dto.RestaurantImageResponse;
import com.tabletopia.restaurantservice.domain.restaurantImage.service.RestaurantImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 사용자용 매장 이미지 컨트롤러
 * 매장 이미지 조회 기능을 제공한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@RestController
@RequestMapping("/api/user/restaurants/{restaurantId}/images")
@RequiredArgsConstructor
public class UserRestaurantImageController {

  private final RestaurantImageService imageService;

  /**
   * 특정 매장의 이미지 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 등록된 이미지 DTO 리스트
   */
  @GetMapping
  public ResponseEntity<List<RestaurantImageResponse>> getImages(@PathVariable Long restaurantId) {
    return ResponseEntity.ok(imageService.getImages(restaurantId));
  }
}
