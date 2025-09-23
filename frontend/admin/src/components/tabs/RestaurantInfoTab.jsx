export default function RestaurantInfoTab(){
  return (
    <div className="tab-pane fade" id="restaurant-info">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-store me-2"></i>매장 기본 정보
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">매장명</label>
                <input type="text" className="form-control" defaultValue="정미스시"/>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">음식 종류</label>
                <select className="form-select">
                  <option>일식</option><option>한식</option><option>중식</option>
                  <option>양식</option><option>기타</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">주소</label>
              <input type="text" className="form-control" defaultValue="서울 강남구 압구정로 464-41"/>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">전화번호</label>
                <input type="tel" className="form-control" defaultValue="02-3446-8822"/>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">가격대</label>
                <select className="form-select" defaultValue="3-5만원">
                  <option>1만원 이하</option><option>1-3만원</option><option>3-5만원</option>
                  <option>5-10만원</option><option>10만원 이상</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">매장 소개</label>
              <textarea className="form-control" rows="4" 
                defaultValue="정통적인 일식을 기본으로 독창적인 스타일의 오마카세입니다."></textarea>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">테이블 수</label>
                <input type="number" className="form-control" defaultValue="12"/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">최대 수용 인원</label>
                <input type="number" className="form-control" defaultValue="48"/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">운영 상태</label>
                <select className="form-select" defaultValue="영업 중">
                  <option>영업 중</option><option>준비 중</option><option>휴무</option><option>임시 휴업</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
