import styles from './MyPage.module.css';
import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../utils/UserApi';

export default function MyPage() {
    const [userData, setUserData] = useState({ name: '', email: '', phoneNumber: '' });
    const [initialLoading, setInitialLoading] = useState(true);

    // 유저 정보 조회 함수 (자식 컴포넌트에서도 호출 가능)
    const refreshUserData = useCallback(async () => {
        try {
            console.log(response);
            const response = await getCurrentUser();
            setUserData(response.data);
        } catch (error) {
            console.error('유저 정보 조회 실패:', error);
        }
    }, []);

    // 컴포넌트 마운트 시 현재 유저 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getCurrentUser();
                setUserData(response.data);
            } catch (error) {
                console.error('유저 정보 조회 실패:', error);
                alert('유저 정보를 불러오지 못했습니다.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    // 초기 로딩 중일 때
    if (initialLoading) {
        return (
            <div className={styles['main-panel']}>
                <div className={styles['loading']}>로딩 중...</div>
            </div>
        );
    }


    return (
        <>
            <div className={styles['main-container']}>
                <aside className={styles['left-sidebar']}>
                    <div className={styles['profile-card']}>
                        <div className={styles['profile-avatar']}>👤</div>
                        <h2 className={styles['profile-name']}>{userData.name}</h2>
                        <div className={styles['profile-stats']}>
                        </div>
                        <div className={styles['action-buttons']}>
                            <button className={styles.btn}><Link to="/mypage/profile">프로필 설정</Link></button>
                        </div>
                    </div>

                    <div className={styles['sidebar-card']}>
                        <h3 className={styles['sidebar-card-title']}><Link to="/mypage">마이메뉴</Link></h3>
                        <ul className={styles['menu-list']}>
                            <li className={styles['menu-item']}>
                                <Link to="/mypage/bookmark" className={styles['menu-link']}>💾 나의 북마크</Link>
                            </li>
                            <li className={styles['menu-item']}>
                                <Link to="/mypage/review" className={styles['menu-link']}>📝 리뷰</Link>
                            </li>
                            <li className={styles['menu-item']}>
                                <Link to="/mypage/reservation" className={styles['menu-link']}>📅 예약 내역</Link>
                            </li>
                            <li className={styles['menu-item']}>
                                <Link to="/mypage/waiting" className={styles['menu-link']}>📅 실시간 웨이팅</Link>
                            </li>
                        </ul>
                    </div>
                </aside>
                <Outlet context={{ refreshUserData }} />
            </div>
        </>
    )
}