import { useState, useEffect } from "react";
import './MainContent.css';
import './Waiting.css';

import DashboardTab from './tabs/DashboardTab';
import RestaurantInfoTab from './tabs/RestaurantInfoTab';
import RestaurantListTab from './tabs/RestaurantListTab';
import MenuManagementTab from './tabs/MenuManagementTab';
import OperatingHoursTab from './tabs/OperatingHoursTab';
import FacilitiesTab from './tabs/FacilitiesTab';
import ImagesTab from './tabs/ImagesTab';
import ReviewsTab from './tabs/ReviewsTab';
import SpecialHoursTab from "./tabs/SpecialHoursTab";
import WaitingTab from './tabs/WaitingTab';
import ReservationTableTab from './tabs/ReservationTableTab';

export default function MainContent() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 매장 등록 탭을 클릭했을 때만 초기화
  const handleTabClick = (e) => {
    const href = e.target.getAttribute("href");
    if (href === "#restaurant-info" && !isEditing) {
      setSelectedRestaurant(null);
    }
  };

  // 부트스트랩 탭 전환 이벤트 감지
  useEffect(() => {
    const handleShown = (event) => {
      const href = event.target.getAttribute("href");
      if (href === "#restaurant-info") {
        if (!isEditing) {
          setSelectedRestaurant(null);
        }
        setIsEditing(false);
      }
    };

    const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
    tabs.forEach((tab) => tab.addEventListener("shown.bs.tab", handleShown));

    return () => {
      tabs.forEach((tab) => tab.removeEventListener("shown.bs.tab", handleShown));
    };
  }, [isEditing]);

  return (
    <div className="col-md-9 col-lg-10">
      <div className="main-content" onClick={handleTabClick}>
        <div className="header-section">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">매장 관리</h2>
              </div>

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

        <div className="container-fluid">
          <div className="tab-content">
            <DashboardTab />
            <RestaurantInfoTab
              selectedRestaurant={selectedRestaurant}
              clearSelection={() => setSelectedRestaurant(null)}
            />
            <RestaurantListTab
              onEdit={(restaurant) => {
                setSelectedRestaurant(restaurant);
                setIsEditing(true);
              }}
              onSelectRestaurant={setSelectedRestaurant}
              selectedRestaurant={selectedRestaurant}
            />
            <MenuManagementTab selectedRestaurant={selectedRestaurant} />
            <OperatingHoursTab selectedRestaurant={selectedRestaurant} />
            <SpecialHoursTab selectedRestaurant={selectedRestaurant} />
            <FacilitiesTab selectedRestaurant={selectedRestaurant} />
            <ImagesTab selectedRestaurant={selectedRestaurant} />
            <ReviewsTab selectedRestaurant={selectedRestaurant} />
            <WaitingTab selectedRestaurant={selectedRestaurant} />
            <ReservationTableTab selectedRestaurant={selectedRestaurant} />
          </div>
        </div>
      </div>
    </div>
  );
}
