import styles from '../Main.module.css'
import { getRestaurantList } from '../../utils/RestaurantApi'

export default function LocationCategory(){


    return(
        <>
                <section>
                    <h2 className={styles.sectionTitle}>어디로 가시나요?</h2>
                    <div className={styles.categoriesGrid}>
                        <a href="/html/map.html">
                            <div className={styles.categoryItem}>
                                <div className={styles.categoryIcon}>🛍️</div>
                                <div className={styles.categoryName}>서울</div>
                            </div>
                        </a>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🏠</div>
                            <div className={styles.categoryName}>경기</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>❤️</div>
                            <div className={styles.categoryName}>인천</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍷</div>
                            <div className={styles.categoryName}>부산</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🌍</div>
                            <div className={styles.categoryName}>충청</div>
                        </div>
                    </div>
                </section>
        </>
    )
}