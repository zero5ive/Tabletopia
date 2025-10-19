package com.tabletopia.restaurantservice.domain.waiting.service;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.user.dto.UserDTO;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.repository.JpaUserRepository;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import com.tabletopia.restaurantservice.domain.waiting.exception.WaitingRegistException;
import com.tabletopia.restaurantservice.domain.waiting.repository.WaitingRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class WaitingServiceImpl implements WaitingService{

  private final WaitingRepository waitingRepository;
  private final ModelMapper modelMapper;
  private final RestaurantRepository restaurantRepository;
  private final JpaUserRepository userRepository;

  // 웨이팅 오픈 상태를 메모리에 저장
  private boolean waitingOpen = false;

  /**
   * 웨이팅 등록
   */
  @Transactional
  public Waiting registerWaiting(Long restaurantId, Long userId, Integer peopleCount) throws WaitingRegistException{

    // 1. User 조회
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

    // 2. Restaurant 조회
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException(
            "식당을 찾을 수 없습니다. ID: " + restaurantId));

    List<WaitingState> activeStates = Arrays.asList(
        WaitingState.WAITING,
        WaitingState.CALLED
    );

    // 3. 중복 확인 (락 획득 전에 먼저 체크 - 성능 향상)
    if (waitingRepository.existsByRestaurantIdAndUserIdAndWaitingStateIn(
        restaurantId, userId, activeStates)) {
      throw new WaitingRegistException("이미 대기 중입니다.");
    }

    // 4. 다음 웨이팅 번호 계산 (락 사용 - 동시성 안전)
    Integer maxWaitingNumber = waitingRepository
        .findMaxWaitingNumberByRestaurantIdTodayWithLock(restaurantId);
    int nextWaitingNumber = (maxWaitingNumber != null) ? maxWaitingNumber + 1 : 1;

    // 5. Waiting 엔티티 생성
    Waiting waiting = new Waiting(
        restaurant,
        user,
        peopleCount,
        restaurant.getName()
    );

    // 6. 웨이팅 번호 할당
    waiting.assignWaitingNumber(nextWaitingNumber);

    // 7. 저장 및 반환
    return waitingRepository.save(waiting);
  }
  @Override

/**웨이팅 오픈상태 조회*/
  public boolean isWaitingOpen(Long restaurantId) {

    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));
    return restaurant.getIsWaitingOpen();
  }

  /**웨이팅 open*/
  @Transactional
  @Override
  public void openWaiting(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));

    restaurant.openWaiting();
    restaurantRepository.save(restaurant);
  }

  /**웨이팅 close*/
  @Transactional
  @Override
  public void closeWaiting(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("레스토랑을 찾을 수 없습니다."));

    restaurant.closeWaiting();
    restaurantRepository.save(restaurant);
  }


  /**웨이팅 리스트*/
  @Override
  public Page<WaitingResponse> getWaitingList(Long restaurantId, WaitingState status,  Pageable pageable) {

    // 오늘 0시 계산
    LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();

    Page<Waiting> waitingPage = waitingRepository.findByRestaurantIdAndWaitingStateAndCreatedAtAfter(
        restaurantId, status, todayStart, pageable);
    // Entity를 DTO로 변환
    return waitingPage.map(waiting -> modelMapper.map(waiting, WaitingResponse.class));
  }

  /**웨이팅 최대번호 계산 메서드*/
  @Override
  public Integer getMaxWaitingNumber(Long restaurantId) {
    // 오늘 날짜 기준으로 최대 웨이팅 번호 조회
    return waitingRepository.findMaxWaitingNumberByRestaurantIdToday(restaurantId);

  }

  /**관리자 웨이팅 취소*/
  public Waiting cancelAdminWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("웨이팅을 찾을 수 없습니다."));

    if(!waiting.getRestaurant().getId().equals(restaurantId)) {
      throw new IllegalArgumentException("해당 식당의 웨이팅이 아닙니다.");
    }

    waiting.assignWaitingState(WaitingState.CANCELLED);

    return waitingRepository.save(waiting);
  }

  /**웨이팅 미루기 등록*/
  @Override
  @Transactional
  public Waiting delayWaiting(Long waitingId, Integer targetNumber, Long restaurantId) {

    //미루려는 웨이팅 조회
    Waiting myWaiting = waitingRepository.findByIdAndRestaurantId(waitingId, restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("웨이팅을 찾을 수 없습니다."));

    //대기 상태 확인
    if(myWaiting.getWaitingState() != WaitingState.WAITING) {
      throw new IllegalStateException("대기 중인 웨이팅만 미루기가 가능합니다.");
    }

    //미루기 횟수 확인
    if(!myWaiting.canDelay()){
      throw new IllegalStateException("최대 미루기 횟수(3회)를 초과했습니다.");
    }

    //현재 웨이팅 번호와 목표 번호 확인
    Integer currentNumber = myWaiting.getWaitingNumber();

    if (targetNumber <= currentNumber) {
      throw new IllegalArgumentException("현재 순서보다 뒤로만 미룰 수 있습니다.");
    }

    //목표 순서가 유효한지 확인(오늘 최대 웨이팅 번호여야 함)
    Integer maxNumber = waitingRepository.findMaxWaitingNumberByRestaurantIdTodayWithLock(restaurantId);
    if (maxNumber == null || targetNumber > maxNumber) {
      throw new IllegalArgumentException("유효하지 않은 목표 순서입니다.");
    }

      //영향 받은 웨이팅 조회
      LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();

      List<Waiting> affectedWaitings = waitingRepository.findWaitingsBetweenNumbers(
          restaurantId,
          WaitingState.WAITING,
          currentNumber,
          targetNumber,
          todayStart
      );

      for(Waiting waiting : affectedWaitings) {
        waiting.updateWaitingNumber(waiting.getWaitingNumber() -1);
        waitingRepository.save(waiting);
      }

      // 8 내 웨이팅을 목표 번호로 변경하고 미루기 횟수 증가
      myWaiting.updateWaitingNumber(targetNumber);
      myWaiting.increaseDelayCount();

      return waitingRepository.save(myWaiting);
    }

    /**웨이팅 미루기 조회*/
  @Override
  @Transactional(readOnly = true)
  public List<WaitingResponse> getDelayOptions(Long waitingId, Long restaurantId) {

    Waiting myWaiting = waitingRepository.findByIdAndRestaurantId(waitingId, restaurantId)
        .orElseThrow(() -> new EntityNotFoundException("웨이팅을 찾을 수 없습니다."));

    //대기 상태 확인
    if(myWaiting.getWaitingState() != WaitingState.WAITING) {
      throw new IllegalStateException("대기 중인 웨이팅만 조회 가능합니다.");
    }

    Integer currentNumber = myWaiting.getWaitingNumber();

    //오늘의 최대 웨이팅 번호 조회 - Lock 대신 일반 조회 사용
    Integer maxNumber = waitingRepository.findMaxWaitingNumberByRestaurantIdToday(restaurantId);

    if (maxNumber == null || maxNumber <= currentNumber) {
      // 내 뒤에 아무도 없음
      return Collections.emptyList();
    }

    LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();

    //내 다음 순서부터 조회
    List<Waiting> waitingList = waitingRepository.findWaitingsBetweenNumbers(
        restaurantId,
        WaitingState.WAITING,
        currentNumber,      // startNumber: 내 번호
        maxNumber,          // endNumber: 오늘 최대 번호
        todayStart
    );

    // Entity를 DTO로 변환
    return waitingList.stream()
        .map(waiting -> WaitingResponse.from(waiting, restaurantId))
        .collect(Collectors.toList());

  }


  @Override
  public Waiting cancelWaiting(Long id, Long restaurantId) {
    Waiting waiting = waitingRepository.findByIdAndRestaurantId(id, restaurantId)
        .orElseThrow(()-> new RuntimeException("웨이팅을 찾을 수 없습니다."));

    waiting.assignWaitingState(WaitingState.CANCELLED);
    return waitingRepository.save(waiting);
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
      WaitingResponse response = WaitingResponse.from(waiting, waiting.getRestaurant().getId());

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
