import React, { useState, useEffect, useRef } from 'react';
import styles from './SelectTable.module.css';
import axios from 'axios';

const TableSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 맵 인터랙션 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const reservationStep1 = JSON.parse(localStorage.getItem('reservationStep1'));
  const reservationPeople = reservationStep1?.peopleCount || 1;
  const maxSeats = 1;
  const restaurantId = reservationStep1?.restaurantId || 1;

  if (!reservationStep1) {
    alert('예약 정보가 없습니다. 처음부터 다시 시작해주세요.');
    window.close();
    return null;
  }

  /**
   * API에서 테이블 데이터 가져오기
   */
  const fetchTableData = async () => {
    try {
      setLoading(true);
      console.log(`테이블 데이터 조회 중... restaurantId: ${restaurantId}`);
      
      const response = await axios.get(`http://localhost:10022/api/realtime/reservations/tables/${restaurantId}`);
      const data = response.data;

      console.log('API 응답:', data);

      if (data && data.success) {
        const apiTables = data.data;
        const transformedTables = apiTables.map((table, index) => ({
          id: `T${table.id}`,
          name: table.name,
          minCapacity: table.minCapacity,
          maxCapacity: table.maxCapacity,
          occupied: Math.random() > 0.7,
          type: determineTableType(table),
          // 좌표값 안전 처리 - NaN이나 null 방지
          xPosition: typeof table.xPosition === 'number' && !isNaN(table.xPosition) 
            ? table.xPosition 
            : 100 + (index * 120), // 기본값: 가로로 120px씩 간격
          yPosition: typeof table.yPosition === 'number' && !isNaN(table.yPosition) 
            ? table.yPosition 
            : 100 + Math.floor(index / 3) * 100, // 기본값: 세로로 100px씩 간격, 3개씩 한 줄
          shape: table.shape,
          originalId: table.id
        }));

        console.log('변환된 테이블 데이터:', transformedTables);
        setTableData(transformedTables);
        setError(null);
        
        // 수정된 초기 위치 설정
        initializeMapView(transformedTables);
        
      } else {
        throw new Error('테이블 데이터를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('테이블 데이터 조회 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 맵 초기화
   */
  const initializeMapView = (tables) => {
    if (tables.length === 0) 
      return;
    
    console.log('테이블 좌표:', tables.map(t => ({ 
      name: t.name, 
      x: t.xPosition, 
      y: t.yPosition 
    })));

    // 좌표값 검증 및 기본값 설정
    const validTables = tables.filter(t => 
      typeof t.xPosition === 'number' && !isNaN(t.xPosition) &&
      typeof t.yPosition === 'number' && !isNaN(t.yPosition)
    );

    if (validTables.length === 0) {
      console.warn('유효한 좌표를 가진 테이블이 없습니다.');
      setPosition({ x: 50, y: 50 });
      setScale(1);
      return;
    }

    // 테이블들의 경계 계산
    const positions = validTables.map(t => ({ x: t.xPosition, y: t.yPosition }));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    
    const tableWidth = Math.max(maxX - minX, 100); // 최소 100px
    const tableHeight = Math.max(maxY - minY, 100); // 최소 100px
    const mapWidth = 400; // CSS의 interactiveMap 너비
    const mapHeight = 400; // CSS의 interactiveMap 높이
    
    console.log('테이블 영역:', { minX, maxX, minY, maxY, tableWidth, tableHeight });
    
    // NaN 방지를 위한 계산
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // 맵 중앙에서 테이블 영역 중앙을 뺀 값
    const offsetX = (mapWidth / 2) - centerX;
    const offsetY = (mapHeight / 2) - centerY;
    
    // 스케일 계산 시 0으로 나누기 방지
    const scaleX = tableWidth > 0 ? (mapWidth * 0.6) / tableWidth : 1;
    const scaleY = tableHeight > 0 ? (mapHeight * 0.6) / tableHeight : 1;
    const initialScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.3), 1.5);
    
    console.log('초기 설정:', { offsetX, offsetY, initialScale, centerX, centerY });
    
    // NaN 체크 후 설정
    const finalX = isNaN(offsetX) ? 0 : offsetX;
    const finalY = isNaN(offsetY) ? 0 : offsetY;
    const finalScale = isNaN(initialScale) ? 1 : initialScale;
    
    setPosition({ x: finalX, y: finalY });
    setScale(finalScale);
  };

  /**
   * 테이블 타입 결정
   */
  const determineTableType = (table) => {
    const name = table.name.toLowerCase();
    if (name.includes('카운터') || name.includes('counter')) return 'counter';
    if (name.includes('창가') || name.includes('window')) return 'window';
    if (name.includes('프라이빗') || name.includes('private')) return 'private';
    if (table.maxCapacity <= 2) return 'table2';
    if (table.maxCapacity <= 4) return 'table4';
    return 'table2';
  };

  useEffect(() => {
    fetchTableData();
  }, [restaurantId]);

  // 줌 컨트롤
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
    if (tableData.length > 0) {
      initializeMapView(tableData);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  // 전체 맵을 테이블들이 잘 보이도록 맞추는 함수
  const handleFitToView = () => {
    if (tableData.length > 0) {
      initializeMapView(tableData);
    }
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 휠 줌
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  // 테이블 클릭 처리
  const handleTableClick = (table, e) => {
    e.stopPropagation();
    
    if (!isTableAvailable(table)) {
      if (reservationPeople < table.minCapacity) {
        alert(`${table.name}은(는) 최소 ${table.minCapacity}명부터 이용 가능합니다.`);
      } else if (reservationPeople > table.maxCapacity) {
        alert(`${table.name}은(는) 최대 ${table.maxCapacity}명까지 이용 가능합니다.`);
      }
      return;
    }

    const isSelected = selectedSeats.some(seat => seat.id === table.id);

    if (isSelected) {
      setSelectedSeats([]);
    } else {
      setSelectedSeats([table]);
    }
  };

  const isTableAvailable = (table) => {
    return !table.occupied &&
      reservationPeople >= table.minCapacity &&
      reservationPeople <= table.maxCapacity;
  };

  const getTableColor = (table) => {
    const isSelected = selectedSeats.some(seat => seat.id === table.id);
    const isAvailable = isTableAvailable(table);
    
    if (table.occupied) return '#a0a0a0ff';
    if (isSelected) return '#4ecdc4';
    if (!isAvailable) return '#ffa726';
    return '#4CAF50';
  };

  const getTableSize = (table) => {
    if (table.maxCapacity <= 1) return { width: 40, height: 25 };
    if (table.maxCapacity <= 2) return { width: 50, height: 35 };
    if (table.maxCapacity <= 4) return { width: 60, height: 45 };
    return { width: 80, height: 55 };
  };

  // 테이블 확정
  const handleConfirmSeats = () => {
    if (selectedSeats.length === maxSeats) {
      const tableInfo = selectedSeats[0];
      const totalPrice = reservationPeople * 2000;

      const finalReservationData = {
        ...reservationStep1,
        restaurantTableId: tableInfo.originalId,
        restaurantTableNameSnapshot: tableInfo.name,
        price: totalPrice
      };

      localStorage.setItem('finalReservationData', JSON.stringify(finalReservationData));
      alert(`테이블이 확정되었습니다!\n\n선택한 테이블: ${tableInfo.name}\n수용인원: ${tableInfo.minCapacity}~${tableInfo.maxCapacity}명\n테이블 요금: ${totalPrice.toLocaleString()}원`);
      window.location.href = '/reservations/confirm-info';
    }
  };

  const totalPrice = reservationPeople * 2000;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>테이블 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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

            {/* 디버그
            {process.env.NODE_ENV === 'development' && (
              <div className={styles.debugInfo}>
                <small>
                  디버그: Scale={scale.toFixed(2)}, Position=({position.x.toFixed(0)}, {position.y.toFixed(0)})
                </small>
              </div>
            )} */}

            {/* 범례 */}
            <div className={styles.legend}>
              <div className={styles.legendTitle}>좌석 안내</div>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{backgroundColor: '#4CAF50'}}>✓</div>
                  <span>선택 가능</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{backgroundColor: '#4ecdc4'}}>●</div>
                  <span>선택됨</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{backgroundColor: '#ffa726'}}>△</div>
                  <span>인원수 불일치</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon}`} style={{backgroundColor: '#a0a0a0ff'}}>×</div>
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
                  const isAvailable = isTableAvailable(table);
                  
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
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => handleTableClick(table, e)}
                      title={`${table.name} (${table.minCapacity}-${table.maxCapacity}명) ${table.occupied ? '- 예약됨' : ''}`}
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
              className={`${styles.confirmBtn} ${
                selectedSeats.length === maxSeats 
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