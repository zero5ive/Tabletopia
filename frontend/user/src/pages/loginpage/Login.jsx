import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import userApi from '../utils/UserApi';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailLocal: '',
        emailDomain: 'gmail.com',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const particlesRef = useRef(null);

    const emailDomains = [
        'gmail.com',
        'naver.com',
        'daum.net',
        'kakao.com',
        'yahoo.com'
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            createParticles();
            addInputEffects();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        checkFormValidity();
    }, [formData]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name] || (name.startsWith('email') && errors.email)) {
            setErrors(prev => ({ ...prev, [name]: '', email: '' }));
        }
    };

    const checkFormValidity = () => {
        const { emailLocal, password } = formData;
        setIsFormValid(emailLocal.trim() !== '' && password !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.emailLocal.trim()) newErrors.email = '이메일을 입력해주세요.';
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const fullEmail = `${formData.emailLocal}@${formData.emailDomain}`;

        try {
            const response = await userApi.post('/api/user/auth/login', {
                email: fullEmail,
                password: formData.password
            });
            
            const data = response.data;
            
            if (data.success && data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                console.log('[Login] 로그인 성공, accessToken 저장 완료');

                // 페이지 새로고침하여 WebSocketContext를 완전히 재초기화
                window.location.href = '/';
            } else {
                setGlobalError(data.message || '로그인 정보가 올바르지 않습니다.');
            }
        } catch (error) {
            if (error.response) {
                setGlobalError(error.response.data.message || '로그인 정보가 올바르지 않습니다.');
            } else if (error.request) {
                setGlobalError('서버에서 응답이 없습니다. 네트워크를 확인해주세요.');
            } else {
                setGlobalError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    // const socialLogin = (provider) => {
    //     window.location.href = `http://localhost:10022/api/user/oauth2/authorization/${provider}`;
    // }

    const UserIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    );

    const LockIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
        </svg>
    );

    return (
        <div className={styles.loginPage}>
            <div className={styles.bgAnimation}></div>
            <div ref={particlesRef} className={styles.particles}></div>

            <div className={styles.loginContainer}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.loginTitle}>TableTopia</h1>
                    <p className={styles.loginSubtitle}>로그인하여 시작하세요</p>
                </div>

                {globalError && (
                    <div className={styles.errorMessage}>{globalError}</div>
                )}

                <form onSubmit={handleSubmit}>
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

                    <div className={styles.formOptions}>
                        <div className={styles.checkboxGroup}></div>
                        <a href="#" className={styles.forgotPassword}>비밀번호 찾기</a>
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={!isFormValid}>
                        로그인
                    </button>
                </form>

                <div className={styles.signupLink}>
                    계정이 없으신가요? <Link to='/users/signup'>회원가입</Link>
                </div>
                <div className={styles.signupLink}>
                    <a href="/">홈페이지 메인화면으로 돌아가기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;