/**
 * 웹소켓 훅 파일
 */
import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (restaurantId, onTableStatusUpdate) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!restaurantId) return;

        console.log('웹소켓 연결 시도 중...', restaurantId);

        // STOMP 클라이언트 생성
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8002/ws'), // 백엔드 주소
            debug: function (str) {
                console.log('STOMP:', str);
            },
            onConnect: function (frame) {
                console.log('웹소켓 연결 성공', frame);
                setIsConnected(true);
                setConnectionError(null);

                // 테이블 예약 구독
                client.subscribe(`/topic/reservation/${restaurantId}/connect`, function (message) {
                    const data = JSON.parse(message.body);
                    onTableStatusUpdate(data);
                });

                // 서버로 연결 메시지 보내기 (예약 접속 알림)
                const now = new Date().toISOString(); // 유저구분용 임시 코드
                client.publish({
                    destination: `/app/reservation/${restaurantId}/connect`,
                    body: JSON.stringify({ userEmail: now+'@example.com' })
                });
            },
            onDisconnect: function () {
                console.log('웹소켓 연결 해제');
                setIsConnected(false);
            },
            onStompError: function (frame) {
                console.error('STOMP 에러:', frame);
                setConnectionError('연결 오류가 발생했습니다');
                setIsConnected(false);
            }
        });

        clientRef.current = client;
        client.activate(); // 연결 시작

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [restaurantId, onTableStatusUpdate]);

    // 테이블 선택 함수
    const selectTable = (tableId, customerName, peopleCount) => {
        if (clientRef.current?.active) {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/table/select`,
                body: JSON.stringify({ tableId, customerName, peopleCount })
            });
        }
    };

    // 테이블 해제 함수  
    const releaseTable = (tableId, reason) => {
        if (clientRef.current?.active) {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/table/release`,
                body: JSON.stringify({ tableId, reason })
            });
        }
    };

    // 결제 시작 함수
    const startPayment = (tableId, reservationTime) => {
        if (clientRef.current?.active) {
            clientRef.current.publish({
                destination: `/app/restaurant/${restaurantId}/table/payment`,
                body: JSON.stringify({ tableId, reservationTime })
            });
        }
    };

    return {
        isConnected,
        connectionError,
        selectTable,
        releaseTable,
        startPayment
    };
};