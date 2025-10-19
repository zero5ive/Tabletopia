import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8002/api/admin/restaurants",
  withCredentials: true,
});

/**
 * 레스토랑 좌석 배치 에디터 탭 (팝업 호출용)
 *
 * @since 2025-10-17
 */
const RegistTableTab = ({ selectedRestaurant }) => {
  const openEditorPopup = () => {
    if (!selectedRestaurant) {
      alert('먼저 매장을 선택해주세요.');
      return;
    }

    // 팝업 창 열기 (1400x900 크기)
    const width = 1400;
    const height = 900;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      `/table-editor?restaurantId=${selectedRestaurant.id}&restaurantName=${encodeURIComponent(selectedRestaurant.name)}`,
      'TableEditor',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  // 레스토랑 미선택 시 안내 화면
  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="regist-table">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">
              테이블을 등록하려면 먼저 매장을 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="regist-table">
      <div className="card text-center mt-4">
        <div className="card-body py-5">
          <i className="fas fa-table fa-3x text-primary mb-3"></i>
          <h5 className="fw-bold">테이블 배치 에디터</h5>
          <p className="text-muted mb-4">
            선택된 매장: <strong>{selectedRestaurant.name}</strong>
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={openEditorPopup}
          >
            <i className="fas fa-external-link-alt me-2"></i>
            에디터 열기
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 레스토랑 좌석 배치 에디터 메인 컴포넌트 (팝업용)
 *
 * @author 김예진
 * @since 2025-10-17
 */
export const RestaurantSeatEditor = () => {
  // URL에서 restaurantId 가져오기
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  // 스타일 정의
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8f9fa'
    },
    sidebar: {
      width: '300px',
      background: 'white',
      padding: '20px',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      overflowY: 'auto'
    },
    mainEditor: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    toolbar: {
      background: 'white',
      padding: '15px 20px',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    canvasContainer: {
      flex: 1,
      background: '#f8f9fa',
      position: 'relative',
      overflow: 'hidden'
    },
    canvas: {
      width: '100%',
      height: '100%',
      background: 'white',
      position: 'relative',
      cursor: 'crosshair'
    },
    sectionTitle: {
      fontWeight: 600,
      marginBottom: '15px',
      color: '#212529'
    },
    toolGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '25px'
    },
    toolItem: {
      padding: '15px 10px',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'grab',
      transition: 'all 0.2s',
      background: 'white'
    },
    toolIcon: {
      fontSize: '24px',
      marginBottom: '5px'
    },
    toolName: {
      fontSize: '12px',
      color: '#6c757d'
    },
    properties: {
      background: '#f8f9fa',
      padding: '15px',
      borderTop: '1px solid #dee2e6',
      marginBottom: '20px'
    },
    propertyGroup: {
      marginBottom: '15px'
    },
    propertyLabel: {
      display: 'block',
      fontWeight: 500,
      marginBottom: '5px',
      color: '#495057',
      fontSize: '14px'
    },
    propertyInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      fontSize: '14px'
    },
    btn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'all 0.2s',
      fontSize: '14px'
    },
    btnPrimary: {
      background: '#007bff',
      color: 'white'
    },
    btnDanger: {
      background: '#dc3545',
      color: 'white'
    },
    btnSuccess: {
      background: '#28a745',
      color: 'white'
    },
    jsonOutput: {
      background: '#212529',
      color: '#f8f9fa',
      padding: '15px',
      borderRadius: '4px',
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      maxHeight: '200px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap'
    },
    placedElement: {
      position: 'absolute',
      border: '2px solid #007bff',
      borderRadius: '4px',
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: '12px',
      userSelect: 'none'
    },
    grid: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      pointerEvents: 'none'
    }
  };
  // ============ 상태 관리 ============
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [elementCounter, setElementCounter] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef(null);

  // ============ 도구 정의 ============
  const tools = {
    tables: [
      { type: 'table-2', icon: '🪑', name: '사각 테이블' },
      { type: 'table-4', icon: '🍽️', name: '원형 테이블' },
      // { type: 'counter', icon: '🍣', name: '카운터' },
      // { type: 'seat', icon: '💺', name: '개별 좌석' }
    ],
    structures: [
      // { type: 'wall', icon: '🧱', name: '벽' },
      // { type: 'door', icon: '🚪', name: '문' },
      // { type: 'window', icon: '🪟', name: '창문' }
    ]
  };

  /**
   * 타입별 기본 크기 반환
   * 
   * @param {string} type - 요소 타입
   * @return {Object} width, height 객체
   */
  const getDefaultSize = (type) => {
    const sizes = {
      'table-2': { width: 80, height: 60 },
      'table-4': { width: 100, height: 100 },
      'counter': { width: 200, height: 40 },
      'seat': { width: 30, height: 30 },
      'wall': { width: 100, height: 20 },
      'door': { width: 60, height: 20 },
      'window': { width: 100, height: 20 }
    };
    return sizes[type] || { width: 50, height: 50 };
  };

  /**
   * 타입별 한글명 반환
   */
  const getTypeName = (type) => {
    const names = {
      'table-2': '사각 테이블',
      'table-4': '원형 테이블',
      'counter': '카운터',
      // 'seat': '좌석',
      // 'wall': '벽',
      // 'door': '문',
      // 'window': '창문'
    };
    return names[type] || type;
  };

  /**
   * 타입별 기본 수용인원 반환 (최소, 최대)
   */
  const getDefaultCapacity = (type) => {
    const capacities = {
      'table-2': { min: 1, max: 1 },
      'table-4': { min: 1, max: 1 }
      // 'counter': { min: 1, max: 1 },
      // 'seat': { min: 1, max: 1 },
      // 'wall': { min: 0, max: 0 },
      // 'door': { min: 0, max: 0 },
      // 'window': { min: 0, max: 0 }
    };
    return capacities[type] || { min: 0, max: 0 };
  };

  /**
   * 타입별 스타일 반환
   */
  const getElementStyle = (type, element, isSelected) => {
    const baseStyle = {
      ...styles.placedElement,
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      color: 'white'
    };

    const typeStyles = {
      'table-2': { background: '#8B4513', borderRadius: '4px' },
      'table-4': { background: '#8B4513', borderRadius: '50%' },
      'counter': { background: '#6f4e37', borderRadius: '20px' },
      'seat': { background: '#007bff', borderRadius: '4px' },
      'wall': { background: '#6c757d', borderRadius: '4px' },
      'door': { background: '#28a745', borderRadius: '4px' },
      'window': { background: '#17a2b8', borderRadius: '4px' }
    };

    const selectedStyle = isSelected ? {
      borderColor: '#ff6b35',
      background: typeStyles[type]?.background || '#6c757d',
      boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.3)'
    } : {};

    return {
      ...baseStyle,
      ...(typeStyles[type] || { background: '#6c757d' }),
      ...selectedStyle
    };
  };

  // ============ 이벤트 핸들러 ============

  /**
   * 드래그 시작 처리 (도구 팔레트에서)
   */
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  /**
   * 캔버스 드롭 처리
   */
  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createElement(type, x, y);
  };

  /**
   * 새 요소 생성
   *
   * @param {string} type - 요소 타입
   * @param {number} x - X 좌표
   * @param {number} y - Y 좌표
   */
  const createElement = (type, x, y) => {
    const newCounter = elementCounter + 1;
    const size = getDefaultSize(type);
    const capacity = getDefaultCapacity(type);

    const newElement = {
      id: `${type}-${newCounter}`,
      type,
      x,
      y,
      width: size.width,
      height: size.height,
      name: `${getTypeName(type)} ${newCounter}`,
      minCapacity: capacity.min,
      maxCapacity: capacity.max,
      price: 0
    };

    setElements([...elements, newElement]);
    setElementCounter(newCounter);
    setSelectedElement(newElement);
  };

  /**
   * 요소 클릭 처리 (선택)
   */
  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  /**
   * 요소 드래그 시작 (이동)
   */
  const handleElementDragStart = (e, element) => {
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  /**
   * 요소 드래그 중
   */
  const handleElementDrag = (e) => {
    if (!isDragging || !selectedElement) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    updateElementPosition(selectedElement.id, newX, newY);
  };

  /**
   * 요소 위치 업데이트
   */
  const updateElementPosition = (id, x, y) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, x, y } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, x, y });
    }
  };

  /**
   * 요소 드래그 종료
   */
  const handleElementDragEnd = () => {
    setIsDragging(false);
  };

  /**
   * 속성 업데이트
   */
  const updateProperty = (property, value) => {
    if (!selectedElement) return;

    // 수용인원 유효성 검사
    if (property === 'minCapacity') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        alert('최소 수용인원은 0 이상이어야 합니다.');
        return;
      }
      if (numValue > selectedElement.maxCapacity) {
        alert('최소 수용인원은 최대 수용인원보다 클 수 없습니다.');
        return;
      }
    }

    if (property === 'maxCapacity') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1) {
        alert('최대 수용인원은 1 이상이어야 합니다.');
        return;
      }
      if (numValue < selectedElement.minCapacity) {
        alert('최대 수용인원은 최소 수용인원보다 작을 수 없습니다.');
        return;
      }
    }

    const updatedElement = { ...selectedElement, [property]: value };
    setElements(elements.map(el =>
      el.id === selectedElement.id ? updatedElement : el
    ));
    setSelectedElement(updatedElement);
  };

  /**
   * 선택된 요소 삭제
   */
  const deleteSelected = () => {
    if (!selectedElement) return;
    
    setElements(elements.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
  };

  /**
   * 전체 삭제
   */
  const clearCanvas = () => {
    if (window.confirm('모든 요소를 삭제하시겠습니까?')) {
      setElements([]);
      setSelectedElement(null);
      setElementCounter(0);
    }
  };

  /**
   * JSON 출력
   */
  const exportLayout = () => {
    const layout = {
      restaurant: "정미스시",
      elements: elements.map(el => ({
        id: el.id,
        type: el.type,
        name: el.name,
        position: { x: el.x, y: el.y },
        size: { width: el.width, height: el.height },
        minCapacity: el.minCapacity,
        maxCapacity: el.maxCapacity,
        priceModifier: el.price
      }))
    };

    const jsonString = JSON.stringify(layout, null, 2);

    // JSON 출력 영역 업데이트
    const outputElement = document.getElementById('json-output');
    if (outputElement) {
      outputElement.textContent = jsonString;
    }

    // JSON을 클립보드에 복사
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        alert('레이아웃이 클립보드에 복사되었습니다!');
      })
      .catch(() => {
        alert('클립보드 복사에 실패했습니다. JSON 출력 영역을 확인해주세요.');
      });
  };

  /**
   * 캔버스 클릭 (선택 해제)
   */
  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  /**
   * 기존 테이블 목록 로드
   */
  const loadExistingTables = async () => {
    if (!restaurantId) return;

    try {
      console.log(`테이블 로딩 중... restaurantId: ${restaurantId}`);
      const response = await api.get(`/${restaurantId}/tables`);
      const tables = response.data;

      console.log('로드된 테이블:', tables);

      if (tables && tables.length > 0) {
        // 백엔드 데이터를 에디터 형식으로 변환
        const loadedElements = tables.map((table) => {
          // shape에 따라 type 결정
          let type = 'table-2'; // 기본값

          if (table.shape === 'CIRCLE' && table.maxCapacity <= 2) {
            type = 'seat';
          } else if (table.shape === 'CIRCLE' && table.maxCapacity === 4) {
            type = 'table-4';
          } else if (table.shape === 'RECTANGLE' && table.maxCapacity <= 2) {
            type = 'table-2';
          } else if (table.shape === 'RECTANGLE' && table.maxCapacity >= 4) {
            type = 'table-4';
          }

          const size = getDefaultSize(type);

          return {
            id: `table-${table.id}`,
            type: type,
            x: table.xPosition || 100,
            y: table.yPosition || 100,
            width: size.width,
            height: size.height,
            name: table.name,
            minCapacity: table.minCapacity || 1,
            maxCapacity: table.maxCapacity || 1,
            price: 0,
            dbId: table.id, // 백엔드 ID 보관
            originalShape: table.shape // 원본 shape 저장
          };
        });

        setElements(loadedElements);
        setElementCounter(tables.length);
        console.log('테이블 로딩 완료:', loadedElements);
      }
    } catch (error) {
      console.error('테이블 로딩 실패:', error);
      alert('테이블 데이터를 불러오는데 실패했습니다.');
    }
  };

  /**
   * 테이블 레이아웃 저장
   */
  const saveLayout = async () => {
    if (!restaurantId) {
      alert('레스토랑 ID가 없습니다.');
      return;
    }

    if (elements.length === 0) {
      alert('저장할 테이블이 없습니다.');
      return;
    }

    try {
      // 에디터 형식을 백엔드 형식으로 변환
      const tables = elements.map((el) => {
        // 기존 테이블이면 원본 shape 유지, 신규 테이블이면 type에 따라 shape 결정
        let shape;
        if (el.originalShape) {
          // 기존 테이블: 원본 shape 보존
          shape = el.originalShape;
        } else {
          // 신규 테이블: type에 따라 shape 결정
          shape = 'RECTANGLE';
          if (el.type === 'table-4' || el.type === 'seat' || el.type === 'counter') {
            shape = 'CIRCLE';
          }
        }

        return {
          id: el.dbId || null, // 기존 테이블이면 ID 포함, 신규면 null
          name: el.name,
          minCapacity: el.minCapacity,
          maxCapacity: el.maxCapacity,
          xPosition: Math.round(el.x),
          yPosition: Math.round(el.y),
          shape: shape
        };
      });

      console.log('저장할 데이터:', { tables });

      const response = await api.post(`/${restaurantId}/tables/layout`, { tables });

      console.log('저장 완료:', response.data);
      alert('테이블 레이아웃이 저장되었습니다!');

      // 저장 후 다시 로드하여 DB ID 업데이트
      loadExistingTables();
    } catch (error) {
      console.error('저장 실패:', error);
      alert('테이블 레이아웃 저장에 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 기존 테이블 로드
  useEffect(() => {
    loadExistingTables();
  }, [restaurantId]);

  // ============ 렌더링 ============
  return (
    <div style={styles.container}>
      {/* 사이드바 */}
      <div style={styles.sidebar}>
        <div>
          {/* 테이블 & 좌석 섹션 */}
          <div>
            <h3 style={styles.sectionTitle}>테이블 & 좌석</h3>
            <div style={styles.toolGrid}>
              {tools.tables.map((tool) => (
                <div
                  key={tool.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tool.type)}
                  style={styles.toolItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b35';
                    e.currentTarget.style.background = '#fff5f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={styles.toolIcon}>{tool.icon}</div>
                  <div style={styles.toolName}>{tool.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 구조물 섹션 */}
          {/* <div>
            <h3 style={styles.sectionTitle}>구조물</h3>
            <div style={styles.toolGrid}>
              {tools.structures.map((tool) => (
                <div
                  key={tool.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tool.type)}
                  style={styles.toolItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b35';
                    e.currentTarget.style.background = '#fff5f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={styles.toolIcon}>{tool.icon}</div>
                  <div style={styles.toolName}>{tool.name}</div>
                </div>
              ))}
            </div>
          </div> */}

          {/* 속성 패널 */}
          <div style={styles.properties}>
            <h3 style={styles.sectionTitle}>속성</h3>
            {selectedElement ? (
              <div>
                <div style={styles.propertyGroup}>
                  <label style={styles.propertyLabel}>이름</label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => updateProperty('name', e.target.value)}
                    style={styles.propertyInput}
                  />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                  <div>
                    <label style={styles.propertyLabel}>최소인원</label>
                    <input
                      type="number"
                      min="0"
                      value={selectedElement.minCapacity}
                      onChange={(e) => updateProperty('minCapacity', parseInt(e.target.value))}
                      style={styles.propertyInput}
                    />
                  </div>
                  <div>
                    <label style={styles.propertyLabel}>최대인원</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedElement.maxCapacity}
                      onChange={(e) => updateProperty('maxCapacity', parseInt(e.target.value))}
                      style={styles.propertyInput}
                    />
                  </div>
                </div>
                {/* <div style={styles.propertyGroup}>
                  <label style={styles.propertyLabel}>추가요금</label>
                  <input
                    type="number"
                    value={selectedElement.price}
                    onChange={(e) => updateProperty('price', parseInt(e.target.value))}
                    style={styles.propertyInput}
                  />
                </div> */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                  <div>
                    <label style={styles.propertyLabel}>X</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.x)}
                      onChange={(e) => updateProperty('x', parseInt(e.target.value))}
                      style={styles.propertyInput}
                    />
                  </div>
                  <div>
                    <label style={styles.propertyLabel}>Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.y)}
                      onChange={(e) => updateProperty('y', parseInt(e.target.value))}
                      style={styles.propertyInput}
                    />
                  </div>
                </div>
                <button
                  onClick={deleteSelected}
                  style={{...styles.btn, ...styles.btnDanger, width: '100%'}}
                >
                  삭제
                </button>
              </div>
            ) : (
              <p style={{color: '#6c757d', textAlign: 'center', fontSize: '14px'}}>요소를 선택하세요</p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button
              onClick={saveLayout}
              style={{...styles.btn, ...styles.btnPrimary, width: '100%', fontSize: '16px', padding: '12px 16px'}}
            >
              💾 저장하기
            </button>
            <button
              onClick={clearCanvas}
              style={{...styles.btn, ...styles.btnDanger, width: '100%'}}
            >
              전체 삭제
            </button>
            {/* <button
              onClick={exportLayout}
              style={{...styles.btn, ...styles.btnSuccess, width: '100%'}}
            >
              JSON 출력
            </button> */}
          </div>

          {/* JSON 미리보기 */}
          {/* <div style={{marginTop: '20px'}}>
            <h3 style={styles.sectionTitle}>JSON 출력</h3>
            <div style={styles.jsonOutput} id="json-output">
              {elements.length > 0 ? `${elements.length}개 배치됨` : '배치를 완료한 후 "JSON 출력"을 클릭하세요'}
            </div>
          </div> */}
        </div>
      </div>

      {/* 메인 에디터 */}
      <div style={styles.mainEditor}>
        {/* 툴바 */}
        <div style={{...styles.toolbar, justifyContent: 'space-between'}}>
          <span style={{fontWeight: 600}}>레스토랑 좌석 배치 에디터</span>
          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              ...styles.btn,
              ...(showGrid ? styles.btnPrimary : {background: '#e9ecef', color: '#495057'})
            }}
          >
            격자 {showGrid ? '숨기기' : '표시'}
          </button>
        </div>

        {/* 캔버스 */}
        <div style={styles.canvasContainer}>
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
            onMouseMove={handleElementDrag}
            onMouseUp={handleElementDragEnd}
            style={styles.canvas}
          >
            {/* 격자 */}
            {showGrid && (
              <svg style={styles.grid}>
                <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            )}

            {/* 배치된 요소들 */}
            {elements.map((element) => (
              <div
                key={element.id}
                onClick={(e) => handleElementClick(e, element)}
                onMouseDown={(e) => handleElementDragStart(e, element)}
                style={getElementStyle(element.type, element, selectedElement?.id === element.id)}
                onMouseEnter={(e) => {
                  if (selectedElement?.id !== element.id) {
                    e.currentTarget.style.borderColor = '#ff6b35';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedElement?.id !== element.id) {
                    e.currentTarget.style.borderColor = '#007bff';
                  }
                }}
              >
                {element.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistTableTab;