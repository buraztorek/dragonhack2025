import json
import asyncio
import os
from datetime import datetime
import pandas as pd
import numpy as np

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
log_lock = asyncio.Lock()

df = None
interval = 50
cooldown = 2
last_kickflip = 0
last_ollie = 0
last_shuvit = 0
last_processed_idx =0

def reset_vars():
    df = None
    last_kickflip = 0
    last_ollie = 0
    last_shuvit = 0
    last_processed_idx = 0


def detect_kickFlip(data_x, data_y, data_z, threshold=5):
	minimum = data_z.min()
	maximum = data_z.max()
	abs_diff = abs(maximum - minimum)
	if abs_diff > threshold:
		# check that y rotation is not too high
		if data_y.max() < 0.9 and data_y.min() > -0.9:
			return True
	return False

def detect_ollie(data_x, data_y, data_z, threshold=0.6):
	minimum = data_y.min()
	maximum = data_y.max()
	abs_diff = abs(maximum - minimum)
	if abs_diff > threshold:
		if data_z.max() < 0.5 and data_z.min() > -0.5:
			return True
	return False

def detect_shuvit(data_x, data_y, data_z, threshold=5):
	minimum = data_x.min()
	maximum = data_x.max()
	abs_diff = abs(maximum - minimum)
	if abs_diff > threshold:
		# check that y rotation is not too high
		if data_y.max() < 0.9 and data_y.min() > -0.9:
			return True
	return False

async def log_telemetry(data: dict):
    data["received_at"] = datetime.utcnow().isoformat()
    session_id = data.get("session_id", "default_session")
    global current_session_id, current_timestamp, df, interval, cooldown, last_kickflip, last_ollie, last_shuvit, last_processed_idx
    current_timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    if "current_session_id" not in globals():
        current_session_id = None
        reset_vars()

    if session_id != current_session_id:
        current_session_id = session_id
        reset_vars()

    if df is None:
        df = pd.DataFrame(columns=["timestamp", "rotation_x", "rotation_y", "rotation_z"])
    row = {
        "timestamp": data["timestamp"],
        "rotation_x": data["rotation"]["x"],
        "rotation_y": data["rotation"]["y"],
        "rotation_z": data["rotation"]["z"]
    }
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)

    # print(df.shape)

    if df.shape[0] - last_processed_idx > interval:
        last_processed_idx = df.shape[0]
        x_rot_unwrapped = np.unwrap(df['rotation_x'])
        y_rot_unwrapped = np.unwrap(df['rotation_y'])
        z_rot_unwrapped = np.unwrap(df['rotation_z'])

        if (detect_kickFlip(x_rot_unwrapped[-interval:], y_rot_unwrapped[-interval:], z_rot_unwrapped[-interval:])):
            print("Kickflip detected at " + str(last_kickflip))
            return "kickflip"
        if (detect_ollie(df['rotation_x'][-interval:], df['rotation_y'][-interval:], df['rotation_z'][-interval:])):
            print("Ollie detected at " + str(last_ollie))
            return "ollie"
        if (detect_shuvit(x_rot_unwrapped[-interval:], y_rot_unwrapped[-interval:], z_rot_unwrapped[-interval:])):
            print("Shuvit detected at " + str(last_shuvit))
            return "shuvit"

    return ""