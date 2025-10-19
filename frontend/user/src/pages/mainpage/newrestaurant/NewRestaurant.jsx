import styles from './NewRestaurant.module.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReservationList } from '../../utils/ReservationApi';
import { getRestaurantList } from '../../utils/RestaurantApi';
import { getRestaurantBookmarks } from '../../utils/RestaurantApi';

export default function NewRestaurant() {

    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topBookmarks, setTopBookmarks] = useState([]);

    useEffect(() => {
        fetchTop3Restaurants();
        fetchTop3Bookmarks();
    }, []);


    const fetchTop3Restaurants = async () => {
        try {
            // 1. 모든 레스토랑 조회
            const response = await getRestaurantList();
            console.log('레스토랑 목록 전체 응답:', response);

            // 응답 구조 확인 및 처리
            let restaurants = [];
            if (response.data?.data) {
                restaurants = response.data.data;
            } else if (Array.isArray(response.data)) {
                restaurants = response.data;
            } else {
                console.error('예상치 못한 응답 구조:', response.data);
                setLoading(false);
                return;
            }


            if (!restaurants || restaurants.length === 0) {
                console.warn('레스토랑 목록이 비어있습니다.');
                setLoading(false);
                return;
            }

            // 2. 각 레스토랑의 예약 건수, 평점, 리뷰 개수 계산
            const restaurantData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    try {
                        const reservationResponse = await getReservationList(restaurant.id);

                        let reservationCount = 0;
                        if (reservationResponse.data?.data) {
                            reservationCount = reservationResponse.data.data.length;
                        } else if (Array.isArray(reservationResponse.data)) {
                            reservationCount = reservationResponse.data.length;
                        }

                        // 리뷰 데이터로부터 평점과 리뷰 개수 계산
                        const reviews = restaurant.reviews || [];
                        const reviewCount = reviews.length;
                        const averageRating = reviewCount > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                            : 0;

                        console.log(`레스토랑 ${restaurant.id} - 리뷰 개수: ${reviewCount}, 평균 평점: ${averageRating}`);

                        return {
                            ...restaurant,  // 레스토랑 전체 정보 포함
                            reservationCount: reservationCount,
                            reviewCount: reviewCount,
                            averageRating: averageRating
                        };
                    } catch (error) {
                        console.error(`레스토랑 ${restaurant.id} 예약 조회 실패:`, error);
                        return {
                            ...restaurant,
                            reservationCount: 0,
                            reviewCount: 0,
                            averageRating: 0
                        };
                    }
                })
            );

            // 3. 정렬 기준: 예약 수 동일 시 평점 -> 리뷰 수
            const sorted = restaurantData
                .sort((a, b) => {
                    // 1차: 예약 수 많은 순
                    if (b.reservationCount !== a.reservationCount) {
                        return b.reservationCount - a.reservationCount;
                    }
                    // 2차: 평점 높은 순
                    if (b.averageRating !== a.averageRating) {
                        return (b.averageRating || 0) - (a.averageRating || 0);
                    }
                    // 3차: 리뷰 많은 순
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
                })
                .slice(0, 3)
                .map((restaurant, index) => ({
                    ...restaurant,
                    rank: index + 1
                }));

            console.log('TOP3 결과:', sorted);
            setTop3(sorted);
            setLoading(false);

        } catch (error) {
            console.error('TOP3 조회 실패:', error);
            console.error('에러 상세:', error.response?.data);
            setLoading(false);
        }
    };

    const fetchTop3Bookmarks = async () => {
        try {
            // 1. 모든 레스토랑 조회
            const response = await getRestaurantList();
            console.log('북마크 TOP3용 레스토랑 목록:', response);

            // 응답 구조 확인 및 처리
            let restaurants = [];
            if (response.data?.data) {
                restaurants = response.data.data;
            } else if (Array.isArray(response.data)) {
                restaurants = response.data;
            } else {
                console.error('예상치 못한 응답 구조:', response.data);
                return;
            }

            if (!restaurants || restaurants.length === 0) {
                console.warn('레스토랑 목록이 비어있습니다.');
                return;
            }

            // 2. 각 레스토랑의 북마크 개수, 평점, 리뷰 개수 계산
            const restaurantData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    try {
                        const bookmarkResponse = await getRestaurantBookmarks(restaurant.id);
                        console.log(`레스토랑 ${restaurant.id} 북마크 응답:`, bookmarkResponse.data);

                        let bookmarkCount = 0;
                        if (bookmarkResponse.data?.data) {
                            bookmarkCount = bookmarkResponse.data.data.length;
                        } else if (Array.isArray(bookmarkResponse.data)) {
                            bookmarkCount = bookmarkResponse.data.length;
                        }

                        // 리뷰 데이터로부터 평점과 리뷰 개수 계산
                        const reviews = restaurant.reviews || [];
                        const reviewCount = reviews.length;
                        const averageRating = reviewCount > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                            : 0;

                        console.log(`레스토랑 ${restaurant.id} - 북마크 개수: ${bookmarkCount}, 리뷰 개수: ${reviewCount}, 평균 평점: ${averageRating}`);

                        return {
                            ...restaurant,
                            bookmarkCount: bookmarkCount,
                            reviewCount: reviewCount,
                            averageRating: averageRating
                        };
                    } catch (error) {
                        console.error(`레스토랑 ${restaurant.id} 북마크 조회 실패:`, error);
                        return {
                            ...restaurant,
                            bookmarkCount: 0,
                            reviewCount: 0,
                            averageRating: 0
                        };
                    }
                })
            );

            // 3. 정렬 기준: 북마크 수 동일 시 평점 -> 리뷰 수
            const sorted = restaurantData
                .sort((a, b) => {
                    // 1차: 북마크 수 많은 순
                    if (b.bookmarkCount !== a.bookmarkCount) {
                        return b.bookmarkCount - a.bookmarkCount;
                    }
                    // 2차: 평점 높은 순
                    if (b.averageRating !== a.averageRating) {
                        return (b.averageRating || 0) - (a.averageRating || 0);
                    }
                    // 3차: 리뷰 많은 순
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
                })
                .slice(0, 3)
                .map((restaurant, index) => ({
                    ...restaurant,
                    rank: index + 1
                }));

            console.log('북마크 TOP3 결과:', sorted);
            setTopBookmarks(sorted);

        } catch (error) {
            console.error('북마크 TOP3 조회 실패:', error);
            console.error('에러 상세:', error.response?.data);
        }
    };

    if (loading) return <div className={styles.container}>로딩 중...</div>;


    const renderRestaurantCard = (restaurant, type) => (
        <Link
            key={restaurant.id}
            to={`/restaurant/detail?restaurantId=${restaurant.id}`}
            className={styles['no-underline']}
        >
            <div className={styles['restaurant-card']}>
                <div className={styles['card-image']}>
                    <img
                        src={restaurant.restaurantImage && restaurant.restaurantImage.length > 0
                            ? `http://localhost:8002/uploads/restaurants/${restaurant.restaurantImage[0].imageUrl}`
                            : '/placeholder-restaurant.png'
                        }
                        alt={restaurant.name}
                    />
                </div>

                <div className={styles['card-content']}>
                    <h3 className={styles['restaurant-name']}>{restaurant.name}</h3>

                    <div className={styles['restaurant-info']}>
                        <div className={styles.rating}>
                            <span className={styles.stars}>
                                {'⭐'.repeat(Math.round(restaurant.averageRating))}
                            </span>
                            <span className={styles.score}>
                                {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : '0.0'}
                            </span>
                            <span className={styles.reviews}>
                                ({restaurant.reviewCount || 0})
                            </span>
                        </div>
                        <div className={styles.location}>
                            <span>📍</span>
                            <span>{restaurant.regionCode}</span>
                        </div>
                    </div>
                    {/* 통계 배지 */}
                    <div className={styles['stats-badge']}>
                        {type === 'reservation' ? (
                            <>
                                <span className={styles['badge-icon']}>🔥</span>
                                <span className={styles['badge-text']}>
                                    예약 {restaurant.reservationCount.toLocaleString()}건
                                </span>
                            </>
                        ) : (
                            <>
                                <span className={styles['badge-icon']}>❤️</span>
                                <span className={styles['badge-text']}>
                                    북마크 {restaurant.bookmarkCount.toLocaleString()}개
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <>
            <div className={styles.container}>
                {/* 예약 많은 순 TOP3 */}
                <section className={styles['top-section']}>
                    <div className={styles['section-header']}>
                        <h2 className={styles['section-title']}>
                            🔥 예약 많은 레스토랑 TOP 3
                        </h2>
                        <p className={styles['section-subtitle']}>
                            지금 가장 인기있는 레스토랑을 만나보세요
                        </p>
                    </div>

                    <div className={styles['restaurant-grid']}>
                        {top3.map(restaurant =>
                            renderRestaurantCard(restaurant, 'reservation')
                        )}
                    </div>
                </section>

                 {/* 북마크 많은 순 TOP3 */}
                <section className={styles['top-section']}>
                    <div className={styles['section-header']}>
                        <h2 className={styles['section-title']}>
                            ❤️ 북마크 많은 레스토랑 TOP 3
                        </h2>
                        <p className={styles['section-subtitle']}>
                            사람들이 가장 많이 저장한 레스토랑을 만나보세요
                        </p>
                    </div>

                    <div className={styles['restaurant-grid']}>
                        {topBookmarks.map(restaurant =>
                            renderRestaurantCard(restaurant, 'bookmark')
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}