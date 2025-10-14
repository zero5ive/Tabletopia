package com.tabletopia.restaurantservice.domain.waiting.service;

import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WaitingNotificationService {

  private final SimpMessagingTemplate simpMessagingTemplate;

  public void notifyWaitingStatusChange(Waiting waiting, Long restaurantId, String topic) {
    WaitingResponse response = WaitingResponse.from(waiting, restaurantId);
    simpMessagingTemplate.convertAndSend(topic, response);
  }
}
