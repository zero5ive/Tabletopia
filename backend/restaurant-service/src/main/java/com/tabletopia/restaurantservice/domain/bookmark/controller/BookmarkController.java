package com.tabletopia.restaurantservice.domain.bookmark.controller;

import com.tabletopia.restaurantservice.domain.bookmark.dto.BookmarkRequest;
import com.tabletopia.restaurantservice.domain.bookmark.dto.BookmarkResponse;
import com.tabletopia.restaurantservice.domain.bookmark.service.BookmarkService;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import com.tabletopia.restaurantservice.dto.ApiResponse;
import com.tabletopia.restaurantservice.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 북마크 컨트롤러
 * @author 서예닮
 * @since 2025-10-16
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class BookmarkController {

  private final BookmarkService bookmarkService;
  private final UserService userService;

  /**
   * 사용자별 북마크 목록 조회
   *
   * @param userId 사용자 ID
   * @return 북마크 목록 조회
   */
  @GetMapping("/bookmarks")
  public ResponseEntity<ApiResponse<Page<BookmarkResponse>>> getUserBookmarks(
   @RequestParam(defaultValue = "0") int page,
   @RequestParam(defaultValue = "10") int size) {

    String currentUserEmail = SecurityUtil.getCurrentUserEmail();
    User user = userService.findByEmail(currentUserEmail);

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<BookmarkResponse> bookmarkList=bookmarkService.getUserBookmarks(user.getId(),pageable);

    return ResponseEntity.ok(
        ApiResponse.success("북마크 내역 조회 성공", bookmarkList)
    );
  }


  /**
   * 사용자, 레스토랑 별 북마크 등록
   */
  @PostMapping("/bookmarks")
    public ResponseEntity<BookmarkResponse> saveBookmark(@RequestBody BookmarkRequest request) {

    BookmarkResponse response = bookmarkService.saveBookmark(
        request.getUserId(),
        request.getRestaurantId()
    );
    return ResponseEntity.ok(response);
  }


  /**
   *
   * 사용자 북마크 취소
   *
   * @param bookmarkId 북마크 ID
   * @return 북마크 목록 조회
   */
  @DeleteMapping("/bookmarks/{bookmarkId}")
  public ResponseEntity<Void> deleteBookmark(@PathVariable Long bookmarkId) {
    bookmarkService.deleteBookmark(bookmarkId);
    return ResponseEntity.noContent().build();
  }

}
