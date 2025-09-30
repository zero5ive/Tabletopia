package com.tabletopia.userservice.domain.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    //필요없는 메서드인듯
    @GetMapping("/users")
    public ResponseEntity<Map> users(){
        return ResponseEntity.ok(Map.of("result", "회원가입 성공"));
    }

    //oauth2 인증 시스템이 한바퀴 돌아가는지 테스트
    @GetMapping("/login/ok")
    public String loginOk(){
        return "login...ok";
    }

}
