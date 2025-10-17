import axios from "axios";

const URL="http://localhost:8002/api/user/restaurants";

export const getRestaurantMenu=(restaurantId)=>
    axios.get(`${URL}/${restaurantId}/menus`); 