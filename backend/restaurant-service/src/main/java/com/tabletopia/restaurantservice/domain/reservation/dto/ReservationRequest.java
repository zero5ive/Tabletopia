package com.tabletopia.restaurantservice.domain.reservation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 프론트엔드에서 보내는 예약 등록 요청 dto
 *
 * @author 김예진
 * @since 2025-09-24
 */

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ReservationRequest {

  @NotNull(message = "레스토랑 ID는 필수입니다")
  private Long restaurantId;

  private String restaurantName;

  private String restaurantAddress;

  private String restaurantPhone;

  private String email; // 로그인한 사용자의 이메일

  @NotBlank(message = "예약 날짜는 필수입니다")
  private String date;

  @NotBlank(message = "예약 시간은 필수입니다")
  private String time;

  @Min(value = 1, message = "예약 인원은 1명 이상이어야 합니다")
  private int peopleCount;

  @NotNull(message = "테이블 ID는 필수입니다")
  private Long restaurantTableId;

  @NotBlank(message = "테이블명은 필수입니다")
  private String restaurantTableNameSnapshot;

  @Min(value = 0, message = "예약금은 0원 이상이어야 합니다")
  private int price;

  private CustomerInfo customerInfo;  // 고객 정보
  private Agreements agreements;      // 동의 정보

  @Data
  public static class CustomerInfo {
    private String name;
    private String phoneNumber;
    private String email; // 예약자로 입력한 이메일 (사용자 A가 사용자가 아닌 B의 예약을 대신해줄 경우 여기의 이메일은 B의 이메일이 올 수 있음)
  }

  @Data
  public static class Agreements {
    private boolean privacyAgreement;
    private boolean serviceAgreement;
  }

  /**
   * 예약 시간 문자열을 LocalDateTime으로 변환
   */
  public LocalDateTime getReservationDateTime(){
    return LocalDateTime.parse(date + "T" + time);
  }


}
