import { useWebSocket } from '../contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../pages/utils/UserApi'
import styles from './NotificationPopup.module.css'

export default function NotificationPopup({ show, onClose }) {
    const { notifications, markAllAsRead } = useWebSocket()
    const [userId, setUserId] = useState(null)

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser()
                setUserId(response.data.id)
            } catch (error) {
                console.error('[NotificationPopup] 사용자 정보 조회 실패:', error)
            }
        }
        fetchCurrentUser()
    }, [])

    // 알림 팝업을 열면 모든 알림을 읽음 처리
    useEffect(() => {
        if (show) {
            markAllAsRead()
        }
    }, [show, markAllAsRead])

    if (!show) return null

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'WAITING_CALLED':
                return '🔔'
            case 'RESERVATION_CONFIRMED':
                return '✅'
            case 'RESERVATION_CANCELLED':
                return '❌'
            default:
                return '📢'
        }
    }

    // 본인 알림만 필터링 (안전장치)
    const filteredNotifications = userId
        ? notifications.filter(notif => !notif.userId || notif.userId === userId)
        : notifications

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        🔔 알림
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className={styles.body}>
                    {filteredNotifications.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📭</div>
                            <div className={styles.emptyText}>새로운 알림이 없습니다.</div>
                        </div>
                    ) : (
                        <div className={styles.notificationList}>
                            {filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`${styles.notificationItem} ${
                                        notification.type === 'WAITING_CALLED'
                                            ? styles.called
                                            : notification.read
                                            ? styles.read
                                            : styles.unread
                                    }`}
                                >
                                    <div className={styles.notificationHeader}>
                                        <h3 className={styles.notificationTitle}>
                                            <span>{getNotificationIcon(notification.type)}</span>
                                            {notification.title}
                                            {notification.name && (
                                                <span className={styles.badge}>{notification.name}</span>
                                            )}
                                        </h3>
                                        {!notification.read && (
                                            <div className={styles.unreadDot}></div>
                                        )}
                                    </div>
                                    <p className={styles.notificationMessage}>
                                        {notification.message}
                                    </p>
                                    <div className={styles.notificationTime}>
                                        {notification.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}