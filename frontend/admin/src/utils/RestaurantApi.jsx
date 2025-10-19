import AdminApi from "../utils/AdminApi";

export const getAllRestaurants = () => AdminApi.get("/api/admin/restaurants");
export const getMyRestaurants = () => AdminApi.get("/api/admin/restaurants/my");
export const getRestaurant = (id) => AdminApi.get(`/api/admin/restaurants/${id}`);
export const deleteRestaurant = (id) => AdminApi.delete(`/api/admin/restaurants/${id}`);
export const createRestaurant = (data) => AdminApi.post("/api/admin/restaurants", data);
export const updateRestaurant = (id, data) => AdminApi.put(`/api/admin/restaurants/${id}`, data);
