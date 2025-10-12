export default function MenuItemCard({ title, desc, price, status, image, onEdit, onDelete }) {
  return (
    <div
      className="card text-center shadow-sm"
      style={{
        width: "250px",
        height: "300px",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      <img
        src={image}
        alt="메뉴 이미지"
        className="card-img-top"
        style={{
          height: "150px",
          objectFit: "cover",
          backgroundColor: "#e9ecef",
        }}
      />
      <div className="card-body p-2">
        <h6 className="card-title text-truncate mb-1">{title}</h6>
        <p className="card-text text-muted small text-truncate">{desc}</p>

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-primary fw-bold">{price}</span>
          <span
            className={`badge ${
              status === "판매중" ? "bg-success" : "bg-warning text-dark"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={onEdit}
          >
            수정
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
