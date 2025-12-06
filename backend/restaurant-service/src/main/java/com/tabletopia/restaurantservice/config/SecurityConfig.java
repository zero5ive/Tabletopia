package com.tabletopia.restaurantservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tabletopia.restaurantservice.exception.CustomAuthenticationEntryPoint;
import com.tabletopia.restaurantservice.filter.JwtRequestFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
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
 * Spring Security 전체 설정을 담당하는 Config 클래스
 * - Admin: 세션 기반 로그인
 * - User: JWT 기반 인증
 *
 * @author 이세형
 * @since 2025-12-06
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // JWT 필터 (User 인증용)
    private final JwtRequestFilter jwtRequestFilter;
    // JSON응답을 위한 Object mapper
    private final ObjectMapper objectMapper;
    // Admin 인증용 UserDetailsService
    private final AdminDetailsService adminDetailsService;
    // User 인증용 UserDetailsService
    private final CustomUserDetailsService customUserDetailsService;
    // 인증 실패 시 동작할 Custom EntryPoint
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    /**
     * 비밀번호 암호화를 위한 Encoder Bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Admin 로그인을 위한 DaoAuthenticationProvider 설정
     */
    @Bean
    public DaoAuthenticationProvider adminAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(adminDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * User(JWT) 로그인을 위한 DaoAuthenticationProvider 설정
     */
    @Bean
    public DaoAuthenticationProvider userAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * AuthenticationManager 수동 설정
     * - 두 개의 Provider (Admin, User)를 모두 등록함
     */
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
                // CORS 설정
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000")); // 프론트 주소
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
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
              // 하위 리소스 (메뉴, 이미지, 운영시간 등) — ADMIN, SUPERADMIN 전부 CRUD 가능
              .requestMatchers("/api/admin/restaurants/*/menus/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/images/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/facilities/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/hours/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/special-hours/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/reviews/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/waiting/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers("/api/admin/restaurants/*/reservations/**").hasAnyRole("ADMIN", "SUPERADMIN")

              // 매장 CRUD 중 조회만 ADMIN 허용, 나머지는 SUPERADMIN만 가능
              .requestMatchers(HttpMethod.GET, "/api/admin/restaurants/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers(HttpMethod.POST, "/api/admin/restaurants/**").hasAnyRole("ADMIN", "SUPERADMIN")
              .requestMatchers(HttpMethod.PUT, "/api/admin/restaurants/**").hasRole("SUPERADMIN")
              .requestMatchers(HttpMethod.DELETE, "/api/admin/restaurants/**").hasRole("SUPERADMIN")

              // 기타 관리자 API — ADMIN 이상 접근 가능
              .anyRequest().hasAnyRole("ADMIN", "SUPERADMIN")
          )
        // Session 기반 인증 사용
          .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
          .securityContext(ctx -> ctx.requireExplicitSave(false));


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
                .securityMatcher("/api/user/**", "/api/chat/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    config.setExposedHeaders(List.of("Set-Cookie"));
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

                        .requestMatchers("/api/chat/**").authenticated()

                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e.authenticationEntryPoint(customAuthenticationEntryPoint))
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
