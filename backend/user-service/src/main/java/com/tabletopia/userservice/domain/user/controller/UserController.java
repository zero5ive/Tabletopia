package com.tabletopia.userservice.domain.user.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    //oauth2 인증 시스템이 한바퀴 돌아가는지 테스트
    @GetMapping("/login/ok")
    public String loginOk(){
        return "login...ok";
    }

    /**
     * 로그인폼에 연결해주는 메서드
     * 프론트엔드 요청주소가 존재하기 때문에 필요x
     *
     * @author 이세형
     * @since 2025-09-26
     * TODO : 초기화면 아니므로 로그인폼요청주소 매핑 해줘야 함
     *   로그인만 동기처리, 페이지 이동시 디폴트 비동기처리
     * */
    @GetMapping("/loginform살리기")
    public String getLoginForm(){
        log.debug("===로그인폼 불러오기 요청이 들어옴");
        //RestController는 'redirect:' prefix를 사용해 요청해야 함
        return "redirect:http://localhost:3000/users/loginform";
    }
}
