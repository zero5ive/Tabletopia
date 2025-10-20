import styles from './HeroSection.module.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurantList, getRestaurantBookmarks } from '../../utils/RestaurantApi'
import { getReservationList } from '../../utils/ReservationApi'

export default function HeroSection(){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

    const [featuredRestaurant, setFeaturedRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedRestaurant();
    }, []);

    const fetchFeaturedRestaurant = async () => {
        try {
            // 1. 모든 레스토랑 조회
            const response = await getRestaurantList();
            let restaurants = [];

            if (response.data?.data) {
                restaurants = response.data.data;
            } else if (Array.isArray(response.data)) {
                restaurants = response.data;
            }

            if (!restaurants || restaurants.length === 0) {
                setLoading(false);
                return;
            }

            // 2. 예약 TOP3와 북마크 TOP3 모두 계산
            const restaurantData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    try {
                        // 예약 수 조회
                        const reservationResponse = await getReservationList(restaurant.id);
                        let reservationCount = 0;
                        if (reservationResponse.data?.data) {
                            reservationCount = reservationResponse.data.data.length;
                        } else if (Array.isArray(reservationResponse.data)) {
                            reservationCount = reservationResponse.data.length;
                        }

                        // 북마크 수 조회
                        const bookmarkResponse = await getRestaurantBookmarks(restaurant.id);
                        let bookmarkCount = 0;
                        if (bookmarkResponse.data?.data) {
                            bookmarkCount = bookmarkResponse.data.data.length;
                        } else if (Array.isArray(bookmarkResponse.data)) {
                            bookmarkCount = bookmarkResponse.data.length;
                        }

                        // 리뷰 데이터
                        const reviews = restaurant.reviews || [];
                        const reviewCount = reviews.length;
                        const averageRating = reviewCount > 0
                            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                            : 0;

                        return {
                            ...restaurant,
                            reservationCount,
                            bookmarkCount,
                            reviewCount,
                            averageRating
                        };
                    } catch (error) {
                        return {
                            ...restaurant,
                            reservationCount: 0,
                            bookmarkCount: 0,
                            reviewCount: 0,
                            averageRating: 0
                        };
                    }
                })
            );

            // 3. 예약 TOP3 계산
            const reservationTop3 = [...restaurantData]
                .sort((a, b) => {
                    if (b.reservationCount !== a.reservationCount) {
                        return b.reservationCount - a.reservationCount;
                    }
                    if (b.averageRating !== a.averageRating) {
                        return (b.averageRating || 0) - (a.averageRating || 0);
                    }
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
                })
                .slice(0, 3);

            // 4. 북마크 TOP3 계산
            const bookmarkTop3 = [...restaurantData]
                .sort((a, b) => {
                    if (b.bookmarkCount !== a.bookmarkCount) {
                        return b.bookmarkCount - a.bookmarkCount;
                    }
                    if (b.averageRating !== a.averageRating) {
                        return (b.averageRating || 0) - (a.averageRating || 0);
                    }
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
                })
                .slice(0, 3);

            // 5. 예약 TOP3 + 북마크 TOP3 합치기 (중복 제거)
            const allTopRestaurants = [...reservationTop3];
            bookmarkTop3.forEach(restaurant => {
                if (!allTopRestaurants.find(r => r.id === restaurant.id)) {
                    allTopRestaurants.push(restaurant);
                }
            });

            // 6. 랜덤하게 하나 선택
            if (allTopRestaurants.length > 0) {
                const randomIndex = Math.floor(Math.random() * allTopRestaurants.length);
                setFeaturedRestaurant(allTopRestaurants[randomIndex]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Featured 레스토랑 조회 실패:', error);
            setLoading(false);
        }
    };

    if (loading || !featuredRestaurant) {
        return (
            <section className={styles.heroSection}>
                <div className={styles.particles}>
                    <div className={`${styles.particle} ${styles.particle1}`}></div>
                    <div className={`${styles.particle} ${styles.particle2}`}></div>
                    <div className={`${styles.particle} ${styles.particle3}`}></div>
                    <div className={`${styles.particle} ${styles.particle4}`}></div>
                    <div className={`${styles.particle} ${styles.particle5}`}></div>
                    <div className={`${styles.particle} ${styles.particle6}`}></div>
                    <div className={`${styles.particle} ${styles.particle7}`}></div>
                    <div className={`${styles.particle} ${styles.particle8}`}></div>
                </div>
                <div className={styles.heroContent}>
                    <h1>예약의 새로운 패러다임</h1>
                    <p>테이블토피아</p>
                    <p>예약과 웨이팅을 한 번에</p>
                </div>
            </section>
        );
    }

    return(
        <>
            {/* Hero Section - Featured Restaurant Banner */}
            <Link to={`/restaurant/detail?restaurantId=${featuredRestaurant.id}`} className={styles.bannerLink}>
                <section className={styles.heroSection}>
                    {/* 배경 이미지 */}
                    <div className={styles.backgroundImage}>
                        <img
                            src={(() => {
                                if (featuredRestaurant.restaurantImage && featuredRestaurant.restaurantImage.length > 0) {
                                    // 메인 이미지 찾기
                                    const mainImage = featuredRestaurant.restaurantImage.find(img => img.isMain);
                                    const imageUrl = mainImage ? mainImage.imageUrl : featuredRestaurant.restaurantImage[0].imageUrl;
                                    return `${API_BASE_URL}/uploads/restaurants/${imageUrl}`;
                                }
                                return '/placeholder-restaurant.png';
                            })()}
                            alt={featuredRestaurant.name}
                        />
                        <div className={styles.overlay}></div>
                    </div>

                    {/* 배경 파티클/도형 효과 */}
                    <div className={styles.particles}>
                        <div className={`${styles.particle} ${styles.particle1}`}></div>
                        <div className={`${styles.particle} ${styles.particle2}`}></div>
                        <div className={`${styles.particle} ${styles.particle3}`}></div>
                        <div className={`${styles.particle} ${styles.particle4}`}></div>
                        <div className={`${styles.particle} ${styles.particle5}`}></div>
                        <div className={`${styles.particle} ${styles.particle6}`}></div>
                        <div className={`${styles.particle} ${styles.particle7}`}></div>
                        <div className={`${styles.particle} ${styles.particle8}`}></div>
                    </div>

                    <div className={styles.heroContent}>
                        <div className={styles.mainText}>
                            <p className={styles.topLine}>테이블토피아의 오늘의 PICK!</p>
                            <h1>{featuredRestaurant.name}</h1>
                            <div className={styles.subInfo}>
                                <span className={styles.rating}>
                                    {'⭐'.repeat(Math.round(featuredRestaurant.averageRating || 0))} {featuredRestaurant.averageRating ? featuredRestaurant.averageRating.toFixed(1) : '0.0'}
                                </span>
                                <span className={styles.separator}>|</span>
                                <span className={styles.location}>📍 {featuredRestaurant.regionCode}</span>
                                {featuredRestaurant.reservationCount > 0 && (
                                    <>
                                        <span className={styles.separator}>|</span>
                                        <span className={styles.stat}>🔥 예약 {featuredRestaurant.reservationCount}건</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button className={styles.ctaButton}>지금 예약하기 →</button>
                    </div>
                </section>
            </Link>
        </>
    )
}