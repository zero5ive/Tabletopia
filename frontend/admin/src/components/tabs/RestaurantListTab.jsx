import { useEffect, useState } from "react";
import { getAllRestaurants, deleteRestaurant } from "../../api/restaurantApi";
import { Tab } from "bootstrap";

export default function RestaurantListTab({ onEdit }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 매장 목록 불러오기 함수
  const loadRestaurants = async () => {
    try {
      const res = await getAllRestaurants();
      setRestaurants(res.data);
    } catch (error) {
      console.error("❌ 매장 목록 로딩 실패:", error);
      alert("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 최초 로드 및 refresh 이벤트 감지
  useEffect(() => {
    loadRestaurants();

    const handleRefresh = () => loadRestaurants();

    window.addEventListener("refreshRestaurantList", handleRefresh);
    return () => window.removeEventListener("refreshRestaurantList", handleRefresh);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteRestaurant(id);
        alert("삭제 완료!");
        loadRestaurants();
      } catch (error) {
        console.error("❌ 삭제 오류:", error);
        alert("삭제 중 문제가 발생했습니다.");
      }
    }
  };

  const handleEdit = (restaurant) => {
    onEdit(restaurant);

    // Bootstrap의 탭 전환 API 직접 호출
    const tabTrigger = document.querySelector('a[href="#restaurant-info"]');
    if (tabTrigger) {
      const tab = new Tab(tabTrigger);
      tab.show();
    }
  };

  if (loading) return <p className="text-center mt-4">⏳ 불러오는 중...</p>;

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
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.address}</td>
                    <td>{r.phoneNumber}</td>
                    <td>{r.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(r)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
