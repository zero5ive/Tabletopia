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
 * 매장별 메뉴 등록, 조회, 수정, 삭제 기능을 제공하며
 * 메뉴 이미지 업로드 시 FileStorageService를 이용해 로컬 디렉토리에 저장한다.
 *
 * 저장 경로는 /uploads/menus/ 폴더 하위로 구성된다.
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
   * 특정 매장의 메뉴 목록 조회
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
   * 요청으로 전달된 이미지 파일은 uploads/menus 폴더에 저장되며,
   * 저장된 파일 경로를 DB에 함께 등록한다.
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

    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      String savedUrl = fileStorageService.save(dto.getImage(), "menus");
      menu.setImageFilename(savedUrl);
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
   * 기존 메뉴 정보를 새 요청 데이터로 갱신하며,
   * 이미지가 새로 전달된 경우 기존 이미지를 교체한다.
   * 새 이미지는 uploads/menus 폴더에 저장된다.
   *
   * @param restaurantId 매장 ID
   * @param menuId 메뉴 ID
   * @param dto 메뉴 요청 DTO (FormData 기반)
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

    if (dto.getImage() != null && !dto.getImage().isEmpty()) {
      String savedUrl = fileStorageService.save(dto.getImage(), "menus");
      menu.setImageFilename(savedUrl);
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
   * 실제 데이터를 DB에서 제거하지 않고
   * deleted 플래그를 true로 변경한다.
   *
   * @param menuId 삭제할 메뉴 ID
   */
  public void deleteMenu(Long menuId) {
    RestaurantMenu menu = menuRepository.findById(menuId)
        .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. ID=" + menuId));

    menu.setDeleted(true);
    menuRepository.save(menu);
  }
}
