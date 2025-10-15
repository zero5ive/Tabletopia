import styles from '../Main.module.css'
import { getRestaurantList } from '../../utils/RestaurantApi'
import { Link } from 'react-router-dom'

export default function LocationCategory() {


    return (
        <>
            <section>
                <h2 className={styles.sectionTitle}>어디로 가시나요?</h2>
                <div className={styles.categoriesGrid}>
                    <Link
                        to={`/restaurant/list?regionCode=서울`}
                        className={styles.noUnderline}
                    >
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🏙️</div>
                            <div className={styles.categoryName}>서울</div>
                        </div>
                    </Link>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🏡</div>
                        <div className={styles.categoryName}>경기</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>⛰️</div>
                        <div className={styles.categoryName}>강원</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🍂</div>
                        <div className={styles.categoryName}>충북</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🏞️</div>
                        <div className={styles.categoryName}>충남</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🌾</div>
                        <div className={styles.categoryName}>전북</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🌊</div>
                        <div className={styles.categoryName}>전남</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🏯</div>
                        <div className={styles.categoryName}>경북</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🌄</div>
                        <div className={styles.categoryName}>경남</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🏝️</div>
                        <div className={styles.categoryName}>제주</div>
                    </div>
                </div>
            </section>
        </>
    )
}