import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket;

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socket) {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
            const backendUrl = import.meta.env.VITE_SOCKET_URL ||
                (apiBaseUrl.startsWith('http') ? apiBaseUrl.replace(/\/api\/?$/, '') : window.location.origin);
                
            socket = io(backendUrl);

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });
        }

        return () => {
            // Keep socket alive across unmounts to prevent reconnection spam
            // if we want it to be app-wide.
        };
    }, []);

    return { socket, isConnected };
};
