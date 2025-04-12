import json
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt


def load_rotation_data(filepath):
	angles = []
	timestamps = []

	with open(filepath, 'r') as f:
		for line in f:
			if not line.strip():
				continue  # Skip empty lines
			try:
				entry = json.loads(line)
				rotation = entry.get("rotation", {})
				timestamp = entry.get("timestamp")

				x_angle = rotation.get("x")
				if x_angle is not None:
					angles.append(x_angle)
					timestamps.append(timestamp)
			except json.JSONDecodeError:
				print("Skipping invalid JSON line.")

	return np.array(angles), np.array(timestamps)

# === Run the reader ===
if __name__ == "__main__":
	# Replace with the path to your JSON file
	json_file_path = "./trick-detection/Data/3f498b3b-e3b0-45e8-a402-614fabda483a.jsonl"
	data = load_rotation_data(json_file_path)


	plt.figure(figsize=(10, 5))
	plt.plot(data[1], data[0], label='Rotation X', color='blue')
	plt.xlabel('Timestamp')
	plt.ylabel('Rotation (degrees)')
	plt.title('Rotation X over Time')
	plt.legend()
	plt.grid()
	plt.show()