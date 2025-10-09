import axios from "axios";

const BASE_URL = "http://localhost:10022/api/restaurants";

export const createRestaurant = (data) => axios.post(BASE_URL, data);
export const getAllRestaurants = () => axios.get(BASE_URL);
export const getRestaurantById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateRestaurant = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteRestaurant = (id) => axios.delete(`${BASE_URL}/${id}`);
