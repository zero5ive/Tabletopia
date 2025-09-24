import { useState } from "react";
import Header from "../../components/header/Header";
import styles from './RestaurantDetail.module.css';
import axios from 'axios';

export default function RestaurantList() {

    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
    const today = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(today); // 초기 날짜를 오늘로 설정
    const [reservationType, setReservationType] = useState("reservation"); //예약, 웨이팅
    const [activeTab, setActiveTab] = useState("menu"); //상세설명, 메뉴 소개
    const [guest, setGuest] = useState(1); //인원 수
    const [selectedTime, setSelectedTime] = useState(""); // 선택된 시간

    const increment = () => setGuest(guest => guest + 1);
    const decrement = () => setGuest(guest => guest > 1 ? guest - 1 : 1);

    /**
     * 날짜 변경 핸들러
     * 날짜가 변경되면 선택된 시간을 초기화
     * 
     * @param {Event} e - 날짜 입력 이벤트
     * @author 김예진
     * @since 2025-09-23
     */
    const handleDateChange = (e) => {
        setDate(e.target.value);
        setSelectedTime(""); // 날짜 변경 시 선택된 시간 초기화
    };
    /*
     * 이미 선택된 시간을 다시 클릭하면 선택 취소, 새로운 시간 클릭하면 해당 시간 선택
     * 
     * @param {string} time - 선택할 시간 (예: "18:00")
     * @author 김예진
     * @since 2025-09-23
     */
    const handleTimeSlotClick = (time) => {
        if (selectedTime === time) {
            // 이미 선택된 시간을 다시 클릭하면 선택 취소
            setSelectedTime("");
        } else {
            // 새로운 시간 선택
            setSelectedTime(time);
        }
    };

    /**
     * 예약하기 버튼 클릭 핸들러
     * 선택된 날짜, 인원 수, 시간을 로컬 스토리지에 임시 저장 후 테이블 선택 페이지로 이동
     * 
     * @author 김예진
     * @since 2025-09-23
     */
    const handleReservation = () => {
        if (!selectedTime) {
            alert("시간을 선택해주세요.");
            return;
        }

        // 예약 1차 정보
        const reservationStep1 = {
            restaurantId: 1,
            date: date,
            time: selectedTime,
            guestCount: guest,
            reservationType: reservationType
        };

        // 로컬 스토리지에 정보를 저장
        localStorage.setItem('reservationStep1', JSON.stringify(reservationStep1));

        // 팝업창으로 테이블 선택 열기
        window.open(
            '/reservations/table',
            'reservationPopup', // 창 이름
            'width=1200,height=650,left=200,top=100,resizable=yes,scrollbars=yes'
        );
    };

    return (
        <>

            <div className={styles["main-container"]}>
                {/* <!-- Main Content --> */}
                <div className={styles["main-content"]}>
                    {/* <!-- Image Gallery --> */}
                    <div className={styles["image-gallery"]}>
                        🍣 레스토랑 이미지
                        <div className={styles["gallery-nav"]}>1/5</div>
                        <div className={styles["image-thumbs"]}>
                            <div className={`${styles["thumb"]} ${styles["active"]}`}></div>
                            <div className={styles["thumb"]}></div>
                            <div className={styles["thumb"]}></div>
                            <div className={styles["thumb"]}></div>
                            <div className={styles["thumb"]}></div>
                        </div>
                    </div>

                    {/* <!-- Restaurant Info --> */}
                    <div className={styles["restaurant-header"]}>
                        <h1 className={styles["restaurant-title"]}>정미스시</h1>
                        <div className={styles["restaurant-meta"]}>
                            <div className={styles["rating"]}>
                                <span className={styles["stars"]}>⭐⭐⭐⭐</span>
                                <span className={styles["rating-score"]}>4.8</span>
                                <span className={styles["review-count"]}>리뷰 386개</span>
                            </div>
                            <span className={styles["cuisine-type"]}>일식 • 스시/사시미</span>
                        </div>
                        <div className={styles["restaurant-address"]}>
                            <span className={styles["address-icon"]}>📍</span>
                            <div>
                                <div>서울 강남구 압구정로 464-41</div>
                            </div>
                        </div>
                        <div className={styles["operating-hours"]}>
                            <span>🕐</span>
                            <span>영업 중 (오늘 오후 11:00에 영업종료)</span>
                        </div>
                    </div>

                    {/* <!-- Navigation Tabs --> */}
                    <div className={styles["nav-tabs"]}>
                        <div className={`${styles["nav-tab"]} ${activeTab === 'menu' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('menu')}>메뉴소개</div>
                        <div className={`${styles["nav-tab"]} ${activeTab === 'location' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('location')}>위치</div>
                        <div className={`${styles["nav-tab"]} ${activeTab === 'facilities' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('facilities')}>편의시설</div>
                        <div className={`${styles["nav-tab"]} ${activeTab === 'info' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('info')}>운영정보</div>
                        <div className={`${styles["nav-tab"]} ${activeTab === 'reviews' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('reviews')}>리뷰</div>
                    </div>

                    {/* <!-- Tab Content --> */}
                    <div className={styles["tab-content"]}>
                        {/* <!-- Menu Tab --> */}
                        <div className={`${styles["tab-panel"]} ${activeTab === 'menu' ? styles['active'] : ''}`} id="menu">
                            <div className={styles["section-title"]}>메뉴 소개</div>
                            <div className={styles["description"]}>
                                정통적인 일식을 기본으로 독창적인 스타일의 오마카세입니다.<br />
                                명장님의 다년간의 노하우를 통해 최상의 식재료로 표현되는 <br />
                                일식 요리로 재료 본래의 진정한 맛을 느껴보실 수 있습니다.
                            </div>

                            <div className={styles["menu-items"]}>
                                <div className={styles["menu-item"]}>
                                    <div className={styles["menu-image"]}>🍣</div>
                                    <div className={styles["menu-info"]}>
                                        <div className={styles["menu-name"]}>산삼녹용달인 간장왕갑계치킨식</div>
                                        <div className={styles["menu-description"]}>산삼과 녹용이 들어간 특별한 간장왕갑계치킨식</div>
                                        <div className={styles["menu-price"]}>33,000원</div>
                                    </div>
                                </div>

                                <div className={styles["menu-item"]}>
                                    <div className={styles["menu-image"]}>🦀</div>
                                    <div className={styles["menu-info"]}>
                                        <div className={styles["menu-name"]}>국내산 암넘 꽃게장정식</div>
                                        <div className={styles["menu-description"]}>국내산 암넘 꽃게장정식</div>
                                        <div className={styles["menu-price"]}>33,000원</div>
                                    </div>
                                </div>

                                <div className={styles["menu-item"]}>
                                    <div className={styles["menu-image"]}>🥘</div>
                                    <div className={styles["menu-info"]}>
                                        <div className={styles["menu-name"]}>어수꽃게탕</div>
                                        <div className={styles["menu-description"]}>신선한 꽃게가 들어간 시원한 국물 요리</div>
                                        <div className={styles["menu-price"]}>23,000원</div>
                                    </div>
                                </div>

                                <div className={styles["menu-item"]}>
                                    <div className={styles["menu-image"]}>🦐</div>
                                    <div className={styles["menu-info"]}>
                                        <div className={styles["menu-name"]}>어수 갈치조림100%국산+계장정식1인</div>
                                        <div className={styles["menu-description"]}>국산 먹갈치와 간장계란, 양념계란이 함께 나오는 먹성비 정식!</div>
                                        <div className={styles["menu-price"]}>22,000원</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Location Tab --> */}
                        <div className={`${styles["tab-panel"]} ${activeTab === 'location' ? styles['active'] : ''}`} id="location">
                            <div className={styles["section-title"]}>위치</div>
                            <div className={styles["map-container"]}>
                                🗺️ 지도가 여기에 표시됩니다
                            </div>
                            <div className={styles["location-details"]}>
                                <div className={styles["location-item"]}>
                                    <span className={styles["location-label"]}>주소</span>
                                    <span className={styles["location-value"]}>서울 강남구 압구정로 464-41</span>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Facilities Tab --> */}
                        <div className={`${styles["tab-panel"]} ${activeTab === 'facilities' ? styles['active'] : ''}`} id="facilities">
                            <div className={styles["section-title"]}>편의시설</div>
                            <div className={styles["facilities-grid"]}>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>🚗</div>
                                    <div className={styles["facility-name"]}>발렛파킹</div>
                                    <div className={styles["facility-description"]}>무료 발렛파킹 서비스 제공</div>
                                </div>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>♿</div>
                                    <div className={styles["facility-name"]}>휠체어 접근</div>
                                    <div className={styles["facility-description"]}>휠체어 이용 가능</div>
                                </div>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>🍷</div>
                                    <div className={styles["facility-name"]}>주류 판매</div>
                                    <div className={styles["facility-description"]}>다양한 주류 판매</div>
                                </div>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>📶</div>
                                    <div className={styles["facility-name"]}>무료 WiFi</div>
                                    <div className={styles["facility-description"]}>고속 무료 인터넷</div>
                                </div>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>🎂</div>
                                    <div className={styles["facility-name"]}>기념일 서비스</div>
                                    <div className={styles["facility-description"]}>생일, 기념일 케이크 서비스</div>
                                </div>
                                <div className={styles["facility-item"]}>
                                    <div className={styles["facility-icon"]}>👥</div>
                                    <div className={styles["facility-name"]}>단체석</div>
                                    <div className={styles["facility-description"]}>10인 이상 단체 이용 가능</div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Operating Info Tab --> */}
                        <div className={`${styles["tab-panel"]} ${activeTab === 'info' ? styles['active'] : ''}`} id="info">
                            <div className={styles["section-title"]}>운영정보</div>
                            <div className={styles["operating-info"]}>
                                <div className={styles["info-item"]}>
                                    <span className={styles["info-label"]}>영업시간</span>
                                    <span className={styles["info-value"]}>매일 17:30 - 23:00 (라스트오더 22:00)</span>
                                </div>
                                <div className={styles["info-item"]}>
                                    <span className={styles["info-label"]}>휴무일</span>
                                    <span className={styles["info-value"]}>연중무휴</span>
                                </div>
                                <div className={styles["info-item"]}>
                                    <span className={styles["info-label"]}>전화번호</span>
                                    <span className={styles["info-value"]}>02-3446-8822</span>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Reviews Tab --> */}
                        <div className={`${styles["tab-panel"]} ${activeTab === 'reviews' ? styles['active'] : ''}`} id="reviews">
                            <div className={styles["section-title"]}>리뷰</div>
                            <div className={styles["review-summary"]}>
                                <div className={styles["review-score"]}>4.8</div>
                                <div className={styles["review-total"]}>총 386개의 리뷰</div>
                                <div className={styles["review-breakdown"]}>
                                    <div className={styles["breakdown-item"]}>
                                        <div className={styles["breakdown-label"]}>5점</div>
                                        <div className={styles["breakdown-score"]}>45명</div>
                                    </div>
                                    <div className={styles["breakdown-item"]}>
                                        <div className={styles["breakdown-label"]}>4점</div>
                                        <div className={styles["breakdown-score"]}>4명</div>
                                    </div>
                                    <div className={styles["breakdown-item"]}>
                                        <div className={styles["breakdown-label"]}>3점</div>
                                        <div className={styles["breakdown-score"]}>42명</div>
                                    </div>
                                    <div className={styles["breakdown-item"]}>
                                        <div className={styles["breakdown-label"]}>2점</div>
                                        <div className={styles["breakdown-score"]}>4234명</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles["individual-review"]}>
                                <div className={styles["review-header"]}>
                                    <div className={styles["reviewer-info"]}>
                                        <div className={styles["reviewer-avatar"]}>김</div>
                                        <div>
                                            <div className={styles["reviewer-name"]}>김**님</div>
                                            <div className={styles["review-date"]}>2025.08.28</div>
                                        </div>
                                    </div>
                                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                                </div>
                                <div className={styles["review-text"]}>
                                    정말 최고의 오마카세였습니다! 셰프님의 정성이 느껴지는 요리 하나하나가 예술 작품 같았어요.
                                    특히 참치 뱃살은 입에서 녹는 느낌이었고, 성게도 정말 신선했습니다.
                                    분위기도 조용하고 고급스러워서 특별한 날에 가기 딱 좋은 곳이에요. 다음에도 꼭 방문하겠습니다!
                                </div>
                            </div>

                            <div className={styles["individual-review"]}>
                                <div className={styles["review-header"]}>
                                    <div className={styles["reviewer-info"]}>
                                        <div className={styles["reviewer-avatar"]}>이</div>
                                        <div>
                                            <div className={styles["reviewer-name"]}>이**님</div>
                                            <div className={styles["review-date"]}>2025.08.25</div>
                                        </div>
                                    </div>
                                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                                </div>
                                <div className={styles["review-text"]}>
                                    생일 기념으로 방문했는데 정말 만족스러웠어요.
                                    스시 하나하나가 완벽했고, 셰프님께서 직접 설명해주시는 것도 좋았습니다.
                                    가격대가 있지만 그만한 가치가 충분한 곳입니다. 예약은 필수예요!
                                </div>
                            </div>

                            <div className={styles["individual-review"]}>
                                <div className={styles["review-header"]}>
                                    <div className={styles["reviewer-info"]}>
                                        <div className={styles["reviewer-avatar"]}>박</div>
                                        <div>
                                            <div className={styles["reviewer-name"]}>박**님</div>
                                            <div className={styles["review-date"]}>2025.08.22</div>
                                        </div>
                                    </div>
                                    <div className={styles["review-rating"]}>⭐⭐⭐⭐</div>
                                </div>
                                <div className={styles["review-text"]}>
                                    음식은 정말 훌륭했지만 조금 비싸다는 느낌이 들었어요.
                                    그래도 신선한 재료와 섬세한 손길이 느껴지는 요리였습니다.
                                    서비스도 친절했고, 압구정역에서 가깝다는 것도 장점이네요.
                                </div>
                            </div>

                            <div className={styles["individual-review"]}>
                                <div className={styles["review-header"]}>
                                    <div className={styles["reviewer-info"]}>
                                        <div className={styles["reviewer-avatar"]}>최</div>
                                        <div>
                                            <div className={styles["reviewer-name"]}>최**님</div>
                                            <div className={styles["review-date"]}>2025.08.20</div>
                                        </div>
                                    </div>
                                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                                </div>
                                <div className={styles["review-text"]}>
                                    회사 회식으로 방문했는데 모든 직원들이 만족했어요.
                                    특히 갈치조림이 정말 맛있었고, 꽃게장도 짜지 않고 딱 좋았습니다.
                                    단체 예약도 가능해서 좋았어요. 추천합니다!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Sidebar --> */}
                <div className={styles["sidebar"]}>
                    {/* <!-- Reservation Card --> */}
                    <div className={styles["reservation-card"]}>
                        {/* <!-- Toggle Switch --> */}
                        <div className={styles["toggle-container"]}>
                            <div className={`${styles["toggle-option"]} ${reservationType === 'reservation' ? styles['active'] : ''}`}
                                onClick={() => setReservationType('reservation')}>예약하기</div>
                            <div className={`${styles["toggle-option"]} ${reservationType === 'waiting' ? styles['active'] : ''}`}
                                onClick={() => setReservationType('waiting')}>웨이팅하기</div>
                        </div>

                        {/* <!-- Reservation Content --> */}
                        <div className={`${styles["reservation-content"]} ${reservationType === 'reservation' ? styles['active'] : ''}`}>
                            <div className={styles["date-time-selector"]}>
                                <div className={styles["selector-group"]}>
                                    <label className={styles["selector-label"]}>날짜</label>
                                    <input
                                        type="date"
                                        className={styles["selector-input"]}
                                        value={date}
                                        min={today} // 오늘 이전 날짜 선택 불가
                                        onChange={handleDateChange}
                                    />
                                </div>

                                <div className={styles["selector-group"]}>
                                    <label className={styles["selector-label"]}>인원</label>
                                    <div className={styles["guest-counter"]}>
                                        <span>성인</span>
                                        <div className={styles["counter-controls"]}>
                                            <button className={styles["counter-btn"]} onClick={decrement}>-</button>
                                            <span className={styles["guest-count"]}>{guest}</span>
                                            <button className={styles["counter-btn"]} onClick={increment}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles["available-times"]}>
                                <div
                                    className={`${styles["time-slot"]} ${styles["disabled"]}`}
                                >
                                    17:30
                                </div>
                                <div
                                    className={`${styles["time-slot"]} ${selectedTime === '18:00' ? styles['selected'] : ''}`}
                                    onClick={() => handleTimeSlotClick('18:00')}
                                 >
                                    18:00
                                </div>
                                <div
                                    className={`${styles["time-slot"]} ${selectedTime === '19:00' ? styles['selected'] : ''}`}
                                    onClick={() => handleTimeSlotClick('19:00')}
                                >
                                    19:00
                                </div>
                                <div
                                    className={`${styles["time-slot"]} ${selectedTime === '19:30' ? styles['selected'] : ''}`}
                                    onClick={() => handleTimeSlotClick('19:30')}
                                >
                                    19:30
                                </div>
                                <div
                                    className={`${styles["time-slot"]} ${selectedTime === '20:00' ? styles['selected'] : ''}`}
                                    onClick={() => handleTimeSlotClick('20:00')}
                                >
                                    20:00
                                </div>
                                <div
                                    className={`${styles["time-slot"]} ${styles["disabled"]}`}
                                >
                                    20:30
                                </div>
                            </div>

                            <button className={styles["reservation-btn"]} onClick={handleReservation}>예약하기</button>
                        </div>

                        {/* <!-- Waiting Content --> */}
                        <div className={`${styles["waiting-content"]} ${reservationType === 'waiting' ? styles['active'] : ''}`}>
                            <div className={styles["waiting-info"]}>
                                <div className={styles["waiting-status"]}>현재 웨이팅 5팀</div>
                            </div>

                            <div className={styles["date-time-selector"]}>
                                <div className={styles["selector-group"]}>
                                    <label className={styles["selector-label"]}>인원</label>
                                    <div className={styles["guest-counter"]}>
                                        <span>성인</span>
                                        <div className={styles["counter-controls"]}>
                                            <button className={styles["counter-btn"]} onClick={decrement}>-</button>
                                            <span className={styles["guest-count"]}>{guest}</span>
                                            <button className={styles["counter-btn"]} onClick={increment}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className={styles["reservation-btn"]}>웨이팅 등록</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}