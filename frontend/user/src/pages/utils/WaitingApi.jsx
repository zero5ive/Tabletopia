import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/user/waiting`,
  withCredentials: true, // JWT 토큰 전송
});

// 웨이팅 오픈 상태 조회
export const getWaitingStatus = (restaurantId) =>
    api.get(`/status?restaurantId=${restaurantId}`);

//리스트 조회 (관리자용 - 사용자는 사용하지 않을 것으로 예상)
export const getWaitingList=(restaurantId, status = 'WAITING', size = 1000)=>
    axios.get(`${API_BASE_URL}/api/admin/restaurants/${restaurantId}/waiting?status=${status}&size=${size}`);

// 사용자의 웨이팅 내역 조회
export const getUserWaitingList = (page = 0, size = 10) => {
    console.log('getUserWaitingList 호출:', { page, size });
    const token = localStorage.getItem('accessToken');
    return api.get(`/history?page=${page}&size=${size}`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
};

//웨이팅 대기 취소
export const waitingCancel = (id, restaurantId) => {
    const token = localStorage.getItem('accessToken');
    return axios.put(`${API_BASE_URL}/api/user/waitings/${id}/cancel?restaurantId=${restaurantId}`, null, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
}

//웨이팅 상태 조회
export const getWaitingStatusMy = () => {
    const token = localStorage.getItem('accessToken');
    return api.get(`/history?page=0&size=1`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
}

// 웨이팅 미루기 등록
export const delayWaiting = (waitingId, targetNumber, restaurantId) => {
    const token = localStorage.getItem('accessToken');
    return axios.put(
        `${API_BASE_URL}/api/user/waitings/${waitingId}/delay`,
        null,  // body는 null
        {
            params: {
                targetNumber: targetNumber,
                restaurantId: restaurantId
            },
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        }
    );
}


//웨이팅 미루기 조회
export const getDelayOptions = (waitingId, restaurantId) => {
    const token = localStorage.getItem('accessToken');
    return axios.get(
        `${API_BASE_URL}/api/user/waitings/${waitingId}/delay`,
        {
            params: { restaurantId },
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        }
    );
}