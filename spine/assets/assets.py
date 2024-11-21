import os
import hashlib

def calculate_md5(file_path):
	hash_md5 = hashlib.md5()
	with open(file_path, "rb") as f:
		for chunk in iter(lambda: f.read(4096), b""):
			hash_md5.update(chunk)
	return hash_md5.hexdigest()

def get_mime_type_by_ext(file_ext):
	if file_ext.lower() == ".png":
		return "image/png"
	return "application/unknown"

def process_files(root_folder, hash):
	for subdir, _, files in os.walk(root_folder):
		asset_info_lines = []
		for file in files:
			file_path = os.path.join(subdir, file)
			
			name, ext = os.path.splitext(file)
			ext = ext.lower()

			md5_hash = calculate_md5(file_path)

			if hash:
				new_name = f"{name}-{md5_hash}{ext}"
				new_path = os.path.join(subdir, new_name)

				os.rename(file_path, new_path)
			else:
				new_path = file_path

			file_path = file_path.replace("\\", "/").replace("./data", "data")
			new_path = new_path.replace('\\', '/').replace("./data", "data")
			file_size = os.path.getsize(new_path)
			mime_type = get_mime_type_by_ext(ext)

			if mime_type == "image/png":
				file_type = "i"
			else:
				file_type = "t" if ext in [".atlas", ".json"] else "b"

			asset_info_lines.append(f"{file_type}:{file_path}:{new_path}:{file_size}:{mime_type}:1")

		if asset_info_lines:
			relative_parent_dir = os.path.relpath(subdir, root_folder).replace("\\", "/")
			asset_info_path = os.path.join(relative_parent_dir + ".txt")
			os.makedirs(os.path.dirname(asset_info_path), exist_ok=True)
			with open(asset_info_path, "a") as f:
				f.write("\n".join(asset_info_lines) + "\n")

if __name__ == "__main__":
	root_data_folder = "./data"
	process_files(root_data_folder, hash=False)
