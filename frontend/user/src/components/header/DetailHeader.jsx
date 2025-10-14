import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import NotificationPopup from '../NotificationPopup'

export function DetailHeader() {
    const [showNotificationPopup, setShowNotificationPopup] = useState(false)

    const handleNotificationClick = () => {
        setShowNotificationPopup(true)
    }

    const handleCloseNotificationPopup = () => {
        setShowNotificationPopup(false)
    }

    return (
        <>
            <div className={styles.breadcrumb}>홈 &gt; 강남 &gt; 일식 &gt; 정미스시</div>
            <div className={styles.detailActions}>
                <button className="btn btn-outline">
                <Link to = "/mypage" className={styles.linkNoDeco}>마이</Link>
                </button>
                <button className="btn btn-outline" onClick={handleNotificationClick}>🔗 알림</button>
                <button className="btn btn-outline">❤️ 찜</button>
            </div>

            <NotificationPopup
                show={showNotificationPopup}
                onClose={handleCloseNotificationPopup}
            />
        </>
    )
}
