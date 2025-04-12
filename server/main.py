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

                # Update latest values
                for key in ["accelerometer", "gyroscope", "magnetometer"]:
                    if key in data:
                        latest_frame[key] = data[key]

                # Only send if all sensors have data
                if all(latest_frame.values()):
                    # Construct a fused frame
                    fused = {
                        "timestamp": datetime.utcnow().timestamp(),
                        "rotation": {
                            # Use gyro data as rotationRate (in rad/s)
                            "x": latest_frame["gyroscope"]["x"],
                            "y": latest_frame["gyroscope"]["y"],
                            "z": latest_frame["gyroscope"]["z"],
                        },
                        "acceleration": {
                            "x": latest_frame["accelerometer"]["x"],
                            "y": latest_frame["accelerometer"]["y"],
                            "z": latest_frame["accelerometer"]["z"],
                        },
                        "magneticField": {
                            "x": latest_frame["magnetometer"]["x"],
                            "y": latest_frame["magnetometer"]["y"],
                            "z": latest_frame["magnetometer"]["z"],
                        },
                    }

                    # Log it
                    await log_telemetry(fused)

                    # Send to viewers
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
