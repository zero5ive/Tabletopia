window.global = window;

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import styles from './Waiting.module.css'
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { getWaitingList } from "./utils/WaitingApi";

export default function Waiting() {

  const [reservationType, setReservationType] = useState("waiting");
  const [people, setPeople] = useState(1); // 초기 인원 수
  const [stompClient, setStompClient] = useState(null);
  const [myUserId] = useState(1); // 현재 사용자 ID (나중에 로그인 정보에서 가져오기)
  const [isWaitingOpen, setIsWaitingOpen] = useState(false); //웨이팅 오픈
  const [waitingList, setWaitingList] = useState([]);
  const {restaurantId} = useParams();

  
  const increment = () => {
    setPeople(prev => prev + 1);
  };

  const decrement = () => {
    if (people > 1) setPeople(prev => prev - 1);
  };

  //웨이팅 리스트 조회 함수
  const fetchWaitingList = async() =>{
      const response = await getWaitingList(2);
      console.log('웨이팅 리스트', response);

      // Page 객체의 content 배열을 가져옴
      setWaitingList(response.data.content || []);
      console.log('웨이팅 리스트 조회', response.data.content);
  }

  //총 팀 수 계산
  const team2 = waitingList.filter(w => w.waitingState === 'WAITING' && w.peopleCount >= 1 && w.peopleCount <= 2).length;
  const team4 = waitingList.filter(w => w.waitingState === 'WAITING' && w.peopleCount >= 3).length;


  useEffect(() => {

    //웨이팅 리스트 조회
    fetchWaitingList();

    // 1. 먼저 현재 웨이팅 상태를 조회
    axios.get('http://localhost:8002/api/waiting/status')
      .then(response => {
        setIsWaitingOpen(response.data.isOpen);
        console.log('초기 웨이팅 상태:', response.data.isOpen);
      })
      .catch(error => {
        console.error('웨이팅 상태 조회 실패:', error);
      });

    // 2. 웹소켓 연결 및 실시간 업데이트 구독
    const socket = new SockJS('http://localhost:8002/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('웹소켓 연결 성공');

        // 웨이팅 오픈 구독
        client.subscribe('/topic/open', (msg) => {
          console.log('웨이팅 오픈 메시지 받음:', msg.body);
          const alert = JSON.parse(msg.body);
          if (alert.type === "OPEN") {
            setIsWaitingOpen(true);
            console.log('웨이팅 상태: 오픈됨');
          }
        });

        // 웨이팅 닫기 구독
        client.subscribe('/topic/close', (msg) => {
          console.log('웨이팅 닫기 메시지 받음:', msg.body);
          const alert = JSON.parse(msg.body);
          if (alert.type === "CLOSE") {
            setIsWaitingOpen(false);
            console.log('웨이팅 상태: 닫힘');
          }
        });

         //웨이팅 취소 구독
        client.subscribe('/topic/cancel', (msg) => {
          const alert = JSON.parse(msg.body);
          if(alert.type === "CANCEL") {
            fetchWaitingList();
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
              fetchWaitingList();
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
  }, []);

  //웨이팅 등록
  const waitingRegist = () => {

    if(!isWaitingOpen) {
      window.alert('현재 웨이팅 등록이 불가능합니다.');
      return;
    }

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/waiting/regist`,
        body: JSON.stringify({
          userId: 1,
          restaurantName: "냠냠",
          peopleCount: people,
          restaurantId: 2,
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
