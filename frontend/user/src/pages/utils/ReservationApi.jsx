import axios from "axios";

const URL="http://localhost:8002/api/user/restaurants";

export const getReservationList = (restaurantId) => {
    return axios.get(`${URL}/${restaurantId}/reservations`);
}