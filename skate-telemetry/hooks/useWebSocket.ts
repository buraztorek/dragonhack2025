import { useEffect, useRef } from 'react';

export const useWebSocket = (enabled: boolean, latestData: object | null) => {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const socket = new WebSocket("ws://10.32.250.150:8000/ws");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        socket.onerror = (e) => {
            console.warn("WebSocket error:", e);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [enabled]);

    // Send data when it changes
    useEffect(() => {
        if (enabled && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(latestData));
        }
    }, [latestData, enabled]);
};
