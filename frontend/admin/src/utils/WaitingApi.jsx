import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

// 웨이팅 오픈 상태 조회
export const getWaitingStatus = (restaurantId) =>
    api.get(`/user/waiting/status?restaurantId=${restaurantId}`);

//웨이팅 리스트 페이징 처리 (관리자용)
export const getWaitingList = (restaurantId, page = 0, size = 10, status = 'WAITING') =>
  api.get(`/admin/restaurants/${restaurantId}/waiting?status=${status}&page=${page}&size=${size}`);


//웨이팅 취소 (관리자용)
export const waitingCancel = (id, restaurantId) =>
    api.put(`/admin/waiting/${id}/cancel?restaurantId=${restaurantId}`)

//웨이팅 호출
export const waitingCall = (id, restaurantId) =>
    api.put(`/admin/waiting/${id}/called?restaurantId=${restaurantId}`)

//웨이팅 착석
export const waitingSeated = (id, restaurantId) =>
    api.put(`/admin/waiting/${id}/seated?restaurantId=${restaurantId}`)

