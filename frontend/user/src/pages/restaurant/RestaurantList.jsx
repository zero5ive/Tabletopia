import Header from "../../components/header/Header";
import styles from './RestaurantList.module.css';
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getRestaurantByCategory } from "../utils/RestaurantCategory";

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('categoryId');

      //카테고리 별 레스토랑 함수
    const fetchRestaurant = async(categoryId)=>{
        const response = await getRestaurantByCategory(categoryId);
        console.log('레스토랑', response);
        setRestaurants(response.data.restaurants);
    }

    useEffect(()=> {
       if(categoryId) {
        fetchRestaurant(categoryId);
       }
    },[categoryId]);

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

                            {/* <button className={`${styles["filter-btn"]} ${styles["active"]}`}>내 주변</button>  */}
                            {/* <button className={styles["filter-btn"]}>즉시 예약</button>  */}
                            {/* <button className={styles["filter-btn"]}>평점 높은 순</button> */}
                            {/* <button className={styles["filter-btn"]}>가격대</button>  */}
                        </div>
                    </div>

                    <div className={styles["results-header"]}>
                        <div className={styles["results-info"]}>
                            총 <span className={styles["count"]}>127</span>개의 레스토랑을 찾았습니다
                        </div>
                        <div className={styles["sort-options"]}>
                            <button className={`${styles["sort-btn"]} ${styles["active"]}`}>추천순</button>
                            <button className={styles["sort-btn"]}>평점순</button>
                            <button className={styles["sort-btn"]}>리뷰많은순</button>
                        </div>
                    </div>


                    <div className={styles["restaurant-grid"]}>
                        {restaurants.map(restaurant =>(
                        
                        <Link key={restaurant.id} to="/restaurant/detail" className={styles.noUnderline}>
                            {/* <!-- 레스토랑 카드 1 --> */}
                            <div className={styles["restaurant-card"]}>
                                <div className={styles["card-image"]}>
                                    <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop" alt="소시센몬" />
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
                                            <span className={styles["score"]}>4.7</span>
                                            <span className={styles["reviews"]}>(1,016)</span>
                                        </div>
                                        <div className={styles["location"]}>
                                            <span>📍</span>
                                            <span>{restaurant.regionCode}</span>
                                        </div>
                                    </div>
                                    <div className={styles["restaurant-tags"]}>
                                        <span className={`${styles["tag"]} ${styles["cuisine"]}`}>음식카테고리</span>
                                        <span className={`${styles["tag"]} ${styles["feature"]}`}>여기에 편의시설 항목들</span>
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
                    <div className={styles['demo-section']}>
                        <div className={styles['pagination-container']}>
                            <div className={styles.pagination}>
                                <button className={`${styles['pagination-btn']} ${styles.arrow} ${styles.disabled}`}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button className={`${styles['pagination-btn']} ${styles.active}`}>1</button>
                                <button className={styles['pagination-btn']}>2</button>
                                <button className={styles['pagination-btn']}>3</button>
                                <button className={styles['pagination-btn']}>4</button>
                                <button className={styles['pagination-btn']}>5</button>
                                <span className={styles['pagination-dots']}>...</span>
                                <button className={styles['pagination-btn']}>15</button>
                                <button className={`${styles['pagination-btn']} ${styles.arrow}`}>
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