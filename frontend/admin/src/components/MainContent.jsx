import React from 'react';

export default function MainContent(){
    return(
        <>
            {/* Main Content */}
            <div className="col-md-9 col-lg-10">
                <div className="main-content">
                    <div className="header-section">
                        <div className="container-fluid">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="mb-0">매장 관리</h2>
                                    <p className="text-muted mb-0">정미스시 매장 정보를 관리하세요</p>
                                </div>
                                <div>
                                    <button className="btn btn-success me-2">
                                        <i className="fas fa-save me-1"></i>전체 저장
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        <i className="fas fa-eye me-1"></i>미리보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid">
                        <div className="tab-content">
                            {/* Dashboard Tab */}
                            <div className="tab-pane fade show active" id="dashboard">
                                <div className="row mb-4">
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card stats-card h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <div className="text-white-75 small">오늘 예약</div>
                                                        <div className="h2 mb-0 font-weight-bold text-white">24</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-calendar-check fa-2x text-white-25"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card stats-card success h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <div className="text-white-75 small">이번 달 리뷰</div>
                                                        <div className="h2 mb-0 font-weight-bold text-white">156</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-star fa-2x text-white-25"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card stats-card warning h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <div className="text-white-75 small">평균 평점</div>
                                                        <div className="h2 mb-0 font-weight-bold text-white">4.8</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-heart fa-2x text-white-25"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-xl-3 col-md-6 mb-4">
                                        <div className="card stats-card info h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <div className="text-dark-75 small">웨이팅</div>
                                                        <div className="h2 mb-0 font-weight-bold text-dark">5팀</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="fas fa-users fa-2x text-dark-25"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-8 mb-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <i className="fas fa-chart-line me-2"></i>최근 예약 현황
                                            </div>
                                            <div className="card-body">
                                                <div className="alert alert-info">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    차트 데이터가 여기에 표시됩니다
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-4 mb-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <i className="fas fa-bell me-2"></i>알림
                                            </div>
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="flex-shrink-0">
                                                        <i className="fas fa-exclamation-triangle text-warning"></i>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="fw-bold">메뉴 재고 부족</div>
                                                        <div className="text-muted small">갈치조림 재료 확인 필요</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="flex-shrink-0">
                                                        <i className="fas fa-star text-success"></i>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="fw-bold">새로운 리뷰</div>
                                                        <div className="text-muted small">김**님이 5점 리뷰를 남겼습니다</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <i className="fas fa-calendar text-primary"></i>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="fw-bold">예약 취소</div>
                                                        <div className="text-muted small">오늘 19:00 예약이 취소되었습니다</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Restaurant Info Tab */}
                            <div className="tab-pane fade" id="restaurant-info">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-store me-2"></i>매장 기본 정보
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="restaurantName" className="form-label">매장명</label>
                                                    <input type="text" className="form-control" id="restaurantName" defaultValue="정미스시"/>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="cuisineType" className="form-label">음식 종류</label>
                                                    <select className="form-select" id="cuisineType">
                                                        <option>일식</option>
                                                        <option>한식</option>
                                                        <option>중식</option>
                                                        <option>양식</option>
                                                        <option>기타</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="address" className="form-label">주소</label>
                                                    <input type="text" className="form-control" id="address" defaultValue="서울 강남구 압구정로 464-41"/>
                                                </div>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phone" className="form-label">전화번호</label>
                                                    <input type="tel" className="form-control" id="phone" defaultValue="02-3446-8822"/>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="priceRange" className="form-label">가격대</label>
                                                    <select className="form-select" id="priceRange" defaultValue="3-5만원">
                                                        <option>1만원 이하</option>
                                                        <option>1-3만원</option>
                                                        <option>3-5만원</option>
                                                        <option>5-10만원</option>
                                                        <option>10만원 이상</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">매장 소개</label>
                                                <textarea className="form-control" id="description" rows="4" defaultValue="정통적인 일식을 기본으로 독창적인 스타일의 오마카세입니다. 명장님의 다년간의 노하우를 통해 최상의 식재료로 표현되는 일식 요리로 재료 본래의 진정한 맛을 느껴보실 수 있습니다."></textarea>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="tableCount" className="form-label">테이블 수</label>
                                                    <input type="number" className="form-control" id="tableCount" defaultValue="12"/>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="maxCapacity" className="form-label">최대 수용 인원</label>
                                                    <input type="number" className="form-control" id="maxCapacity" defaultValue="48"/>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label htmlFor="status" className="form-label">운영 상태</label>
                                                    <select className="form-select" id="status" defaultValue="영업 중">
                                                        <option>영업 중</option>
                                                        <option>준비 중</option>
                                                        <option>휴무</option>
                                                        <option>임시 휴업</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Management Tab */}
                            <div className="tab-pane fade" id="menu-management">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4>메뉴 관리</h4>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMenuModal">
                                        <i className="fas fa-plus me-1"></i>메뉴 추가
                                    </button>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 col-lg-4 mb-4">
                                        <div className="card menu-item-card">
                                            <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="메뉴 이미지"/>
                                            <div className="card-body">
                                                <h5 className="card-title">산삼녹용달인 간장왕갑계치킨식</h5>
                                                <p className="card-text text-muted">산삼과 녹용이 들어간 특별한 간장왕갑계치킨식</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-primary fw-bold fs-5">33,000원</span>
                                                    <span className="badge bg-success status-badge">판매중</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn btn-sm btn-outline-primary me-2">수정</button>
                                                    <button className="btn btn-sm btn-outline-danger">삭제</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 mb-4">
                                        <div className="card menu-item-card">
                                            <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="메뉴 이미지"/>
                                            <div className="card-body">
                                                <h5 className="card-title">국내산 암넘 꽃게장정식</h5>
                                                <p className="card-text text-muted">국내산 암넘 꽃게장정식</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-primary fw-bold fs-5">33,000원</span>
                                                    <span className="badge bg-success status-badge">판매중</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn btn-sm btn-outline-primary me-2">수정</button>
                                                    <button className="btn btn-sm btn-outline-danger">삭제</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 mb-4">
                                        <div className="card menu-item-card">
                                            <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="메뉴 이미지"/>
                                            <div className="card-body">
                                                <h5 className="card-title">어수꽃게탕</h5>
                                                <p className="card-text text-muted">신선한 꽃게가 들어간 시원한 국물 요리</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-primary fw-bold fs-5">23,000원</span>
                                                    <span className="badge bg-warning status-badge">품절</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn btn-sm btn-outline-primary me-2">수정</button>
                                                    <button className="btn btn-sm btn-outline-danger">삭제</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 mb-4">
                                        <div className="card menu-item-card">
                                            <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="메뉴 이미지"/>
                                            <div className="card-body">
                                                <h5 className="card-title">어수 갈치조림100%국산+계장정식1인</h5>
                                                <p className="card-text text-muted">국산 먹갈치와 간장계란, 양념계란이 함께 나오는 먹성비 정식!</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="text-primary fw-bold fs-5">22,000원</span>
                                                    <span className="badge bg-success status-badge">판매중</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn btn-sm btn-outline-primary me-2">수정</button>
                                                    <button className="btn btn-sm btn-outline-danger">삭제</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Operating Hours Tab */}
                            <div className="tab-pane fade" id="operating-hours">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-clock me-2"></i>운영 시간 설정
                                    </div>
                                    <div className="card-body">
                                        <table className="table operating-hours-table">
                                            <thead>
                                                <tr>
                                                    <th>요일</th>
                                                    <th>운영여부</th>
                                                    <th>오픈시간</th>
                                                    <th>마감시간</th>
                                                    <th>라스트오더</th>
                                                    <th>브레이크타임</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">월요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">화요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">수요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">목요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">금요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">토요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">일요일</td>
                                                    <td>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                    </td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                                                    <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                                                    <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        
                                        <div className="mt-4">
                                            <h6>추가 설정</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="holiday" className="form-label">휴무일</label>
                                                    <input type="text" className="form-control" id="holiday" defaultValue="연중무휴" placeholder="예: 매월 셋째 일요일"/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="reservationPolicy" className="form-label">예약 정책</label>
                                                    <select className="form-select" id="reservationPolicy" defaultValue="1일 전 예약 필수">
                                                        <option>당일 예약 가능</option>
                                                        <option>1일 전 예약 필수</option>
                                                        <option>2일 전 예약 필수</option>
                                                        <option>3일 전 예약 필수</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Facilities Tab */}
                            <div className="tab-pane fade" id="facilities">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-cogs me-2"></i>편의시설 관리
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-car fa-3x text-primary mb-3"></i>
                                                        <h6>발렛파킹</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">무료 발렛파킹 서비스 제공</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-wheelchair fa-3x text-primary mb-3"></i>
                                                        <h6>휠체어 접근</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">휠체어 이용 가능</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-wine-glass-alt fa-3x text-primary mb-3"></i>
                                                        <h6>주류 판매</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">다양한 주류 판매</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-wifi fa-3x text-primary mb-3"></i>
                                                        <h6>무료 WiFi</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">고속 무료 인터넷</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-birthday-cake fa-3x text-primary mb-3"></i>
                                                        <h6>기념일 서비스</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">생일, 기념일 케이크 서비스</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <div className="card">
                                                    <div className="card-body text-center">
                                                        <i className="fas fa-users fa-3x text-primary mb-3"></i>
                                                        <h6>단체석</h6>
                                                        <div className="form-check form-switch d-flex justify-content-center">
                                                            <input className="form-check-input" type="checkbox" defaultChecked/>
                                                        </div>
                                                        <small className="text-muted">10인 이상 단체 이용 가능</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images Tab */}
                            <div className="tab-pane fade" id="images">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-images me-2"></i>매장 이미지 관리
                                    </div>
                                    <div className="card-body">
                                        <div className="image-upload-area mb-4">
                                            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                            <h5>이미지 업로드</h5>
                                            <p className="text-muted">클릭하거나 파일을 드래그하여 업로드하세요</p>
                                            <button className="btn btn-outline-primary">파일 선택</button>
                                            <input type="file" className="d-none" multiple accept="image/*"/>
                                        </div>

                                        <h6>현재 업로드된 이미지</h6>
                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <div className="card">
                                                    <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="매장 이미지"/>
                                                    <div className="card-body text-center p-2">
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-outline-primary">대표</button>
                                                            <button className="btn btn-outline-danger">삭제</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <div className="card">
                                                    <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="매장 이미지"/>
                                                    <div className="card-body text-center p-2">
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-primary">대표</button>
                                                            <button className="btn btn-outline-danger">삭제</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <div className="card">
                                                    <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img0" className="card-img-top" alt="매장 이미지"/>
                                                    <div className="card-body text-center p-2">
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-outline-primary">대표</button>
                                                            <button className="btn btn-outline-danger">삭제</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3 mb-3">
                                                <div className="card">
                                                    <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" className="card-img-top" alt="매장 이미지"/>
                                                    <div className="card-body text-center p-2">
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-outline-primary">대표</button>
                                                            <button className="btn btn-outline-danger">삭제</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Tab */}
                            <div className="tab-pane fade" id="reviews">
                                <div className="row mb-4">
                                    <div className="col-md-8">
                                        <h4>리뷰 관리</h4>
                                    </div>
                                    <div className="col-md-4">
                                        <select className="form-select">
                                            <option>전체 리뷰</option>
                                            <option>5점 리뷰</option>
                                            <option>4점 리뷰</option>
                                            <option>3점 리뷰</option>
                                            <option>2점 리뷰</option>
                                            <option>1점 리뷰</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '50px', height: '50px'}}>
                                                    김
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">김**님</h6>
                                                    <div className="text-warning mb-2">⭐⭐⭐⭐⭐</div>
                                                    <p className="mb-2">정말 최고의 오마카세였습니다! 셰프님의 정성이 느껴지는 요리 하나하나가 예술 작품 같았어요.</p>
                                                    <small className="text-muted">2025.08.28</small>
                                                </div>
                                            </div>
                                            <div className="dropdown">
                                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                                    관리
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="#">답글 작성</a></li>
                                                    <li><a className="dropdown-item" href="#">숨기기</a></li>
                                                    <li><a className="dropdown-item text-danger" href="#">신고</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '50px', height: '50px'}}>
                                                    이
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">이**님</h6>
                                                    <div className="text-warning mb-2">⭐⭐⭐⭐⭐</div>
                                                    <p className="mb-2">생일 기념으로 방문했는데 정말 만족스러웠어요. 스시 하나하나가 완벽했고, 셰프님께서 직접 설명해주시는 것도 좋았습니다.</p>
                                                    <small className="text-muted">2025.08.25</small>
                                                </div>
                                            </div>
                                            <div className="dropdown">
                                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                                    관리
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="#">답글 작성</a></li>
                                                    <li><a className="dropdown-item" href="#">숨기기</a></li>
                                                    <li><a className="dropdown-item text-danger" href="#">신고</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '50px', height: '50px'}}>
                                                    박
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">박**님</h6>
                                                    <div className="text-warning mb-2">⭐⭐⭐⭐</div>
                                                    <p className="mb-2">음식은 정말 훌륭했지만 조금 비싸다는 느낌이 들었어요. 그래도 신선한 재료와 섬세한 손길이 느껴지는 요리였습니다.</p>
                                                    <small className="text-muted">2025.08.22</small>
                                                </div>
                                            </div>
                                            <div className="dropdown">
                                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                                    관리
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="#">답글 작성</a></li>
                                                    <li><a className="dropdown-item" href="#">숨기기</a></li>
                                                    <li><a className="dropdown-item text-danger" href="#">신고</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
