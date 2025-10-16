import axios from "axios";

const URL="http://localhost:8002/api/restaurants";

/*
 레스토랑 리뷰 검색 
*/
export const getRestaurantReviews = (id) =>{
    return axios.get(`${URL}/${id}/reviews`)
}