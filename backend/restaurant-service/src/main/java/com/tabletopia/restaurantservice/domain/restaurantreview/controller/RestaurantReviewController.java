package com.tabletopia.restaurantservice.domain.restaurantreview.controller;

import com.tabletopia.restaurantservice.domain.restaurant.dto.RestaurantSearchResponse;
import com.tabletopia.restaurantservice.domain.restaurantreview.dto.RestaurantReviewRequest;
import com.tabletopia.restaurantservice.domain.restaurantreview.dto.RestaurantReviewResponse;
import com.tabletopia.restaurantservice.domain.restaurantreview.dto.UserReviewResponse;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.service.RestaurantReviewService;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import com.tabletopia.restaurantservice.util.SecurityUtil;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 레스토랑 리뷰 컨트롤러
 *
 * @author 김예진
 * @since 2025-10-16
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class RestaurantReviewController {

  private final RestaurantReviewService restaurantReviewService;
  private final UserService userService;

  /**
   * 레스토랑의 리뷰 목록 조회 (페이징)
   * @author 김예진, Claude Code
   * @since 2025-10-16
   * @param restaurantId
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기 (기본 10)
   * @return
   */
  @GetMapping("/restaurants/{restaurantId}/reviews")
  public ResponseEntity<Page<RestaurantReviewResponse>> getRestaurantReviews(
      @PathVariable Long restaurantId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ){
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<RestaurantReview> reviews = restaurantReviewService.getRestaurantReviews(restaurantId, pageable);
    Page<RestaurantReviewResponse> response = reviews.map(RestaurantReviewResponse::from);

    return ResponseEntity.ok(response);
  }

  /**
   * 현재 로그인한 사용자의 리뷰 목록 조회 (레스토랑 정보 포함)
   * @author 서예닮
   * @since 2025-10-19
   * @param
   * @return
   */
  @GetMapping("/reviews/my")
  public ResponseEntity<List<UserReviewResponse>> getMyReviews(){
    String currentUserEmail = SecurityUtil.getCurrentUserEmail();
    User user = userService.findByEmail(currentUserEmail);

    List<RestaurantReview> reviews = restaurantReviewService.getReviewsByUser(user.getId());
    List<UserReviewResponse> response = reviews
        .stream()
        .map(UserReviewResponse::from)
        .toList();

    return ResponseEntity.ok(response);
  }

  /**
   * 리뷰 작성
   * @author 서예닮
   * @since 2025-10-19
   * @param request 리뷰 작성 요청
   * @return 생성된 리뷰 정보
   */
  @PostMapping("/reviews")
  public ResponseEntity<UserReviewResponse> createReview(@Valid @RequestBody RestaurantReviewRequest request){
    String currentUserEmail = SecurityUtil.getCurrentUserEmail();
    User user = userService.findByEmail(currentUserEmail);

    RestaurantReview review = restaurantReviewService.createReview(user.getId(), request);
    UserReviewResponse response = UserReviewResponse.from(review);

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   *
   * 사용자 리뷰 삭제
   *
   * @param reviewId  ID
   */
  @DeleteMapping("/reviews/{reviewId}")
  public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
    restaurantReviewService.deleteReview(reviewId);
    return ResponseEntity.noContent().build();
  }

}
