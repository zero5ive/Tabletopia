import styles from '../Main.module.css'

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
                            <div className={styles.categoryName}>대전</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>❤️</div>
                            <div className={styles.categoryName}>부산</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍷</div>
                            <div className={styles.categoryName}>와인 바</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🌍</div>
                            <div className={styles.categoryName}>이국 요리</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>⏰</div>
                            <div className={styles.categoryName}>브런치</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍣</div>
                            <div className={styles.categoryName}>스시/사시미</div>
                        </div>
                    </div>
                </section>
        </>
    )
}