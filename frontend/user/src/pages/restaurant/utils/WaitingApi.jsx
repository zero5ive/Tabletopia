import axios from "axios";

const URL="http://localhost:8002/api/waitings";

export const getWaitingList=(restaurantId, status = 'WAITING', size = 1000)=>
    axios.get(`${URL}/${restaurantId}?status=${status}&size=${size}`); //웨이팅 리스트