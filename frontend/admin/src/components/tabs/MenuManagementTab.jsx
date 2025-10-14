import { useEffect, useState } from "react";
import { getMenusByRestaurant, deleteMenu } from "../../api/MenuApi";
import MenuItemCard from "../cards/MenuItemCard";
import AddMenuModal from "../modals/AddMenuModal";

export default function MenuManagementTab({ selectedRestaurant }) {
  const [menus, setMenus] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadMenus = async () => {
    if (!selectedRestaurant) return;
    try {
      const res = await getMenusByRestaurant(selectedRestaurant.id);
      setMenus(res.data);
    } catch (err) {
      console.error("❌ 메뉴 불러오기 실패:", err);
      alert("메뉴를 불러오지 못했습니다.");
    }
  };

  // 메뉴 삭제
  const handleDelete = async (menuId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteMenu(selectedRestaurant.id, menuId);
        alert("삭제 완료!");
        loadMenus();
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEdit = (menu) => {
    setEditTarget(menu);
    setTimeout(() => {
      const modalEl = document.getElementById("addMenuModal");
    }, 300);

    // React DOM이 업데이트된 뒤 안전하게 모달 열기
    setTimeout(async () => {
      const modalEl = document.getElementById("addMenuModal");
      if (!modalEl) {
        console.error("❌ 모달 요소(addMenuModal)를 찾을 수 없습니다.");
        return;
      }

      // 동적으로 bootstrap import (확실하게 연결됨)
      const { Modal } = await import("bootstrap");
      let modal = Modal.getInstance(modalEl);
      if (!modal) modal = new Modal(modalEl, { backdrop: "static" });
      modal.show();
    }, 200);
  };

  // 탭 전환 시 레이아웃 갱신
  useEffect(() => {
    const handler = (e) => {
      const href =
        e.target.getAttribute("data-bs-target") ||
        e.target.getAttribute("href");
      if (href === "#menu-management") {
        setTimeout(() => window.dispatchEvent(new Event("resize")), 150);
      }
    };
    document.addEventListener("shown.bs.tab", handler);
    return () => document.removeEventListener("shown.bs.tab", handler);
  }, []);

  // 매장 변경 시 메뉴 다시 불러오기
  useEffect(() => {
    if (selectedRestaurant) loadMenus();
  }, [selectedRestaurant]);

  // 매장이 없을 때
  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="menu-management">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">메뉴를 관리하려면 먼저 매장을 선택해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  // 페이지 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentMenus = menus.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(menus.length / itemsPerPage) || 1;

  return (
    <div
      className="tab-pane fade"
      id="menu-management"
      style={{
        minHeight: "calc(100vh - 150px)",
        background: "#f8f9fa",
        display: "block",
        overflowY: "auto",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      {/* 헤더 */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ padding: "10px 20px 0" }}
      >
        <h4 className="m-0">{selectedRestaurant.name} 메뉴 관리</h4>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addMenuModal"
          onClick={() => setEditTarget(null)}
        >
          <i className="fas fa-plus me-1"></i> 메뉴 추가
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <div
        className="menu-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px 18px",
          padding: "10px 30px 0",
        }}
      >
        {currentMenus.length === 0 ? (
          <p className="text-center text-muted">등록된 메뉴가 없습니다.</p>
        ) : (
          currentMenus.map((menu) => (
            <MenuItemCard
              key={menu.id}
              title={menu.name}
              desc={menu.description}
              price={`${menu.price.toLocaleString()}원`}
              status={menu.isSoldout ? "품절" : "판매중"}
              image={
                menu.imageFilename
                  ? `http://localhost:8002/uploads/menus/${menu.imageFilename}`
                  : "https://placehold.co/300x180/9ACD32/ffffff?text=Img"
              }
              onDelete={() => handleDelete(menu.id)}
              onEdit={() => handleEdit(menu)}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 (‹ ›만 사용, 디자인 통일 버전) */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              &lsaquo;
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const groupStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
              const groupEnd = groupStart + 4;
              return page >= groupStart && page <= groupEnd;
            })
            .map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              &rsaquo;
            </button>
          </li>
        </ul>
      </nav>



      {/* 모달 */}
      <AddMenuModal
        restaurantId={selectedRestaurant.id}
        onSuccess={loadMenus}
        editTarget={editTarget}
      />
    </div>
  );
}
