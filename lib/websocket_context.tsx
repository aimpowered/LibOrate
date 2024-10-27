"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const pairId = "0" as string;

const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("wss://44ec-41-66-123-120.ngrok-free.app");
        setSocket(ws);

        ws.onopen = () => {
            console.log("WebSocket connection established");
	    // Notify I am a receiver client for pairId
	    ws.send("receiver:" + pairId);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.readyState === 1) { // <-- This is important
                ws.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
