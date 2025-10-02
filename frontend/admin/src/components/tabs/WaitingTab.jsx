import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function WaitingTab() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [showVisitConfirmed, setShowVisitConfirmed] = useState(false);
  const [showStoreArrival, setShowStoreArrival] = useState(false);

  const [waitingList, setWaitingList] = useState([
    {
      id: 1,
      waitingNumber: 407,
      customerInfo: { name: '홍길동', phone: '010-1234-5678', partySize: 2, specialRequest: '41분 대기' },
      status: '호출',
      visitConfirmed: true,
      storeArrival: false,
      orderInfo: ['오일 파스타 x 1', '리구 파스타 x 1'],
      notes: '보조석, 초장으로지리'
    },
    {
      id: 2,
      waitingNumber: 408,
      customerInfo: { name: '김철수', phone: '010-9876-5432', partySize: 4, specialRequest: '15분 대기' },
      status: '착석',
      visitConfirmed: true,
      storeArrival: true,
      orderInfo: ['스테이크 x 2', '파스타 x 2'],
      notes: '창가 자리 요청'
    },
    {
      id: 3,
      waitingNumber: 409,
      customerInfo: { name: '박영희', phone: '010-1111-2222', partySize: 3, specialRequest: '32분 대기' },
      status: '취소',
      visitConfirmed: false,
      storeArrival: false,
      orderInfo: [],
      notes: ''
    }
  ]);

  const filteredWaitingList = waitingList.filter(waiting => {
    if (activeFilter !== '전체' && waiting.status !== activeFilter) return false;
    if (showVisitConfirmed && !waiting.visitConfirmed) return false;
    if (showStoreArrival && !waiting.storeArrival) return false;
    return true;
  });

  const statusCounts = {
    전체: waitingList.length,
    호출: waitingList.filter(w => w.status === '호출').length,
    착석: waitingList.filter(w => w.status === '착석').length,
    취소: waitingList.filter(w => w.status === '취소').length
  };

  //웨이팅 open관련
  const [isWaitingOpen, setIsWaitingOpen] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setWaitingList(prev =>
      prev.map(waiting =>
        waiting.id === id ? { ...waiting, status: newStatus } : waiting
      )
    );
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8002/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('웹소켓 연결 성공');

        //구독
        client.subscribe('/topic/open', (msg) => {
          console.log('서버로부터 메시지 받음:', msg);

          const alert = JSON.parse(msg.body);
          if (alert.type === 'OPEN') {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 오픈되었습니다.');
          } else {
            setIsWaitingOpen(false);
            window.alert('웨이팅이 닫혔습니다.');
          }
        }),
        
        client.subscribe('/topic/close', (msg) => {
          console.log('웨이팅 닫기 메시지 받음 : ', msg);

          const alert = JSON.parse(msg.body);
          if(alert.type === 'CLOSE'){
            setIsWaitingOpen(false);
            window.alert('웨이팅이 닫혔습니다.');
          }else {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 아직 오픈되어 있습니다.');
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

 
  

  //  웨이팅 토글 함수 (오픈/닫기)
  const toggleWaiting = () => {
    if (stompClient && stompClient.connected) {
      // 현재 상태에 따라 OPEN 또는 CLOSE 결정
      const action = isWaitingOpen ? 'close' : 'open';
      stompClient.publish({
        destination: `/app/waiting/${action.toLowerCase()}`,
        body: JSON.stringify({
          action: action,
          timestamp: new Date().toISOString()
        })
      });
      console.log(`웨이팅 ${action} 요청 전송`);
    } else {
      console.error('웹소켓이 연결되지 않았습니다');
    }
  };

  return (
    <div className="tab-pane fade show active" id="waiting">
      <div className="waiting-container">
        {/* 헤더 */}
        <div className="waiting-header">
          <div className="waiting-titleSection">
            <h1 className="waiting-title">웨이팅 관리</h1>
            <div className="waiting-toggle">
              {isWaitingOpen ? '신규 웨이팅을 등록받고있어요' : '웨이팅 등록이 중단되었습니다'}
              <label className="waiting-switch">
                <input 
                  type="checkbox" 
                  checked={isWaitingOpen} 
                  onChange={toggleWaiting}
                />
                <span className="waiting-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="waiting-filterSection">
          <div className="waiting-statusFilters">
            <span className="waiting-filterLabel">웨이팅 중 (</span>
            <span className="waiting-count">7팀</span>
            <span className="waiting-filterLabel">·</span>
            <span className="waiting-count">20명</span>
            <span className="waiting-filterLabel">)</span>

            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                className={`waiting-filterButton ${status} ${activeFilter === status ? 'active' : ''}`}
                onClick={() => setActiveFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 웨이팅 리스트 */}
        <div className="waiting-list">
          {filteredWaitingList.map(waiting => (
            <div key={waiting.id} className="waiting-card">
              <div className="waiting-number">
                <div className="waiting-numberBadge">{waiting.waitingNumber}</div>
                <span className="waiting-numberLabel">번째</span>
              </div>

              <div className="waiting-customerInfo">
                <div>{waiting.customerInfo.name} / 총 {waiting.customerInfo.partySize}명</div>
                <div>{waiting.customerInfo.phone} • {waiting.customerInfo.specialRequest}</div>
                {waiting.orderInfo.length > 0 && (
                  <div>{waiting.orderInfo.join(', ')}</div>
                )}
                {waiting.notes && <div>{waiting.notes}</div>}
              </div>

              <div className="waiting-actionButtons">
                <button onClick={() => handleStatusChange(waiting.id, '호출')}>호출</button>
                <button onClick={() => handleStatusChange(waiting.id, '착석')}>착석</button>
                <button onClick={() => handleStatusChange(waiting.id, '취소')}>취소</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}