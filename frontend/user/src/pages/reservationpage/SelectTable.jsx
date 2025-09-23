import React, { useState } from 'react';
import styles from './SelectTable.module.css';

const TableSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const reservationStep1 = JSON.parse(localStorage.getItem('reservationStep1'));
  console.log(reservationStep1);

  const reservationPeople = reservationStep1?.guestCount || 1; // 예약 인원수
  const maxSeats = 1; // 선택할 수 있는 테이블 개수 (1개만)

  if (!reservationStep1) {
    alert('예약 정보가 없습니다. 처음부터 다시 시작해주세요.');
    window.close(); // 팝업 창 닫기
    return null;
  }

  // 테이블 데이터 정의
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
      const totalPrice = reservationPeople * 2000;

      // 최종 예약 데이터 구성
      const finalReservationData = {
        ...reservationStep1,
        tableId: tableInfo.id,
        tableName: tableInfo.name,
        tablePrice: totalPrice
      };

      // localStorage에 최종 데이터 저장
      localStorage.setItem('finalReservationData', JSON.stringify(finalReservationData));

      alert(`테이블이 확정되었습니다!\n\n선택한 테이블: ${tableInfo.name}\n수용인원: ${tableInfo.minCapacity}~${tableInfo.maxCapacity}명\n테이블 요금: ${totalPrice.toLocaleString()}원\n\n결제 페이지로 이동합니다.`);
      
      // 부모 창에 메시지 전송
      // if (window.opener) {
      //   window.opener.postMessage({
      //     type: 'TABLE_SELECTED',
      //     data: finalReservationData
      //   }, '*');
      // }
      
      // 팝업창 URL 변경
      window.location.href = '/reservations/confirm-info';
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
      switch (table.type) {
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

    // CSS 클래스 결정
    let tableClasses = [styles.tableComponent];
    
    if (table.occupied) {
      tableClasses.push(styles.tableComponentOccupied);
    } else if (!isAvailable) {
      tableClasses.push(styles.tableComponentUnavailable);
    } else if (isSelected) {
      tableClasses.push(styles.tableComponentSelected);
    } else {
      tableClasses.push(styles.tableComponentAvailable);
    }

    return (
      <div
        className={tableClasses.join(' ')}
        style={customStyle}
        title={getTableTitle()}
        onClick={() => handleSeatClick(table)}
      >
        {children}
      </div>
    );
  };

  const totalPrice = reservationPeople * 2000;

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
            {/* 범례 */}
            <div className={styles.legend}>
              <div className={styles.legendTitle}>좌석 안내</div>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon} ${styles.legendIconAvailable}`}>1</div>
                  <span>선택 가능</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon} ${styles.legendIconSelected}`}>2</div>
                  <span>선택됨</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon} ${styles.legendIconMismatch}`}>X</div>
                  <span>인원수 불일치</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendIcon} ${styles.legendIconOccupied}`}>X</div>
                  <span>예약됨</span>
                </div>
              </div>
            </div>

            {/* 좌석 배치도 */}
            <div className={styles.seatingLayout}>
              <div className={styles.restaurantFloor}>
                {/* 창가 */}
                <div className={styles.window}>🪟 창가</div>

                {/* 스시 카운터 */}
                <div className={styles.sushiCounter}>🍣 스시 바</div>

                {/* 카운터 좌석 */}
                <div className={styles.counterSeats}>
                  <TableComponent tableId="C1">1</TableComponent>
                  <TableComponent tableId="C2">2</TableComponent>
                  <TableComponent tableId="C3">3</TableComponent>
                  <TableComponent tableId="C4">4</TableComponent>
                  <TableComponent tableId="C5">5</TableComponent>
                  <TableComponent tableId="C6">6</TableComponent>
                </div>

                {/* 창가석 */}
                <div className={`${styles.tableArea}`} style={{ top: '160px', left: '40px' }}>
                  <TableComponent
                    tableId="W1"
                    customStyle={{ width: '70px', height: '70px', borderRadius: '50%' }}
                  >
                    창가1
                  </TableComponent>
                </div>

                {/* 2인 테이블 */}
                <div className={`${styles.tableArea}`} style={{ top: '250px', left: '80px' }}>
                  <TableComponent
                    tableId="T2"
                    customStyle={{ width: '90px', height: '60px' }}
                  >
                    2인석
                  </TableComponent>
                </div>

                {/* 4인 테이블 */}
                <div className={`${styles.tableArea}`} style={{ top: '250px', right: '80px' }}>
                  <TableComponent
                    tableId="T4"
                    customStyle={{ width: '80px', height: '80px', borderRadius: '50%' }}
                  >
                    4인석
                  </TableComponent>
                </div>

                {/* 프라이빗룸 */}
                <div className={styles.privateRoom}>
                  <div className={styles.privateRoomLabel}>🏠 프라이빗룸 (2~4인)</div>
                  <TableComponent
                    tableId="P1"
                    customStyle={{
                      width: '140px',
                      height: '45px',
                      fontSize: '11px',
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