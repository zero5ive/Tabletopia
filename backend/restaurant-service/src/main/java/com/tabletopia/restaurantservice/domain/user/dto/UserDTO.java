package com.tabletopia.restaurantservice.domain.user.dto;

import lombok.Data;

/**
 * 사용자 데이터 전송 객체 (DTO)입니다.
 * 주로 회원가입과 같은 사용자 정보 전송에 사용됩니다.
 *
 * @author 이세형
 * @since 2025-09-30
 */
@Data
public class UserDTO {
    private String name;
    private String password;
    private String email;
    private String phoneNumber;
}
