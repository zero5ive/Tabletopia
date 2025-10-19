import React from 'react';
import styles from '../RestaurantDetail.module.css';
import { getRestaurantReviews } from '../../utils/RestaurantReviewApi';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';

export default function ReviewsTab({ restaurantDetail }) {

    const [review, setReview] = useState([]);
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    //레스토랑 리뷰 함수
    const fetchRestaurantReviews = async (restaurantId, page = 0) => {
        const response = await getRestaurantReviews(restaurantId, page, pageSize);
        console.log('레스토랑 리뷰 (페이징)', response.data);
        setReview(response.data.content || []);
        setTotalPages(response.data.page?.totalPages || 0);
        setTotalElements(response.data.page?.totalElements || 0);
        setCurrentPage(page);
    }

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantReviews(restaurantId, 0);
        }
    }, [restaurantId])

    const handlePageChange = (page) => {
        fetchRestaurantReviews(restaurantId, page);
    }

    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>리뷰</div>
            <div className={styles["review-summary"]}>
                <div className={styles["review-score"]}>{restaurantDetail.averageRating}</div>
                <div className={styles["review-total"]}>총 {totalElements}개의 리뷰</div>
                <div className={styles["review-breakdown"]}>
                    {/* <div className={styles["breakdown-item"]}>
                        <div className={styles["breakdown-label"]}>5점</div>
                        <div className={styles["breakdown-score"]}>45명</div>
                    </div>
                    <div className={styles["breakdown-item"]}>
                        <div className={styles["breakdown-label"]}>4점</div>
                        <div className={styles["breakdown-score"]}>4명</div>
                    </div>
                    <div className={styles["breakdown-item"]}>
                        <div className={styles["breakdown-label"]}>3점</div>
                        <div className={styles["breakdown-score"]}>42명</div>
                    </div>
                    <div className={styles["breakdown-item"]}>
                        <div className={styles["breakdown-label"]}>2점</div>
                        <div className={styles["breakdown-score"]}>4234명</div>
                    </div> */}
                </div>
            </div>

            {review.map((item) => (
                <div key={item.id} className={styles["individual-review"]}>
                    <div className={styles["review-header"]}>
                        <div className={styles["reviewer-info"]}>
                            <div className={styles["reviewer-avatar"]}>{item.userName.charAt(0)}</div>
                            <div>
                                <div className={styles["reviewer-name"]}>{item.userName}님</div>
                                <div className={styles["review-date"]}>{item.createdAt}</div>
                            </div>
                        </div>
                        <div className={styles["review-rating"]}>{'⭐'.repeat(item.rating)}</div>
                    </div>
                    <div className={styles["review-text"]}>
                        {item.comment}
                    </div>
                </div>
            ))}


            {totalPages > 0 && (
                <div className={styles['demo-section']}>
                    <div className={styles['pagination-container']}>
                        <div className={styles.pagination}>
                            {/* 이전 페이지 버튼 */}
                            <button
                                className={`${styles['pagination-btn']} ${styles.arrow} ${currentPage === 0 ? styles.disabled : ''}`}
                                onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>

                            {/* 페이지 번호 버튼 */}
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles['pagination-btn']} ${currentPage === index ? styles.active : ''}`}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            {/* 다음 페이지 버튼 */}
                            <button
                                className={`${styles['pagination-btn']} ${styles.arrow} ${currentPage === totalPages - 1 ? styles.disabled : ''}`}
                                onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
