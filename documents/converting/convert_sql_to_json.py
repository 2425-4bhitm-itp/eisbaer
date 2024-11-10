import re
import json

# Function to parse the INSERT INTO SQL statement and extract the values
def parse_insert_statement(insert_statement):
    # Regular expression to capture the values inside the parentheses
    pattern = r"VALUES\s*\((.*?)\);"
    match = re.search(pattern, insert_statement, re.DOTALL)
    
    if match:
        # Extract the values as a string, then split by commas, handling NULL and strings properly
        values_str = match.group(1)
        # Split by commas, but we need to handle cases like NULL and strings with quotes
        values = []
        for value in values_str.split(','):
            value = value.strip()
            if value == "NULL":
                values.append(None)
            elif value.startswith("'") and value.endswith("'"):
                values.append(value[1:-1])  # Remove quotes around string values
            else:
                try:
                    # Try to convert numeric values
                    if '.' in value:
                        values.append(float(value))
                    else:
                        values.append(int(value))
                except ValueError:
                    values.append(value)  # In case something couldn't be converted
        return values
    return None

# Function to read the SQL file and convert the INSERT INTO data to JSON
def convert_sql_to_json(sql_file, json_file):
    with open(sql_file, 'r') as file:
        sql_content = file.read()
    
    # Regular expression to match all INSERT INTO statements
    insert_statements = re.findall(r"INSERT INTO\s+artikel\s*\((.*?)\)\s*VALUES\s*\((.*?)\);", sql_content, re.DOTALL)

    # Define column names based on the CREATE TABLE statement
    columns = [
        "FKArtikelID", "Bezeichnung1", "Bezeichnung2", "Laenge", "Breite",
        "Hoehe", "Durchmesser", "Lagerort", "Lagerstand", "LagereinheitBez", "Stellplatz"
    ]
    
    # Create a list to store the parsed data
    data = []

    # Process each INSERT statement
    for statement in insert_statements:
        values = parse_insert_statement(statement[1])
        if values:
            # Create a dictionary from column names and values
            row_dict = dict(zip(columns, values))
            data.append(row_dict)

    # Write the data to a JSON file
    with open(json_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data has been written to {json_file.name}")

# Example usage
convert_sql_to_json('insert.sql', 'data.json')

