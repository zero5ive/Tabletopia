window.global = window;

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import styles from './Waiting.module.css'
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { getRestaurant } from '../utils/RestaurantApi';
import { useSearchParams } from 'react-router-dom';
import { getWaitingStatus } from '../utils/WaitingApi';
// import UserApi from '../utils/UserApi';
import { updateUser, getCurrentUser } from '../utils/UserApi';
import { useWebSocket } from '../../contexts/WebSocketContext';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8002/ws';

export default function Waiting({ reservationType }) {

  const { addNotification } = useWebSocket(); // WebSocketContext 사용
  const [people, setPeople] = useState(1); // 초기 인원 수
  const [stompClient, setStompClient] = useState(null);
  const [isWaitingOpen, setIsWaitingOpen] = useState(false); //웨이팅 오픈
  const [team2, setTeam2] = useState(0);
  const [team4, setTeam4] = useState(0);
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const [restaurant, setRestaurant] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    id: '',
    name: '',
    phoneNumber: '',
    email: ''
  });

  const fetchRestaurant = async (restaurantId) => {
    const response = await getRestaurant(restaurantId);
    console.log('웨이팅에서 레스토랑id 조회', response.data);

    setRestaurant(response.data);
  }

  useEffect(() => {
    fetchRestaurant(restaurantId);
  }, [restaurantId])

  useEffect(() => {
    // 로그인한 경우에만 사용자 정보 불러오기
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('로그인되지 않은 사용자입니다.');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        setCustomerInfo({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber
        });
        console.log('사용자 정보 로드 완료:', userData.email);
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
        // 로그인 페이지로 리다이렉트하거나 조용히 실패 처리
      }
    };
    fetchUserInfo();
  }, []);

  const increment = () => {
    setPeople(prev => prev + 1);
  };

  const decrement = () => {
    if (people > 1) setPeople(prev => prev - 1);
  };

  //웨이팅 상태 및 팀 수 조회 함수
  const fetchWaitingStatus = async () => {
    if (!restaurantId) return;
    const response = await getWaitingStatus(restaurantId);
    console.log('웨이팅 상태', response);

    setIsWaitingOpen(response.data.isOpen);
    setTeam2(response.data.team2 || 0);
    setTeam4(response.data.team4 || 0);
    console.log('웨이팅 상태 조회:', response.data);
  }


  // 웨이팅 상태 조회 (로그인 여부와 무관)
  useEffect(() => {
    if (!restaurantId) return;

    fetchWaitingStatus();
  }, [restaurantId]);

  // WebSocket 연결 (로그인한 사용자만)
  useEffect(() => {
    // 로그인하지 않은 경우 WebSocket 연결 스킵
    if (!restaurantId || !customerInfo.id) {
      console.log('비로그인 사용자 또는 customerInfo 대기 중...');
      return;
    }

    console.log('WebSocket 연결 시작 - customerInfo.id:', customerInfo.id);


    // 3. 웹소켓 연결 및 실시간 업데이트 구독
    const socket = new SockJS(WS_URL);

    // JWT 토큰이 있는 경우에만 connectHeaders에 추가
    const token = localStorage.getItem('accessToken');
    const clientConfig = {
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('[Waiting.jsx] 웹소켓 연결 성공 - restaurantId:', restaurantId);

        // 웨이팅 오픈 구독
        console.log('[Waiting.jsx] /topic/restaurant/' + restaurantId + '/open 구독 시작');
        client.subscribe(`/topic/restaurant/${restaurantId}/open`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === "OPEN") {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 오픈되었습니다.');
          }
        });

        //웨이팅 닫기 구독
        console.log('[Waiting.jsx] /topic/restaurant/' + restaurantId + '/close 구독 시작');
        client.subscribe(`/topic/restaurant/${restaurantId}/close`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === "CLOSE") {
            setIsWaitingOpen(false);
            window.alert('웨이팅이 마감되었습니다.');
          }
        });

        //웨이팅 취소 구독 (레스토랑별 취소 이벤트)
        console.log('[Waiting.jsx] /topic/restaurant/' + restaurantId + '/cancel 구독 시작');
        client.subscribe(`/topic/restaurant/${restaurantId}/cancel`, async (msg) => {
          console.log('[Waiting.jsx] 취소 이벤트 받음:', msg.body);
          const response = JSON.parse(msg.body);
          console.log('[Waiting.jsx] 취소 이벤트 파싱:', response);
          // 취소 발생 시 대기 팀 수 갱신
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (취소) - 전');
          await fetchWaitingStatus();
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (취소) - 후');
        });

        //웨이팅 호출 구독 (레스토랑별 호출 이벤트)
        console.log('[Waiting.jsx] /topic/restaurant/' + restaurantId + '/call 구독 시작');
        client.subscribe(`/topic/restaurant/${restaurantId}/call`, async (msg) => {
          console.log('[Waiting.jsx] 호출 이벤트 받음:', msg.body);
          // 호출 시에도 대기 팀 수 갱신
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (호출) - 전');
          await fetchWaitingStatus();
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (호출) - 후');
        });

        //웨이팅 착석 구독 (레스토랑별 착석 이벤트)
        console.log('[Waiting.jsx] /topic/restaurant/' + restaurantId + '/seated 구독 시작');
        client.subscribe(`/topic/restaurant/${restaurantId}/seated`, async (msg) => {
          console.log('[Waiting.jsx] 착석 이벤트 받음:', msg.body);
          // 착석 시에도 대기 팀 수 갱신
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (착석) - 전');
          await fetchWaitingStatus();
          console.log('[Waiting.jsx] fetchWaitingStatus 호출 (착석) - 후');
        });


        //웨이팅 등록 구독
        console.log('[Waiting.jsx] /topic/regist 구독 시작');
        const subscription = client.subscribe('/topic/regist', (msg) => {

          console.log('[Waiting.jsx] 서버로부터 메시지 받음:', msg.body);

          const alert = JSON.parse(msg.body);
          console.log('[Waiting.jsx] 웨이팅 하는 id:', customerInfo.id, 'sender:', alert.sender, 'type:', alert.type)

          if (alert.type === 'ERROR') {
            // 에러 메시지는 모든 사용자에게 전달되므로 무조건 표시
            window.alert(alert.content);
            return;
          }

          // 본인이 보낸 메시지만 처리
          if (Number(alert.sender) === Number(customerInfo.id)) {
            if (alert.type === 'REGIST') {
              window.alert('웨이팅이 등록되었습니다.')
              fetchWaitingStatus();

              // 알림 추가 (WebSocketContext로)
              console.log('[Waiting.jsx] 알림 추가 시도:', alert)
              addNotification({
                id: Date.now(),
                title: '웨이팅 등록',
                name: alert.restaurantName || '',
                message: alert.content || '웨이팅이 등록되었습니다.',
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                read: false,
                userId: customerInfo.id
              })
              console.log('[Waiting.jsx] 알림 추가 완료')
            } else {
              window.alert('웨이팅 등록 실패.');
            }
          } else {
            console.log('[Waiting.jsx] 다른 사용자의 메시지 무시 - sender:', alert.sender, 'myId:', customerInfo.id)
          }
        });
        console.log('구독 완료:', subscription.id);
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      }
    };

    // JWT 토큰이 있는 경우에만 Authorization 헤더 추가
    if (token) {
      clientConfig.connectHeaders = {
        Authorization: `Bearer ${token}`
      };
    }

    const client = new Client(clientConfig);
    client.activate();
    setStompClient(client);

    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [restaurantId, customerInfo.id]);


  if (!restaurant) return <div>레스토랑 로딩중 ...</div>

  //웨이팅 등록
  const waitingRegist = () => {
    // 로그인 체크
    const token = localStorage.getItem('accessToken');
    if (!token || !customerInfo.id) {
      window.alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!isWaitingOpen) {
      window.alert('현재 웨이팅 등록이 불가능합니다.');
      return;
    }

    if (!restaurant) {
      window.alert('레스토랑을 불러오는 중입니다.');
      return;
    }

    //WebSocket 연결 체크
    if (!stompClient || !stompClient.connected) {
      window.alert('서버와 연결이 끊어졌습니다. 페이지를 새로고침해주세요.');
      return;
    }

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/waiting/regist`,
        body: JSON.stringify({
          userName: customerInfo.name,
          userNumber : customerInfo.phoneNumber,
          restaurantName: restaurant.name,
          peopleCount: people,
          restaurantId: restaurantId,
        })
      });
    }
  }


  return (
    <>

      <div className={`${styles["waiting-content"]} ${reservationType === 'waiting' ? styles['active'] : ''}`}>
        <div className={`${styles["waiting-info"]} ${!isWaitingOpen ? styles['closed'] : ''}`}>
          <div className={styles["waiting-status"]}>
            {isWaitingOpen ? (
              <>
                <div>2인석 : {team2}팀</div>
                <div>4인석 : {team4}팀</div>
              </>
            ) : '현재 웨이팅이 닫혀있습니다.'}

          </div>
        </div>

        <div className={styles["date-time-selector"]}>
          <div className={styles["selector-group"]}>
            <label className={styles["selector-label"]}>인원</label>
            <div className={styles["guest-counter"]}>
              <span>성인</span>
              <div className="counter-controls">
                <button className="counter-btn" onClick={decrement} disabled={!isWaitingOpen}>-</button>
                <span className="guest-count">{people}</span>
                <button className="counter-btn" onClick={increment} disabled={!isWaitingOpen}>+</button>
              </div>
            </div>
          </div>
        </div>

        <button
          className={styles["reservation-btn"]}
          onClick={waitingRegist}
          disabled={!isWaitingOpen}
        >
          {isWaitingOpen ? '웨이팅 등록' : '웨이팅 등록 불가'}
        </button>
      </div>

    </>
  )
}
