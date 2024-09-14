import os

import requests
import shutil
import json

version = "1.84.1.27"

itemData = ["actions.json",
            "blueprints.json",
            "collectibleResources.json",
            "equipmentItemTypes.json",
            "harvestLoots.json",
            "itemTypes.json",
            "itemProperties.json",
            "items.json",
            "jobsItems.json",
            "recipeCategories.json",
            "recipeIngredients.json",
            "recipeResults.json",
            "recipes.json",
            "resourceTypes.json",
            "resources.json",
            "states.json"]

for index, item in enumerate(itemData):

    url = "https://wakfu.cdn.ankama.com/gamedata/" + version + "/" + itemData[index]
    file_name = "../../datas/" + itemData[index]

    if not os.path.isfile(file_name):
        res = requests.get(url, stream=True)

        if res.status_code == 200:
            with open(file_name, 'wb') as f:
                shutil.copyfileobj(res.raw, f)
            print('Data sucessfully Downloaded: ', file_name)
            print(f'Data {index} of {len(itemData)}')
        else:
            print(f'Data couldn\'t be retrieved: {itemData[index]}')

itemFile = open('../../datas/items.json', encoding="utf8")
itemData = json.load(itemFile)

for index, item in enumerate(itemData):
    gfxId = str(item["definition"]["item"]["graphicParameters"]["gfxId"])

    url = "https://static.ankama.com/wakfu/portal/game/item/115/" + gfxId + ".png"
    file_name = gfxId + ".png"

    if not os.path.isfile(file_name):
        res = requests.get(url, stream=True)

        if res.status_code == 200:
            with open(file_name, 'wb') as f:
                shutil.copyfileobj(res.raw, f)
            print('Image sucessfully Downloaded: ', file_name)
            print(f'Image {index} of {len(itemData)}')
        else:
            print('Image Couldn\'t be retrieved')
            print(f'Image index {item["definition"]["item"]["id"]}')
