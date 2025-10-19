import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OperatingHoursTab.css";
import RestaurantApi from '../../api/RestaurantApi';

export default function OperatingHoursTab({ selectedRestaurant }) {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  useEffect(() => {
    if (!selectedRestaurant) return;
    loadOperatingHours();
  }, [selectedRestaurant]);

  const loadOperatingHours = async () => {
    setLoading(true);
    try {
      const res = await RestaurantApi.get(
        `/restaurants/${selectedRestaurant.id}/hours/opening`
      );

      if (res.data.length === 0) {
        const defaults = dayNames.map((_, idx) => ({
          dayOfWeek: idx,
          openTime: "",
          closeTime: "",
          isHoliday: true,
          breakStartTime: "",
          breakEndTime: "",
          reservationInterval: null,
        }));
        setHours(defaults);
      } else {
        const formatted = res.data.map((h) => ({
          ...h,
          openTime: h.openTime ? h.openTime.slice(0, 5) : "",
          closeTime: h.closeTime ? h.closeTime.slice(0, 5) : "",
          breakStartTime: h.breakStartTime ? h.breakStartTime.slice(0, 5) : "",
          breakEndTime: h.breakEndTime ? h.breakEndTime.slice(0, 5) : "",
          reservationInterval: h.reservationInterval ?? null,
        }));
        setHours(formatted);
      }
    } catch (err) {
      console.error("운영시간 불러오기 실패:", err);
      alert("운영시간 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    setHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    // 프론트 사전 유효성 검사
    for (const [i, h] of hours.entries()) {
      if (h.isHoliday) continue;

      if (!h.openTime || !h.closeTime) {
        alert(`${dayNames[h.dayOfWeek]}요일의 영업 시작/종료 시간을 입력해주세요.`);
        return;
      }

      if (h.openTime >= h.closeTime) {
        alert(`${dayNames[h.dayOfWeek]}요일의 영업 시작시간은 종료시간보다 빨라야 합니다.`);
        return;
      }

      if (h.breakStartTime && h.breakEndTime) {
        if (h.breakStartTime >= h.breakEndTime) {
          alert(`${dayNames[h.dayOfWeek]}요일의 브레이크 시작시간은 종료시간보다 빨라야 합니다.`);
          return;
        }
        if (h.breakStartTime < h.openTime || h.breakEndTime > h.closeTime) {
          alert(`${dayNames[h.dayOfWeek]}요일의 브레이크타임은 영업시간 범위 안에 있어야 합니다.`);
          return;
        }
      }
    }

    const payload = hours.map((h) => ({
      ...h,
      openTime: h.isHoliday ? null : h.openTime ? h.openTime + ":00" : null,
      closeTime: h.isHoliday ? null : h.closeTime ? h.closeTime + ":00" : null,
      breakStartTime: h.isHoliday ? null : h.breakStartTime ? h.breakStartTime + ":00" : null,
      breakEndTime: h.isHoliday ? null : h.breakEndTime ? h.breakEndTime + ":00" : null,
    }));

    try {
      await axios.post(
        `http://localhost:8002/api/admin/restaurants/${selectedRestaurant.id}/hours/opening`,
        payload,
        { withCredentials: true }
      );
      alert("운영시간이 성공적으로 저장되었습니다.");
    } catch (err) {
      console.error("저장 실패:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`서버 오류: ${err.response.data.message}`);
      } else {
        alert("운영시간 저장 중 오류가 발생했습니다.");
      }
    }
  };

  const handlePreview = async () => {
    if (!selectedRestaurant) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(
        `http://localhost:8002/api/admin/restaurants/${selectedRestaurant.id}/hours/effective`,
        { withCredentials: true }
      );
      setPreview(res.data);
    } catch (err) {
      console.error("영업 미리보기 실패:", err);
      alert("오늘의 영업시간을 불러올 수 없습니다.");
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="tab-pane fade" id="operating-hours">
        <div className="card text-center mt-4 border-danger">
          <div className="card-body py-5">
            <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
            <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
            <p className="text-muted mb-0">영업시간을 설정하려면 먼저 매장을 선택해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade" id="operating-hours">
      <div className="card operating-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-clock me-2"></i>
            {selectedRestaurant.name} 운영시간 설정
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={handlePreview}>
              <i className="fas fa-eye me-1"></i> 미리보기
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              <i className="fas fa-save me-1"></i> 저장
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <p className="text-center text-muted">불러오는 중...</p>
          ) : (
            <>
              {preview && (
                <div className="alert alert-info text-center">
                  <strong>{preview.date}</strong> 기준<br />
                  {preview.isClosed
                    ? "휴무"
                    : `${preview.openTime} ~ ${preview.closeTime}`}
                </div>
              )}

              <table className="table operating-hours-table align-middle">
                <thead>
                  <tr>
                    <th>요일</th>
                    <th>운영 여부</th>
                    <th>오픈 시간</th>
                    <th>마감 시간</th>
                    <th>브레이크 시작</th>
                    <th>브레이크 종료</th>
                    <th>예약 간격</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hour, idx) => (
                    <tr
                      key={idx}
                      className={hour.isHoliday ? "holiday-row" : "active-day"}
                    >
                      <td className="fw-bold">{dayNames[hour.dayOfWeek]}요일</td>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={!hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "isHoliday", !e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={hour.openTime || ""}
                          disabled={hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "openTime", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={hour.closeTime || ""}
                          disabled={hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "closeTime", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={hour.breakStartTime || ""}
                          disabled={hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "breakStartTime", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={hour.breakEndTime || ""}
                          disabled={hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "breakEndTime", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={hour.reservationInterval || ""}
                          disabled={hour.isHoliday}
                          onChange={(e) =>
                            handleChange(idx, "reservationInterval", e.target.value)
                          }
                        >
                          <option value="">-- 선택 --</option>
                          <option value="5">5분</option>
                          <option value="10">10분</option>
                          <option value="15">15분</option>
                          <option value="20">20분</option>
                          <option value="30">30분</option>
                          <option value="60">60분</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
