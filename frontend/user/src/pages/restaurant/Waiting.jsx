window.global = window;

import { useState, useEffect } from "react";
import styles from './Waiting.module.css'
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function Waiting(){

    const [reservationType, setReservationType] = useState("waiting");
    const [people, setPeople] = useState(1); // 초기 인원 수
    const [stompClient, setStompClient] = useState(null);

    const increment = () => {
        setPeople(prev => prev + 1);
    };

    const decrement = () => {
        if (people > 1) setPeople(prev => prev - 1);
    };



      useEffect(() => {
        const socket = new SockJS('http://localhost:8002/ws');
        const client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {                                                  
            console.log('STOMP Debug:', str);                                
         }, 
          onConnect: () => {
            console.log('웹소켓 연결 성공');
    
            //구독
            client.subscribe('/user/queue/regist', (msg) => {
              console.log('서버로부터 메시지 받음:', msg);
    
              const alert = JSON.parse(msg.body);
              if (alert.type === 'REGIST') {
                window.alert('웨이팅이 등록되었습니다.')
              } else {
                window.alert('웨이팅 등록 실패.');
              }
            })
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

      const waitingRegist=()=>{
         if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/waiting/regist`,
                body: JSON.stringify({
                    userId : 1,
                    restaurantName : "냠냠",
                    peopleCount : 5,
                    restaurantId : 2,
                    waitingNumber : 50
                })
            });
         }
      }

    return(
        <>
        
         <div className={`${styles["waiting-content"]} ${reservationType === 'waiting' ? styles['active'] : ''}`}>
                            <div className={styles["waiting-info"]}>
                                <div className={styles["waiting-status"]}>현재 웨이팅 5팀</div>
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

                            <button className={styles["reservation-btn"]} onClick={waitingRegist} >웨이팅 등록</button>
                        </div>
        
        </>
    )
}