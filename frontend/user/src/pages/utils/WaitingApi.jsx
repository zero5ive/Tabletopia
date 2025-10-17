import axios from "axios";

const URL="http://localhost:8002/api/user/waitings";

// 웨이팅 오픈 상태 조회
export const getWaitingStatus = (restaurantId) =>
    axios.get(`${URL}/status?restaurantId=${restaurantId}`);

//리스트 조회
export const getWaitingList=(restaurantId, status = 'WAITING', size = 1000)=>
    axios.get(`${URL}/${restaurantId}?status=${status}&size=${size}`); //웨이팅 리스트

// 사용자의 웨이팅 내역 조회
export const getUserWaitingList = (userId, page = 0, size = 10) =>
    axios.get(`${URL}/user/${userId}?page=${page}&size=${size}`);

//웨이팅 대기 취소
export const waitingCancel = (id, restaurantId) =>
    axios.put(`${URL}/${id}/cancel?restaurantId=${restaurantId}`)