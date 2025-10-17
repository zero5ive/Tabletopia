import axios from "axios";

const URL="http://localhost:8002/api/restaurants";

/**
 * 레스토랑 전체 목록 조회
 * @returns 
 */
export const getRestaurantList = () => 
    axios.get(URL);

export const getRestaurant = (id) => 
    axios.get(`${URL}/${id}`);

// export const getRestaurantByCategory = async (categoryId, page = 0, size = 1) => {
//     return await axios.get(`/api/restaurantcategories/${categoryId}`, {
//         params: { 
//             page: page, 
//             size: size 
//         }
    // });
// };

/**
 * 레스토랑 동적 검색
 */
export const searchRestaurants = async (params = {}) => {
    try {
        // null/undefined 값 제거
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value != null && value !== '')
        );
        
        const response = await axios.get(`${URL}/search`, {
            params: cleanParams
        });
        
        return response;
    } catch (error) {
        console.error('레스토랑 검색 실패:', error);
        throw error;
    }
};

/*
 레스토랑 상세페이지 (사진, 리뷰 등)
*/
export const getRestaurantDetail = (id) =>{
    return axios.get(`${URL}/${id}/detail`);
}

/*
레스토랑 위치
*/
export const getRestaurantLocation = (id) => {
    return axios.get(`${URL}/${id}/location`);
}

/**
 * 레스토랑 타임슬롯 조회
 */