package com.tabletopia.realtimeservice.domain.tablerealtime.controller;

import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.domain.tablerealtime.entity.TableRealtimeState;
import com.tabletopia.realtimeservice.domain.tablerealtime.service.TableRealtimeStateService;
import com.tabletopia.realtimeservice.dto.ApiResponse;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/realtime/api")
@RequiredArgsConstructor
public class TableRealTimeStateController {
  private final TableRealtimeStateService tableRealtimeStateService;

  @GetMapping("/reservations/table-states")
  public ResponseEntity<ApiResponse< List<TableRealtimeState>>> getTableStates(){
    List<TableRealtimeState> tableStates = tableRealtimeStateService.findAllTableStates();

    return ResponseEntity.ok(
        ApiResponse.success("실시간 테이블 상태 전체 조회 성공", tableStates)
    );
  }
}
