package com.tabletopia.restaurantservice.domain.chat.service;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 채팅 요청 제한 관리 컴포넌트
 *
 * 일반 사용자가 하루에 사용할 수 있는
 * 챗봇 요청 횟수를 제한한다.
 *
 * 관리자 계정(ROLE_ADMIN)은 제한 없이 사용할 수 있으며,
 * usageMap은 메모리 상에서 관리된다.
 *
 * @author 김지민
 * @since 2025-10-19
 */
@Component
public class ChatRateLimiter {

  // 사용자별 요청 횟수를 저장하는 맵 (이메일 기준)
  private final Map<String, Integer> usageMap = new ConcurrentHashMap<>();

  // 일반 사용자의 하루 최대 요청 횟수
  private static final int MAX_REQUESTS_PER_DAY = 5;

  /**
   * 사용자가 챗봇을 이용할 수 있는지 여부를 검사한다.
   *
   * @param userEmail 사용자 이메일 (JWT subject)
   * @return true: 사용 가능, false: 제한 초과
   */
  public boolean canUse(String userEmail) {
    return usageMap.getOrDefault(userEmail, 0) < MAX_REQUESTS_PER_DAY;
  }

  /**
   * 사용자의 챗봇 요청 횟수를 1회 증가시킨다.
   *
   * @param userEmail 사용자 이메일
   */
  public void incrementUsage(String userEmail) {
    usageMap.merge(userEmail, 1, Integer::sum);
  }

  /**
   * 모든 사용자의 일일 요청 횟수를 초기화한다.
   *
   * 일반적으로 스케줄러(@Scheduled(cron = "..."))에 의해
   * 하루 1회 자정마다 호출되도록 설정한다.
   */
  public void resetDaily() {
    usageMap.clear();
  }
}
