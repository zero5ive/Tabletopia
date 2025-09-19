import styles from './Header.module.css'

export function DetailHeader() {
    return (
        <>
            <div className={styles.breadcrumb}>홈 &gt; 강남 &gt; 일식 &gt; 정미스시</div>
            <div className={styles.detailActions}>
                <button className="btn btn-outline">📞 전화</button>
                <button className="btn btn-outline">🔗 공유</button>
                <button className="btn btn-outline">❤️ 찜</button>
            </div>
        </>
    )
}
