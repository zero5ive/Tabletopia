package com.tabletopia.restaurantservice.domain.restaurant.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
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
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestaurantService {

  private final RestaurantRepository restaurantRepository;

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
}
