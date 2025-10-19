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

    //레스토랑 리뷰 함수
    const fetchRestaurantReviews = async (restaurantId) => {
        const response = await getRestaurantReviews(restaurantId);
        console.log('레스토랑 리뷰', response.data);
        setReview(response.data);
    }

    useEffect(() => {
        fetchRestaurantReviews(restaurantId);
    }, [restaurantId])

    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>리뷰</div>
            <div className={styles["review-summary"]}>
                <div className={styles["review-score"]}>{restaurantDetail.averageRating}</div>
                <div className={styles["review-total"]}>총 386개의 리뷰</div>
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


            <div className={styles['demo-section']}>
                <div className={styles['pagination-container']}>
                    <div className={styles.pagination}>
                        <button className={`${styles['pagination-btn']} ${styles.arrow} ${styles.disabled}`}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <button className={`${styles['pagination-btn']} ${styles.active}`}>1</button>
                        <button className={styles['pagination-btn']}>2</button>
                        <button className={styles['pagination-btn']}>3</button>
                        <button className={styles['pagination-btn']}>4</button>
                        <button className={styles['pagination-btn']}>5</button>
                        <span className={styles['pagination-dots']}>...</span>
                        <button className={styles['pagination-btn']}>15</button>
                        <button className={`${styles['pagination-btn']} ${styles.arrow}`}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
