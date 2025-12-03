import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import userApi from '../utils/UserApi';
const Login = () => {
    // 로그인 완료 후 페이지 이동용 함수
    const navigate = useNavigate();
    
    // 로그인 폼의 초기상태 (이메일, 도메인, 비밀번호)
    const [formData, setFormData] = useState({
        emailLocal: '',
        emailDomain: 'gmail.com',
        password: ''
    });
    
    // front단 입력값 유효성 에러 저장을 위한 변수
    const [errors, setErrors] = useState({});
    
    // 서버에서 내려오는 전역에러 메시지
    const [globalError, setGlobalError] = useState('');

    // 폼 전체 유효성 여부 (버튼 활성/비활성용)
    const [isFormValid, setIsFormValid] = useState(false);

    // 배경 파티클 애니메이션
    const particlesRef = useRef(null);

    // 이메일 도메인 선택 리스트
    const emailDomains = [
        'gmail.com',
        'naver.com',
        'daum.net',
        'kakao.com',
        'yahoo.com'
    ];

    // 최초 렌더링 시 파티클 생성, input 포커스 효과 등록
    useEffect(() => {
        const timer = setTimeout(() => {
            createParticles();
            addInputEffects();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // formData가 변경될 때마다 폼 유효성을 재검사 하기위한 메서드
    useEffect(() => {
        checkFormValidity();
    }, [formData]);

    // 배경에 떠다니는 파티클 생성 함수(Design)
    const createParticles = () => {
        const particleContainer = particlesRef.current;
        if (!particleContainer) return;
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

    // input 포커스 시 label 애니메이션 효과 처리
    const addInputEffects = () => {
        const inputs = document.querySelectorAll(`.${styles.formInput}, .${styles.emailDomainSelect}`);
        inputs.forEach(input => {
            const formGroup = input.closest(`.${styles.formGroup}`);
            if (!formGroup) return;

            const handleFocus = () => formGroup.classList.add(styles.focused);
            const handleBlur = () => {
                if (!input.value) formGroup.classList.remove(styles.focused);
            };

            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });
    };

    // input 값 변경 시 formData 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // 에러가 발생했던 필드 재입력 시 에러 제거를 위한 메서드
        if (errors[name] || (name.startsWith('email') && errors.email)) {
            setErrors(prev => ({ ...prev, [name]: '', email: '' }));
        }
    };

    // 이메일 + 비밀번호 값 존재여부로 버튼 활성화
    const checkFormValidity = () => {
        const { emailLocal, password } = formData;
        setIsFormValid(emailLocal.trim() !== '' && password !== '');
    };

    // 로그인폼 제출 시 실행(로그인 버튼 클릭시 submit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // 입력값을 검증
        if (!formData.emailLocal.trim()) newErrors.email = '이메일을 입력해주세요.';
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 이메일 조합(입력값(local) + 도메인(domain))
        const fullEmail = `${formData.emailLocal}@${formData.emailDomain}`;

        try {
            // 백엔드에 로그인 API 요청
            const response = await userApi.post('/api/user/auth/login', {
                email: fullEmail,
                password: formData.password
            });
            
            const data = response.data;
            
            // 로그인 성공 시 accessToken 저장
            if (data.success && data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                console.log('[Login] 로그인 성공, accessToken 저장 완료');

                // 페이지 새로고침하여 WebSocketContext를 완전히 재초기화
                window.location.href = '/';
            } else {
                setGlobalError(data.message || '로그인 정보가 올바르지 않습니다.');
            }
        } catch (error) {
            // 서버 응답이 있는 경우(이 경우 서버(backend에서 설정한 에러 메시지를 반환))
            if (error.response) {
                setGlobalError(error.response.data.message || '로그인 정보가 올바르지 않습니다.');
            // 요청을 보내는데 성공했지만 응답이 없는 경우
            } else if (error.request) {
                setGlobalError('서버에서 응답이 없습니다. 네트워크를 확인해주세요.');
            // 그 외 예외처리
            } else {
                setGlobalError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    /* 소셜 로그인용(현재는 비활성화)
    const socialLogin = (provider) => {
        window.location.href = `http://localhost:10022/api/user/oauth2/authorization/${provider}`;
    }
    */
    // 사용자 Icon 컴포넌트
    const UserIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    );
    // 자물쇠 Icon 컴포넌트
    const LockIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
        </svg>
    );

    // 로그인 화면 렌더링
    return (
        <div className={styles.loginPage}>
            <div className={styles.bgAnimation}></div>
            <div ref={particlesRef} className={styles.particles}></div>

            <div className={styles.loginContainer}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.loginTitle}>TableTopia</h1>
                    <p className={styles.loginSubtitle}>로그인하여 시작하세요</p>
                </div>

                {/* 서버 에러 출력 */}
                {globalError && (
                    <div className={styles.errorMessage}>{globalError}</div>
                )}
                <form onSubmit={handleSubmit}>

                    {/* 이메일 입력 폼 start*/}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="emailLocal">이메일</label>
                        <div className={styles.emailInputContainer}>
                            <input
                                type="text"
                                id="emailLocal"
                                name="emailLocal"
                                value={formData.emailLocal}
                                onChange={handleInputChange}
                                className={`${styles.formInput} ${styles.emailLocal} ${errors.email ? styles.error : ''}`}
                                placeholder="이메일 아이디"
                                required
                            />
                            <span className={styles.emailSeparator}>@</span>
                            <select
                                id="emailDomain"
                                name="emailDomain"
                                value={formData.emailDomain}
                                onChange={handleInputChange}
                                className={`${styles.emailDomainSelect} ${errors.email ? styles.error : ''}`}
                                required
                            >
                                {emailDomains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                            <div className={styles.inputIcon}>
                                <UserIcon />
                            </div>
                        </div>
                        {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
                    </div>
                    {/* 이메일 입력 폼 end */}
                                
                    {/* 비밀번호 입력 */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                        <div className={styles.inputIcon}>
                            <LockIcon />
                        </div>
                        {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
                    </div>
                    
                    {/* 옵션 영역 */}
                    <div className={styles.formOptions}>
                        <div className={styles.checkboxGroup}></div>
                        <a href="#" className={styles.forgotPassword}>비밀번호 찾기</a>
                    </div>
                        
                    {/* 로그인 버튼 */}
                    <button type="submit" className={styles.loginButton} disabled={!isFormValid}>
                        로그인
                    </button>
                </form>
                
                {/* 회원가입 페이지 이동버튼 */}
                <div className={styles.signupLink}>
                    계정이 없으신가요? <Link to='/users/signup'>회원가입</Link>
                </div>

                {/* 메인 페이지 이동버튼 */}
                <div className={styles.signupLink}>
                    <a href="/">홈페이지 메인화면으로 돌아가기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;