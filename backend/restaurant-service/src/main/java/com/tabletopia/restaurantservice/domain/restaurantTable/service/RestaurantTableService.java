package com.tabletopia.restaurantservice.domain.restaurantTable.service;

import com.tabletopia.restaurantservice.domain.restaurantTable.dto.CreateTableRequest;
import com.tabletopia.restaurantservice.domain.restaurantTable.dto.SaveLayoutRequest;
import com.tabletopia.restaurantservice.domain.restaurantTable.dto.SaveLayoutRequest.TableLayout;
import com.tabletopia.restaurantservice.domain.restaurantTable.entity.RestaurantTable;
import com.tabletopia.restaurantservice.domain.restaurantTable.repository.RestaurantTableRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantTableService {
  @PersistenceContext
  private EntityManager entityManager;

  private final RestaurantTableRepository restaurantTableRepository;

  public List<RestaurantTable> getTablesByRestaurant(Long restaurantId) {
    return restaurantTableRepository.findByRestaurantId(restaurantId);
  }


  @Transactional
  public RestaurantTable createTable(Long restaurantId, CreateTableRequest request) {
    RestaurantTable table = RestaurantTable.builder()
        .restaurantId(restaurantId)
        .name(request.getName())
        .minCapacity(request.getMinCapacity())
        .maxCapacity(request.getMaxCapacity())
        .xPosition(request.getXPosition())
        .yPosition(request.getYPosition())
        .shape(request.getShape() != null ? request.getShape() : "RECTANGLE")
        .build();

    return restaurantTableRepository.save(table);
  }

  @Transactional
  public RestaurantTable updateTable(Long tableId, CreateTableRequest request) {
    RestaurantTable table = restaurantTableRepository.findById(tableId)
        .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));

    table.setName(request.getName());
    table.setMinCapacity(request.getMinCapacity());
    table.setMaxCapacity(request.getMaxCapacity());
    table.setXPosition(request.getXPosition());
    table.setYPosition(request.getYPosition());
    table.setShape(request.getShape());

    return restaurantTableRepository.save(table);
  }

  @Transactional
  public void deleteTable(Long tableId) {
    restaurantTableRepository.deleteById(tableId);
  }

  @Transactional
  public List<RestaurantTable> saveLayout(Long restaurantId, SaveLayoutRequest request) {
    // 1️⃣ 기존 데이터 삭제 (DB에 즉시 반영)
    restaurantTableRepository.deleteByRestaurantId(restaurantId);
    restaurantTableRepository.flush(); // DB 반영

    // 2️⃣ 영속성 컨텍스트 초기화 (중복 엔티티 방지)
    entityManager.clear();

    TableLayout tableLayout = request.getTables().stream().toList().get(1);
    log.debug("테이블 좌표 {}, {}", tableLayout.getXPosition(), tableLayout.getYPosition());

    // 새로운 테이블 배치 저장
    List<RestaurantTable> tables = request.getTables().stream()
        .map(layout -> RestaurantTable.builder()
            .restaurantId(restaurantId)
            .name(layout.getName())
            .minCapacity(layout.getMinCapacity())
            .maxCapacity(layout.getMaxCapacity())
            .xPosition(layout.getXPosition())
            .yPosition(layout.getYPosition())
            .shape(layout.getShape() != null ? layout.getShape() : "RECTANGLE")
            .build())
        .toList();

    return restaurantTableRepository.saveAll(tables);
  }
}
