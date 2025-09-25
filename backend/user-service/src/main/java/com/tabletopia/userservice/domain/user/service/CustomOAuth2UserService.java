package com.tabletopia.userservice.domain.user.service;

import com.tabletopia.userservice.domain.snsprovider.entity.SnsProvider;
import com.tabletopia.userservice.domain.snsprovider.repository.JpaSnsProviderRepository;
import com.tabletopia.userservice.domain.user.entity.User;
import com.tabletopia.userservice.domain.user.repository.JpaUserRepository;
import com.tabletopia.userservice.handler.OAuth2SuccessHandler;
import com.tabletopia.userservice.util.UserInfoExtractor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final JpaSnsProviderRepository jpaSnsProviderRepository;
    private final JpaUserRepository jpaUserRepository;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public CustomOAuth2UserService(
            JpaSnsProviderRepository jpaSnsProviderRepository
            , JpaUserRepository jpaUserRepository
            , OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.jpaSnsProviderRepository = jpaSnsProviderRepository;
        this.jpaUserRepository = jpaUserRepository;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        //1) provider 유형 얻기(google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.debug("당신이 가입한 프로바이더는 ===={}", registrationId);
        SnsProvider snsProvider = jpaSnsProviderRepository.findByName(registrationId);//pk반환
        if (snsProvider == null) {
            throw new OAuth2AuthenticationException("회원가입 정보를 확인해 주세요(알려지지 않은 provider입니다.");
        }

        //회원정보 꺼내기..
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.debug("유저정보는 ======={}", attributes.toString());

        //이미 회원인지 아닌지 판단
        //회원 아니면 => 강제가입, 회원이면 로그인처리(혹시 이메일, 닉네임 변경되었다면 최슨으로 수정)
        String providerId = UserInfoExtractor.getProviderId(registrationId, attributes);//SNS에서 부여한 아이디
        String email = UserInfoExtractor.getEmail(registrationId, attributes);
        String name = UserInfoExtractor.getName(registrationId, attributes);

        User existing = jpaUserRepository.findBySnsProviderAndId(snsProvider, (Long)attributes.get("id"));

        //SNS검증 됐으나 우리 DB회원이 아니라면(자동가입)
        User user = null;
        if (existing == null) {
            user = new User();//가입에 사용할 모델 객체
            user.setSnsProvider(snsProvider);
            user.setId((Long)attributes.get("id"));
            user.setEmail(email);
            user.setName(name);


        } else {//회원이라면
            user = existing;

            //attr에서 꺼내온 이메일이 현재 우리 db의 이메일 정보와 다른 경우
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);//최신 email로 업데이트
            }
            if (name != null && !name.equals(user.getName())) {
                user.setName(name);//최신 name으로 업데이트
            }
            jpaUserRepository.save(user);
        }
        return oAuth2User;
    }
}
