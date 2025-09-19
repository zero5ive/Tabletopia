import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './SignUp.module.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailLocal: '',        // @ 앞부분
    emailDomain: 'gmail.com', // @ 뒷부분
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const particlesRef = useRef(null);
  const navigate = useNavigate();

  // 이메일 도메인 옵션
  const emailDomains = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'kakao.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com'
  ];

  // 파티클 생성
  useEffect(() => {
    createParticles();
    addInputEffects();
  }, []);

  // 폼 유효성 검사
  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  // 비밀번호 확인 체크
  useEffect(() => {
    checkPasswordMatch();
  }, [formData.password, formData.confirmPassword]);

  const createParticles = () => {
    const particleContainer = particlesRef.current;
    if (!particleContainer) return;

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
    setTimeout(() => {
      const inputs = document.querySelectorAll(`.${styles.formInput}`);
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
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 클리어
    if (errors[name] || (name.startsWith('email') && errors.email)) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        email: '' // 이메일 관련 에러 클리어
      }));
    }

    // 비밀번호 강도 체크
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  };

  const checkPasswordMatch = () => {
    if (formData.confirmPassword === '') {
      setPasswordMatch('');
    } else if (formData.password === formData.confirmPassword) {
      setPasswordMatch('valid');
    } else {
      setPasswordMatch('invalid');
    }
  };

  const checkFormValidity = () => {
    const { name, emailLocal, emailDomain, password, confirmPassword } = formData;
    const isValid = name && emailLocal && emailDomain && password &&
      confirmPassword && (password === confirmPassword);
    setIsFormValid(isValid);
  };

  // 완전한 이메일 주소 생성
  const getFullEmail = () => {
    return `${formData.emailLocal}@${formData.emailDomain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 프론트엔드 유효성 검사
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.emailLocal.trim()) newErrors.emailLocal = '이메일 아이디를 입력해주세요.';
    if (!formData.emailDomain) newErrors.emailDomain = '이메일 도메인을 선택해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이메일 유효성 검사
    const emailRegex = /^[a-zA-Z0-9._-]+$/;
    if (formData.emailLocal && !emailRegex.test(formData.emailLocal)) {
      newErrors.emailLocal = '올바른 이메일 형식이 아닙니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const fullEmail = getFullEmail();

      const response = await fetch('/api/members/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: fullEmail, // 완전한 이메일 주소 전송
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // 회원가입 성공
        navigate('/members/new/success', {
          state: {
            memberName: data.data.memberName,  // 서버에서 받은 이름
            memberEmail: fullEmail
          }
        });
      } else {
        setGlobalError(data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setGlobalError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength >= 4) return styles.strengthStrong;
    if (passwordStrength >= 3) return styles.strengthMedium;
    if (passwordStrength >= 2) return styles.strengthWeak;
    return '';
  };

  const getPasswordMatchText = () => {
    if (passwordMatch === 'valid') return '✓ 비밀번호가 일치합니다';
    if (passwordMatch === 'invalid') return '✗ 비밀번호가 일치하지 않습니다';
    return '';
  };

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
      {/* 배경 애니메이션 */}
      <div className={styles.bgAnimation}></div>

      {/* 파티클 효과 */}
      <div ref={particlesRef} className={styles.particles}></div>

      {/* 회원가입 폼 */}
      <div className={styles.signupContainer}>
        <div className={styles.signupHeader}>
          <h1 className={styles.signupTitle}>Create Account</h1>
          <p className={styles.signupSubtitle}>새로운 계정을 만들어 시작하세요</p>
        </div>

        {/* 글로벌 에러 메시지 */}
        {globalError && (
          <div className={styles.errorMessage}>
            <p>{globalError}</p>
          </div>
        )}

        <div>
          {/* 이메일 입력 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">이메일</label>
            <div className={styles.emailInputContainer}>
              <input
                type="text"
                id="emailLocal"
                name="emailLocal"
                value={formData.emailLocal}
                onChange={handleInputChange}
                className={`${styles.formInput} ${styles.emailLocal} ${errors.emailLocal ? styles.error : ''}`}
                placeholder="이메일 아이디"
                required
              />
              <span className={styles.emailSeparator}>@</span>
              <select
                id="emailDomain"
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleInputChange}
                className={`${styles.emailDomainSelect} ${errors.emailDomain ? styles.error : ''}`}
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
            {(errors.emailLocal || errors.emailDomain) && (
              <div className={styles.fieldError}>
                <span>{errors.emailLocal || errors.emailDomain}</span>
              </div>
            )}
          </div>

          {/* 이름 입력 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
              placeholder="이름"
              required
            />
            {errors.name && (
              <div className={styles.fieldError}>
                <span>{errors.name}</span>
              </div>
            )}
          </div>

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
            {errors.password && (
              <div className={styles.fieldError}>
                <span>{errors.password}</span>
              </div>
            )}
            <div className={styles.inputIcon}>
              <LockIcon />
            </div>
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={`${styles.strengthBar} ${getPasswordStrengthClass()}`}></div>
              </div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {errors.confirmPassword && (
              <div className={styles.fieldError}>
                <span>{errors.confirmPassword}</span>
              </div>
            )}
            <div className={`${styles.passwordMatch} ${passwordMatch}`}>
              {getPasswordMatchText()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className={styles.signupButton}
            disabled={!isFormValid}
          >
            회원가입
          </button>
        </div>

        <div className={styles.loginLink}>
          이미 계정이 있으신가요? <a href="/members/login">로그인</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;