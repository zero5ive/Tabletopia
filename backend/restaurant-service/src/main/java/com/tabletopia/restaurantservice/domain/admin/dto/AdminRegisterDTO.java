package com.tabletopia.restaurantservice.domain.admin.dto;

import lombok.Getter;
/**
 * 세선기반 admin(지점) 회원가입을 위한 메서드 입니다.
 *
 * @author 이세형
 * @since 2025-10-16
 * */
@Getter
public class AdminRegisterDTO {
    private String name;
    private String email;
    private String password;
    private String role;
}
