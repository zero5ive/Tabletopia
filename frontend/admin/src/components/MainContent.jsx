import { useState, useEffect } from "react";
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

  // ✅ 기존 클릭 이벤트 (직접 클릭 시에도 초기화)
  const handleTabClick = (e) => {
    const href = e.target.getAttribute("href");
    if (href === "#restaurant-info") {
      setSelectedRestaurant(null);
    }
  };

  // ✅ 추가: Bootstrap 탭 전환 감지 (Tab.show()로 전환될 때도 초기화되게)
  useEffect(() => {
    const tabElements = document.querySelectorAll('a[data-bs-toggle="tab"]');

    const handleShown = (event) => {
      const target = event.target.getAttribute("href");
      if (target === "#restaurant-info") {
        setSelectedRestaurant(null); // 탭 전환 시에도 선택 초기화
      }
    };

    tabElements.forEach((tab) =>
      tab.addEventListener("shown.bs.tab", handleShown)
    );

    return () => {
      tabElements.forEach((tab) =>
        tab.removeEventListener("shown.bs.tab", handleShown)
      );
    };
  }, []);

  return (
    <div className="col-md-9 col-lg-10">
      <div className="main-content" onClick={handleTabClick}>
        {/* ✅ Header Section */}
        <div className="header-section">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">매장 관리</h2>
                <p className="text-muted mb-0">정미스시 매장 정보를 관리하세요</p>
              </div>

              {/* ✅ 현재 선택된 매장 표시 */}
              {selectedRestaurant ? (
                <div className="selected-restaurant-badge">
                  <i className="fas fa-store me-2 text-primary"></i>
                  <strong>{selectedRestaurant.name}</strong>
                </div>
              ) : (
                <div className="text-muted small">
                  <i className="fas fa-info-circle me-1"></i>
                  선택된 매장이 없습니다
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 탭별 내용 */}
        <div className="container-fluid">
          <div className="tab-content">
            <DashboardTab />
            <RestaurantInfoTab
              selectedRestaurant={selectedRestaurant}
              clearSelection={() => setSelectedRestaurant(null)}
              onSaved={() => setActiveTab("restaurant-list")}
            />
            <RestaurantListTab
              onEdit={setSelectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
              onChangeTab={setActiveTab}
            />
            <MenuManagementTab selectedRestaurant={selectedRestaurant} />
            <OperatingHoursTab />
            <FacilitiesTab />
            <ImagesTab />
            <ReviewsTab />
            <WaitingTab />
          </div>
        </div>
      </div>
    </div>
  );
}
