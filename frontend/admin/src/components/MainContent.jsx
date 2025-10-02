import './MainContent.css'
import './Waiting.css'

// Tabs import
import DashboardTab from './tabs/DashboardTab'
import RestaurantInfoTab from './tabs/RestaurantInfoTab'
import MenuManagementTab from './tabs/MenuManagementTab'
import OperatingHoursTab from './tabs/OperatingHoursTab'
import FacilitiesTab from './tabs/FacilitiesTab'
import ImagesTab from './tabs/ImagesTab'
import ReviewsTab from './tabs/ReviewsTab'
import WaitingTab from './tabs/WaitingTab'
// import Test from './tabs/Test'

export default function MainContent(){
  return (
    <div className="col-md-9 col-lg-10">
      <div className="main-content">

        {/* Header Section */}
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

        {/* 탭별 내용 */}
        <div className="container-fluid">
          <div className="tab-content">
            <DashboardTab />
            <RestaurantInfoTab />
            <MenuManagementTab />
            <OperatingHoursTab />
            <FacilitiesTab />
            <ImagesTab />
            <ReviewsTab />
            <WaitingTab />
            {/* <Test /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
