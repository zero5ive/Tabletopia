export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className={`card stats-card ${color} h-100`}>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <div className="text-white-75 small">{title}</div>
              <div className="h2 mb-0 font-weight-bold text-white">{value}</div>
            </div>
            <div className="col-auto">
              <i className={`fas ${icon} fa-2x text-white-25`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
