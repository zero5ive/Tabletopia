package com.tabletopia.userservice.util;

import java.util.Map;

public class UserInfoExtractor {

    /*--------------------------------------------------------------------------------
     *   고유ID
     * --------------------------------------------------------------------------------*/
    public static String getProviderId(String regId, Map<String, Object> attr){
        //Provider 업체마다 key값이 다르므로 조건을 부여하기 위함
        String providerId = null;
        if(regId.equals("google")){
            providerId = (String)attr.get("sub");
        }else if(regId.equals("naver")){
            Map<String, Object> resp = (Map<String, Object>)attr.get("response");
            providerId = (String)resp.get("id");
        }else if(regId.equals("kakao")){
            providerId = attr.get("id").toString();
        }
        return providerId;
    }

    /*--------------------------------------------------------------------------------
     *   Email추출
     * --------------------------------------------------------------------------------*/
    public static  String getEmail(String regId, Map<String, Object> attr){
        String email = null;
        if(regId.equals("google")){
            email = (String)attr.get("email");
        }else if(regId.equals("naver")){
            Map<String, Object> resp = (Map<String, Object>)attr.get("response");
            email = (String)resp.get("email");
        }else if(regId.equals("kakao")){
            Map<String, Object> account = (Map<String, Object>)attr.get("kakao_account");
            email = (String)account.get("email");
        }
        return email;
    }
    /*--------------------------------------------------------------------------------
     *   name추출
     * --------------------------------------------------------------------------------*/
    public static String getName(String regId, Map<String, Object> attr){
        String name = null;
        if(regId.equals("google")){
            name = (String)attr.get("name");
        }else if(regId.equals("naver")){
            Map<String, Object> resp = (Map<String, Object>)attr.get("response");
            Object n = resp.get("name"); //실명을 주지 않을 수도 있음
            name=(n!=null)?n.toString():"";
        }else if(regId.equals("kakao")){
            Map<String, Object> account = (Map<String, Object>)attr.get("kakao_account");
            Map<String, Object> profile= (Map<String, Object>)account.get("profile");
            name = (String)profile.get("nickname");
        }
        return name;
    }
}
