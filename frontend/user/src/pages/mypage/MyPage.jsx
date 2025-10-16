import styles from './MyPage.module.css';

export default function MyPage() {
    return (
        <>
            <main className={styles['main-content']}>
                <section className={styles['content-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>예약 내역</h3>
                    </div>
                    <div className={styles['feature-banner']}>
                        <div className={styles['feature-banner-icon']}>🎁</div>
                        <div className={styles['feature-banner-content']}>
                            <div className={styles['feature-banner-title']}>
                                <a href="/mypage/reservation" className={styles['feature-banner-link']}>예약 내역 이동</a>
                            </div>
                            <div className={styles['feature-banner-subtitle']}>최신 예약 정보를 확인하세요</div>
                        </div>
                    </div>
                </section>

                <section className={styles['content-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>리뷰 내역</h3>
                    </div>
                    <div className={styles['individual-review']}>
                        <div className={styles['review-header']}>
                            <div className={styles['reviewer-info']}>
                                <div className={styles['reviewer-avatar']}>김</div>
                                <div>
                                    <div className={styles['reviewer-name']}>김**님</div>
                                    <div className={styles['review-date']}>2025.08.28</div>
                                </div>
                            </div>
                            <div className={styles['review-rating']}>⭐⭐⭐⭐⭐</div>
                        </div>
                        <img src="#" alt="이미지" />
                        <div className={styles['review-text']}>
                            정말 최고의 오마카세였습니다! 셰프님의 정성이 느껴지는 요리 하나하나가 예술 작품 같았어요.
                            특히 참치 뱃살은 입에서 녹는 느낌이었고, 성게도 정말 신선했습니다.
                            분위기도 조용하고 고급스러워서 특별한 날에 가기 딱 좋은 곳이에요. 다음에도 꼭 방문하겠습니다!
                        </div>
                    </div>
                </section>

                <section className={styles['content-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>북마크</h3>
                    </div>

                    <div className={styles['card-image']}>
                        <div className={styles['image-section']}>
                            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=120&h=120&fit=crop" alt="소시센몬" />
                        </div>
                        <div className={styles['content-section']}>
                            <button className={styles['bookmark-btn']}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <div>
                                <div className={styles['restaurant-title']}>소시센몬</div>
                                <div className={styles['restaurant-desc']}>소시지 전문점 • 강남구</div>
                            </div>
                            <div className={styles['quick-info']}>
                                <span className={styles['info-badge']}>영업중</span>
                                <span className={styles['info-badge']}>예약가능</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles['content-section']}>
                    <div className={styles['section-header']}>
                        <h3 className={styles['section-title']}>오늘 많이 저장하는 레스토랑</h3>
                    </div>
                    <div className={styles['card-grid']}>
                        <div className={styles['restaurant-card']}>
                            <div className={styles['card-image']} style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)' }} />
                            <div className={styles['card-content']}>
                                <h4 className={styles['card-title']}>BISTROT de...</h4>
                                <p className={styles['card-description']}>프랑스요리 • 청담</p>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>★</span>
                                    <span className={styles['rating-score']}>4.7</span>
                                    <span className={styles['rating-count']}>(2488)</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['restaurant-card']}>
                            <div className={styles['card-image']} style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)' }} />
                            <div className={styles['card-content']}>
                                <h4 className={styles['card-title']}>LAB 24 by K...</h4>
                                <p className={styles['card-description']}>프랑스요리 • 부산 송정</p>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>★</span>
                                    <span className={styles['rating-score']}>4.7</span>
                                    <span className={styles['rating-count']}>(3183)</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['restaurant-card']}>
                            <div className={styles['card-image']} style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)' }} />
                            <div className={styles['card-content']}>
                                <h4 className={styles['card-title']}>MAISON HAM</h4>
                                <p className={styles['card-description']}>이탈리아요리 • 한남</p>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>★</span>
                                    <span className={styles['rating-score']}>4.4</span>
                                    <span className={styles['rating-count']}>(2222)</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['restaurant-card']}>
                            <div className={styles['card-image']} style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)' }} />
                            <div className={styles['card-content']}>
                                <h4 className={styles['card-title']}>SUSHI YOSHII</h4>
                                <p className={styles['card-description']}>일식 • 압구정</p>
                                <div className={styles.rating}>
                                    <span className={styles.stars}>★</span>
                                    <span className={styles['rating-score']}>4.8</span>
                                    <span className={styles['rating-count']}>(892)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </>
    )
}