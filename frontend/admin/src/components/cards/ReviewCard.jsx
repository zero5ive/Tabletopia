export default function ReviewCard({ user, score, content, date }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" 
                 style={{width: '50px', height: '50px'}}>
              {user.charAt(0)}
            </div>
            <div>
              <h6 className="mb-1">{user}</h6>
              <div className="text-warning mb-2">
                {"⭐".repeat(score)}{"☆".repeat(5 - score)}
              </div>
              <p className="mb-2">{content}</p>
              <small className="text-muted">{date}</small>
            </div>
          </div>
          <div className="dropdown">
            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
              관리
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">답글 작성</a></li>
              <li><a className="dropdown-item" href="#">숨기기</a></li>
              <li><a className="dropdown-item text-danger" href="#">신고</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
