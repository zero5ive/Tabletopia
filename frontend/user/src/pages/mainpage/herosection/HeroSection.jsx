import styles from './HeroSection.module.css'

export default function HeroSection(){
    return(
        <>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>예약 많은 가게들</h1>
                    <p>청담과 압구정</p>
                    <p>한 끼이 다른 파인다이닝</p>
                </div>
                <div className={styles.featuredDish}></div>
            </section>
        </>
    )
}