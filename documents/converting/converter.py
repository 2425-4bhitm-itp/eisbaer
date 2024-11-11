import os
import re
import json

# Function to parse SQL INSERT statements and extract values
def parse_sql_inserts(sql_file):
    # Ensure the SQL file exists
    if not os.path.exists(sql_file):
        raise FileNotFoundError(f"The file {sql_file} does not exist.")

    with open(sql_file, 'r') as file:
        sql_content = file.read()

    # Regular expression to match INSERT INTO ... VALUES
    insert_pattern = re.compile(r"INSERT INTO `?\w+`?\s?\((.*?)\)\s?VALUES\s?\((.*?)\);")
    matches = insert_pattern.findall(sql_content)

    data = []
    for match in matches:
        columns = match[0].split(",")  # Column names
        values = match[1].split(",")   # Values

        # Remove extra spaces, strip quotes, and handle NULLs
        values = [v.strip().strip("'") if v.strip() != "NULL" else None for v in values]

        # Make sure the length of columns and values match
        if len(columns) != len(values):
            print(f"Warning: Mismatched columns and values in SQL INSERT: {match}")
            continue

        # Prepare record for OpenSearch
        record = {}
        for col, val in zip(columns, values):
            record[col.strip()] = val

        # Append the record to data list
        data.append(record)

    return data

# Function to prepare bulk data for OpenSearch
def prepare_bulk_data(data):
    bulk_data = ""
    for item in data:
        # Add the index action (for inserting with custom _id)
        action = {"index": {"_id": item.get("FKArtikelID")}}  # Using FKArtikelID as the _id
        bulk_data += json.dumps(action) + "\n"
        # Add the document data
        document = {key: item[key] for key in item if key != "FKArtikelID"}  # Exclude _id field
        bulk_data += json.dumps(document) + "\n"
    return bulk_data

# Function to write the bulk data to a file (optional, for debugging or direct use)
def write_bulk_data_to_file(bulk_data, output_file):
    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file)
    if not os.path.exists(output_dir) and output_dir:
        os.makedirs(output_dir)

    with open(output_file, 'w') as file:
        file.write(bulk_data)

# Main function to run the script
def main():
    # Provided file paths
    input_sql_file = '/home/michael/Documents/School/Class4/ITP/sql_to_json/data/insert.sql'
    output_bulk_file = '/home/michael/Documents/School/Class4/ITP/sql_to_json/data/data.json'

    # Parse the SQL file and extract data
    try:
        data = parse_sql_inserts(input_sql_file)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    # Prepare the bulk data for OpenSearch
    bulk_data = prepare_bulk_data(data)

    # Write the bulk data to a file
    try:
        write_bulk_data_to_file(bulk_data, output_bulk_file)
    except Exception as e:
        print(f"Error writing bulk data to file: {e}")
        return

    # Print the bulk data (this is what you'll send to OpenSearch)
    print(f"Prepared Bulk Data has been saved to {output_bulk_file}")
    print("Prepared Bulk Data:")
    print(bulk_data)

if __name__ == '__main__':
    main()
