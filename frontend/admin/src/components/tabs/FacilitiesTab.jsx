import { useEffect, useState } from "react";
import axios from "axios";

export default function FacilitiesTab({ selectedRestaurant }) {
  const [facilities, setFacilities] = useState([]);
  const [checkedFacilities, setCheckedFacilities] = useState({});

  useEffect(() => {
    if (!selectedRestaurant) return;
    loadFacilities();
  }, [selectedRestaurant]);

  const loadFacilities = async () => {
    const [allRes, assignedRes] = await Promise.all([
      axios.get("http://localhost:8002/api/facilities"),
      axios.get(`http://localhost:8002/api/facilities/${selectedRestaurant.id}`)
    ]);

    setFacilities(allRes.data);

    const assigned = {};
    assignedRes.data.forEach(f => assigned[f.facilityId] = true);
    setCheckedFacilities(assigned);
  };

  const toggleFacility = async (facilityId) => {
    const isChecked = !checkedFacilities[facilityId];
    setCheckedFacilities(prev => ({ ...prev, [facilityId]: isChecked }));

    if (isChecked) {
      await axios.post(`http://localhost:8002/api/facilities/${selectedRestaurant.id}`, { facilityId });
    } else {
      await axios.delete(`http://localhost:8002/api/facilities/${selectedRestaurant.id}/${facilityId}`);
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="facilities">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">편의시설을 관리하려면 먼저 매장을 선택해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="facilities">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-cogs me-2"></i>편의시설 관리
        </div>
        <div className="card-body">
          {facilities.length === 0 ? (
            <p className="text-center text-muted mt-3">등록된 편의시설이 없습니다.</p>
          ) : (
            <div className="row">
              {facilities.map(f => (
                <div key={f.id} className="col-md-3 mb-3">
                  <div className="card text-center p-2">
                    <i className="fas fa-check-circle fa-2x text-primary mb-2"></i>
                    <h6>{f.name}</h6>
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!checkedFacilities[f.id]}
                        onChange={() => toggleFacility(f.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
