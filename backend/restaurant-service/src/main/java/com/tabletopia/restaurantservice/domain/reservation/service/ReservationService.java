package com.tabletopia.restaurantservice.domain.reservation.service;

import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.dto.UnavailableTableResponse;
import com.tabletopia.restaurantservice.domain.reservation.entity.Reservation;
import com.tabletopia.restaurantservice.domain.reservation.repository.ReservationRepository;
import com.tabletopia.restaurantservice.dto.RestaurantSnapshot;
import com.tabletopia.restaurantservice.dto.RestaurantTableDto;
import com.tabletopia.restaurantservice.dto.TableSnapshot;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 예약 서비스
 *
 * @author 김예진
 * @since 2025-09-23
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

  private final ReservationRepository reservationRepository;
//  private final RestaurantServiceClient restaurantServiceClient;

  /**
   * 예약 등록
   *
   * @author 김예진
   * @since 2025-09-24
   */
  public Long createReservation(ReservationRequest request){
    log.debug("예약 생성 요청: {}", request);

    // 예약 관련 정보들 조회
    // TODO 레스토랑 정보 조회
    // TODO 레스토랑 테이블 정보 조회
    // TODO 예약 데이터 검증

    // TODO 검증된 데이터로 스냅샷 생성


    // TODO 예약 엔티티 생성
    RestaurantSnapshot restaurantSnapshot = new RestaurantSnapshot(1L, "레스토랑명", "주소", "전화번호");
    TableSnapshot tableSnapshot = new TableSnapshot("테이블명", 1);

    Reservation reservation = Reservation.createReservation(
        1L,
        request.getRestaurantId(),
        request.getRestaurantTableId(),
        request.getPeopleCount(),
        request.getReservationDateTime(),
        restaurantSnapshot,
        tableSnapshot
    );

    // 예약 저장
    Reservation saveReservation = reservationRepository.save(reservation);

    return saveReservation.getId();
  }


  /**
   * 테이블이 이미 예약되어있는지 조회
   */
  public boolean isTableReserved(Long restaurantId, Long restaurantTableId, String reservationAt) {
    return reservationRepository
        .findReservationByRestaurantIdAndRestaurantTableIdAndReservationAt(
            restaurantId, restaurantTableId, LocalDateTime.parse(reservationAt)
        ) != null;
  }





  /**
   * 예약 전체 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findAllReservations() {
    return reservationRepository.findAll();
  }

  /**
   * 특정 레스토랑의 예약 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> findReservationsByRestaurantId(Long restaurantId) {
    return reservationRepository.findReservationsByRestaurantId(restaurantId);
  }


  /**
   * 레스토랑의 시간대의 예약 목록 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<Reservation> getReservationsAt(Long restaurantId, LocalDateTime time) {
    return reservationRepository.findReservationsByRestaurantIdAndReservationAt(restaurantId, time);
  }

  /**
   * 특정 시간에 예약 불가능한 테이블 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<UnavailableTableResponse> getUnavailableTablesAt(Long restaurantId, LocalDateTime reservation_at) {
    // 해당 시간에 예약된 테이블들 조회
    List<Reservation> reservations = reservationRepository.findReservationsByRestaurantIdAndReservationAt(
        restaurantId, reservation_at);

    // DTO로 변환
    return reservations.stream()
        .map(UnavailableTableResponse::fromReservation)
        .collect(Collectors.toList());
  }

  /**
   * 레스토랑의 테이블 목록 조회
   *
   * @author 김예진
   * @since 2025-09-23
   */
  public List<RestaurantTableDto> getTablesAt(Long restaurantId) {
    try {
      // TODO 프로젝트에서 받아오게 수정
//      tables = restaurantServiceClient.getRestaurantTables(restaurantId);
//      return tables;
      return null;
    } catch (Exception e) {
      log.error("레스토랑 정보 조회 실패 - restaurantId: {}", restaurantId, e);
      return null;
    }
  }
}