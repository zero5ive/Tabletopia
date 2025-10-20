package com.tabletopia.restaurantservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;



@Configuration
public class CorsConfig {

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    // 로컬 개발 환경
    config.addAllowedOrigin("http://localhost:5173"); // Admin 로컬
    config.addAllowedOrigin("http://localhost:3000"); // User 로컬

    // 네이버 클라우드 배포 환경 (실제 Frontend 배포 URL로 변경 필요)
    config.addAllowedOrigin("http://223.130.138.158:5173"); // Admin 배포
    config.addAllowedOrigin("http://223.130.138.158:3000"); // User 배포

    config.addAllowedMethod("*"); // GET, POST, PUT, DELETE 등
    config.addAllowedHeader("*");
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }

}
