import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export function MainHeader() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
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

    return (
        <>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchBox}
                    placeholder="지역, 음식 또는 레스토랑명을 검색해보세요"
                />
            </div>
            <div className={styles.searchButton}>
                <div className={styles.searchIcon}></div>
            </div>
            <div className={styles.userActions}>
                {isLoggedIn ? (
                    <>
                        <button
                            className={`${styles.btn} ${styles.iconButton}`}
                            onClick={handleMyPage}
                            aria-label="My Page"
                        >
                            <i className="fas fa-user"></i>
                        </button>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
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