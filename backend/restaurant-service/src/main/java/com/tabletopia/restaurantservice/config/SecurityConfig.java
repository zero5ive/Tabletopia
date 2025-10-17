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
                    config.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트 주소
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowCredentials(true); // 세션 쿠키 허용
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    config.setExposedHeaders(List.of("Set-Cookie"));
                    return config;
                }))
                .securityMatcher("/admin/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers(
                                        "/admin/api/login",
//                                "/admin/api/tables/1",
                                        "/admin/api/restaurants"
//                                "/admin/api/me"
                                ).permitAll()
                                .requestMatchers("/admin/api/me", "/admin/api/logout").authenticated()
                                .anyRequest().authenticated()
                );


        return http.build();
    }

    /**
     * JWT기반 user로그인을 처리하기 위한 필터
     *
     * @author 이세형
     * @since 2025-10-15
     *
     */
    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                }) // CORS 활성화 (중요!)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/register",
                                "/api/user/refresh",
                                "/.well-known/**",
                                "/admin/api/tables/1",
                                "/admin/api/restaurants",
                                 "/api/restaurants/**",
                                "/api/restaurantcategories/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

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
