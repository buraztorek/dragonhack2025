from fastapi import WebSocket

telemetry_clients = set()
viewer_clients = set()

def add_client(websocket: WebSocket, client_type: str):
    if client_type == "telemetry":
        telemetry_clients.add(websocket)
    elif client_type == "viewer":
        viewer_clients.add(websocket)

def remove_client(websocket: WebSocket):
    telemetry_clients.discard(websocket)
    viewer_clients.discard(websocket)

async def broadcast_to_viewers(message: dict):
    disconnected = []
    for client in viewer_clients:
        try:
            await client.send_json(message)
        except:
            disconnected.append(client)
    for client in disconnected:
        viewer_clients.discard(client)

async def broadcast_to_telemetry(message: dict):
    disconnected = []
    for client in telemetry_clients:
        try:
            await client.send_json(message)
        except:
            disconnected.append(client)
    for client in disconnected:
        telemetry_clients.discard(client)
