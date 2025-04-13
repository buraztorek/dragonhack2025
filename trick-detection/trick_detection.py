import json
import os
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

def append_to_dataframe(filepath, data=None, initial_time=None):
	records = []

	with open(filepath, 'r') as f:
		for i, line in enumerate(f):
			if data is not None and i < data.shape[0]:
				continue
			if not line.strip():
				continue
			try:
				entry = json.loads(line)
				rotation = entry.get("rotation", {})
				timestamp = entry.get("timestamp")
				if initial_time is not None:
					timestamp = (timestamp / 1000 - initial_time)
				else:
					initial_time = timestamp / 1000
					timestamp = 0


				records.append({
					"timestamp": timestamp,
					"rotation_x": rotation.get("x"),
					"rotation_y": rotation.get("y"),
					"rotation_z": rotation.get("z"),
				})
			except json.JSONDecodeError:
				print("Skipping invalid JSON line.")

	new_data = pd.DataFrame(records)
	if data is None:
		return new_data, initial_time

	data = pd.concat([data, new_data], axis=0, ignore_index=True)
	return data.reset_index(drop=True), initial_time


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

def main_live():
	json_dir = "./server/logs/"
	json_file = os.listdir(json_dir)[-1]
	interval = 50
	cooldown = 2

	fig, ax = plt.subplots(figsize=(10, 5))
	data, initial_time = append_to_dataframe(json_dir + json_file)

	last_kickflip = 0
	last_ollie = 0
	last_shuvit = 0
	while True:
		data, initial_time = append_to_dataframe(json_dir + json_file, data, initial_time)

		x_rot_unwrapped = np.unwrap(data['rotation_x'])
		y_rot_unwrapped = np.unwrap(data['rotation_y'])
		z_rot_unwrapped = np.unwrap(data['rotation_z'])
		data['unwrapped_rotation_x'] = x_rot_unwrapped
		data['unwrapped_rotation_y'] = y_rot_unwrapped
		data['unwrapped_rotation_z'] = z_rot_unwrapped

		# data['timestamp'] = data['timestamp'] - initial_time
		# data['timestamp'] = data['timestamp'] / 1000

		if len(data) < interval:
			continue

		interval_start_timestamp = data['timestamp'].iloc[-interval]

		if (interval_start_timestamp - last_kickflip > cooldown and detect_kickFlip(data['unwrapped_rotation_x'][-interval:], data['unwrapped_rotation_y'][-interval:], data['unwrapped_rotation_z'][-interval:])):
			last_kickflip = data['timestamp'].iloc[-interval]
			print("Kickflip detected at " + str(last_kickflip))
		if (interval_start_timestamp - last_ollie > cooldown and detect_ollie(data['rotation_x'][-interval:], data['rotation_y'][-interval:], data['rotation_z'][-interval:])):
			last_ollie = data['timestamp'].iloc[-interval]
			print("Ollie detected at " + str(last_ollie))
		if (interval_start_timestamp - last_shuvit > cooldown and detect_shuvit(data['unwrapped_rotation_x'][-interval:], data['unwrapped_rotation_y'][-interval:], data['unwrapped_rotation_z'][-interval:])):
			last_shuvit = data['timestamp'].iloc[-interval]
			print("Shuvit detected at " + str(last_shuvit))

		ax.clear()
		ax.plot(data['timestamp'], data['rotation_x'], label='Rotation X', color='b')
		ax.plot(data['timestamp'], data['rotation_y'], label='Rotation Y', color='r')
		ax.plot(data['timestamp'], data['rotation_z'], label='Rotation Z', color='g')
		ax.set_xlabel('Timestamp')
		ax.set_ylabel('Rotation (degrees)')
		ax.set_title('Rotation over Time')
		ax.legend()
		ax.grid()

		plt.pause(0.2)


def main():
	json_dir = "./server/logs/"
	json_file = os.listdir(json_dir)[-1]

	data, initial_time = append_to_dataframe(json_dir + json_file)

	x_rot_unwrapped = np.unwrap(data['rotation_x'])
	y_rot_unwrapped = np.unwrap(data['rotation_y'])
	z_rot_unwrapped = np.unwrap(data['rotation_z'])
	data['unwrapped_rotation_x'] = x_rot_unwrapped
	data['unwrapped_rotation_y'] = y_rot_unwrapped
	data['unwrapped_rotation_z'] = z_rot_unwrapped

	# initial_time = data['timestamp'].iloc[0]
	# data['timestamp'] = data['timestamp'] - initial_time
	# data['timestamp'] = data['timestamp'] / 1000

	print(len(data))
	interval = 50
	cooldown = 2

	last_kickflip = 0
	last_ollie = 0
	last_shuvit = 0
	for i in range(0, len(data), 10):
		if i + interval >= len(data):
			break

		if len(data) < interval:
			break

		interval_start_timestamp = data['timestamp'].iloc[i]

		if (interval_start_timestamp - last_kickflip > cooldown and detect_kickFlip(data['unwrapped_rotation_x'][i:i+interval], data['unwrapped_rotation_y'][i:i+interval], data['unwrapped_rotation_z'][i:i+interval])):
			last_kickflip = data['timestamp'].iloc[i]
			print("Kickflip detected at " + str(last_kickflip))
		if (interval_start_timestamp - last_ollie > cooldown and detect_ollie(data['rotation_x'][i:i+interval], data['rotation_y'][i:i+interval], data['rotation_z'][i:i+interval])):
			last_ollie = data['timestamp'].iloc[i]
			print("Ollie detected at " + str(last_ollie))
		if (interval_start_timestamp - last_shuvit > cooldown and detect_shuvit(data['unwrapped_rotation_x'][i:i+interval], data['unwrapped_rotation_y'][i:i+interval], data['unwrapped_rotation_z'][i:i+interval])):
			last_shuvit = data['timestamp'].iloc[i]
			print("Shuvit detected at " + str(last_shuvit))

	plt.plot(data['timestamp'], data['rotation_x'], label='Rotation X', color='b')
	plt.plot(data['timestamp'], data['rotation_y'], label='Rotation Y', color='r')
	plt.plot(data['timestamp'], data['rotation_z'], label='Rotation Z', color='g')
	plt.xlabel('Timestamp')
	plt.ylabel('Rotation (degrees)')
	plt.title('Rotation over Time')
	plt.legend()
	plt.grid()
	plt.show()


if __name__ == "__main__":
    main_live()
    # main()
