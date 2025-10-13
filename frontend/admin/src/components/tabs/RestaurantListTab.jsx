import { useEffect, useState } from "react";
import { getAllRestaurants, deleteRestaurant } from "../../api/restaurantApi";
import { Tab } from "bootstrap";

export default function RestaurantListTab({ onEdit, onSelectRestaurant, selectedRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const href = e.target.getAttribute("href");
      if (href === "#restaurant-list") {
        setSelectedId(null);
      }
    };
    document.addEventListener("shown.bs.tab", handler);
    return () => document.removeEventListener("shown.bs.tab", handler);
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error("매장 목록 로딩 실패:", error);
      alert("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();

    const handleRefresh = () => loadRestaurants();
    window.addEventListener("refreshRestaurantList", handleRefresh);
    return () => window.removeEventListener("refreshRestaurantList", handleRefresh);
  }, []);

  useEffect(() => {
    if (selectedRestaurant === null) {
      setSelectedId(null);
    }
  }, [selectedRestaurant]);

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteRestaurant(id);
        alert("삭제 완료!");
        loadRestaurants();
      } catch (error) {
        console.error("삭제 오류:", error);
        alert("삭제 중 문제가 발생했습니다.");
      }
    }
  };

  // ✨ 수정 버튼 클릭 시 — 렌더 반영 후 탭 전환되도록 setTimeout 사용
  const handleEdit = (restaurant) => {
    onEdit(restaurant);
    setTimeout(() => {
      const tabTrigger = document.querySelector('a[href="#restaurant-info"]');
      if (tabTrigger) {
        const tab = new Tab(tabTrigger);
        tab.show();
      }
    }, 0);
  };

  const handleSelect = (restaurant) => {
    setSelectedId(restaurant.id);
    onSelectRestaurant(restaurant);
  };

  if (loading) return <p className="text-center mt-4">불러오는 중...</p>;

  return (
    <div className="tab-pane fade" id="restaurant-list">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-list me-2"></i> 등록된 매장 목록
        </div>
        <div className="card-body">
          {restaurants.length === 0 ? (
            <p className="text-muted text-center">등록된 매장이 없습니다.</p>
          ) : (
            <>
              {selectedId && (
                <div className="alert alert-info py-2 mb-3">
                  <i className="fas fa-store me-2 text-primary"></i>
                  현재 선택된 매장:{" "}
                  <strong>
                    {restaurants.find((r) => r.id === selectedId)?.name || "이름 없음"}
                  </strong>
                </div>
              )}

              <table className="table table-striped text-center align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>매장명</th>
                    <th>주소</th>
                    <th>전화번호</th>
                    <th>설명</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((r) => (
                    <tr
                      key={r.id}
                      className={selectedId === r.id ? "table-primary" : ""}
                    >
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.address}</td>
                      <td>{r.phoneNumber}</td>
                      <td>{r.description}</td>
                      <td>
                        <button
                          className={`btn btn-sm me-2 ${
                            selectedId === r.id ? "btn-success" : "btn-secondary"
                          }`}
                          onClick={() => handleSelect(r)}
                        >
                          {selectedId === r.id ? "선택됨" : "선택"}
                        </button>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(r)}
                        >
                          수정
                        </button>

                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleDelete(r.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
