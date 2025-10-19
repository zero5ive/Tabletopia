import './Sidebar.css'
import { logoutAdmin } from '../utils/AuthApi'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('adminRole')
    console.log('현재 저장된 adminRole:', stored)
    if (stored) setRole(stored.replace('ROLE_', ''))
  }, [])

  return (
    <div className="col-md-3 col-lg-2 px-0">
      <div className="sidebar">
        <div className="p-3">
          <h4 className="text-white mb-0">매장 관리</h4>
          <small className="text-muted">정미스시</small>
        </div>

        <nav className="nav flex-column nav-pills">
          {/* SUPERADMIN → 매장 등록만 */}
          {role === 'SUPERADMIN' && (
            <a className="nav-link" href="#restaurant-info" data-bs-toggle="tab">
              <i className="fas fa-store me-2"></i>매장 등록
            </a>
          )}
          <a className="nav-link" href="#restaurant-list" data-bs-toggle="tab">
            <i className="fas fa-info-circle me-2"></i>매장 목록
          </a>
          <a className="nav-link" href="#menu-management" data-bs-toggle="tab">
            <i className="fas fa-utensils me-2"></i>메뉴 관리
          </a>
          <a className="nav-link" href="#operating-hours" data-bs-toggle="tab">
            <i className="fas fa-clock me-2"></i>운영시간
          </a>
          <a className="nav-link" href="#special-hours" data-bs-toggle="tab">
            <i className="fas fa-calendar-day me-2"></i>특별 운영시간
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
          <a className="nav-link" href="#reservationtable" data-bs-toggle="tab">
            <i className="fas fa-calendar-check me-2"></i>예약 관리
          </a>

          {/* 로그아웃 */}
          <a className="nav-link" onClick={logoutAdmin} style={{ cursor: 'pointer' }}>
            <i className="fas fa-sign-out-alt me-2"></i>로그아웃
          </a>
        </nav>
      </div>
    </div>
  )
}
