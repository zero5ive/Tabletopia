import { useEffect, useState } from "react";
import { createMenu, updateMenu } from "../../api/MenuApi";

export default function AddMenuModal({ restaurantId, onSuccess, editTarget }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isSoldout: false,
    image: null,
    imagePreview: "",
  });

  // 수정 모드일 경우 기존 데이터 채우기
  useEffect(() => {
    if (editTarget) {
      setMenuData({
        name: editTarget.name || "",
        description: editTarget.description || "",
        price: editTarget.price || "",
        category: editTarget.category || "",
        isSoldout: editTarget.isSoldout || false,
        image: null,
        imagePreview: editTarget.imageFilename
          ? `${API_BASE_URL}/uploads/menus/${editTarget.imageFilename}`
          : "",
      });
    } else {
      resetForm();
    }
  }, [editTarget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData({ ...menuData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuData({
        ...menuData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("description", menuData.description);
    formData.append("price", Number(menuData.price));
    formData.append("category", menuData.category);
    // ✅ boolean 그대로 append
    formData.append("isSoldout", menuData.isSoldout);
    if (menuData.image) {
      formData.append("image", menuData.image);
    }

    try {
      if (editTarget) {
        await updateMenu(restaurantId, editTarget.id, formData);
        alert("메뉴가 수정되었습니다!");
      } else {
        await createMenu(restaurantId, formData);
        alert("새 메뉴가 등록되었습니다!");
      }

      // 모달 닫기
      document.getElementById("addMenuModalClose").click();
      onSuccess?.();
      resetForm();
    } catch (err) {
      console.error("메뉴 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setMenuData({
      name: "",
      description: "",
      price: "",
      category: "",
      isSoldout: false,
      image: null,
      imagePreview: "",
    });
    const fileInput = document.getElementById("menuImageInput");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div
      className="modal fade"
      id="addMenuModal"
      tabIndex="-1"
      aria-labelledby="addMenuModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addMenuModalLabel">
              {editTarget ? "메뉴 수정" : "메뉴 추가"}
            </h5>
            <button
              type="button"
              className="btn-close"
              id="addMenuModalClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="modal-body row">
              {/* 왼쪽 - 이미지 미리보기 */}
              <div className="col-md-5 d-flex flex-column align-items-center">
                <div className="border rounded p-2 w-100 text-center">
                  {menuData.imagePreview ? (
                    <img
                      src={menuData.imagePreview}
                      alt="미리보기"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div
                      className="bg-light text-muted d-flex justify-content-center align-items-center"
                      style={{ height: "200px" }}
                    >
                      이미지 미리보기
                    </div>
                  )}
                </div>
                <input
                  id="menuImageInput"
                  type="file"
                  accept="image/*"
                  className="form-control mt-3"
                  onChange={handleImageChange}
                />
              </div>

              {/* 오른쪽 - 입력폼 */}
              <div className="col-md-7">
                <div className="mb-3">
                  <label className="form-label">메뉴 이름</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={menuData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">설명</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={menuData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">가격</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={menuData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">카테고리</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={menuData.category}
                    onChange={handleChange}
                    placeholder="예: 메인 / 사이드 / 음료"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">판매 상태</label>
                  <select
                    className="form-select"
                    name="isSoldout"
                    value={menuData.isSoldout ? "true" : "false"}
                    onChange={(e) =>
                      setMenuData({
                        ...menuData,
                        isSoldout: e.target.value === "true",
                      })
                    }
                  >
                    <option value="false">판매중</option>
                    <option value="true">품절</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                닫기
              </button>
              <button type="submit" className="btn btn-primary">
                {editTarget ? "수정 완료" : "추가"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
