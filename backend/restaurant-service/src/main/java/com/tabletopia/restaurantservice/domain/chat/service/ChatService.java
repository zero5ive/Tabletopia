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

@Service
@RequiredArgsConstructor
public class ChatService {

  private final RestaurantRepository restaurantRepository;
  private final OpenAiService openAiService;
  private final ChatRateLimiter chatRateLimiter;

  private Set<String> regionTokens = new HashSet<>();
  private final Map<Long, String> aiSummaryCache = new ConcurrentHashMap<>();

  @EventListener(ApplicationReadyEvent.class)
  public void initRegionTokens() {
    regionTokens = restaurantRepository.findAll().stream()
        .flatMap(r -> Arrays.stream(r.getAddress().split(" ")))
        .flatMap(this::expandTokens)
        .map(s -> s.replaceAll("[^가-힣]", ""))
        .filter(s -> s.length() >= 2)
        .collect(Collectors.toSet());
  }

  private Stream<String> expandTokens(String word) {
    List<String> tokens = new ArrayList<>();
    for (int i = 1; i <= word.length(); i++) tokens.add(word.substring(0, i));
    return tokens.stream();
  }

  public String getReply(String message, String userEmail, boolean isAdmin) {
    message = message.trim();

    try {
      if (!isAdmin && !chatRateLimiter.canUse(userEmail)) {
        return "오늘은 이미 최대 요청 횟수를 초과했습니다. (일 5회 제한)";
      }

      if (message.contains("맛집") || message.contains("추천")) {
        String region = detectRegionFromMessage(message);

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

        String generalPrompt =
            "사용자가 '" + message + "' 라고 물었습니다. "
                + "지역 정보가 없으므로 전국적으로 인기 있는 음식 종류나 맛집 스타일을 "
                + "따뜻한 말투와 이모지를 섞어 5가지 정도 예쁘게 추천해주세요.";

        String aiReply = openAiService.askGpt(generalPrompt);
        if (!isAdmin) chatRateLimiter.incrementUsage(userEmail);

        return "입력하신 지역을 찾을 수 없습니다. 대신 전국 인기 맛집 스타일을 추천드릴게요! 🍱<br><br>"
            + formatAiTextToHtml(aiReply);
      }

      String aiReply = openAiService.askGpt(message);
      if (!isAdmin) chatRateLimiter.incrementUsage(userEmail);
      return formatAiTextToHtml(aiReply);

    } catch (Exception e) {
      e.printStackTrace();
      return "서버 처리 중 오류가 발생했습니다.";
    }
  }

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

      // 항상 이름은 위쪽에 bold 처리, 설명은 그 아래 줄
      String formatted = "🍽️ <b>" + r.getName() + "</b><br>" + formatAiTextToHtml(desc);
      aiSummaryCache.put(r.getId(), formatted);
      sb.append(formatted).append("<br><br>");
    }

    return sb.toString();
  }

  private String formatAiTextToHtml(String text) {
    if (text == null || text.isBlank()) return "";
    text = text.replace("\n", "<br>");
    text = text.replaceAll("(?m)^\\s*\\d+\\.\\s*", "• ");
    text = text.replaceAll("\\*\\*(.*?)\\*\\*", "<b>$1</b>");
    return text.trim();
  }

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
