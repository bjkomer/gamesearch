import requests
import xml.etree.ElementTree as ET
import csv
import os
import time
import json

def get_best_bgg_match(game_name, target_year=None):
    search_url = f"https://www.boardgamegeek.com/xmlapi2/search?query={game_name}&type=boardgame"
    response = requests.get(search_url)
    root = ET.fromstring(response.content)

    best_match = None
    for item in root.findall('item'):
        name_el = item.find("name")
        year_el = item.find("yearpublished")
        name = name_el.attrib.get("value", "") if name_el is not None else ""
        year = int(year_el.attrib.get("value", 0)) if year_el is not None else 0
        item_id = item.attrib["id"]

        if name.lower() == game_name.lower():
            if target_year is None or year == target_year:
                best_match = item_id
                break

        if best_match is None and ":" not in name:
            best_match = item_id

    return best_match

def get_bgg_image_data(game_name, target_year=None):
    game_id = get_best_bgg_match(game_name, target_year)
    if not game_id:
        return None

    details_url = f"https://www.boardgamegeek.com/xmlapi2/thing?id={game_id}&stats=1"
    response = requests.get(details_url)
    root = ET.fromstring(response.content)

    item = root.find("item")
    if item is None:
        return None

    image = item.find("image").text if item.find("image") is not None else ""
    thumbnail = item.find("thumbnail").text if item.find("thumbnail") is not None else ""

    return {
        "name": game_name,
        "id": game_id,
        "image": image,
        "thumbnail": thumbnail
    }

def download_image(url, path):
    try:
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            with open(path, 'wb') as f:
                for chunk in r.iter_content(1024):
                    f.write(chunk)
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def process_games(game_list, output_csv="bgg_images.csv", sleep_time=10):
    os.makedirs("../public/images/full", exist_ok=True)
    os.makedirs("../public/images/thumbnail", exist_ok=True)

    results = []

    for name in game_list:
        print(f"Processing: {name}")
        data = get_bgg_image_data(name)
        if data:
            results.append(data)

            # Safe file name
            safe_name = data['name'].lower().replace(" ", "_").replace(":", "")

            # Download full image
            if data["image"]:
                img_path = f"../public/images/full/{safe_name}.jpg"
                download_image(data["image"], img_path)

            # Download thumbnail
            if data["thumbnail"]:
                thumb_path = f"../public/images/thumbnail/{safe_name}_thumb.jpg"
                download_image(data["thumbnail"], thumb_path)

        else:
            print(f"Failed to find: {name}")

        time.sleep(sleep_time)  # Be kind to BGG's API

    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "id", "image", "thumbnail"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\n Done! CSV saved to {output_csv}, images saved in /images/")

# Your list of games
if __name__ == "__main__":

    with open("../data/boardgames.json", "r") as f:
        boardgames = json.load(f)

    game_names = [game["name"] for game in boardgames]

    process_games(game_names)