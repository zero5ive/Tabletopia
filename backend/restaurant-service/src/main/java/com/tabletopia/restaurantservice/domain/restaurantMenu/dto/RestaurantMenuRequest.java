package com.tabletopia.restaurantservice.domain.restaurantMenu.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 메뉴 등록 및 수정 요청 DTO
 * 클라이언트에서 FormData로 전송되는 데이터를 수신한다.
 * @author 김지민
 * @since 2025-10-10
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantMenuRequest {

  /** 메뉴 이름 */
  private String name;

  /** 메뉴 가격 */
  private int price;

  /** 메뉴 설명 */
  private String description;

  /** 메뉴 카테고리 (메인, 사이드 등) */
  private String category;

  /** 품절 여부 */
  private boolean isSoldout;

  /** 업로드 이미지 (FormData 전송용) */
  private MultipartFile image;

  public void setIsSoldout(Object value) {
    if (value instanceof Boolean) {
      this.isSoldout = (Boolean) value;
    } else if (value instanceof String) {
      this.isSoldout = Boolean.parseBoolean((String) value);
    }
  }
}
