from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from logger import log_telemetry
from broadcaster import add_client, remove_client, broadcast

app = FastAPI()

@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    print("📱 Telemetry device connected")

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                import json
                data = json.loads(raw)

                # Log + Broadcast
                await log_telemetry(data)
                await broadcast(data)

            except Exception as e:
                print("❌ Error parsing telemetry:", e)

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
