import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TelemetryData } from '@/types/telemetry';

interface TelemetryDisplayProps {
    telemetry: TelemetryData | null;
}

const TelemetryDisplay: React.FC<TelemetryDisplayProps> = ({ telemetry }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Telemetry Data</Text>

            {telemetry ? (
                <>
                    <Text style={styles.label}>Acceleration (x/y/z):</Text>
                    <Text>{`${telemetry.accelerometer.x.toFixed(2)}, ${telemetry.accelerometer.y.toFixed(2)}, ${telemetry.accelerometer.z.toFixed(2)}`}</Text>

                    <Text style={styles.label}>Angular Velocity (x/y/z):</Text>
                    <Text>{`${telemetry.gyroscope.x.toFixed(2)}, ${telemetry.gyroscope.y.toFixed(2)}, ${telemetry.gyroscope.z.toFixed(2)}`}</Text>

                    <Text style={styles.label}>Magnetic Field (x/y/z):</Text>
                    <Text>{`${telemetry.magnetometer.x.toFixed(2)}, ${telemetry.magnetometer.y.toFixed(2)}, ${telemetry.magnetometer.z.toFixed(2)}`}</Text>
                </>
            ) : (
                <Text>No telemetry data</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 20 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    label: { fontWeight: '600', marginTop: 10 },
});

export default TelemetryDisplay;
