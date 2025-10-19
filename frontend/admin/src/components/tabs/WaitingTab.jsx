import React, { useEffect, useState, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getWaitingList, waitingCancel, waitingCall, waitingSeated, getWaitingStatus } from '../../utils/WaitingApi';
import { useSearchParams } from 'react-router-dom';

export default function WaitingTab({selectedRestaurant}) {
  const [activeFilter, setActiveFilter] = useState('웨이팅');
  const [waitingList, setWaitingList] = useState([]);
  const [searchParams] = useSearchParams();

  //페이징 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // useRef로 최신 값 참조
  const selectedRestaurantRef = useRef(selectedRestaurant);
  const activeFilterRef = useRef(activeFilter);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    selectedRestaurantRef.current = selectedRestaurant;
  }, [selectedRestaurant]);

  useEffect(() => {
    activeFilterRef.current = activeFilter;
  }, [activeFilter]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // 상태 매핑 추가
  const statusMap = {
    '웨이팅': 'WAITING',
    '호출': 'CALLED',
    '착석': 'SEATED',
    '취소': 'CANCELLED'  
  };

  //웨이팅 리스트 조회 함수
  const fetchWaitingList = async (page = 0, status = 'WAITING') => {
    console.log("웨이팅 리스트 조회 함수 시작", "page:", page, "status:", status);
    const restaurant = selectedRestaurantRef.current;

    if (!restaurant) {
      console.log("selectedRestaurant가 없음");
      return;
    }

    console.log("어드민 레스토랑 아이디: " + restaurant.id);

    try {
      const response = await getWaitingList(restaurant.id, page, pageSize, status);
      console.log('===== API 응답 전체 =====', response);
      console.log('===== API 응답 data =====', response.data);
      console.log('===== response.data의 타입 =====', typeof response.data);
      console.log('===== response.data의 키들 =====', Object.keys(response.data || {}));

      const pageData = response.data;

      // 응답 데이터 구조 확인
      if (!pageData) {
        console.error('응답 데이터가 없습니다');
        return;
      }

      console.log('content:', pageData.content);
      console.log('page 객체:', pageData.page);
      console.log('totalPages:', pageData.totalPages);
      console.log('totalElements:', pageData.totalElements);
      console.log('number:', pageData.number);

      // page 객체 안에 페이징 정보가 있는 경우
      const pageInfo = pageData.page || pageData;
      console.log('pageInfo:', pageInfo);
      console.log('pageInfo.totalPages:', pageInfo.totalPages);
      console.log('pageInfo.totalElements:', pageInfo.totalElements);
      console.log('pageInfo.number:', pageInfo.number);

      // 현재 페이지가 비어있고 이전 페이지가 있으면 이전 페이지로 이동
      if (pageData.content && pageData.content.length === 0 && page > 0) {
        console.log('현재 페이지가 비어있어 이전 페이지로 이동');
        fetchWaitingList(page - 1, status);
        return;
      }

      setWaitingList(pageData.content ? transformedWatingData(pageData.content) : []);
      setTotalPages(pageInfo.totalPages || 0);
      setTotalElements(pageInfo.totalElements || 0);
      setCurrentPage(pageInfo.number || 0);

      console.log('업데이트 완료 - totalPages:', pageInfo.totalPages, 'totalElements:', pageInfo.totalElements, 'currentPage:', pageInfo.number);
    } catch (error) {
      console.error('웨이팅 리스트 조회 실패:', error);
      console.error('에러 상세:', error.response || error.message);
    }
  };

  //웨이팅 정보
  const transformedWatingData = (waitingData) => {
    return waitingData.map(item => {
      console.log('웨이팅한 리스트 : ' , item)
      console.log('웨이팅 항목:', item.id, 'waitingState:', item.waitingState);
      return {
        id: item.id,
        waitingNumber: item.waitingNumber,
        status: item.waitingState,
        customerInfo: {
          userId: item.userId,
          userName: item.userName,
          tel : item.userPhone,
          peopleCount: item.peopleCount
        },
        createdAt: item.createdAt,
      };
    });
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
          response = await waitingCall(waitingId, selectedRestaurant.id);
          message = response.data;
          break;
        case '착석':
          response = await waitingSeated(waitingId, selectedRestaurant.id);
          message = response.data;
          break;
        default:
          return;
      }

      window.alert(message);

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

    try {
      const response = await waitingCancel(waitingId, selectedRestaurant.id);
      window.alert("웨이팅이 취소되었습니다.");

      // 현재 페이지 데이터를 다시 불러옴 (취소된 항목은 WAITING 탭에서 사라짐)
      const status = statusMap[activeFilter];
      fetchWaitingList(currentPage, status);
    } catch (error) {
      console.error('취소 실패:', error);
      window.alert("취소 중 오류가 발생했습니다.");
    }
  }

  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
    const status = statusMap[filterName];
    fetchWaitingList(0, status);
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
    console.log('useEffect 실행됨, selectedRestaurant:', selectedRestaurant);
    if (selectedRestaurant) {
      console.log('fetchWaitingList 호출 시작');
      fetchWaitingList(0, 'WAITING');
    } else {
      console.log('selectedRestaurant가 없어서 fetchWaitingList 호출 안함');
    }
  }, [selectedRestaurant]);

  // 탭이 활성화될 때 데이터 다시 로드
  useEffect(() => {
    const handleTabShown = (event) => {
      const href = event.target.getAttribute('href');
      if (href === '#waiting' && selectedRestaurant) {
        console.log('웨이팅 탭 활성화됨, 데이터 다시 로드');
        const status = statusMap[activeFilter];
        fetchWaitingList(0, status);
      }
    };

    const waitingTabButton = document.querySelector('a[href="#waiting"]');
    if (waitingTabButton) {
      waitingTabButton.addEventListener('shown.bs.tab', handleTabShown);
      return () => {
        waitingTabButton.removeEventListener('shown.bs.tab', handleTabShown);
      };
    }
  }, [selectedRestaurant, activeFilter]);

  useEffect(() => {
    if (!selectedRestaurant) return;

    getWaitingStatus(selectedRestaurant.id)
      .then(response => {
        setIsWaitingOpen(response.data.isOpen);
        console.log('초기 웨이팅 상태:', response.data.isOpen);
      })
      .catch(error => {
        console.error('웨이팅 상태 조회 실패:', error);
      });
  }, [selectedRestaurant]);

  useEffect(() => {
    if (!selectedRestaurant) {
      console.log('selectedRestaurant가 없어서 WebSocket 연결 안함');
      return;
    }

    console.log('WebSocket 연결 시작, restaurantId:', selectedRestaurant.id);

    const socket = new SockJS('http://localhost:8002/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('웹소켓 연결 성공');
        console.log('구독할 레스토랑 ID:', selectedRestaurant.id);

        client.subscribe(`/topic/restaurant/${selectedRestaurant.id}/open`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === 'OPEN') {
            setIsWaitingOpen(true);
            window.alert('웨이팅이 오픈되었습니다.');
          }
        });

        client.subscribe(`/topic/restaurant/${selectedRestaurant.id}/close`, (msg) => {
          const alert = JSON.parse(msg.body);
          if (alert.type === 'CLOSE') {
            setIsWaitingOpen(false);
            window.alert('웨이팅이 닫혔습니다.');
          }
        });

        const registSubscription = client.subscribe('/topic/regist', (msg) => {
          console.log('웨이팅 등록 메시지 받음:', msg.body);
          const alert = JSON.parse(msg.body);
          console.log('등록 메시지 상세:', alert);
          console.log('현재 선택된 레스토랑:', selectedRestaurantRef.current?.id);
          // 현재 선택된 레스토랑의 웨이팅인지 확인
          if (selectedRestaurantRef.current &&
              alert.restaurantId === selectedRestaurantRef.current.id) {
            console.log('✅ 등록 메시지 처리 - 리스트 새로고침');
            const status = statusMap[activeFilterRef.current];
            fetchWaitingList(currentPageRef.current, status);
          } else {
            console.log('❌ 다른 레스토랑의 등록 메시지 - 무시');
          }
        });
        console.log('✅ /topic/regist 구독 완료:', registSubscription);

        const cancelSubscription = client.subscribe(`/topic/restaurant/${selectedRestaurant.id}/cancel`, (msg) => {
          console.log('웨이팅 취소 메시지 받음:', msg.body);
          const response = JSON.parse(msg.body);
          console.log('웨이팅 취소한 정보', response);
          console.log('✅ 취소 메시지 처리 - 리스트 새로고침');
          // 레스토랑별 구독이므로 type, restaurantId 확인 불필요
          // WaitingResponse 형식으로 전달됨
          const status = statusMap[activeFilterRef.current];
          fetchWaitingList(currentPageRef.current, status);
        });
        console.log('✅ /topic/restaurant/' + selectedRestaurant.id + '/cancel 구독 완료:', cancelSubscription);
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      }
    });
    
    client.activate();
    setStompClient(client);

    return () => {
      console.log('WebSocket 연결 해제');
      if (client) {
        client.deactivate();
      }
    };
  }, [selectedRestaurant]);

  //  웨이팅 토글 함수 (오픈/닫기)
  const toggleWaiting = () => {
    if (!selectedRestaurant) {
      console.error('레스토랑이 선택되지 않았습니다');
      return;
    }

    if (!stompClient || !stompClient.connected) {
      console.error('웹소켓이 연결되지 않았습니다');
      window.alert('서버와 연결이 끊어졌습니다. 페이지를 새로고침해주세요.');
      return;
    }

    const action = isWaitingOpen ? 'close' : 'open';

    stompClient.publish({
      destination: `/app/waiting/${action}`,
      body: JSON.stringify({
        restaurantId: selectedRestaurant.id  
      })
    });
    console.log(`웨이팅 ${action} 요청 전송`);
  };

  // 레스토랑 미선택 시 안내 화면
  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="waiting">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">
              웨이팅을 관리하려면 먼저 매장을 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 레스토랑 선택 시 정상 화면
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
            <span className="waiting-filterLabel">{activeFilter} (</span>
            <span className="waiting-count">{totalElements}팀</span>
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
          {filteredWaitingList.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <i className="fas fa-clipboard-list fa-3x mb-3"></i>
              <p>현재 {activeFilter} 상태의 웨이팅이 없습니다.</p>
            </div>
          ) : (
            filteredWaitingList.map(waiting => (
              <div key={waiting.id} className="waiting-card">
                <div className="waiting-number">
                  <div className="waiting-numberBadge">{waiting.waitingNumber}</div>
                  <span className="waiting-numberLabel">번째</span>
                </div>

                <div className="waiting-customerInfo">
                  <div>{waiting.customerInfo.userName} / 총 {waiting.customerInfo.peopleCount}명</div>
                  <div>{waiting.customerInfo.tel}</div>
                </div>

                <div className="waiting-actionButtons">
                  {(() => {
                    return waiting.status !== 'CANCELLED' ? (
                      <>
                        <button onClick={() => handleStatusChange(waiting.id, '호출')}>호출</button>
                        <button onClick={() => handleStatusChange(waiting.id, '착석')}>착석</button>
                        <button onClick={() => handleCancelChange(waiting.id, '취소')}>취소</button>
                      </>
                    ) : (
                      <span className="text-muted">취소됨</span>
                    );
                  })()}
                </div>

              </div>
            ))
          )}
        </div>

        {/* 페이징 UI */}
        <div className="demo-section">
          <div className="pagination-container">
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className={`pagination-btn arrow ${currentPage === 0 ? 'disabled' : ''}`}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}