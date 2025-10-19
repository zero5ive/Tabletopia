package com.tabletopia.restaurantservice.domain.chat.client;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.*;

/**
 * 레스토랑 데이터 직접 조회용 클라이언트
 *
 * 사용자 입력 메시지를 분석하여 지역(region)과 카테고리(category)를 추출하고,
 * 조건에 맞는 맛집을 DB에서 조회해 추천 목록을 반환한다.
 *
 * ChatService 또는 OpenAiService가 AI 응답 대신
 * 직접 DB 기반 추천을 수행할 때 사용된다.
 *
 * @author 김지민
 * @since 2025-10-19
 */
@Component
@RequiredArgsConstructor
public class RestaurantClient {

  private final JdbcTemplate jdbcTemplate;

  /**
   * 사용자의 메시지를 기반으로 맛집을 추천한다.
   *
   * 1. 메시지에서 지역명과 음식 카테고리를 추출한다.
   * 2. 조건(region, category)에 맞는 식당을 DB에서 조회한다.
   * 3. 결과를 문자열로 포맷팅하여 반환한다.
   *
   * @param message 사용자 입력 메시지 (예: "강남 스시 맛집 추천해줘")
   * @return 추천 결과 문자열 (맛집 리스트 또는 오류 메시지)
   */
  public String getRecommendation(String message) {
    try {
      // 입력 메시지 분석 (지역/카테고리 추출)
      Map<String, String> cond = parseInput(message);

      // 기본 SQL 쿼리 생성
      StringBuilder sql = new StringBuilder(
          "SELECT name, address, restaurant_category_id FROM restaurant WHERE 1=1"
      );
      List<Object> params = new ArrayList<>();

      // 지역 조건 추가
      if (cond.containsKey("region")) {
        sql.append(" AND address LIKE ?");
        params.add("%" + cond.get("region") + "%");
      }

      // 카테고리 조건 추가 (name, description 검색)
      if (cond.containsKey("category")) {
        sql.append(" AND (name LIKE ? OR description LIKE ?)");
        params.add("%" + cond.get("category") + "%");
        params.add("%" + cond.get("category") + "%");
      }

      // DB 조회 실행
      List<Map<String, Object>> list =
          jdbcTemplate.queryForList(sql.toString(), params.toArray());

      // 결과 없을 때 처리
      if (list.isEmpty()) {
        if (cond.containsKey("region"))
          return cond.get("region") + " 지역의 맛집 정보를 찾지 못했습니다 😢";
        return "등록된 맛집 정보가 없습니다 😢";
      }

      // 결과 포맷팅
      String region = cond.getOrDefault("region", "추천");
      StringBuilder sb = new StringBuilder(region + " 인기 맛집이에요 🍽️\n\n");

      for (Map<String, Object> r : list) {
        sb.append("✅ ").append(r.get("name"))
            .append(" - ").append(r.get("address"))
            .append("\n");
      }

      return sb.toString();

    } catch (Exception e) {
      return "맛집 정보를 불러오지 못했습니다 😢";
    }
  }

  /**
   * 메시지에서 지역명과 카테고리를 단순 추출한다.
   *
   * 기본적으로 문자열 포함 여부로 판별하며,
   * 고정된 지역/카테고리 리스트를 기준으로 매칭한다.
   *
   * @param msg 사용자 입력 메시지
   * @return 추출된 조건 맵 (region, category)
   */
  private Map<String, String> parseInput(String msg) {
    Map<String, String> cond = new HashMap<>();

    String[] regions = {"강남", "홍대", "명동", "서초", "마포"};
    String[] categories = {"한식", "중식", "일식", "스시", "파스타", "카페"};

    for (String region : regions)
      if (msg.contains(region)) cond.put("region", region);

    for (String category : categories)
      if (msg.contains(category)) cond.put("category", category);

    return cond;
  }
}
