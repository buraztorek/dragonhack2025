from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
from datetime import datetime
import os

app = FastAPI()
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "telemetry_ws_log.jsonl")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("📡 Client connected")

    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            data["received_at"] = datetime.utcnow().isoformat()

            with open(LOG_FILE, "a") as f:
                f.write(json.dumps(data) + "\n")

    except WebSocketDisconnect:
        print("❌ Client disconnected")
