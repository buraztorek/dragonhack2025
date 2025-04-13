from datetime import datetime
import json
import uuid
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from logger import log_telemetry
from broadcaster import (
    add_client,
    remove_client,
    broadcast_to_viewers,
    broadcast_to_telemetry
)

app = FastAPI()


@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    add_client(websocket, "telemetry")
    session_id = str(uuid.uuid4())
    print(f"📱 Telemetry device connected (Session ID: {session_id})")

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
                # print(data)

                if not all(k in data for k in ["accelerometer", "gyroscope", "magnetometer", "rotation"]):
                    print(f"⚠️ Incomplete telemetry data (Session ID: {session_id}), skipping...")
                    continue

                # # Convert trick to a dictionary if it's a stringified JSON
                # try:
                #     print()
                #     print(data)
                #     print()
                #     trick_data = json.loads(data["trick"]) if isinstance(data["trick"], str) else data["trick"]
                # except Exception as e:
                #     print("❌ Could not parse 'trick' field:", e)
                #     trick_data = {"type": "unknown"}

                fused = {
                    "session_id": session_id,
                    "timestamp": data.get("timestamp", datetime.utcnow().timestamp()),
                    "rotation": {
                        "x": data["rotation"]["alpha"],
                        "y": data["rotation"]["beta"],
                        "z": data["rotation"]["gamma"],
                    },
                    "acceleration": data["accelerometer"],
                    "gyroscope": data["gyroscope"],
                    "magneticField": data["magnetometer"]
                }

                skill = await log_telemetry(fused)
                fused["skill"] = skill

                # Send telemetry data only to viewer clients
                await broadcast_to_viewers(fused)

            except Exception as e:
                print(f"❌ Error processing telemetry (Session ID: {session_id}):", e)

    except WebSocketDisconnect:
        remove_client(websocket)
        print(f"📴 Telemetry disconnected (Session ID: {session_id})")


@app.websocket("/ws/viewer")
async def viewer_stream(websocket: WebSocket):
    await websocket.accept()
    print("🖥️ Viewer connected")
    add_client(websocket, "viewer")

    try:
        while True:
            message = await websocket.receive_text()
            print(f"📩 Data received from viewer: {message}")

            # Optionally send to telemetry devices
            await broadcast_to_telemetry({"type": "TOGGLE_TRACKING", "message": message})

    except WebSocketDisconnect:
        remove_client(websocket)
        print("📴 Viewer disconnected")
