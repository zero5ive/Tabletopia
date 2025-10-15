import axios from "axios";

const BASE_URL = "http://localhost:8002/api/restaurants";

export const getMenusByRestaurant = (restaurantId) =>
  axios.get(`${BASE_URL}/${restaurantId}/menus`);

export const createMenu = (restaurantId, data) =>
  axios.post(`${BASE_URL}/${restaurantId}/menus`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateMenu = (restaurantId, menuId, data) =>
  axios.put(`${BASE_URL}/${restaurantId}/menus/${menuId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMenu = (restaurantId, menuId) =>
  axios.delete(`${BASE_URL}/${restaurantId}/menus/${menuId}`);
