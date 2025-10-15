import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../../../user/src/hooks/useWebSocket';
import axios from 'axios';

export default function ReservationTableTab(){
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 맵 인터랙션 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const restaurantId = 1; // 관리자 대시보드에서는 고정값 사용

  // 오늘 날짜를 기본값으로 설정
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setSelectedTime('12:00'); // 기본 시간
  }, []);

  /**
   * 웹소켓 테이블 상태 업데이트 핸들러
   */
  const handleTableStatusUpdate = useCallback((data, currentSessionId) => {
    console.log('테이블 상태 업데이트 수신:', data);

    // 여러 테이블 상태를 한꺼번에 갱신하는 경우
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
      setLoading(false);
      return;
    }

    // 단일 테이블 갱신
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
    }
  }, []);

  const {
    isConnected,
    connectionError,
    mySessionId,
    getTableStatus,
  } = useWebSocket(restaurantId, handleTableStatusUpdate);

  /**
   * 테이블 타입 결정
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
   */
  const fetchTableData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`테이블 데이터 조회 중... restaurantId: ${restaurantId}`);

      const response = await axios.get(`http://localhost:8002/api/tables/${restaurantId}`);
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
  }, [restaurantId, determineTableType]);

  /**
   * 맵 초기 뷰 설정
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
    const mapWidth = 600;
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

  // 컴포넌트 마운트 시 테이블 데이터 로드
  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // 날짜/시간 변경 시 테이블 상태 조회
  useEffect(() => {
    if (isConnected && selectedDate && selectedTime) {
      console.log('테이블 상태 조회:', selectedDate, selectedTime);
      setLoading(true);
      getTableStatus(selectedDate, selectedTime);
    }
  }, [isConnected, selectedDate, selectedTime, getTableStatus]);

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
   * 테이블 상태에 따른 색상 결정
   */
  const getTableColor = (table) => {
    if (table.status === null) {
      return '#e0e0e0';
    }

    switch (table.status) {
      case 'RESERVED':
        return '#a0a0a0';
      case 'SELECTED':
        return '#ff6b6b';
      case 'AVAILABLE':
        return '#4CAF50';
      default:
        return '#e0e0e0';
    }
  };

  /**
   * 테이블 크기 결정
   */
  const getTableSize = (table) => {
    if (table.maxCapacity <= 1) return { width: 40, height: 25 };
    if (table.maxCapacity <= 2) return { width: 50, height: 35 };
    if (table.maxCapacity <= 4) return { width: 60, height: 45 };
    return { width: 80, height: 55 };
  };

  /**
   * 테이블 상태 텍스트 가져오기
   */
  const getTableStatusText = (table) => {
    if (table.status === 'RESERVED') return ' (예약됨)';
    if (table.status === 'SELECTED') return ' (선택중)';
    if (table.status === 'AVAILABLE') return ' (가능)';
    return ' (상태 미확인)';
  };

  return (
    <div className="tab-pane fade" id="reservationtable">
      {/* 실시간 테이블 현황 */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-table me-2"></i>예약 테이블 현황
            </div>
            <div className="card-body">
              {/* 날짜/시간 선택 */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <label className="form-label">날짜 선택</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">시간 선택</label>
                  <select
                    className="form-select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="d-flex gap-2">
                    <span className="badge" style={{backgroundColor: '#4CAF50'}}>가능</span>
                    <span className="badge" style={{backgroundColor: '#ff6b6b'}}>선택중</span>
                    <span className="badge" style={{backgroundColor: '#a0a0a0'}}>예약됨</span>
                    <span className="badge" style={{backgroundColor: '#e0e0e0'}}>미확인</span>
                  </div>
                </div>
              </div>

              {/* 웹소켓 연결 상태 */}
              {!isConnected && (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  실시간 연결 중... {connectionError && `(${connectionError})`}
                </div>
              )}

              {/* 로딩 상태 */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">테이블 상태를 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : (
                <>
                  {/* 컨트롤 패널 */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group">
                      <button onClick={handleZoomIn} className="btn btn-sm btn-outline-secondary">
                        <i className="fas fa-search-plus"></i>
                      </button>
                      <button onClick={handleZoomReset} className="btn btn-sm btn-outline-secondary">
                        {Math.round(scale * 100)}%
                      </button>
                      <button onClick={handleZoomOut} className="btn btn-sm btn-outline-secondary">
                        <i className="fas fa-search-minus"></i>
                      </button>
                    </div>
                    <small className="text-muted">
                      총 {tableData.length}개 테이블 | 드래그하여 이동, 휠로 확대/축소
                    </small>
                  </div>

                  {/* 인터랙티브 테이블 맵 */}
                  <div
                    style={{
                      width: '100%',
                      height: '500px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      backgroundColor: '#f8f9fa'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    ref={mapRef}
                  >
                    <div
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        position: 'relative',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      {/* 테이블 렌더링 */}
                      {tableData.map(table => {
                        const size = getTableSize(table);

                        return (
                          <div
                            key={table.id}
                            style={{
                              position: 'absolute',
                              left: table.xPosition,
                              top: table.yPosition,
                              width: size.width,
                              height: size.height,
                              backgroundColor: getTableColor(table),
                              borderRadius: table.shape === 'CIRCLE' ? '50%' : '8px',
                              border: '2px solid #fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: 'white',
                              textShadow: '1px 1px 1px rgba(0,0,0,0.7)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              transition: 'all 0.2s ease',
                              pointerEvents: 'none'
                            }}
                            title={`${table.name} (${table.minCapacity}-${table.maxCapacity}명)${getTableStatusText(table)}`}
                          >
                            {table.name.length > 8 ? `${table.name.substring(0, 6)}...` : table.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}