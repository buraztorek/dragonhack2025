import { useState, useEffect } from 'react';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { TelemetryData } from '@/types/telemetry';

export const useTelemetry = (isTracking: boolean) => {
    const [motionData, setMotionData] = useState<TelemetryData | null>(null);

    useEffect(() => {
        if (!isTracking) return;

        DeviceMotion.setUpdateInterval(100);

        const subscription = DeviceMotion.addListener((motion: DeviceMotionMeasurement) => {
            setMotionData({
                acceleration: motion.acceleration || { x: 0, y: 0, z: 0 },
                rotationRate: motion.rotationRate || { alpha: 0, beta: 0, gamma: 0 },
                orientation: motion.orientation ?? 0,
                timestamp: Date.now(),
            });
        });

        return () => subscription.remove();
    }, [isTracking]);

    return motionData;
};
