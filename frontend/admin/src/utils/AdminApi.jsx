import axios from 'axios';

// Axios 인스턴스 생성
const AdminApi = axios.create({
    baseURL: 'http://localhost:8002', // 기본 URL 설정
    withCredentials: true // ⭐ 세션 쿠키 포함
});

// 요청 인터셉터
AdminApi.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default AdminApi;
