package com.tabletopia.restaurantservice.domain.restaurantMenu.service;

import com.tabletopia.restaurantservice.domain.restaurantMenu.dto.RestaurantMenuRequest;
import com.tabletopia.restaurantservice.domain.restaurantMenu.dto.RestaurantMenuResponse;
import com.tabletopia.restaurantservice.domain.restaurantMenu.entity.RestaurantMenu;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantMenu.repository.RestaurantMenuRepository;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 매장 메뉴 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 메뉴 등록, 조회, 수정, 삭제 기능을 제공한다.
 * 이미지 파일은 /uploads/menus 경로 아래에 저장되며,
 * DB에는 파일명만 저장된다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantMenuService {

  private final RestaurantRepository restaurantRepository;
  private final RestaurantMenuRepository menuRepository;
  private final FileStorageService fileStorageService;

  /**
   * 특정 매장의 전체 메뉴 목록 조회
   *
   * @param restaurantId 매장 ID
   * @return 메뉴 응답 DTO 리스트
   */
  @Transactional(readOnly = true)
  public List<RestaurantMenuResponse> getMenusByRestaurant(Long restaurantId) {
    return menuRepository.findByRestaurantId(restaurantId)
        .stream()
        .map(menu -> RestaurantMenuResponse.builder()
            .id(menu.getId())
            .restaurantId(menu.getRestaurant().getId())
            .name(menu.getName())
            .price(menu.getPrice())
            .description(menu.getDescription())
            .category(menu.getCategory())
            .imageFilename(menu.getImageFilename())
            .isSoldout(menu.isSoldout())
            .build())
        .collect(Collectors.toList());
  }

  /**
   * 새 메뉴 등록
   *
   * 이미지가 포함되어 있으면 /uploads/menus 폴더에 저장하고,
   * 경로가 아닌 파일명만 DB에 저장한다.
   *
   * @param restaurantId 매장 ID
   * @param dto 메뉴 요청 DTO (FormData 기반)
   * @return 등록된 메뉴 응답 DTO
   */
  public RestaurantMenuResponse createMenu(Long restaurantId, RestaurantMenuRequest dto) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 매장을 찾을 수 없습니다. ID=" + restaurantId));

    RestaurantMenu menu = RestaurantMenu.builder()
        .restaurant(restaurant)
        .name(dto.getName())
        .price(dto.getPrice())
        .description(dto.getDescription())
        .category(dto.getCategory())
        .isSoldout(dto.isSoldout())
        .build();

    // 이미지가 포함된 경우에만 파일 저장 처리
    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      // 파일 저장 후 전체 경로 반환 (예: "/uploads/menus/uuid.jpg")
      String savedPath = fileStorageService.save(dto.getImage(), "menus");

      // 경로가 포함된 문자열에서 파일명만 추출 (예: "uuid.jpg")
      String fileNameOnly = extractFileName(savedPath);

      menu.setImageFilename(fileNameOnly);
    }

    RestaurantMenu saved = menuRepository.save(menu);

    return RestaurantMenuResponse.builder()
        .id(saved.getId())
        .restaurantId(restaurantId)
        .name(saved.getName())
        .price(saved.getPrice())
        .description(saved.getDescription())
        .category(saved.getCategory())
        .imageFilename(saved.getImageFilename())
        .isSoldout(saved.isSoldout())
        .build();
  }

  /**
   * 메뉴 수정
   *
   * 기본 정보(name, price, description 등)를 갱신하고,
   * 이미지가 새로 업로드된 경우 기존 이미지 대신 새 파일명을 저장한다.
   *
   * @param restaurantId 매장 ID
   * @param menuId 메뉴 ID
   * @param dto 수정 요청 DTO
   * @return 수정된 메뉴 응답 DTO
   */
  public RestaurantMenuResponse updateMenu(Long restaurantId, Long menuId, RestaurantMenuRequest dto) {
    RestaurantMenu menu = menuRepository.findById(menuId)
        .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. ID=" + menuId));

    menu.setName(dto.getName());
    menu.setPrice(dto.getPrice());
    menu.setDescription(dto.getDescription());
    menu.setCategory(dto.getCategory());
    menu.setSoldout(dto.isSoldout());

    // 이미지 교체 처리
    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      String savedPath = fileStorageService.save(dto.getImage(), "menus");
      String fileNameOnly = extractFileName(savedPath);
      menu.setImageFilename(fileNameOnly);
    }

    RestaurantMenu updated = menuRepository.save(menu);

    return RestaurantMenuResponse.builder()
        .id(updated.getId())
        .restaurantId(restaurantId)
        .name(updated.getName())
        .price(updated.getPrice())
        .description(updated.getDescription())
        .category(updated.getCategory())
        .imageFilename(updated.getImageFilename())
        .isSoldout(updated.isSoldout())
        .build();
  }

  /**
   * 메뉴 삭제 (Soft Delete)
   *
   * 실제 데이터를 물리적으로 삭제하지 않고,
   * isDeleted 플래그를 true로 변경한다.
   *
   * @param menuId 삭제할 메뉴 ID
   */
  public void deleteMenu(Long menuId) {
    RestaurantMenu menu = menuRepository.findById(menuId)
        .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. ID=" + menuId));

    menu.setDeleted(true);
    menuRepository.save(menu);
  }

  /**
   * 파일 경로 문자열에서 파일명만 추출하는 유틸리티 메서드
   *
   * OS에 따라 슬래시(/, \\)가 다를 수 있으므로 둘 다 처리한다.
   * 예: "/uploads/menus/uuid.jpg" → "uuid.jpg"
   */
  private String extractFileName(String path) {
    if (path == null) return null;
    int lastSlash = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return lastSlash != -1 ? path.substring(lastSlash + 1) : path;
  }
}
