package com.tabletopia.restaurantservice.domain.restaurantImage.controller;

import com.tabletopia.restaurantservice.domain.restaurantImage.dto.RestaurantImageResponse;
import com.tabletopia.restaurantservice.domain.restaurantImage.service.RestaurantImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * 관리자용 매장 이미지 컨트롤러
 * 매장 이미지 조회, 업로드, 대표 설정, 삭제 기능을 제공한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@RestController
@RequestMapping("/api/admin/restaurants/{restaurantId}/images")
@RequiredArgsConstructor
public class AdminRestaurantImageController {

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

  /**
   * 매장에 이미지 업로드
   *
   * @param restaurantId 매장 ID
   * @param files 업로드할 이미지 파일 목록
   * @return 성공 시 200 OK
   */
  @PostMapping
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
  @PutMapping("/{imageId}/main")
  public ResponseEntity<Void> setMainImage(@PathVariable Long restaurantId, @PathVariable Long imageId) {
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
  public ResponseEntity<Void> deleteImage(@PathVariable Long restaurantId, @PathVariable Long imageId) {
    imageService.deleteImage(imageId);
    return ResponseEntity.noContent().build();
  }
}
