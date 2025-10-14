import React, { createContext, useContext, useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const WebSocketContext = createContext()

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider')
    }
    return context
}

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socket = new SockJS('http://localhost:8002/ws')
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('사용자 WebSocket 연결 성공')
                setIsConnected(true)

                // 웨이팅 호출 알림 구독
                client.subscribe('/topic/call', (msg) => {
                    console.log('웨이팅 호출 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.waitingState === 'CALLED') {  // WaitingState.CALLED 체크
                        addNotification({
                            id: Date.now(),
                            type: 'WAITING_CALLED',
                            title: '웨이팅 호출',
                            name: alert.restaurantName,
                            message: `고객님 차례입니다. 매장으로 입장해 주세요.`,
                            time: alert.createdAt,
                            read: false,
                            userId: alert.userId
                        })
                    }
                })

                // 웨이팅 취소 알림 구독
                client.subscribe('/topic/cancel', (msg) => {
                    console.log('웨이팅 취소 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.type === 'CANCEL') {
                        addNotification({
                            id: Date.now(),
                            title: '웨이팅 취소',
                            name: alert.restaurantName,
                            message: `고객님 웨이팅이 취소되었습니다`,
                            time: alert.createdAt,
                            read: false,
                            userId: alert.userId
                        })
                    }
                })

                // 웨이팅 상태 변경 알림 구독
                client.subscribe('/topic/status', (msg) => {
                    console.log('웨이팅 상태 변경 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.type === 'STATUS_CHANGE') {
                        addNotification({
                            id: Date.now(),
                            title: '웨이팅 상태 변경',
                            message: alert.message,
                            time: '방금 전',
                            read: false,
                            userId: alert.userId
                        })
                    }
                })

                //웨이팅 등록 구독
                client.subscribe('/topic/regist', (msg) => {

                    console.log('서버로부터 메시지 받음:', msg.body);

                    const alert = JSON.parse(msg.body);
                    // 본인이 보낸 메시지만 처리
                    // if (alert.sender === myUserId) {
                    if (alert.type === 'REGIST') {
                        addNotification({
                            id: Date.now(),
                            title: '웨이팅 등록',
                            message: alert.content,
                            read: false,
                        })
                    }
                    // }
                });
            },
            onStompError: (frame) => {
                console.error('사용자 STOMP 에러:', frame)
                setIsConnected(false)
            },
            onDisconnect: () => {
                console.log('사용자 WebSocket 연결 해제')
                setIsConnected(false)
            }
        })

        client.activate()
        setStompClient(client)

        return () => {
            if (client) {
                client.deactivate()
            }
        }
    }, [])

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev])
    }

    const value = {
        stompClient,
        notifications,
        isConnected,
        addNotification
    }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
}