export default function OperatingHoursTab(){
  return (
    <div className="tab-pane fade" id="operating-hours">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-clock me-2"></i>운영 시간 설정
        </div>
        <div className="card-body">
          <table className="table operating-hours-table">
            <thead>
              <tr>
                <th>요일</th><th>운영여부</th><th>오픈시간</th>
                <th>마감시간</th><th>라스트오더</th><th>브레이크타임</th>
              </tr>
            </thead>
            <tbody>
              {["월","화","수","목","금","토","일"].map(day=>(
                <tr key={day}>
                  <td className="fw-bold">{day}요일</td>
                  <td><input className="form-check-input" type="checkbox" defaultChecked/></td>
                  <td><input type="time" className="form-control form-control-sm" defaultValue="17:30"/></td>
                  <td><input type="time" className="form-control form-control-sm" defaultValue="23:00"/></td>
                  <td><input type="time" className="form-control form-control-sm" defaultValue="22:00"/></td>
                  <td><input type="text" className="form-control form-control-sm" placeholder="15:00-17:00"/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <h6>추가 설정</h6>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">휴무일</label>
                <input type="text" className="form-control" defaultValue="연중무휴"/>
              </div>
              <div className="col-md-6">
                <label className="form-label">예약 정책</label>
                <select className="form-select" defaultValue="1일 전 예약 필수">
                  <option>당일 예약 가능</option><option>1일 전 예약 필수</option>
                  <option>2일 전 예약 필수</option><option>3일 전 예약 필수</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
