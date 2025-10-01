import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"; 
import axios from 'axios';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';

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

    // 바뀌는지 여부 체크하는 메서드
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    //승인요청 핸들러
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

            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
                
            })
            // reponse찍어보기
            console.log(response);
            const data = await response.json();
            console.log('JSON으로 변환한 응답객체=====',data);
            
            if (data.success && data.accessToken!==undefined) {
                // JWT 토큰을 localStorage에 저장합니다.
                // console.log("토큰을 localStorage에 저장합니다");
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/');
            } else {
                setGeneralError(data.message);
            }
        } catch (error) {
            if (error.response) {
                setGeneralError(error.response.data.message || '로그인에 실패했습니다.');
            } else if (error.request) {
                setGeneralError('서버에 연결할 수 없습니다.');
            } else {
                setGeneralError(`요청 설정 오류: ${error.message}`);
            }
        }
    };

    const socialLogin = (provider)=>{
    //원래는 각 provider별로 인증 url이 다르므로, 조건으로 처리해야 하지만
    //spring boot에서 지원하는 oath2 라이브러리를 사용중이므로, 이 url을 서버측 스프링이 알아서 처리해 줌
        window.location.href=`http://localhost:10022/api/user/oauth2/authorization/${provider}`;
    }

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
                            <i className="fas fa-user"></i>
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
                            <i className="fas fa-lock"></i>
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
                    <button className={`${styles.socialButton} ${styles.google}`} type="button" onClick={() => socialLogin('google')}>
                        Google
                    </button>
                    <button className={`${styles.socialButton} ${styles.naver}`} type="button" onClick={() => socialLogin('naver')}>
                        Naver
                    </button>
                    <button className={`${styles.socialButton} ${styles.kakao}`} type="button" onClick={() => socialLogin('kakao')}>
                        Kakao
                    </button>
                </div>

                <div className={styles.signupLink}>
                    계정이 없으신가요? <Link to='/users/signup'>회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;