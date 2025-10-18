package com.tabletopia.restaurantservice.domain.chat.service;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Slf4j
@Service
public class OpenAiService {

  @Value("${openai.api.key}")
  private String apiKey;

  public String askGpt(String prompt) {
    int retryCount = 0;
    int maxRetries = 3;
    int delaySeconds = 20;

    while (retryCount < maxRetries) {
      try {
        // prompt를 JSON 형식으로 안전하게 변환
        String safePrompt = JSONObject.quote(prompt);

        String body = """
          {
            "model": "gpt-4o-mini",
            "messages": [
              {"role": "user", "content": %s}
            ],
            "temperature": 0.7
          }
        """.formatted(safePrompt);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.openai.com/v1/chat/completions"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
            .send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject json = new JSONObject(response.body());

        if (json.has("error")) {
          String msg = json.getJSONObject("error").optString("message");
          log.error("OpenAI 응답 오류: {}", msg);

          // Rate limit 에러 발생 시 일정 시간 대기 후 재시도
          if (msg.contains("Rate limit")) {
            retryCount++;
            log.warn("요청 제한으로 {}초 대기 후 재시도 ({}/{})", delaySeconds, retryCount, maxRetries);
            Thread.sleep(delaySeconds * 1000L);
            continue;
          }

          return "AI 응답을 가져오지 못했습니다 (서버 로그 참조)";
        }

        // 정상 응답 처리
        return json.getJSONArray("choices")
            .getJSONObject(0)
            .getJSONObject("message")
            .getString("content")
            .trim();

      } catch (Exception e) {
        log.error("OpenAI 호출 중 예외 발생", e);
        return "AI 호출 중 오류가 발생했습니다";
      }
    }

    // 재시도 횟수 초과 시
    return "요청 한도를 초과했습니다 잠시 후 다시 시도해주세요";
  }
}
