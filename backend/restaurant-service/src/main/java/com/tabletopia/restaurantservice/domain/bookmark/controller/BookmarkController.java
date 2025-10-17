package com.tabletopia.restaurantservice.domain.bookmark.controller;

import com.tabletopia.restaurantservice.domain.bookmark.dto.BookmarkResponse;
import com.tabletopia.restaurantservice.domain.bookmark.service.BookmarkService;
import com.tabletopia.restaurantservice.dto.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 북마크 컨트롤러
 * @author 김지민
 * @since 2025-10-16
 */
@Slf4j
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

  private final BookmarkService bookmarkService;

  /**
   * 사용자별 북마크 목록 조회
   *
   * @param userId 사용자 ID
   * @return 북마크 목록 조회
   */
  @GetMapping("/users/{userId}")
  public ResponseEntity<ApiResponse<Page<BookmarkResponse>>> getUserBookmarks(@PathVariable Long userId,
   @RequestParam(defaultValue = "0") int page,
   @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<BookmarkResponse> bookmarkList=bookmarkService.getUserBookmarks(userId,pageable);

    return ResponseEntity.ok(
        ApiResponse.success("북마크 내역 조회 성공", bookmarkList)
    );
  }
}
