export interface TelemetryData {
    accelerometer: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
    magnetometer: { x: number; y: number; z: number };
    rotation: { alpha: number; beta: number; gamma: number };
    timestamp: number;
    trick: string;
}
