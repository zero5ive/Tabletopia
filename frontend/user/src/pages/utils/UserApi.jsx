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
    UserApi.get('/api/user/auth/me')

//마이페이지 유저정보 업데이트
export const updateUser = (userData) =>
    UserApi.put(`/api/user/profile/update`, userData)

// 유저 예약 생성
export const createReservation = (reservationData) =>
    UserApi.post('/api/user/reservations', reservationData);

// 결제 처리
export const processPayment = (paymentData) =>
    UserApi.post('/api/user/payment', paymentData);

// 결제 최종 승인
export const confirmPayment = (confirmationData) =>
    UserApi.post('/api/user/payment/confirm', confirmationData);

//마이페이지 예약 내역 조회
export const getReservations = (status)=>
    UserApi.get(`/api/user/reservations/my?status=${status}`)

//마이페이지 북마크 목록 조회
export const getBookmarks = (page = 0, size = 10) =>
    UserApi.get(`/api/user/bookmarks?page=${page}&size=${size}`)

//북마크 삭제
export const deleteBookmark = (bookmarkId) =>
    UserApi.delete(`/api/user/bookmarks/${bookmarkId}`)

//마이페이지 리뷰 내역 조회
export const getMyReviews = () =>
    UserApi.get('/api/user/reviews/my')

//리뷰 삭제
export const deleteReview = (reviewId) =>
    UserApi.delete(`/api/user/reviews/${reviewId}`)

//리뷰 작성
export const createReview = (reviewData) =>
    UserApi.post('/api/user/reviews', reviewData)

export default UserApi
