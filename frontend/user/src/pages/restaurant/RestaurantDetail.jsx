import { useState } from "react"
import Header from "../../components/header/Header"
import './RestaurantDetail.css'

export default function RestaurantList(){

    const [date, setDate] = useState("2025-09-03"); // 초기 날짜 설정
    const [reservationType, setReservationType] = useState("reservation"); //예약, 웨이팅
    const [activeTab, setActiveTab] = useState("menu"); //상세설명, 메뉴 소개
    const [guest, setGuest] = useState(2); //인원 수

    const increment =()=> setGuest(guest => guest + 1);
    const decrement =()=> setGuest(guest => guest>1 ? guest-1 : 1);
    


    return(
        <>
            {/* <!-- Header --> */}
            <Header/>

    <div className="main-container">
        {/* <!-- Main Content --> */}
        <div className="main-content">
            {/* <!-- Image Gallery --> */}
             <div className="image-gallery">
                🍣 레스토랑 이미지
                <div className="gallery-nav">1/5</div>
                <div className="image-thumbs">
                    <div className="thumb active"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                    <div className="thumb"></div>
                </div>
            </div>

            {/* <!-- Restaurant Info --> */}
            <div className="restaurant-header">
                <h1 className="restaurant-title">정미스시</h1>
                <div className="restaurant-meta">
                    <div className="rating">
                        <span className="stars">⭐⭐⭐⭐</span>
                        <span className="rating-score">4.8</span>
                        <span className="review-count">리뷰 386개</span>
                    </div>
                    <span className="cuisine-type">일식 • 스시/사시미</span>
                </div>
                <div className="restaurant-address">
                    <span className="address-icon">📍</span>
                    <div>
                        <div>서울 강남구 압구정로 464-41</div>
                    </div>
                </div>
                <div className="operating-hours">
                    <span>🕐</span>
                    <span>영업 중 (오늘 오후 11:00에 영업종료)</span>
                </div>
            </div>

            {/* <!-- Navigation Tabs --> */}
            <div className="nav-tabs">
                <div className={`nav-tab ${activeTab === 'menu' ?  'active' : ''}`}
                onClick={()=>setActiveTab('menu')}>메뉴소개</div>
                <div className={`nav-tab ${activeTab === 'location' ?  'active' : ''}`}
                onClick={()=>setActiveTab('location')}>위치</div>
                <div className={`nav-tab ${activeTab === 'facilities' ?  'active' : ''}`}
                onClick={()=>setActiveTab('facilities')}>편의시설</div>
                <div className={`nav-tab ${activeTab === 'info' ?  'active' : ''}`}
                onClick={()=>setActiveTab('info')}>운영정보</div>
                <div className={`nav-tab ${activeTab === 'reviews' ?  'active' : ''}`}
                onClick={()=>setActiveTab('reviews')}>리뷰</div>
            </div>

            {/* <!-- Tab Content --> */}
            <div className="tab-content">
                {/* <!-- Menu Tab --> */}
                <div className={`tab-panel ${activeTab === 'menu' ? 'active' : ''}`} id="menu">
                    <div className="section-title">메뉴 소개</div>
                    <div className="description">
                        정통적인 일식을 기본으로 독창적인 스타일의 오마카세입니다.<br/>
                        명장님의 다년간의 노하우를 통해 최상의 식재료로 표현되는 <br/>
                        일식 요리로 재료 본래의 진정한 맛을 느껴보실 수 있습니다.
                    </div>

                    <div className="menu-items">
                        <div className="menu-item">
                            <div className="menu-image">🍣</div>
                            <div className="menu-info">
                                <div className="menu-name">산삼녹용달인 간장왕갑계치킨식</div>
                                <div className="menu-description">산삼과 녹용이 들어간 특별한 간장왕갑계치킨식</div>
                                <div className="menu-price">33,000원</div>
                            </div>
                        </div>

                        <div className="menu-item">
                            <div className="menu-image">🦀</div>
                            <div className="menu-info">
                                <div className="menu-name">국내산 암넘 꽃게장정식</div>
                                <div className="menu-description">국내산 암넘 꽃게장정식</div>
                                <div className="menu-price">33,000원</div>
                            </div>
                        </div>

                        <div className="menu-item">
                            <div className="menu-image">🥘</div>
                            <div className="menu-info">
                                <div className="menu-name">어수꽃게탕</div>
                                <div className="menu-description">신선한 꽃게가 들어간 시원한 국물 요리</div>
                                <div className="menu-price">23,000원</div>
                            </div>
                        </div>

                        <div className="menu-item">
                            <div className="menu-image">🦐</div>
                            <div className="menu-info">
                                <div className="menu-name">어수 갈치조림100%국산+계장정식1인</div>
                                <div className="menu-description">국산 먹갈치와 간장계란, 양념계란이 함께 나오는 먹성비 정식!</div>
                                <div className="menu-price">22,000원</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Location Tab --> */}
                <div className={`tab-panel ${activeTab === 'location' ? 'active' : ''}`} id="location">
                    <div className="section-title">위치</div>
                    <div className="map-container">
                        🗺️ 지도가 여기에 표시됩니다
                    </div>
                    <div className="location-details">
                        <div className="location-item">
                            <span className="location-label">주소</span>
                            <span className="location-value">서울 강남구 압구정로 464-41</span>
                        </div>
                    </div>
                </div>

                {/* <!-- Facilities Tab --> */}
                <div className={`tab-panel ${activeTab === 'facilities' ? 'active' : ''}`} id="facilities">
                    <div className="section-title">편의시설</div>
                    <div className="facilities-grid">
                        <div className="facility-item">
                            <div className="facility-icon">🚗</div>
                            <div className="facility-name">발렛파킹</div>
                            <div className="facility-description">무료 발렛파킹 서비스 제공</div>
                        </div>
                        <div className="facility-item">
                            <div className="facility-icon">♿</div>
                            <div className="facility-name">휠체어 접근</div>
                            <div className="facility-description">휠체어 이용 가능</div>
                        </div>
                        <div className="facility-item">
                            <div className="facility-icon">🍷</div>
                            <div className="facility-name">주류 판매</div>
                            <div className="facility-description">다양한 주류 판매</div>
                        </div>
                        <div className="facility-item">
                            <div className="facility-icon">📶</div>
                            <div className="facility-name">무료 WiFi</div>
                            <div className="facility-description">고속 무료 인터넷</div>
                        </div>
                        <div className="facility-item">
                            <div className="facility-icon">🎂</div>
                            <div className="facility-name">기념일 서비스</div>
                            <div className="facility-description">생일, 기념일 케이크 서비스</div>
                        </div>
                        <div className="facility-item">
                            <div className="facility-icon">👥</div>
                            <div className="facility-name">단체석</div>
                            <div className="facility-description">10인 이상 단체 이용 가능</div>
                        </div>
                    </div>
                </div>

                {/* <!-- Operating Info Tab --> */}
                <div className={`tab-panel ${activeTab === 'info' ? 'active' : ''}`} id="info">
                    <div className="section-title">운영정보</div>
                    <div className="operating-info">
                        <div className="info-item">
                            <span className="info-label">영업시간</span>
                            <span className="info-value">매일 17:30 - 23:00 (라스트오더 22:00)</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">휴무일</span>
                            <span className="info-value">연중무휴</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">전화번호</span>
                            <span className="info-value">02-3446-8822</span>
                        </div>
                    </div>
                </div>

                {/* <!-- Reviews Tab --> */}
                <div className={`tab-panel ${activeTab === 'reviews' ? 'active' : ''}`} id="reviews">
                    <div className="section-title">리뷰</div>
                    <div className="review-summary">
                        <div className="review-score">4.8</div>
                        <div className="review-total">총 386개의 리뷰</div>
                        <div className="review-breakdown">
                            <div className="breakdown-item">
                                <div className="breakdown-label">5점</div>
                                <div className="breakdown-score">45명</div>
                            </div>
                            <div className="breakdown-item">
                                <div className="breakdown-label">4점</div>
                                <div className="breakdown-score">4명</div>
                            </div>
                            <div className="breakdown-item">
                                <div className="breakdown-label">3점</div>
                                <div className="breakdown-score">42명</div>
                            </div>
                            <div className="breakdown-item">
                                <div className="breakdown-label">2점</div>
                                <div className="breakdown-score">4234명</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="individual-review">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">김</div>
                                <div>
                                    <div className="reviewer-name">김**님</div>
                                    <div className="review-date">2025.08.28</div>
                                </div>
                            </div>
                            <div className="review-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="review-text">
                            정말 최고의 오마카세였습니다! 셰프님의 정성이 느껴지는 요리 하나하나가 예술 작품 같았어요. 
                            특히 참치 뱃살은 입에서 녹는 느낌이었고, 성게도 정말 신선했습니다. 
                            분위기도 조용하고 고급스러워서 특별한 날에 가기 딱 좋은 곳이에요. 다음에도 꼭 방문하겠습니다!
                        </div>
                    </div>

                    <div className="individual-review">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">이</div>
                                <div>
                                    <div className="reviewer-name">이**님</div>
                                    <div className="review-date">2025.08.25</div>
                                </div>
                            </div>
                            <div className="review-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="review-text">
                            생일 기념으로 방문했는데 정말 만족스러웠어요. 
                            스시 하나하나가 완벽했고, 셰프님께서 직접 설명해주시는 것도 좋았습니다. 
                            가격대가 있지만 그만한 가치가 충분한 곳입니다. 예약은 필수예요!
                        </div>
                    </div>

                    <div className="individual-review">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">박</div>
                                <div>
                                    <div className="reviewer-name">박**님</div>
                                    <div className="review-date">2025.08.22</div>
                                </div>
                            </div>
                            <div className="review-rating">⭐⭐⭐⭐</div>
                        </div>
                        <div className="review-text">
                            음식은 정말 훌륭했지만 조금 비싸다는 느낌이 들었어요. 
                            그래도 신선한 재료와 섬세한 손길이 느껴지는 요리였습니다. 
                            서비스도 친절했고, 압구정역에서 가깝다는 것도 장점이네요.
                        </div>
                    </div>

                    <div className="individual-review">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">최</div>
                                <div>
                                    <div className="reviewer-name">최**님</div>
                                    <div className="review-date">2025.08.20</div>
                                </div>
                            </div>
                            <div className="review-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="review-text">
                            회사 회식으로 방문했는데 모든 직원들이 만족했어요. 
                            특히 갈치조림이 정말 맛있었고, 꽃게장도 짜지 않고 딱 좋았습니다. 
                            단체 예약도 가능해서 좋았어요. 추천합니다!
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* <!-- Sidebar --> */}
        <div className="sidebar">
            {/* <!-- Reservation Card --> */}
            <div className="reservation-card">
                {/* <!-- Toggle Switch --> */}
                <div className="toggle-container">
                    <div className={`toggle-option ${reservationType === 'reservation' ? 'active' : ''}`}
                     onClick={()=>setReservationType('reservation')}>예약하기</div>
                    <div className={`toggle-option ${reservationType === 'waiting' ? 'active' : ''}`}
                    onClick={()=>setReservationType('waiting')}>웨이팅하기</div>
                </div>

                {/* <!-- Reservation Content --> */}
                <div className={`reservation-content ${reservationType === 'reservation' ? 'active' : ''}`}>
                    <div className="date-time-selector">
                        <div className="selector-group">
                            <label className="selector-label">날짜</label>
                            <input type="date" className="selector-input" value={date}  onChange={(e) => setDate(e.target.value)} />
                        </div>
                        
                        <div className="selector-group">
                            <label className="selector-label">인원</label>
                            <div className="guest-counter">
                                <span>성인</span>
                                <div className="counter-controls">
                                    <button className="counter-btn" onClick={decrement}>-</button>
                                    <span className="guest-count">{guest}</span>
                                    <button className="counter-btn" onClick={increment}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="available-times">
                        <div className="time-slot disabled">17:30</div>
                        <div className="time-slot">18:00</div>
                        <div className="time-slot selected">19:00</div>
                        <div className="time-slot">19:30</div>
                        <div className="time-slot">20:00</div>
                        <div className="time-slot disabled">20:30</div>
                    </div>

                    <button className="reservation-btn" onClick={()=>location.href='/html/table.html'}>예약하기</button>
                </div>

                {/* <!-- Waiting Content --> */}
                <div className={`waiting-content ${reservationType === 'waiting' ? 'active' : ''}`}>
                    <div className="waiting-info">
                        <div className="waiting-status">현재 웨이팅 5팀</div>
                    </div>
 
                    <div className="date-time-selector">                    
                        <div className="selector-group">
                            <label className="selector-label">인원</label>
                            <div className="guest-counter">
                                <span>성인</span>
                                <div className="counter-controls">
                                    <button className="counter-btn" onClick={decrement}>-</button>
                                    <span className="guest-count">{guest}</span>
                                    <button className="counter-btn" onClick={increment}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="reservation-btn">웨이팅 등록</button>
                </div>
            </div>
        </div>
    </div>

        </>
    )
}