import json
import asyncio
import os
from datetime import datetime

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
log_lock = asyncio.Lock()

async def log_telemetry(data: dict):
    data["received_at"] = datetime.utcnow().isoformat()
    session_id = data.get("session_id", "default_session")
    global current_session_id, current_timestamp
    if "current_session_id" not in globals():
        current_session_id = None
        current_timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    if session_id != current_session_id:
        current_session_id = session_id
        current_timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")


    log_file = os.path.join(LOG_DIR, f"{current_timestamp}.jsonl")
    line = json.dumps(data) + "\n"
    async with log_lock:
        await asyncio.to_thread(_write_line, log_file, line)

def _write_line(log_file: str, line: str):
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line)
