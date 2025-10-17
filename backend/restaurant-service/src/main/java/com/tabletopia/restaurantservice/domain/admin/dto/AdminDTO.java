package com.tabletopia.restaurantservice.domain.admin.dto;

import lombok.Data;

/**
 * admin(지점) 데이터 전송 객체 (DTO)입니다.
 * 주로 회원가입과 같은 사용자 정보 전송에 사용됩니다.
 *
 * @author 이세형
 * @since 2025-10-14
 */
@Data
public class AdminDTO {
    private long id;
    private String name;
    private String email;
}
