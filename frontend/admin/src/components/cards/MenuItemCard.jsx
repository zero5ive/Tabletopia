export default function MenuItemCard({ title, desc, price, status }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card menu-item-card">
        <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" 
             className="card-img-top" alt="메뉴 이미지"/>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{desc}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-primary fw-bold fs-5">{price}</span>
            <span className={`badge ${status === "판매중" ? "bg-success" : "bg-warning"} status-badge`}>
              {status}
            </span>
          </div>
          <div className="mt-3">
            <button className="btn btn-sm btn-outline-primary me-2">수정</button>
            <button className="btn btn-sm btn-outline-danger">삭제</button>
          </div>
        </div>
      </div>
    </div>
  )
}
