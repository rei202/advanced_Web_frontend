import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { BACKEND_URL } from '../constant/common.const';
import SocketContext from './Context';

const SocketProvider = ({ children }) => {
    let socket = new SockJS(`${BACKEND_URL}/ws`);
    let stompClient = over(socket);
    stompClient.connect();
    return <SocketContext.Provider value={stompClient}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
