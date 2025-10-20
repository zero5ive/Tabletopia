import { Link } from 'react-router-dom';
import styles from './MyPage.module.css';

export default function MyPage() {
    const menuItems = [
        {
            path: '/mypage/reservation',
            title: '예약 내역',
            description: '나의 예약 현황을 확인하고 관리하세요',
            icon: '📅',
            color: '#4f46e5'
        },
        {
            path: '/mypage/review',
            title: '리뷰 내역',
            description: '작성한 리뷰를 확인하고 수정하세요',
            icon: '⭐',
            color: '#f59e0b'
        },
        {
            path: '/mypage/bookmark',
            title: '나의 북마크',
            description: '저장한 맛집 목록을 확인하세요',
            icon: '❤️',
            color: '#ef4444'
        },
        {
            path: '/mypage/waiting',
            title: '실시간 웨이팅',
            description: '현재 대기 중인 웨이팅 현황을 확인하세요',
            icon: '⏱️',
            color: '#10b981'
        }
    ];

    return (
        <main className={styles['main-content']}>
            <div className={styles.dashboardHeader}>
                <h1 className={styles.dashboardTitle}>마이페이지</h1>
                <p className={styles.dashboardSubtitle}>나의 예약, 리뷰, 북마크를 한눈에 확인하세요</p>
            </div>

            <div className={styles.dashboardGrid}>
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={styles.dashboardCard}
                        style={{ '--card-color': item.color }}
                    >
                        <div className={styles.dashboardCardIcon}>{item.icon}</div>
                        <div className={styles.dashboardCardContent}>
                            <h3 className={styles.dashboardCardTitle}>{item.title}</h3>
                            <p className={styles.dashboardCardDescription}>{item.description}</p>
                        </div>
                        <div className={styles.dashboardCardArrow}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}