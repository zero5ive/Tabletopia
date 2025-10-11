import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import styles from './SelectTable.module.css';
import axios from 'axios';

const TableSelection = () => {
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingTableStatus, setIsLoadingTableStatus] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(null);

  // 맵 인터랙션 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);


  // ✅ 컴포넌트 마운트 상태 추적
  const isMountedRef = useRef(true);

  // 테이블 상태 조회 완료 여부 체크
  const hasLoadedInitialStatus = useRef(false);

  const reservationStep1 = JSON.parse(localStorage.getItem('reservationStep1'));
  const reservationPeople = reservationStep1?.peopleCount || 1;
  const maxSeats = 1;
  const restaurantId = reservationStep1?.restaurantId || 1;

  const navigateRef = useRef(navigate);

  if (!reservationStep1) {
    alert('예약 정보가 없습니다. 처음부터 다시 시작해주세요.');
    window.close();
    return null;
  }

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);
  /**
   * 웹소켓 테이블 상태 업데이트 핸들러
   * @author 김예진
   * @since 2025-10-08
   */

  const handleTableStatusUpdate = useCallback((data, currentSessionId) => {
    if (!isMountedRef.current) return;
     // ✅ 세션 ID가 없으면 처리 중단
  if (!currentSessionId) {
    console.log('⏳ 세션 ID 대기 중... (메시지 무시)');
    return;
  }

    console.log('테이블 상태 업데이트 수신:', data);

    // 1. 여러 테이블 상태를 한꺼번에 갱신하는 경우
    if (data.success && Array.isArray(data.tables)) {
      setTableData(prevTables => {
        return prevTables.map(table => {
          const updated = data.tables.find(t => t.tableId === table.originalId);
          if (updated) {
            return {
              ...table,
              status: updated.status,
              occupied: updated.status !== 'AVAILABLE',
              selectedBy: updated.selectedBy,
              selectedAt: updated.selectedAt,
              expiryTime: updated.expiryTime
            };
          }
          return table;
        });
      });
      setIsLoadingTableStatus(false);
      return;
    }

    // 2. 단일 테이블 갱신
    if (data.tableId) {
      setTableData(prevTables =>
        prevTables.map(table => {
          if (table.originalId === data.tableId) {
            const statusObj = data.tableStatus || {};
            return {
              ...table,
              status: statusObj.status || 'AVAILABLE',
              occupied: statusObj.status !== 'AVAILABLE',
              selectedBy: statusObj.selectedBy,
              selectedAt: statusObj.selectedAt,
              expiryTime: statusObj.expiryTime
            };
          }
          return table;
        })
      );


      // 3. 선점 성공 처리
      if (data.success === true) {
        const activeSelectionStr = sessionStorage.getItem('activeTableSelection');
        if (!activeSelectionStr) {
          console.log('⚠️ activeTableSelection 없음');
          return;
        }

        const activeSelection = JSON.parse(activeSelectionStr);
        const tableStatus = data.tableStatus || {};

        // ✅ 세션 ID 비교 - 현재 사용자가 선점자인지 확인
        const isMine = tableStatus.selectedBy === currentSessionId;

        console.log('🔐 세션 검증:', {
          내세션: currentSessionId,
          선점자: tableStatus.selectedBy,
          일치여부: isMine,
          테이블: data.tableId
        });

        if (isMine) {
          // ✅ 내가 선점한 경우만 다음 단계로 이동
          console.log('✅ 선점 성공! 다음 단계로 이동');

          activeSelection.isConfirmed = true;
          sessionStorage.setItem('activeTableSelection', JSON.stringify(activeSelection));

          const step1 = JSON.parse(localStorage.getItem('reservationStep1'));
          const finalData = {
            ...step1,
            restaurantTableNameSnapshot: activeSelection.tableName,
            restaurantTableId: activeSelection.tableId,
            price: step1.peopleCount * 2000
          };
          localStorage.setItem('finalReservationData', JSON.stringify(finalData));

          navigateRef.current('/reservations/confirm-info');
        } else {
          // ❌ 다른 사용자가 먼저 선점한 경우
          console.log('❌ 다른 사용자가 먼저 선점함');

          setShowAlert({
            type: 'error',
            message: `해당 테이블은 이미 다른 사용자가 선택했습니다.`
          });
          setSelectedSeats([]);
          sessionStorage.removeItem('activeTableSelection');
        }
      }
    }
  }, []); // 의존성 배열 비움



  const {
    isConnected,
    connectionError,
    mySessionId,
    getTableStatus,
    selectTable,
    cancelTable,
  } = useWebSocket(restaurantId, handleTableStatusUpdate);

  
// ✅ 개발용 - 세션 ID를 window에 노출
useEffect(() => {
  if (mySessionId) {
    window.__MY_SESSION_ID__ = mySessionId;
    console.log('🔑 내 세션 ID:', mySessionId);
  }
}, [mySessionId]);

  // 컴포넌트 마운트/언마운트 추적
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      console.log('컴포넌트 언마운트');
      isMountedRef.current = false;
    };
  }, []);

  // Alert 자동 숨김
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // 웹소켓 연결 후 테이블 상태 조회 (한 번만 실행)
  useEffect(() => {
    // 이미 조회했거나, 연결되지 않았거나, 예약 정보가 없으면 스킵
    if (hasLoadedInitialStatus.current || !isConnected || !reservationStep1) {
      return;
    }

    console.log('테이블 상태 최초 조회 시작');
    setIsLoadingTableStatus(true);

    // 약간의 딜레이를 줘서 연결이 완전히 되도록 함
    const timer = setTimeout(() => {
      if (isMountedRef.current && isConnected) {
        getTableStatus(reservationStep1.date, reservationStep1.time);
        hasLoadedInitialStatus.current = true;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isConnected]); // getTableStatus를 의존성에서 제거

  /**
   * 맵 초기 뷰 설정
   * @author 김예진
   * @since 2025-10-08
   */
  const initializeMapView = useCallback((tables) => {
    if (tables.length === 0) return;

    const validTables = tables.filter(t =>
      typeof t.xPosition === 'number' && !isNaN(t.xPosition) &&
      typeof t.yPosition === 'number' && !isNaN(t.yPosition)
    );

    if (validTables.length === 0) {
      setPosition({ x: 50, y: 50 });
      setScale(1);
      return;
    }

    const positions = validTables.map(t => ({ x: t.xPosition, y: t.yPosition }));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    const tableWidth = Math.max(maxX - minX, 100);
    const tableHeight = Math.max(maxY - minY, 100);
    const mapWidth = 400;
    const mapHeight = 400;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const offsetX = (mapWidth / 2) - centerX;
    const offsetY = (mapHeight / 2) - centerY;

    const scaleX = tableWidth > 0 ? (mapWidth * 0.6) / tableWidth : 1;
    const scaleY = tableHeight > 0 ? (mapHeight * 0.6) / tableHeight : 1;
    const initialScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.3), 1.5);

    setPosition({ x: isNaN(offsetX) ? 0 : offsetX, y: isNaN(offsetY) ? 0 : offsetY });
    setScale(isNaN(initialScale) ? 1 : initialScale);
  }, []);

  /**
   * 테이블 타입 결정
   * @author 김예진
   * @since 2025-10-08
   */
  const determineTableType = useCallback((table) => {

    const name = table.name;
    if (name.includes('카운터') || name.includes('counter')) return 'counter';
    if (name.includes('창가') || name.includes('window')) return 'window';
    if (name.includes('프라이빗') || name.includes('private')) return 'private';
    if (table.maxCapacity <= 2) return 'table2';
    if (table.maxCapacity <= 4) return 'table4';
    return 'table2';
  }, []);

  /**
   * API에서 테이블 기본 정보 가져오기
   * @author 김예진
   * @since 2025-10-08
   */
  const fetchTableData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`테이블 데이터 조회 중... restaurantId: ${restaurantId}`);

      const response = await axios.get(`http://localhost:10022/restaurant/${restaurantId}/tables`);
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const transformedTables = data.map((table, index) => ({
          id: `T${table.id}`,
          name: table.name,
          minCapacity: table.minCapacity,
          maxCapacity: table.maxCapacity,
          status: null,
          occupied: false,
          type: determineTableType(table),
          xPosition: typeof table.xposition === 'number' && !isNaN(table.xposition)
            ? table.xposition
            : 100 + (index * 120),
          yPosition: typeof table.yposition === 'number' && !isNaN(table.yposition)
            ? table.yposition
            : 100 + Math.floor(index / 3) * 100,
          shape: table.shape,
          originalId: table.id
        }));

        console.log('변환된 테이블 데이터:', transformedTables);
        setTableData(transformedTables);
        setError(null);
        initializeMapView(transformedTables);
      } else {
        throw new Error('테이블 데이터가 없습니다.');
      }
    } catch (err) {
      console.error('테이블 데이터 조회 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, determineTableType, initializeMapView]);

  // 컴포넌트 마운트 시 1회만 실행
  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // 줌 컨트롤
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const handleZoomReset = () => {
    setScale(1);
    tableData.length > 0 ? initializeMapView(tableData) : setPosition({ x: 0, y: 0 });
  };

  // 드래그 핸들러
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  /**
   * 테이블 클릭 처리
   * @author 김예진
   * @since 2025-10-08
   */
  const handleTableClick = (table, e) => {
    e.stopPropagation();

    if (!isTableSelectable(table)) {
      if (table.status === 'RESERVED') {
        setShowAlert({
          type: 'error',
          message: `${table.name}은(는) 이미 예약된 테이블입니다.`
        });
      } else if (table.status === 'SELECTED') {
        setShowAlert({
          type: 'error',
          message: `${table.name}은(는) 다른 사용자가 선택 중입니다.`
        });
      } else if (reservationPeople < table.minCapacity) {
        setShowAlert({
          type: 'error',
          message: `${table.name}은(는) 최소 ${table.minCapacity}명부터 이용 가능합니다.`
        });
      } else if (reservationPeople > table.maxCapacity) {
        setShowAlert({
          type: 'error',
          message: `${table.name}은(는) 최대 ${table.maxCapacity}명까지 이용 가능합니다.`
        });
      }
      return;
    }

    const isSelected = selectedSeats.some(seat => seat.id === table.id);
    if (isSelected) {
      setSelectedSeats([]);
      sessionStorage.removeItem('activeTableSelection');
      return;
    }

    setSelectedSeats([table]);

    const reservationData = JSON.parse(localStorage.getItem('reservationStep1'));
    sessionStorage.setItem('activeTableSelection', JSON.stringify({
      restaurantId: restaurantId,
      tableId: table.originalId,
      tableName: table.name,
      date: reservationData.date,
      time: reservationData.time,
      isConfirmed: false
    }));
  };

  /**
   * 테이블 선택 가능 여부 판단
   * @author 김예진
   * @since 2025-10-08
   */
  const isTableSelectable = (table) => {
    if (table.status === null) return false;
    if (table.status === 'RESERVED') return false;
    if (table.status === 'SELECTED') return false;
    if (reservationPeople < table.minCapacity || reservationPeople > table.maxCapacity) {
      return false;
    }
    return true;
  };

  /**
   * 테이블 상태에 따른 색상 결정
   * @author 김예진
   * @since 2025-10-08
   */
  const getTableColor = (table) => {
    const isSelected = selectedSeats.some(seat => seat.id === table.id);

    if (isSelected) return '#4ecdc4';

    if (table.status === null) {
      return '#e0e0e0';
    }

    switch (table.status) {
      case 'RESERVED':
        return '#a0a0a0';
      case 'SELECTED':
        return '#ff6b6b';
      case 'AVAILABLE':
        if (reservationPeople < table.minCapacity || reservationPeople > table.maxCapacity) {
          return '#ffa726';
        }
        return '#4CAF50';
      default:
        return '#e0e0e0';
    }
  };

  /**
   * 테이블 크기 결정
   * @author 김예진
   * @since 2025-10-08
   */
  const getTableSize = (table) => {
    if (table.maxCapacity <= 1) return { width: 40, height: 25 };
    if (table.maxCapacity <= 2) return { width: 50, height: 35 };
    if (table.maxCapacity <= 4) return { width: 60, height: 45 };
    return { width: 80, height: 55 };
  };

  /**
   * 테이블 상태 텍스트 가져오기
   * @author 김예진
   * @since 2025-10-08
   */
  const getTableStatusText = (table) => {
    if (table.status === 'RESERVED') return ' (예약됨)';
    if (table.status === 'SELECTED') return ' (선택중)';
    if (reservationPeople < table.minCapacity) return ` (${table.minCapacity}명 이상)`;
    if (reservationPeople > table.maxCapacity) return ` (${table.maxCapacity}명 이하)`;
    return '';
  };

  /**
   * 테이블 확정 (다음 단계로 이동)
   * @author 김예진
   * @since 2025-10-08
   */
  const handleConfirmSeats = () => {
    if (selectedSeats.length !== maxSeats) return;

    // ⚠️ isSelectingRef.current = true; 로직 제거됨

    const tableInfo = selectedSeats[0];

    const selection = sessionStorage.getItem('activeTableSelection');
    if (selection) {
      const data = JSON.parse(selection);
      data.isConfirmed = false;
      sessionStorage.setItem('activeTableSelection', JSON.stringify(data));
    }

    // 테이블 선점 요청 (비동기)
    selectTable(
      tableInfo.originalId,
      'customerName',
      reservationStep1.date,
      reservationStep1.time,
      reservationPeople
    );
  };

  // ------------------------
  // ⚠️ 선점 취소 로직(sendCancelRequestSafe 및 관련 useEffect)이 모두 제거되었습니다.
  // ------------------------

  const totalPrice = reservationPeople * 2000;

  // 로딩 중
  if (loading || isLoadingTableStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>테이블 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }


  // 에러 발생
  if (error && tableData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>테이블 정보를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error}</p>
          <button onClick={fetchTableData} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 알림 메시지 */}
      {showAlert && (
        <div className={`${styles.alert} ${styles[`alert${showAlert.type.charAt(0).toUpperCase() + showAlert.type.slice(1)}`]}`}>
          {showAlert.message}
        </div>
      )}

      {/* 웹소켓 연결 상태 표시 */}
      {!isConnected && (
        <div className={styles.connectionStatus}>
          실시간 연결 중... {connectionError && `(${connectionError})`}
        </div>
      )}

      {/* 진행 단계 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>1</div>
          <div className={`${styles.stepText} ${styles.stepTextActive}`}>날짜/시간선택</div>
        </div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberCurrent}`}>2</div>
          <div className={`${styles.stepText} ${styles.stepTextCurrent}`}>테이블선택</div>
        </div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberUpcoming}`}>3</div>
          <div className={`${styles.stepText} ${styles.stepTextUpcoming}`}>예약정보확인</div>
        </div>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberUpcoming}`}>4</div>
          <div className={`${styles.stepText} ${styles.stepTextUpcoming}`}>결제</div>
        </div>
      </div>

      <div className={styles.containerContent}>
        <div className={styles.mainContent}>
          <div>
            {/* 컨트롤 패널 */}
            <div className={styles.mapControls}>
              <div className={styles.zoomControls}>
                <button onClick={handleZoomIn} className={styles.controlBtn}>🔍+</button>
                <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomOut} className={styles.controlBtn}>🔍-</button>
              </div>
              <div className={styles.mapInfo}>
                <span>총 {tableData.length}개 테이블 | 드래그하여 이동, 휠로 확대/축소</span>
              </div>
            </div>

            {/* 범례 - 상태별로 업데이트 */}
            <div className={styles.legend}>
              <div className={styles.legendTitle}>좌석 안내</div>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{ backgroundColor: '#4CAF50' }}>✓</div>
                  <span>선택 가능</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{ backgroundColor: '#4ecdc4' }}>●</div>
                  <span>선택됨</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{ backgroundColor: '#ff6b6b' }}>⏱</div>
                  <span>다른 사용자 선택중</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{ backgroundColor: '#ffa726' }}>△</div>
                  <span>인원수 불일치</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{ backgroundColor: '#a0a0a0' }}>×</div>
                  <span>예약됨</span>
                </div>
              </div>
            </div>

            {/* 인터랙티브 테이블 맵 */}
            <div
              className={styles.interactiveMap}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              ref={mapRef}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div
                className={styles.tableMapContainer}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: '0 0'
                }}
              >
                {/* 테이블 렌더링 */}
                {tableData.map(table => {
                  const size = getTableSize(table);
                  const isSelected = selectedSeats.some(seat => seat.id === table.id);
                  const isSelectable = isTableSelectable(table);

                  return (
                    <div
                      key={table.id}
                      className={styles.tableMarker}
                      style={{
                        position: 'absolute',
                        left: table.xPosition,
                        top: table.yPosition,
                        width: size.width,
                        height: size.height,
                        backgroundColor: getTableColor(table),
                        borderRadius: table.shape === 'CIRCLE' ? '50%' : '8px',
                        border: isSelected ? '3px solid #2196F3' : '2px solid #fff',
                        cursor: isSelectable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease',
                        opacity: isSelectable ? 1 : 0.6
                      }}
                      onClick={(e) => handleTableClick(table, e)}
                      title={`${table.name} (${table.minCapacity}-${table.maxCapacity}명)${getTableStatusText(table)}`}
                    >
                      {table.name.length > 8 ? `${table.name.substring(0, 6)}...` : table.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 예약 요약 */}
          <div className={styles.bookingSummary}>
            <div className={styles.restaurantName}>정미스시</div>
            <div className={styles.bookingInfo}>
              {reservationStep1.date} {reservationStep1.time} • {reservationPeople}명
            </div>

            <div className={styles.summaryTitle}>선택한 테이블</div>
            <div>
              {selectedSeats.length === 0 ? (
                <div className={styles.noSelection}>
                  테이블을 선택해주세요
                  <div className={styles.noSelectionSmall}>
                    ({reservationPeople}명 이용 가능한 테이블만 선택 가능)
                  </div>
                </div>
              ) : (
                selectedSeats.map(table => (
                  <div key={table.id} className={styles.selectedTable}>
                    <div className={styles.selectedTableName}>{table.name}</div>
                    <div className={styles.selectedTableCapacity}>
                      수용인원: {table.minCapacity}~{table.maxCapacity}명
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div>
                <div className={styles.summaryItem}>
                  <span>날짜</span>
                  <span>{reservationStep1.date}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>시간</span>
                  <span>{reservationStep1.time}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>인원</span>
                  <span>{reservationPeople}명</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>테이블</span>
                  <span>{selectedSeats[0].name}</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemTotal}`}>
                  <span>예약금</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            )}

            <button
              className={`${styles.confirmBtn} ${selectedSeats.length === maxSeats
                ? styles.confirmBtnActive
                : styles.confirmBtnDisabled
                }`}
              onClick={handleConfirmSeats}
              disabled={selectedSeats.length !== maxSeats}
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSelection;