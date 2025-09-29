import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Use your production URL for the WebSocket connection
const API_URL = process.env.REACT_APP_API_URL || 'https://madurai-backend.onrender.com';

export const useSocket = (userId) => {
    const [isOrderUpdated, setIsOrderUpdated] = useState(false);
    const socketRef = useRef();

    useEffect(() => {
        // Only connect if a userId is provided
        if (!userId) return;

        // Establish connection to the server's root URL
        socketRef.current = io(API_URL);

        // Join a room specific to this user to receive their order updates
        socketRef.current.emit('join_room', userId);

        // This function will run when the vendor updates an order
        const handleOrderUpdate = (updatedOrder) => {
            console.log('An order was updated by the vendor:', updatedOrder);
            setIsOrderUpdated(true); // Set a flag to trigger a data refresh
        };

        // Listen for the two types of update events from the server
        socketRef.current.on('order_status_update', handleOrderUpdate);
        socketRef.current.on('order_item_update', handleOrderUpdate);

        // Cleanup function to disconnect the socket when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId]); // Re-run the effect if the userId changes

    // A function for the context to call after it has refetched the data
    const resetOrderUpdateFlag = () => {
        setIsOrderUpdated(false);
    };

    return { isOrderUpdated, resetOrderUpdateFlag };
};

