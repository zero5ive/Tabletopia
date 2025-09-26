// import styles from './Header.module.css'

// export function MainHeader() {
//     return (
//         <>
//             <div className={styles.searchContainer}>
//                 <input 
//                     type="text" 
//                     className={styles.searchBox} 
//                     placeholder="지역, 음식 또는 레스토랑명을 검색해보세요" 
//                 />
//             </div>
//             <div className={styles.locationSelector}>📍 강남</div>
//             <div className={styles.userActions}>
//                 <button className={`${styles.btn} ${styles.btnSecondary}`}>로그인</button>
//                 <button className={`${styles.btn} ${styles.btnPrimary}`}>회원가입</button>
//             </div>
//         </>
//     )
// }

import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css'

export function MainHeader() {
    const navigate = useNavigate();

    /**
     * 로그인 페이지로 이동
     * 
     * TODO : 가입된유저 알러트//백엔드에서 존재하는 유저는 로그인처리 되도록 구현
     */
    const handleLogin = () => {
        navigate('/users/loginform');
    };

    /**
     * 회원가입 페이지로 이동
     */
    const handleSignUp = () => {
        navigate('/members/new');
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
            <div className={styles.locationSelector}>📍 강남</div>
            <div className={styles.userActions}>
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
            </div>
        </>
    )
}