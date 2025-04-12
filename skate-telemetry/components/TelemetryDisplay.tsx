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
                    <Text>{`${telemetry.acceleration.x?.toFixed(2)}, ${telemetry.acceleration.y?.toFixed(2)}, ${telemetry.acceleration.z?.toFixed(2)}`}</Text>

                    <Text style={styles.label}>Rotation Rate (α/β/γ):</Text>
                    <Text>{`${telemetry.rotationRate.alpha?.toFixed(2)}, ${telemetry.rotationRate.beta?.toFixed(2)}, ${telemetry.rotationRate.gamma?.toFixed(2)}`}</Text>

                    <Text style={styles.label}>Orientation:</Text>
                    <Text>{telemetry.orientation}</Text>
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
