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
    const [isConnected, setIsConnected] = useState(false)

    // localStorage에서 알림 불러오기 및 24시간 지난 알림 제거
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('notifications')
            if (saved) {
                const parsed = JSON.parse(saved)
                const now = Date.now()
                const oneDayMs = 24 * 60 * 60 * 1000
                // 24시간 이내의 알림만 유지
                return parsed.filter(notif => (now - notif.timestamp) < oneDayMs)
            }
        } catch (error) {
            console.error('알림 불러오기 실패:', error)
        }
        return []
    })

    // notifications가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        try {
            localStorage.setItem('notifications', JSON.stringify(notifications))
        } catch (error) {
            console.error('알림 저장 실패:', error)
        }
    }, [notifications])

    // 24시간마다 오래된 알림 자동 제거
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const now = Date.now()
            const oneDayMs = 24 * 60 * 60 * 1000
            setNotifications(prev =>
                prev.filter(notif => (now - notif.timestamp) < oneDayMs)
            )
        }, 60 * 60 * 1000) // 1시간마다 체크

        return () => clearInterval(cleanupInterval)
    }, [])

    useEffect(() => {
        const socket = new SockJS('http://localhost:8002/ws')
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
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
                            timestamp: Date.now(),
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
                            timestamp: Date.now(),
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
                            timestamp: Date.now(),
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
                            timestamp: Date.now(),
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

    const removeNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    }

    const clearAllNotifications = () => {
        setNotifications([])
    }

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        )
    }

    const value = {
        stompClient,
        notifications,
        isConnected,
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
        markAllAsRead
    }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
}