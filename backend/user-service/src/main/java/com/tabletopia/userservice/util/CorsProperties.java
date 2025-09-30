package com.tabletopia.userservice.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "cors")  // "cors"로 시작하는 프로퍼티 바인딩
public class CorsProperties {

    private String allowedOrigins;
}

