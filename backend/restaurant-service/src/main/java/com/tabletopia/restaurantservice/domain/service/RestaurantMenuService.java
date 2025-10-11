package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.RestaurantMenuRequest;
import com.tabletopia.restaurantservice.domain.dto.RestaurantMenuResponse;
import com.tabletopia.restaurantservice.domain.entity.RestaurantMenu;
import com.tabletopia.restaurantservice.domain.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.repository.RestaurantMenuRepository;
import com.tabletopia.restaurantservice.domain.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 레스토랑 메뉴 서비스
 * 메뉴 등록, 조회, 삭제(Soft Delete)를 처리한다.
 * 이미지 파일 저장 기능을 포함한다.
 * @author 김지민
 * @since 2025-10-10
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantMenuService {

  private final RestaurantRepository restaurantRepository;
  private final RestaurantMenuRepository menuRepository;
  private final FileStorageService fileStorageService;

  /**
   * 특정 매장의 메뉴 목록 조회
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
   * @param restaurantId 매장 ID
   * @param dto 요청 DTO (FormData 기반)
   * @return 등록된 메뉴 응답 DTO
   */
  public RestaurantMenuResponse createMenu(Long restaurantId, RestaurantMenuRequest dto) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 매장을 찾을 수 없습니다. ID=" + restaurantId));

    // 엔티티 변환
    RestaurantMenu menu = RestaurantMenu.builder()
        .restaurant(restaurant)
        .name(dto.getName())
        .price(dto.getPrice())
        .description(dto.getDescription())
        .category(dto.getCategory())
        .isSoldout(dto.isSoldout())
        .build();

    // 이미지 파일 저장
    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      String savedName = fileStorageService.save(dto.getImage());
      menu.setImageFilename(savedName);
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
   * 메뉴 삭제 (Soft Delete)
   * @param menuId 메뉴 ID
   */
  public void deleteMenu(Long menuId) {
    RestaurantMenu menu = menuRepository.findById(menuId)
        .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. ID=" + menuId));

    menu.setDeleted(true);
    menuRepository.save(menu);
  }
}
