import axios from "axios";

const URL="http://localhost:8002/api/hours/opening";

export const getOpeningHours = (id) => {
    return axios.get(`${URL}/${id}`);
}

export const getEffectiveHours = (id) => {
    return axios.get(`${URL}/effective/${id}`);
}