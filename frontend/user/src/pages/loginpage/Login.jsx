import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const particlesRef = useRef(null);

    useEffect(() => {
        // DOM이 완전히 렌더링된 후 실행
        const timer = setTimeout(() => {
            createParticles();
            addInputEffects();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const createParticles = () => {
        const particleContainer = particlesRef.current;
        if (!particleContainer) return;

        // 기존 파티클 제거
        particleContainer.innerHTML = '';

        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = styles.particle;
            particle.style.position = 'absolute';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.background = 'rgba(25, 118, 210, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            particle.style.animation = `${styles.particleFloat} ${6 + Math.random() * 4}s ease-in-out infinite`;
            particleContainer.appendChild(particle);
        }
    };

    const addInputEffects = () => {
        const inputs = document.querySelectorAll(`.${styles.formInput}`);

        inputs.forEach(input => {
            const formGroup = input.closest(`.${styles.formGroup}`);
            if (!formGroup) return;

            const handleFocus = () => formGroup.classList.add(styles.focused);
            const handleBlur = () => {
                if (!input.value) formGroup.classList.remove(styles.focused);
            };
            const handleInput = () => {
                input.classList.add(styles.typingEffect);
                setTimeout(() => input.classList.remove(styles.typingEffect), 100);
            };

            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
            input.addEventListener('input', handleInput);

            if (input.value) formGroup.classList.add(styles.focused);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    try {
        console.log('요청 데이터:', {
            email: formData.email,
            password: formData.password
        });

        const response = await axios.post('/api/members/login', {
            email: formData.email,
            password: formData.password
        });

        // console.log('응답 전체:', response);
        // console.log('응답 데이터:', response.data);
        // console.log('응답 상태:', response.status);

        if (response.data.success) {
            navigate('/');
        } else {
            setGeneralError(response.data.message);
        }
    } catch (error) {
        // console.error('전체 에러 객체:', error);
        // console.error('에러 메시지:', error.message);
        // console.error('에러 코드:', error.code);
        // console.error('에러 설정:', error.config);
        
        if (error.response) {
            // console.error('응답 에러 - 상태:', error.response.status);
            // console.error('응답 에러 - 데이터:', error.response.data);
            // console.error('응답 에러 - 헤더:', error.response.headers);
            setGeneralError(error.response.data.message || '로그인에 실패했습니다.');
        } else if (error.request) {
            // console.error('요청 에러:', error.request);
            setGeneralError('서버에 연결할 수 없습니다.');
        } else {
            // console.error('설정 에러:', error.message);
            setGeneralError(`요청 설정 오류: ${error.message}`);
        }
    }
};

    const socialLogin = async (provider) => {
        try {
            const response = await axios.get(`api/members/${provider}/authurl`);
            const url = response.data;
            window.location.href = url;
        } catch (error) {
            if (error.response) {
                // 서버가 응답했지만 오류 상태 코드 (4xx, 5xx)
                alert(`로그인 요청에 실패했습니다: ${error.response.data || error.response.statusText}`);
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못함
                alert("서버에 연결할 수 없습니다.");
            } else {
                // 요청 설정 중에 오류 발생
                alert('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.bgAnimation}></div>
            <div ref={particlesRef} className={styles.particles}></div>

            <div className={styles.loginContainer}>
                <div className={styles.loginHeader}>
                    <h1 className={styles.loginTitle}>Welcome Back</h1>
                    <p className={styles.loginSubtitle}>로그인하여 시작하세요</p>
                </div>

                {generalError && (
                    <div className={styles.errorMessage}>{generalError}</div>
                )}

                <div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="email">이메일</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                        <div className={styles.inputIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
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
                            className={styles.formInput}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                        <div className={styles.inputIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
                            </svg>
                        </div>
                        {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
                    </div>

                    <div className={styles.formOptions}>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="remember" className={styles.checkboxLabel}>로그인 유지</label>
                        </div>
                        <a href="#" className={styles.forgotPassword}>비밀번호 찾기</a>
                    </div>

                    <button type="button" onClick={handleSubmit} className={styles.loginButton}>
                        로그인
                    </button>
                </div>

                <div className={styles.divider}>
                    <span>또는</span>
                </div>

                <div className={styles.socialLogin}>
                    <button className={styles.socialButton} type="button" onClick={() => socialLogin('google')}>
                        Google
                    </button>
                    <button className={styles.socialButton} type="button" onClick={() => socialLogin('naver')}>
                        Naver
                    </button>
                </div>

                <div className={styles.signupLink}>
                    계정이 없으신가요? <a href="/members/new">회원가입</a>
                </div>
            </div>
        </div>
    );
};

export default Login;