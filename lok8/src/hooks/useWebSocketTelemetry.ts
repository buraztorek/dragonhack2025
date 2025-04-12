import { useEffect } from 'react';
import { create } from 'zustand';

export type Vec3 = { x: number; y: number; z: number };

interface TelemetryStore {
  rotation: Vec3;         // from gyroscope
  acceleration: Vec3;     // from accelerometer
  magneticField: Vec3;    // from magnetometer
  timestamp: number;
  setTelemetry: (payload: {
    rotation: Vec3;
    acceleration: Vec3;
    magneticField: Vec3;
    timestamp: number;
  }) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  rotation: { x: 0, y: 0, z: 0 },
  acceleration: { x: 0, y: 0, z: 0 },
  magneticField: { x: 0, y: 0, z: 0 },
  timestamp: 0,
  setTelemetry: ({ rotation, acceleration, magneticField, timestamp }) =>
    set({ rotation, acceleration, magneticField, timestamp }),
}));

export const useWebSocketTelemetry = (url: string) => {
  const setTelemetry = useTelemetryStore((s) => s.setTelemetry);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.rotation && data.acceleration && data.magneticField) {
          setTelemetry({
            rotation: data.rotation,
            acceleration: data.acceleration,
            magneticField: data.magneticField,
            timestamp: data.timestamp,
          });
        }
      } catch (err) {
        console.warn("Invalid telemetry packet:", err);
      }
    };

    socket.onerror = (err) => console.warn("WebSocket error:", err);
    socket.onclose = () => console.warn("WebSocket closed");

    return () => socket.close();
  }, [url]);
};
