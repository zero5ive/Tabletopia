package com.tabletopia.restaurantservice.domain.waiting.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import com.tabletopia.restaurantservice.domain.waiting.repository.WaitingRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 웨이팅 서비스
 *
 * @author 성유진
 * @since 2025-09-26
 */

@Service
@RequiredArgsConstructor
public class WaitingServiceImpl implements WaitingService{

  private final WaitingRepository waitingRepository;
  private final ModelMapper modelMapper;
  private final RestaurantRepository restaurantRepository;

  // 웨이팅 오픈 상태를 메모리에 저장
  private boolean waitingOpen = false;

  /**
   * 웨이팅 등록
   */
  @Transactional
  public Waiting registerWaiting(Long restaurantId, Long userId, Integer peopleCount) {

    // 1. Restaurant 엔티티 조회
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException(
            "식당을 찾을 수 없습니다. ID: " + restaurantId));

    // 2. 다음 웨이팅 번호 계산
    Integer maxWaitingNumber = waitingRepository
        .findMaxWaitingNumberByRestaurantIdToday(restaurantId);
    int nextWaitingNumber = (maxWaitingNumber != null) ? maxWaitingNumber + 1 : 1;

    // 3. Waiting 엔티티 생성
    Waiting waiting = new Waiting(
        restaurant,
        userId,
        peopleCount,
        restaurant.getName()  // 스냅샷
    );

    // 4. 웨이팅 번호 할당
    waiting.assignWaitingNumber(nextWaitingNumber);

    // 5. 저장 및 반환
    return waitingRepository.save(waiting);
  }

  @Override
  public boolean isWaitingOpen(Long restaurantId) {

    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));
    return restaurant.getIsWaitingOpen();
  }

  @Transactional
  @Override
  public void openWaiting(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));

    restaurant.openWaiting();
    restaurantRepository.save(restaurant);
  }

  @Transactional
  @Override
  public void closeWaiting(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));

    restaurant.closeWaiting();
    restaurantRepository.save(restaurant);
  }


  @Override
  public Page<WaitingResponse> getWaitingList(Long restaurantId, WaitingState status,  Pageable pageable) {

    // 오늘 0시 계산
    LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();

    Page<Waiting> waitingPage = waitingRepository.findByRestaurantIdAndWaitingStateAndCreatedAtAfter(
        restaurantId, status, todayStart, pageable);
    // Entity를 DTO로 변환
    return waitingPage.map(waiting -> modelMapper.map(waiting, WaitingResponse.class));
  }

  @Override
  public Integer getMaxWaitingNumber(Long restaurantId) {
    // 오늘 날짜 기준으로 최대 웨이팅 번호 조회
    return waitingRepository.findMaxWaitingNumberByRestaurantIdToday(restaurantId);

  }

  @Override
  public void cancelWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(()-> new RuntimeException("웨이팅을 찾을 수 없습니다."));

    waiting.assignWaitingState(WaitingState.CANCELLED);
    waitingRepository.save(waiting);
  }

  @Override
  public Waiting callWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(()-> new RuntimeException("웨이팅을 찾을 수 없습니다."));

    waiting.assignWaitingState(WaitingState.CALLED);
    waiting.setCalledAt(LocalDateTime.now());  // 호출 시간 설정

    return waitingRepository.save(waiting);

  }

  @Override
  public Waiting seatedWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(()-> new RuntimeException("웨이팅을 찾을 수 없습니다."));

    waiting.assignWaitingState(WaitingState.SEATED);

    return waitingRepository.save(waiting);
  }

  @Override
  public Integer getTeamsAheadCount(Long restaurantId, Integer myWaitingNumber) {
    Integer count = waitingRepository.countTeamsAhead(restaurantId, myWaitingNumber);
    return count != null ? count : 0;
  }

  @Override
  public Page<WaitingResponse> getUserWaitingList(Long userId, Pageable pageable) {
    Page<Waiting> waitingPage = waitingRepository.findByUserId(userId, pageable);

    // Entity를 DTO로 변환하고 대기중인 경우 앞 대기팀 수 계산
    return waitingPage.map(waiting -> {
      WaitingResponse response = modelMapper.map(waiting, WaitingResponse.class);

      // WAITING 상태이고 오늘 날짜인 경우에만 앞 대기팀 수 계산
      LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay(); //오늘 0시
      if (waiting.getWaitingState() == WaitingState.WAITING && waiting.getCreatedAt().isAfter(todayStart)) {
            Integer teamsAhead = getTeamsAheadCount(waiting.getRestaurant().getId(), waiting.getWaitingNumber());
            response.setTeamsAhead(teamsAhead);
      }

      return response;
    });
  }
}
