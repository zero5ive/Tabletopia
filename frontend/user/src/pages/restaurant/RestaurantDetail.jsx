import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import styles from './RestaurantDetail.module.css';
import axios from 'axios';
import Waiting from "./Waiting";
import MenuTab from "./tabs/MenuTab";
import LocationTab from "./tabs/LocationTab";
import FacilitiesTab from "./tabs/FacilitiesTab";
import OperatingInfoTab from "./tabs/OperatingInfoTab";
import ReviewsTab from "./tabs/ReviewsTab";
import { useLoadScript } from '@react-google-maps/api';
import { getRestaurantDetail } from "../utils/RestaurantApi";
import { useSearchParams } from 'react-router-dom';
import { getAvailableTimeSlots } from "../utils/OpeningHourApi";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function RestaurantList() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

    //레스토랑 상세페이지
    const [restaurantDetail, setRestaurantDetail] = useState(null);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // 선택된 이미지 인덱스

    const [effectiveHours, setEffectiveHours] = useState(null)
    const [timeSlots, setTimeSlots] = useState([]); // 예약 타임 슬롯

    const fetchRestaurantDetail = async (restaurantId) => {
        try {
            const response = await getRestaurantDetail(restaurantId);
            console.log('레스토랑 상세페이지 정보 ', response.data);
            setRestaurantDetail(response.data);
        } catch (error) {
            console.error('레스토랑 조회 실패:', error);
        }
    }

    /**
 * 영업시간으로부터 영업 상태 메시지 생성
 */
    const getOperatingStatus = (openingHours) => {
        if (!openingHours || openingHours === "영업시간 정보 없음") {
            return "영업시간 정보 없음";
        }

        if (openingHours === "휴무") {
            return "휴무";
        }

        // "11:00 - 22:00" 형식 파싱
        const [openTime, closeTime] = openingHours.split(' - ');

        if (!openTime || !closeTime) {
            return openingHours;
        }

        // 현재 시간
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // 영업 시간 파싱
        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        // 분을 포함한 시간 비교 (분 단위까지 계산)
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const openTotalMinutes = openHour * 60 + openMinute;
        const closeTotalMinutes = closeHour * 60 + closeMinute;

        // 영업 상태 판단
        if (currentTotalMinutes < openTotalMinutes) {
            return "영업 전";
        } else if (currentTotalMinutes >= closeTotalMinutes) {
            return "영업 종료";
        } else {
            // 영업 중 - 종료 시간 표시
            const amPm = closeHour < 12 ? "오전" : "오후";
            const displayHour = closeHour > 12 ? closeHour - 12 : (closeHour === 0 ? 12 : closeHour);
            return `영업 중 (오늘 ${amPm} ${displayHour}:${closeMinute.toString().padStart(2, '0')}에 영업종료)`;
        }
    };

    // 내일 날짜를 YYYY-MM-DD 형식으로 가져오기 (로컬 시간 기준)
    const getTomorrowLocal = () => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // 내일로 설정
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const tomorrow = getTomorrowLocal();

    const [date, setDate] = useState(tomorrow); // 초기 날짜를 내일로 설정

    /**
     * 초기 로드
     */
    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantDetail(restaurantId);
            fetchAvailableTimeSlots(restaurantId, tomorrow);
        }
    }, [restaurantId])

    // Google Maps API 로드
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });
    const [reservationType, setReservationType] = useState("reservation"); //예약, 웨이팅
    const [activeTab, setActiveTab] = useState("menu"); //상세설명, 메뉴 소개
    const [people, setPeople] = useState(1); //인원 수
    const [selectedTime, setSelectedTime] = useState(""); // 선택된 시간

    const increment = () => setPeople(people => people + 1);
    const decrement = () => setPeople(people => people > 1 ? people - 1 : 1);

    /**
     * 특정 날짜의 타임슬롯 예약 가능 여부 조회
     * 백엔드에서 운영시간 + 예약 상태를 통합해서 반환
     */
    const fetchAvailableTimeSlots = async (restaurantId, date) => {
        try {
            const response = await getAvailableTimeSlots(restaurantId, date);
            console.log('타임슬롯 예약 가능 여부:', response.data);

            const data = response.data.data; // ApiResponse 구조: { success, message, data }

            // 휴무일이거나 영업하지 않는 경우
            if (!data.isOpen || !data.timeSlots || data.timeSlots.length === 0) {
                setTimeSlots([]);
                setEffectiveHours({ isClosed: true });
                return;
            }

            // 모든 타임슬롯을 객체 형태로 저장 (예약 가능 여부 포함)
            const slots = data.timeSlots.map(slot => ({
                time: slot.time,
                isAvailable: slot.isAvailable,
                availableTableCount: slot.availableTableCount
            }));

            setTimeSlots(slots);

            // effectiveHours도 업데이트 (기존 로직 호환용)
            setEffectiveHours({
                isClosed: false,
                openTime: data.openTime,
                closeTime: data.closeTime,
                reservationInterval: data.reservationInterval
            });
        } catch (error) {
            console.error('타임슬롯 조회 실패:', error);
            setTimeSlots([]);
            setEffectiveHours({ isClosed: true });
        }
    }


    /**
     * 날짜 변경 핸들러
     * 날짜가 변경되면 선택된 시간을 초기화하고 해당 날짜의 타임슬롯을 조회
     *
     * @param {Event} e - 날짜 입력 이벤트
     * @author 김예진
     * @since 2025-09-23
     */
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        setSelectedTime(""); // 날짜 변경 시 선택된 시간 초기화
        fetchAvailableTimeSlots(restaurantId, newDate); // 선택된 날짜의 타임슬롯 조회
    };
    /*
     * 이미 선택된 시간을 다시 클릭하면 선택 취소, 새로운 시간 클릭하면 해당 시간 선택
     *
     * @param {object} slot - 타임슬롯 객체 { time, isAvailable }
     * @author 김예진
     * @since 2025-09-23
     */
    const handleTimeSlotClick = (slot) => {
        // 예약 불가능한 슬롯이면 클릭 무시
        if (!slot.isAvailable) {
            return;
        }

        if (selectedTime === slot.time) {
            // 이미 선택된 시간을 다시 클릭하면 선택 취소
            setSelectedTime("");
        } else {
            // 새로운 시간 선택
            setSelectedTime(slot.time);
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
            restaurantId: restaurantId,
            restaurantName: restaurantDetail.name,
            restaurantAddress: restaurantDetail.address,
            restaurantPhone: restaurantDetail.tel,
            date: date,
            time: selectedTime,
            peopleCount: people
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

    // Google Maps 로딩 중이거나 에러 발생 시 처리
    if (loadError) return <div>Google Maps 로드 중 오류가 발생했습니다.</div>;
    if (!isLoaded) return <div>Google Maps 로딩 중...</div>;
    if (!restaurantDetail) return <div>상세페이지 로딩 중...</div>

    return (
        <div className={styles["main-container"]}>
            {/* <!-- Main Content --> */}
            <div className={styles["main-content"]}>
                {/* <!-- Image Gallery --> */}
                <div className={styles["image-gallery"]}>
                    {/* 큰 대표 이미지 */}
                    <div className={styles["main-image"]}>
                        <img
                            src={restaurantDetail.imageUrls && restaurantDetail.imageUrls.length > 0 && restaurantDetail.imageUrls[selectedImageIndex]
                                ? `${API_BASE_URL}/uploads/restaurants/${restaurantDetail.imageUrls[selectedImageIndex]}`
                                : '/placeholder-restaurant.png'}
                            alt={`매장 이미지 ${selectedImageIndex + 1}`}
                        />

                        {/* 썸네일 이미지들 - 왼쪽 하단에 배치 */}
                        <div className={styles["thumbnail-container"]}>
                            {restaurantDetail.imageUrls && restaurantDetail.imageUrls.filter(url => url).map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className={`${styles["image-thumb"]} ${selectedImageIndex === index ? styles["active"] : ""}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img
                                        src={`${API_BASE_URL}/uploads/restaurants/${imageUrl}`}
                                        alt={`썸네일 ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* <!-- Restaurant Info --> */}
                <div className={styles["restaurant-header"]}>
                    <h1 className={styles["restaurant-title"]}>{restaurantDetail.name}</h1>
                    <div className={styles["restaurant-meta"]}>
                        <div className={styles["rating"]}>
                            <span className={styles["stars"]}>
                                {'⭐'.repeat(Math.round(restaurantDetail.averageRating))}
                            </span>
                            <span className={styles["review-count"]}>리뷰 {restaurantDetail.reviewCount} 개</span>
                        </div>
                        <span className={styles["cuisine-type"]}>{restaurantDetail.restaurantCategoryName}</span>
                    </div>
                    <div className={styles["restaurant-address"]}>
                        <span className={styles["address-icon"]}>📍</span>
                        <div>
                            <div>{restaurantDetail.address}</div>
                        </div>
                    </div>
                    <div className={styles["restaurant-address"]}>
                        <span className={styles["address-icon"]}>📍</span>
                        <div>
                            <div>{restaurantDetail.tel}</div>
                        </div>
                    </div>
                    <div className={styles["operating-hours"]}>
                        <span>🕐</span>
                        <span>{getOperatingStatus(restaurantDetail.todayOpeningHours)}</span>
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
                    {/* 메뉴 소개 탭 */}
                    {activeTab === 'menu' && <MenuTab />}

                    {/* 위치 탭 */}
                    {activeTab === 'location' && <LocationTab restaurantDetail={restaurantDetail}/>}

                    {/* 편의시설 탭 */}
                    {activeTab === 'facilities' && <FacilitiesTab />}

                    {/* 운영정보 탭 */}
                    {activeTab === 'info' && <OperatingInfoTab />}

                    {/* 리뷰 탭 */}
                    {activeTab === 'reviews' && <ReviewsTab restaurantDetail={restaurantDetail} />}
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
                                    min={tomorrow} // 내일부터 선택 가능 (오늘은 선택 불가)
                                    onChange={handleDateChange}
                                />
                            </div>

                            <div className={styles["selector-group"]}>
                                <label className={styles["selector-label"]}>인원</label>
                                <div className={styles["guest-counter"]}>
                                    <span>성인</span>
                                    <div className={styles["counter-controls"]}>
                                        <button className={styles["counter-btn"]} onClick={decrement}>-</button>
                                        <span className={styles["guest-count"]}>{people}</span>
                                        <button className={styles["counter-btn"]} onClick={increment}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["available-times"]}>
                            {timeSlots.length === 0 ? (
                                <div className={styles["no-slots"]}>
                                    {effectiveHours?.isClosed
                                        ? "오늘은 휴무입니다"
                                        : "예약 가능한 시간이 없습니다"}
                                </div>
                            ) : (
                                timeSlots.map((slot) => (
                                    <div
                                        key={slot.time}
                                        className={`${styles["time-slot"]}
                                                    ${selectedTime === slot.time ? styles['selected'] : ''}
                                                    ${!slot.isAvailable ? styles['disabled'] : ''}`}
                                        onClick={() => handleTimeSlotClick(slot)}
                                    >
                                        {slot.time}
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            className={styles["reservation-btn"]}
                            onClick={handleReservation}
                            disabled={timeSlots.length === 0}
                        >
                            예약하기
                        </button>
                    </div>

                    {/* <!-- Waiting Content --> */}
                    <Waiting reservationType={reservationType} />


                </div>
            </div>
        </div>
    )
}