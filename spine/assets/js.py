import os
import re

data_folder = "./data/"
js_files = {
	"hero": "hero.js",
	"citymodle": "citymodle.js",
	"weapon": "weapon.js",
}

def update_js_file(folder, js_file_path):
	if os.path.exists(js_file_path):
		with open(js_file_path, "r") as js_file:
			js_content = js_file.read()
	else:
		js_content = "var {}List = {{\n}};".format(folder)
	
	existing_entries = {}
	pattern = re.compile(r'"(.*?)":\s*"(.*?)"')
	matches = pattern.findall(js_content)
	for key, value in matches:
		existing_entries[key] = value

	folder_path = os.path.join(data_folder, folder)
	if not os.path.exists(folder_path):
		print(f"Folder {folder_path} does not exist.")
		return
	
	subfolders = [
		f"{folder}/{name}" for name in os.listdir(folder_path)
		if os.path.isdir(os.path.join(folder_path, name))
	]

	updated_entries = {}
	added_subfolders = set(existing_entries.values())

	for key, value in matches:
		updated_entries[key] = value

	for subfolder in subfolders:
		if subfolder not in added_subfolders:
			updated_entries[subfolder] = subfolder
			added_subfolders.add(subfolder)

	sorted_entries = dict(sorted(updated_entries.items(), key=lambda item: item[1]))

	new_content = ",\n".join(f'    "{key}": "{value}"' for key, value in sorted_entries.items())
	js_content = f"var {folder}List = {{\n{new_content}\n}};"

	with open(js_file_path, "w") as js_file:
		js_file.write(js_content)
	print(f"Updated {js_file_path} with {len(sorted_entries) - len(existing_entries)} new entries.")

def main():
	for folder, js_file in js_files.items():
		js_file_path = os.path.join(js_file)
		update_js_file(folder, js_file_path)

if __name__ == "__main__":
	main()
