import StatsCard from '../cards/StatsCard'

export default function DashboardTab(){
  return (
    <div className="tab-pane fade show active" id="dashboard">
      <div className="row mb-4">
        <StatsCard title="오늘 예약" value="24" icon="fa-calendar-check" color="primary" />
        <StatsCard title="이번 달 리뷰" value="156" icon="fa-star" color="success" />
        <StatsCard title="평균 평점" value="4.8" icon="fa-heart" color="warning" />
        <StatsCard title="웨이팅" value="5팀" icon="fa-users" color="info" />
      </div>
      {/* 그래프 & 알림 부분 */}
      <div className="row">
        {/* 최근 예약 현황 */}
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

        {/* 알림 */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-bell me-2"></i>알림
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-exclamation-triangle text-warning"></i>
                <div className="ms-3">
                  <div className="fw-bold">메뉴 재고 부족</div>
                  <div className="text-muted small">갈치조림 재료 확인 필요</div>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-star text-success"></i>
                <div className="ms-3">
                  <div className="fw-bold">새로운 리뷰</div>
                  <div className="text-muted small">김**님이 5점 리뷰를 남겼습니다</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-calendar text-primary"></i>
                <div className="ms-3">
                  <div className="fw-bold">예약 취소</div>
                  <div className="text-muted small">오늘 19:00 예약이 취소되었습니다</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  )
}
