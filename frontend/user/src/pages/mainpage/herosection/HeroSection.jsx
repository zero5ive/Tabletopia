import styles from './HeroSection.module.css'

export default function HeroSection(){
    return(
        <>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                {/* 배경 파티클/도형 효과 */}
                <div className={styles.particles}>
                    <div className={`${styles.particle} ${styles.particle1}`}></div>
                    <div className={`${styles.particle} ${styles.particle2}`}></div>
                    <div className={`${styles.particle} ${styles.particle3}`}></div>
                    <div className={`${styles.particle} ${styles.particle4}`}></div>
                    <div className={`${styles.particle} ${styles.particle5}`}></div>
                    <div className={`${styles.particle} ${styles.particle6}`}></div>
                    <div className={`${styles.particle} ${styles.particle7}`}></div>
                    <div className={`${styles.particle} ${styles.particle8}`}></div>
                </div>

                <div className={styles.heroContent}>
                    <h1>예약의 새로운 패러다임</h1>
                    <p>테이블토피아</p>
                    <p>예약과 웨이팅을 한 번에</p>
                </div>
                <div className={styles.featuredDish}></div>
            </section>
        </>
    )
}