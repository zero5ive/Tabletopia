package com.tabletopia.realtimeservice.domain.waiting.service;

import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.repository.WaitingRepository;
import java.util.List;
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

  // 웨이팅 오픈 상태를 메모리에 저장
  private boolean waitingOpen = false;

  @Override
  public Waiting save(Waiting waiting) {
    return waitingRepository.save(waiting);
  }

  @Override
  public void setWaitingOpen(boolean isOpen) {
    this.waitingOpen = isOpen;
  }

  @Override
  public boolean isWaitingOpen() {
    return this.waitingOpen;
  }

  @Override
  public List<Waiting> getWaitingList(Long restaurantId) {
    return waitingRepository.findByRestaurantId(restaurantId);
  }

  @Override
  public Integer getMaxWaitingNumber(Long restaurantId) {
    return waitingRepository.findMaxWaitingNumberByRestaurantId(restaurantId);
  }


}
