import styles from '../Main.module.css'
import { Link } from 'react-router-dom'

export default function Advertisement(){
    return(
        <>
            <section className={styles.restaurantsSection}>
                <div className={styles.filterBar}>
                    <h2 className={styles.sectionTitle}>놓치면 안되는 핫플 가게!(광고)</h2>
                </div>
                
                <div className={styles.restaurantsGrid}>
                    <Link to="/restaurant/detail" className={styles.noUnderline}>
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
                    </Link>

                    <div className={styles.restaurantCard}>
                        <div className={styles.restaurantImage}></div>
                        <div className={styles.restaurantInfo}>
                            <div className={styles.restaurantName}>미야의 정원</div>
                            <div className={styles.restaurantDetails}>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>⭐⭐⭐⭐</span>
                                    <span>4.2</span>
                                </div>
                                <span>아시아 • 압구정</span>
                                <span>3만원~</span>
                            </div>
                            <div className={styles.restaurantTags}>
                                <span className={styles.tag}>아시아음식</span>
                                <span className={styles.tag}>분위기</span>
                            </div>
                            <div className={styles.reservationInfo}>
                                <div className={styles.availableTimes}>내일 18:30, 20:00 예약가능</div>
                                <button className={styles.reservationBtn}>예약하기</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.restaurantCard}>
                        <div className={styles.restaurantImage}></div>
                        <div className={styles.restaurantInfo}>
                            <div className={styles.restaurantName}>비스트로 라파엘</div>
                            <div className={styles.restaurantDetails}>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                    <span>4.6</span>
                                </div>
                                <span>양식 • 강남</span>
                                <span>8만원~</span>
                            </div>
                            <div className={styles.restaurantTags}>
                                <span className={styles.tag}>파인다이닝</span>
                                <span className={styles.tag}>와인</span>
                                <span className={styles.tag}>기념일</span>
                            </div>
                            <div className={styles.reservationInfo}>
                                <div className={styles.availableTimes}>오늘 예약 마감</div>
                                <button className={styles.reservationBtn} disabled>대기등록</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}