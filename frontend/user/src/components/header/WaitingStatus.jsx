import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import styles from './WaitingStatus.module.css'

export function WaitingStatus() {
    const [activeWaiting, setActiveWaiting] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const isMounted = useRef(true)

    // 토큰에서 userId 추출
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUserId(1)
            } catch (e) {
                console.error('토큰 디코드 실패:', e)
            }
        }
    }, [])

    // 웨이팅 상태 조회
    useEffect(() => {
        if (!userId) return

        isMounted.current = true

        const fetchWaitingStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                const response = await fetch(
                    `http://localhost:8002/api/user/waiting/history?page=0&size=1`,
                    {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    }
                )
                const data = await response.json()

                if (!isMounted.current) return

                // 활성 웨이팅만 필터링 (WAITING 또는 CALLED 상태)
                if (data.content && data.content.length > 0) {
                    const waiting = data.content[0]
                    if (waiting.waitingState === 'WAITING' || waiting.waitingState === 'CALLED') {
                        setActiveWaiting(waiting)
                    } else {
                        setActiveWaiting(null)
                    }
                } else {
                    setActiveWaiting(null)
                }
            } catch (error) {
                console.error('웨이팅 상태 조회 실패:', error)
                if (isMounted.current) {
                    setActiveWaiting(null)
                }
            } finally {
                if (isMounted.current) {
                    setInitialLoading(false)
                }
            }
        }

        // 초기 조회
        fetchWaitingStatus()

        // 5초마다 폴링
        const interval = setInterval(fetchWaitingStatus, 5000)

        return () => {
            isMounted.current = false
            clearInterval(interval)
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