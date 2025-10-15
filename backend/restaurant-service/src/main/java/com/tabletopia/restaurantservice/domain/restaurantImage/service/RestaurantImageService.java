package com.tabletopia.restaurantservice.domain.restaurantImage.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantImage.entity.RestaurantImage;
import com.tabletopia.restaurantservice.domain.restaurantImage.dto.RestaurantImageResponse;
import com.tabletopia.restaurantservice.domain.restaurantImage.repository.RestaurantImageRepository;
import com.tabletopia.restaurantservice.util.FileStorageService;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 매장 이미지 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 매장별 이미지 조회, 업로드, 대표 이미지 지정, 삭제 기능을 제공한다.
 * 업로드 시 FileStorageService를 이용해 로컬 디렉토리에 파일을 저장한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@Service
@RequiredArgsConstructor
public class RestaurantImageService {

  private final RestaurantImageRepository imageRepository;
  private final RestaurantRepository restaurantRepository;
  private final FileStorageService fileStorageService;

  /**
   * 특정 매장의 이미지 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 이미지 DTO 리스트
   */
  public List<RestaurantImageResponse> getImages(Long restaurantId) {
    return imageRepository.findByRestaurantIdOrderBySortOrderAsc(restaurantId)
        .stream()
        .map(img -> RestaurantImageResponse.builder()
            .id(img.getId())
            .imageUrl(img.getImageUrl())
            .isMain(img.isMain())
            .sortOrder(img.getSortOrder())
            .build())
        .collect(Collectors.toList());
  }

  /**
   * 매장에 이미지 업로드
   *
   * @param restaurantId 매장 ID
   * @param files 업로드할 이미지 파일 목록
   */
  public void uploadImages(Long restaurantId, List<MultipartFile> files) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("매장 정보를 찾을 수 없습니다."));

    for (MultipartFile file : files) {
      String savedFileName = fileStorageService.save(file, "restaurants");

      // DB에는 파일명만 저장
      String fileNameOnly = Paths.get(savedFileName).getFileName().toString();

      RestaurantImage img = RestaurantImage.builder()
          .restaurant(restaurant)
          .imageUrl(fileNameOnly) // ← 파일명만 저장
          .build();

      imageRepository.save(img);
    }
  }

  /**
   * 특정 이미지를 대표 이미지로 지정
   *
   * @param imageId 대표로 지정할 이미지 ID
   */
  public void setMainImage(Long imageId) {
    RestaurantImage target = imageRepository.findById(imageId)
        .orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다."));

    List<RestaurantImage> images = imageRepository.findByRestaurantIdOrderBySortOrderAsc(
        target.getRestaurant().getId()
    );

    for (RestaurantImage img : images) {
      img.setMain(img.getId().equals(imageId));
      imageRepository.save(img);
    }
  }

  /**
   * 특정 이미지를 삭제
   *
   * @param imageId 삭제할 이미지 ID
   */
  public void deleteImage(Long imageId) {
    imageRepository.deleteById(imageId);
  }
}
