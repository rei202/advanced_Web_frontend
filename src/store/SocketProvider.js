import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { BACKEND_URL } from '../constant/common.const';
import SocketContext from './Context';

const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    let socket = new SockJS(`${BACKEND_URL}/ws`);
    const [stompClient, setStompClient] = useState(over(socket));
    const onConnected = () => {
        setIsConnected(true);
        console.log(stompClient);
    }
    const stompObj = {
        client : stompClient,
        isConnected : isConnected
    }
    stompClient.connect({}, onConnected);
    return <SocketContext.Provider value={stompObj}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
