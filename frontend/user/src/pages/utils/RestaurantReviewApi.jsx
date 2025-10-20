import axios from "axios";

const URL="http://localhost:8002/api/user/restaurants";

/*
 레스토랑 리뷰 검색 (페이징)
*/
export const getRestaurantReviews = (id, page = 0, size = 10) =>{
    return axios.get(`${URL}/${id}/reviews?page=${page}&size=${size}`)
}