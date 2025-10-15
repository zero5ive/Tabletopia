package com.tabletopia.restaurantservice.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Querydsl 설정
 * JPAQueryFactory를 Spring Bean으로
 *
 * @author 김예진
 * @since 2025-10-15
 */
@Configuration
@RequiredArgsConstructor
public class QuerydslConfig {

  private final EntityManager entityManager;

  /**
   * JPAQueryFactory 빈 등록
   * @return JPAQueryFactory 인스턴스
   */
  @Bean
  public JPAQueryFactory jpaQueryFactory(){
    return new JPAQueryFactory(entityManager);
  }
}
