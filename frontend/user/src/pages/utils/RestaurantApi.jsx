import axios from "axios";

const URL="http://localhost:8002/api/user";

/**
 * 레스토랑 전체 목록 조회
 * @returns
 */
export const getRestaurantList = () =>
    axios.get(`${URL}/restaurants`);

export const getRestaurant = (id) =>
    axios.get(`${URL}/restaurants/${id}`);

// export const getRestaurantByCategory = async (categoryId, page = 0, size = 1) => {
//     return await axios.get(`/api/user/categories/${categoryId}/restaurants`, {
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

        const response = await axios.get(`${URL}/restaurants/search`, {
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
    return axios.get(`${URL}/restaurants/${id}/detail`);
}

/*
레스토랑 위치
*/
export const getRestaurantLocation = (id) => {
    return axios.get(`${URL}/restaurants/${id}/location`);
}

/*북마크 등록*/
export const addBookmark = (userId, restaurantId) => {
    return axios.post(`${URL}/bookmarks`, {
        userId,
        restaurantId
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
}


/* 레스토랑별 북마크 조회 */
export const getRestaurantBookmarks = (restaurantId) => {
    return axios.get(`${URL}/bookmarks/${restaurantId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
}