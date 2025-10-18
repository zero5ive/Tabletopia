package com.tabletopia.restaurantservice.domain.waiting.service;

import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WaitingNotificationService {

  private final SimpMessagingTemplate simpMessagingTemplate;

  /**
   * 웨이팅 상태 변경 알림 (개인 + 레스토랑 토픽으로 전송)
   */
  public void notifyWaitingStatusChange(Waiting waiting, Long restaurantId, String topicType) {
    WaitingResponse response = WaitingResponse.from(waiting, restaurantId);

    // 1. 사용자 개인 알림: /topic/user/{userId}/{topicType}
    String personalTopic = "/topic/user/" + waiting.getUserId() + "/" + topicType;
    log.info("사용자 개인 알림 전송 - topic: {}, userId: {}, waitingId: {}",
        personalTopic, waiting.getUserId(), waiting.getId());
    simpMessagingTemplate.convertAndSend(personalTopic, response);

    // 2. 레스토랑(관리자) 알림: /topic/restaurant/{restaurantId}/{topicType}
    String restaurantTopic = "/topic/restaurant/" + restaurantId + "/" + topicType;
    log.info("레스토랑 알림 전송 - topic: {}, restaurantId: {}, waitingId: {}",
        restaurantTopic, restaurantId, waiting.getId());
    simpMessagingTemplate.convertAndSend(restaurantTopic, response);
  }
}
