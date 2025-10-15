package com.tabletopia.restaurantservice.domain.restaurant.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {

  private Long id;
  private String name;
  private String address;
  private String regionCode; //지역
  private List<String> openingHours;  //운영시간
  private List<String> facilityNames; // 편의시설
  private Double averageRating;       // 평점
  private Integer totalReviews;       // 리뷰수

}
