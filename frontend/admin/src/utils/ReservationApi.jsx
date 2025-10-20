import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8002/api/admin",
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

// 예약 목록 조회
export const getReservations = (restaurantId) =>
    api.get(`/restaurants/${restaurantId}/reservations`)

// 타임슬롯 조회
export const getTimeSlots = (restaurantId, date) =>
  api.get(`/restaurants/${restaurantId}/time-slots`, {
    params: { date }
  });
