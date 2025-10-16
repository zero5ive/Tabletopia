package com.tabletopia.restaurantservice.domain.user.dto;

import com.tabletopia.restaurantservice.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private long id;
    private String email;
    private String name;
    private String phoneNumber;

    public static UserInfoDTO from(User user) {
        return new UserInfoDTO(user.getId(),user.getEmail(), user.getName(), user.getPhoneNumber());
    }
}
