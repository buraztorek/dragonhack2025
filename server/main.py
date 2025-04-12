from datetime import datetime
import json
import uuid
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
    session_id = str(uuid.uuid4())  # Generate a unique session ID
    print(f"📱 Telemetry device connected (Session ID: {session_id})")

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)

                # Ensure all expected keys are present
                if not all(k in data for k in ["accelerometer", "gyroscope", "magnetometer", "rotation"]):
                    print(f"⚠️ Incomplete telemetry data (Session ID: {session_id}), skipping...")
                    continue

                # Construct a fused frame using the actual rotation from the phone
                fused = {
                    "session_id": session_id,  # Include session ID in the data
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
                print(f"❌ Error processing telemetry (Session ID: {session_id}):", e)

    except WebSocketDisconnect:
        print(f"📴 Telemetry disconnected (Session ID: {session_id})")

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