import {  useState, useCallback } from "react";
import './MainContent.css';
import './Waiting.css';

// Tabs import
import DashboardTab from './tabs/DashboardTab';
import RestaurantInfoTab from './tabs/RestaurantInfoTab';
import RestaurantListTab from './tabs/RestaurantListTab';
import MenuManagementTab from './tabs/MenuManagementTab';
import OperatingHoursTab from './tabs/OperatingHoursTab';
import FacilitiesTab from './tabs/FacilitiesTab';
import ImagesTab from './tabs/ImagesTab';
import ReviewsTab from './tabs/ReviewsTab';
import WaitingTab from './tabs/WaitingTab';

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const handleTabClick = (e) => {
    const href = e.target.getAttribute("href");
    if (href === "#restaurant-info") {
      setSelectedRestaurant(null); // 등록 탭이면 수정 상태 초기화
    }
  };

  return (
    <div className="col-md-9 col-lg-10">
      <div className="main-content" onClick={handleTabClick}>
        {/* Header Section */}
        <div className="header-section">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">매장 관리</h2>
                <p className="text-muted mb-0">정미스시 매장 정보를 관리하세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 탭별 내용 */}
        <div className="container-fluid">
          <div className="tab-content">
            <DashboardTab />
            <RestaurantInfoTab
              selectedRestaurant={selectedRestaurant}
              clearSelection={() => setSelectedRestaurant(null)}
              onSaved={() => setActiveTab("restaurant-list")}
            />
            <RestaurantListTab onEdit={setSelectedRestaurant} />
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
  );
}
