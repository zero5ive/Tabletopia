import styles from './MyProfileEdit.module.css'
import { useState } from 'react';

export default function MyProfileEdit() {
    // 프로필 데이터 상태 관리
    const [profile, setProfile] = useState({
        profileImage: null,
        name: '김철수',
        email: 'user@example.com',
        phone: '010-1234-5678',
        nickname: '맛집헌터',
        birth: '1990-01-01',
        gender: 'male'
    });

    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile(prev => ({
                    ...prev,
                    profileImage: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // 입력 필드 변경 핸들러
    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 저장 핸들러
    const handleSave = () => {
        console.log('프로필 저장:', profile);
        alert('프로필이 저장되었습니다!');
    };

    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>프로필 설정</h2>
                </div>
                <div className={styles['edit-container']}>
                    
                    {/* 프로필 이미지 섹션 */}
                    <div className={styles['profile-section']}>
                        <div className={styles['profile-image-container']}>
                            <div className={styles['profile-image-wrapper']}>
                                {profile.profileImage ? (
                                    <img 
                                        src={profile.profileImage} 
                                        alt="프로필" 
                                        className={styles['profile-image']}
                                    />
                                ) : (
                                    <div className={styles['profile-placeholder']}>
                                        👤
                                    </div>
                                )}
                                <label className={styles['image-upload-btn']}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    📷
                                </label>
                            </div>
                            <p className={styles['image-help-text']}>프로필 사진을 변경하려면 카메라 아이콘을 클릭하세요</p>
                        </div>
                    </div>

                    {/* 기본 정보 섹션 */}
                    <div className={styles['form-section']}>
                        <h3 className={styles['section-title']}>기본 정보</h3>
                        
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>이름</label>
                            <input 
                                type="text"
                                className={styles['form-input']}
                                value={profile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="이름을 입력하세요"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>닉네임</label>
                            <input 
                                type="text"
                                className={styles['form-input']}
                                value={profile.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                placeholder="닉네임을 입력하세요"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>이메일</label>
                            <input 
                                type="email"
                                className={styles['form-input']}
                                value={profile.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="이메일을 입력하세요"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>휴대폰</label>
                            <input 
                                type="tel"
                                className={styles['form-input']}
                                value={profile.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="010-0000-0000"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>생년월일</label>
                            <input 
                                type="date"
                                className={styles['form-input']}
                                value={profile.birth}
                                onChange={(e) => handleInputChange('birth', e.target.value)}
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>성별</label>
                            <div className={styles['radio-group']}>
                                <label className={styles['radio-label']}>
                                    <input 
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={profile.gender === 'male'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    />
                                    <span>남성</span>
                                </label>
                                <label className={styles['radio-label']}>
                                    <input 
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={profile.gender === 'female'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    />
                                    <span>여성</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 저장 버튼 */}
                    <div className={styles['form-actions']}>
                        <button 
                            className={styles['save-btn']}
                            onClick={handleSave}
                        >
                            저장하기
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}