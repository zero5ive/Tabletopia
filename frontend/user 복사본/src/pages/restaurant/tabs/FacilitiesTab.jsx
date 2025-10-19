import styles from '../RestaurantDetail.module.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRestaurantFacilities } from '../../utils/FacilitiesApi';
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function FacilitiesTab() {
    const [facilities, setFacilities] = useState([]);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const getFacilityIcon = (name) => {
        switch (name) {
            case "Wi-Fi":
                return "fa-solid fa-wifi";
            case "금연":
                return "fa-solid fa-ban-smoking";
            case "흡연실":
                return "fa-solid fa-smoking";
            case "단체석":
                return "fa-solid fa-people-group";
            case "반려동물 동반 가능":
                return "fa-solid fa-dog";
            case "장애인 편의시설":
                return "fa-solid fa-wheelchair";
            case "주차 가능":
                return "fa-solid fa-car";
            case "키즈존":
                return "fa-solid fa-child-reaching";
            case "테라스":
                return "fa-solid fa-sun";
            case "화장실":
                return "fa-solid fa-restroom";
            case "포장 가능":
                return "fa-solid fa-box";
            case "배달 가능":
                return "fa-solid fa-motorcycle";
            case "노키즈존":
                return "fa-solid fa-ban";
            default:
                return "fa-solid fa-gear";
        }
    };

    const fetchFacilities = async (restaurantId) => {
        try {
            const response = await getRestaurantFacilities(restaurantId);
            console.log('편의시설 데이터:', response.data);
            setFacilities(response.data);
        } catch (error) {
            console.error('편의시설 조회 실패:', error);
        }
    };

    useEffect(() => {
        if (restaurantId) {
            fetchFacilities(restaurantId);
        }
    }, [restaurantId]);

    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>편의시설</div>
            <div className={styles["facilities-grid"]}>
                {facilities.length > 0 ? (
                    facilities.map((facility) => (
                        <div key={facility.facilityId} className={styles["facility-item"]}>
                            <div className={styles["facility-icon"]}>
                                <i className={getFacilityIcon(facility.facilityName)}></i>
                            </div>
                            <div className={styles["facility-name"]}>
                                {facility.facilityName}
                            </div>
                            <div className={styles["facility-description"]}>
                                {facility.description || ''}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>편의시설 정보가 없습니다.</div>
                )}
            </div>
        </div>
    );
}