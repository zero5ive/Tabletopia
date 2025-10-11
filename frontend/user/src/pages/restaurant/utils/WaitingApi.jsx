import axios from "axios";

const URL="http://localhost:8002/api/waitings";

export const getWaitingList=(restaurantId)=>axios.get(`${URL}?restaurantId=${restaurantId}`); //웨이팅 리스트