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
                        .requestMatchers("/users/login/oauth2/**", "/oauth2/authorization/**").permitAll()
                        .anyRequest().authenticated()
                )
                /*
                 * 아래의 oauth2Login 등록되는 시점부터 Security 6의 OAuth2 기반 인증이 시작
                 * OAuth2AuthorizationRequestRedirectFilter가 이 시점부터 작동
                 * 주의할 점) 이 필터가 리다이렉트 할 Provider의 요청주소가 이미 정해진 형식
                 * /oauth2/authorization/{providerId}로 정해져있기 때문에, 혹시나 요청시 스프링 시큐리티가 이해할 수 없는 접두어가 있다면
                 * 반드시 제거해줘야 이 필터가 동작
                 *
                 * */
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(ui->ui.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler) //로그인 완료시 표시될 url주소
                );

        return http.build();
    }
}