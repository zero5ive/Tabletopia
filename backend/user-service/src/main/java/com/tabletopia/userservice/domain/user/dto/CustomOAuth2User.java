package com.tabletopia.userservice.domain.user.dto;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * OAuth2 인증 과정을 통해 얻은 사용자 정보를 래핑하는 커스텀 OAuth2User 구현체입니다.
 * Spring Security에서 OAuth2 사용자 정보를 일관된 방식으로 처리하기 위해 사용됩니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Getter
public class CustomOAuth2User implements OAuth2User {


    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return "";
    }
}
