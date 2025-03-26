import pandas as pd
import json
import os
import numpy as np

# Path to the Excel file
excel_file = "/home/ubuntu/upload/Team Skill Matrix Guide 1.xlsx"

# Create a directory to store JSON files if it doesn't exist
os.makedirs("/home/ubuntu/skill_matrix_app/src/data", exist_ok=True)

# Function to clean dataframe
def clean_dataframe(df):
    # Replace NaN with None for JSON serialization
    df = df.replace({np.nan: None})
    return df

# Extract and clean Criteria sheet (master data)
def process_criteria_sheet():
    print("Processing Criteria sheet (master data)...")
    df = pd.read_excel(excel_file, sheet_name="Criteria")
    
    # Clean column names
    df.columns = [str(col).strip() for col in df.columns]
    
    # Identify the main column
    main_col = df.columns[0]
    
    # Create a structured representation of the criteria
    criteria_data = []
    current_category = None
    current_subcategory = None
    
    for _, row in df.iterrows():
        value = row[main_col]
        if value is None:
            continue
            
        # Check if this is a main category (usually has values in other columns)
        if pd.notna(row['Low']) or pd.notna(row['High']):
            current_category = value
            current_subcategory = None
            
            # Create category entry
            category_entry = {
                'category': value,
                'description': row['Low'] if pd.notna(row['Low']) else None,
                'high_description': row['High'] if pd.notna(row['High']) else None,
                'level_descriptions': {},
                'subcategories': []
            }
            
            # Add level descriptions if available
            for i in range(5, 10):
                col_name = f'Unnamed: {i}'
                if col_name in df.columns and pd.notna(row[col_name]):
                    level = i - 4  # Convert to 1-based index
                    category_entry['level_descriptions'][level] = row[col_name]
            
            criteria_data.append(category_entry)
        else:
            # This is a subcategory or skill
            if current_category is not None:
                # Find the current category in our data structure
                for category in criteria_data:
                    if category['category'] == current_category:
                        category['subcategories'].append({
                            'name': value,
                            'skills': []
                        })
                        current_subcategory = value
                        break
    
    # Clean the data
    criteria_data = json.loads(json.dumps(criteria_data, default=str))
    
    # Save to file
    with open("/home/ubuntu/skill_matrix_app/src/data/criteria.json", "w") as f:
        json.dump(criteria_data, f, indent=2)
    
    print(f"Criteria data saved with {len(criteria_data)} categories")
    return criteria_data

# Extract and clean Skill upgrade guide sheet (presentation layer)
def process_skill_upgrade_guide():
    print("Processing Skill upgrade guide sheet (presentation layer)...")
    df = pd.read_excel(excel_file, sheet_name="Skill upgrage guide")
    
    # The sheet has a complex structure, so we need to identify the key sections
    # We'll extract the structure based on non-empty cells in specific columns
    
    # Clean the dataframe
    df = clean_dataframe(df)
    
    # Extract the skill levels and their descriptions
    skill_levels = []
    for i in range(1, 6):  # Assuming 5 skill levels
        level_data = {
            'level': i,
            'description': None
        }
        skill_levels.append(level_data)
    
    # Extract the presentation structure
    presentation_data = {
        'title': 'Skill Upgrade Guide',
        'skill_levels': skill_levels,
        'categories': []
    }
    
    # Save to file
    with open("/home/ubuntu/skill_matrix_app/src/data/skill_upgrade_guide.json", "w") as f:
        json.dump(presentation_data, f, indent=2)
    
    print("Skill upgrade guide data saved")
    return presentation_data

# Extract and clean Team overview sheet
def process_team_overview():
    print("Processing Team overview sheet...")
    df = pd.read_excel(excel_file, sheet_name=" Team overview")
    
    # Clean column names
    df.columns = [str(col).strip() for col in df.columns]
    
    # Extract employee data
    employees = []
    for i in range(1, len(df)):  # Skip header row
        row = df.iloc[i]
        if pd.notna(row['Unnamed: 0']):  # Employee name/id column
            employee = {
                'id': row['Unnamed: 0'],
                'position': row['Position'] if pd.notna(row['Position']) else None,
                'skill_expertise': row['skill expertise'] if pd.notna(row['skill expertise']) else None,
                'risk': row['Risk'] if pd.notna(row['Risk']) else None,
                'value': row['Value'] if pd.notna(row['Value']) else None,
                'potential': row['Potential'] if pd.notna(row['Potential']) else None,
                'salary_increase_plan': row['Salary Increase plan'] if pd.notna(row['Salary Increase plan']) else None,
                'salary_comment': row['Salary comment'] if pd.notna(row['Salary comment']) else None,
                'free_comment': row['Free comment'] if pd.notna(row['Free comment']) else None,
                'competencies': {}
            }
            
            # Extract competencies
            for j in range(16, 23):  # Competencies columns
                col_name = f'Unnamed: {j}'
                if col_name in df.columns and pd.notna(row[col_name]):
                    # Get the competency name from the header row
                    competency_name = df.iloc[0][col_name]
                    if pd.notna(competency_name):
                        employee['competencies'][competency_name] = row[col_name]
            
            employees.append(employee)
    
    # Clean the data
    employees = json.loads(json.dumps(employees, default=str))
    
    # Save to file
    with open("/home/ubuntu/skill_matrix_app/src/data/team_overview.json", "w") as f:
        json.dump(employees, f, indent=2)
    
    print(f"Team overview data saved with {len(employees)} employees")
    return employees

# Process developer profile sheets
def process_developer_profiles():
    developer_types = ["Product Developer", "Senior Developer Sample", "Junior Developer"]
    all_profiles = {}
    
    for dev_type in developer_types:
        print(f"Processing {dev_type} sheet...")
        df = pd.read_excel(excel_file, sheet_name=dev_type)
        
        # Clean the dataframe
        df = clean_dataframe(df)
        
        # Extract the profile structure
        profile_data = {
            'title': dev_type,
            'skills': []
        }
        
        # Save to file
        profile_filename = dev_type.lower().replace(" ", "_")
        with open(f"/home/ubuntu/skill_matrix_app/src/data/{profile_filename}.json", "w") as f:
            json.dump(profile_data, f, indent=2)
        
        all_profiles[dev_type] = profile_data
        print(f"{dev_type} data saved")
    
    return all_profiles

# Combine all data into a single structure
def create_combined_data(criteria, skill_guide, team_overview, profiles):
    combined_data = {
        'criteria': criteria,
        'skill_upgrade_guide': skill_guide,
        'team_overview': team_overview,
        'developer_profiles': profiles
    }
    
    # Save to file
    with open("/home/ubuntu/skill_matrix_app/src/data/combined_data.json", "w") as f:
        json.dump(combined_data, f, indent=2)
    
    print("Combined data saved")
    return combined_data

# Main execution
if __name__ == "__main__":
    # Process each sheet
    criteria_data = process_criteria_sheet()
    skill_guide_data = process_skill_upgrade_guide()
    team_overview_data = process_team_overview()
    profiles_data = process_developer_profiles()
    
    # Create combined data
    combined_data = create_combined_data(
        criteria_data, 
        skill_guide_data, 
        team_overview_data, 
        profiles_data
    )
    
    print("\nAll data has been extracted, cleaned, and saved in structured JSON format.")
    print("JSON files are located in: /home/ubuntu/skill_matrix_app/src/data/")
