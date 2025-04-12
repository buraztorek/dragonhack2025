import json
import asyncio
import os
from datetime import datetime

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
log_lock = asyncio.Lock()

# Track state between calls
current_session_id = None
current_timestamp = None

async def log_telemetry(data: dict):
    print(f"Logging telemetry data: {data}")
    data["received_at"] = datetime.utcnow().isoformat()
    session_id = data.get("session_id", "default")

    global current_session_id, current_timestamp

    # Start new file if session/trick changes
    if session_id != current_session_id:
        current_session_id = session_id
        current_timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    # Save file as {trick_name}_{timestamp}.jsonl
    log_file = os.path.join(LOG_DIR, f"{session_id}_{current_timestamp}.jsonl")
    line = json.dumps(data) + "\n"

    async with log_lock:
        await asyncio.to_thread(_write_line, log_file, line)

def _write_line(log_file: str, line: str):
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(line)
