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

    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      String savedPath = fileStorageService.save(dto.getImage(), "menus");
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
      // 기존 이미지가 존재하면 먼저 삭제
      if (menu.getImageFilename() != null && !menu.getImageFilename().isBlank()) {
        String oldFileUrl = "/uploads/menus/" + menu.getImageFilename();
        fileStorageService.delete(oldFileUrl);
      }

      // 새 파일 저장 및 파일명 갱신
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
   * 메뉴 삭제 (Soft Delete + 파일 삭제)
   *
   * 실제 데이터를 물리적으로 삭제하지 않고,
   * isDeleted 플래그를 true로 설정하며,
   * 해당 메뉴 이미지 파일이 존재할 경우 함께 삭제한다.
   *
   * @param menuId 삭제할 메뉴 ID
   */
  public void deleteMenu(Long menuId) {
    RestaurantMenu menu = menuRepository.findById(menuId)
        .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. ID=" + menuId));

    // 이미지 파일 삭제 처리
    if (menu.getImageFilename() != null && !menu.getImageFilename().isBlank()) {
      String fileUrl = "/uploads/menus/" + menu.getImageFilename();
      fileStorageService.delete(fileUrl);
    }

    // Soft Delete 처리
    menu.setDeleted(true);
    menuRepository.save(menu);
  }

  private String extractFileName(String path) {
    if (path == null) return null;
    int lastSlash = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return lastSlash != -1 ? path.substring(lastSlash + 1) : path;
  }
}
