import axios from "axios";

const URL="http://localhost:8002/api/restaurants";

export const getRestaurantMenu=(restaurantId)=>
    axios.get(`${URL}/${restaurantId}/menus`); 