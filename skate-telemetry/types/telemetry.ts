export interface TelemetryData {
    acceleration: {
        x: number | null;
        y: number | null;
        z: number | null;
    };
    rotationRate: {
        alpha: number | null;
        beta: number | null;
        gamma: number | null;
    };
    orientation: number | null;
    timestamp: number;
}