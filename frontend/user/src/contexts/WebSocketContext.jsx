import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { getCurrentUser } from '../pages/utils/UserApi'

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
    const [userId, setUserId] = useState(null)
    const [notifications, setNotifications] = useState([])

    // userId가 변경될 때 해당 사용자의 알림만 불러오기
    useEffect(() => {
        if (!userId) return

        try {
            const storageKey = `notifications_${userId}`
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                const now = Date.now()
                const oneDayMs = 24 * 60 * 60 * 1000
                // 24시간 이내의 알림만 유지
                const filtered = parsed.filter(notif => (now - notif.timestamp) < oneDayMs)
                setNotifications(filtered)
            } else {
                setNotifications([])
            }
        } catch (error) {
            console.error('알림 불러오기 실패:', error)
            setNotifications([])
        }
    }, [userId])

    // notifications가 변경될 때마다 localStorage에 저장 (userId별로)
    useEffect(() => {
        if (!userId) return

        try {
            const storageKey = `notifications_${userId}`
            localStorage.setItem(storageKey, JSON.stringify(notifications))
        } catch (error) {
            console.error('알림 저장 실패:', error)
        }
    }, [notifications, userId])

    // 24시간마다 오래된 알림 자동 제거
    useEffect(() => {
        if (!userId) return

        const cleanupInterval = setInterval(() => {
            const now = Date.now()
            const oneDayMs = 24 * 60 * 60 * 1000
            setNotifications(prev =>
                prev.filter(notif => (now - notif.timestamp) < oneDayMs)
            )
        }, 60 * 60 * 1000) // 1시간마다 체크

        return () => clearInterval(cleanupInterval)
    }, [userId])

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser()
                setUserId(response.data.id)
                console.log('WebSocketContext - 현재 사용자 ID:', response.data.id)
            } catch (error) {
                console.error('WebSocketContext - 사용자 정보 조회 실패:', error)
            }
        }
        fetchCurrentUser()
    }, [])

    // WebSocket 연결 (userId가 있을 때만)
    useEffect(() => {
        if (!userId) return

        const socket = new SockJS('http://localhost:8002/ws')
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            onConnect: () => {
                console.log('사용자 WebSocket 연결 성공')
                setIsConnected(true)

                // 개인화된 웨이팅 호출 알림 구독
                client.subscribe(`/topic/user/${userId}/call`, (msg) => {
                    console.log('웨이팅 호출 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.waitingState === 'CALLED') {
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

                // 개인화된 웨이팅 착석 알림 구독
                client.subscribe(`/topic/user/${userId}/seated`, (msg) => {
                    console.log('웨이팅 착석 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.waitingState === 'SEATED') {
                        addNotification({
                            id: Date.now(),
                            type: 'WAITING_SEATED',
                            title: '웨이팅 착석',
                            name: alert.restaurantName,
                            message: `착석이 완료되었습니다.`,
                            time: alert.createdAt,
                            timestamp: Date.now(),
                            read: false,
                            userId: alert.userId
                        })
                    }
                })

                // 개인화된 웨이팅 취소 알림 구독
                client.subscribe(`/topic/user/${userId}/cancel`, (msg) => {
                    console.log('웨이팅 취소 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)
                    if (alert.waitingState === 'CANCELLED') {
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

                //웨이팅 등록 구독
                client.subscribe('/topic/regist', (msg) => {
                    console.log('서버로부터 메시지 받음:', msg.body)
                    const alert = JSON.parse(msg.body)

                    if (alert.type === 'REGIST' && alert.sender === userId) {
                        addNotification({
                            id: Date.now(),
                            title: '웨이팅 등록',
                            message: alert.content,
                            timestamp: Date.now(),
                            read: false,
                            userId: userId
                        })
                    }
                })
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
    }, [userId])

    const addNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev])
    }, [])

    const removeNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    }, [])

    const clearAllNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        )
    }, [])

    const value = useMemo(() => ({
        stompClient,
        notifications,
        isConnected,
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
        markAllAsRead
    }), [stompClient, notifications, isConnected, addNotification, removeNotification, clearAllNotifications, markAsRead, markAllAsRead])

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
}