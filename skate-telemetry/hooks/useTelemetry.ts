// import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

// export const useTelemetry = (isTracking: boolean) => {
//     const [motionData, setMotionData] = useState<TelemetryData | null>(null);

//     useEffect(() => {
//         if (!isTracking) return;

//         DeviceMotion.setUpdateInterval(100);

//         const subscription = DeviceMotion.addListener((motion: DeviceMotionMeasurement) => {
//             setMotionData({
//                 accelerometer: motion.accelerometer || { x: 0, y: 0, z: 0 },
//                 rotationRate: motion.rotationRate || { alpha: 0, beta: 0, gamma: 0 },
//                 orientation: motion.orientation ?? 0,
//                 timestamp: Date.now(),
//             });
//         });

//         return () => subscription.remove();
//     }, [isTracking]);

//     return motionData;
// };

import { useState, useEffect } from 'react';
import { TelemetryData } from '@/types/telemetry';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

export const useTelemetry = (isTracking: boolean): TelemetryData => {
    const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
    const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 });
    const [magnetometer, setMagnetometer] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (!isTracking) return;

        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);
        Magnetometer.setUpdateInterval(100);

        const accelSub = Accelerometer.addListener(setAccelerometer);
        const gyroSub = Gyroscope.addListener(setGyroscope);
        const magSub = Magnetometer.addListener(setMagnetometer);

        return () => {
            accelSub?.remove();
            gyroSub?.remove();
            magSub?.remove();
        };
    }, [isTracking]);

    return {
        accelerometer,
        gyroscope,
        magnetometer,
    };
};
