package com.tabletopia.realtimeservice.domain.reservation.controller;

import com.tabletopia.realtimeservice.domain.reservation.dto.AvailableTableResponse;
import com.tabletopia.realtimeservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.dto.ApiResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservationController {
  private final ReservationService reservationService;

  /**
   * 전체 예약 조회
   * @return
   */
  @GetMapping("/reservations")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservations(){
    List<Reservation> reservations = reservationService.findAllReservations();

    return ResponseEntity.ok(ApiResponse.success("예약 전체 조회 성공", reservations));
  }

  /**
   * 특정 레스토랑의 예약 조회
   * @param restaurantId
   * @return
   */
  @GetMapping("/reservations/restaurants/{restaurantId}")
  public ResponseEntity<ApiResponse<List<Reservation>>> getReservationsByRestaurantId(@PathVariable Long restaurantId){
    List<Reservation> reservations = reservationService.findReservationsByRestaurantId(restaurantId);

    return ResponseEntity.ok(ApiResponse.success("예약 조회 성공", reservations));
  }

  /**
   * 예약이 불가한 테이블들 조회
      * TODO 예약이 가능한 테이블 조회로 바꾸기
   */
  @GetMapping("/restaurants/{restaurantId}/unavailable-tables")
  public ResponseEntity<ApiResponse<List<UnavailableTableResponse>>> getUnavailableTablesAt(
      @PathVariable Long restaurantId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reservation_at){

  List<UnavailableTableResponse> unavailableTables = reservationService.getUnavailableTablesAt(restaurantId, reservation_at);

    return ResponseEntity.ok(
        ApiResponse.success("예약 불가능한 테이블 조회 성공", unavailableTables)
    );
  }


  // ========== 테이블 더미데이터 ========== //
  // 임시 더미 데이터 서비스 (분산 서버 완성 전까지 사용)
  private final TableDummyService tableDummyService = new TableDummyService();

  // ===== 이너클래스: 임시 더미 데이터 서비스 =====
  /**
   * 테이블 더미 데이터 서비스
   */
  private static class TableDummyService {

    private final List<TableData> dummyTables;

    public TableDummyService() {
      this.dummyTables = initializeDummyData();
    }

    /**
     * 더미 데이터 초기화
     */
    private List<TableData> initializeDummyData() {
      List<TableData> tables = new ArrayList<>();

      // 맛있는 한식당 (restaurant_id = 1) 테이블들
      tables.add(new TableData(1L, 1L, "1번 테이블", 2, 4, 100, 100, "RECTANGLE"));
      tables.add(new TableData(2L, 1L, "2번 테이블", 2, 4, 200, 100, "RECTANGLE"));
      tables.add(new TableData(3L, 1L, "3번 테이블", 4, 6, 300, 100, "RECTANGLE"));
      tables.add(new TableData(4L, 1L, "창가석", 2, 2, 100, 200, "CIRCLE"));

      // 중화요리 만리장성 (restaurant_id = 2) 테이블들
      tables.add(new TableData(5L, 2L, "A1", 2, 4, 150, 150, "RECTANGLE"));
      tables.add(new TableData(6L, 2L, "A2", 4, 8, 250, 150, "RECTANGLE"));
      tables.add(new TableData(7L, 2L, "룸1", 6, 10, 350, 150, "RECTANGLE"));

      // 스시 마스터 (restaurant_id = 3) 테이블들
      tables.add(new TableData(8L, 3L, "카운터1", 1, 2, 120, 120, "RECTANGLE"));
      tables.add(new TableData(9L, 3L, "카운터2", 1, 2, 220, 120, "RECTANGLE"));
      tables.add(new TableData(10L, 3L, "테이블1", 2, 4, 120, 220, "RECTANGLE"));

      // 이탈리안 파스타 (restaurant_id = 4) 테이블들
      tables.add(new TableData(11L, 4L, "테이블1", 2, 4, 150, 100, "RECTANGLE"));
      tables.add(new TableData(12L, 4L, "테이블2", 2, 4, 250, 100, "RECTANGLE"));
      tables.add(new TableData(13L, 4L, "커플석", 2, 2, 100, 200, "CIRCLE"));

      // 치킨킹 (restaurant_id = 5) 테이블들
      tables.add(new TableData(14L, 5L, "홀1", 4, 6, 200, 150, "RECTANGLE"));
      tables.add(new TableData(15L, 5L, "홀2", 4, 6, 300, 150, "RECTANGLE"));
      tables.add(new TableData(16L, 5L, "룸1", 6, 8, 400, 150, "RECTANGLE"));

      return tables;
    }

    /**
     * 예약 가능한 테이블 조회 (더미)
     */
    public List<AvailableTableResponse> getAvailableTables(
        Long restaurantId, LocalDateTime reservationAt, Integer peopleCount) {

      return dummyTables.stream()
          .filter(table -> table.restaurantId.equals(restaurantId))
          .filter(table -> table.minCapacity <= peopleCount && peopleCount <= table.maxCapacity)
          .map(table -> {
            // 간단한 예약 가능 여부 시뮬레이션 (랜덤)
            boolean isAvailable = Math.random() > 0.3; // 70% 확률로 예약 가능

            return AvailableTableResponse.builder()
                .tableId(table.id)
                .tableName(table.name)
                .minCapacity(table.minCapacity)
                .maxCapacity(table.maxCapacity)
                .shape(table.shape)
                .xPosition(table.xPosition)
                .yPosition(table.yPosition)
                .isAvailable(isAvailable)
                .build();
          })
          .collect(Collectors.toList());
    }

    /**
     * 레스토랑의 모든 테이블 조회 (더미)
     */
    public List<TableResponse> getTablesByRestaurantId(Long restaurantId) {
      return dummyTables.stream()
          .filter(table -> table.restaurantId.equals(restaurantId))
          .map(table -> TableResponse.builder()
              .tableId(table.id)
              .tableName(table.name)
              .minCapacity(table.minCapacity)
              .maxCapacity(table.maxCapacity)
              .shape(table.shape)
              .xPosition(table.xPosition)
              .yPosition(table.yPosition)
              .build())
          .collect(Collectors.toList());
    }

    /**
     * 테이블 데이터 클래스 (더미용)
     */
    @Getter
    private static class TableData {
      private final Long id;
      private final Long restaurantId;
      private final String name;
      private final Integer minCapacity;
      private final Integer maxCapacity;
      private final Integer xPosition;
      private final Integer yPosition;
      private final String shape;

      public TableData(Long id, Long restaurantId, String name, Integer minCapacity,
          Integer maxCapacity, Integer xPosition, Integer yPosition, String shape) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.minCapacity = minCapacity;
        this.maxCapacity = maxCapacity;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.shape = shape;
      }
    }

    // ===== 응답 DTO 클래스들 =====

    /**
     * 예약 가능한 테이블 응답 DTO
     */
    @Getter
    @lombok.Builder
    public static class AvailableTableResponse {
      private Long tableId;
      private String tableName;
      private Integer minCapacity;
      private Integer maxCapacity;
      private String shape;
      private Integer xPosition;
      private Integer yPosition;
      private boolean isAvailable;    // 예약 가능 여부
    }

    /**
     * 테이블 정보 응답 DTO
     */
    @Getter
    @lombok.Builder
    public static class TableResponse {
      private Long tableId;
      private String tableName;
      private Integer minCapacity;
      private Integer maxCapacity;
      private String shape;
      private Integer xPosition;
      private Integer yPosition;
    }
  }


 }
