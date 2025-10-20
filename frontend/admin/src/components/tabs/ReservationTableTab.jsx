import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin/restaurants`,
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

export default function ReservationTableTab({selectedRestaurant}){
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  /**
   * 테이블 에디터 팝업 열기
   */
  const openTableEditorPopup = () => {
    if (!restaurantId) {
      alert('매장을 먼저 선택해주세요.');
      return;
    }

    // 팝업 창 열기 (1400x900 크기)
    const width = 1400;
    const height = 900;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // RegistTableTab 컴포넌트로 이동
    const popup = window.open(
      `/admin/regist-table?restaurantId=${restaurantId}`,
      'RegistTableEditor',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  // 맵 인터랙션 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const restaurantId = selectedRestaurant?.id;

  /**
   * 타임슬롯 조회
   */
  const fetchTimeSlots = useCallback(async (date, shouldResetTime = false) => {
    if (!date || !restaurantId) return;
    try {
      console.log(`타임슬롯 조회 중... restaurantId: ${restaurantId}, date: ${date}`);
      const response = await api.get(`/${restaurantId}/time-slots`, {
        params: { date }
      });
      console.log('타임슬롯:', response.data);
      const slots = response.data || [];
      setTimeSlots(slots);

      // 첫 번째 타임슬롯을 기본 선택 (초기 로드 시에만)
      if (slots.length > 0 && shouldResetTime) {
        setSelectedTime(slots[0]);
      }
    } catch (err) {
      console.error('타임슬롯 조회 실패:', err);
      setTimeSlots([]);
    }
  }, [restaurantId]);

  /**
   * 예약 목록 조회
   */
  const fetchReservations = useCallback(async () => {
    if (!restaurantId) return;
    try {
      console.log(`예약 목록 조회 중... restaurantId: ${restaurantId}`);
      const response = await api.get(`/${restaurantId}/reservations`);
      console.log('예약 목록:', response.data);
      setReservations(response.data.data || []);
    } catch (err) {
      console.error('예약 목록 조회 실패:', err);
    }
  }, [restaurantId]);

  /**
   * 예약 상태 변경
   */
  const updateReservationStatus = async (reservationId, status, reason = null) => {
    try {
      const requestBody = { status };
      if (reason) {
        requestBody.reason = reason;
      }

      await api.patch(`/${restaurantId}/reservations/${reservationId}/status`, requestBody);

      // 예약 목록 갱신
      fetchReservations();
      alert('예약 상태가 변경되었습니다.');
    } catch (err) {
      console.error('예약 상태 변경 실패:', err);
      alert('예약 상태 변경에 실패했습니다.');
    }
  };

  /**
   * 예약 승인
   */
  const handleApprove = (reservationId) => {
    if (window.confirm('예약을 승인하시겠습니까?')) {
      updateReservationStatus(reservationId, 'APPROVED');
    }
  };

  /**
   * 예약 취소
   */
  const handleCancel = (reservationId) => {
    const reason = window.prompt('취소 사유를 입력해주세요:');
    if (reason !== null && reason.trim() !== '') {
      updateReservationStatus(reservationId, 'CANCELED', reason);
    }
  };

  /**
   * 방문 처리
   */
  const handleVisit = (reservationId) => {
    if (window.confirm('방문 처리하시겠습니까?')) {
      updateReservationStatus(reservationId, 'VISITED');
    }
  };

  /**
   * 미방문 처리
   */
  const handleNoShow = (reservationId) => {
    if (window.confirm('미방문(노쇼) 처리하시겠습니까?')) {
      updateReservationStatus(reservationId, 'NO_SHOW');
    }
  };

  // 오늘 날짜를 기본값으로 설정 (초기 로드)
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(dateStr);
    fetchTimeSlots(dateStr, true); // 초기 로드이므로 시간도 리셋
  }, [fetchTimeSlots]);

  // 날짜 변경 시 타임슬롯 다시 조회 (시간은 유지)
  useEffect(() => {
    if (selectedDate && restaurantId) {
      fetchTimeSlots(selectedDate, false); // 날짜만 변경된 경우이므로 시간은 유지
    }
  }, [selectedDate, restaurantId, fetchTimeSlots]);

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
            // 백엔드가 { tableId, status } 또는 { tableId, tableStatus: { status } } 형식으로 보낼 수 있음
            const status = data.status || data.tableStatus?.status || 'AVAILABLE';
            return {
              ...table,
              status: status,
              occupied: status !== 'AVAILABLE',
              selectedBy: data.selectedBy || data.tableStatus?.selectedBy,
              selectedAt: data.selectedAt || data.tableStatus?.selectedAt,
              expiryTime: data.expiryTime || data.tableStatus?.expiryTime
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
    if (!restaurantId) return;
    try {
      setLoading(true);
      console.log(`테이블 데이터 조회 중... restaurantId: ${restaurantId}`);

      const response = await api.get(`/${restaurantId}/tables`);
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
    fetchReservations();
  }, [fetchTableData, fetchReservations, selectedRestaurant]);

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

  /**
   * 예약 상태 한글 변환
   */
  const getReservationStatusText = (status) => {
    switch (status) {
      case 'PENDING': return '승인 대기';
      case 'CONFIRMED': return '승인 완료';
      case 'COMPLETED': return '방문 완료';
      case 'CANCELLED': return '취소됨';
      case 'NO_SHOW': return '노쇼';
      default: return status;
    }
  };

  /**
   * 예약 상태 배지 색상
   */
  const getReservationStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'CONFIRMED': return 'bg-info';
      case 'COMPLETED': return 'bg-success';
      case 'CANCELLED': return 'bg-secondary';
      case 'NO_SHOW': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  /**
   * 날짜 포맷팅
   */
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 선택한 날짜의 모든 예약을 시간별로 그룹핑
   */
  const getReservationsByDate = () => {
    if (!selectedDate) return [];

    return reservations.filter(reservation => {
      if (!reservation.reservationAt) return false;

      const reservationDate = new Date(reservation.reservationAt);
      const selectedDateTime = new Date(selectedDate);

      // 예약 날짜와 선택한 날짜가 같은지 확인
      return (
        reservationDate.getFullYear() === selectedDateTime.getFullYear() &&
        reservationDate.getMonth() === selectedDateTime.getMonth() &&
        reservationDate.getDate() === selectedDateTime.getDate()
      );
    });
  };

  /**
   * 예약을 시간별로 그룹핑
   */
  const groupReservationsByTime = () => {
    const dateReservations = getReservationsByDate();
    const grouped = {};

    dateReservations.forEach(reservation => {
      const reservationDate = new Date(reservation.reservationAt);
      const timeKey = `${String(reservationDate.getHours()).padStart(2, '0')}:${String(reservationDate.getMinutes()).padStart(2, '0')}`;

      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(reservation);
    });

    // 시간순으로 정렬
    return Object.keys(grouped)
      .sort()
      .map(time => ({
        time,
        reservations: grouped[time]
      }));
  };

  const groupedReservations = groupReservationsByTime();

  // 매장이 선택되지 않았을 때 안내 화면
  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="reservationtable">
        <div className="card text-center mt-4 border-warning">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-warning mb-3"></i>
            <h5 className="text-warning fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">
              예약 관리를 하려면 먼저 매장 목록에서 매장을 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="reservationtable">
      {/* 날짜/시간 선택 - 상단 고정 */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-2">
                  <label className="form-label">날짜 선택</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">시간 선택 (테이블 현황)</label>
                  <select
                    className="form-select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={timeSlots.length === 0}
                  >
                    {timeSlots.length === 0 ? (
                      <option>타임슬롯 없음</option>
                    ) : (
                      timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    )}
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
                <div className="col-md-2 d-flex align-items-end justify-content-end">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={openTableEditorPopup}
                    title="테이블 배치 에디터 열기"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>
                    에디터 열기
                  </button>
                </div>
              </div>

              {/* 웹소켓 연결 상태 */}
              {!isConnected && (
                <div className="alert alert-warning mt-3 mb-0">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  실시간 연결 중... {connectionError && `(${connectionError})`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 좌우 분할: 테이블 현황 + 예약 목록 */}
      <div className="row">
        {/* 왼쪽: 테이블 현황 맵 */}
        <div className="col-lg-6">
          <div className="card" style={{height: 'calc(100vh - 280px)', minHeight: '600px'}}>
            <div className="card-header">
              <i className="fas fa-table me-2"></i>테이블 현황
            </div>
            <div className="card-body p-2" style={{height: 'calc(100% - 60px)', overflow: 'hidden'}}>
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
                  <div className="d-flex justify-content-between align-items-center mb-2 px-2">
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
                      총 {tableData.length}개 테이블
                    </small>
                  </div>

                  {/* 인터랙티브 테이블 맵 */}
                  <div
                    style={{
                      width: '100%',
                      height: 'calc(100% - 40px)',
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

        {/* 오른쪽: 예약 목록 (시간별 그룹핑) */}
        <div className="col-lg-6">
          <div className="card" style={{height: 'calc(100vh - 280px)', minHeight: '600px'}}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-list me-2"></i>예약 목록 ({selectedDate})
              </div>
              <span className="badge bg-primary">{getReservationsByDate().length}건</span>
            </div>
            <div className="card-body p-2" style={{height: 'calc(100% - 60px)', overflow: 'auto'}}>
              {groupedReservations.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-calendar-times fa-3x mb-3"></i>
                  <p>선택한 날짜에 예약 내역이 없습니다.</p>
                </div>
              ) : (
                groupedReservations.map(({ time, reservations: timeReservations }) => (
                  <div key={time} className="mb-3">
                    {/* 시간대 헤더 */}
                    <div
                      className={`d-flex align-items-center justify-content-between p-2 ${time === selectedTime ? 'bg-primary text-white' : 'bg-light'}`}
                      style={{
                        borderLeft: time === selectedTime ? '4px solid #0056b3' : '4px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTime(time)}
                    >
                      <div>
                        <i className="fas fa-clock me-2"></i>
                        <strong>{time}</strong>
                      </div>
                      <span className={`badge ${time === selectedTime ? 'bg-white text-primary' : 'bg-primary'}`}>
                        {timeReservations.length}건
                      </span>
                    </div>

                    {/* 해당 시간대 예약 목록 */}
                    <div className="table-responsive mt-2">
                      <table className="table table-hover table-sm mb-0">
                        <thead>
                          <tr>
                            <th>번호</th>
                            <th>고객명</th>
                            <th>연락처</th>
                            <th>테이블</th>
                            <th>인원</th>
                            <th>상태</th>
                            <th>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timeReservations.map((reservation) => (
                            <tr key={reservation.id}>
                              <td>{reservation.id}</td>
                              <td>{reservation.name}</td>
                              <td className="small">{reservation.phoneNumber}</td>
                              <td><strong>{reservation.restaurantTableNameSnapshot}</strong></td>
                              <td>{reservation.peopleCount}명</td>
                              <td>
                                <span className={`badge ${getReservationStatusBadgeClass(reservation.reservationState)}`}>
                                  {getReservationStatusText(reservation.reservationState)}
                                </span>
                              </td>
                              <td>
                                {reservation.reservationState === 'PENDING' && (
                                  <div className="btn-group btn-group-sm" role="group">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleApprove(reservation.id)}
                                      title="승인"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleCancel(reservation.id)}
                                      title="취소"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                )}
                                {reservation.reservationState === 'CONFIRMED' && (
                                  <div className="btn-group btn-group-sm" role="group">
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleVisit(reservation.id)}
                                      title="방문"
                                    >
                                      <i className="fas fa-user-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-warning btn-sm"
                                      onClick={() => handleNoShow(reservation.id)}
                                      title="미방문"
                                    >
                                      <i className="fas fa-user-times"></i>
                                    </button>
                                  </div>
                                )}
                                {['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(reservation.reservationState) && (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}