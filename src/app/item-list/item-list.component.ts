import { Component } from '@angular/core';
import ITEMDATA from '../datas/items.json';
import EQUIPMENTTYPES from '../datas/equipmentItemTypes.json';
import ITEMTYPES from '../datas/itemTypes.json';

import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent {
  constructor(private sanitizer:DomSanitizer) {}

  preItems = ITEMDATA as any;
  equipmentTypes = EQUIPMENTTYPES as any;
  itemTypes = ITEMTYPES as any;

  items = this.preItems.filter((item: { definition: { item: { baseParameters: { itemTypeId: number; }; }; }; }) => !this.isResource(this.getParentIdById(item.definition.item.baseParameters.itemTypeId)) && !this.isPetOrMount(this.getParentIdById(item.definition.item.baseParameters.itemTypeId)) && !this.isCosmetics(this.getParentIdById(item.definition.item.baseParameters.itemTypeId)));

  itemLength = this.items.length;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [20, 50, 100];

  pageEvent: PageEvent = new PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.itemLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  getPaginatedList(start: any, end: any) {
    return this.items.slice(start, end);
  }

  getRarity(id: number) {
    // Takes rarity id
    switch(id) {
      case 0:
        return "Common";
      case 1:
        return "Unusual";
      case 2:
        return "Rare";
      case 3:
        return "Mythical";
      case 4:
        return "Legendary";
      case 5:
        return "Relic";
      case 6:
        return "Souvenir";
      case 7:
        return "Epique";
      default:
        return "N/A";
    }
  }

  getRarityColor(id: number) {
    // Takes rarity id
    switch(id) {
      case 0:
        return "gray";
      case 1:
        return "whitesmoke";
      case 2:
        return "springgreen";
      case 3:
        return "orange";
      case 4:
        return "khaki";
      case 5:
        return "fuchsia";
      case 6:
        return "lightskyblue";
      case 7:
        return "lightpink";
      default:
        return "red";
    }
  }

  getEffectColumnOne(id: number) {
    for (let item of this.items) {
      if (item.definition.item.id == id) {
        let effectLen = item.definition.equipEffects.length
        let colOneLen = Math.round(effectLen/2)
        return item.definition.equipEffects.slice(0, colOneLen)
      }
    }
    return 0
  }

  getEffectColumnTwo(id: number) {
    for (let item of this.items) {
      if (item.definition.item.id == id) {
        let effectLen = item.definition.equipEffects.length
        let colOneLen = Math.round(effectLen/2)
        return item.definition.equipEffects.slice(colOneLen, effectLen)
      }
    }
    return 0
  }

  getEquipTypeById(id: number) {
    // Equip id, not item id
    for (let itemType of this.itemTypes) {
      if (itemType.definition.id == id) {
        return itemType.title.en;
      }
    }
    for (let eqType of this.equipmentTypes) {
      if (eqType.definition.id == id) {
        return eqType.title.en;
      }
    }
    return id;
  }

  getParentIdById(id: number) {
    // Equip id, not item id
    for (let itemType of this.itemTypes) {
      if (itemType.definition.id == id) {
        return itemType.definition.parentId;
      }
    }
    for (let eqType of this.equipmentTypes) {
      if (eqType.definition.id == id) {
        return eqType.definition.parentId;
      }
    }
    return "-1";
  }

  isEquipmentById(id: number) {
    // Takes normal item id
    let pId = this.getParentIdById(id);
    return this.isEquipment(pId);
  }

  isEquipment(id: number) {
    // Takes parentId, not id
    return id == 109 || this.isBag(id) || this.isWeapon(id) || this.isArmor(id) || this.isAccessory(id);
  }

  isWeapon(id: number) {
    // Takes parentId, not id
    return id == 100 || this.isOneHandWeapon(id) || this.isTwoHandWeapon(id) || this.isSecondHandWeapon(id);
  }

  isOneHandWeapon(id: number) {
    // Takes parentId, not id
    return id == 518;
  }

  isTwoHandWeapon(id: number) {
    // Takes parentId, not id
    return id == 519;
  }

  isSecondHandWeapon(id: number) {
    // Takes parentId, not id
    return id == 520;
  }

  isBag(id: number) {
    // Takes parentId, not id
    return id == 218;
  }

  isArmor(id: number) {
    // Takes parentId, not id
    return id == 118;
  }

  isAccessory(id: number) {
    // Takes parentId, not id
    return id == 521;
  }

  isResource(id: number) {
    // Takes parentId, not id
    return id == 226 || this.isImprovement(id);
  }

  isImprovement(id: number) {
    // Takes parentId, not id
    return id == 602;
  }

  isPetOrMount(id: number) {
    // Takes parentId, not id
    return id == 420;
  }

  isPet(id: number) {
    // Takes normal id
    return id == 582;
  }

  isMount(id: number) {
    // Takes normal id
    return id == 611;
  }

  isCosmetics(id: number) {
    // Takes parentId, not id
    return id == 525;
  }


  // Filter only equipment through
  // By Id:
  // 101 - Ax (two hands)
  // 103 - Ring
  // 108 - Wand (one hand)
  // 110 - Sword (one hand)
  // 111 - Shovel (two hands)
  // 112 - Dagger (other hand)
  // 113 - Staff (one hand)
  // 114 - Hammer (two hands)
  // 115 - Clock Hand (one hand)
  // 117 - Bow (two hands)
  // 119 - Boots
  // 120 - Amulet
  // 132 - Cloak
  // 133 - Belt
  // 134 - Helmet
  // 136 - Breastplate
  // 138 - Epaulettes
  // 189 - Shield (other hand)
  // 219 - Fist
  // 223 - Sword (two hands)
  // 253 - Staff (two hands)
  // 254 - Cards (one hand)
  // 480 - Torches
  // 518 - One-Handed Weapons
  // 519 - Two-Handed Weapons
  // 520 - Second Hand
  // 537 - Tools
  // 582 - Pets
  // 611 - Mounts
  // 646 - Emblem
  // 647 - Costumes
}
