import styles from './MyWaiting.module.css'
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getUserWaitingList, waitingCancel } from '../utils/WaitingApi';
import { getCurrentUser, createReview } from '../utils/UserApi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { delayWaiting } from '../utils/WaitingApi';
import { getDelayOptions } from '../utils/WaitingApi';
import { useWebSocket } from '../../contexts/WebSocketContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8002/ws';

export default function MyReservation() {
    const { waitingStateChange } = useWebSocket(); // WebSocketContext 사용
    const [allWaitingList, setAllWaitingList] = useState([]); // 전체 데이터
    const [filteredList, setFilteredList] = useState([]); // 필터링된 데이터
    const [displayList, setDisplayList] = useState([]); // 현재 페이지에 표시할 데이터
    const [activeTab, setActiveTab] = useState('WAITING'); // 'WAITING' 또는 'COMPLETED' (웨이팅중 or 이용내역)
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [userId, setUserId] = useState(null); // 현재 로그인한 사용자 ID
    const pageSize = 10; // 한 페이지에 보여줄 개수
    const [delay, setDelay] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [selectedWaiting, setSelectedWaiting] = useState(null); // 선택된 웨이팅
    const [delayOptions, setDelayOptions] = useState([]); // 미루기 옵션 목록
    const [showReviewModal, setShowReviewModal] = useState(false) // 리뷰 모달 상태
    const [selectedWaitingForReview, setSelectedWaitingForReview] = useState(null) // 리뷰 작성할 웨이팅
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    })

    // 미루기 버튼 클릭 핸들러
    const handleDelayClick = async (waiting) => {
        try {
            console.log('선택된 웨이팅 정보:', waiting);
            console.log('canDelay 값:', waiting.canDelay);
            console.log('delayCount 값:', waiting.delayCount);

            setSelectedWaiting(waiting);
            setIsModalOpen(true);

            // 미루기 옵션 조회
            const response = await getDelayOptions(waiting.id, waiting.restaurantId);
            console.log('미루기 하기위한 웨이팅 리스트 조회', response.data);
            setDelayOptions(response.data);
        } catch (error) {
            console.error('미루기 옵션 조회 실패:', error);
            alert('미루기 옵션을 불러오는데 실패했습니다.');
            setIsModalOpen(false);
        }
    }


    // 웨이팅 선택하여 미루기 등록
    const handleSelectDelay = async (targetWaiting) => {
        if (!selectedWaiting) return;

        try {
            await delayWaiting(selectedWaiting.id, targetWaiting.waitingNumber, selectedWaiting.restaurantId);

            // 성공 후 모달 닫고 웨이팅 목록 새로고침
            alert('순서가 미뤄졌습니다!');
            setIsModalOpen(false);
            setSelectedWaiting(null);
            setDelayOptions([]);
            await fetchAllWaitingList(); // 목록 새로고침

        } catch (error) {
            console.error('웨이팅 미루기 실패:', error);
            alert(error.response?.data?.error || '미루기에 실패했습니다.');
        }
    }

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWaiting(null);
        setDelayOptions([]);
    }


    // WebSocket 클라이언트
    const stompClient = useRef(null);

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();
                setUserId(response.data.id);
                console.log('현재 사용자 ID:', response.data.id);
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    // 전체 데이터 가져오기 및 WebSocket 연결
    useEffect(() => {
        if (!userId) return; // userId가 없으면 실행하지 않음

        fetchAllWaitingList();
        connectWebSocket();

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [userId]);

    const fetchAllWaitingList = async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
            }
            console.log('웨이팅 내역 조회 시작');
            console.log('저장된 토큰:', localStorage.getItem('accessToken'));

            // 모든 데이터 가져오기 (page=0, size=1000)
            const response = await getUserWaitingList(0, 1000);
            console.log('웨이팅 내역 조회 응답:', response);
            console.log('웨이팅 내역 데이터:', response.data);

            if (response.data && response.data.content) {
                setAllWaitingList(response.data.content);
                console.log('웨이팅 개수:', response.data.content.length);
            } else {
                console.warn('응답 데이터 형식이 예상과 다릅니다:', response.data);
                setAllWaitingList([]);
            }
        } catch (error) {
            console.error('웨이팅 내역 조회 실패:', error);
            console.error('에러 상세:', error.response?.data);
            console.error('에러 상태:', error.response?.status);

            // silent 모드가 아닐 때만 alert 표시
            if (!silent) {
                // 에러 상태별 처리
                if (error.response?.status === 401) {
                    alert('로그인이 필요합니다. 다시 로그인해주세요.');
                    // 로그인 페이지로 리다이렉트 (필요시)
                    // window.location.href = '/login';
                } else if (error.response?.status === 404) {
                    alert('사용자 정보를 찾을 수 없습니다.');
                } else if (error.response?.status === 500) {
                    alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                } else {
                    alert(`웨이팅 내역 조회 실패: ${error.response?.data?.message || error.message}`);
                }
            }

            setAllWaitingList([]);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    };

    // 웨이팅 상태 변경 감지 (호출/착석/취소)
    useEffect(() => {
        if (waitingStateChange) {
            console.log('[MyWaiting] 웨이팅 상태 변경 감지:', waitingStateChange);
            // 목록 새로고침 (silent 모드로 로딩 표시 없이)
            fetchAllWaitingList(true);
        }
    }, [waitingStateChange]);

    // 탭이 바뀌면 필터링 및 1페이지로 리셋
    useEffect(() => {
        // 1. 탭에 따라 필터링
        let filtered;
        if (activeTab === 'WAITING') {
            filtered = allWaitingList.filter(w => w.waitingState === 'WAITING' || w.waitingState === 'CALLED');
        } else {
            filtered = allWaitingList.filter(w => w.waitingState === 'SEATED' || w.waitingState === 'CANCELLED');
        }
        setFilteredList(filtered);

        // 2. 페이지네이션
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);
        setDisplayList(paginated);
    }, [activeTab, allWaitingList, currentPage]);

    //페이지 변경 시 
    const handlePageChange = (pageNumber) => {
        const totalPages = Math.ceil(filteredList.length / pageSize);
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // 페이지 변경 시 스크롤을 위로
        }
    };

    //탭 변경 시 (웨이팅 or 이용내역)
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0); // 탭 변경 시 1페이지로
    };

    // 페이지 계산
    const totalPages = Math.ceil(filteredList.length / pageSize);
    const totalElements = filteredList.length;

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
    };

    // 상태 표시 함수
    const getStatus = (state) => {
        switch (state) {
            case 'WAITING':
                return { text: '대기중', className: styles['status-waiting'] };
            case 'CALLED':
                return { text: '호출됨', className: styles['status-called'] };
            case 'SEATED':
                return { text: '이용완료', className: styles['status-completed'] };
            case 'CANCELLED':
                return { text: '취소됨', className: styles['status-cancelled'] };
            default:
                return { text: state, className: '' };
        }
    };

    // WebSocket 연결
    const connectWebSocket = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket 연결 성공');

                // 개인화된 웨이팅 호출 구독
                client.subscribe(`/topic/user/${userId}/call`, (message) => {
                    console.log('웨이팅 호출 알림:', message.body);
                    handleWebSocketMessage(JSON.parse(message.body));
                });

                // 개인화된 웨이팅 착석 구독
                client.subscribe(`/topic/user/${userId}/seated`, (message) => {
                    console.log('웨이팅 착석 알림:', message.body);
                    handleWebSocketMessage(JSON.parse(message.body));
                });

                // 개인화된 웨이팅 취소 구독
                client.subscribe(`/topic/user/${userId}/cancel`, (message) => {
                    console.log('웨이팅 취소 알림:', message.body);
                    handleWebSocketMessage(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => {
                console.error('STOMP 에러:', frame);
            },
        });

        client.activate();
        stompClient.current = client;
    };

    // WebSocket 메시지 처리
    const handleWebSocketMessage = (message) => {
        console.log('WebSocket 메시지 수신:', message);
        // 데이터 새로고침 (silent 모드 - alert 표시 안 함)
        fetchAllWaitingList(true);
    };

    //대기 취소 함수
    const handleCancelChange = async (waitingId, restaurantId) => {
        const confirm = window.confirm("정말 취소하시겠습니까?");
        if (!confirm) return;

        try {
            await waitingCancel(waitingId, restaurantId);
            window.alert("웨이팅이 취소되었습니다.");

            // 약간의 딜레이 후 데이터 새로고침 (WebSocket 메시지 처리 대기)
            setTimeout(() => {
                fetchAllWaitingList(true);
            }, 500);
        } catch (error) {
            console.error("웨이팅 취소 실패:", error);
            window.alert("웨이팅 취소에 실패했습니다.");
        }
    };

    // 리뷰 작성 클릭 핸들러
    const handleReviewClick = (waiting) => {
        console.log('선택된 웨이팅 정보:', waiting)
        console.log('restaurantId:', waiting.restaurantId)
        setSelectedWaitingForReview(waiting)
        setReviewData({
            rating: 5,
            comment: ''
        })
        setShowReviewModal(true)
    }

    // 리뷰 제출 핸들러
    const handleReviewSubmit = async () => {
        if (!reviewData.comment.trim()) {
            alert('리뷰 내용을 입력해주세요.')
            return
        }

        try {
            const requestData = {
                restaurantId: selectedWaitingForReview.restaurantId,
                rating: reviewData.rating,
                comment: reviewData.comment,
                sourceId: selectedWaitingForReview.id,
                sourceType: 'WAITING'
            }

            console.log('리뷰 작성 요청 데이터:', requestData)
            const response = await createReview(requestData)
            console.log('리뷰 작성 응답:', response)
            alert('리뷰가 작성되었습니다.')
            setShowReviewModal(false)
            setSelectedWaitingForReview(null)
            fetchAllWaitingList(true)
        } catch (error) {
            console.error('리뷰 작성 에러:', error)
            console.error('에러 상세:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
            alert(`${error.response?.data?.message || error.message}`)
        }
    }

    // 리뷰 모달 닫기
    const handleCloseReviewModal = () => {
        setShowReviewModal(false)
        setSelectedWaitingForReview(null)
        setReviewData({
            rating: 5,
            comment: ''
        })
    }


    return (
        <>
            <div className={styles['main-panel']}>
                <div className={styles['panel-header']}>
                    <h2 className={styles['panel-title']}>웨이팅 내역</h2>
                    <div className={styles['view-toggle']}>
                        <button
                            className={`${styles['view-btn']} ${activeTab === 'WAITING' ? styles.active : ''}`}
                            onClick={() => handleTabChange('WAITING')}
                        >
                            웨이팅중
                        </button>
                        <button
                            className={`${styles['view-btn']} ${activeTab === 'COMPLETED' ? styles.active : ''}`}
                            onClick={() => handleTabChange('COMPLETED')}
                        >
                            이용 완료
                        </button>
                    </div>
                </div>
                <div className={styles['reservations-container']}>
                    {loading ? (
                        <div>로딩중...</div>
                    ) : displayList.length === 0 ? (
                        <div>웨이팅 내역이 없습니다.</div>
                    ) : (
                        <div className={styles['reservations-grid']}>
                            {displayList.map((waiting) => {
                                const status = getStatus(waiting.waitingState);
                                return (
                                    <div key={waiting.id} className={styles['reservation-card']}>
                                        <div className={styles['card-header']}>
                                            <div className={styles['restaurant-info']}>
                                                <h3>{waiting.restaurantName || '식당명 없음'}</h3>
                                            </div>
                                            <span className={`${styles['status-badge']} ${status.className}`}>
                                                {status.text}
                                            </span>
                                        </div>

                                        <div className={styles['card-details']}>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>📅</span>
                                                <span className={styles['detail-label']}>등록일시</span>
                                                <span className={styles['detail-value']}>{formatDate(waiting.createdAt)}</span>
                                            </div>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>👥</span>
                                                <span className={styles['detail-label']}>인원</span>
                                                <span className={styles['detail-value']}>{waiting.peopleCount}명</span>
                                            </div>
                                            <div className={styles['detail-item']}>
                                                <span className={styles['detail-icon']}>⏰</span>
                                                <span className={styles['detail-label']}>대기번호</span>
                                                <span className={styles['detail-value']}>{waiting.waitingNumber}번</span>
                                            </div>
                                            {waiting.teamsAhead !== null && waiting.teamsAhead !== undefined && (
                                                <div className={styles['detail-item']}>
                                                    <span className={styles['detail-icon']}>📊</span>
                                                    <span className={styles['detail-label']}>앞 대기팀</span>
                                                    <span className={styles['detail-value']}>{waiting.teamsAhead}팀</span>
                                                </div>
                                            )}
                                        </div>

                                        {waiting.waitingState === 'WAITING' && (
                                            <div className={styles['card-actions']}>
                                                <button className={`${styles.btn} ${styles['btn-secondary']}`}
                                                    onClick={() => handleCancelChange(waiting.id, waiting.restaurantId)}>대기 취소</button>
                                                <button className={`${styles.btn} ${styles['btn-secondary']}`}
                                                    onClick={() => handleDelayClick(waiting)}>미루기</button>
                                            </div>
                                        )}

                                        {waiting.waitingState === 'SEATED' && (
                                            <div className={styles['card-actions']}>
                                                <button
                                                    className={`${styles.btn} ${styles['btn-primary']}`}
                                                    onClick={() => handleReviewClick(waiting)}
                                                >
                                                    ✍️ 리뷰 작성
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                {!loading && totalPages > 1 && (
                    <div className={styles['pagination']}>
                        <button
                            className={styles['page-btn']}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            이전
                        </button>

                        <div className={styles['page-numbers']}>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles['page-number']} ${currentPage === index ? styles['active'] : ''}`}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            className={styles['page-btn']}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* 탭 별 총 개수 표시 */}
                {!loading && totalElements > 0 && (
                    <div className={styles['total-count']}>
                        총 {totalElements}개의 웨이팅 내역
                    </div>
                )}

            </div>

            {/* 미루기 모달 */}
            {isModalOpen && (
                <div className={styles['modal-overlay']} onClick={handleCloseModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <div className={styles['modal-header']}>
                            <h3 className={styles['modal-title']}>웨이팅 미루기</h3>
                            <button className={styles['modal-close']} onClick={handleCloseModal}>×</button>
                        </div>
                        <div className={styles['modal-body']}>
                            <div className={styles['modal-info']}>
                                <span className={styles['modal-info-icon']}>ℹ️</span>
                                <div className={styles['modal-info-text']}>
                                    현재 대기번호: <strong>{selectedWaiting?.waitingNumber}번</strong><br />
                                    순서를 미룰 웨이팅을 선택해주세요.
                                </div>
                            </div>

                            {selectedWaiting && !selectedWaiting.canDelay && (
                                <div className={styles['modal-warning']}>
                                    <span className={styles['modal-warning-icon']}>⚠️</span>
                                    <div className={styles['modal-warning-text']}>
                                        <strong>미루기 횟수를 초과하셨습니다.</strong><br />
                                        더 이상 순서를 미룰 수 없습니다. (최대 3회)
                                    </div>
                                </div>
                            )}

                            {selectedWaiting && selectedWaiting.canDelay && delayOptions.length > 0 ? (
                                <div className={styles['waiting-list']}>
                                    {delayOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            className={styles['waiting-item']}
                                            onClick={() => handleSelectDelay(option)}
                                        >
                                            <div className={styles['waiting-item-info']}>
                                                <div className={styles['waiting-item-number']}>
                                                    {option.waitingNumber}번
                                                </div>
                                                <div className={styles['waiting-item-details']}>
                                                    {option.peopleCount}명 | {formatDate(option.createdAt)}
                                                </div>
                                            </div>
                                            <span className={styles['waiting-item-arrow']}>→</span>
                                        </div>
                                    ))}
                                </div>
                            ) : selectedWaiting && selectedWaiting.canDelay ? (
                                <div className={styles['empty-waiting-list']}>
                                    <div className={styles['empty-waiting-list-icon']}>📋</div>
                                    <div className={styles['empty-waiting-list-text']}>
                                        미룰 수 있는 웨이팅이 없습니다.
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {selectedWaiting && (
                            <div className={styles['modal-footer']}>
                                <div className={styles['delay-count-info']}>
                                    미루기 사용 횟수: <strong>{selectedWaiting.delayCount || 0}</strong> / 3회
                                </div>
                                <div className={styles['delay-count-info']}>
                                    남은 횟수: <strong>{3 - (selectedWaiting.delayCount || 0)}</strong>회
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 리뷰 작성 모달 */}
            {showReviewModal && selectedWaitingForReview && (
                <div className={styles['modal-overlay']} onClick={handleCloseReviewModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <div className={styles['modal-header']}>
                            <h3>리뷰 작성</h3>
                            <button className={styles['close-btn']} onClick={handleCloseReviewModal}>×</button>
                        </div>
                        <div className={styles['modal-body']}>
                            <div className={styles['restaurant-info-modal']}>
                                <h4>{selectedWaitingForReview.restaurantName}</h4>
                            </div>

                            <div className={styles['rating-section']}>
                                <label>평점</label>
                                <div className={styles['star-rating']}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= reviewData.rating ? styles['star-filled'] : styles['star-empty']}
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            style={{ cursor: 'pointer', fontSize: '30px' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles['comment-section']}>
                                <label>리뷰 내용</label>
                                <textarea
                                    className={styles['review-textarea']}
                                    placeholder="식당에 대한 솔직한 리뷰를 남겨주세요."
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    rows="5"
                                />
                            </div>
                        </div>
                        <div className={styles['modal-footer']}>
                            <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={handleCloseReviewModal}>
                                취소
                            </button>
                            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleReviewSubmit}>
                                작성 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}