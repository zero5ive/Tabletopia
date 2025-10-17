import axios from "axios";

const URL="http://localhost:8002/api/user/hours/opening";

export const getOpeningHours = (id) => {
    return axios.get(`${URL}/${id}`);
}

export const getEffectiveHours = (id) => {
    return axios.get(`${URL}/effective/${id}`);
}

export const getEffectiveOpeningHours = async (id, date) => {
    try {
        const response = await axios.get(
            `http://localhost:8002/api/user/hours/opening/effective/${id}`,
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
            `http://localhost:8002/api/realtime/restaurants/${restaurantId}/available-timeslots`,
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