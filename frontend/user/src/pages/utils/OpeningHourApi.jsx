import axios from "axios";

const BASE_URL="http://localhost:8002/api/user/restaurants";

export const getOpeningHours = (id) => {
    return axios.get(`${BASE_URL}/${id}/hours/opening`);
}

export const getEffectiveHours = (id) => {
    return axios.get(`${BASE_URL}/${id}/hours/effective`);
}

export const getEffectiveOpeningHours = async (id, date) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${id}/hours/effective`,
            {
                params: { date }
            }
        );
        return response;
    } catch (error) {
        console.error('영업시간 조회 실패:', error);
        throw error;
    }
};

export const getAvailableTimeSlots = async (restaurantId, date) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${restaurantId}/timeslots`,
            {
                params: { date }
            }
        );
        return response;
    } catch (error) {
        console.error('타임슬롯 예약 가능 여부 조회 실패:', error);
        throw error;
    }
};