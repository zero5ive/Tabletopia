package com.tabletopia.restaurantservice.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.assertj.core.api.Assertions.assertThat;

import com.tabletopia.restaurantservice.domain.reservation.exception.ReservationNotFoundException;
import com.tabletopia.restaurantservice.domain.reservation.repository.ReservationRepository;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.reservation.service.TableSelectionService;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.service.RestaurantOpeningHourService;
import com.tabletopia.restaurantservice.domain.restaurantTable.service.RestaurantTableService;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * ReservationService 단위 테스트 클래스
 * 비즈니스 로직의 동작 검증
 *
 * @author 김예진
 * @since 2025-12-09
 */
@ExtendWith(MockitoExtension.class) // JUnit5 + Mockito 통합 설정
class ReservationServiceTest {

  @InjectMocks // Mock 객체를 주입받을 대상에 사용. 주입받을 필드에 Mock 객체가 자동으로 주입된다.
  ReservationService reservationService;

  @Mock // Mock 객체 생성. 의존성 주입 대상은 가짜 객체 Mock 으로 격리
  ReservationRepository reservationRepository;
  @Mock
  RestaurantTableService restaurantTableService;
  @Mock
  TableSelectionService tableSelectionService;
  @Mock
  UserService userService;
  @Mock
  RestaurantOpeningHourService openingHourService;
  @Mock
  SimpMessagingTemplate messagingTemplate;

  // ---------------------------------------------------------------------- //
  /**
   * 예약 데이터가 없는 경우
   * @author 김예진
   * @since 2025-12-09
   */
  @Test
  @DisplayName("예약을 찾을 수 없다면, ReservationNotFoundException 발생시킨다.")
  void cancelReservationByUser_NotFound(){
    // given
    BDDMockito.given(reservationRepository.findById(anyLong())).willReturn(Optional.empty());
    // given(...) : Mockito에게 괄호 안의 호출이 들어왔을 때
    // willReturn() : 해당 메서드 호출 시 반환할 값을 괄호 안으로 정의
    // 현재 의미
    // 테스트 코드 내부에서 reservationRepository의 findById() 메서드가 어떤 Long ID로 호출되더라도,
    // 실제 DB에 접근하지 말고, 즉시 데이터가 없다는 결과(Optional.empty())를 반환

    // when
    // exception을 검사하고 싶다면 assertThrows를 사용
    ReservationNotFoundException reservationNotFoundException = assertThrows(ReservationNotFoundException.class,
        () -> reservationService.cancelReservationByUser(999L, 1L));
    // assertThrows() : 코드 블럭을 실행했을 때, 터지길 기대하는 예외가 터져야 함
    //                  만약 예상대로 예외가 터질 경우, JUnit은 그 터진 예외 객체를 반환
    // 현재 의미
    // 만약 999번 예약 취소 로직을 실행했을 때 (when),
    // 예상대로 ReservationNotFoundException이 발생한다면 (then의 일부),
    // 그 발생한 예외 객체를 reservationNotFoundException 변수에 저장

    // then
    assertThat(reservationNotFoundException.getMessage()).isEqualTo("해당 예약이 존재하지 않습니다.");
    // assertThat(): AssertJ 검증 시작. 괄호 안의 값 검증
    // 현재 의미
    // 앞에서 발생시켜 잡은 ReservationNotFoundException 객체의 메시지 내용이
    // '해당 예약이 존재하지 않습니다.'와 정확히 일치해야 테스트 성공
  }

}
