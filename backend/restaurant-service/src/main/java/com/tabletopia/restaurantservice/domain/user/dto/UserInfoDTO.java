package com.tabletopia.restaurantservice.domain.user.dto;

import com.tabletopia.restaurantservice.domain.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private long id;

    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    private String name;

    @Pattern(regexp = "^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNumber;

    public static UserInfoDTO from(User user) {
        return new UserInfoDTO(user.getId(),user.getEmail(), user.getName(), user.getPhoneNumber());
    }
}
