import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  withCredentials: true, // 세션 쿠키 전송 필수
});

// 신규 레스토랑 등록
export const createRestaurant = (data) => api.post("/restaurants", data);

// 전체 레스토랑 조회 (관리자 전체)
export const getAllRestaurants = () => api.get("/restaurants");

// 로그인한 관리자 본인 소유 레스토랑만 조회
export const getMyRestaurants = () => api.get("/restaurants/my");

// 단일 레스토랑 조회
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);

// 레스토랑 정보 수정
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);

// 레스토랑 삭제
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

export default api;
