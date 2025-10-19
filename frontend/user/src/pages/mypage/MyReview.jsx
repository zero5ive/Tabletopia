import { useState } from 'react';
import styles from './MyReview.module.css'

export default function MyReview() {
    // 컴포넌트 내부에 상태 추가
    const [showActionMenu, setShowActionMenu] = useState(null); // 어떤 리뷰의 메뉴인지 ID로 관리

    const handleMoreClick = (reviewId) => {
        setShowActionMenu(showActionMenu === reviewId ? null : reviewId);
    };

    const handleActionClick = (action) => {
        console.log(`${action} 클릭됨`);
        setShowActionMenu(null); // 메뉴 닫기
    };

    // 임시 데이터 (추후 API 연동)
    const reviews = [
        {
            id: 1,
            restaurantName: '더 스테이크 하우스',
            userName: '김철수',
            rating: 5,
            date: '2025.08.28',
            comment: '정말 최고의 스테이크 하우스였습니다! 고기의 육질이 정말 부드럽고 맛있었어요. 특히 립아이 스테이크는 완벽한 미디움 레어로 구워져서 육즙이 가득했습니다.'
        }
    ];

    return (
        <div className={styles['main-panel']}>
            <div className={styles['panel-header']}>
                <h2 className={styles['panel-title']}>리뷰 내역</h2>
            </div>

            <div className={styles['review-container']}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles['individual-review']}>
                        <div className={styles['review-header']}>
                            <div className={styles['reviewer-info']}>
                                <div className={styles['reviewer-avatar']}>
                                    {review.userName.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles['reviewer-name']}>{review.userName}님</div>
                                    <div className={styles['review-date']}>{review.date}</div>
                                </div>
                            </div>
                            <div className={styles['review-actions']}>
                                <div className={styles['review-rating']}>
                                    {'⭐'.repeat(review.rating)}
                                </div>
                                <button
                                    className={styles['more-btn']}
                                    onClick={() => handleMoreClick(review.id)}
                                >
                                    ⋮
                                </button>
                            </div>
                        </div>

                        <div className={styles['restaurant-info']}>
                            <span className={styles['restaurant-label']}>식당:</span>
                            <span className={styles['restaurant-name']}>{review.restaurantName}</span>
                        </div>

                        <div className={styles['review-text']}>
                            {review.comment}
                        </div>

                        {/* 더보기 버튼 클릭 시 나타나는 메뉴 */}
                        {showActionMenu === review.id && (
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
                ))}
            </div>
        </div>
    );
}