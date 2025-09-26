import Header from "../../components/header/Header";
import styles from './RestaurantList.module.css';
import { Link } from "react-router-dom";

export default function RestaurantList() {
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
                        <Link to="/restaurant/detail" className={styles.noUnderline}>
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
                                    <h3 className={styles["restaurant-name"]}>소시센몬</h3>
                                    <div className={styles["restaurant-info"]}>
                                        <div className={styles["rating"]}>
                                            <span className={styles["star"]}>⭐</span>
                                            <span className={styles["score"]}>4.7</span>
                                            <span className={styles["reviews"]}>(1,016)</span>
                                        </div>
                                        <div className={styles["location"]}>
                                            <span>📍</span>
                                            <span>선릉 • 소시오마케</span>
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

                        {/* <!-- 레스토랑 카드 2 --> */}
                        <div className={styles["restaurant-card"]}>
                            <div className={styles["card-image"]}>
                                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop" alt="더 스테이크 하우스" />
                                <button className={`${styles["bookmark-btn"]} ${styles["active"]}`}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className={styles["quick-info"]}>
                                    <span className={styles["info-badge"]}>영업중</span>
                                    <span className={styles["info-badge"]}>웨이팅 가능</span>
                                </div>
                            </div>
                            <div className={styles["card-content"]}>
                                <h3 className={styles["restaurant-name"]}>더 스테이크 하우스</h3>
                                <div className={styles["restaurant-info"]}>
                                    <div className={styles["rating"]}>
                                        <span className={styles["star"]}>⭐</span>
                                        <span className={styles["score"]}>4.5</span>
                                        <span className={styles["reviews"]}>(842)</span>
                                    </div>
                                    <div className={styles["location"]}>
                                        <span>📍</span>
                                        <span>강남구 청담동 </span>
                                    </div>
                                </div>
                                <div className={styles["restaurant-tags"]}>
                                    <span className={`${styles["tag"]} ${styles["cuisine"]}`}>양식</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>스테이크</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>와인바</span>
                                </div>
                                <div className={styles["availability-section"]}>
                                    <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                    <div className={styles["time-slots"]}>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>18:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>19:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>20:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>21:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 3 --> */}
                        <div className={styles["restaurant-card"]}>
                            <div className={styles["card-image"]}>
                                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop" alt="이타리아노 파스타" />
                                <button className={styles["bookmark-btn"]}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className={styles["quick-info"]}>
                                    <span className={styles["info-badge"]}>영업중</span>
                                    {/* <!-- <span className={styles["info-badge"]}>즉시 예약</span> --> */}
                                </div>
                            </div>
                            <div className={styles["card-content"]}>
                                <h3 className={styles["restaurant-name"]}>이타리아노 파스타</h3>
                                <div className={styles["restaurant-info"]}>
                                    <div className={styles["rating"]}>
                                        <span className={styles["star"]}>⭐</span>
                                        <span className={styles["score"]}>4.3</span>
                                        <span className={styles["reviews"]}>(567)</span>
                                    </div>
                                    <div className={styles["location"]}>
                                        <span>📍</span>
                                        <span>서초구 서초동</span>
                                    </div>
                                </div>
                                <div className={styles["restaurant-tags"]}>
                                    <span className={`${styles["tag"]} ${styles["cuisine"]}`}>이탈리안</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>파스타</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>피자</span>
                                </div>
                                <div className={styles["availability-section"]}>
                                    <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                    <div className={styles["time-slots"]}>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>17:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>18:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>19:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>20:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 4 --> */}
                        <div className={styles["restaurant-card"]}>
                            <div className={styles["card-image"]}>
                                <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop" alt="한정식 궁중연" />
                                <button className={styles["bookmark-btn"]}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className={styles["quick-info"]}>
                                    <span className={styles["info-badge"]}>영업중</span>
                                    <span className={styles["info-badge"]}>예약 필수</span>
                                </div>
                            </div>
                            <div className={styles["card-content"]}>
                                <h3 className={styles["restaurant-name"]}>한정식 궁중연</h3>
                                <div className={styles["restaurant-info"]}>
                                    <div className={styles["rating"]}>
                                        <span className={styles["star"]}>⭐</span>
                                        <span className={styles["score"]}>4.8</span>
                                        <span className={styles["reviews"]}>(321)</span>
                                    </div>
                                    <div className={styles["location"]}>
                                        <span>📍</span>
                                        <span>중구 명동 </span>
                                    </div>
                                </div>
                                <div className={styles["restaurant-tags"]}>
                                    <span className={`${styles["tag"]} ${styles["cuisine"]}`}>한식</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>한정식</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>개인실</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>접대</span>
                                </div>
                                <div className={styles["availability-section"]}>
                                    <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                    <div className={styles["time-slots"]}>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>12:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>18:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>19:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>20:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 5 --> */}
                        <div className={styles["restaurant-card"]}>
                            <div className={styles["card-image"]}>
                                <img src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop" alt="스시 마사" />
                                <button className={styles["bookmark-btn"]}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className={styles["quick-info"]}>
                                    <span className={styles["info-badge"]}>영업중</span>
                                    <span className={styles["info-badge"]}>오마카세</span>
                                </div>
                            </div>
                            <div className={styles["card-content"]}>
                                <h3 className={styles["restaurant-name"]}>스시 마사</h3>
                                <div className={styles["restaurant-info"]}>
                                    <div className={styles["rating"]}>
                                        <span className={styles["star"]}>⭐</span>
                                        <span className={styles["score"]}>4.9</span>
                                        <span className={styles["reviews"]}>(189)</span>
                                    </div>
                                    <div className={styles["location"]}>
                                        <span>📍</span>
                                        <span>강남구 신사동</span>
                                    </div>
                                </div>
                                <div className={styles["restaurant-tags"]}>
                                    <span className={`${styles["tag"]} ${styles["cuisine"]}`}>일식</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>오마카세</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>프리미엄</span>
                                </div>
                                <div className={styles["availability-section"]}>
                                    <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                    <div className={styles["time-slots"]}>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>18:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>19:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>20:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["unavailable"]}`}>21:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 6 --> */}
                        <div className={styles["restaurant-card"]}>
                            <div className={styles["card-image"]}>
                                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop" alt="비스트로 파리" />
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
                                <h3 className={styles["restaurant-name"]}>비스트로 파리</h3>
                                <div className={styles["restaurant-info"]}>
                                    <div className={styles["rating"]}>
                                        <span className={styles["star"]}>⭐</span>
                                        <span className={styles["score"]}>4.4</span>
                                        <span className={styles["reviews"]}>(734)</span>
                                    </div>
                                    <div className={styles["location"]}>
                                        <span>📍</span>
                                        <span>종로구 인사동 • 내 위치에서 3.2km</span>
                                    </div>
                                </div>
                                <div className={styles["restaurant-tags"]}>
                                    <span className={`${styles["tag"]} ${styles["cuisine"]}`}>프렌치</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>비스트로</span>
                                    <span className={`${styles["tag"]} ${styles["feature"]}`}>와인</span>
                                </div>
                                <div className={styles["availability-section"]}>
                                    <div className={styles["availability-title"]}>오늘 예약 가능 시간</div>
                                    <div className={styles["time-slots"]}>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>18:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>19:30</span>
                                        <span className={`${styles["time-slot"]} ${styles["full"]}`}>20:00</span>
                                        <span className={`${styles["time-slot"]} ${styles["available"]}`}>21:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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