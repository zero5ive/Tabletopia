package com.tabletopia.restaurantservice.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author 서예닮
 * @since 2025-10-16
 * 사용자 정보 업데이트 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @Pattern(regexp = "^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNumber;
}
