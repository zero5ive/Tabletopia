package com.tabletopia.restaurantservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 설정
 *
 * @author 김예진
 * @since 2025-10-11
 */
@Configuration
public class RedisConfig {

    // Redis Sentinel 구성을 위해 프로퍼티에서 불러오는 마스터 이름
    @Value("${spring.data.redis.sentinel.master}")
    private String sentinelMaster;

    // Sentinel 노드 목록(호스트:포트 형태의 콤마 구분 문자열)
    @Value("${spring.data.redis.sentinel.nodes}")
    private String sentinelNodes;

    /**
     * Redis Sentinel 기반의 RedisConnectionFactory Bean생성
     * <p>Sentinel을 사용하거나 커스텀 설정을 적용하려면 직접 Bean으로 재정의해야 함<br>
     * 주요 역할:</p>
     * <ul>
     *   <li>Sentinel master 이름을 기반으로 RedisSentinelConfiguration을 구성한다.</li>
     *   <li>프로퍼티에서 정의된 sentinel 노드를 파싱하여 SentinelConfig에 추가한다.</li>
     *   <li>LettuceConnectionFactory를 Sentinel 기반으로 초기화하여 Redis 장애 시 자동 Failover를 지원한다.</li>
     * </ul>
     *
     * @author 이세형
     * @return LettuceConnectionFactory 인스턴스(스프링 내 RedisTemplate 등의 비즈니스 레이어에서 사용)
     * @since 2025-12-11
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // Sentinel 설정 객체 생성, master 이름 설정
        RedisSentinelConfiguration sentinelConfig = new RedisSentinelConfiguration()
                .master(sentinelMaster);

        // spring.data.redis.sentinel.nodes 값 파싱 ("host:port" 형태)
        String[] nodes = sentinelNodes.split(",");
        for (String node : nodes) {
            // hostname과 port를 분리
            String[] parts = node.trim().split(":");
            String host =  parts[0];
            int port = Integer.parseInt(parts[1]);

            // Sentinel 노드 등록
            sentinelConfig.sentinel(host, port);
        }

        // Lettuce 기반 Sentinel 커넥션 팩토리 생성
        LettuceConnectionFactory factory = new LettuceConnectionFactory(sentinelConfig);
        // 내부 속성 초기화
        factory.afterPropertiesSet();
        // 스프링이 IoC 컨테이너에서 주입 가능한 Bean으로 사용하게 반환
        return factory;
    }

  /**
   * RedisTemplate 설정
   * 테이블 선점 정보, 접속자 정보 등을 저장하기 위한 템플릿
   *
   * @author 김예진
   * @since 2025-10-11
   */
  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    // ObjectMapper 설정 (LocalDateTime + 타입 정보)
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    // 타입 정보를 저장하도록 설정 (역직렬화 문제 해결)
    objectMapper.activateDefaultTyping(
        BasicPolymorphicTypeValidator.builder()
            .allowIfBaseType(Object.class)
            .build(),
        ObjectMapper.DefaultTyping.NON_FINAL
    );

    // Custom ObjectMapper를 사용하는 Serializer
    GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

    // Key는 String으로 직렬화
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // Value는 JSON으로 직렬화
    template.setValueSerializer(serializer);
    template.setHashValueSerializer(serializer);

    return template;
  }
}
