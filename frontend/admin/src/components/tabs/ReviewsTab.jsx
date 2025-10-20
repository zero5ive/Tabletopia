import { useEffect, useState } from "react"
import axios from "axios"

export default function ReviewsTab({ selectedRestaurant }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedRestaurant) loadReviews()
    else setReviews([])
  }, [selectedRestaurant])

  const loadReviews = async () => {
    if (!selectedRestaurant) return
    setLoading(true)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
      const res = await axios.get(`${API_BASE_URL}/api/user/restaurants/${selectedRestaurant.id}/reviews`)
      console.log('리뷰 API 응답:', res.data)

      // 응답이 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
      if (Array.isArray(res.data)) {
        setReviews(res.data)
      } else if (res.data && Array.isArray(res.data.content)) {
        // 페이징 응답인 경우 content 배열 사용
        setReviews(res.data.content)
      } else {
        console.warn('예상하지 못한 응답 형태:', res.data)
        setReviews([])
      }
    } catch (err) {
      console.error("리뷰 목록 로드 실패:", err)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="reviews">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">리뷰를 보려면 먼저 매장을 선택해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="tab-pane fade"
      id="reviews"
      style={{
        minHeight: "calc(100vh - 150px)",
        background: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">{selectedRestaurant.name} 리뷰 목록</h4>
        <button className="btn btn-outline-secondary" onClick={loadReviews}>
          새로고침
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">로딩 중...</p>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-muted mt-3">등록된 리뷰가 없습니다.</p>
      ) : (
        <div className="list-group">
          {reviews.map((r) => (
            <div key={r.id} className="list-group-item">
              <div className="fw-bold">
                ⭐ {r.rating}점 <span className="text-muted ms-2">({r.sourceType})</span>
              </div>
              <div className="text-muted small mb-2">작성일: {r.createdAt}</div>
              <p className="mb-0">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
