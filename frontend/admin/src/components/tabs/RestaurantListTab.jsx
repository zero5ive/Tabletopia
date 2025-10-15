import { useEffect, useState } from "react";
import { getAllRestaurants, deleteRestaurant } from "../../api/restaurantApi";
import { Tab } from "bootstrap";

export default function RestaurantListTab({ onEdit, onSelectRestaurant, selectedRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      console.log("레스토랑 리스트", res.data);
    } catch (error) {
      console.error("매장 목록 로딩 실패:", error);
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

  // 페이지 관련 계산
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = restaurants.slice(startIndex, startIndex + itemsPerPage);

  console.log("currentItems: " +currentItems);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                    <th>No</th>
                    <th>매장명</th>
                    <th>주소</th>
                    <th>전화번호</th>
                    <th>설명</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((r, index) => (
                    <tr key={r.id} className={selectedId === r.id ? "table-primary" : ""}>
                      <td>{startIndex + index + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.address}</td>
                      <td>{r.phoneNumber}</td>
                      <td>{r.description}</td>
                      <td>
                        <button
                          className={`btn btn-sm me-2 ${selectedId === r.id ? "btn-success" : "btn-secondary"
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

              {/* 페이지네이션 */}
              <nav>
                <ul className="pagination justify-content-center">

                  {/* 이전 버튼 */}
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  </li>

                  {/* 현재 페이지 기준 5개씩 묶어서 표시 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const groupStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
                      const groupEnd = Math.min(groupStart + 4, totalPages);
                      return page >= groupStart && page <= groupEnd;
                    })
                    .map((page) => (
                      <li
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                  {/* 다음 버튼 */}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  </li>

                </ul>
              </nav>

            </>
          )}
        </div>
      </div>
    </div>
  );
}