import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";
const URL=`${API_BASE_URL}/api/user/restaurants`;

/*
 레스토랑 리뷰 검색 (페이징)
*/
export const getRestaurantReviews = (id, page = 0, size = 10) =>{
    return axios.get(`${URL}/${id}/reviews?page=${page}&size=${size}`)
}