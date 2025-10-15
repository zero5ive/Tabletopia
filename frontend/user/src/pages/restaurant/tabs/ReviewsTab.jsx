import styles from '../RestaurantDetail.module.css';

/**
 * 리뷰 탭 컴포넌트
 * 레스토랑의 리뷰 정보를 표시
 *
 * @author Claude
 * @since 2025-10-15
 */
export default function ReviewsTab() {
    return (
        <div className={`${styles["tab-panel"]} ${styles["active"]}`}>
            <div className={styles["section-title"]}>리뷰</div>
            <div className={styles["review-summary"]}>
                <div className={styles["review-score"]}>4.8</div>
                <div className={styles["review-total"]}>총 386개의 리뷰</div>
                <div className={styles["review-breakdown"]}>
                    <div className={styles["breakdown-item"]}>
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
                    </div>
                </div>
            </div>

            <div className={styles["individual-review"]}>
                <div className={styles["review-header"]}>
                    <div className={styles["reviewer-info"]}>
                        <div className={styles["reviewer-avatar"]}>김</div>
                        <div>
                            <div className={styles["reviewer-name"]}>김**님</div>
                            <div className={styles["review-date"]}>2025.08.28</div>
                        </div>
                    </div>
                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                </div>
                <div className={styles["review-text"]}>
                    정말 최고의 오마카세였습니다! 셰프님의 정성이 느껴지는 요리 하나하나가 예술 작품 같았어요.
                    특히 참치 뱃살은 입에서 녹는 느낌이었고, 성게도 정말 신선했습니다.
                    분위기도 조용하고 고급스러워서 특별한 날에 가기 딱 좋은 곳이에요. 다음에도 꼭 방문하겠습니다!
                </div>
            </div>

            <div className={styles["individual-review"]}>
                <div className={styles["review-header"]}>
                    <div className={styles["reviewer-info"]}>
                        <div className={styles["reviewer-avatar"]}>이</div>
                        <div>
                            <div className={styles["reviewer-name"]}>이**님</div>
                            <div className={styles["review-date"]}>2025.08.25</div>
                        </div>
                    </div>
                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                </div>
                <div className={styles["review-text"]}>
                    생일 기념으로 방문했는데 정말 만족스러웠어요.
                    스시 하나하나가 완벽했고, 셰프님께서 직접 설명해주시는 것도 좋았습니다.
                    가격대가 있지만 그만한 가치가 충분한 곳입니다. 예약은 필수예요!
                </div>
            </div>

            <div className={styles["individual-review"]}>
                <div className={styles["review-header"]}>
                    <div className={styles["reviewer-info"]}>
                        <div className={styles["reviewer-avatar"]}>박</div>
                        <div>
                            <div className={styles["reviewer-name"]}>박**님</div>
                            <div className={styles["review-date"]}>2025.08.22</div>
                        </div>
                    </div>
                    <div className={styles["review-rating"]}>⭐⭐⭐⭐</div>
                </div>
                <div className={styles["review-text"]}>
                    음식은 정말 훌륭했지만 조금 비싸다는 느낌이 들었어요.
                    그래도 신선한 재료와 섬세한 손길이 느껴지는 요리였습니다.
                    서비스도 친절했고, 압구정역에서 가깝다는 것도 장점이네요.
                </div>
            </div>

            <div className={styles["individual-review"]}>
                <div className={styles["review-header"]}>
                    <div className={styles["reviewer-info"]}>
                        <div className={styles["reviewer-avatar"]}>최</div>
                        <div>
                            <div className={styles["reviewer-name"]}>최**님</div>
                            <div className={styles["review-date"]}>2025.08.20</div>
                        </div>
                    </div>
                    <div className={styles["review-rating"]}>⭐⭐⭐⭐⭐</div>
                </div>
                <div className={styles["review-text"]}>
                    회사 회식으로 방문했는데 모든 직원들이 만족했어요.
                    특히 갈치조림이 정말 맛있었고, 꽃게장도 짜지 않고 딱 좋았습니다.
                    단체 예약도 가능해서 좋았어요. 추천합니다!
                </div>
            </div>

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
