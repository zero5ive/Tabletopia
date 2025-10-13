package com.tabletopia.realtimeservice.domain.waiting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * 웨이팅 컨피그
 *
 * @author 성유진
 * @since 2025-09-26
 */
/*
@Configuration
@EnableWebSocketMessageBroker //이 어노테이션을 붙여야 브로커가 됨
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    //서버 -> 모든 구독자
    registry.enableSimpleBroker("/topic", "/queue");
    //클라이언트 -> 서버
    registry.setApplicationDestinationPrefixes("/app");
    //서버 -> 특정유저
    registry.setUserDestinationPrefix("/user");

  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    //클라이언트의 서버 접속 엔드포인트 지정
    registry.addEndpoint("/ws")
        .setAllowedOriginPatterns("*")
        .withSockJS();

  }
}

 */