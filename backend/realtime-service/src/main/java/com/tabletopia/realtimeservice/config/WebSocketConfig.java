package com.tabletopia.realtimeservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * 스톰프 웹소켓 설정 클래스
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


  /**
   * 경로 설정
   */
  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    // 브로커 경로 설정
    // 서버가 클라이언트에게 메시지를 브로드캐스팅
    registry.enableSimpleBroker("/topic", "/queue");

    // 앱 경로 설정. 클라이언트에서 서버로 요청
    registry.setApplicationDestinationPrefixes("/app");

    // 개인 메시지 경로 설정
    registry.setUserDestinationPrefix("/user");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
        .addEndpoint("/ws")
        .setAllowedOriginPatterns("*")
        .withSockJS();
  }
}
