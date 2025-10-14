import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getWaitingList, waitingCancel, waitingCall, waitingSeated } from '../../utils/WaitingApi';
import { useParams } from "react-router-dom";


export default function WaitingTab() {
  const [activeFilter, setActiveFilter] = useState('웨이팅');
  const [showVisitConfirmed, setShowVisitConfirmed] = useState(false);
  const [showStoreArrival, setShowStoreArrival] = useState(false);
  const [waitingList, setWaitingList] = useState([]);

  //페이징 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  //임의로 설정한 restaurantId
  const restaurantId = 2;

  // 상태 매핑 추가
  const statusMap = {
    '웨이팅': 'WAITING',
    '호출': 'CALLED',
    '착석': 'SEATED',
    '취소': 'CANCELLED'  
  };

  //웨이팅 리스트 조회 함수
  const fetchWaitingList = async (page = 0, status = 'WAITING') => {
    const response = await getWaitingList(restaurantId, page, pageSize, status);
    console.log('웨이팅 리스트 (페이징)', response.data);

    // Spring Page 응답 구조
    const pageData = response.data;

    setWaitingList(transformedWatingData(pageData.content)); // 실제 데이터
    setTotalPages(pageData.totalPages);                      // 전체 페이지 수
    setTotalElements(pageData.totalElements);                // 전체 데이터 수
    setCurrentPage(pageData.number);                         // 현재 페이지 번호

    console.log('현재 페이지:', pageData.number);
    console.log('전체 페이지:', pageData.totalPages);
    console.log('전체 데이터:', pageData.totalElements);
  }

  //웨이팅 정보
  const transformedWatingData = (waitingData) => {
    return waitingData.map(item => ({
      id: item.id,
      waitingNumber: item.waitingNumber,
      customerInfo: {
        userId: item.userId,
        peopleCount: item.peopleCount
      },
      createdAt: item.createdAt,

    }));
  }

  //웨이팅 open관련
  const [isWaitingOpen, setIsWaitingOpen] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  //웨이팅 상태 변경
  const handleStatusChange = async (waitingId, newStatus) => {
    try {
      let response;
      let message;

      switch (newStatus) {
        case '호출':
          response = await waitingCall(waitingId, restaurantId);
          message = response.data;
          break;
        case '착석':
          response = await waitingSeated(waitingId, restaurantId);
          message = response.data;
          break;
        default:
          return;
      }

      window.alert(message);

      // 상태 변경 후 새로고침
      const status = statusMap[activeFilter];
      fetchWaitingList(currentPage, status);

    } catch (error) {
      console.error('상태 변경 실패:', error);
      window.alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  //웨이팅 취소
  const handleCancelChange = async (waitingId) => {
    const confirm = window.confirm("정말 취소하시겠습니까?");
    if (!confirm) return;

    const response = await waitingCancel(waitingId, restaurantId);
    window.alert("웨이팅이 취소되었습니다.");

    //취소 후 새로고침
    const status = statusMap[activeFilter];
    fetchWaitingList(currentPage, status);

  }

  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
    const status = statusMap[filterName];
    fetchWaitingList(0, status); // 첫 페이지부터 해당 상태 조회

  }

  const filteredWaitingList = waitingList;

  //페이지 이동 함수
  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      const status = statusMap[activeFilter]; 
      fetchWaitingList(pageNumber, status);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      const status = statusMap[activeFilter]; 
      fetchWaitingList(currentPage - 1, status);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      const status = statusMap[activeFilter]; 
      fetchWaitingList(currentPage + 1, status);
    }
  };


  useEffect(() => {
    fetchWaitingList(0, 'WAITING'); //초기 로드: 첫 페이지, WAITING 상태
  }, []);


  useEffect(() => {
    const socket = new SockJS('http://localhost:8002/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('웹소켓 연결 성공');

        // 웨이팅 오픈 구독
        client.subscribe('/topic/open', (msg) => {
          console.log('웨이팅 오픈 메시지 받음:', msg.body);
          const alert = JSON.parse(msg.body);
          if (alert.type === 'OPEN') {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 오픈되었습니다.');
          }
        });

        // 웨이팅 닫기 구독
        client.subscribe('/topic/close', (msg) => {
          console.log('웨이팅 닫기 메시지 받음:', msg.body);
          const alert = JSON.parse(msg.body);
          if (alert.type === 'CLOSE') {
            setIsWaitingOpen(false);
            window.alert('웨이팅이 닫혔습니다.');
          }
        });


        // 웨이팅 등록 구독
        client.subscribe('/topic/regist', (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === 'REGIST') {
            fetchWaitingList();
          }
        });

        //웨이팅 취소 구독
        client.subscribe('/topic/cancel', (msg) => {
          const alert = JSON.parse(msg.body);
          if(alert.type === "CANCEL") {
            fetchWaitingList();
          }
        });

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
    <div className="tab-pane fade" id="waiting">
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

           {Object.keys(statusMap).map(status => (
              <button
                key={status}
                className={`waiting-filterButton ${status} ${activeFilter === status ? 'active' : ''}`}
                 onClick={() => handleFilterClick(status)}
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
                <div>{waiting.customerInfo.userId} / 총 {waiting.customerInfo.peopleCount}명</div>
                <div>{waiting.customerInfo.phone}</div>

              </div>

              <div className="waiting-actionButtons">
                <button onClick={() => handleStatusChange(waiting.id, '호출')}>호출</button>
                <button onClick={() => handleStatusChange(waiting.id, '착석')}>착석</button>
                <button onClick={() => handleCancelChange(waiting.id, '취소')}>취소</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이징 UI */}
        {totalPages > 1 && (
          <div className="demo-section">
            <div className="pagination-container">
              <div className="pagination">
                {/* 이전 버튼 */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className={`pagination-btn arrow ${currentPage === 0 ? 'disabled' : ''}`}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: totalPages }, (_, i) => i).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`pagination-btn arrow ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}