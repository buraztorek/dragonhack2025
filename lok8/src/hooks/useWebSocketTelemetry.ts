// hooks/useWebSocketTelemetry.ts
import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import * as THREE from 'three'; // Import THREE

export type Vec3 = { x: number; y: number; z: number };

// Define connection status types
export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

interface TelemetryStore {
  // Sensor Data
  rotation: Vec3;
  acceleration: Vec3;
  gyroscope: Vec3;
  magneticField: Vec3;
  timestamp: number;
  skill: string;

  // State & Control
  connectionStatus: ConnectionStatus;
  resetSignal: number;

  // Actions
  setTelemetry: (payload: {
    rotation: Vec3;
    acceleration: Vec3;
    gyroscope: Vec3;
    magneticField: Vec3;
    timestamp: number;
    skill: string;
  }) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  triggerReset: () => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  // Initial Sensor Data
  rotation: { x: 0, y: 0, z: 0 },
  acceleration: { x: 0, y: 0, z: 0 },
  gyroscope: { x: 0, y: 0, z: 0 },
  magneticField: { x: 0, y: 0, z: 0 },
  timestamp: 0,
  skill: '',

  // Initial State & Control
  connectionStatus: 'connecting',
  resetSignal: 0,

  // Actions
  setTelemetry: (payload) => set(payload),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  triggerReset: () => set((state) => ({ resetSignal: state.resetSignal + 1 })),
}));

// --- useWebSocketTelemetry Hook ---

export const useWebSocketTelemetry = (url: string | null) => {
  // --- SOLUTION 1: Select individually ---
  const setTelemetry = useTelemetryStore((s) => s.setTelemetry);
  const setConnectionStatus = useTelemetryStore((s) => s.setConnectionStatus);
  // --- End Solution 1 ---

  const socketRef = useRef<WebSocket | null>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);

  useEffect(() => {
    if (!url) {
      setConnectionStatus('closed');
      return;
    }

    console.log(`Attempting to connect to WebSocket: ${url}`);
    setConnectionStatus('connecting');
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus('open');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessageTimestamp(Date.now());

        if (
          typeof data.rotation?.x === 'number' &&
          typeof data.rotation?.y === 'number' &&
          typeof data.rotation?.z === 'number' &&
          typeof data.acceleration?.x === 'number' &&
          typeof data.acceleration?.y === 'number' &&
          typeof data.acceleration?.z === 'number' &&
          typeof data.gyroscope?.x === 'number' &&
          typeof data.gyroscope?.y === 'number' &&
          typeof data.gyroscope?.z === 'number' &&
          typeof data.magneticField?.x === 'number' &&
          typeof data.magneticField?.y === 'number' &&
          typeof data.magneticField?.z === 'number' &&
          typeof data.timestamp === 'number' &&
          typeof data.skill === 'string'
        ) {
          setTelemetry({
            rotation: data.rotation,
            acceleration: data.acceleration,
            gyroscope: data.gyroscope,
            magneticField: data.magneticField,
            timestamp: data.timestamp,
            skill: data.skill,
          });
        } else {
          console.warn("Incomplete or invalid telemetry packet received:", data);
        }
      } catch (err) {
        console.error("Failed to parse telemetry packet:", err, "Data:", event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('error');
    };

    socket.onclose = (event) => {
      console.warn(`WebSocket closed: Code=${event.code}, Reason=${event.reason}`);
      setConnectionStatus('closed');
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection.");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn(`WebSocket not open (State: ${socketRef.current?.readyState}). Unable to send message.`);
    }
  };

  const connectionStatus = useTelemetryStore((s) => s.connectionStatus);

  return { sendMessage, connectionStatus, lastMessageTimestamp };
};