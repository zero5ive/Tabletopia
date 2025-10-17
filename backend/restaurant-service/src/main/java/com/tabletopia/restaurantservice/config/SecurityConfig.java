package com.tabletopia.restaurantservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.tabletopia.restaurantservice.filter.JwtRequestFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;
import java.util.Map;

import com.tabletopia.restaurantservice.domain.admin.service.AdminDetailsService;

import com.tabletopia.restaurantservice.domain.user.service.CustomUserDetailsService;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;


/**
 * 스프링 시큐리티의 설정 Bean입니다
 *
 * @author 이세형
 * @since 2025-09-27
 *
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final ObjectMapper objectMapper;
    private final AdminDetailsService adminDetailsService;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider adminAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(adminDetailsService);
        provider.setPasswordEncoder(passwordEncoder()); // Use the bean directly
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider userAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder()); // Use the bean directly
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration,
            HttpSecurity http
    ) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .authenticationProvider(adminAuthenticationProvider())
                .authenticationProvider(userAuthenticationProvider());
        return authenticationManagerBuilder.build();
    }

    /**
     * Session기반 admin로그인을 처리하기 위한 필터
     * 모든 /api/admin/** 경로에 세션 기반 인증 적용
     *
     * @author 이세형
     * @since 2025-10-15
     *
     */
    @Bean
    @Order(1)
    public SecurityFilterChain adminFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000")); // 프론트 주소
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true); // 세션 쿠키 허용
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    config.setExposedHeaders(List.of("Set-Cookie"));
                    return config;
                }))
                .securityMatcher("/api/admin/**")
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers( // 로그인 엔드포인트는 인증 없이 접근 가능
                                        "/api/admin/auth/login",
                                        "/api/admin/auth/register"
                                ).permitAll()
                                // 그 외 모든 /api/admin/** 경로는 인증 필요
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .securityContext(securityContext -> securityContext
                        .requireExplicitSave(false) // 자동으로 SecurityContext를 세션에 저장
                );

        return http.build();
    }

    /**
     * JWT기반 user로그인을 처리하기 위한 필터
     * 모든 /api/user/** 경로에 JWT 기반 인증 적용
     *
     * @author 이세형
     * @since 2025-10-15
     *
     */
    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/user/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    return config;
                }))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                            // 인증 없이 접근 가능한 public 엔드포인트
                                "/api/user/auth/login",
                                "/api/user/auth/register",
                                "/api/user/auth/refresh",
                                "/api/user/restaurants/**",
                                "/api/user/categories/**",
                                "/api/user/facilities/**",
                                "/api/user/waiting/status",
                                "/.well-known/**"
                        ).permitAll()
                        // 그 외 모든 /api/user/** 경로는 JWT 인증 필요
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * WebSocket과 기타 경로를 위한 필터 체인
     * /ws, /uploads 등 추가 경로 처리
     *
     * @author 이세형
     * @since 2025-10-17
     */
    @Bean
    @Order(3)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/ws/**", "/uploads/**", "/actuator/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    private AuthenticationSuccessHandler adminAuthenticationSuccessHandler() {
        return (request, response, authentication) -> {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(objectMapper.writeValueAsString(Map.of("success", true, "message", "Admin login successful")));
        };
    }

    private AuthenticationFailureHandler adminAuthenticationFailureHandler() {
        return (request, response, exception) -> {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(objectMapper.writeValueAsString(Map.of("success", false, "message", "Admin login failed: " + exception.getMessage())));
        };
    }
}
