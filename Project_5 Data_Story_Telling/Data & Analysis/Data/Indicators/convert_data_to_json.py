import pandas as pd
import os

# Define the file names
files = [
    "gdp-per-capiatstatistic_id263599_gross-domestic-product--gdp--per-capita-in-turkey-2028.xlsx",
    "inflation_statistic_id895080_year-on-year-change-in-cpi-in-turkey-2016-2024.xlsx",
    "usd_to_lira_statista.xlsx"
]

# Convert each file to JSON
for file in files:
    # Read the Excel file
    df = pd.read_excel(file)

    # Convert to JSON
    json_str = df.to_json(orient='records', indent=4)

    # Write to a .json file
    json_filename = os.path.splitext(file)[0] + '.json'
    with open(json_filename, 'w') as json_file:
        json_file.write(json_str)

print("Conversion complete!")
