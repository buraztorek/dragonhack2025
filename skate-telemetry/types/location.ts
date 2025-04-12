export interface GPSData {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    timestamp: number;
}