package com.tabletopia.userservice.domain.member.controller;

import com.tabletopia.userservice.domain.member.dto.LoginRequest;
import com.tabletopia.userservice.domain.member.dto.SignUpRequest;
import com.tabletopia.userservice.domain.member.entity.Member;
import com.tabletopia.userservice.domain.member.service.MemberService;
import com.tabletopia.userservice.dto.ApiResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 회원 컨트롤러
 *
 * @author 김예진
 * @since 2025-09-19
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

  private final MemberService memberService;

  /**
   * 로그인 처리
   *
   * @author 김예진
   * @since 2025-09-18
   */
  @PostMapping("/members/login")
  public ResponseEntity<ApiResponse<Map<String, Long>>> login(@RequestBody LoginRequest request) {
    Member member = memberService.login(request.getEmail(), request.getPassword());

    Map<String, Long> data = Map.of("memberId", member.getMemberId());

    return ResponseEntity.ok(ApiResponse.success("로그인 성공", data));
  }

  /**
   * 회원가입 처리
   *
   * @author 김예진
   * @since 2025-09-18
   */
  @PostMapping("/members/new")
  public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
    String memberName = memberService.join(request.toEntity());

    Map<String, String> data = Map.of("memberName", memberName);

    return ResponseEntity.ok(ApiResponse.success("회원가입 성공", data));
  }

      /*
//     * ========================================================================
//     * 구글 로그인 처리
//     * ========================================================================
//     */
//
//    /**
//     * 로그인 인증 요청
//     * @return
//     */
//    @GetMapping("/members/google/authurl")
//    @ResponseBody
//    public String getGoogleAuthUrl() {
//        return googleOAuthService.getAuthorizationUrl();
//    }
//
//    /**
//     * 콜백 메서드
//     * @param code
//     * @param session
//     * @return
//     * @throws InterruptedException
//     * @throws IOException
//     * @throws ExecutionException
//     */
//    @GetMapping("/callback/sns/google")
//    public String googleCallback(String code, HttpSession session)
//            throws InterruptedException, IOException, ExecutionException {
//
//        // 구글 사용자 정보 조회
//        GoogleUserInfo userInfo = getGoogleUserInfo(code);
//
//        // 회원 처리 및 로그인
//        return processOAuthLogin("google", userInfo.id(), userInfo.name(), userInfo.email(), session);
//    }
//
//    /*
//     * ========================================================================
//     * 네이버 로그인 처리
//     * ========================================================================
//     */
//
//    @GetMapping("/members/naver/authurl")
//    @ResponseBody
//    public String getNaverAuthUrl() {
//        return naverOAuthService.getAuthorizationUrl();
//    }
//
//    @GetMapping("/members/callback/sns/naver")
//    public String naverCallback(@RequestParam("code") String code, String state, HttpSession session)
//            throws ExecutionException, InterruptedException, IOException {
//
//        // 네이버 사용자 정보 조회
//        NaverUserInfo userInfo = getNaverUserInfo(code);
//
//        // 회원 처리 및 로그인
//        return processOAuthLogin("naver", userInfo.id(), userInfo.name(), userInfo.email(), session);
//    }
//
//    /**
//     * OAuth 로그인 공통 처리 로직
//     */
//    private String processOAuthLogin(String provider, String userId, String name, String email, HttpSession session) {
//        // 기존 회원 조회 또는 신규 회원 생성
//        Member member = memberRepository.findByLoginId(userId)
//                .orElseGet(() -> createNewMember(provider, userId, name, email));
//
//        // 세션에 사용자 정보 저장
//        session.setAttribute("user", member);
//
//        log.info("{} 로그인 성공: {} ({})", provider, member.getName(), member.getLoginId());
//
//        return "redirect:/";
//    }
//
//    /**
//     * 신규 회원 생성
//     */
//    private Member createNewMember(String provider, String userId, String name, String email) {
//        SnsProvider snsProvider = snsProviderService.findBySnsProviderName(provider);
//
//        Member newMember = Member.createMember(userId, name, email, "");
//        memberService.join(newMember);
//
//        log.info("신규 {} 회원 가입: {} - {}", provider, name, userId);
//
//        return newMember;
//    }
//
//    /**
//     * 구글 사용자 정보 조회
//     */
//    private GoogleUserInfo getGoogleUserInfo(String code)
//            throws InterruptedException, IOException, ExecutionException {
//
//        OAuth2AccessToken accessToken = googleOAuthService.getAccessToken(code);
//
//        OAuthRequest request = new OAuthRequest(Verb.GET, "https://www.googleapis.com/oauth2/v2/userinfo");
//        googleOAuthService.signRequest(accessToken, request);
//        Response response = googleOAuthService.execute(request);
//
//        JsonObject json = JsonParser.parseString(response.getBody()).getAsJsonObject();
//
//        return new GoogleUserInfo(
//                json.get("id").getAsString(),
//                json.get("name").getAsString(),
//                json.get("email").getAsString()
//        );
//    }
//
//    /**
//     * 네이버 사용자 정보 조회
//     */
//    private NaverUserInfo getNaverUserInfo(String code)
//            throws ExecutionException, InterruptedException, IOException {
//
//        OAuth2AccessToken accessToken = naverOAuthService.getAccessToken(code);
//
//        OAuthRequest request = new OAuthRequest(Verb.GET, "https://openapi.naver.com/v1/nid/me");
//        naverOAuthService.signRequest(accessToken, request);
//        Response response = naverOAuthService.execute(request);
//
//        JsonObject responseJson = JsonParser.parseString(response.getBody()).getAsJsonObject();
//        JsonObject userJson = responseJson.getAsJsonObject("response");
//
//        return new NaverUserInfo(
//                userJson.get("id").getAsString(),
//                userJson.get("name").getAsString(),
//                userJson.get("email").getAsString()
//        );
//    }
//
//    /*
//     * ========================================================================
//     * 사용자 정보를 담는 Record 클래스들
//     * ========================================================================
//     */
//
//    /**
//     * 구글 사용자 정보
//     */
//    private record GoogleUserInfo(String id, String name, String email) {}
//
//    /**
//     * 네이버 사용자 정보
//     */
//    private record NaverUserInfo(String id, String name, String email) {}
}
