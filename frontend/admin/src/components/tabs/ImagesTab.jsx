export default function ImagesTab(){
  return (
    <div className="tab-pane fade" id="images">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-images me-2"></i>매장 이미지 관리
        </div>
        <div className="card-body">
          <div className="image-upload-area mb-4 text-center">
            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <h5>이미지 업로드</h5>
            <p className="text-muted">클릭하거나 파일을 드래그하여 업로드하세요</p>
            <button className="btn btn-outline-primary">파일 선택</button>
            <input type="file" className="d-none" multiple accept="image/*"/>
          </div>
          <h6>현재 업로드된 이미지</h6>
          <div className="row">
            {[1,2,3,4].map((id)=>(
              <div key={id} className="col-md-3 mb-3">
                <div className="card">
                  <img src="https://placehold.co/300x200/9ACD32/ffffff?text=Img" 
                       className="card-img-top" alt="매장 이미지"/>
                  <div className="card-body text-center p-2">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary">대표</button>
                      <button className="btn btn-outline-danger">삭제</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
