import json
import os
import numpy as np
import matplotlib.pyplot as plt

import pandas as pd

def read_rotation_to_dataframe(filepath):
    records = []

    with open(filepath, 'r') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                entry = json.loads(line)
                rotation = entry.get("rotation", {})
                timestamp = entry.get("timestamp")

                records.append({
                    "timestamp": timestamp,
                    "rotation_x": rotation.get("x"),
                    "rotation_y": rotation.get("y"),
                    "rotation_z": rotation.get("z"),
                })
            except json.JSONDecodeError:
                print("Skipping invalid JSON line.")

    df = pd.DataFrame(records)
    return df



# === Run the reader ===
if __name__ == "__main__":
	# Replace with the path to your JSON file
	json_dir = "./server/logs/"
	print(os.listdir("."))
	json_file = "c581e35f-8784-4fa7-8ef4-c2ed2ca719d8_20250412_191520.jsonl"
	json_file = "cab865bc-b66c-4902-acc0-bcbc33db20f4_20250412_191515.jsonl"
	data = read_rotation_to_dataframe(json_dir + json_file)


	plt.figure(figsize=(10, 5))
	plt.plot(data['timestamp'], data['rotation_x'], label='Rotation X', color='b')
	plt.plot(data['timestamp'], data['rotation_y'], label='Rotation Y', color='r')
	plt.plot(data['timestamp'], data['rotation_z'], label='Rotation Z', color='g')
	plt.xlabel('Timestamp')
	plt.ylabel('Rotation (degrees)')
	plt.title('Rotation over Time')
	plt.legend()
	plt.grid()
	plt.show()