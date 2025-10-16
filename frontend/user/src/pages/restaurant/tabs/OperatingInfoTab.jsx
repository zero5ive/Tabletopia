import styles from '../RestaurantDetail.module.css';
import { getOpeningHours } from '../../utils/OpeningHourApi';
import { getEffectiveHours } from '../../utils/OpeningHourApi';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OperatingInfoTab() {
    const [openHours, setOpenHours] = useState([]);
    const [effectiveHours, setEffectiveHours] = useState([]);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    // 요일 이름 변환 함수
    const getDayName = (dayOfWeek) => {
        // 숫자형 요일을 한글로 변환
        const days = ['일', '월', '화', '수', '목', '금', '토'];

        // 만약 문자열로 오는 경우
        if (typeof dayOfWeek === 'string') {
            const dayMap = {
                'MONDAY': '월',
                'TUESDAY': '화',
                'WEDNESDAY': '수',
                'THURSDAY': '목',
                'FRIDAY': '금',
                'SATURDAY': '토',
                'SUNDAY': '일'
            };
            return dayMap[dayOfWeek] || dayOfWeek;
        }

        // 숫자로 오는 경우 (0=일요일, 1=월요일, ...)
        return days[dayOfWeek] || dayOfWeek;
    };

    // 시간 형식 변환 (HH:MM:SS → HH:MM)
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5); // "11:00:00" → "11:00"
    };

    const fetchOpeningHours = async (restaurantId) => {
        try {
            const response = await getOpeningHours(restaurantId);
            console.log("운영시간 ", response.data);
            setOpenHours(response.data);
        } catch (error) {
            console.error('운영시간 조회 실패:', error);
        }
    }

    const fetchEffectiveHours = async (restaurantId) => {
        try {
            const response = await getEffectiveHours(restaurantId);
            console.log("특별운영시간 ", response.data);
            setEffectiveHours(response.data);
        } catch (error) {
            console.error('특별운영시간 조회 실패:', error);
        }
    }

    useEffect(() => {
        if (restaurantId) {
            fetchOpeningHours(restaurantId);
            fetchEffectiveHours(restaurantId);
        }
    }, [restaurantId])

    // 운영시간 그룹핑 (월~금, 토~일 같은 형태로)
    const groupedHours = openHours
        .filter(h => h.openTime && h.closeTime)
        .reduce((acc, hour) => {
            const key = `${hour.openTime}-${hour.closeTime}`;
            if (!acc[key]) {
                acc[key] = {
                    openTime: hour.openTime,
                    closeTime: hour.closeTime,
                    breakStartTime: hour.breakStartTime,
                    breakEndTime: hour.breakEndTime,
                    days: []
                };
            }
            acc[key].days.push(getDayName(hour.dayOfWeek));
            return acc;
        }, {});

    // 연속된 요일 표시 개선 (월, 화, 수 → 월~수)
    const formatDayRange = (days) => {
        if (days.length === 0) return '';
        if (days.length === 1) return days[0];

        // 연속된 요일인지 확인
        const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
        const sortedDays = days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

        const ranges = [];
        let start = sortedDays[0];
        let prev = sortedDays[0];

        for (let i = 1; i < sortedDays.length; i++) {
            const current = sortedDays[i];
            const prevIndex = dayOrder.indexOf(prev);
            const currentIndex = dayOrder.indexOf(current);

            // 연속되지 않으면 범위 저장
            if (currentIndex !== prevIndex + 1) {
                ranges.push(start === prev ? start : `${start}~${prev}`);
                start = current;
            }
            prev = current;
        }

        // 마지막 범위 추가
        ranges.push(start === prev ? start : `${start}~${prev}`);

        return ranges.join(', ');
    };

    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>운영정보</div>
            <div className={styles["operating-info"]}>

                {/* 운영시간 */}
                <div className={styles["info-item"]}>
                    <span className={styles["info-label"]}>영업시간</span>
                    <div className={styles["info-value"]}>
                        {Object.values(groupedHours).length > 0 ? (
                            Object.values(groupedHours).map((group, index) => (
                                <div key={index}>
                                    {formatDayRange(group.days)} : {formatTime(group.openTime)} ~ {formatTime(group.closeTime)}
                                </div>
                            ))
                        ) : (
                            <span>운영시간 정보 없음</span>
                        )}
                    </div>
                </div>

                {/* 브레이크타임 */}
                <div className={styles["info-item"]}>
                    <span className={styles["info-label"]}>브레이크타임</span>
                    <div className={styles["info-value"]}>
                        {Object.values(groupedHours).some(g => g.breakStartTime) ? (
                            Object.values(groupedHours)
                                .filter(g => g.breakStartTime)
                                .map((group, index) => (
                                    <div key={index}>
                                        {formatDayRange(group.days)} : {formatTime(group.breakStartTime)} ~ {formatTime(group.breakEndTime)}
                                    </div>
                                ))
                        ) : (
                            <span>브레이크타임 없음</span>
                        )}
                    </div>
                </div>
                {/* 휴무일 / 특별일 */}
                <div className={styles['info-item']}>
                    <span className={styles['info-label']}>휴무일</span>
                    <div className={styles['info-value']}>
                        {!effectiveHours ? (
                            <span>정보 없음</span>
                        ) : effectiveHours.closed ? (
                            // 오늘 쉬는 날인 경우 (정기휴무 or 특별휴무)
                            <>
                                {effectiveHours.date && <div>{effectiveHours.date}</div>}
                                <div>{effectiveHours.message || '휴무일'}</div>
                            </>
                        ) : effectiveHours.type === 'REGULAR' ? (
                            // 오늘 정상 영업일
                            <span>휴무일 없음</span>
                        ) : effectiveHours.type === 'SPECIAL' ? (
                            // 특별영업 (예: 단축영업)
                            <>
                                <div>{effectiveHours.date}</div>
                                <div>
                                    {`${effectiveHours.openTime?.substring(0, 5)} ~ ${effectiveHours.closeTime?.substring(0, 5)}`}
                                </div>
                                <div>{effectiveHours.message}</div>
                            </>
                        ) : (
                            <span>휴무일 없음</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}