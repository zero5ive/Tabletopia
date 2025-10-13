package com.tabletopia.realtimeservice.domain.waiting.service;

import com.tabletopia.realtimeservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.enums.WaitingState;
import com.tabletopia.realtimeservice.domain.waiting.repository.WaitingRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  private final ModelMapper modelMapper;

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
  public Page<WaitingResponse> getWaitingList(Long restaurantId, WaitingState status,  Pageable pageable) {

    // 오늘 0시 계산
    LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();

    Page<Waiting> waitingPage = waitingRepository.findByRestaurantIdAndWaitingStateAndCreatedAtAfter(
        restaurantId, status, todayStart, pageable);
    // Entity를 DTO로 변환
    return waitingPage.map(waiting -> modelMapper.map(waiting, WaitingResponse.class));
  }

  @Override
  public Integer getMaxWaitingNumber(Long restaurantId) {
    // 오늘 날짜 기준으로 최대 웨이팅 번호 조회
    return waitingRepository.findMaxWaitingNumberByRestaurantIdToday(restaurantId);

  }

  @Override
  public void cancelWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(()-> new RuntimeException("웨이팅을 찾을 수 없습니다."));

    waiting.assignWaitingState(WaitingState.CANCELLED);
    waitingRepository.save(waiting);
  }


}
