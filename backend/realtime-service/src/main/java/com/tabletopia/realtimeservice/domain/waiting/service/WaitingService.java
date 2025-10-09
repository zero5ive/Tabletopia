package com.tabletopia.realtimeservice.domain.waiting.service;

import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import java.util.List;

public interface WaitingService {

  public Waiting save(Waiting waiting);

  // 웨이팅 오픈 상태 설정
  public void setWaitingOpen(boolean isOpen);

  // 웨이팅 오픈 상태 조회
  public boolean isWaitingOpen();

  public List<Waiting> getWaitingList();

  //waitingnumber조회
  public Integer getMaxWaitingNumber(Long restaurantId);

}
