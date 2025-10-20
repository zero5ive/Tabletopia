import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";
const URL=`${API_BASE_URL}/api/user/restaurants`;

export const getRestaurantMenu=(restaurantId)=>
    axios.get(`${URL}/${restaurantId}/menus`); 