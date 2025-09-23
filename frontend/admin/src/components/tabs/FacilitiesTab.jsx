export default function FacilitiesTab(){
  const facilities = [
    {icon:"fa-car", name:"발렛파킹", desc:"무료 발렛파킹 서비스 제공"},
    {icon:"fa-wheelchair", name:"휠체어 접근", desc:"휠체어 이용 가능"},
    {icon:"fa-wine-glass-alt", name:"주류 판매", desc:"다양한 주류 판매"},
    {icon:"fa-wifi", name:"무료 WiFi", desc:"고속 무료 인터넷"},
    {icon:"fa-birthday-cake", name:"기념일 서비스", desc:"생일, 기념일 케이크 서비스"},
    {icon:"fa-users", name:"단체석", desc:"10인 이상 단체 이용 가능"},
  ]
  return (
    <div className="tab-pane fade" id="facilities">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-cogs me-2"></i>편의시설 관리
        </div>
        <div className="card-body">
          <div className="row">
            {facilities.map(f=>(
              <div key={f.name} className="col-md-4 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className={`fas ${f.icon} fa-3x text-primary mb-3`}></i>
                    <h6>{f.name}</h6>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input className="form-check-input" type="checkbox" defaultChecked/>
                    </div>
                    <small className="text-muted">{f.desc}</small>
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
