import React, { useState } from 'react';

const TableSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const reservationPeople = 2; // 예약 인원수
  const maxSeats = 1; // 선택할 수 있는 테이블 개수 (1개만)

  // 테이블 데이터 정의 (실제로는 API에서 받아올 데이터)
  const tableData = [
    // 카운터석 (1인씩)
    { id: 'C1', type: 'counter', name: '카운터 1번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: false },
    { id: 'C2', type: 'counter', name: '카운터 2번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: false },
    { id: 'C3', type: 'counter', name: '카운터 3번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: false },
    { id: 'C4', type: 'counter', name: '카운터 4번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: true },
    { id: 'C5', type: 'counter', name: '카운터 5번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: false },
    { id: 'C6', type: 'counter', name: '카운터 6번', minCapacity: 1, maxCapacity: 1, price: 0, occupied: false },
    
    // 창가 2인석
    { id: 'W1', type: 'window', name: '창가 테이블 1번', minCapacity: 2, maxCapacity: 2, price: 15000, occupied: false },
    
    // 일반 2인석
    { id: 'T2', type: 'table2', name: '2인 테이블 2번', minCapacity: 2, maxCapacity: 2, price: 10000, occupied: false },
    
    // 4인석 (2~4인 수용)
    { id: 'T4', type: 'table4', name: '4인 테이블 3번', minCapacity: 2, maxCapacity: 4, price: 20000, occupied: false },
    
    // 프라이빗룸 (2~4인 수용)
    { id: 'P1', type: 'private', name: '프라이빗룸', minCapacity: 2, maxCapacity: 4, price: 50000, occupied: false },
  ];

  // 예약 인원수에 맞는 테이블인지 확인
  const isTableAvailable = (table) => {
    return !table.occupied && 
           reservationPeople >= table.minCapacity && 
           reservationPeople <= table.maxCapacity;
  };

  // 좌석 클릭 처리
  const handleSeatClick = (tableData) => {
    const { id, type, price, minCapacity, maxCapacity, name } = tableData;
    
    // 예약 인원수에 맞지 않는 테이블은 선택 불가
    if (!isTableAvailable(tableData)) {
      if (reservationPeople < minCapacity) {
        alert(`${name}은(는) 최소 ${minCapacity}명부터 이용 가능합니다.`);
      } else if (reservationPeople > maxCapacity) {
        alert(`${name}은(는) 최대 ${maxCapacity}명까지 이용 가능합니다.`);
      }
      return;
    }
    
    const isSelected = selectedSeats.some(seat => seat.id === id);
    
    if (isSelected) {
      // 테이블 선택 해제
      setSelectedSeats(prev => prev.filter(s => s.id !== id));
    } else {
      // 새 테이블 선택 (1개만 선택 가능)
      if (selectedSeats.length < maxSeats) {
        setSelectedSeats([{
          id,
          type,
          price,
          name,
          minCapacity,
          maxCapacity
        }]);
      } else {
        alert('테이블은 1개만 선택 가능합니다.');
      }
    }
  };

  // 테이블 확정
  const handleConfirmSeats = () => {
    if (selectedSeats.length === maxSeats) {
      const tableInfo = selectedSeats[0];
      const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      
      alert(`테이블이 확정되었습니다!\n\n선택한 테이블: ${tableInfo.name}\n수용인원: ${tableInfo.minCapacity}~${tableInfo.maxCapacity}명\n테이블 요금: ${totalPrice.toLocaleString()}원\n\n고객 정보 입력 페이지로 이동합니다.`);
    }
  };

  // 테이블 컴포넌트
  const TableComponent = ({ tableId, customStyle = {}, children }) => {
    const table = tableData.find(t => t.id === tableId);
    if (!table) return null;

    const isSelected = selectedSeats.some(seat => seat.id === tableId);
    const isAvailable = isTableAvailable(table);
    
    const getTableTitle = () => {
      let typeName = '';
      switch(table.type) {
        case 'counter': typeName = '카운터석'; break;
        case 'window': typeName = '창가석'; break;
        case 'table2': typeName = '2인 테이블'; break;
        case 'table4': typeName = '4인 테이블'; break;
        case 'private': typeName = '프라이빗룸'; break;
        default: typeName = '일반석';
      }
      
      if (!isAvailable) {
        if (table.occupied) {
          return `${typeName} - 예약됨`;
        } else if (reservationPeople < table.minCapacity) {
          return `${typeName} - 최소 ${table.minCapacity}명부터 이용 가능`;
        } else if (reservationPeople > table.maxCapacity) {
          return `${typeName} - 최대 ${table.maxCapacity}명까지 이용 가능`;
        }
      }
      
      return `${typeName} (${table.minCapacity}~${table.maxCapacity}명) - ${table.price > 0 ? '+' + table.price.toLocaleString() + '원' : '추가요금 없음'}`;
    };

    let tableStyle = {
      cursor: isAvailable ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: '600',
      transition: 'all 0.2s',
      position: 'relative',
      border: '2px solid',
      borderRadius: '8px',
      ...customStyle
    };

    // 스타일 적용 로직
    if (table.occupied) {
      // 예약됨
      tableStyle = {
        ...tableStyle,
        background: '#ffebee',
        borderColor: '#f44336',
        color: '#c62828',
        opacity: '0.6'
      };
    } else if (!isAvailable) {
      // 인원수 맞지 않음
      tableStyle = {
        ...tableStyle,
        background: '#f5f5f5',
        borderColor: '#bdbdbd',
        color: '#757575',
        opacity: '0.7'
      };
    } else if (isSelected) {
      // 선택됨
      tableStyle = {
        ...tableStyle,
        background: '#ff6b35',
        borderColor: '#e55a2b',
        color: 'white',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
      };
    } else {
      // 선택 가능
      tableStyle = {
        ...tableStyle,
        background: '#e8f5e8',
        borderColor: '#4caf50',
        color: '#2e7d32'
      };
    }
    
    return (
      <div
        style={tableStyle}
        title={getTableTitle()}
        onClick={() => handleSeatClick(table)}
        onMouseEnter={(e) => {
          if (isAvailable && !isSelected) {
            e.target.style.background = '#c8e6c9';
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (isAvailable && !isSelected) {
            e.target.style.background = '#e8f5e8';
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        {children}
      </div>
    );
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const containerStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8f9fa',
    lineHeight: '1.6',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const progressBarStyle = {
    background: '#fff',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  const progressStepStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    zIndex: 2,
    background: '#f8f9fa',
    padding: '10px'
  };

  const stepNumberStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    border: '2px solid'
  };

  const stepTextStyle = {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    fontWeight: '500'
  };

  const headerStyle = {
    background: 'white',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const restaurantNameStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ff6b35',
    marginBottom: '8px'
  };

  const bookingInfoStyle = {
    color: '#6c757d',
    fontSize: '16px'
  };

  const containerContentStyle = {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: '25px'
  };

  const legendStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '25px'
  };

  const legendTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#212529'
  };

  const legendItemsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  };

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const seatingLayoutStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  };

  const layoutTitleStyle = {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#212529'
  };

  const restaurantFloorStyle = {
    position: 'relative',
    background: '#f8f9fa',
    border: '2px dashed #dee2e6',
    borderRadius: '12px',
    padding: '30px',
    minHeight: '400px',
    height: '400px'
  };

  const windowStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '20px',
    background: 'linear-gradient(90deg, #e3f2fd, #bbdefb, #e3f2fd)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#1976d2'
  };

  const sushiCounterStyle = {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '250px',
    height: '60px',
    background: 'linear-gradient(135deg, #8B4513, #A0522D)',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  const counterSeatsStyle = {
    position: 'absolute',
    top: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px'
  };

  const tableAreaStyle = {
    position: 'absolute'
  };

  const privateRoomStyle = {
    position: 'absolute',
    bottom: '40px',
    right: '40px',
    width: '180px',
    height: '100px',
    border: '2px solid #ff6b35',
    borderRadius: '8px',
    background: 'rgba(255, 107, 53, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ff6b35'
  };

  const bookingSummaryStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: '20px',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto'
  };

  const summaryTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#212529'
  };

  const summaryItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f1f3f4'
  };

  const confirmBtnStyle = {
    width: '100%',
    background: selectedSeats.length === maxSeats ? '#ff6b35' : '#e9ecef',
    color: selectedSeats.length === maxSeats ? 'white' : '#adb5bd',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: selectedSeats.length === maxSeats ? 'pointer' : 'not-allowed',
    marginTop: '20px',
    transition: 'all 0.2s'
  };

  return (
    <div style={containerStyle}>
      {/* 진행 단계 바 */}
      <div style={progressBarStyle}>
        <div style={progressStepStyle}>
          <div style={{
            ...stepNumberStyle,
            background: '#28a745',
            color: 'white',
            borderColor: '#28a745'
          }}>1</div>
          <div style={{
            ...stepTextStyle,
            color: '#28a745',
            fontWeight: '600'
          }}>날짜/시간선택</div>
        </div>
        
        <div style={progressStepStyle}>
          <div style={{
            ...stepNumberStyle,
            background: '#ff6b35',
            color: 'white',
            borderColor: '#ff6b35'
          }}>2</div>
          <div style={{
            ...stepTextStyle,
            color: '#ff6b35',
            fontWeight: '600'
          }}>테이블선택</div>
        </div>
        
        <div style={progressStepStyle}>
          <div style={{
            ...stepNumberStyle,
            background: '#e9ecef',
            color: '#6c757d',
            borderColor: '#e9ecef'
          }}>3</div>
          <div style={{
            ...stepTextStyle,
            color: '#6c757d'
          }}>예약정보확인</div>
        </div>
        
        <div style={progressStepStyle}>
          <div style={{
            ...stepNumberStyle,
            background: '#e9ecef',
            color: '#6c757d',
            borderColor: '#e9ecef'
          }}>4</div>
          <div style={{
            ...stepTextStyle,
            color: '#6c757d'
          }}>결제</div>
        </div>
      </div>

      {/* 헤더 */}
      <div style={headerStyle}>
        <div style={restaurantNameStyle}>정미스시</div>
        <div style={bookingInfoStyle}>2025년 9월 3일 (수) 19:00 • {reservationPeople}명</div>
      </div>
      
      <div style={containerContentStyle}>
        <div style={mainContentStyle}>
          <div>
            {/* 범례 */}
            <div style={legendStyle}>
              <div style={legendTitleStyle}>좌석 안내</div>
              <div style={legendItemsStyle}>
                <div style={legendItemStyle}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: '#e8f5e8',
                    border: '2px solid #4caf50',
                    color: '#2e7d32'
                  }}>1</div>
                  <span>선택 가능</span>
                </div>
                <div style={legendItemStyle}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: '#ff6b35',
                    border: '2px solid #e55a2b',
                    color: 'white'
                  }}>2</div>
                  <span>선택됨</span>
                </div>
                <div style={legendItemStyle}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: '#f5f5f5',
                    border: '2px solid #bdbdbd',
                    color: '#757575'
                  }}>X</div>
                  <span>인원수 불일치</span>
                </div>
                <div style={legendItemStyle}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: '#ffebee',
                    border: '2px solid #f44336',
                    color: '#c62828'
                  }}>X</div>
                  <span>예약됨</span>
                </div>
              </div>
            </div>
            
            {/* 좌석 배치도 */}
            <div style={seatingLayoutStyle}>
              <div style={layoutTitleStyle}>좌석 배치도</div>
              
              <div style={restaurantFloorStyle}>
                {/* 창가 */}
                <div style={windowStyle}>🪟 창가</div>
                
                {/* 스시 카운터 */}
                <div style={sushiCounterStyle}>🍣 스시 바</div>
                
                {/* 카운터 좌석 - 1인석이므로 2명은 선택 불가 */}
                <div style={counterSeatsStyle}>
                  <TableComponent tableId="C1">1(1인석)</TableComponent>
                  <TableComponent tableId="C2">2(1인석)</TableComponent>
                  <TableComponent tableId="C3">3(1인석)</TableComponent>
                  <TableComponent tableId="C4">4</TableComponent>
                  <TableComponent tableId="C5">5(1인석)</TableComponent>
                  <TableComponent tableId="C6">6(1인석)</TableComponent>
                </div>
                
                {/* 창가석 - 2인석이므로 2명 선택 가능 */}
                <div style={{...tableAreaStyle, top: '140px', left: '40px'}}>
                  <TableComponent 
                    tableId="W1" 
                    customStyle={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  >
                    1 (2인석)
                  </TableComponent>
                </div>
                
                {/* 2인 테이블 - 2인석이므로 2명 선택 가능 */}
                <div style={{...tableAreaStyle, top: '220px', left: '80px'}}>
                  <TableComponent 
                    tableId="T2" 
                    customStyle={{ width: '80px', height: '50px' }}
                  >
                    2 (2인석)
                  </TableComponent>
                </div>
                
                {/* 4인 테이블 - 2~4인석이므로 2명 선택 가능 */}
                <div style={{...tableAreaStyle, top: '220px', right: '80px'}}>
                  <TableComponent 
                    tableId="T4" 
                    customStyle={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  >
                    3 (2~4인석)
                  </TableComponent>
                </div>
                
                {/* 프라이빗룸 - 2~4인석이므로 2명 선택 가능 */}
                <div style={privateRoomStyle}>
                  <div style={{ marginBottom: '8px' }}>🏠 프라이빗룸 (2~4인)</div>
                  <TableComponent 
                    tableId="P1" 
                    customStyle={{ 
                      width: '120px', 
                      height: '40px', 
                      fontSize: '10px',
                      borderRadius: '6px'
                    }}
                  >
                    프라이빗룸 선택
                  </TableComponent>
                </div>
              </div>
            </div>
          </div>
          
          {/* 예약 요약 */}
          <div style={bookingSummaryStyle}>
            <div style={summaryTitleStyle}>선택한 테이블</div>
            <div>
              {selectedSeats.length === 0 ? (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                  테이블을 선택해주세요<br/>
                  <small style={{ fontSize: '12px' }}>({reservationPeople}명 이용 가능한 테이블만 선택 가능)</small>
                </p>
              ) : (
                selectedSeats.map(table => (
                  <div 
                    key={table.id}
                    style={{
                      background: '#fff5f2',
                      padding: '12px',
                      borderRadius: '8px',
                      margin: '8px 0',
                      color: '#ff6b35',
                      fontWeight: '600'
                    }}
                  >
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>{table.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      수용인원: {table.minCapacity}~{table.maxCapacity}명
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {selectedSeats.length > 0 && (
              <div>
                <div style={summaryItemStyle}>
                  <span>날짜</span>
                  <span>2025-09-03</span>
                </div>
                <div style={summaryItemStyle}>
                  <span>시간</span>
                  <span>19:00</span>
                </div>
                <div style={summaryItemStyle}>
                  <span>인원</span>
                  <span>{reservationPeople}명</span>
                </div>
                <div style={summaryItemStyle}>
                  <span>테이블</span>
                  <span>{selectedSeats[0].name}</span>
                </div>
                <div style={{
                  ...summaryItemStyle,
                  borderBottom: 'none',
                  fontWeight: '600',
                  color: '#ff6b35'
                }}>
                  <span>테이블 요금</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            )}
            
            <button 
              style={confirmBtnStyle}
              onClick={handleConfirmSeats}
            >
              테이블 확정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSelection;