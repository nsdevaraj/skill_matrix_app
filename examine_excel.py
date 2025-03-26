import pandas as pd
import json
import os

# Path to the Excel file
excel_file = "/home/ubuntu/upload/Team Skill Matrix Guide 1.xlsx"

# Get list of sheet names
xl = pd.ExcelFile(excel_file)
sheet_names = xl.sheet_names

print("Available sheets in the Excel file:")
for i, sheet in enumerate(sheet_names):
    print(f"{i+1}. {sheet}")

# Create a directory to store JSON files
os.makedirs("json_data", exist_ok=True)

# Function to convert sheet to JSON
def sheet_to_json(sheet_name):
    try:
        # Read the sheet
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        
        # Convert to JSON
        json_data = df.to_json(orient="records")
        
        # Save to file
        with open(f"json_data/{sheet_name.replace(' ', '_')}.json", "w") as f:
            f.write(json_data)
        
        # Print sample data
        print(f"\nSample data from '{sheet_name}':")
        print(df.head())
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        return json_data
    except Exception as e:
        print(f"Error processing sheet '{sheet_name}': {e}")
        return None

# Process each sheet
json_data = {}
for sheet in sheet_names:
    print(f"\nProcessing sheet: {sheet}")
    json_result = sheet_to_json(sheet)
    if json_result:
        json_data[sheet] = json_result

# Save all data to a single JSON file
with open("json_data/all_sheets.json", "w") as f:
    json.dump(json_data, f)

print("\nAll sheets have been converted to JSON and saved in the 'json_data' directory.")
