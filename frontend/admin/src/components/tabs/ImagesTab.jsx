import { useEffect, useState, useRef } from "react"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin/restaurants`,
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

export default function ImagesTab({ selectedRestaurant }) {
  const [images, setImages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 8
  const fileInputRef = useRef()

  useEffect(() => {
    if (selectedRestaurant) {
      loadImages()
    } else {
      setImages([])
    }
  }, [selectedRestaurant])

  const loadImages = async () => {
    if (!selectedRestaurant) return
    setLoading(true)
    try {
      const res = await api.get(`/${selectedRestaurant.id}/images`)
      setImages(res.data)
    } catch (err) {
      console.error("이미지 목록 로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return
    const formData = new FormData()
    for (let file of files) formData.append("files", file)
    try {
      setLoading(true)
      await api.post(`/${selectedRestaurant.id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      await loadImages()
    } catch (err) {
      console.error("이미지 업로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => uploadFiles(e.target.files)

  const handleSetMain = async (id) => {
    try {
      await api.put(`/${selectedRestaurant.id}/images/${id}/main`)
      loadImages()
    } catch (err) {
      console.error("대표 이미지 설정 실패:", err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return
    try {
      await api.delete(`/${selectedRestaurant.id}/images/${id}`)
      loadImages()
    } catch (err) {
      console.error("이미지 삭제 실패:", err)
    }
  }

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="images">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">이미지를 관리하려면 먼저 매장을 선택해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(images.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentImages = images.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div
      className="tab-pane fade"
      id="images"
      style={{
        minHeight: "calc(100vh - 150px)",
        background: "#f8f9fa",
        display: "block",
        padding: "20px",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ padding: "10px 20px 0" }}
      >
        <h4 className="m-0">{selectedRestaurant.name} 이미지 관리</h4>
        <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}>
          <i className="fas fa-plus me-1"></i> 이미지 추가
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="d-none"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div
        className="image-upload-area text-center mt-3 p-3 border border-2 border-secondary-subtle rounded"
        style={{
          cursor: "pointer",
          background: "#fff",
          maxWidth: "500px",
          margin: "20px auto",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.style.background = "#e9f7ef"
          e.currentTarget.style.borderColor = "#28a745"
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.background = "#fff"
          e.currentTarget.style.borderColor = "#dee2e6"
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.style.background = "#fff"
          e.currentTarget.style.borderColor = "#dee2e6"
          uploadFiles(e.dataTransfer.files)
        }}
      >
        <i className="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
        <h6 className="fw-bold">이미지 업로드</h6>
        <p className="text-muted small mb-0">클릭하거나 파일을 드래그하여 업로드하세요</p>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">로딩 중...</p>
        </div>
      ) : (
        <>
          <div
            className="image-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              padding: "10px 30px 0",
            }}
          >
            {currentImages.length === 0 ? (
              <p className="text-center text-muted mt-3">등록된 이미지가 없습니다.</p>
            ) : (
              currentImages.map((img) => (
                <div key={img.id} className="card shadow-sm">
                  <img
                    src={`http://localhost:8002/uploads/restaurants/${img.imageUrl}`}
                    alt="매장 이미지"
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center p-2">
                    <div className="btn-group btn-group-sm">
                      <button
                        className={`btn ${img.isMain ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleSetMain(img.id)}
                      >
                        대표
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(img.id)}
                      >
                        삭제
                      </button>
                    </div>
                    {img.isMain && <span className="badge bg-primary mt-2">대표 이미지</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  &lsaquo;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const groupStart = Math.floor((currentPage - 1) / 5) * 5 + 1
                  const groupEnd = groupStart + 4
                  return page >= groupStart && page <= groupEnd
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
        </>
      )}
    </div>
  )
}
