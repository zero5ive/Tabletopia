package com.tabletopia.restaurantservice.domain.restaurantImage.controller;

import com.tabletopia.restaurantservice.domain.restaurantImage.dto.RestaurantImageResponse;
import com.tabletopia.restaurantservice.domain.restaurantImage.service.RestaurantImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * 매장 이미지 관련 요청을 처리하는 컨트롤러
 *
 * 매장(Restaurant)에 등록된 이미지(RestaurantImage)를
 * 조회, 업로드, 대표 설정, 삭제하는 기능을 제공한다.
 *
 * - GET /api/images/{restaurantId} : 매장의 이미지 목록 조회
 * - POST /api/images/{restaurantId} : 이미지 업로드
 * - PUT /api/images/main/{imageId} : 대표 이미지 설정
 * - DELETE /api/images/{imageId} : 이미지 삭제
 *
 * DB 스키마는 restaurant_image 테이블을 기준으로 한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class RestaurantImageController {

  private final RestaurantImageService imageService;

  /**
   * 특정 매장의 이미지 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 매장에 등록된 이미지 DTO 리스트
   */
  @GetMapping("/{restaurantId}")
  public ResponseEntity<List<RestaurantImageResponse>> getImages(@PathVariable Long restaurantId) {
    return ResponseEntity.ok(imageService.getImages(restaurantId));
  }

  /**
   * 매장에 이미지 업로드
   *
   * @param restaurantId 매장 ID
   * @param files 업로드할 이미지 파일 목록
   * @return 성공 시 200 OK
   */
  @PostMapping("/{restaurantId}")
  public ResponseEntity<Void> uploadImages(
      @PathVariable Long restaurantId,
      @RequestParam("files") List<MultipartFile> files
  ) {
    imageService.uploadImages(restaurantId, files);
    return ResponseEntity.ok().build();
  }

  /**
   * 특정 이미지를 대표 이미지로 설정
   *
   * @param imageId 이미지 ID
   * @return 성공 시 200 OK
   */
  @PutMapping("/main/{imageId}")
  public ResponseEntity<Void> setMainImage(@PathVariable Long imageId) {
    imageService.setMainImage(imageId);
    return ResponseEntity.ok().build();
  }

  /**
   * 특정 이미지를 삭제
   *
   * @param imageId 이미지 ID
   * @return 성공 시 204 No Content
   */
  @DeleteMapping("/{imageId}")
  public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
    imageService.deleteImage(imageId);
    return ResponseEntity.noContent().build();
  }
}
