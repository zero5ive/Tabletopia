import styles from '../RestaurantDetail.module.css';
import { getOpeningHours } from '../../utils/OpeningHourApi';
import { getEffectiveHours } from '../../utils/OpeningHourApi';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export default function OperatingInfoTab() {

    const [openHour, setOpenHour] = useState([]);
    const [effectiveHour, steEffectiveHour] = useState([]);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const fetchOpeningHours = async(restaurantId) =>{
        const response = await getOpeningHours(restaurantId);
        console.log("운영시간 ", response.data);
    }

    const fetchEffectHours = async(restaurantId) =>{
        const response = await getEffectiveHours(restaurantId);
        console.log("특별운영시간 ", response.data);
    }

    useEffect(()=>{
        fetchOpeningHours(restaurantId);
        fetchEffectHours(restaurantId);
    }, [restaurantId])


    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
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
    );
}
