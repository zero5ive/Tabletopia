package com.tabletopia.userservice.config;

import com.tabletopia.userservice.domain.user.service.CustomOAuth2UserService;
import com.tabletopia.userservice.handler.OAuth2SuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login/oauth2/**", "/oauth2/authorization/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
//                        .loginPage("/user/loginform") // 커스텀 로그인 페이지 경로(React에서 관리하므로 불필요)
                        .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                        .defaultSuccessUrl("/user/login/ok")
                );


        return http.build();
    }
}