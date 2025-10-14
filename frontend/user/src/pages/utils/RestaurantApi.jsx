import axios from "axios";

const URL="http://localhost:10022/api/restaurants";

export const getRestaurantList = () => 
    axios.get(URL);