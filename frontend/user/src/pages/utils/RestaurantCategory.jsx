import axios from "axios";

const URL="http://localhost:8002/api/restaurantcategories";

export const getCategoryList=()=>
    axios.get(URL); //카테고리 리스트

export const getRestaurantByCategory = (id, page = 0, size = 3) =>
    axios.get(`${URL}/${id}`, {
        params: {
            page: page,
            size: size
        }
    });