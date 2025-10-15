import styles from '../RestaurantDetail.module.css';
import { getRestaurantMenu } from '../../utils/RestaurantMenuApi';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';

export default function MenuTab() {

    const [menu, setMenu] = useState([]);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');


    //레스토랑 메뉴 함수
    const fetchRestaurantMenu = async (restaurantId) => {
        const response = await getRestaurantMenu(restaurantId);
        console.log('레스토랑 메뉴', response.data);
        setMenu(response.data);
    }

    useEffect(() => {
        fetchRestaurantMenu(restaurantId);
    }, [restaurantId])


    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            {menu.map((item) => (
            <div key={item.id} className={styles["menu-items"]}>
                <div className={styles["menu-item"]}>
                    <div className={styles["menu-image"]}>
                            <img
                                src={
                                    item.imageFilename
                                        ? `http://localhost:8002/uploads/menus/${item.imageFilename}`
                                        : "https://placehold.co/300x180/9ACD32/ffffff?text=Img"
                                }
                                alt={item.name}
                            />
                        </div>
                    <div className={styles["menu-info"]}>
                        <div className={styles["menu-name"]}>{item.name}</div>
                        <div className={styles["menu-description"]}>{item.description}</div>
                        <div className={styles["menu-price"]}>{item.price}</div>
                    </div>
                </div>
            </div>

            ))}
        </div>
    );
}
