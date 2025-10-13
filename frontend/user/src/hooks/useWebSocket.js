/**
 * 웹소켓 훅 (실시간 테이블 상태 관리)
 * 
 * @author 김예진
 * @since 2025-10-01
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * 웹소켓 연결 및 테이블 상태 관리를 위한 커스텀 훅
 * 
 * @param {number} restaurantId - 레스토랑 ID
 * @param {function} onTableStatusUpdate - 테이블 상태 업데이트 콜백 함수
 * @returns {object} 웹소켓 관련 상태 및 함수들
 */
export const useWebSocket = (restaurantId, onTableStatusUpdate) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [mySessionId, setMySessionId] = useState(null);

    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);
    // ✅ 콜백 함수를 ref로 저장하여 의존성 문제 해결
    const callbackRef = useRef(onTableStatusUpdate);
    const sessionIdRef = useRef(null);

    // ✅ 콜백이 변경될 때마다 ref 업데이트 (의존성 배열에는 포함하지 않음)
    useEffect(() => {
        callbackRef.current = onTableStatusUpdate;
    }, [onTableStatusUpdate]);


    // ✅ 세션 ID가 변경될 때마다 ref 업데이트
    useEffect(() => {
        sessionIdRef.current = mySessionId;
    }, [mySessionId]);

    /**
     * 웹소켓 연결 및 구독 설정
     */
    useEffect(() => {
        if (!restaurantId) {
            console.warn('restaurantId가 없어 웹소켓 연결을 시작하지 않습니다.');
            return;
        }

        console.log(`웹소켓 연결 시작: restaurantId=${restaurantId}`);

        // STOMP 클라이언트 생성
        const client = new Client({
            // SockJS를 통한 WebSocket 연결
            webSocketFactory: () => new SockJS('http://localhost:8002/ws'),

            // 디버그 모드 (프로덕션에서는 비활성화 권장)
            debug: function (str) {
                console.log('STOMP:', str);
            },

            // 재연결 설정
            reconnectDelay: 5000, // 5초마다 재연결 시도
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            /**
             * 연결 성공 핸들러
             */
            onConnect: function (frame) {
                console.log('웹소켓 연결 성공', frame);
                setIsConnected(true);
                setConnectionError(null);

                try {
                    // ✅ 1. 개인 세션 정보 구독 - 여러 경로 시도
                    console.log('🔔 구독 시작...');

                    // 방법 1
                    const sessionInfoSubscription1 = client.subscribe(
                        '/queue/session-info',
                        function (message) {
                            console.log('✅ [방법1] 개인 세션 정보 수신:', message.body);
                            try {
                                const data = JSON.parse(message.body);
                                if (data.type === 'SESSION_INFO' && data.mySessionId) {
                                    console.log('🔑 내 세션 ID 수신:', data.mySessionId);
                                    setMySessionId(data.mySessionId);
                                    sessionIdRef.current = data.mySessionId;
                                }
                            } catch (e) {
                                console.error('세션 정보 파싱 오류:', e);
                            }
                        }
                    );

                    // 방법 2
                    const sessionInfoSubscription2 = client.subscribe(
                        '/user/queue/session-info',
                        function (message) {
                            console.log('✅ [방법2] 개인 세션 정보 수신:', message.body);
                            try {
                                const data = JSON.parse(message.body);
                                if (data.type === 'SESSION_INFO' && data.mySessionId) {
                                    console.log('🔑 내 세션 ID 수신 (방법2):', data.mySessionId);
                                    setMySessionId(data.mySessionId);
                                    sessionIdRef.current = data.mySessionId;
                                }
                            } catch (e) {
                                console.error('세션 정보 파싱 오류:', e);
                            }
                        }
                    );

                    console.log('✅ 구독 완료');

                    // ✅ 2. 레스토랑별 테이블 상태 토픽 구독
                    const tableStatusSubscription = client.subscribe(
                        `/topic/restaurant/${restaurantId}/tables/status`,
                        function (message) {
                            console.log('테이블 상태 메시지 수신:', message.body);
                            try {
                                const data = JSON.parse(message.body);
                                callbackRef.current(data, sessionIdRef.current);
                            } catch (e) {
                                console.error('메시지 파싱 오류:', e);
                            }
                        }
                    );

                    // ✅ 3. 예약 관련 토픽 구독
                    const reservationSubscription = client.subscribe(
                        `/topic/reservation/${restaurantId}/table-status`,
                        function (message) {
                            console.log('예약 상태 메시지 수신:', message.body);
                            try {
                                const data = JSON.parse(message.body);
                                // ✅ USER_CONNECTED 메시지에서 newUser가 나라면, 그게 내 세션!
                                if (data.type === 'USER_CONNECTED' && data.newUser && !sessionIdRef.current) {
                                    // 내가 방금 접속한 거면 newUser가 내 세션 ID
                                    console.log('🔑 내 세션 ID 수신:', data.newUser);
                                    setMySessionId(data.newUser);
                                    sessionIdRef.current = data.newUser;
                                }
                                // callbackRef.current(data, sessionIdRef.current);
                            } catch (e) {
                                console.error('메시지 파싱 오류:', e);
                            }
                        }
                    );

                    subscriptionsRef.current = [
                        sessionInfoSubscription1,
                        sessionInfoSubscription2,
                        tableStatusSubscription,
                        reservationSubscription
                    ];

                    console.log('✅ 토픽 구독 완료');
                    console.log('📤 서버에 연결 알림 전송 중...');

                    // 4. 서버에 연결 알림
                    client.publish({
                        destination: `/app/reservation/${restaurantId}/connect`,
                        body: JSON.stringify({
                            userEmail: 'user@example.com',
                            timestamp: new Date().toISOString()
                        })
                    });

                    console.log('✅ 연결 알림 전송 완료');

                } catch (error) {
                    console.error('❌ 구독 설정 중 오류:', error);
                    setConnectionError('구독 설정 실패');
                }
            },

            onDisconnect: function () {
                console.log('웹소켓 연결 해제');
                setIsConnected(false);
                subscriptionsRef.current = [];
            },

            onStompError: function (frame) {
                console.error('STOMP 오류:', frame);
                setConnectionError('연결 오류가 발생했습니다');
                setIsConnected(false);
            },

            onWebSocketError: function (error) {
                console.error('WebSocket 오류:', error);
                setConnectionError('웹소켓 연결 실패');
            }
        });

        clientRef.current = client;
        client.activate();

        return () => {
            console.log('웹소켓 연결 종료 중...');

            subscriptionsRef.current.forEach(subscription => {
                try {
                    subscription.unsubscribe();
                } catch (e) {
                    console.error('구독 해제 오류:', e);
                }
            });
            subscriptionsRef.current = [];

            if (client.active) {
                client.deactivate();
            }
        };
    }, [restaurantId]);

    /**
     * 테이블 상태 조회 요청
     * 
     * @param {string} date - 예약 날짜 (YYYY-MM-DD)
     * @param {string} time - 예약 시간 (HH:mm)
     */
    const getTableStatus = useCallback((date, time) => {
        if (!clientRef.current?.active) {
            console.warn('웹소켓이 연결되지 않았습니다.');
            return;
        }

        console.log(`테이블 상태 조회 요청: date=${date}, time=${time}`);

        try {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/tables/status`,
                body: JSON.stringify({
                    date: date,
                    time: time
                })
            });
        } catch (error) {
            console.error('테이블 상태 조회 요청 실패:', error);
        }
    }, [restaurantId]);

    /**
     * 테이블 선택 요청
     * 
     * @param {number} tableId - 테이블 ID
     * @param {string} customerName - 고객명
     * @param {string} date - 예약 날짜
     * @param {string} time - 예약 시간
     * @param {number} peopleCount - 인원수
     */
    const selectTable = useCallback((tableId, customerName, date, time, peopleCount) => {
        if (!clientRef.current?.active) {
            console.warn('웹소켓이 연결되지 않았습니다.');
            return;
        }

        console.log(`테이블 선택 요청: tableId=${tableId}, date=${date}, time=${time}`);

        try {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/tables/${tableId}/select`,
                body: JSON.stringify({
                    customerName: customerName,
                    peopleCount: peopleCount,
                    date: date,
                    time: time
                })
            });
        } catch (error) {
            console.error('테이블 선택 요청 실패:', error);
        }
    }, [restaurantId]);

    /**
     * 테이블 선택 해제 요청
     * 
     * @param {number} tableId - 테이블 ID
     * @param {string} date - 예약 날짜
     * @param {string} time - 예약 시간
     */
    const cancelTable = useCallback((tableId, date, time) => {
        if (!clientRef.current?.active) {
            console.warn('웹소켓이 연결되지 않았습니다.');
            return;
        }

        console.log(`테이블 선택 해제 요청: tableId=${tableId}`);

        try {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/tables/${tableId}/cancel`,
                body: JSON.stringify({
                    date: date,
                    time: time
                })
            });
        } catch (error) {
            console.error('테이블 선택 해제 요청 실패:', error);
        }
    }, [restaurantId]);

    /**
     * 결제 시작 알림 (테이블 선점 유지 시간 연장용)
     * 
     * @param {number} tableId - 테이블 ID
     */
    const startPayment = useCallback((tableId) => {
        if (!clientRef.current?.active) {
            console.warn('웹소켓이 연결되지 않았습니다.');
            return;
        }

        console.log(`결제 시작 알림: tableId=${tableId}`);

        try {
            clientRef.current.publish({
                destination: `/app/reservation/${restaurantId}/payment/start`,
                body: JSON.stringify({
                    tableId: tableId,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('결제 시작 알림 실패:', error);
        }
    }, [restaurantId]);

    /**
     * 메시지 수동 전송 (디버깅용)
     * 
     * @param {string} destination - 목적지 경로
     * @param {object} body - 메시지 본문
     */
    const sendMessage = useCallback((destination, body) => {
        if (!clientRef.current?.active) {
            console.warn('웹소켓이 연결되지 않았습니다.');
            return;
        }

        try {
            clientRef.current.publish({
                destination: destination,
                body: JSON.stringify(body)
            });
            console.log(`메시지 전송: ${destination}`, body);
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    }, []);

    // 반환값
    return {
        // 상태
        isConnected,
        connectionError,
        mySessionId,

        // 함수
        getTableStatus,
        selectTable,
        cancelTable,
        startPayment,
        sendMessage
    };
};