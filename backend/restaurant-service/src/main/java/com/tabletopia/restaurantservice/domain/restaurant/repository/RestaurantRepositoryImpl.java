package com.tabletopia.restaurantservice.domain.restaurant.repository;

import static com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant.restaurant;
import static com.tabletopia.restaurantservice.domain.restaurantCategory.entity.QRestaurantCategory.restaurantCategory;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tabletopia.restaurantservice.domain.restaurant.dto.SearchCondition;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

/**
 * 레스토랑 커스텀 리포지토리 구현체
 *
 * @author 김예진
 * @since 2025-10-15
 */
@Repository
@RequiredArgsConstructor
public class RestaurantRepositoryImpl implements RestaurantRepositoryCustom {

  private final JPAQueryFactory queryFactory;

  /**
   * 동적 조건으로 레스토랑 검색
   * null인 조건은 자동으로 무시
   *
   * @param condition 검색 조건 (이름, 지역코드, 카테고리)
   * @param pageable 페이징 정보
   * @return 페이징된 검색 결과
   * @author 김예진
   * @since 2025-10-15
   */
  @Override
  public Page<Restaurant> searchRestaurants(SearchCondition condition, Pageable pageable) {

    // 레스토랑 목록 데이터 조회용 쿼리
    List<Restaurant> content = queryFactory
        .selectFrom(restaurant) // SELECT * FROM RESTAURANT
        .leftJoin(restaurant.restaurantCategory, restaurantCategory).fetchJoin() // N+1 방지 fetchJoin
        .where(
            // 조건이 null이면 무시
            nameContains(condition.getName()), // 이름 LIKE 검색
            restaurantCategoryIdEq(condition.getCategoryId()), // 카테고리 정확히 일치
            regionCodeEq(condition.getRegionCode()), // 지역코드 정확히 일치
            isNotDeleted() // 삭제되지 않은 레스토랑만
        )
        // 페이징 조건
        .offset(pageable.getOffset()) // OFFSET
        .limit(pageable.getPageSize()) // LIMIT
        .fetch(); // 쿼리 실행

    // 전체 개수용 (페이징 최적화) 카운트 쿼리
    JPAQuery<Long> countQuery = queryFactory
        .select(restaurant.count()) // SELECT COUNT(*)
        .from(restaurant) // FROM restaurant
        .where(
            nameContains(condition.getName()),
            restaurantCategoryIdEq(condition.getCategoryId()),
            regionCodeEq(condition.getRegionCode()),
            isNotDeleted()
        );

    // 결과를 Page 객체로 묶어서 반환
    return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    // countQuery::fetchOne -> countQuery를 사용하여 total 개수 계산을 필요한 시점에만 실행하도록 미룸
    // PageableExecutionUtils: 최적화된 카운트 쿼리 실행 (마지막 페이지이거나 페이지 크기보다 작으면 카운트 쿼리를 생략)
  }

  //============ 동적 조건 생성 메서드 ============//

  /**
   * 레스토랑 이름 LIKE 검색 조건
   *
   * @param name 검색할 이름 (null이면 조건 무시)
   * @return BooleanExpression 또는
   * @author 김예진
   * @since 2025-10-15
   */
  private BooleanExpression nameContains(String name) {
    return StringUtils.hasText(name) ? restaurant.name.containsIgnoreCase(name) : null;
  }

  /**
   * 카테고리 ID 정확히 일치 조건
   *
   * @param categoryId 카테고리 ID (null이면 조건 무시)
   * @return BooleanExpression 또는
   * @author 김예진
   * @since 2025-10-15
   */
  private BooleanExpression restaurantCategoryIdEq(Long categoryId) {
    return categoryId != null ? restaurant.restaurantCategory.id.eq(categoryId) : null;
  }

  /**
   * 지역 코드 정확히 일치 조건
   *
   * @param regionCode 지역 코드 (null이면 조건 무시)
   * @return BooleanExpression 또는 null
   * @author 김예진
   * @since 2025-10-15
   */
  private BooleanExpression regionCodeEq(String regionCode) {
    return StringUtils.hasText(regionCode) ? restaurant.regionCode.eq(regionCode) : null;
  }

  /**
   * 삭제되지 않은 레스토랑 조건
   *
   * @return BooleanExpression
   * @author 김예진
   * @since 2025-10-15
   */
  private BooleanExpression isNotDeleted() {
    return restaurant.isDeleted.eq(false);
  }
}
