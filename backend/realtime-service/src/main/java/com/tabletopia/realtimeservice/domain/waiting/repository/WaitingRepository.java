package com.tabletopia.realtimeservice.domain.waiting.repository;

import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * 웨이팅 레파지토리
 *
 * @author 성유진
 * @since 2025-09-26
 */

public interface WaitingRepository extends JpaRepository<Waiting, Long> {

}
