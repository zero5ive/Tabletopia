import styles from '../Main.module.css'
import { Link } from 'react-router-dom'

export default function NewRestaurant(){
    return(
        <>
            <section className={styles.restaurantsSection}>
                <div className={styles.filterBar}>
                    <h2 className={styles.sectionTitle}>새로 입점했어요</h2>
                </div>
                
                <div className={styles.restaurantsGrid}>
                    <div className={styles.restaurantCard}>
                        <div className={styles.restaurantImage}></div>
                        <div className={styles.restaurantInfo}>
                            <div className={styles.restaurantName}>오마카세 청담</div>
                            <div className={styles.restaurantDetails}>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                    <span>4.8</span>
                                </div>
                                <span>일식 • 청담</span>
                                <span>5만원~</span>
                            </div>
                            <div className={styles.restaurantTags}>
                                <span className={styles.tag}>오마카세</span>
                                <span className={styles.tag}>데이트</span>
                                <span className={styles.tag}>특별한 날</span>
                            </div>
                            <div className={styles.reservationInfo}>
                                <div className={styles.availableTimes}>오늘 19:00, 21:00 예약가능</div>
                                <button className={styles.reservationBtn}>예약하기</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    )
}