import axios from "axios";

const URL="http://localhost:8002/api/restaurants";

export const getRestaurantList = () => 
    axios.get(URL);