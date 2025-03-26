import json
import os

# Path to the JSON file
json_file = "/home/ubuntu/skill_matrix_app/react-app/src/data/criteria.json"

# Read the file content
with open(json_file, 'r') as f:
    content = f.read()

# Replace NaN with null (which is valid JSON)
content = content.replace(': NaN', ': null')

# Write the fixed content back to the file
with open(json_file, 'w') as f:
    f.write(content)

# Verify the file is now valid JSON
try:
    with open(json_file, 'r') as f:
        data = json.load(f)
    print("JSON file fixed and validated successfully!")
except json.JSONDecodeError as e:
    print(f"Error: JSON is still invalid: {e}")
