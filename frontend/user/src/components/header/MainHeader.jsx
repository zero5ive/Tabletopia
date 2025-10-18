import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import NotificationPopup from '../NotificationPopup'
import { useWebSocket } from '../../contexts/WebSocketContext'
import UserApi from '../../pages/utils/UserApi';

export function MainHeader() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { notifications } = useWebSocket()

    // 읽지 않은 알림 개수
    const unreadCount = notifications.filter(n => !n.read).length

    // 토큰 유효성 검사 함수
    const isTokenValid = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (!decoded.exp) return false;
            return decoded.exp * 1000 > Date.now(); // exp는 초 단위
        } catch (e) {
            return false; // decode 실패 → 위조 토큰
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && isTokenValid(token)) {
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('accessToken'); // 만료/위조 토큰 제거
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogin = () => {
        navigate('/users/loginform');
    };

    const handleSignUp = () => {
        navigate('/users/signup');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleMyPage = () => {
        navigate('/mypage');
    };

    // 알림팝업
    const [showNotificationPopup, setShowNotificationPopup] = useState(false)

    const handleNotificationClick = () => {
        setShowNotificationPopup(true)
    }

    const handleCloseNotificationPopup = () => {
        setShowNotificationPopup(false)
    }

    return (
        <>
            <div className={styles.userActions}>
                {isLoggedIn ? (
                    <>
                        <button
                            className={`${styles.btn} ${styles.notificationBtn}`}
                            onClick={handleNotificationClick}
                        >
                            🔔 알림
                            {unreadCount > 0 && (
                                <span className={styles.notificationBadge}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            className={`${styles.btn} ${styles.iconButton}`}
                            onClick={handleMyPage}
                            aria-label="My Page"
                        >
                            {/* 여기에 유저 이름을 추가하는 등의 변수를 받아오겠습니다. */}
                            <i className="fas fa-user"></i>
                        </button>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>

                        <NotificationPopup
                            show={showNotificationPopup}
                            onClose={handleCloseNotificationPopup}
                        />
                    </>
                ) : (
                    <>
                        <button
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={handleLogin}
                        >
                            로그인
                        </button>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            onClick={handleSignUp}
                        >
                            회원가입
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
