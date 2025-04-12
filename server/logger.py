import json
import asyncio
import os
from datetime import datetime

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "telemetry_log.jsonl")
log_lock = asyncio.Lock()

async def log_telemetry(data: dict):
    data["received_at"] = datetime.utcnow().isoformat()
    line = json.dumps(data) + "\n"
    async with log_lock:
        await asyncio.to_thread(_write_line, line)

def _write_line(line: str):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line)
