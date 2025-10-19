import { useState, useEffect } from "react"
import { createRestaurant, updateRestaurant } from "../../api/RestaurantApi"
import AdminApi from "../../utils/AdminApi"
import "./RestaurantInfoTab.css"

export default function RestaurantInfoTab({ selectedRestaurant, clearSelection, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    description: "",
    latitude: 0.0,
    longitude: 0.0,
    regionCode: "",
    restaurantCategory: { id: 1 },
  })
  const [adminList, setAdminList] = useState([])
  const [adminPage, setAdminPage] = useState({ number: 0, totalPages: 1 })
  const [selectedAdmin, setSelectedAdmin] = useState("")
  const role = localStorage.getItem("adminRole")

  useEffect(() => {
    if (role === "SUPERADMIN") loadAdmins(adminPage.number)
  }, [adminPage.number])

  const loadAdmins = async (page = 0) => {
    try {
      const res = await AdminApi.get(`/api/admin/list?page=${page}&size=10`)
      const data = res.data
      const content = data.content || []
      const pageInfo = data.page || {}

      const number = typeof pageInfo.number === "number" ? pageInfo.number : 0
      const totalPages = typeof pageInfo.totalPages === "number" ? pageInfo.totalPages : 1

      setAdminList(content)
      setAdminPage({ number, totalPages })
    } catch (err) {
      console.error("관리자 목록 불러오기 실패:", err)
    }
  }

  useEffect(() => {
    if (selectedRestaurant) {
      setFormData({
        ...selectedRestaurant,
        restaurantCategory: selectedRestaurant.restaurantCategory || { id: 1 },
      })
    } else {
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        description: "",
        latitude: 0.0,
        longitude: 0.0,
        regionCode: "",
        restaurantCategory: { id: 1 },
      })
    }
  }, [selectedRestaurant])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: parseFloat(value) })
  }

  const handlePrevPage = () => {
    if (adminPage.number > 0) {
      setAdminPage((prev) => ({ ...prev, number: prev.number - 1 }))
    }
  }

  const handleNextPage = () => {
    if (adminPage.number < adminPage.totalPages - 1) {
      setAdminPage((prev) => ({ ...prev, number: prev.number + 1 }))
    }
  }

  const foodCategories = [
    { id: 1, name: "한식", icon: "🍚" },
    { id: 2, name: "중식", icon: "🥢" },
    { id: 3, name: "일식", icon: "🍣" },
    { id: 4, name: "양식", icon: "🍝" },
    { id: 5, name: "치킨", icon: "🍗" },
    { id: 6, name: "피자", icon: "🍕" },
    { id: 7, name: "카페", icon: "☕" },
    { id: 8, name: "분식", icon: "🍜" },
  ]

  const regions = [
    "서울", "경기", "강원", "충북", "충남",
    "전북", "전남", "경북", "경남", "제주"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (role !== "SUPERADMIN") {
        alert("매장 등록 권한이 없습니다.")
        return
      }

      const payload = {
        restaurant: {
          ...formData,
          restaurantCategory: { id: Number(formData.restaurantCategory.id) },
        },
        adminId: selectedAdmin,
      }

      if (!selectedAdmin) {
        alert("담당 관리자를 선택해주세요.")
        return
      }

      if (selectedRestaurant) {
        await updateRestaurant(selectedRestaurant.id, payload.restaurant)
        alert("매장 정보가 수정되었습니다.")
        clearSelection?.()
        onSaved?.()
      } else {
        await createRestaurant(payload)
        alert("매장이 등록되었습니다.")
        onSaved?.()
      }

      const listTab = document.querySelector('a[href="#restaurant-list"]')
      if (listTab) {
        window.dispatchEvent(new Event("refreshRestaurantList"))
        listTab.click()
      }
    } catch (error) {
      console.error("서버 전송 오류:", error)
      alert("저장 중 문제가 발생했습니다.")
    }
  }

  return (
    <div className="tab-pane fade" id="restaurant-info">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-store me-2"></i>
          {selectedRestaurant ? "매장 수정" : "매장 등록"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {role === "SUPERADMIN" && (
              <div className="mb-3">
                <label className="form-label">담당 관리자 선택</label>
                <select
                  className="form-select"
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  required
                >
                  <option value="">관리자를 선택하세요</option>
                  {adminList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handlePrevPage}
                    disabled={adminPage.number === 0}
                  >
                    이전
                  </button>
                  <span>
                    {(adminPage.number ?? 0) + 1} / {adminPage.totalPages ?? 1}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleNextPage}
                    disabled={adminPage.number >= adminPage.totalPages - 1}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            <div className="row mb-3">
              <div className="col-md-6">
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
            </div>

            <div className="mb-3">
              <label className="form-label">음식 종류 선택</label>
              <div className="category-grid">
                {foodCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    className={`category-btn ${formData.restaurantCategory.id === cat.id ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, restaurantCategory: { id: cat.id } })}
                  >
                    <span className="emoji">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">지역 선택</label>
              <div className="region-grid">
                {regions.map((region) => (
                  <button
                    type="button"
                    key={region}
                    className={`region-btn ${formData.regionCode === region ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, regionCode: region })}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">주소</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">위도</label>
                <input
                  type="number"
                  step="0.000001"
                  name="latitude"
                  className="form-control"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">경도</label>
                <input
                  type="number"
                  step="0.000001"
                  name="longitude"
                  className="form-control"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">전화번호</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-control"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">매장 소개</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {selectedRestaurant ? "수정하기" : "등록하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
