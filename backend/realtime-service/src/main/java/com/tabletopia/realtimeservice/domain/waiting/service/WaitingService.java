package com.tabletopia.realtimeservice.domain.waiting.service;

import com.tabletopia.realtimeservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.enums.WaitingState;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WaitingService {

  //웨이팅 등록
  public Waiting save(Waiting waiting);

  // 웨이팅 오픈 상태 설정
  public void setWaitingOpen(boolean isOpen);

  // 웨이팅 오픈 상태 조회
  public boolean isWaitingOpen();

  public Page<WaitingResponse> getWaitingList(Long restaurantId, WaitingState status, Pageable pageable);

  //waitingnumber조회
  public Integer getMaxWaitingNumber(Long restaurantId);

  //웨이팅 취소
  public void cancelWaiting(Long id, Long restaurantId);

  //웨이팅 호출
  public Waiting callWaiting(Long id, Long restaurantId);

  //웨이팅 착석
  public Waiting seatedWaiting(Long id, Long restaurantId);
}
