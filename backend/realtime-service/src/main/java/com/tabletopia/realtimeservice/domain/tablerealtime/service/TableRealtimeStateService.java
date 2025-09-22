package com.tabletopia.realtimeservice.domain.tablerealtime.service;

import com.tabletopia.realtimeservice.domain.tablerealtime.entity.TableRealtimeState;
import com.tabletopia.realtimeservice.domain.tablerealtime.repository.TableRealtimeStateRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 레스토랑 테이블 서비스
 *
 * @author 김예진
 * @since 2025-09-20
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TableRealtimeStateService {
  private final TableRealtimeStateRepository tableRealtimeStateRepository;

  /**
   * 모든 실시간 테이블 상태 조회
   * @author 김예진
   * @since 2025-09-20
   */
  public List<TableRealtimeState> findAllTableStates(){
    return tableRealtimeStateRepository.findAll();
  }
}
