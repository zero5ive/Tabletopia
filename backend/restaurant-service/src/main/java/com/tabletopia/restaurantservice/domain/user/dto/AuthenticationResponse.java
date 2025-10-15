package com.tabletopia.restaurantservice.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 로그인 인증 성공 시 응답으로 사용되는 DTO입니다.
 * 생성된 Access Token을 포함합니다.
 * Refresh Token은 HttpOnly 쿠키로 별도 전송됩니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private boolean success;
    private final String accessToken;
}
