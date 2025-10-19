package com.tabletopia.restaurantservice.domain.restaurantreview.service;

import com.tabletopia.restaurantservice.domain.bookmark.entity.Bookmark;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurant.repository.RestaurantRepository;
import com.tabletopia.restaurantservice.domain.restaurantreview.dto.RestaurantReviewRequest;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.repository.RestaurantReviewRepository;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.repository.JpaUserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * 레스토랑 서비스
 *
 * @author 김예진
 * @since 2025-10-16
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantReviewService {

  private final RestaurantReviewRepository restaurantReviewRepository;
  private final RestaurantRepository restaurantRepository;
  private final JpaUserRepository userRepository;

  /**
   * 사용자의 리뷰 조회
   * @author 김예진
   * @since 2025-10-16
   * @param userId
   * @return
   */
  public List<RestaurantReview> getReviewsByUser(Long userId){
    log.info("사용자 리뷰 조회 - userId: {}", userId);
    return restaurantReviewRepository.findByUserId(userId);
  }

  /**
   * 레스토랑의 리뷰 조회 (전체)
   * @author 김예진
   * @since 2025-10-16
   */
  public List<RestaurantReview> getRestaurantReviews(Long restaurantId){
    return restaurantReviewRepository.getRestaurantReviewsByRestaurant_Id(restaurantId);
  }

  /**
   * 레스토랑의 리뷰 조회 (페이징)
   * @author 김예진
   * @since 2025-10-20
   * @param restaurantId
   * @param pageable
   * @return
   */
  public Page<RestaurantReview> getRestaurantReviews(Long restaurantId, Pageable pageable){
    log.info("레스토랑 리뷰 조회 (페이징) - restaurantId: {}, page: {}, size: {}",
        restaurantId, pageable.getPageNumber(), pageable.getPageSize());
    return restaurantReviewRepository.findByRestaurantIdAndIsDeletedFalse(restaurantId, pageable);
  }

  /**
   * 리뷰 작성
   *
   * @param userId 사용자 ID
   * @param request 리뷰 작성 요청
   * @author 서예닮
   * @since 2025-10-19
   * @return 생성된 리뷰
   */
  @Transactional
  public RestaurantReview createReview(Long userId, RestaurantReviewRequest request) {
    log.info("리뷰 작성 시작 - userId: {}, restaurantId: {}, rating: {}, sourceId: {}, sourceType: {}",
        userId, request.getRestaurantId(), request.getRating(), request.getSourceId(), request.getSourceType());

    try {
      // 중복 리뷰 체크
      log.info("중복 리뷰 체크 - userId: {}, sourceId: {}, sourceType: {}",
          userId, request.getSourceId(), request.getSourceType());
      boolean exists = restaurantReviewRepository.existsByUserIdAndSourceIdAndSourceTypeAndIsDeletedFalse(
          userId, request.getSourceId(), request.getSourceType());

      if (exists) {
        log.warn("이미 리뷰가 작성되었습니다 - userId: {}, sourceId: {}, sourceType: {}",
            userId, request.getSourceId(), request.getSourceType());
        throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 리뷰를 작성하셨습니다.");
      }

      // 사용자 조회
      log.info("사용자 조회 - userId: {}", userId);
      User user = userRepository.findById(userId)
          .orElseThrow(() -> {
            log.error("사용자를 찾을 수 없습니다 - userId: {}", userId);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
          });
      log.info("사용자 조회 성공 - userName: {}", user.getName());

      // 레스토랑 조회
      log.info("레스토랑 조회 - restaurantId: {}", request.getRestaurantId());
      Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
          .orElseThrow(() -> {
            log.error("레스토랑을 찾을 수 없습니다 - restaurantId: {}", request.getRestaurantId());
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "레스토랑을 찾을 수 없습니다.");
          });
      log.info("레스토랑 조회 성공 - restaurantName: {}", restaurant.getName());

      // 리뷰 생성
      log.info("리뷰 엔티티 생성 중...");
      RestaurantReview review = new RestaurantReview(
          user,
          restaurant,
          request.getRating(),
          request.getComment(),
          request.getSourceId(),
          request.getSourceType()
      );
      log.info("리뷰 엔티티 생성 완료");

      // 리뷰 저장
      log.info("리뷰 저장 중...");
      RestaurantReview savedReview = restaurantReviewRepository.save(review);
      log.info("리뷰 작성 완료 - reviewId: {}", savedReview.getId());

      return savedReview;
    } catch (Exception e) {
      log.error("리뷰 작성 중 에러 발생", e);
      throw e;
    }
  }

  /**
   * 리뷰 삭제 (soft delete)
   *
   * @param reviewId  ID
   * @author 서예닮
   * @since 2025-10-19
   */
  @Transactional
  public void deleteReview(Long reviewId) {
    RestaurantReview restaurantReview = restaurantReviewRepository.findById(reviewId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."));

    // soft delete: isDeleted를 true로 설정
    restaurantReview.setDeleted(true);
    restaurantReviewRepository.save(restaurantReview);

    log.info("리뷰 삭제 완료 - reviewId: {}", reviewId);
  }
}
