import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SignUpSuccess.module.css';

const SignUpSuccess = () => {
    const particlesRef = useRef(null);
    const [showRedirectTimer, setShowRedirectTimer] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // 회원가입에서 전달받은 데이터
    const location = useLocation();
    const memberName = location.state?.memberName || '';
    const memberEmail = location.state?.memberEmail || '';

    // 파티클 생성
    const createParticles = () => {
        const particleContainer = particlesRef.current;
        if (!particleContainer) return;

        // 기존 파티클 제거
        particleContainer.innerHTML = '';

        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = styles.particle;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            particleContainer.appendChild(particle);
        }
    };

    // 자동 리다이렉트 타이머 (선택사항)
    useEffect(() => {
        createParticles();

        // 자동 리다이렉트를 원한다면 주석 해제
        // const timer = setTimeout(() => {
        //   setShowRedirectTimer(true);
        // }, 3000);

        // const redirectTimer = setInterval(() => {
        //   setCountdown(prev => {
        //     if (prev <= 1) {
        //       window.location.href = '/login';
        //       return 0;
        //     }
        //     return prev - 1;
        //   });
        // }, 1000);

        // return () => {
        //   clearTimeout(timer);
        //   clearInterval(redirectTimer);
        // };
    }, []);

    const handleLoginClick = () => {
        window.location.href = '/members/login';
    };

    const handleHomeClick = () => {
        window.location.href = '/';
    };

    const CheckIcon = () => (
        <svg viewBox="0 0 24 24">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
        </svg>
    );

    const InfoIcon = () => (
        <svg className={styles.infoIcon} viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,14H13V16H11V14M11,8H13V12H11V8Z" />
        </svg>
    );

    return (
        <div className={styles.signupSuccessPage}>
            {/* 배경 애니메이션 */}
            <div className={styles.bgAnimation}></div>

            {/* 파티클 효과 */}
            <div ref={particlesRef} className={styles.particles}></div>

            {/* 성공 메시지 컨테이너 */}
            <div className={styles.successContainer}>
                {/* 성공 아이콘 */}
                <div className={styles.successIcon}>
                    <CheckIcon />
                </div>

                {/* 제목 */}
                <h1 className={styles.successTitle}>회원가입 완료!</h1>

                {/* 부제목 */}
                <p className={styles.successSubtitle}>
                    환영합니다! 회원가입이 성공적으로 완료되었습니다.
                </p>

                {/* 사용자 정보 (옵션) */}
                {memberName && (
                    <div className={styles.userInfo}>
                        <div className={styles.userId}>{memberName}님</div>
                        <div className={styles.userId}>{memberEmail}</div>
                        <div className={styles.welcomeText}>이제 모든 서비스를 이용하실 수 있습니다</div>
                    </div>
                )}

                {/* 액션 버튼들 */}
                <div className={styles.actionButtons}>
                    <button
                        onClick={handleLoginClick}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        로그인하기
                    </button>
                    <button
                        onClick={handleHomeClick}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                        홈으로
                    </button>
                </div>

                {/* 추가 정보 */}
                <div className={styles.additionalInfo}>
                    <div className={styles.infoItem}>
                        <InfoIcon />
                        <span>로그인 후 테이블토피아를 이용해보세요</span>
                    </div>
                </div>

                {/* 자동 리다이렉트 타이머 (선택사항) */}
                {showRedirectTimer && (
                    <div className={styles.redirectTimer}>
                        <div className={styles.timerCircle}></div>
                        <span id="timerText">
                            {countdown}초 후 로그인 페이지로 이동합니다...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpSuccess;