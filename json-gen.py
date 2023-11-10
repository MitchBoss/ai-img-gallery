#json-gen.py
#Generates JSON file listing all files in a specified directoy as files_list.json

import os
import json

#This puthon script is used for 


# The default dir, replacing username with a reference to the home directory
# os.path.expanduser('~') gives you the home directory
default_dir = os.path.join(os.path.expanduser('~'), 'Github', 'ai-img-gallery', 'img', 'img new')

# Ask the user if they want to use the default directory
response = input(f"Do you want to use this directory: {default_dir}? (yes/no): ")

# If not, ask for directory
if response.lower() == 'no':
    directory = input("Please enter a directory: ")
else:
    directory = default_dir

# Assume the path is a directory
assert os.path.isdir(directory), "Directory doesn't exist"

# Ask the user for sort order
sort_order = input(
    "Please select an option:\n" +
    "1. Order oldest to newest (date modified)\n" +
    "2. Order newest to oldest (date modified)\n" +
    "3. Alphabetical asc\n" +
    "4. Alphabetical desc\n" +
    "Enter option number: "
)

# Get all files
files = os.listdir(directory)

# Excluding .DS_Store
files = [f for f in files if f != '.DS_Store']

# Sort files according to required order
if sort_order == '1':  # Order oldest to newest (date modified)
    files.sort(key=lambda x: os.stat(os.path.join(directory, x)).st_mtime)
elif sort_order == '2':  # Order newest to oldest (date modified)
    files.sort(key=lambda x: os.stat(os.path.join(directory, x)).st_mtime, reverse=True)
elif sort_order == '3':  # Alphabetical asc
    files.sort()
elif sort_order == '4':  # Alphabetical desc
    files.sort(reverse=True)

# Prepare data for JSON
data = []
for file in files:
    data.append({
        'src': 'img/' + file,
        'alt': os.path.splitext(file)[0]
    })

# Write the data to a json file
with open('files_list.json', 'w') as f:
    json.dump(data, f, indent=4)

print("Successfully written the filenames to a json file.")