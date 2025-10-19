import { useState } from 'react';
import styles from './MyWaiting.module.css'

export default function MyReview() {
    // 컴포넌트 내부에 상태 추가
    const [showActionMenu, setShowActionMenu] = useState(false);

    const handleMoreClick = () => {
        setShowActionMenu(!showActionMenu);
    };

    const handleActionClick = (action) => {
        console.log(`${action} 클릭됨`);
        setShowActionMenu(false); // 메뉴 닫기
    };

    return (
        <div className={styles['main-panel']}>
            <div className={styles['panel-header']}>
                <h2 className={styles['panel-title']}>리뷰 내역</h2>
            </div>


            <div className={styles['review-container']}>
                <div className={styles['individual-review']}>
                    <div className={styles['review-header']}>
                        <div className={styles['restaurant-info']}>
                            <div className={styles['restaurant-title']}>더 스테이크 하우스</div>
                            <div className={styles['review-date']}>2025.08.28</div>
                        </div>
                        <div className={styles['review-actions']}>
                            <div className={styles['review-rating']}>⭐⭐⭐⭐⭐</div>
                            <button
                                className={styles['more-btn']}
                                onClick={handleMoreClick}
                            >
                                ⋮
                            </button>
                        </div>
                    </div>
                    <img src="#" alt="리뷰 이미지" className={styles['review-image']} />
                    <div className={styles['review-text']}>
                        정말 최고의 스테이크 하우스였습니다! 고기의 육질이 정말 부드럽고 맛있었어요.
                        특히 립아이 스테이크는 완벽한 미디움 레어로 구워져서 육즙이 가득했습니다.
                        와인 추천도 훌륭했고, 직원분들의 서비스도 정말 친절했어요.
                        분위기도 로맨틱하고 고급스러워서 특별한 날 데이트하기 완벽한 곳이에요. 재방문 의사 100%입니다!
                    </div>

                    {/* 리뷰 태그 섹션 */}
                    <div className={styles['review-tags']}>
                        <div className={styles['tag-item']}>
                            <span className={styles['tag-emoji']}>😋</span>
                            <span className={styles['tag-text']}>음식이 맛있어요</span>
                        </div>
                        <div className={styles['tag-item']}>
                            <span className={styles['tag-emoji']}>😊</span>
                            <span className={styles['tag-text']}>친절해요</span>
                        </div>
                        <div className={styles['tag-item']}>
                            <span className={styles['tag-emoji']}>💰</span>
                            <span className={styles['tag-text']}>가성비 좋아요</span>
                        </div>
                        <div className={styles['tag-item']}>
                            <span className={styles['tag-emoji']}>💕</span>
                            <span className={styles['tag-text']}>데이트하기 좋아요</span>
                        </div>
                    </div>

                    {/* 더보기 버튼 클릭 시 나타나는 메뉴 */}
                    {showActionMenu && (
                        <div className={styles['action-menu']}>
                            <button
                                className={styles['action-item']}
                                onClick={() => handleActionClick('수정하기')}
                            >
                                <span>수정하기</span>
                                <span className={styles['action-icon']}>✏️</span>
                            </button>
                            <button
                                className={styles['action-item']}
                                style={{ color: '#ff4444' }}
                                onClick={() => handleActionClick('삭제하기')}
                            >
                                <span>삭제하기</span>
                                <span className={styles['action-icon']}>🗑️</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}