import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SpecialHoursTab.css";

export default function SpecialHoursTab({ selectedRestaurant }) {
  const [specialHours, setSpecialHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDate, setNewDate] = useState(null);

  // ✅ 페이징
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!selectedRestaurant) return;
    loadSpecialHours();
  }, [selectedRestaurant]);

  const loadSpecialHours = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:10022/api/hours/special/${selectedRestaurant.id}`
      );
      const formatted = res.data.map((h) => ({
        ...h,
        openTime: h.openTime ? h.openTime.slice(0, 5) : "",
        closeTime: h.closeTime ? h.closeTime.slice(0, 5) : "",
      }));
      setSpecialHours(formatted.sort((a, b) => a.specialDate.localeCompare(b.specialDate)));
    } catch (err) {
      console.error("특별 운영시간 불러오기 실패:", err);
      alert("특별 운영시간을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    setSpecialHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // ✅ 날짜 추가 (타임존 보정)
  const handleAddDate = () => {
    if (!newDate) return alert("날짜를 선택해주세요.");

    // UTC 보정 (하루 밀림 방지)
    const offset = newDate.getTimezoneOffset() * 60000;
    const localDate = new Date(newDate.getTime() - offset);
    const formattedDate = localDate.toISOString().split("T")[0];

    if (specialHours.some((h) => h.specialDate === formattedDate))
      return alert("이미 추가된 날짜입니다.");

    setSpecialHours((prev) =>
      [...prev, {
        specialDate: formattedDate,
        openTime: "",
        closeTime: "",
        isClosed: false,
        specialInfo: "",
      }].sort((a, b) => a.specialDate.localeCompare(b.specialDate))
    );
    setNewDate(null);
  };

  // ✅ 삭제
  const handleDelete = (index) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setSpecialHours((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    const payload = specialHours.map((h) => ({
      ...h,
      openTime: h.isClosed ? null : h.openTime ? h.openTime + ":00" : null,
      closeTime: h.isClosed ? null : h.closeTime ? h.closeTime + ":00" : null,
    }));

    try {
      await axios.post(
        `http://localhost:10022/api/hours/special/${selectedRestaurant.id}`,
        payload
      );
      alert("특별 운영시간이 성공적으로 저장되었습니다.");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("특별 운영시간 저장 중 오류가 발생했습니다.");
    }
  };


  const totalPages = Math.ceil(specialHours.length / itemsPerPage);
  const currentItems = specialHours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!selectedRestaurant)
  return (
    <div className="tab-pane fade" id="special-hours">
      <div className="card text-center mt-4 border-danger">
        <div className="card-body py-5">
          <i className="fas fa-store-slash fa-3x text-danger mb-3"></i>
          <h5 className="text-danger fw-bold">매장이 선택되지 않았습니다</h5>
          <p className="text-muted mb-0">특별 운영시간을 관리하려면 먼저 매장을 선택해주세요.</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="tab-pane fade" id="special-hours">
      <div className="card special-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-calendar-day me-2"></i>
            {selectedRestaurant.name} 특별 운영시간 설정
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <i className="fas fa-save me-1"></i> 저장
          </button>
        </div>

        <div className="card-body">
          <div className="alert alert-info small mb-3">
            <i className="fas fa-info-circle me-2"></i>
            명절, 행사, 휴무일 등의 날짜별 운영시간을 별도로 지정할 수 있습니다.
          </div>

          <div className="d-flex mb-3 align-items-center">
            <DatePicker
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜 선택"
              className="form-control form-control-sm me-2"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleAddDate}
            >
              <i className="fas fa-plus me-1"></i> 날짜 추가
            </button>
          </div>

          {loading ? (
            <p className="text-center text-muted">불러오는 중...</p>
          ) : (
            <>
              <table className="table align-middle text-center special-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>휴무 여부</th>
                    <th>오픈 시간</th>
                    <th>마감 시간</th>
                    <th>비고</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((hour, idx) => {
                    const globalIdx =
                      (currentPage - 1) * itemsPerPage + idx;
                    return (
                      <tr
                        key={idx}
                        className={hour.isClosed ? "holiday-row" : "active-day"}
                      >
                        <td>{hour.specialDate}</td>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={hour.isClosed}
                            onChange={(e) =>
                              handleChange(globalIdx, "isClosed", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={hour.openTime || ""}
                            disabled={hour.isClosed}
                            onChange={(e) =>
                              handleChange(globalIdx, "openTime", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={hour.closeTime || ""}
                            disabled={hour.isClosed}
                            onChange={(e) =>
                              handleChange(globalIdx, "closeTime", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="예: 설날 단축영업"
                            value={hour.specialInfo || ""}
                            onChange={(e) =>
                              handleChange(globalIdx, "specialInfo", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(globalIdx)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination-wrapper mt-3 text-center">
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    이전
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
