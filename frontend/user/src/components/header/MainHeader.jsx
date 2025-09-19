import styles from './Header.module.css'

export function MainHeader() {
    return (
        <>
            <div className={styles.searchContainer}>
                <input 
                    type="text" 
                    className={styles.searchBox} 
                    placeholder="지역, 음식 또는 레스토랑명을 검색해보세요" 
                />
            </div>
            <div className={styles.locationSelector}>📍 강남</div>
            <div className={styles.userActions}>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>로그인</button>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>회원가입</button>
            </div>
        </>
    )
}
