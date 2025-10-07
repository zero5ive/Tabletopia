package com.tabletopia.restaurantservice.domain.service;

import com.tabletopia.restaurantservice.domain.dto.RestaurantTableResponse;
import com.tabletopia.restaurantservice.domain.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 레스토랑 테이블 Service
 * 특정 레스토랑에 속한 테이블 정보를 조회하고,
 * Entity → DTO(RestaurantTableResponse) 변환을 담당한다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: Repository에서 가져온 엔티티를
 *       Controller 계층에서 바로 사용할 수 있도록 DTO로 가공한다.
 */
@Service
@RequiredArgsConstructor
public class RestaurantTableService {

  private final RestaurantTableRepository tableRepository;

  /**
   * 특정 레스토랑의 모든 테이블을 조회한다.
   * @param restaurantId 레스토랑 ID
   * @return 레스토랑 테이블 리스트 (RestaurantTableResponse DTO)
   */
  public List<RestaurantTableResponse> getTablesByRestaurant(Long restaurantId) {
    return tableRepository.findByRestaurantId(restaurantId)
        .stream()
        .map(table -> new RestaurantTableResponse(
            table.getId(),
            table.getName(),
            table.getMinCapacity(),
            table.getMaxCapacity(),
            table.getXPosition(),
            table.getYPosition(),
            table.getShape()
        ))
        .toList();
  }
}
