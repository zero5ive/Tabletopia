package com.tabletopia.userservice.config;

import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.oauth.OAuth20Service;
import com.tabletopia.userservice.auth.oauth.NaverApi20;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
public class OAuthConfig {
    //Client ID, Secret, callback주소 보안매핑
    /*============구글 매핑===========*/
    @Value("${oauth.google.clientId}")
    private String googleClientId;

    @Value("${oauth.google.clientSecret}")
    private String googleClientSecret;

    @Value("${oauth.google.callback}")
    private String googleCallbackUrl;

    /*============네이버 매핑===========*/
    @Value("${oauth.naver.clientId}")
    private String naverClientId;

    @Value("${oauth.naver.clientSecret}")
    private String naverClientSecret;

    @Value("${oauth.naver.callback}")
    private String naverCallbackUrl;

    /**
     * 구글 로그인 관련 서비스 객체 등록
     * @return
     */
    @Bean
    public OAuth20Service googleOAuthService() {
        // 클라이언트 ID(properties에 매핑)
        ServiceBuilder builder = new ServiceBuilder(googleClientId);
        //시크릿(properties에 매핑)
        builder.apiSecret(googleClientSecret);

        //접근범위
        builder.defaultScope("email profile openid");
        //콜백 주소 동의 완료 후 아래의 url로 요청
        builder.callback(googleCallbackUrl);
        return builder.build(GoogleApi20.instance());
    }

    /**
     * 네이버 로그인 관련 서비스 객체 등록
     * @return
     */
    @Bean
    public OAuth20Service naverOAuthService() {
        // 클라이언트 ID(properties에 매핑)
        ServiceBuilder builder = new ServiceBuilder(naverClientId);
        //시크릿(properties에 매핑)
        builder.apiSecret(naverClientSecret);

        //접근범위
        builder.defaultScope("email profile openid");
        //콜백 주소 동의 완료 후 아래의 url로 요청
        builder.callback(naverCallbackUrl);
        return builder.build(NaverApi20.instance());
    }

}
