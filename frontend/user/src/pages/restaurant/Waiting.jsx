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

export default function Waiting({ reservationType }) {

  const [people, setPeople] = useState(1); // 초기 인원 수
  const [stompClient, setStompClient] = useState(null);
  const [myUserId] = useState(1); // 현재 사용자 ID (나중에 로그인 정보에서 가져오기)
  const [isWaitingOpen, setIsWaitingOpen] = useState(false); //웨이팅 오픈
  const [team2, setTeam2] = useState(0);
  const [team4, setTeam4] = useState(0);
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const [restaurant, setRestaurant] = useState(null);


  const fetchRestaurant = async (restaurantId) => {
    const response = await getRestaurant(restaurantId);
    console.log('웨이팅에서 레스토랑id 조회', response.data);

    setRestaurant(response.data);
  }

  useEffect(() => {
    fetchRestaurant(restaurantId);
  }, [restaurantId])

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


  useEffect(() => {

    if (!restaurantId) return;

    // 1. 웨이팅 상태 및 팀 수 조회
    fetchWaitingStatus();

    // 3. 웹소켓 연결 및 실시간 업데이트 구독
    const socket = new SockJS('http://localhost:8002/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('웹소켓 연결 성공');

        // 웨이팅 오픈 구독
        client.subscribe(`/topic/restaurant/${restaurantId}/open`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === "OPEN") {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 오픈되었습니다.');
          }
        });

        //웨이팅 닫기 구독
        client.subscribe(`/topic/restaurant/${restaurantId}/close`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === "CLOSE") {
            setIsWaitingOpen(false);
            window.alert('웨이팅이 마감되었습니다.');
          }
        });

        //웨이팅 취소 구독
        client.subscribe('/topic/cancel', (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === "CANCEL") {
            fetchWaitingStatus();
          }
        });


        //웨이팅 등록 구독
        const subscription = client.subscribe('/topic/regist', (msg) => {

          console.log('서버로부터 메시지 받음:', msg.body);

          const alert = JSON.parse(msg.body);
          // 본인이 보낸 메시지만 처리
          if (alert.sender === myUserId) {
            if (alert.type === 'REGIST') {
              window.alert('웨이팅이 등록되었습니다.')
              fetchWaitingStatus();
            } else {
              window.alert('웨이팅 등록 실패.');
            }
          }
        });
        console.log('구독 완료:', subscription.id);
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      }
    });
    client.activate();
    setStompClient(client);

    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [restaurantId]);


  if (!restaurant) return <div>레스토랑 로딩중 ...</div>

  //웨이팅 등록
  const waitingRegist = () => {

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
          userId: 1,
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
        <div className={styles["waiting-info"]}>
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
                <button className="counter-btn" onClick={decrement}>-</button>
                <span className="guest-count">{people}</span>
                <button className="counter-btn" onClick={increment}>+</button>
              </div>
            </div>
          </div>
        </div>

        <button className={styles["reservation-btn"]} onClick={waitingRegist} >
          {isWaitingOpen ? '웨이팅 등록' : '웨이팅 등록 불가'}
        </button>
      </div>

    </>
  )
}
