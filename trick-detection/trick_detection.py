import json
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
	json_file_path = "./trick-detection/Data/3f498b3b-e3b0-45e8-a402-614fabda483a.jsonl"
	data = read_rotation_to_dataframe(json_file_path)


	plt.figure(figsize=(10, 5))
	plt.plot(data['timestamp'], data['rotation_x'], label='Rotation X', color='b')
	plt.plot(data['timestamp'], data['rotation_y'], label='Rotation Y', color='r')
	plt.plot(data['timestamp'], data['rotation_z'], label='Rotation Z', color='g')
	plt.xlabel('Timestamp')
	plt.ylabel('Rotation (degrees)')
	plt.title('Rotation X over Time')
	plt.legend()
	plt.grid()
	plt.show()