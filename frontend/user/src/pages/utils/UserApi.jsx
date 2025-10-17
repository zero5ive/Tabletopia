import axios from 'axios';

// Axios 인스턴스 생성
const UserApi = axios.create({
    baseURL: 'http://localhost:8002' // 기본 URL 설정
});

// 요청 인터셉터 (요청을 보내기 전에 실행)
UserApi.interceptors.request.use(
    config => {
        // localStorage에서 accessToken 가져오기
        const token = localStorage.getItem('accessToken');

        // 토큰이 존재하면 Authorization 헤더에 추가
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//현재 로그인한 유저 정보 조회
export const getCurrentUser = () =>
    api.get('/api/user/me')

//마이페이지 유저정보 업데이트
export const updateUser = (userData) =>
    api.put(`/api/user/update`, userData)

export default UserApi
