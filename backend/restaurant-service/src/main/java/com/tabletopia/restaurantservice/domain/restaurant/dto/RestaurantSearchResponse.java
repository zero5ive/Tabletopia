package com.tabletopia.restaurantservice.domain.restaurant.dto;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantImage.entity.RestaurantImage;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

/**
 * 레스토랑 검색 결과 응답 DTO
 *
 * @author 김예진
 * @since 2025-10-15
 */
@Getter
@Builder
public class RestaurantSearchResponse {
  private Long id;
  private String name;
  private String address;
  private String restaurantCategoryName;
  private String regionCode; //지역
  private String todayOpeningHours;  //오늘운영시간
  private List<String> facilityNames; // 편의시설
  private Double averageRating;       // 평점
  private Integer reviewCount;       // 리뷰수
  private String mainImageUrl; // 메인 이미지
  private List<String>  imageUrls; //이미지 슬라이더
  private String tel; // 전화번호

  /**
   * Entity -> DTO
   *
   * @author 김예진
   * @since 2025-10-15
   */
  public static RestaurantSearchResponse from(Restaurant restaurant){
    return RestaurantSearchResponse.builder()
        .id(restaurant.getId())
        .name(restaurant.getName())
        .address(restaurant.getAddress())
        .restaurantCategoryName(restaurant.getRestaurantCategory().getName())
        .regionCode(restaurant.getRegionCode())
        .averageRating(calculateAverageRating(restaurant))
        .reviewCount(restaurant.getReviews().size())
        .mainImageUrl(getMainImageUrl(restaurant))
        .imageUrls(getAllImageUrls(restaurant))
        .facilityNames(getFacilityNames(restaurant))
        .todayOpeningHours(getTodayOpeningHours(restaurant))
        .tel(restaurant.getPhoneNumber())
        .build();
  }

  /**
   * 평균 별점 계산
   *
   * @author 김예진
   * @since 2025-10-15
   */
  public static Double calculateAverageRating(Restaurant restaurant){
    if (restaurant.getReviews() == null || restaurant.getReviews().isEmpty()){
      // 리뷰가 없는 경우 0점 반환
      return 0.0;
    }

    return restaurant.getReviews().stream() // 리뷰 리스트 스트림으로 변환
        .mapToInt(review -> review.getRating()) // review 객체에서 rating만 꺼내서 IntStream으로 변환
        .average() // 평균 계산
        .orElse(0.0);
  }

  /**
   * TODO 메인 이미지만 가져오기
   */

  /**
   * 편의시설명 리스트 추출
   *
   * @author 김예진
   * @since 2025-10-15
   */
  public static List<String> getFacilityNames(Restaurant restaurant){
    if (restaurant.getRestaurantFacilities() == null){
      return List.of();
    }

    return restaurant.getRestaurantFacilities().stream()
        .map(restaurantFacility -> restaurantFacility.getFacility().getName())
        .toList();
  }

  /**
   * 오늘 영업시간을 문자열로 반환
   * 
   * @author 김예진 
   * @since 2025-10-15
   */
  public static String getTodayOpeningHours(Restaurant restaurant){
    // 오늘 요일 구하기 (0=일요일 ~ 6=토요일)
    int today = LocalDateTime.now().getDayOfWeek().getValue() % 7;

    if (restaurant.getOpeningHours() == null){
      return "영업시간 정보 없음";
    }

    return restaurant.getOpeningHours().stream()
        .filter(restaurantOpeningHour -> restaurantOpeningHour.getDayOfWeek() == today) // 오늘 요일만 조회
        .findFirst()
        .map(restaurantOpeningHour -> {
          if (Boolean.TRUE.equals(restaurantOpeningHour.getIsHoliday())) {
            // 휴무일인 경우
            return "휴무";
          }
          return restaurantOpeningHour.getOpenTime() + " - " + restaurantOpeningHour.getCloseTime();
        })
        .orElse("영업시간 정보 없음");
  }

  /**
   * 메인 이미지 URL 가져오기
   */
  public static String getMainImageUrl(Restaurant restaurant){
    if (restaurant.getRestaurantImage()== null || restaurant.getRestaurantImage().isEmpty()){
      return null; // 또는 기본 이미지 URL
    }

    return restaurant.getRestaurantImage().stream()
        .filter(img -> img.isMain() && img.getImageUrl() != null) // 메인 이미지이면서 URL이 null이 아닌 것만
        .findFirst()
        .map(img -> img.getImageUrl())
        .orElseGet(() -> restaurant.getRestaurantImage().stream()
            .filter(img -> img.getImageUrl() != null)
            .findFirst()
            .map(img -> img.getImageUrl())
            .orElse(null)); // 모든 이미지가 null이면 null 반환
  }

  /**
   * 모든 이미지 URL 가져오기
   */
  public static List<String> getAllImageUrls(Restaurant restaurant){
    if (restaurant.getRestaurantImage() == null){
      return List.of();
    }

    return restaurant.getRestaurantImage().stream()
        .map(img -> img.getImageUrl())
        .filter(url -> url != null) // null URL 제외
        .collect(Collectors.toList());
  }
}
