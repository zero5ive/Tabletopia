import axios from "axios";

const URL="http://localhost:8002/api/waitings";

export const getWaitingList=()=>axios.get(URL); //웨이팅 리스트