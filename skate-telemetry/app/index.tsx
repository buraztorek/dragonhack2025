import TelemetryDisplay from "@/components/TelemetryDisplay";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";

export default function Index() {
  const [tracking, setTracking] = useState(false);
  const [trick, setTrick] = useState("stop");
  const telemetry = useTelemetry(tracking, trick);

  useWebSocket(tracking, telemetry, (message) => {
    setTrick(message);
    console.log("Received message:", message);
    setTracking(prev => !prev); // Toggled by server
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛹 Skate Tracker Pro</Text>
      <Button title={tracking ? "Stop" : "Start Tracking"} onPress={() => setTracking(prev => !prev)} />
      <TelemetryDisplay telemetry={telemetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
