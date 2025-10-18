import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './MyWaiting.module.css'
import { getReservations } from '../utils/UserApi';

export default function MyReservation() {
    const [activeTab, setActiveTab] = useState('PENDING')
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(false)

    const tabs = [
        { key: 'PENDING', label: '대기중' },
        { key: 'CONFIRMED', label: '확정' },
        { key: 'COMPLETED', label: '완료' },
        { key: 'COMPLETED_GROUP', label: '취소/노쇼' }
    ]

    useEffect(() => {
        fetchReservations(activeTab)
    }, [activeTab])

    const fetchReservations = async (status) => {
        setLoading(true)
        try {
            const response = await getReservations(status)

            const data = response.data

            if (data.success) {
                setReservations(data.data)
            } else {
                console.error('예약 내역 조회 실패:', data.message)
                setReservations([])
            }
        } catch (error) {
            console.error('예약 내역 조회 에러:', error)
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
            setReservations([])
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { text: '대기중', class: 'status-pending' },
            CONFIRMED: { text: '예약 확정', class: 'status-confirmed' },
            COMPLETED: { text: '이용완료', class: 'status-completed' },
            CANCELLED: { text: '취소됨', class: 'status-cancelled' },
            NO_SHOW: { text: '노쇼', class: 'status-cancelled' }
        }
        return statusMap[status] || { text: status, class: 'status-pending' }
    }

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]

        return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`
    }

    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>예약 내역</h2>
                    <div className={styles['view-toggle']}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`${styles['view-btn']} ${activeTab === tab.key ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles['reservations-container']}>
                    {loading ? (
                        <div className={styles['loading']}>로딩중...</div>
                    ) : reservations.length === 0 ? (
                        <div className={styles['empty-message']}>
                            예약 내역이 없습니다.
                        </div>
                    ) : (
                        <div className={styles['reservations-grid']}>
                            {reservations.map(reservation => {
                                const statusInfo = getStatusBadge(reservation.reservationState)
                                return (
                                    <div key={reservation.id} className={styles['reservation-card']}>
                                        <div className={styles['card-header']}>
                                            <div className={styles['restaurant-info']}>
                                                <h3>{reservation.restaurantNameSnapshot}</h3>
                                                <div className={styles['restaurant-location']}>
                                                    <span className={styles['detail-icon']}>📍</span>
                                                    {reservation.restaurantAddressSnapshot}
                                                </div>
                                            </div>
                                            <span className={`${styles['status-badge']} ${styles[statusInfo.class]}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>

                                        <div className={styles['card-details']}>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>📅</span>
                                                <span className={styles['detail-label']}>일시</span>
                                                <span className={styles['detail-value']}>
                                                    {formatDateTime(reservation.reservationAt)}
                                                </span>
                                            </div>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>👥</span>
                                                <span className={styles['detail-label']}>인원</span>
                                                <span className={styles['detail-value']}>
                                                    {reservation.peopleCount}명
                                                </span>
                                            </div>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>🪑</span>
                                                <span className={styles['detail-label']}>테이블</span>
                                                <span className={styles['detail-value']}>
                                                    {reservation.restaurantTableNameSnapshot}
                                                </span>
                                            </div>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>📞</span>
                                                <span className={styles['detail-label']}>연락처</span>
                                                <span className={styles['detail-value']}>
                                                    {reservation.restaurantPhoneSnapshot}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles['card-actions']}>
                                            {reservation.reservationState === 'PENDING' && (
                                                <>
                                                    <button className={`${styles.btn} ${styles['btn-secondary']}`}>
                                                        예약 취소
                                                    </button>
                                                </>
                                            )}
                                            {reservation.reservationState === 'CONFIRMED' && (
                                                <button className={`${styles.btn} ${styles['btn-secondary']}`}>
                                                    예약 취소
                                                </button>
                                            )}
                                            {reservation.reservationState === 'COMPLETED' && (
                                                <button className={`${styles.btn} ${styles['btn-primary']}`}>
                                                    ✍️ 리뷰 작성
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
