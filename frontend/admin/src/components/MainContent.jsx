import { useState, useEffect } from "react";
import "./MainContent.css";
import "./Waiting.css";

import RestaurantInfoTab from "./tabs/RestaurantInfoTab";
import RestaurantListTab from "./tabs/RestaurantListTab";
import MenuManagementTab from "./tabs/MenuManagementTab";
import OperatingHoursTab from "./tabs/OperatingHoursTab";
import FacilitiesTab from "./tabs/FacilitiesTab";
import ImagesTab from "./tabs/ImagesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import SpecialHoursTab from "./tabs/SpecialHoursTab";
import WaitingTab from "./tabs/WaitingTab";
import ReservationTableTab from "./tabs/ReservationTableTab";

export default function MainContent() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabClick = (e) => {
    const href = e.target.getAttribute("href");
    if (href === "#restaurant-info" && !isEditing) {
      setSelectedRestaurant(null);
    }
  };

  useEffect(() => {
    const handleShown = (event) => {
      const href = event.target.getAttribute("href");
      if (href === "#restaurant-info") {
        if (!isEditing) setSelectedRestaurant(null);
        setIsEditing(false);
      }
    };

    const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
    tabs.forEach((tab) => tab.addEventListener("shown.bs.tab", handleShown));
    return () => {
      tabs.forEach((tab) => tab.removeEventListener("shown.bs.tab", handleShown));
    };
  }, [isEditing]);

  // 메인 페이지 진입 시 매장 목록 탭 클릭 이벤트 강제 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      const tab = document.querySelector('a[href="#restaurant-list"]');
      if (tab) tab.click();
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="">
      <div className="main-content" onClick={handleTabClick}>
        <div className="header-section">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              {/* <div>
                <h2 className="mb-0">매장 관리</h2>
              </div> */}

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
            <RestaurantListTab
              onEdit={(restaurant) => {
                setSelectedRestaurant(restaurant);
                setIsEditing(true);
              }}
              onSelectRestaurant={setSelectedRestaurant}
              selectedRestaurant={selectedRestaurant}
            />
            <RestaurantInfoTab
              selectedRestaurant={selectedRestaurant}
              clearSelection={() => setSelectedRestaurant(null)}
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
