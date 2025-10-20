import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
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
