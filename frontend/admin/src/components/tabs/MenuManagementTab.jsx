import { useEffect, useState } from "react";
import { getMenusByRestaurant, deleteMenu } from "../../api/MenuApi";
import MenuItemCard from "../cards/MenuItemCard";
import AddMenuModal from "../modals/AddMenuModal";

/* ✅ 탭 전환 이벤트 훅 */
function useBootstrapTabShown(tabId, callback) {
  useEffect(() => {
    const handler = (e) => {
      const href =
        e.target.getAttribute("data-bs-target") ||
        e.target.getAttribute("href");
      if (href === `#${tabId}`) {
        setTimeout(callback, 150); // 탭 전환 완료 후 약간의 딜레이
      }
    };
    document.addEventListener("shown.bs.tab", handler);
    return () => document.removeEventListener("shown.bs.tab", handler);
  }, [tabId, callback]);
}

export default function MenuManagementTab({ selectedRestaurant }) {
  const [menus, setMenus] = useState([]);
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

  const handleDelete = async (menuId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteMenu(selectedRestaurant.id, menuId);
        alert("삭제 완료!");
        loadMenus();
      } catch (err) {
        console.error("❌ 삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 탭 표시 후 레이아웃 복구
  useBootstrapTabShown("menu-management", () => {
    window.dispatchEvent(new Event("resize"));
  });

  useEffect(() => {
    if (selectedRestaurant) {
      loadMenus();
    }
  }, [selectedRestaurant]);

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="menu-management">
        <p className="text-center mt-3 text-muted">
          먼저 매장을 선택해주세요.
        </p>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = menus.slice(indexOfFirstItem, indexOfLastItem);
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
        padding: "20px"
      }}
    >
      {/* 헤더 */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          padding: "10px 20px 0",
          flexShrink: 0,
        }}
      >
        <h4 className="m-0">{selectedRestaurant.name} 메뉴 관리</h4>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addMenuModal"
        >
          <i className="fas fa-plus me-1"></i> 메뉴 추가
        </button>
      </div>

      {/* 메뉴 카드 그리드 */}
      <div
        className="menu-grid"
        style={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "14px 18px",
          justifyItems: "center",
          alignContent: "center",
          padding: "10px 30px 0",
          overflow: "hidden",
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
                  ? `http://localhost:10022/uploads/menus/${menu.imageFilename}`
                  : "https://placehold.co/300x180/9ACD32/ffffff?text=Img"
              }
              onDelete={() => handleDelete(menu.id)}
            />
          ))
        )}
      </div>

      {/* ✅ 페이징 */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          marginBottom: "15px",
          background: "#fff",
          borderRadius: "8px",
          padding: "4px 12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          alignSelf: "center",
        }}
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={{
            border: "none",
            background: "transparent",
            color: currentPage === 1 ? "#ccc" : "#333",
            fontSize: "15px",
            cursor: currentPage === 1 ? "default" : "pointer",
          }}
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              border: "none",
              borderRadius: "5px",
              padding: "3px 9px",
              background: currentPage === i + 1 ? "#007bff" : "transparent",
              color: currentPage === i + 1 ? "#fff" : "#333",
              fontSize: "13px",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          style={{
            border: "none",
            background: "transparent",
            color: currentPage === totalPages ? "#ccc" : "#333",
            fontSize: "15px",
            cursor: currentPage === totalPages ? "default" : "pointer",
          }}
        >
          ›
        </button>
      </div>

      <AddMenuModal
        restaurantId={selectedRestaurant.id}
        onSuccess={loadMenus}
      />
    </div>
  );
}
