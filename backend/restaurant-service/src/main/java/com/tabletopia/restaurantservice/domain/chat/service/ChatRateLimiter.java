package com.tabletopia.restaurantservice.domain.chat.service;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatRateLimiter {

  private final Map<String, Integer> usageMap = new ConcurrentHashMap<>();
  private static final int MAX_REQUESTS_PER_DAY = 5;

  public boolean canUse(String userEmail) {
    return usageMap.getOrDefault(userEmail, 0) < MAX_REQUESTS_PER_DAY;
  }

  public void incrementUsage(String userEmail) {
    usageMap.merge(userEmail, 1, Integer::sum);
  }

  public void resetDaily() {
    usageMap.clear();
  }
}
