"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const pairId = process.env.NEXT_PUBLIC_PAIR_ID as string;
const wsUrl = process.env.NEXT_PUBLIC_WS_URL as string;

const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // Mutable ref to store the reconnect delay, update immediately after reconnecting
    // state updates are async and may not be updated in time for the next reconnect
    const reconnectDelayRef = useRef(1000); // Initial delay of 1 second
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>(); // Timeout reference

    useEffect(() => {
        let ws: WebSocket;

        const connectWebSocket = () => {
            ws = new WebSocket(wsUrl);
            setSocket(ws);

            ws.onopen = () => {
                console.log("WebSocket connection established");
                reconnectDelayRef.current = 1000; // Reset reconnect delay on successful connection
                // Notify I am a receiver client for pairId
                ws.send("receiver:" + pairId);
            };

            ws.onclose = (event) => {
                console.log("WebSocket connection closed", event);
                if (!event.wasClean) {
                    attemptReconnect();
                } else {
                    console.log("WebSocket connection closed cleanly");
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        };

        const attemptReconnect = () => {
            // Update the delay before setting the timeout
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30000); // Exponential backoff, max 30 seconds

            const delay = reconnectDelayRef.current;
            console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

            // Set a timeout to reconnect
            reconnectTimeoutRef.current = setTimeout(() => {
                connectWebSocket();
            }, delay);
        };

        connectWebSocket();

        return () => {
            // Clean up the timeout and close the WebSocket when the component unmounts
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (ws && ws.readyState === WebSocket.OPEN) { // <-- This is important
                ws.close();
            }
        };
    }, [pairId]);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
