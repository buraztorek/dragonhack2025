from datetime import datetime
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from logger import log_telemetry
from broadcaster import add_client, remove_client, broadcast

app = FastAPI()

latest_frame = {
    "accelerometer": None,
    "gyroscope": None,
    "magnetometer": None,
}


@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    print("📱 Telemetry device connected")

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)

                # Ensure all expected keys are present
                if not all(k in data for k in ["accelerometer", "gyroscope", "magnetometer", "rotation"]):
                    print("⚠️ Incomplete telemetry data, skipping...")
                    continue

                # Construct a fused frame using the actual rotation from the phone
                fused = {
                    "timestamp": data.get("timestamp", datetime.utcnow().timestamp()),
                    "rotation": {
                        "x": data["rotation"]["alpha"],  # yaw
                        "y": data["rotation"]["beta"],   # pitch
                        "z": data["rotation"]["gamma"],  # roll
                    },
                    "acceleration": data["accelerometer"],
                    "gyroscope": data["gyroscope"],
                    "magneticField": data["magnetometer"]
                }

                # Log it
                await log_telemetry(fused)

                # Broadcast to all viewers
                await broadcast(fused)

            except Exception as e:
                print("❌ Error processing telemetry:", e)

    except WebSocketDisconnect:
        print("📴 Telemetry disconnected")



@app.websocket("/ws/viewer")
async def viewer_stream(websocket: WebSocket):
    await websocket.accept()
    print("🖥️ Viewer connected")
    add_client(websocket)

    try:
        while True:
            await websocket.receive_text()  # optional: keep-alive
    except WebSocketDisconnect:
        remove_client(websocket)
        print("📴 Viewer disconnected")
