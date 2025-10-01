package com.tabletopia.userservice.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 로그인 인증 성공 시 응답으로 사용되는 DTO입니다.
 * 생성된 JWT (JSON Web Token)를 포함합니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private final String jwt;
}
