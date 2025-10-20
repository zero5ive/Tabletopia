import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";
const URL=`${API_BASE_URL}/api/user/restaurants`;

export const getRestaurantFacilities = (id) => {
    return axios.get(`${URL}/${id}/facilities`);
}