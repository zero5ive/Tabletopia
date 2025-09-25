package com.tabletopia.userservice.domain.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    //oauth2 인증 시스템이 한바퀴 돌아가는지 테스트
    @GetMapping("/login/ok")
    public String loginOk(){
        return "login...ok";
    }
}
