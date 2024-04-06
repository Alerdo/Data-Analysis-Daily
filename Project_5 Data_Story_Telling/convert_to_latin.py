import json

turkish_to_latin = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 
    'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ğ': 'G', 
    'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
}

def convert_city_names(geojson_data, conversion_map):
    for feature in geojson_data['features']:
        city_name = feature['properties']['name']
        for turk_char, lat_char in conversion_map.items():
            city_name = city_name.replace(turk_char, lat_char)
        feature['properties']['name'] = city_name
    return geojson_data

# Loadding GeoJson
geojson_file_path = 'Project_5 Data_Story_Telling\\turkish_cities.geojson'
with open(geojson_file_path, 'r', encoding='utf-8') as file:
    geojson_data = json.load(file)

# Convert to latin
geojson_data = convert_city_names(geojson_data, turkish_to_latin)

# Saving the updated GeoJSON data to a new file
updated_geojson_file_path = 'turkish_cities_latin.geojson'
with open(updated_geojson_file_path, 'w', encoding='utf-8') as file:
    json.dump(geojson_data, file)
