import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="col-md-3 col-lg-2 px-0">
      <div className="sidebar">
        <div className="p-3">
          <h4 className="text-white mb-0">매장 관리</h4>
          <small className="text-muted">정미스시</small>
        </div>

        {/* ✅ nav-pills + active + data-bs-toggle="tab" */}
        <nav className="nav flex-column nav-pills">
          <a className="nav-link active" href="#dashboard" data-bs-toggle="tab">
            <i className="fas fa-tachometer-alt me-2"></i>대시보드
          </a>

          <a className="nav-link" href="#restaurant-info" data-bs-toggle="tab">
            <i className="fas fa-store me-2"></i>매장 등록
          </a>

          <a className="nav-link" href="#restaurant-list" data-bs-toggle="tab">
            <i className="fas fa-info-circle me-2"></i>매장 목록
          </a>

          <a className="nav-link" href="#menu-management" data-bs-toggle="tab">
            <i className="fas fa-utensils me-2"></i>메뉴 관리
          </a>

          <a className="nav-link" href="#operating-hours" data-bs-toggle="tab">
            <i className="fas fa-clock me-2"></i>운영시간
          </a>

          <a className="nav-link" href="#facilities" data-bs-toggle="tab">
            <i className="fas fa-cogs me-2"></i>편의시설
          </a>

          <a className="nav-link" href="#images" data-bs-toggle="tab">
            <i className="fas fa-images me-2"></i>이미지 관리
          </a>

          <a className="nav-link" href="#reviews" data-bs-toggle="tab">
            <i className="fas fa-star me-2"></i>리뷰 관리
          </a>

          <a className="nav-link" href="#waiting" data-bs-toggle="tab">
            <i className="fas fa-users me-2"></i>웨이팅 관리
          </a>
        </nav>
      </div>
    </div>
  );
}
