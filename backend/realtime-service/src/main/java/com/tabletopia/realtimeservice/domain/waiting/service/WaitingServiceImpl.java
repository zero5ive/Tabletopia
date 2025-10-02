package com.tabletopia.realtimeservice.domain.waiting.service;

import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.repository.WaitingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
/**
 * 웨이팅 서비스
 *
 * @author 성유진
 * @since 2025-09-26
 */

@Service
@RequiredArgsConstructor
public class WaitingServiceImpl implements WaitingService{

  private final WaitingRepository waitingRepository;

  @Override
  public Waiting save(Waiting waiting) {
    return waitingRepository.save(waiting);
  }
}
