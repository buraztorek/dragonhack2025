import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { GPSData } from '@/types/location';

export const useLocation = (isTracking: boolean) => {
    const [location, setLocation] = useState<GPSData | null>(null);

    useEffect(() => {
        let subscriber: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            subscriber = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                loc => {
                    setLocation({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        altitude: loc.coords.altitude,
                        timestamp: loc.timestamp,
                    });
                }
            );
        };

        if (isTracking) startTracking();

        return () => {
            subscriber?.remove();
        };
    }, [isTracking]);

    return location;
};
