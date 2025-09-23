import Header from "../../components/header/Header"
import './RestaurantList.css'

export default function RestaurantList() {
    return (
        <>
            <main className="main-content">
                <div className="container">
                    <div className="search-section">
                        <div className="search-bar">
                            <input type="text" className="search-input" placeholder="매장명, 지역, 음식 종류를 검색해보세요" />
                            <button className="search-btn">🔍 검색</button>
                        </div>

                        <div className="filter-section">
                            <div className="filter-group">
                                <span className="filter-label">지역</span>
                                <select className="filter-select">
                                    <option>전체</option>
                                    <option>강남구</option>
                                    <option>서초구</option>
                                    <option>중구</option>
                                    <option>종로구</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <span className="filter-label">음식</span>
                                <select className="filter-select">
                                    <option>전체</option>
                                    <option>한식</option>
                                    <option>일식</option>
                                    <option>중식</option>
                                    <option>양식</option>
                                </select>
                            </div>

                            {/* <button className="filter-btn active">내 주변</button>  */}
                            {/* <button className="filter-btn">즉시 예약</button>  */}
                            {/* <button className="filter-btn">평점 높은 순</button> */}
                            {/* <button className="filter-btn">가격대</button>  */}
                        </div>
                    </div>

                    <div className="results-header">
                        <div className="results-info">
                            총 <span className="count">127</span>개의 레스토랑을 찾았습니다
                        </div>
                        <div className="sort-options">
                            <button className="sort-btn active">추천순</button>
                            <button className="sort-btn">평점순</button>
                            <button className="sort-btn">리뷰많은순</button>
                        </div>
                    </div>


                    <div className="restaurant-grid">
                        {/* <!-- 레스토랑 카드 1 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop" alt="소시센몬" />
                                <button className="bookmark-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    <span className="info-badge">예약가능</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">소시센몬</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.7</span>
                                        <span className="reviews">(1,016)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>선릉 • 소시오마케</span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">음식카테고리</span>
                                    <span className="tag feature">여기에 편의시설 항목들</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot unavailable">8.14 (화)</span>
                                        <span className="time-slot available">8.15 (수)</span>
                                        <span className="time-slot available">8.16 (목)</span>
                                        <span className="time-slot full">8.17 (금)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 2 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop" alt="더 스테이크 하우스" />
                                <button className="bookmark-btn active">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    <span className="info-badge">웨이팅 가능</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">더 스테이크 하우스</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.5</span>
                                        <span className="reviews">(842)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>강남구 청담동 </span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">양식</span>
                                    <span className="tag feature">스테이크</span>
                                    <span className="tag feature">와인바</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot available">18:00</span>
                                        <span className="time-slot available">19:30</span>
                                        <span className="time-slot full">20:00</span>
                                        <span className="time-slot available">21:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 3 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop" alt="이타리아노 파스타" />
                                <button className="bookmark-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    {/* <!-- <span className="info-badge">즉시 예약</span> --> */}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">이타리아노 파스타</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.3</span>
                                        <span className="reviews">(567)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>서초구 서초동</span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">이탈리안</span>
                                    <span className="tag feature">파스타</span>
                                    <span className="tag feature">피자</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot available">17:30</span>
                                        <span className="time-slot available">18:30</span>
                                        <span className="time-slot available">19:00</span>
                                        <span className="time-slot available">20:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 4 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop" alt="한정식 궁중연" />
                                <button className="bookmark-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    <span className="info-badge">예약 필수</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">한정식 궁중연</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.8</span>
                                        <span className="reviews">(321)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>중구 명동 </span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">한식</span>
                                    <span className="tag feature">한정식</span>
                                    <span className="tag feature">개인실</span>
                                    <span className="tag feature">접대</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot full">12:00</span>
                                        <span className="time-slot available">18:00</span>
                                        <span className="time-slot full">19:00</span>
                                        <span className="time-slot available">20:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 5 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop" alt="스시 마사" />
                                <button className="bookmark-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    <span className="info-badge">오마카세</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">스시 마사</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.9</span>
                                        <span className="reviews">(189)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>강남구 신사동</span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">일식</span>
                                    <span className="tag feature">오마카세</span>
                                    <span className="tag feature">프리미엄</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot full">18:00</span>
                                        <span className="time-slot full">19:00</span>
                                        <span className="time-slot available">20:30</span>
                                        <span className="time-slot unavailable">21:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- 레스토랑 카드 6 --> */}
                        <div className="restaurant-card">
                            <div className="card-image">
                                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop" alt="비스트로 파리" />
                                <button className="bookmark-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </button>
                                <div className="quick-info">
                                    <span className="info-badge">영업중</span>
                                    <span className="info-badge">예약가능</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="restaurant-name">비스트로 파리</h3>
                                <div className="restaurant-info">
                                    <div className="rating">
                                        <span className="star">⭐</span>
                                        <span className="score">4.4</span>
                                        <span className="reviews">(734)</span>
                                    </div>
                                    <div className="location">
                                        <span>📍</span>
                                        <span>종로구 인사동 • 내 위치에서 3.2km</span>
                                    </div>
                                </div>
                                <div className="restaurant-tags">
                                    <span className="tag cuisine">프렌치</span>
                                    <span className="tag feature">비스트로</span>
                                    <span className="tag feature">와인</span>
                                </div>
                                <div className="availability-section">
                                    <div className="availability-title">오늘 예약 가능 시간</div>
                                    <div className="time-slots">
                                        <span className="time-slot available">18:30</span>
                                        <span className="time-slot available">19:30</span>
                                        <span className="time-slot full">20:00</span>
                                        <span className="time-slot available">21:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}