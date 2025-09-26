import styles from './MyWaiting.module.css'
import { Link } from "react-router-dom";
export default function MyReservation() {
    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>웨이팅 내역</h2>
                    <div className={styles['view-toggle']}>
                        <button className={`${styles['view-btn']} ${styles.active}`}>웨이팅중</button>
                        <button className={styles['view-btn']}>이용 완료</button>
                    </div>
                </div>
                <div className={styles['reservations-container']}>
                    <div className={styles['reservations-grid']}>
                        <div className={styles['reservation-card']}>
                            <div className={styles['card-header']}>
                                <div className={styles['restaurant-info']}>
                                    <h3>이타리아노 파스타</h3>
                                    <div className={styles['restaurant-location']}>
                                        <span className={styles['detail-icon']}>📍</span>
                                        서초구 서초동
                                    </div>
                                </div>
                                <span className={`${styles['status-badge']} ${styles['status-waiting']}`}>
                                    대기중
                                </span>
                            </div>

                            <div className={styles['card-details']}>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>📅</span>
                                    <span className={styles['detail-label']}>일시</span>
                                    <span className={styles['detail-value']}>2025.09.10 (화) 18:30</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>👥</span>
                                    <span className={styles['detail-label']}>인원</span>
                                    <span className={styles['detail-value']}>2명</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>⏰</span>
                                    <span className={styles['detail-label']}>대기번호</span>
                                    <span className={styles['detail-value']}>3번</span>
                                </div>
                                <div className={styles['detail-item']}>
                                    <span className={styles['detail-icon']}>📞</span>
                                    <span className={styles['detail-label']}>연락처</span>
                                    <span className={styles['detail-value']}>02-1234-5678</span>
                                </div>
                            </div>

                            <div className={styles['card-actions']}>
                                <button className={`${styles.btn} ${styles['btn-secondary']}`}>대기 취소</button>
                                <button className={`${styles.btn} ${styles['btn-primary']}`}>📊 실시간 현황</button>
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
                                    이용완료
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
                                <button className={`${styles.btn} ${styles['btn-primary']}`}><Link to="/review/write">✍️ 리뷰 작성</Link></button>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </>
    )
}