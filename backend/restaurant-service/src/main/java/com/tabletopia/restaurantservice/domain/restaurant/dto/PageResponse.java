package com.tabletopia.restaurantservice.domain.restaurant.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 페이징 응답 DTO
 *
 * @author Claude
 * @since 2025-10-20
 */
@Getter
@Builder
public class PageResponse<T> {
    private List<T> content;           // 현재 페이지 데이터
    private int number;                // 현재 페이지 번호 (0부터 시작)
    private int size;                  // 페이지 크기
    private int totalPages;            // 전체 페이지 수
    private long totalElements;        // 전체 요소 수
    private boolean first;             // 첫 페이지 여부
    private boolean last;              // 마지막 페이지 여부
    private boolean empty;             // 비어있는지 여부

    /**
     * Spring Data의 Page 객체를 PageResponse로 변환
     */
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .number(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .first(page.isFirst())
                .last(page.isLast())
                .empty(page.isEmpty())
                .build();
    }
}
