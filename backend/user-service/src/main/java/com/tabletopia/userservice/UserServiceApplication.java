package com.tabletopia.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

/**
 * User-Service 스프링 부트 애플리케이션의 메인 진입점입니다.
 */
@SpringBootApplication
@EnableRedisRepositories(basePackages = "com.tabletopia.userservice.domain.refreshtoken.repository")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
