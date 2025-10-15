import axios from "axios";

const URL="http://localhost:8002/api/restaurants";

export const getRestaurantList = () => 
    axios.get(URL);

export const getRestaurantByCategory = async (categoryId, page = 0, size = 1) => {
    return await axios.get(`/api/restaurantcategories/${categoryId}`, {
        params: { 
            page: page, 
            size: size 
        }
    });
};

export const getRestaurant = (id) => {
    return axios.get(`${URL}/${id}`);
}