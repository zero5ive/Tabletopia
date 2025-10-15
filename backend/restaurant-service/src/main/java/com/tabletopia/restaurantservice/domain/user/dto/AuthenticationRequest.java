package com.tabletopia.restaurantservice.domain.user.dto;

import lombok.Data;

/**
 * 로그인 인증 요청에 사용되는 DTO입니다.
 * 사용자의 이메일과 비밀번호를 포함합니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}
