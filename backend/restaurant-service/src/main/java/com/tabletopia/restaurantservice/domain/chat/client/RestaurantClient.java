package com.tabletopia.restaurantservice.domain.chat.client;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class RestaurantClient {

  private final JdbcTemplate jdbcTemplate;

  public String getRecommendation(String message) {
    try {
      Map<String, String> cond = parseInput(message);

      StringBuilder sql = new StringBuilder(
          "SELECT name, address, restaurant_category_id FROM restaurant WHERE 1=1"
      );
      List<Object> params = new ArrayList<>();

      if (cond.containsKey("region")) {
        sql.append(" AND address LIKE ?");
        params.add("%" + cond.get("region") + "%");
      }
      if (cond.containsKey("category")) {
        sql.append(" AND (name LIKE ? OR description LIKE ?)");
        params.add("%" + cond.get("category") + "%");
        params.add("%" + cond.get("category") + "%");
      }

      List<Map<String, Object>> list =
          jdbcTemplate.queryForList(sql.toString(), params.toArray());

      if (list.isEmpty()) {
        if (cond.containsKey("region"))
          return cond.get("region") + " 지역의 맛집 정보를 찾지 못했습니다 😢";
        return "등록된 맛집 정보가 없습니다 😢";
      }

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
