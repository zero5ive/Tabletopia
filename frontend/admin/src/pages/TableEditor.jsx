import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TableEditor.css';

export default function TableEditor() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const restaurantName = decodeURIComponent(searchParams.get('restaurantName') || '레스토랑');

  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementCounter, setElementCounter] = useState(0);
  const [draggedType, setDraggedType] = useState(null);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [jsonOutput, setJsonOutput] = useState('배치를 완료한 후 "JSON 출력"을 클릭하세요');
  const [warning, setWarning] = useState(null);

  const canvasRef = useRef(null);

  // 도구 아이템 정의
  const toolItems = [
    { type: 'table-2', icon: '🪑', name: '사각 테이블' },
    { type: 'table-4', icon: '🪑', name: '원형 테이블' },
    // { type: 'counter', icon: '🍣', name: '카운터' },
    // { type: 'seat', icon: '💺', name: '개별 좌석' },
    // { type: 'wall', icon: '🧱', name: '벽' },
    // { type: 'door', icon: '🚪', name: '문' },
    // { type: 'window', icon: '🪟', name: '창문' }
  ];

  // 기본 크기 가져오기
  const getDefaultSize = (type) => {
    const sizes = {
      'table-2': { width: 80, height: 60 },
      'table-4': { width: 100, height: 100 },
      // 'counter': { width: 200, height: 40 },
      // 'seat': { width: 30, height: 30 },
      // 'wall': { width: 100, height: 20 },
      // 'door': { width: 60, height: 20 },
      // 'window': { width: 100, height: 20 }
    };
    return sizes[type] || { width: 50, height: 50 };
  };

  // 타입 이름 가져오기
  const getTypeName = (type) => {
    const names = {
      'table-2': '사각테이블',
      'table-4': '원형테이블',
      // 'counter': '카운터',
      // 'seat': '좌석',
      // 'wall': '벽',
      // 'door': '문',
      // 'window': '창문'
    };
    return names[type] || type;
  };

  // 기본 수용인원 가져오기
  const getDefaultCapacity = (type) => {
    const capacities = {
      'table-2': 2,
      'table-4': 4,
      'counter': 1,
      'seat': 1,
      'wall': 0,
      'door': 0,
      'window': 0
    };
    return capacities[type] || 0;
  };

  // 요소 생성
  const createElement = (type, x, y) => {
    const newCounter = elementCounter + 1;
    setElementCounter(newCounter);

    const size = getDefaultSize(type);
    const element = {
      id: `${type}-${newCounter}`,
      type: type,
      x: x - size.width / 2,
      y: y - size.height / 2,
      width: size.width,
      height: size.height,
      name: `${getTypeName(type)} ${newCounter}`,
      minCapacity: getDefaultCapacity(type), // 최소 인원
      maxCapacity: getDefaultCapacity(type), // 최대 인원 (동일하게 시작)
      price: 0
    };

    setElements([...elements, element]);
  };

  // 드래그 앤 드롭 핸들러 (사이드바에서 캔버스로)
  const handleDragStart = (e, type) => {
    setDraggedType(type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createElement(draggedType, x, y);
    setDraggedType(null);
  };

  // 요소 선택
  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  // 캔버스 클릭 (선택 해제)
  const handleCanvasClick = () => {
    if (!isDraggingElement) {
      setSelectedElement(null);
    }
  };

  // 요소 드래그 시작 (캔버스 내 이동)
  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingElement(true);
    setSelectedElement(element);

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  // 요소 드래그 중
  const handleMouseMove = (e) => {
    if (!isDraggingElement || !selectedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setElements(elements.map(el =>
      el.id === selectedElement.id
        ? { ...el, x: newX, y: newY }
        : el
    ));

    setSelectedElement({ ...selectedElement, x: newX, y: newY });
  };

  // 요소 드래그 종료
  const handleMouseUp = () => {
    setIsDraggingElement(false);
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDraggingElement) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingElement, selectedElement, dragOffset]);

  // 속성 업데이트 (유효성 검사 + 실시간 경고 표시)
  const updateProperty = (property, value) => {
    if (!selectedElement) return;

    let updatedValue = value;
    let warningMsg = null;

    if (property === 'minCapacity') {
      // 최소 1명 이상
      if (value < 1) {
        updatedValue = 1;
        warningMsg = '최소 수용 인원은 1 이상이어야 합니다.';
      }

      // minCapacity가 maxCapacity보다 크면 maxCapacity를 따라감
      if (selectedElement.maxCapacity < updatedValue) {
        warningMsg = '최소 인원이 최대 인원보다 클 수 없습니다.';
        selectedElement.maxCapacity = updatedValue;
      }
    }

    if (property === 'maxCapacity') {
      // 최소 1명 이상
      if (value < 1) {
        updatedValue = 1;
        warningMsg = '최대 수용 인원은 1 이상이어야 합니다.';
      }

      // maxCapacity < minCapacity 방지
      if (updatedValue < selectedElement.minCapacity) {
        updatedValue = selectedElement.minCapacity;
        warningMsg = '최대 인원은 최소 인원보다 작을 수 없습니다.';
      }
    }

    const updatedElement = { ...selectedElement, [property]: updatedValue };
    setSelectedElement(updatedElement);
    setElements(elements.map(el =>
      el.id === selectedElement.id ? updatedElement : el
    ));

    // 경고 메시지 표시 (있을 경우)
    if (warningMsg) {
      setWarning(warningMsg);
      setTimeout(() => setWarning(null), 2000); // 2초 뒤 자동 제거
    }
  };


  // 선택된 요소 삭제
  const deleteSelected = () => {
    if (!selectedElement) return;

    setElements(elements.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
  };

  // 전체 삭제
  const clearCanvas = () => {
    if (window.confirm('모든 요소를 삭제하시겠습니까?')) {
      setElements([]);
      setSelectedElement(null);
      setJsonOutput('배치를 완료한 후 "JSON 출력"을 클릭하세요');
    }
  };

  // 격자 토글
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  // JSON 출력
  const exportLayout = () => {
    const layout = {
      restaurantId: parseInt(restaurantId),
      restaurant: restaurantName,
      elements: elements.map(el => ({
        id: el.id,
        type: el.type,
        name: el.name,
        position: { x: Math.round(el.x), y: Math.round(el.y) },
        size: { width: el.width, height: el.height },
        minCapacity: el.minCapacity,
        maxCapacity: el.maxCapacity,
        priceModifier: el.price
      }))
    };

    setJsonOutput(JSON.stringify(layout, null, 2));
  };


  // 저장 함수 추가
  const saveLayout = async () => {
    if (!restaurantId) {
      alert('레스토랑 정보가 없습니다.');
      return;
    }

    try {
      // 프론트엔드 요소 → 백엔드 형식으로 변환
      const layoutData = {
        tables: elements.map(el => ({
          id: el.backendId || null, // 이미 로드된 테이블은 백엔드 id 유지 가능
          name: el.name,
          minCapacity: el.minCapacity ?? el.capacity ?? 0,
          maxCapacity: el.maxCapacity ?? el.capacity ?? 0,
          xPosition: Math.round(el.x ?? 0),
          yPosition: Math.round(el.y ?? 0),
          shape: el.type === 'table-4' ? 'CIRCLE' : 'RECTANGLE'
        }))
      };

      console.log("보낼 데이터:", layoutData);


      console.log("저장 직전 elements:", elements);


      const response = await fetch(
        `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/tables/layout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(layoutData)
        }
      );

      if (response.ok) {
        alert('테이블 배치가 저장되었습니다!');
      } else {
        alert('저장 실패: ' + response.statusText);
      }
    } catch (error) {
      console.error('저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 불러오기 함수 추가
  const loadLayout = async () => {
    if (!restaurantId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/tables`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (response.ok) {
        const tables = await response.json();

        // 백엔드 데이터 → 프론트엔드 요소로 변환
        const loadedElements = tables.map((table, index) => ({
          id: `loaded-${table.id}`,
          type: table.shape === 'CIRCLE' ? 'table-4' : 'table-2',
          x: table.xPosition,
          y: table.yPosition,
          width: table.shape === 'CIRCLE' ? 100 : 80,
          height: table.shape === 'CIRCLE' ? 100 : 60,
          name: table.name,
          minCapacity: table.minCapacity,
          maxCapacity: table.maxCapacity,
          // capacity: table.maxCapacity,
          price: 0,
          backendId: table.id // 백엔드 ID 보관
        }));

        console.log(loadedElements);

        setElements(loadedElements);
        setElementCounter(tables.length);
      }
    } catch (error) {
      console.error('불러오기 중 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 자동 로드
  useEffect(() => {
    loadLayout();
  }, [restaurantId]);


  return (
    <div className="table-editor-page">
      <div className="editor-sidebar">
        {/* 헤더 */}
        <div className="editor-header">
          <h4 className="editor-title">좌석 배치 에디터</h4>
          <p className="editor-subtitle">{restaurantName}</p>
        </div>

        {/* 도구 섹션 */}
        <div className="tool-section">
          <div className="section-title">테이블 & 좌석</div>
          <div className="tool-grid">
            {toolItems.slice(0, 4).map(item => (
              <div
                key={item.type}
                className="tool-item"
                draggable
                onDragStart={(e) => handleDragStart(e, item.type)}
              >
                <div className="tool-icon">{item.icon}</div>
                <div className="tool-name">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 속성 패널 */}
        <div className="properties">
          <div className="section-title">속성</div>
          <div className="properties-content">
            {selectedElement ? (
              <>
                <div className="property-group">
                  <label className="property-label">이름</label>
                  <input
                    className="property-input"
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => updateProperty('name', e.target.value)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">최소 수용인원</label>
                  <input
                    className="property-input"
                    type="number"
                    value={selectedElement.minCapacity}
                    onChange={(e) => updateProperty('minCapacity', parseInt(e.target.value) || 0)}
                  />
                  <label className="property-label">최대 수용인원</label>
                  <input
                    className="property-input"
                    type="number"
                    value={selectedElement.maxCapacity}
                    onChange={(e) => updateProperty('maxCapacity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">위치 X</label>
                  <input
                    className="property-input"
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateProperty('x', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">위치 Y</label>
                  <input
                    className="property-input"
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateProperty('y', parseInt(e.target.value) || 0)}
                  />
                </div>
                {warning && (
                  <div className="warning-message">
                    ⚠️ {warning}
                  </div>
                )}

                <button className="btn btn-danger" onClick={deleteSelected}>
                  삭제
                </button>
              </>
            ) : (
              <p className="no-selection">요소를 선택하세요</p>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="btn btn-success" onClick={saveLayout}>
            <i className="fas fa-save me-2"></i>저장
          </button>
          <button className="btn btn-danger" onClick={clearCanvas}>
            전체 삭제
          </button>
          {/* <button className="btn btn-info" onClick={loadLayout}>
            <i className="fas fa-sync me-2"></i>갱신
          </button> */}
        </div>
        {/* JSON 출력 */}
        {/*
        <div className="json-section">
          <div className="section-title">JSON 출력</div>
          <pre className="json-output">{jsonOutput}</pre>
        </div>
        */}
      </div>

      {/* 메인 에디터 */}
      <div className="main-editor">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="toolbar-title">레스토랑 좌석 배치 에디터</span>
            <span className="toolbar-info">총 {elements.length}개 요소</span>
          </div>
          <div className="toolbar-right">
            <button className="btn-toolbar" onClick={toggleGrid}>
              <i className={`fas fa-${showGrid ? 'eye-slash' : 'eye'}`}></i>
              격자 {showGrid ? '숨기기' : '표시'}
            </button>
          </div>
        </div>

        <div className="canvas-container">
          <div
            className="restaurant-canvas"
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            {/* 격자 */}
            {showGrid && (
              <svg className="grid">
                <defs>
                  <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ddd" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            )}

            {/* 배치된 요소들 */}
            {elements.map(element => (
              <div
                key={element.id}
                className={`placed-element ${element.type} ${selectedElement?.id === element.id ? 'selected' : ''}`}
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`
                }}
                onClick={(e) => handleElementClick(e, element)}
                onMouseDown={(e) => handleElementMouseDown(e, element)}
              >
                {element.name.length > 8 ? `${element.name.substring(0, 6)}...` : element.name}
              </div>
            ))}

            {/* 안내 메시지 */}
            {elements.length === 0 && (
              <div className="empty-canvas-message">
                <i className="fas fa-hand-pointer fa-3x"></i>
                <p>왼쪽에서 요소를 드래그하여 배치하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
