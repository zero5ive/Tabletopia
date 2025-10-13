import { useState, useEffect } from "react";
import { createRestaurant, updateRestaurant } from "../../api/restaurantApi";

export default function RestaurantInfoTab({
  selectedRestaurant,
  clearSelection,
  onSaved,
}) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    description: "",
    latitude: 0.0,
    longitude: 0.0,
    regionCode: "",
    restaurantCategory: { id: 1 },
    restaurantAccount: { id: 1 },
  });

  useEffect(() => {
    if (selectedRestaurant) {
      setFormData({
        ...selectedRestaurant,
        restaurantCategory: selectedRestaurant.restaurantCategory || { id: 1 },
        restaurantAccount: selectedRestaurant.restaurantAccount || { id: 1 },
      });
    } else {
      // 등록 탭 클릭 시 초기화
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        latitude: 0.0,
        longitude: 0.0,
        regionCode: "",
        restaurantCategory: { id: 1 },
        restaurantAccount: { id: 1 },
      });
    }
  }, [selectedRestaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  // ✅ 등록 / 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        restaurantCategory: { id: Number(formData.restaurantCategory.id) },
        restaurantAccount: { id: Number(formData.restaurantAccount.id) },
      };

      if (selectedRestaurant) {
        // 수정 모드
        await updateRestaurant(selectedRestaurant.id, dataToSend);
        alert("✅ 매장 정보가 수정되었습니다!");
        clearSelection?.();
        if (onSaved) setTimeout(() => onSaved(), 0);
      } else {
        // 등록 모드
        await createRestaurant(dataToSend);
        alert("✅ 매장이 등록되었습니다!");
        if (onSaved) setTimeout(() => onSaved(), 0);
      }
      const listTab = document.querySelector('a[href="#restaurant-list"]');
      if (listTab) {
        window.dispatchEvent(new Event("refreshRestaurantList")); 
        listTab.click();
      }


      // 폼 초기화
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        latitude: 0.0,
        longitude: 0.0,
        regionCode: "",
        restaurantCategory: { id: 1 },
        restaurantAccount: { id: 1 },
      });
    } catch (error) {
      console.error("❌ 서버 전송 오류:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="tab-pane fade" id="restaurant-info">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-store me-2"></i>
          {selectedRestaurant ? "매장 수정" : "매장 등록"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* 매장명 / 카테고리 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">매장명</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">음식 종류</label>
                <select
                  className="form-select"
                  name="restaurantCategory.id"
                  value={formData.restaurantCategory.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restaurantCategory: { id: e.target.value },
                    })
                  }
                >
                  <option value="1">일식</option>
                  <option value="2">한식</option>
                  <option value="3">중식</option>
                  <option value="4">양식</option>
                  <option value="5">기타</option>
                </select>
              </div>
            </div>

            {/* 주소 / 행정 구역 */}
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">주소</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">행정 구역 코드</label>
                <input
                  type="text"
                  name="regionCode"
                  className="form-control"
                  value={formData.regionCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 위도 / 경도 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">위도</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="latitude"
                  className="form-control"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">경도</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="longitude"
                  className="form-control"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">전화번호</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 매장 소개 */}
            <div className="mb-3">
              <label className="form-label">매장 소개</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {selectedRestaurant ? "수정하기" : "등록하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
