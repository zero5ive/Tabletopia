import { useState } from "react";
import { createMenu } from "../../api/MenuApi";

export default function AddMenuModal({ restaurantId, onSuccess }) {
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isSoldout: false,
    image: null,
    imagePreview: "",
  });

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
    // ✅ boolean은 문자열로 변환해야 Spring이 잘 받음
    formData.append("isSoldout", menuData.isSoldout ? "true" : "false");
    if (menuData.image) {
      formData.append("image", menuData.image);
    }

    try {
      await createMenu(restaurantId, formData);
      alert("✅ 메뉴가 등록되었습니다!");
      onSuccess?.();
      document.getElementById("addMenuModalClose").click();
    } catch (err) {
      console.error("❌ 메뉴 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
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
              메뉴 추가
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
                  type="file"
                  accept="image/*"
                  className="form-control mt-3"
                  onChange={handleImageChange}
                />
              </div>

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

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                닫기
              </button>
              <button type="submit" className="btn btn-primary">
                추가
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
