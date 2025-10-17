package com.tabletopia.restaurantservice.domain.bookmark.service;

import com.tabletopia.restaurantservice.domain.bookmark.dto.BookmarkResponse;
import com.tabletopia.restaurantservice.domain.bookmark.entity.Bookmark;
import com.tabletopia.restaurantservice.domain.bookmark.repository.BookmarkRepository;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 북마크 서비스
 * @author 서예닮
 * @since 2025-10-16
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookmarkService {

  private final BookmarkRepository bookmarkRepository;
  private final ModelMapper modelMapper;

  /**
   * 사용자별 북마크 목록 조회
   *
   * @param userId 사용자 ID
   * @return 북마크 목록
   */
  public Page<BookmarkResponse> getUserBookmarks(Long userId, Pageable pageable) {
    Page<Bookmark> bookmarkPage = bookmarkRepository.findByUserIdWithRestaurant(userId, pageable);
    return bookmarkPage
        .map(bookmark -> modelMapper.map(bookmark, BookmarkResponse.class));
  }
}