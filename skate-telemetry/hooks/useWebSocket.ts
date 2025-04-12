import { TelemetryData } from '@/types/telemetry';
import { useEffect, useRef } from 'react';

export const useWebSocket = (tracking: boolean, latestData: TelemetryData, onToggle: () => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  // Connect once when component mounts
  useEffect(() => {
    const socket = new WebSocket("ws://10.32.250.150:8000/ws/telemetry");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "TOGGLE_TRACKING") {
          onToggle();
        }
      } catch (e) {
        console.warn("Invalid message received:", e);
      }
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
  }, []);

  // Send telemetry only when tracking is enabled
  useEffect(() => {
    if (tracking && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(latestData));
    }
  }, [latestData, tracking]);
};
