import axios from "axios";

const URL="http://localhost:8002/api/user/restaurants";

export const getRestaurantFacilities = (id) => {
    return axios.get(`${URL}/${id}/facilities`);
}