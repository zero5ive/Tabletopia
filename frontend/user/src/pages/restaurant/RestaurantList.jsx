import Header from "../../components/header/Header";
import styles from './RestaurantList.module.css';
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getRestaurantByCategory } from "../utils/RestaurantCategory";

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지 (0부터 시작)
    const [totalPages, setTotalPages] = useState(0);    // 전체 페이지 수
    const [totalElements, setTotalElements] = useState(0); // 전체 레스토랑 수
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    //카테고리 별 레스토랑 함수
    const fetchRestaurant = async (categoryId, page = 0) => {
        const response = await getRestaurantByCategory(categoryId, page);
        console.log('레스토랑', response);
        
        const pageData = response.data.restaurants;
        setRestaurants(pageData.content);           // 레스토랑 목록
        setTotalPages(pageData.totalPages);         // 전체 페이지 수
        setTotalElements(pageData.totalElements);   // 전체 레스토랑 수
        setCurrentPage(pageData.number);            // 현재 페이지
    }

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            fetchRestaurant(categoryId, page);
        }
    };

    // 페이지 번호 배열 생성 (최대 5개 표시)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

        // 끝 페이지가 총 페이지보다 작으면 시작 페이지 조정
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(0, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // 영업시간 포맷팅하는 함수 - 연속된 요일을 범위로 표시
    const formatOpeningHours = (openingHours) => {
        if (!openingHours || openingHours.length === 0) return [];

        // 요일 순서 매핑
        const dayOrder = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };

        // 시간대별로 그룹화
        const timeGroups = {};

        openingHours.forEach(hourString => {
            const [day, time] = hourString.split(': ');
            if (!timeGroups[time]) {
                timeGroups[time] = [];
            }
            timeGroups[time].push(day);
        });

        // 그룹화된 결과를 문자열로 변환
        return Object.entries(timeGroups).map(([time, days]) => {
            // 요일을 숫자로 변환하여 정렬
            const sortedDays = days.sort((a, b) => dayOrder[a] - dayOrder[b]);

            // 연속된 요일을 범위로 묶기
            const ranges = [];
            let start = 0;

            for (let i = 1; i <= sortedDays.length; i++) {
                // 연속이 끊기거나 마지막 요일인 경우
                if (i === sortedDays.length ||
                    dayOrder[sortedDays[i]] !== dayOrder[sortedDays[i - 1]] + 1) {

                    if (start === i - 1) {
                        // 단일 요일
                        ranges.push(sortedDays[start]);
                    } else {
                        // 범위로 표시
                        ranges.push(`${sortedDays[start]}~${sortedDays[i - 1]}`);
                    }
                    start = i;
                }
            }

            return `${ranges.join(', ')}: ${time}`;
        });
    };

    useEffect(() => {
        if (categoryId) {
            fetchRestaurant(categoryId, 0);  // 처음엔 0페이지부터
        }
    }, [categoryId]);

    return (
        <>
            <main className={styles["main-content"]}>
                <div className={styles["container"]}>
                    <div className={styles["search-section"]}>
                        <div className={styles["search-bar"]}>
                            <input type="text" className={styles["search-input"]} placeholder="매장명, 지역, 음식 종류를 검색해보세요" />
                            <button className={styles["search-btn"]}>🔍 검색</button>
                        </div>

                        <div className={styles["filter-section"]}>
                            <div className={styles["filter-group"]}>
                                <span className={styles["filter-label"]}>지역</span>
                                <select className={styles["filter-select"]}>
                                    <option>전체</option>
                                    <option>강남구</option>
                                    <option>서초구</option>
                                    <option>중구</option>
                                    <option>종로구</option>
                                </select>
                            </div>

                            <div className={styles["filter-group"]}>
                                <span className={styles["filter-label"]}>음식</span>
                                <select className={styles["filter-select"]}>
                                    <option>전체</option>
                                    <option>한식</option>
                                    <option>일식</option>
                                    <option>중식</option>
                                    <option>양식</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles["results-header"]}>
                        <div className={styles["results-info"]}>
                            총 <span className={styles["count"]}>{totalElements}</span>개의 레스토랑을 찾았습니다
                        </div>
                        <div className={styles["sort-options"]}>
                            <button className={`${styles["sort-btn"]} ${styles["active"]}`}>추천순</button>
                            <button className={styles["sort-btn"]}>평점순</button>
                            <button className={styles["sort-btn"]}>리뷰많은순</button>
                        </div>
                    </div>

                    <div className={styles["restaurant-grid"]}>
                        {restaurants.map(restaurant => (
                            <Link key={restaurant.id} to={`/restaurant/detail?restaurantId=${restaurant.id}`} className={styles.noUnderline}>
                                <div className={styles["restaurant-card"]}>
                                    <div className={styles["card-image"]}>
                                        <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop" alt={restaurant.name} />
                                        <button className={styles["bookmark-btn"]}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                            </svg>
                                        </button>
                                        <div className={styles["quick-info"]}>
                                            <span className={styles["info-badge"]}>영업중</span>
                                            <span className={styles["info-badge"]}>예약가능</span>
                                        </div>
                                    </div>
                                    <div className={styles["card-content"]}>
                                        <h3 className={styles["restaurant-name"]}>{restaurant.name}</h3>
                                        <div className={styles["restaurant-info"]}>
                                            <div className={styles["rating"]}>
                                                <span className={styles["star"]}>⭐</span>
                                                <span className={styles["score"]}>{restaurant.averageRating}</span>
                                                <span className={styles["reviews"]}>({restaurant.totalReviews})</span>
                                            </div>
                                            <div className={styles["location"]}>
                                                <span>📍</span>
                                                <span>{restaurant.regionCode}</span>
                                            </div>
                                        </div>
                                        <div className={styles["restaurant-tags"]}>
                                            {formatOpeningHours(restaurant.openingHours).map((hour, index) => (
                                                <span key={`hour-${index}`} className={`${styles["tag"]} ${styles["cuisine"]}`}>
                                                    {hour}
                                                </span>
                                            ))}
                                            <span className={`${styles["tag"]} ${styles["feature"]}`}>
                                                {restaurant.facilityNames?.join(', ')}
                                            </span>
                                        </div>
                                        <div className={styles["availability-section"]}>
                                            <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                            <div className={styles["time-slots"]}>
                                                <span className={`${styles["time-slot"]} ${styles["unavailable"]}`}>8.14 (화)</span>
                                                <span className={`${styles["time-slot"]} ${styles["available"]}`}>8.15 (수)</span>
                                                <span className={`${styles["time-slot"]} ${styles["available"]}`}>8.16 (목)</span>
                                                <span className={`${styles["time-slot"]} ${styles["full"]}`}>8.17 (금)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* 페이징 */}
                    <div className={styles['demo-section']}>
                        <div className={styles['pagination-container']}>
                            <div className={styles.pagination}>
                                {/* 이전 버튼 */}
                                <button 
                                    className={`${styles['pagination-btn']} ${styles.arrow} ${currentPage === 0 ? styles.disabled : ''}`}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>

                                {/* 페이지 번호들 */}
                                {getPageNumbers().map(page => (
                                    <button 
                                        key={page}
                                        className={`${styles['pagination-btn']} ${currentPage === page ? styles.active : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                {/* 마지막 페이지가 표시되지 않으면 ... 표시 */}
                                {totalPages > 0 && getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                    <>
                                        <span className={styles['pagination-dots']}>...</span>
                                        <button 
                                            className={styles['pagination-btn']}
                                            onClick={() => handlePageChange(totalPages - 1)}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}

                                {/* 다음 버튼 */}
                                <button 
                                    className={`${styles['pagination-btn']} ${styles.arrow} ${currentPage === totalPages - 1 ? styles.disabled : ''}`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    )
}