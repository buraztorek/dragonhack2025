import json
from typing import List
from fastapi import WebSocket

connected_clients: List[WebSocket] = []

def add_client(client: WebSocket):
    connected_clients.append(client)

def remove_client(client: WebSocket):
    if client in connected_clients:
        connected_clients.remove(client)

async def broadcast(data: dict):
    message = json.dumps(data)
    dead_clients = []

    for client in connected_clients:
        try:
            await client.send_text(message)
        except:
            dead_clients.append(client)

    for dead in dead_clients:
        remove_client(dead)
