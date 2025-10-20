import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import styles from './WaitingStatus.module.css'
import { getWaitingStatusMy } from '../../pages/utils/WaitingApi'
import { getCurrentUser } from '../../pages/utils/UserApi'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8002/ws';

export function WaitingStatus() {
    const [activeWaiting, setActiveWaiting] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const isMounted = useRef(true)
    const stompClient = useRef(null)

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        // 토큰이 없으면 상태 초기화
        if (!token) {
            setUserId(null)
            setActiveWaiting(null)
            setInitialLoading(false)
            return
        }

        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser()
                setUserId(response.data.id)
                console.log('[WaitingStatus] 현재 사용자 ID:', response.data.id)
            } catch (error) {
                console.error('[WaitingStatus] 사용자 정보 조회 실패:', error)
                // 로그인 실패 시 상태 초기화
                setUserId(null)
                setActiveWaiting(null)
                setInitialLoading(false)
            }
        }
        fetchCurrentUser()

        // 로그아웃 감지를 위한 storage event 리스너
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken' && !e.newValue) {
                // accessToken이 제거되면 상태 초기화
                console.log('[WaitingStatus] 로그아웃 감지 - 상태 초기화')
                setUserId(null)
                setActiveWaiting(null)
                setInitialLoading(false)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        // 같은 탭에서의 로그아웃 감지를 위한 주기적 체크
        const tokenCheckInterval = setInterval(() => {
            const currentToken = localStorage.getItem('accessToken')
            if (!currentToken && userId !== null) {
                console.log('[WaitingStatus] 로그아웃 감지 (같은 탭) - 상태 초기화')
                setUserId(null)
                setActiveWaiting(null)
                setInitialLoading(false)
            }
        }, 1000) // 1초마다 체크

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(tokenCheckInterval)
        }
    }, [userId])

    // WebSocket 연결 및 구독
    useEffect(() => {
        if (!userId) return

        isMounted.current = true

        // 웨이팅 상태 조회 함수 (useEffect 내부에 정의)
        const fetchWaitingStatus = async () => {
            try {
                const response = await getWaitingStatusMy()
                const data = response.data

                if (!isMounted.current) return

                // 활성 웨이팅만 필터링 (WAITING 또는 CALLED 상태)
                if (data.content && data.content.length > 0) {
                    const waiting = data.content[0]
                    if (waiting.waitingState === 'WAITING' || waiting.waitingState === 'CALLED') {
                        setActiveWaiting(prev => {
                            // 같은 웨이팅이면 상태 업데이트 스킵
                            if (prev?.id === waiting.id &&
                                prev?.waitingState === waiting.waitingState &&
                                prev?.teamsAhead === waiting.teamsAhead) {
                                return prev
                            }
                            return waiting
                        })
                    } else {
                        setActiveWaiting(prev => prev !== null ? null : prev)
                    }
                } else {
                    setActiveWaiting(prev => prev !== null ? null : prev)
                }
            } catch (error) {
                console.error('[WaitingStatus] 웨이팅 상태 조회 실패:', error)
                if (isMounted.current) {
                    setActiveWaiting(prev => prev !== null ? null : prev)
                }
            } finally {
                if (isMounted.current) {
                    setInitialLoading(false)
                }
            }
        }

        // 초기 조회
        fetchWaitingStatus()

        // WebSocket 연결
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('[WaitingStatus] WebSocket 연결 성공')

                // 웨이팅 호출 알림 구독
                client.subscribe(`/topic/user/${userId}/call`, (message) => {
                    console.log('[WaitingStatus] 웨이팅 호출 알림:', message.body)
                    fetchWaitingStatus()
                })

                // 웨이팅 착석 알림 구독
                client.subscribe(`/topic/user/${userId}/seated`, (message) => {
                    console.log('[WaitingStatus] 웨이팅 착석 알림:', message.body)
                    fetchWaitingStatus()
                })

                // 웨이팅 취소 알림 구독
                client.subscribe(`/topic/user/${userId}/cancel`, (message) => {
                    console.log('[WaitingStatus] 웨이팅 취소 알림:', message.body)
                    fetchWaitingStatus()
                })

                // 웨이팅 등록 알림 구독 (전역 토픽)
                client.subscribe('/topic/regist', (message) => {
                    const event = JSON.parse(message.body)
                    // 내가 등록한 웨이팅인지 확인
                    if (event.sender === userId) {
                        console.log('[WaitingStatus] 웨이팅 등록 알림 (본인):', event)
                        fetchWaitingStatus()
                    }
                })
            },
            onStompError: (frame) => {
                console.error('[WaitingStatus] STOMP 에러:', frame)
            },
        })

        client.activate()
        stompClient.current = client

        return () => {
            isMounted.current = false
            if (stompClient.current) {
                console.log('[WaitingStatus] WebSocket 연결 해제')
                stompClient.current.deactivate()
            }
        }
    }, [userId])

    // 초기 로딩 중이거나 활성 웨이팅이 없으면 표시하지 않음
    if (initialLoading || !activeWaiting) {
        return null
    }

    // 호출된 경우
    if (activeWaiting.waitingState === 'CALLED') {
        return (
            <div className={`${styles.waitingStatus} ${styles.called}`}>
                <span className={styles.icon}>🔔</span>
                <span className={styles.restaurant}>{activeWaiting.restaurantName}</span>
                <span className={styles.separator}>·</span>
                <span className={styles.message}>지금 바로 입장해주세요!</span>
            </div>
        )
    }

    // 대기 중인 경우
    return (
        <div className={`${styles.waitingStatus} ${styles.waiting}`}>
            <span className={styles.icon}>⏰</span>
            <span className={styles.restaurant}>{activeWaiting.restaurantName}</span>
            <span className={styles.separator}>·</span>
            <span className={styles.message}>
                내 앞에 <strong>{activeWaiting.teamsAhead || 0}팀</strong> 대기 중
            </span>
        </div>
    )
}