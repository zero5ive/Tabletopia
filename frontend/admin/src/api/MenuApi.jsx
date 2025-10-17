import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8002/api/admin/restaurants",
  withCredentials: true, // 세션 쿠키(JSESSIONID) 전송
});

export const getMenusByRestaurant = (restaurantId) =>
  api.get(`/${restaurantId}/menus`);

export const createMenu = (restaurantId, data) =>
  api.post(`/${restaurantId}/menus`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateMenu = (restaurantId, menuId, data) =>
  api.put(`/${restaurantId}/menus/${menuId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMenu = (restaurantId, menuId) =>
  api.delete(`/${restaurantId}/menus/${menuId}`);
