import SockJS from 'sockjs-client';
import { over } from 'stompjs';

export default function Test(){


const socket = new SockJS('http://localhost:10022/realtime/ws');
const stompClient = over(socket);
stompClient.connect({}, () => console.log('Connected!'));

    return(
        <>

        </>
    )
}