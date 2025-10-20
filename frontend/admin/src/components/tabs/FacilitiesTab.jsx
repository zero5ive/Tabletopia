import { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

export default function FacilitiesTab({ selectedRestaurant }) {
  const [facilities, setFacilities] = useState([]);
  const [checkedFacilities, setCheckedFacilities] = useState({});

  const getFacilityIcon = (name) => {
    switch (name) {
      case "Wi-Fi":
        return "fa-solid fa-wifi";
      case "금연":
        return "fa-solid fa-ban-smoking";
      case "흡연실":
        return "fa-solid fa-smoking";
      case "단체석":
        return "fa-solid fa-people-group";
      case "반려동물 동반 가능":
        return "fa-solid fa-dog";
      case "장애인 편의시설":
        return "fa-solid fa-wheelchair";
      case "주차 가능":
        return "fa-solid fa-car";
      case "키즈존":
        return "fa-solid fa-child-reaching";
      case "테라스":
        return "fa-solid fa-sun";
      case "화장실":
        return "fa-solid fa-restroom";
      case "포장 가능":
        return "fa-solid fa-box";
      case "배달 가능":
        return "fa-solid fa-motorcycle";
      case "노키즈존":
        return "fa-solid fa-ban";
      default:
        return "fa-solid fa-gear";
    }
  };

  useEffect(() => {
    if (!selectedRestaurant) return;
    loadFacilities();
  }, [selectedRestaurant]);

  const loadFacilities = async () => {
    try {
      const [allRes, assignedRes] = await Promise.all([
        api.get("/user/facilities"),
        api.get(
          `/admin/restaurants/${selectedRestaurant.id}/facilities`
        ),
      ]);

      setFacilities(allRes.data);

      const assigned = {};
      assignedRes.data.forEach((f) => (assigned[f.facilityId] = true));
      setCheckedFacilities(assigned);
    } catch (error) {
      console.error("시설 목록 로드 실패:", error);
      alert("시설 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const toggleFacility = async (facilityId) => {
    const isChecked = !checkedFacilities[facilityId];
    setCheckedFacilities((prev) => ({ ...prev, [facilityId]: isChecked }));

    try {
      if (isChecked) {
        await api.post(
          `/admin/restaurants/${selectedRestaurant.id}/facilities`,
          { facilityId }
        );
      } else {
        await api.delete(
          `/admin/restaurants/${selectedRestaurant.id}/facilities/${facilityId}`
        );
      }
    } catch (error) {
      console.error("편의시설 업데이트 실패:", error);
      alert("편의시설 변경 중 오류가 발생했습니다.");
      setCheckedFacilities((prev) => ({
        ...prev,
        [facilityId]: !isChecked,
      }));
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="facilities">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">
              편의시설을 관리하려면 먼저 매장을 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="facilities">
      <div className="card">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="fa-solid fa-gear me-2"></i>편의시설 관리
        </div>
        <div className="card-body">
          {facilities.length === 0 ? (
            <p className="text-center text-muted mt-3">
              등록된 편의시설이 없습니다.
            </p>
          ) : (
            <div className="row">
              {facilities.map((f) => (
                <div key={f.id} className="col-sm-6 col-md-3 mb-3">
                  <div className="card text-center p-3 shadow-sm h-100">
                    <i
                      className={`${getFacilityIcon(
                        f.name
                      )} fs-2 text-primary mb-2`}
                    ></i>
                    <h6 className="mb-2">{f.name}</h6>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!checkedFacilities[f.id]}
                        onChange={() => toggleFacility(f.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
