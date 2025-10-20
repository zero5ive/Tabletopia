import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8002";
const URL=`${API_BASE_URL}/api/user/categories`;

export const getCategoryList=()=>
    axios.get(URL); //카테고리 리스트

export const getRestaurantByCategory = (id, page = 0, size = 3) =>
    axios.get(`${URL}/${id}/restaurants`, {
        params: {
            page: page,
            size: size
        }
    });