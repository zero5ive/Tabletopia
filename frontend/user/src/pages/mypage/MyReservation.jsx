import { Link } from 'react-router-dom'
import styles from './MyWaiting.module.css'

export default function MyReservation() {
    return (
        <>
            <div className={styles['main-panel']}>

                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>예약 내역</h2>
                    <div className={styles['view-toggle']}>
                        <button className={`${styles['view-btn']} ${styles.active}`}>대기중</button>
                        <button className={styles['view-btn']}>예약확정</button>
                        <button className={styles['view-btn']}>이용완료</button>
                    </div>
                </div>

                <div className={styles['reservations-container']}>
                    <div className={styles['reservations-grid']}>
                        <div className={styles['reservation-card']}>
                            <div className={styles['card-header']}>
                                <div className={styles['restaurant-info']}>
                                    <h3>더 스테이크 하우스</h3>
                                    <div className={styles['restaurant-location']}>
                                        <span className={styles['detail-icon']}>📍</span>
                                        강남구 청담동
                                    </div>
                                </div>
                                <span className={`${styles['status-badge']} ${styles['status-confirmed']}`}>
                                    예약 확정
                                </span>
                            </div>

                            <div className={styles['card-details']}>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>📅</span>
                                    <span className={styles['detail-label']}>일시</span>
                                    <span className={styles['detail-value']}>2025.09.15 (일) 19:00</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>👥</span>
                                    <span className={styles['detail-label']}>인원</span>
                                    <span className={styles['detail-value']}>4명</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>💳</span>
                                    <span className={styles['detail-label']}>예약금</span>
                                    <span className={styles['detail-value']}>40,000원</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>📞</span>
                                    <span className={styles['detail-label']}>연락처</span>
                                    <span className={styles['detail-value']}>02-1234-5678</span>
                                </div>
                            </div>

                            <div className={styles['card-actions']}>
                                <button className={`${styles.btn} ${styles['btn-outline']}`}>예약 변경</button>
                                <button className={`${styles.btn} ${styles['btn-secondary']}`}>예약 취소</button>
                            </div>
                        </div>

                        <div className={styles['reservation-card']}>
                            <div className={styles['card-header']}>
                                <div className={styles['restaurant-info']}>
                                    <h3>한정식 궁중연</h3>
                                    <div className={styles['restaurant-location']}>
                                        <span className={styles['detail-icon']}>📍</span>
                                        중구 명동
                                    </div>
                                </div>
                                <span className={`${styles['status-badge']} ${styles['status-completed']}`}>
                                    예약완료
                                </span>
                            </div>

                            <div className={styles['card-details']}>
                                <div className={styles['detail-itemv']}>
                                    <span className={styles['detail-icon']}>📅</span>
                                    <span className={styles['detail-label']}>일시</span>
                                    <span className={styles['detail-value']}>2025.09.08 (토) 12:00</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>👥</span>
                                    <span className={styles['detail-label']}>인원</span>
                                    <span className={styles['detail-value']}>6명</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>💰</span>
                                    <span className={styles['detail-label']}>결제금액</span>
                                    <span className={styles['detail-value']}>180,000원</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>📞</span>
                                    <span className={styles['detail-label']}>연락처</span>
                                    <span className={styles['detail-value']}>02-1234-5678</span>
                                </div>
                            </div>

                            <div className={styles['card-actions']}>
                                <button className={`${styles.btn} ${styles['btn-primary']}`}>✍️ 리뷰 작성</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}