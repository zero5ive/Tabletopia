import styles from './MyWaiting.module.css'

export default function MyReservation() {
    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>북마크</h2>
                </div>
                <div className={styles['bookmark-container']}>
                    <div className={styles['card-image']}>
                        <div className={styles['image-section']}>
                            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=120&h=120&fit=crop" alt="소시센몬" />
                        </div>
                        <div className={styles['content-section']}>
                            <button className={styles['bookmark-btn']}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <div>
                                <div className={styles['restaurant-title']}>소시센몬</div>
                                <div className={styles['restaurant-desc']}>소시지 전문점 • 강남구</div>
                            </div>
                            <div className={styles['quick-info']}>
                                <span className={styles['info-badge']}>영업중</span>
                                <span className={styles['info-badge']}>예약가능</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['card-image']}>
                        <div className={styles['image-section']}>
                            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=120&h=120&fit=crop" alt="소시센몬" />
                        </div>
                        <div className={styles['content-section']}>
                            <button className={styles['bookmark-btn']}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <div>
                                <div className={styles['restaurant-title']}>소시센몬</div>
                                <div className={styles['restaurant-desc']}>소시지 전문점 • 강남구</div>
                            </div>
                            <div className={styles['quick-info']}>
                                <span className={styles['info-badge']}>영업중</span>
                                <span className={styles['info-badge']}>예약가능</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['demo-section']}>
                        <div className={styles['pagination-container']}>
                            <div className={styles.pagination}>
                                <button className={`${styles['pagination-btn']} ${styles.arrow} ${styles.disabled}`}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button className={`${styles['pagination-btn']} ${styles.active}`}>1</button>
                                <button className={styles['pagination-btn']}>2</button>
                                <button className={styles['pagination-btn']}>3</button>
                                <button className={styles['pagination-btn']}>4</button>
                                <button className={styles['pagination-btn']}>5</button>
                                <span className={styles['pagination-dots']}>...</span>
                                <button className={styles['pagination-btn']}>15</button>
                                <button className={`${styles['pagination-btn']} ${styles.arrow}`}>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}