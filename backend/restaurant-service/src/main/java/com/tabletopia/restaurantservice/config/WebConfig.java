package com.tabletopia.restaurantservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/**
 * 애플리케이션의 웹 관련 설정을 구성하는 클래스입니다.
 * 특히 CORS(Cross-Origin Resource Sharing) 설정을 담당합니다.
 *
 * @author 이세형, 김지민
 * @since 2025-10-01
 */
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.resource-dir}")
    private String resourceDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "http://223.130.138.158:3000",  // User Frontend 배포 URL
                        "http://223.130.138.158:5173"   // Admin Frontend 배포 URL (포트 확인 필요)
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }


}
