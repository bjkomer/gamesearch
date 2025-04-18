#!/usr/bin/env python3
"""
Script to update min_players, max_players, and play_time in src/data/boardgames.json
using the BoardGameGeek API.

Usage:
  python scripts/update_boardgames.py
"""
import json
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

DATA_FILE = "../src/data/boardgames.json"


def fetch_bgg_id(game_name):
    """Search BGG for the game and return its ID using standard library only."""
    query = urllib.parse.quote(game_name)
    url = f"https://boardgamegeek.com/xmlapi2/search?query={query}&type=boardgame"
    resp_xml = urllib.request.urlopen(url).read()
    root = ET.fromstring(resp_xml)
    items = root.findall('item')
    if not items:
        return None
    for item in items:
        for name_node in item.findall('name'):
            if name_node.get('value', '').lower() == game_name.lower():
                return item.get('id')
    return items[0].get('id')


def fetch_game_details(bgg_id):
    """Fetch game details from BGG by ID using standard library only."""
    url = f"https://boardgamegeek.com/xmlapi2/thing?id={bgg_id}&stats=1"
    resp_xml = urllib.request.urlopen(url).read()
    root = ET.fromstring(resp_xml)
    item = root.find('item')
    minp = int(item.find('minplayers').get('value'))
    maxp = int(item.find('maxplayers').get('value'))
    playtime = int(item.find('playingtime').get('value'))
    return minp, maxp, playtime


def main():
    # Load existing dataset
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        games = json.load(f)

    for game in games:
        name = game.get("name")
        print(f"Fetching data for: {name}")
        bgg_id = fetch_bgg_id(name)
        if not bgg_id:
            print(f"Could not find BGG ID for '{name}'")
            continue
        try:
            minp, maxp, playtime = fetch_game_details(bgg_id)
            game["min_players"] = minp
            game["max_players"] = maxp
            game["play_time"] = playtime
            print(f"Updated {name}: min={minp}, max={maxp}, time={playtime} mins")
        except Exception as e:
            print(f"Error for {name}: {e}")
        time.sleep(10)

    # Write back updated dataset
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(games, f, indent=4)
    print("All games updated successfully.")


if __name__ == "__main__":
    main() 