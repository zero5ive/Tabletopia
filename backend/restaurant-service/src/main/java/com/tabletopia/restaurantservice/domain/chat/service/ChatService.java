package com.tabletopia.restaurantservice.domain.chat.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * AI 챗봇 서비스
 *
 * 사용자의 메시지를 분석해 지역 감지, 추천 로직, AI 응답 요청을 처리한다.
 *
 * 지역 이름 자동 인식, AI 요약 캐싱, 요청 제한 등
 * 챗봇 기능 전반을 통합 관리한다.
 *
 * @author 김지민
 * @since 2025-10-19
 */
@Service
@RequiredArgsConstructor
public class ChatService {

  private final RestaurantRepository restaurantRepository;
  private final OpenAiService openAiService;
  private final ChatRateLimiter chatRateLimiter;

  // 주소에서 추출된 지역 단어 토큰
  private Set<String> regionTokens = new HashSet<>();

  // AI 요약 결과 캐시 (매장별로 저장)
  private final Map<Long, String> aiSummaryCache = new ConcurrentHashMap<>();

  /**
   * 애플리케이션 시작 시 레스토랑 주소 정보를 기반으로 지역 토큰 초기화
   */
  @EventListener(ApplicationReadyEvent.class)
  public void initRegionTokens() {
    regionTokens = restaurantRepository.findAll().stream()
        .flatMap(r -> Arrays.stream(r.getAddress().split(" ")))
        .flatMap(this::expandTokens)
        .map(s -> s.replaceAll("[^가-힣]", ""))
        .filter(s -> s.length() >= 2)
        .collect(Collectors.toSet());
  }

  /**
   * 단어를 앞부분부터 누적 확장하여 여러 토큰으로 분리
   * 예: "강남구" → "강", "강남", "강남구"
   */
  private Stream<String> expandTokens(String word) {
    List<String> tokens = new ArrayList<>();
    for (int i = 1; i <= word.length(); i++) tokens.add(word.substring(0, i));
    return tokens.stream();
  }

  /**
   * 챗봇 응답 생성
   *
   * - 요청 제한 검사
   * - 지역 기반 맛집 추천
   * - 지역 감지 실패 시 전국 인기 추천
   * - 일반 질문은 OpenAI API로 전달
   *
   * @param message 사용자 메시지
   * @param userEmail 사용자 이메일
   * @param isAdmin 관리자 여부
   * @return 응답 메시지 (HTML 포맷 포함)
   */
  public String getReply(String message, String userEmail, boolean isAdmin) {
    message = message.trim();

    try {
      // 일반 사용자 요청 제한
      if (!isAdmin && !chatRateLimiter.canUse(userEmail)) {
        return "오늘은 이미 최대 요청 횟수를 초과했습니다. (일 5회 제한)";
      }

      // 맛집 추천 관련 메시지일 경우
      if (message.contains("맛집") || message.contains("추천")) {
        String region = detectRegionFromMessage(message);

        // 지역이 감지된 경우 DB에서 매장 검색
        if (region != null) {
          List<Restaurant> restaurants = restaurantRepository.findByAddressContaining(region)
              .stream()
              .filter(r -> r.getAddress() != null && r.getAddress().contains(region))
              .toList();

          if (restaurants.isEmpty()) {
            return "현재 " + region + " 지역의 등록된 맛집이 없습니다.";
          }

          return buildRestaurantSummaries(restaurants);
        }

        // 지역 감지 실패 시 전국 인기 음식 추천
        String generalPrompt =
            "사용자가 '" + message + "' 라고 물었습니다. "
                + "지역 정보가 없으므로 전국적으로 인기 있는 음식 종류나 맛집 스타일을 "
                + "따뜻한 말투와 이모지를 섞어 5가지 정도 예쁘게 추천해주세요.";

        String aiReply = openAiService.askGpt(generalPrompt);
        if (!isAdmin) chatRateLimiter.incrementUsage(userEmail);

        return "입력하신 지역을 찾을 수 없습니다. 대신 전국 인기 맛집 스타일을 추천드릴게요! 🍱<br><br>"
            + formatAiTextToHtml(aiReply);
      }

      // 일반 대화 처리
      String aiReply = openAiService.askGpt(message);
      if (!isAdmin) chatRateLimiter.incrementUsage(userEmail);
      return formatAiTextToHtml(aiReply);

    } catch (Exception e) {
      e.printStackTrace();
      return "서버 처리 중 오류가 발생했습니다.";
    }
  }

  /**
   * DB에 등록된 매장 목록을 기반으로 AI 요약 생성
   *
   * 캐시된 요약이 존재하면 재사용하고,
   * 없는 경우 GPT에게 요청하여 새로 생성한다.
   */
  private String buildRestaurantSummaries(List<Restaurant> restaurants) {
    restaurants = restaurants.stream()
        .collect(Collectors.collectingAndThen(
            Collectors.toMap(Restaurant::getId, r -> r, (a, b) -> a),
            m -> new ArrayList<>(m.values())
        ));

    boolean allCached = restaurants.stream().allMatch(r -> aiSummaryCache.containsKey(r.getId()));
    if (allCached) {
      return restaurants.stream()
          .map(r -> aiSummaryCache.get(r.getId()))
          .collect(Collectors.joining("<br><br>"));
    }

    StringBuilder prompt = new StringBuilder(
        "아래 매장들을 간단히 소개해줘.\n" +
            "각 매장은 2~3줄로, 따뜻한 말투와 이모지를 포함해.\n" +
            "첫 줄에는 이름을 굵게 강조하지 말고 자연스럽게 포함해도 되고, 설명은 다음 줄에 써줘.\n\n"
    );

    for (Restaurant r : restaurants) {
      prompt.append("- 이름: ").append(r.getName())
          .append(", 카테고리: ").append(r.getRestaurantCategory() != null ? r.getRestaurantCategory().getName() : "")
          .append(", 주소: ").append(r.getAddress())
          .append(", 설명: ").append(r.getDescription() != null ? r.getDescription() : "")
          .append("\n");
    }

    String aiResponse = openAiService.askGpt(prompt.toString());
    if (aiResponse == null || aiResponse.isBlank() || aiResponse.contains("AI 응답을 가져오지 못했습니다")) {
      return "AI 응답을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.";
    }

    String[] parts = aiResponse.split("\n\n");
    StringBuilder sb = new StringBuilder();

    for (int i = 0; i < restaurants.size(); i++) {
      Restaurant r = restaurants.get(i);
      String desc = (i < parts.length) ? parts[i] : "AI 요약을 불러오지 못했습니다";

      // 항상 이름은 bold 처리
      String formatted = "🍽️ <b>" + r.getName() + "</b><br>" + formatAiTextToHtml(desc);
      aiSummaryCache.put(r.getId(), formatted);
      sb.append(formatted).append("<br><br>");
    }

    return sb.toString();
  }

  /**
   * AI 응답 텍스트를 HTML로 변환
   *
   * 줄바꿈 → <br>
   * 숫자 목록 → 불릿 기호
   * **굵게** → <b>태그
   */
  private String formatAiTextToHtml(String text) {
    if (text == null || text.isBlank()) return "";
    text = text.replace("\n", "<br>");
    text = text.replaceAll("(?m)^\\s*\\d+\\.\\s*", "• ");
    text = text.replaceAll("\\*\\*(.*?)\\*\\*", "<b>$1</b>");
    return text.trim();
  }

  /**
   * 메시지 내에서 지역명 감지
   *
   * regionTokens에 등록된 지역 문자열을 기준으로
   * 가장 긴 일치 항목을 우선 반환한다.
   */
  private String detectRegionFromMessage(String message) {
    String cleanMessage = message.replaceAll("\\s+", "");
    if (regionTokens.isEmpty()) initRegionTokens();

    return regionTokens.stream()
        .filter(token -> !token.isBlank() && token.length() >= 2)
        .filter(token -> cleanMessage.contains(token))
        .sorted(Comparator.comparingInt(String::length).reversed())
        .findFirst()
        .orElse(null);
  }
}
