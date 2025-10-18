package com.tabletopia.restaurantservice.domain.waiting.service;

import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WaitingService {

  //웨이팅 등록
  public Waiting registerWaiting(Long restaurantId, Long userId, Integer peopleCount);

  // 웨이팅 오픈 상태 조회
  public boolean isWaitingOpen(Long restaurantId);

  // 웨이팅 오픈
  public void openWaiting(Long restaurantId);

  // 웨이팅 마감
  public void closeWaiting(Long restaurantId);

  public Page<WaitingResponse> getWaitingList(Long restaurantId, WaitingState status, Pageable pageable);

  //waitingnumber조회
  public Integer getMaxWaitingNumber(Long restaurantId);

  //웨이팅 취소
  public Waiting cancelWaiting(Long id, Long restaurantId);

  //웨이팅 호출
  public Waiting callWaiting(Long id, Long restaurantId);

  //웨이팅 착석
  public Waiting seatedWaiting(Long id, Long restaurantId, Long tableId);

  //내 앞에 대기 중인 팀 수 조회
  public Integer getTeamsAheadCount(Long restaurantId, Integer myWaitingNumber);

  //사용자의 웨이팅 내역 조회 (앞 대기팀 수 포함)
  public Page<WaitingResponse> getUserWaitingList(Long userId, Pageable pageable);
}
