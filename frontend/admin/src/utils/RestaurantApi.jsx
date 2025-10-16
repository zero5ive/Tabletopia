export const getRestaurant = (id) => 
    axios.get(`${URL}/${id}`);