import { GoogleMap, Marker } from '@react-google-maps/api';
import styles from '../RestaurantDetail.module.css';
import { getRestaurant } from '../../utils/RestaurantApi';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

export default function LocationTab() {
    const [location, setLocation] = useState(null);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    
    const restaurantLocation = async (restaurantId) => {
        try {
            const response = await getRestaurant(restaurantId);
            console.log('레스토랑 정보:', response.data);
            setLocation(response.data);
        } catch (error) {
            console.error('조회 실패:', error);
        }
    }

    useEffect(() => {
        if (restaurantId) {
            restaurantLocation(restaurantId);
        }
    }, [restaurantId]);

    // 👇 옵셔널 체이닝 사용
    const center = {
        lat: location?.latitude,
        lng: location?.longitude
    };

    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>위치</div>

            {location ? (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                >
                    <Marker position={center} />
                </GoogleMap>
            ) : (
                <div>지도 로딩 중...</div>
            )}

            <div className={styles["location-details"]}>
                <div className={styles["location-item"]}>
                    <span className={styles["location-label"]}>주소</span>
                    <span className={styles["location-value"]}>
                        {location?.address || '주소 정보 없음'}
                    </span>
                </div>
                <div className={styles["location-item"]}>
                    <span className={styles["location-label"]}>식당명</span>
                    <span className={styles["location-value"]}>
                        {location?.name || '식당명 없음'}
                    </span>
                </div>
            </div>
        </div>
    );
}