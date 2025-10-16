import styles from './MyWaiting.module.css'
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getUserWaitingList, waitingCancel } from '../utils/WaitingApi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function MyReservation() {
    const [allWaitingList, setAllWaitingList] = useState([]); // 전체 데이터
    const [filteredList, setFilteredList] = useState([]); // 필터링된 데이터
    const [displayList, setDisplayList] = useState([]); // 현재 페이지에 표시할 데이터
    const [activeTab, setActiveTab] = useState('WAITING'); // 'WAITING' 또는 'COMPLETED' (웨이팅중 or 이용내역)
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10; // 한 페이지에 보여줄 개수

    // 임시 유저아이디
    const userId = 1;

    // WebSocket 클라이언트
    const stompClient = useRef(null);

    // 전체 데이터 가져오기
    useEffect(() => {
        fetchAllWaitingList();
        connectWebSocket();

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, []);

    // 탭이 바뀌면 필터링 및 1페이지로 리셋
    useEffect(() => {
        filterAndPaginate();
    }, [activeTab, allWaitingList, currentPage]);

    const fetchAllWaitingList = async () => {
        try {
            setLoading(true);
            // 모든 데이터 가져오기
            const response = await getUserWaitingList(userId, 0, 1000);
            console.log(response);
            setAllWaitingList(response.data.content);
        } catch (error) {
            console.error('웨이팅 내역 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndPaginate = () => {
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
    };

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
            webSocketFactory: () => new SockJS('http://localhost:8002/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket 연결 성공');

                // 웨이팅 호출 구독
                client.subscribe('/topic/call', (message) => {
                    console.log('웨이팅 호출:', message.body);
                    handleWebSocketMessage(JSON.parse(message.body));
                });

                // 웨이팅 착석 구독
                client.subscribe('/topic/seated', (message) => {
                    console.log('웨이팅 착석:', message.body);
                    handleWebSocketMessage(JSON.parse(message.body));
                });

                // 웨이팅 취소 구독
                client.subscribe('/topic/cancel', (message) => {
                    console.log('웨이팅 취소:', message.body);
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
        // 데이터 새로고침
        fetchAllWaitingList();
    };

    //대기 취소 함수
    const handleCancelChange = async (waitingId, restaurantId) => {
        const confirm = window.confirm("정말 취소하시겠습니까?");
        if (!confirm) return;

        try {
            await waitingCancel(waitingId, restaurantId);
            window.alert("웨이팅이 취소되었습니다.");
            // 데이터 새로고침
            await fetchAllWaitingList();
        } catch (error) {
            console.error("웨이팅 취소 실패:", error);
            window.alert("웨이팅 취소에 실패했습니다.");
        }
    };


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
                                                 onClick={() => handleCancelChange(waiting.id,waiting.restaurantId)}>대기 취소</button>
                                                <button className={`${styles.btn} ${styles['btn-secondary']}`}>미루기</button>
                                            </div>
                                        )}

                                        {waiting.waitingState === 'SEATED' && (
                                            <div className={styles['card-actions']}>
                                                <button className={`${styles.btn} ${styles['btn-primary']}`}>
                                                    <Link to="/review/write">✍️ 리뷰 작성</Link>
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
        </>
    )
}