import styles from './HeroSection.module.css'

export default function HeroSection(){
    return(
        <>
            {/* Hero Section */}
            <section className={styles.heroSection}>
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