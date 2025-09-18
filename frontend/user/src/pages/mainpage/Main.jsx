import styles from './Main.module.css';
import { Link } from 'react-router-dom';

export default function Main(){
    return(
        <>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>테이블토피아</div>
                    
                    <div className={styles.searchContainer}>
                        <input type="text" className={styles.searchBox} placeholder="지역, 음식 또는 레스토랑명을 검색해보세요"/>
                    </div>
                    
                    <div className={styles.locationSelector}>
                        📍 강남
                    </div>
                    
                    <div className={styles.userActions}>
                        <Link to="/mypage" className={`${styles.btn} ${styles.btnSecondary}`}>로그인</Link>
                        <button className={`${styles.btn} ${styles.btnPrimary}`}>회원가입</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContainer}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <h1>예약 많은 가게들</h1>
                        <p>청담과 압구정</p>
                        <p>한 끼이 다른 파인다이닝</p>
                    </div>
                    <div className={styles.featuredDish}></div>
                </section>

                {/* Categories */}
                <section>
                    <h2 className={styles.sectionTitle}>어떤 음식이 드시고 싶으세요?</h2>
                    <div className={styles.categoriesGrid}>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🛍️</div>
                            <div className={styles.categoryName}><a href="/html/restlist.html">전체</a></div>
                            <div className={styles.categoryDesc}>특별한 날의 선택</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🛍️</div>
                            <div className={styles.categoryName}>한식</div>
                            <div className={styles.categoryDesc}>특별한 날의 선택</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🏠</div>
                            <div className={styles.categoryName}>양식</div>
                            <div className={styles.categoryDesc}>우리 동네 숨은 맛집</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>❤️</div>
                            <div className={styles.categoryName}>중식</div>
                            <div className={styles.categoryDesc}>로맨틱한 분위기</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍷</div>
                            <div className={styles.categoryName}>와인 바</div>
                            <div className={styles.categoryDesc}>특별한 와인과 함께</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🌍</div>
                            <div className={styles.categoryName}>이국 요리</div>
                            <div className={styles.categoryDesc}>세계의 맛을 경험</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>⏰</div>
                            <div className={styles.categoryName}>브런치</div>
                            <div className={styles.categoryDesc}>여유로운 오후</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍣</div>
                            <div className={styles.categoryName}>스시/사시미</div>
                            <div className={styles.categoryDesc}>신선한 일식</div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className={styles.sectionTitle}>어디로 가시나요?</h2>
                    <div className={styles.categoriesGrid}>
                        <a href="/html/map.html">
                            <div className={styles.categoryItem}>
                                <div className={styles.categoryIcon}>🛍️</div>
                                <div className={styles.categoryName}>서울</div>
                            </div>
                        </a>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🏠</div>
                            <div className={styles.categoryName}>대전</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>❤️</div>
                            <div className={styles.categoryName}>부산</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍷</div>
                            <div className={styles.categoryName}>와인 바</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🌍</div>
                            <div className={styles.categoryName}>이국 요리</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>⏰</div>
                            <div className={styles.categoryName}>브런치</div>
                        </div>
                        <div className={styles.categoryItem}>
                            <div className={styles.categoryIcon}>🍣</div>
                            <div className={styles.categoryName}>스시/사시미</div>
                        </div>
                    </div>
                </section>

                {/* Restaurants */}
                <section className={styles.restaurantsSection}>
                    <div className={styles.filterBar}>
                        <h2 className={styles.sectionTitle}>놓치면 안되는 핫플 가게!(광고)</h2>
                    </div>
                    
                    <div className={styles.restaurantsGrid}>
                        <a href="/html/rest.html" className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>오마카세 청담</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                        <span>4.8</span>
                                    </div>
                                    <span>일식 • 청담</span>
                                    <span>5만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>오마카세</span>
                                    <span className={styles.tag}>데이트</span>
                                    <span className={styles.tag}>특별한 날</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>오늘 19:00, 21:00 예약가능</div>
                                    <button className={styles.reservationBtn}>예약하기</button>
                                </div>
                            </div>
                        </a>

                        <div className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>미야의 정원</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐</span>
                                        <span>4.2</span>
                                    </div>
                                    <span>아시아 • 압구정</span>
                                    <span>3만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>아시아음식</span>
                                    <span className={styles.tag}>분위기</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>내일 18:30, 20:00 예약가능</div>
                                    <button className={styles.reservationBtn}>예약하기</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>비스트로 라파엘</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                        <span>4.6</span>
                                    </div>
                                    <span>양식 • 강남</span>
                                    <span>8만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>파인다이닝</span>
                                    <span className={styles.tag}>와인</span>
                                    <span className={styles.tag}>기념일</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>오늘 예약 마감</div>
                                    <button className={styles.reservationBtn} disabled>대기등록</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.restaurantsSection}>
                    <div className={styles.filterBar}>
                        <h2 className={styles.sectionTitle}>새로 입점했어요</h2>
                    </div>
                    
                    <div className={styles.restaurantsGrid}>
                        <div className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>오마카세 청담</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                        <span>4.8</span>
                                    </div>
                                    <span>일식 • 청담</span>
                                    <span>5만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>오마카세</span>
                                    <span className={styles.tag}>데이트</span>
                                    <span className={styles.tag}>특별한 날</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>오늘 19:00, 21:00 예약가능</div>
                                    <button className={styles.reservationBtn}>예약하기</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>미야의 정원</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐</span>
                                        <span>4.2</span>
                                    </div>
                                    <span>아시아 • 압구정</span>
                                    <span>3만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>아시아음식</span>
                                    <span className={styles.tag}>분위기</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>내일 18:30, 20:00 예약가능</div>
                                    <button className={styles.reservationBtn}>예약하기</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.restaurantCard}>
                            <div className={styles.restaurantImage}></div>
                            <div className={styles.restaurantInfo}>
                                <div className={styles.restaurantName}>비스트로 라파엘</div>
                                <div className={styles.restaurantDetails}>
                                    <div className={styles.rating}>
                                        <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                                        <span>4.6</span>
                                    </div>
                                    <span>양식 • 강남</span>
                                    <span>8만원~</span>
                                </div>
                                <div className={styles.restaurantTags}>
                                    <span className={styles.tag}>파인다이닝</span>
                                    <span className={styles.tag}>와인</span>
                                    <span className={styles.tag}>기념일</span>
                                </div>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.availableTimes}>오늘 예약 마감</div>
                                    <button className={styles.reservationBtn} disabled>대기등록</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 챗봇 */}
            <div className={styles.chatbotContainer}>
                {/* 미리보기 말풍선 */}
                <div className={styles.chatPreview} id="chatPreview">
                    <div className={styles.chatPreviewText}>궁금한 게 있으시면 물어보세요!</div>
                </div>
                
                {/* 채팅창 */}
                <div className={styles.chatbotWindow} id="chatWindow">
                    <div className={styles.chatHeader}>
                        <h3>테이블토피아 도우미</h3>
                        <p>레스토랑 예약에 대해 궁금한 것을 물어보세요</p>
                    </div>
                    
                    <div className={styles.chatMessages} id="chatMessages">
                        <div className={`${styles.message} ${styles.bot}`}>
                            안녕하세요! 테이블토피아 도우미입니다<br/>
                            레스토랑 예약이나 맛집 추천에 대해 도움드릴게요!
                        </div>
                    </div>
                    
                    <div className={styles.quickResponses}>
                        <button className={styles.quickResponseBtn}>강남 맛집 추천</button>
                        <button className={styles.quickResponseBtn}>오늘 예약 가능</button>
                        <button className={styles.quickResponseBtn}>데이트 코스</button>
                    </div>
                    
                    <div className={styles.chatInputArea}>
                        <div className={styles.chatInputContainer}>
                            <input type="text" className={styles.chatInput} id="chatInput" placeholder="메시지를 입력하세요..."/>
                            <button className={styles.chatSendBtn}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* 챗봇 버튼 */}
                <button className={styles.chatbotButton} id="chatbotButton">
                    💬
                </button>
            </div>
        </>
    )
}