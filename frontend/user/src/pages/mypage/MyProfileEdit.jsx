import styles from './MyProfileEdit.module.css'
import { useState } from 'react';
import { updateUser } from '../utils/UserApi';

export default function MyProfileEdit() {
    // 프로필 데이터 상태 관리
    const [profile, setProfile] = useState({
        id: 1,
        name: '김철수',
        email: 'user@example.com',
        phoneNumber: '010-1234-5678',
    });

    const [loading, setLoading] = useState(false);

    // 입력 필드 변경 핸들러
    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 저장 핸들러
    const handleSave = async () => {
        if (loading) return;

        // 유효성 검사
        if (!profile.name || !profile.email || !profile.phoneNumber) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const userInfoDTO = {
                name: profile.name,
                email: profile.email,
                phoneNumber: profile.phoneNumber
            };

            const response = await updateUser(profile.id, userInfoDTO);
            console.log('프로필 저장 성공:', response.data);
            alert(response.data);
        } catch (error) {
            console.error('프로필 저장 실패:', error);

            // 백엔드 validation 에러 메시지 표시
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>프로필 설정</h2>
                </div>
                <div className={styles['edit-container']}>
                    
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
                                value={profile.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                placeholder={profile.phoneNumber}
                            />
                        </div>
                    </div>

                    {/* 저장 버튼 */}
                    <div className={styles['form-actions']}>
                        <button
                            className={styles['save-btn']}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? '저장 중...' : '저장하기'}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}