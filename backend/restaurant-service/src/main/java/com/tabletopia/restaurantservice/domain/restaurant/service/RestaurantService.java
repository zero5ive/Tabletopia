package com.tabletopia.restaurantservice.domain.restaurant.service;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantCategoryWithPage;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.RestuarantLocationResponse;
import com.tabletopia.restaurantservice.domain.restaurant.dto.SearchCondition;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * RestaurantService

 * 레스토랑 관련 비즈니스 로직을 처리하는 서비스 계층이다.
 * Repository를 호출하여 데이터베이스 조작을 수행하며,
 * 트랜잭션 관리 및 도메인 로직을 담당한다.

 * 주요 기능:
 * - 전체 레스토랑 조회
 * - 단일 레스토랑 조회
 * - 신규 레스토랑 등록
 * - 레스토랑 정보 수정
 * - 레스토랑 삭제 (Soft Delete)

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

  /**
   * 전체 레스토랑 목록 조회
   * @return 레스토랑 전체 목록
   */
  public List<Restaurant> getAllRestaurants() {
    return restaurantRepository.findAll();
  }

  /**
   * 특정 레스토랑 단건 조회
   * @param id 레스토랑 ID
   * @return 해당 레스토랑 정보
   */
  public Restaurant getRestaurant(Long id) {
    return restaurantRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("레스토랑을 찾을 수 없습니다. ID=" + id));
  }

  /**
   * 신규 레스토랑 등록
   * @param restaurant 신규 등록할 레스토랑 엔티티
   * @return 저장된 레스토랑 정보
   */
  @Transactional
  public Restaurant createRestaurant(Restaurant restaurant) {
    return restaurantRepository.save(restaurant);
  }

  /**
   * 레스토랑 정보 수정
   * @param id 수정할 레스토랑 ID
   * @param updatedData 변경할 정보가 담긴 엔티티
   * @return 수정된 레스토랑 엔티티
   */
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
//    existing.setRestaurantAccount(updatedData.getRestaurantAccount());

    return existing; // @Transactional 덕분에 자동 flush
  }

  /**
   * 레스토랑 삭제 (Soft Delete)
   * @param id 삭제할 레스토랑 ID
   */
  @Transactional
  public void deleteRestaurant(Long id) {
    restaurantRepository.deleteById(id);
  }

  //지역 별 레스토랑 조회
  public List<Restaurant> getRestaurantsByRegionCode() {
    return restaurantRepository.findAll();
  }

  // 카테고리별 레스토랑 페이징
  public RestaurantCategoryResponse getRestaurantsByCategory(Long categoryId, Pageable pageable) {
    // 1. 카테고리 정보 가져오기
    RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
        .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));

    // 2. 해당 카테고리의 레스토랑 페이징 조회
    Page<Restaurant> restaurantPage = restaurantRepository.findByRestaurantCategory(category, pageable);

    // 3. Page<Restaurant>를 Page<RestaurantResponse>로 변환
    Page<RestaurantResponse> restaurantResponses = restaurantPage.map(restaurant -> {
      // 영업시간
      List<String> openingHours = restaurant.getOpeningHours().stream()
          .filter(oh -> !oh.getIsHoliday())
          .map(oh -> {
            String day = getDayName(oh.getDayOfWeek());
            return day + ": " + oh.getOpenTime() + "-" + oh.getCloseTime();
          })
          .toList();

      // 편의시설
      List<String> facilities = restaurant.getRestaurantFacilities().stream()
          .map(f -> f.getFacility().getName())
          .toList();

      // 별점 평균 계산
      List<RestaurantReview> activeReviews = restaurant.getReviews().stream()
          .filter(reviews -> !reviews.getIsDeleted())
          .toList();

      Double avgRating = activeReviews.isEmpty() ? 0.0 :
          activeReviews.stream()
              .mapToInt(RestaurantReview::getRating)
              .average()
              .orElse(0.0);

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

    // 4. 최종 Response 생성
    return new RestaurantCategoryResponse(
        category.getId(),
        category.getName(),
        category.getDisplayOrder(),
        restaurantResponses
    );
  }

  /**
   * 레스토랑 동적 검색
   *
   * @param searchCondition 검색 조건
   * @return 검색 결과 페이지
   * @author 김예진
   * @since 2025-10-15
   */
  public Page<Restaurant> searchRestaurants(SearchCondition searchCondition){
    log.debug("레스토랑 검색: name={}, regionCode={}, categoryId={}",
        searchCondition.getName(), searchCondition.getRegionCode(), searchCondition.getCategoryId());

    // 보여줄 페이징 값
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

  /**
   * 레스토랑 상세페이지 조회
   */
  public RestaurantSearchResponse getRestaurantDetail(Long restaurantId){
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new IllegalArgumentException("해당 레스토랑이 존재하지 않습니다. ID: " + restaurantId));

    return RestaurantSearchResponse.from(restaurant);
  }

  /**
   *레스토랑 위치 조회
   */
  public RestuarantLocationResponse getRestuarantLocation(Long restaurantId){
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(()-> new RuntimeException("해당 레스토랑이 존재하지 않습니다." + restaurantId));

    return RestuarantLocationResponse.from(restaurant);
  }
}
