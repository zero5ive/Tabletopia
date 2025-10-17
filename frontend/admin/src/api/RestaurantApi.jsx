import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8002/api/admin",
  withCredentials: true, // ★ 세션 쿠키(JSESSIONID) 전송 필수
});

export const createRestaurant = (data) => api.post("/restaurants", data);
export const getAllRestaurants = () => api.get("/restaurants");
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);
