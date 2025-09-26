import { useState } from 'react';
import styles from './ReviewWrite.module.css';

export default function ReviewWrite() {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [photos, setPhotos] = useState([]);

    // 별점 선택
    const handleStarClick = (value) => {
        setRating(value);
    };

    // 글자수 카운팅
    const handleTextChange = (e) => {
        setReviewText(e.target.value);
    };

    // 태그 토글
    const toggleTag = (tagText) => {
        setSelectedTags(prev =>
            prev.includes(tagText)
                ? prev.filter(tag => tag !== tagText)
                : [...prev, tagText]
        );
    };

    // 사진 업로드
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        // 최대 5장 제한
        if (photos.length + files.length <= 5) {
            setPhotos(prev => [...prev, ...files]);
        }
    };

    return (
        <>
            {/* 기존 header 코드 */}
            <header className={styles['header']}>
                <div className={styles['container']}>
                    <div className={styles['header-content']}>
                        <button className={styles['back-btn']} onClick={() => history.back()}>👈</button>
                        <h1 className={styles['header-title']}>리뷰 작성</h1>
                    </div>
                </div>
            </header>

            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    <div className={styles['review-container']}>
                        {/* 기존 sidebar 코드 */}
                        <aside className={styles['sidebar']}>
                            <div className={styles['reservation-card']}>
                                <div className={styles['reservation-header']}>
                                    <h2 className={styles['restaurant-name']}>더 스테이크 하우스</h2>
                                    <div className={styles['restaurant-location']}>
                                        <span className={styles['detail-icon']}>📍</span>
                                        <span>강남구 청담동</span>
                                    </div>

                                    <div className={styles['reservation-details']}>
                                        <div className={styles['detail-item']}>
                                            <span className={styles['detail-icon']}>📅</span>
                                            <span>2025.09.15 (일) 19:00</span>
                                        </div>
                                        <div className={styles['detail-item']}>
                                            <span className={styles['detail-icon']}>👥</span>
                                            <span>4명</span>
                                        </div>
                                        <div className={styles['detail-item']}>
                                            <span className={styles['detail-icon']}>💳</span>
                                            <span>예약금 40,000원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className={styles['main-form']}>
                            <form className={styles['review-form']}>
                                {/* 별점 섹션 */}
                                <div className={styles['form-section']}>
                                    <h3 className={styles['section-title']}>어떠셨나요?</h3>
                                    <p className={styles['section-description']}>솔직한 후기는 다른 고객들에게 큰 도움이 됩니다</p>

                                    <div className={styles['rating-container']}>
                                        <div className={styles['overall-rating-section']}>
                                            <div className={styles['overall-rating-title']}>전체적인 만족도</div>
                                            <div className={styles['star-rating']}>
                                                {[1, 2, 3, 4, 5].map(value => (
                                                    <span
                                                        key={value}
                                                        className={`${styles['star']} ${rating >= value ? styles['active'] : ''}`}
                                                        onClick={() => handleStarClick(value)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>
                                            <div className={styles['rating-text']}>
                                                {rating > 0 ? `${rating}점` : '별점을 선택해주세요'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 텍스트 리뷰 섹션 */}
                                <div className={styles['form-section']}>
                                    <h3 className={styles['section-title']}>자세한 후기를 들려주세요</h3>
                                    <p className={styles['section-description']}>음식, 서비스, 분위기 등 경험하신 내용을 자유롭게 작성해주세요</p>

                                    <div className={styles['review-text-section']}>
                                        <textarea
                                            className={styles['textarea']}
                                            value={reviewText}
                                            onChange={handleTextChange}
                                            placeholder="맛있게 드셨나요? 어떤 점이 좋았는지, 아쉬웠는지 솔직한 후기를 남겨주세요.&#10;&#10;예시:&#10;• 스테이크가 정말 부드럽고 맛있었어요&#10;• 직원분들이 친절하고 서비스가 좋았습니다"
                                            maxLength={500}
                                            style={{
                                                color: '#333',
                                                backgroundColor: '#fff',
                                                fontSize: '16px'
                                            }}
                                        />
                                        <div className={styles['char-count']}>{reviewText.length} / 500</div>
                                    </div>
                                </div>

                                {/* 사진 업로드 섹션 */}
                                <div className={styles['form-section']}>
                                    <h3 className={styles['section-title']}>사진 추가하기</h3>
                                    <p className={styles['section-description']}>음식이나 매장 사진을 올려주세요 (최대 5장)</p>

                                    <div className={styles['photo-section']}>
                                        <div className={styles['photo-grid']}>
                                            <label className={styles['photo-upload-btn']}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handlePhotoUpload}
                                                    style={{ display: 'none' }}
                                                />
                                                <div style={{ fontSize: "24px" }}>📷</div>
                                                <div>사진 추가 ({photos.length}/5)</div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* 태그 섹션 */}
                                <div className={styles['form-section']}>
                                    <h3 className={styles['section-title']}>어떤 특징이 있나요?</h3>
                                    <p className={styles['section-description']}>해당되는 태그를 선택해주세요</p>

                                    <div className={styles['tags-section']}>
                                        <div className={styles['tag-grid']}>
                                            {['맛있어요', '친절해요', '분위기 좋아요', '가성비 좋아요', '양이 많아요', '깔끔해요', '데이트하기 좋아요', '가족식사 좋아요', '재방문 의사 있어요', '주차 편해요'].map(tag => (
                                                <div
                                                    key={tag}
                                                    className={`${styles['tag-item']} ${selectedTags.includes(tag) ? styles['selected'] : ''}`}
                                                    onClick={() => toggleTag(tag)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles['form-actions']}>
                                    <button type="button" className={`${styles['btn']} ${styles['btn-cancel']}`} onClick={() => history.back()}>취소</button>
                                    <button
                                        type="submit"
                                        className={`${styles['btn']} ${styles['btn-submit']} ${rating > 0 && reviewText.length > 0 ? '' : styles['disabled']}`}
                                        disabled={rating === 0 || reviewText.length === 0}
                                    >
                                        리뷰 등록하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}