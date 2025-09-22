package com.tabletopia.realtimeservice.domain.tablerealtime.repository;

import com.tabletopia.realtimeservice.domain.tablerealtime.entity.TableRealtimeState;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 레스토랑 테이블 리포지토리
 *
 * @author 김예진
 * @since 2025-09-20
 */
public interface TableRealtimeStateRepository extends JpaRepository<TableRealtimeState, Long> {

}
