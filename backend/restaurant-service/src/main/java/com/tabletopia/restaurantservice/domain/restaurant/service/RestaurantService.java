package com.tabletopia.restaurantservice.domain.restaurant.service;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestuarantLocationResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.SearchCondition;
import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.repository.JpaAdminRepository;
import com.tabletopia.restaurantservice.domain.restaurant.dto.*;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantCategory.dto.RestaurantCategoryResponse;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantCategory.repository.RestaurantCategoryRepository;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * RestaurantService
 *
 * 레스토랑 관련 비즈니스 로직을 처리하는 서비스 계층
 * SUPERADMIN은 모든 매장을 관리할 수 있고,
 * ADMIN은 자신의 매장만 관리 가능하다.
 *
 * @author 김지민
 * @since 2025-10-09
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestaurantService {

  private final RestaurantRepository restaurantRepository;
  private final RestaurantCategoryRepository restaurantCategoryRepository;
  private final JpaAdminRepository adminRepository;

  /** ✅ SUPERADMIN이면 전체, ADMIN이면 본인 매장만 조회 */
  public List<Restaurant> getRestaurantsForCurrentAdmin() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    Admin admin = adminRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("관리자를 찾을 수 없습니다."));

    if ("SUPERADMIN".equalsIgnoreCase(admin.getRole().name())) {
      log.info("SUPERADMIN 전체 매장 조회 요청");
      return restaurantRepository.findAll();
    }

    log.info("ADMIN 본인 매장만 조회 요청");
    return restaurantRepository.findByAdmin_Id(admin.getId());
  }

  /** 전체 레스토랑 목록 조회 */
  public List<Restaurant> getAllRestaurants() {
    return restaurantRepository.findAll();
  }

  /** 특정 레스토랑 단건 조회 */
  public Restaurant getRestaurant(Long id) {
    return restaurantRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("레스토랑을 찾을 수 없습니다. ID=" + id));
  }

  /** ✅ SUPERADMIN이 특정 관리자(adminId)에게 매장을 할당해서 등록 */
  @Transactional
  public Restaurant createRestaurant(Restaurant restaurant, Long adminId) {
    Admin admin = adminRepository.findById(adminId)
        .orElseThrow(() -> new UsernameNotFoundException("관리자를 찾을 수 없습니다. ID=" + adminId));

    restaurant.setAdmin(admin);
    return restaurantRepository.save(restaurant);
  }

  /** 기존 등록 (백호환용) */
  @Transactional
  public Restaurant createRestaurant(Restaurant restaurant) {
    return restaurantRepository.save(restaurant);
  }

  /** 레스토랑 수정 */
  @Transactional
  public Restaurant updateRestaurant(Long id, Restaurant updatedData) {
    Restaurant existing = getRestaurant(id);

    existing.setName(updatedData.getName());
    existing.setAddress(updatedData.getAddress());
    existing.setLatitude(updatedData.getLatitude());
    existing.setLongitude(updatedData.getLongitude());
    existing.setRegionCode(updatedData.getRegionCode());
    existing.setPhoneNumber(updatedData.getPhoneNumber());
    existing.setDescription(updatedData.getDescription());
    existing.setRestaurantCategory(updatedData.getRestaurantCategory());

    return existing;
  }

  /** 레스토랑 삭제 */
  @Transactional
  public void deleteRestaurant(Long id) {
    restaurantRepository.deleteById(id);
  }

  /** 카테고리별 레스토랑 페이징 */
  public RestaurantCategoryResponse getRestaurantsByCategory(Long categoryId, Pageable pageable) {
    RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
        .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));

    Page<Restaurant> restaurantPage = restaurantRepository.findByRestaurantCategory(category, pageable);

    Page<RestaurantResponse> restaurantResponses = restaurantPage.map(restaurant -> {
      List<String> openingHours = restaurant.getOpeningHours().stream()
          .filter(oh -> !oh.getIsHoliday())
          .map(oh -> getDayName(oh.getDayOfWeek()) + ": " + oh.getOpenTime() + "-" + oh.getCloseTime())
          .toList();

      List<String> facilities = restaurant.getRestaurantFacilities().stream()
          .map(f -> f.getFacility().getName())
          .toList();

      List<RestaurantReview> activeReviews = restaurant.getReviews().stream()
          .filter(r -> !r.getIsDeleted())
          .toList();

      double avgRating = activeReviews.isEmpty() ? 0.0 :
          activeReviews.stream().mapToInt(RestaurantReview::getRating).average().orElse(0.0);

      return new RestaurantResponse(
          restaurant.getId(),
          restaurant.getName(),
          restaurant.getAddress(),
          restaurant.getRegionCode(),
          openingHours,
          facilities,
          Math.round(avgRating * 10.0) / 10.0,
          activeReviews.size()
      );
    });

    return new RestaurantCategoryResponse(
        category.getId(),
        category.getName(),
        category.getDisplayOrder(),
        restaurantResponses
    );
  }

  /** 동적 검색 */
  public Page<Restaurant> searchRestaurants(SearchCondition searchCondition) {
    log.debug("레스토랑 검색: name={}, regionCode={}, categoryId={}",
        searchCondition.getName(), searchCondition.getRegionCode(), searchCondition.getCategoryId());

    PageRequest pageRequest = PageRequest.of(
        searchCondition.getPage() != null ? searchCondition.getPage() : 0,
        searchCondition.getSize() != null ? searchCondition.getSize() : 10
    );

    return restaurantRepository.searchRestaurants(searchCondition, pageRequest);
  }

  private String getDayName(int dayOfWeek) {
    return switch (dayOfWeek) {
      case 1 -> "월";
      case 2 -> "화";
      case 3 -> "수";
      case 4 -> "목";
      case 5 -> "금";
      case 6 -> "토";
      case 7 -> "일";
      default -> "";
    };
  }

  /** 상세 조회 */
  public RestaurantSearchResponse getRestaurantDetail(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 레스토랑이 존재하지 않습니다. ID: " + restaurantId));

    return RestaurantSearchResponse.from(restaurant);
  }


  /**
   *레스토랑 위치 조회
   */
  public RestuarantLocationResponse getRestaurantLocation(Long restaurantId){
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new RuntimeException("해당 레스토랑이 존재하지 않습니다. ID: " + restaurantId));

    return RestuarantLocationResponse.from(restaurant);
  }

  /** 로그인한 관리자 기준 본인 매장만 */
  public List<Restaurant> getRestaurantsByCurrentAdmin() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();
    Admin admin = adminRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("관리자를 찾을 수 없습니다."));
    return restaurantRepository.findByAdmin_Id(admin.getId());
  }
}
