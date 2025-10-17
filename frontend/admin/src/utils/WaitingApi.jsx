import axios from "axios";

const URL="http://localhost:8002/api/admin/waitings";

// 웨이팅 오픈 상태 조회
export const getWaitingStatus = (restaurantId) =>
    axios.get(`${URL}/status?restaurantId=${restaurantId}`);

//웨이팅 리스트 페이징 처리
export const getWaitingList = (restaurantId, page = 0, size = 10, status = 'WAITING') => 
  axios.get(`${URL}/${restaurantId}?status=${status}&page=${page}&size=${size}`);


//웨이팅 취소
export const waitingCancel = (id, restaurantId) =>
    axios.put(`${URL}/${id}/cancel?restaurantId=${restaurantId}`)

//웨이팅 호출
export const waitingCall = (id, restaurantId) =>
    axios.put(`${URL}/${id}/called?restaurantId=${restaurantId}`)

//웨이팅 착석
export const waitingSeated = (id, restaurantId) =>
    axios.put(`${URL}/${id}/seated?restaurantId=${restaurantId}`)

