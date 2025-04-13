import { useState, useEffect } from 'react';
import { TelemetryData } from '@/types/telemetry';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

export const useTelemetry = (isTracking: boolean, trick: string): TelemetryData => {
  const [gyroscope, setGyroscope] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometer, setMagnetometer] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    if (!isTracking) return;

    Gyroscope.setUpdateInterval(100);
    Magnetometer.setUpdateInterval(100);
    DeviceMotion.setUpdateInterval(100);

    const gyroSub = Gyroscope.addListener(setGyroscope);
    const magSub = Magnetometer.addListener(setMagnetometer);
    const motionSub = DeviceMotion.addListener((motion: DeviceMotionMeasurement) => {
      if (motion.rotation) {
        setRotation({
          alpha: motion.rotation.alpha,
          beta: motion.rotation.beta,
          gamma: motion.rotation.gamma,
        });
      }

      if (motion.acceleration) {
        setAccelerometer({
          x: motion.acceleration.x ?? 0,
          y: motion.acceleration.y ?? 0,
          z: motion.acceleration.z ?? 0,
        });
      }

      setTimestamp(Date.now());
    });

    return () => {
      gyroSub.remove();
      magSub.remove();
      motionSub.remove();
    };
  }, [isTracking]);

  return {
    gyroscope,
    magnetometer,
    rotation,
    accelerometer, // <-- now from DeviceMotion
    timestamp,
    trick,
  };
};
