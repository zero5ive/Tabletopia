import styles from '../Main.module.css'

export default function FoodCategory(){
    return(
        <>
            <section>
                <h2 className={styles.sectionTitle}>어떤 음식이 드시고 싶으세요?</h2>
                <div className={styles.categoriesGrid}>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🛍️</div>
                        <div className={styles.categoryName}><a href="/html/restlist.html">전체</a></div>
                        <div className={styles.categoryDesc}>특별한 날의 선택</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🛍️</div>
                        <div className={styles.categoryName}>한식</div>
                        <div className={styles.categoryDesc}>특별한 날의 선택</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🏠</div>
                        <div className={styles.categoryName}>양식</div>
                        <div className={styles.categoryDesc}>우리 동네 숨은 맛집</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>❤️</div>
                        <div className={styles.categoryName}>중식</div>
                        <div className={styles.categoryDesc}>로맨틱한 분위기</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🍷</div>
                        <div className={styles.categoryName}>와인 바</div>
                        <div className={styles.categoryDesc}>특별한 와인과 함께</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🌍</div>
                        <div className={styles.categoryName}>이국 요리</div>
                        <div className={styles.categoryDesc}>세계의 맛을 경험</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>⏰</div>
                        <div className={styles.categoryName}>브런치</div>
                        <div className={styles.categoryDesc}>여유로운 오후</div>
                    </div>
                    <div className={styles.categoryItem}>
                        <div className={styles.categoryIcon}>🍣</div>
                        <div className={styles.categoryName}>스시/사시미</div>
                        <div className={styles.categoryDesc}>신선한 일식</div>
                    </div>
                </div>
            </section>
        </>
    )
}