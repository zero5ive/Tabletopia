import { useState, useEffect } from 'react';
import styles from './MyReview.module.css'
import { getMyReviews, getCurrentUser, deleteReview } from '../utils/UserApi';

export default function MyReview() {
    // 컴포넌트 내부에 상태 추가
    const [showActionMenu, setShowActionMenu] = useState(null); // 어떤 리뷰의 메뉴인지 ID로 관리
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        fetchCurrentUser();
        fetchReviews();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await getCurrentUser();
            console.log("사용자 정보 응답:", response.data);
            // API 응답이 직접 UserInfoDTO를 반환하므로 response.data.name으로 접근
            if (response.data && response.data.name) {
                setCurrentUser(response.data.name);
            }
        } catch (error) {
            console.error('사용자 정보 조회 에러:', error);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await getMyReviews();
            console.log('리뷰 내역 조회 성공:', response.data);

            if (response.data) {
                setReviews(response.data);
            } else {
                console.error('리뷰 내역이 없습니다');
                setReviews([]);
            }
        } catch (error) {
            console.error('리뷰 내역 조회 에러:', error);
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMoreClick = (reviewId) => {
        setShowActionMenu(showActionMenu === reviewId ? null : reviewId);
    };

    const handleActionClick = (action, reviewId) => {
        console.log(`${action} 클릭됨, reviewId: ${reviewId}`);
        setShowActionMenu(null); // 메뉴 닫기

        if (action === '삭제하기') {
            handleDeleteReview(reviewId);
        } else if (action === '수정하기') {
            // 수정 기능은 추후 구현
            console.log('수정 기능은 추후 구현 예정');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteReview(reviewId);
            console.log('리뷰 삭제 성공:', reviewId);
            alert('리뷰가 삭제되었습니다.');

            // 리뷰 목록 새로고침
            fetchReviews();
        } catch (error) {
            console.error('리뷰 삭제 에러:', error);
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            alert('리뷰 삭제에 실패했습니다.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className={styles['main-panel']}>
            <div className={styles['panel-header']}>
                <h2 className={styles['panel-title']}>리뷰 내역</h2>
            </div>

            <div className={styles['review-container']}>
                {loading ? (
                    <div className={styles['loading']}>로딩중...</div>
                ) : reviews.length === 0 ? (
                    <div className={styles['empty-message']}>
                        작성한 리뷰가 없습니다.
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={styles['individual-review']}>
                            <div className={styles['review-header']}>
                                <div className={styles['reviewer-info']}>
                                    <div className={styles['reviewer-avatar']}>
                                        {currentUser}
                                    </div>
                                    <div>
                                        <div className={styles['reviewer-name']}>
                                            {currentUser}님
                                        </div>
                                        <div className={styles['review-date']}>
                                            {formatDate(review.createdAt)}
                                        </div>
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
                                    {/* <button
                                        className={styles['action-item']}
                                        onClick={() => handleActionClick('수정하기', review.id)}
                                    >
                                        <span>수정하기</span>
                                        <span className={styles['action-icon']}>✏️</span>
                                    </button> */}
                                    <button
                                        className={styles['action-item']}
                                        style={{ color: '#ff4444' }}
                                        onClick={() => handleActionClick('삭제하기', review.id)}
                                    >
                                        <span>삭제하기</span>
                                        <span className={styles['action-icon']}>🗑️</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}