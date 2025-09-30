package com.tabletopia.userservice.domain.user.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String password;
    private String email;
    private String phoneNumber;
}
