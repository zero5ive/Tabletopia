import styles from './MyPage.module.css';
import { Link, Outlet } from 'react-router-dom';

export default function MyPage(){
    return(
        <>
            <div className={styles['main-container']}>
                <aside className={styles['left-sidebar']}>
                    <div className={styles['profile-card']}>
                        <div className={styles['profile-avatar']}>👤</div>
                        <h2 className={styles['profile-name']}>김예진</h2>
                        <div className={styles['profile-stats']}>
                        </div>
                        <div className={styles['action-buttons']}>
                            <button className={styles.btn}><Link to = "/mypage/profile">프로필 설정</Link></button>
                        </div>
                    </div>

                    <div className={styles['sidebar-card']}>
                        <h3 className={styles['sidebar-card-title']}><Link to="/mypage">마이메뉴</Link></h3>
                        <ul className={styles['menu-list']}>
                            <li className={styles['menu-item']}>
                                <Link to="/mypage/bookmark" className={styles['menu-link']}>💾 나의 북마크</Link>
                            </li>
                            <li className={styles['menu-item']}>
                                <Link to= "/mypage/review" className={styles['menu-link']}>📝 리뷰</Link>
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
                <Outlet/>
            </div>
        </>
    )
}