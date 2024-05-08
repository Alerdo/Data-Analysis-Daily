import geopandas as gpd
import pandas as pd
import json

# Load the GeoJSON into a GeoDataFrame
gdf = gpd.read_file('C:\\Users\\alerd\\Studying Plan\\Data Analysis Daily\\Project_5 Data_Story_Telling\\turkish_cities_latin.geojson')
# To fix error of the timestamps
gdf['created_at'] = gdf['created_at'].astype(str)
gdf['updated_at'] = gdf['updated_at'].astype(str)
# Load your DataFrame (assuming it's a CSV)
df = pd.read_excel('C:\\Users\\alerd\\Studying Plan\\Data Analysis Daily\\Project_5 Data_Story_Telling\\Data & Analysis\\Data\\elections_2024_cleaned.xlsx')

# Merge the GeoDataFrame with your DataFrame
merged = gdf.merge(df, left_on='name', right_on='CITY')

# Convert to JSON
merged_json = json.loads(merged.to_json())

# Save to a new JSON file (optional, if you want to load it directly in JavaScript)
with open('merged_data_2024.geojson', 'w') as f:
    json.dump(merged_json, f)



