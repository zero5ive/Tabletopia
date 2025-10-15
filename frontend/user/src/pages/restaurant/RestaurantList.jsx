import Header from "../../components/header/Header";
import styles from './RestaurantList.module.css';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchRestaurants } from "../utils/RestaurantApi";

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryId = searchParams.get('categoryId');  // URL에서 카테고리ID 추출
    const regionCode = searchParams.get('regionCode');  // 지역 추출

    // 지역 목록
    const regions = [
        { code: '', name: '전체' },
        { code: '서울', name: '서울' },
        { code: '경기', name: '경기' },
        { code: '강원', name: '강원' },
        { code: '충북', name: '충북' },
        { code: '충남', name: '충남' },
        { code: '전북', name: '전북' },
        { code: '전남', name: '전남' },
        { code: '경북', name: '경북' },
        { code: '경남', name: '경남' },
        { code: '제주', name: '제주' }
    ];

    // 카테고리 목록
    const categories = [
        { id: '', name: '전체' },
        { id: '1', name: '한식' },
        { id: '2', name: '중식' },
        { id: '3', name: '일식' },
        { id: '4', name: '양식' },
        { id: '5', name: '기타' }
    ];

    /**
     * 레스토랑 검색 함수
     */
    const fetchRestaurant = async (page = 0) => {
        try {
            // searchRestaurants 함수 사용
            const response = await searchRestaurants({
                categoryId: categoryId,  // 카테고리 ID
                regionCode: regionCode, // 지역코드
                page: page,
                size: 9  // 한 페이지당 9개씩 표시
            });

            console.log('레스토랑 검색 결과:', response);

            const pageData = response.data;
            setRestaurants(pageData.content);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            setCurrentPage(pageData.number);

        } catch (error) {
            console.error('레스토랑 조회 실패:', error);
        }
    };

    /**
     * 지역 선택 핸들러
     */
    const handleRegionChange = (e) => {
        const selectedRegion = e.target.value;

        // 현재 URL의 쿼리 파라미터 가져오기
        const params = new URLSearchParams();

        // 카테고리 유지
        if (categoryId) {
            params.set('categoryId', categoryId);
        }

        // 지역 설정 (전체가 아닐 경우만)
        if (selectedRegion) {
            params.set('regionCode', selectedRegion);
        }

        // URL 변경
        navigate(`/restaurant/list?${params.toString()}`);
    };

    /**
     * 카테고리 선택 핸들러
     */
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        // 현재 URL의 쿼리 파라미터 가져오기
        const params = new URLSearchParams();

        // 카테고리 설정 (전체가 아닐 경우만)
        if (selectedCategory) {
            params.set('categoryId', selectedCategory);
        }

        // 지역 유지
        if (regionCode) {
            params.set('regionCode', regionCode);
        }

        // URL 변경
        navigate(`/restaurant/list?${params.toString()}`);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            fetchRestaurant(page);
        }
    };

    // 페이지 번호 배열 생성 (최대 5개 표시)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(0, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // 영업시간 포맷팅하는 함수
    const formatOpeningHours = (openingHours) => {
        if (!openingHours || openingHours.length === 0) return [];

        const dayOrder = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
        const timeGroups = {};

        openingHours.forEach(hourString => {
            const [day, time] = hourString.split(': ');
            if (!timeGroups[time]) {
                timeGroups[time] = [];
            }
            timeGroups[time].push(day);
        });

        return Object.entries(timeGroups).map(([time, days]) => {
            const sortedDays = days.sort((a, b) => dayOrder[a] - dayOrder[b]);
            const ranges = [];
            let start = 0;

            for (let i = 1; i <= sortedDays.length; i++) {
                if (i === sortedDays.length ||
                    dayOrder[sortedDays[i]] !== dayOrder[sortedDays[i - 1]] + 1) {

                    if (start === i - 1) {
                        ranges.push(sortedDays[start]);
                    } else {
                        ranges.push(`${sortedDays[start]}~${sortedDays[i - 1]}`);
                    }
                    start = i;
                }
            }

            return `${ranges.join(', ')}: ${time}`;
        });
    };

    // 검색 실행
    useEffect(() => {
        console.log('검색 조건:', { categoryId, regionCode });
        fetchRestaurant(0);
    }, [categoryId, regionCode]);

    return (
        <>
            <main className={styles["main-content"]}>
                <div className={styles["container"]}>
                    <div className={styles["search-section"]}>
                        <div className={styles["search-bar"]}>
                            <input
                                type="text"
                                className={styles["search-input"]}
                                placeholder="매장명, 지역, 음식 종류를 검색해보세요"
                            />
                            <button className={styles["search-btn"]}>🔍 검색</button>
                        </div>

                        <div className={styles["filter-section"]}>
                            {/* 지역 필터 */}
                            <div className={styles["filter-group"]}>
                                <span className={styles["filter-label"]}>지역</span>
                                <select
                                    className={styles["filter-select"]}
                                    value={regionCode || ''}  // 현재 선택된 지역
                                    onChange={handleRegionChange}  // 변경 이벤트
                                >
                                    {regions.map(region => (
                                        <option key={region.code} value={region.code}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* 카테고리 필터 */}
                            <div className={styles["filter-group"]}>
                                <span className={styles["filter-label"]}>음식</span>
                                <select
                                    className={styles["filter-select"]}
                                    value={categoryId || ''}  // 현재 선택된 카테고리
                                    onChange={handleCategoryChange}  // 변경 이벤트
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles["results-header"]}>
                        <div className={styles["results-info"]}>
                            총 <span className={styles["count"]}>{totalElements}</span>개의 레스토랑을 찾았습니다
                        </div>
                        {/* <div className={styles["sort-options"]}>
                            <button className={`${styles["sort-btn"]} ${styles["active"]}`}>추천순</button>
                            <button className={styles["sort-btn"]}>평점순</button>
                            <button className={styles["sort-btn"]}>리뷰많은순</button>
                        </div> */}
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
                                                <span className={styles["score"]}>
                                                    {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : '0.0'}
                                                </span>
                                                <span className={styles["reviews"]}>
                                                    ({restaurant.reviewCount || 0})
                                                </span>
                                            </div>
                                            <div className={styles["location"]}>
                                                <span>📍</span>
                                                <span>{restaurant.regionCode}</span>
                                            </div>
                                        </div>
                                        <div className={styles["restaurant-tags"]}>
                                            <span className={`${styles["tag"]} ${styles["cuisine"]}`}>
                                                {restaurant.restaurantCategoryName}
                                            </span>
                                            {restaurant.facilityNames && restaurant.facilityNames.length > 0 && (
                                                <div className={styles.features}>
                                                    {restaurant.facilityNames.map((name, index) => (
                                                        <span key={index} className={`${styles["tag"]} ${styles["feature"]}`}>
                                                            {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                        <div className={styles["availability-section"]}>
                                            <div className={styles["availability-title"]}>
                                                오늘 영업시간: {restaurant.todayOpeningHours || '정보 없음'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        ))
                        }
                    </div>

                    {/* 페이징 */}
                    {totalPages > 1 && (
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
                    )}

                </div>
            </main>
        </>
    );
}