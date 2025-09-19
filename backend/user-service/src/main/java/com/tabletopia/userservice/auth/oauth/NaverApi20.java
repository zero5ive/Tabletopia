package com.tabletopia.userservice.auth.oauth;

import com.github.scribejava.core.builder.api.DefaultApi20;

public class NaverApi20 extends DefaultApi20 {
    private static final String NAVER_AUTHORIZE_URL="https://nid.naver.com/oauth2.0/authorize";
    private static final String NAVER_ACCESS_TOKEN_URL="https://nid.naver.com/oauth2.0/token";

    protected NaverApi20() {}
    private static class InstanceHolder{
        private static final NaverApi20 INSTANCE = new NaverApi20();
    }

    public static NaverApi20 instance() {
        return InstanceHolder.INSTANCE;
    }

    //네이버의 동의화면 Url주소
    @Override
    protected String getAuthorizationBaseUrl() {
        return NAVER_AUTHORIZE_URL;
    }

    //네이버에 요청할 토큰 요청 주소
    @Override
    public String getAccessTokenEndpoint() {
        return NAVER_ACCESS_TOKEN_URL;
    }

}
