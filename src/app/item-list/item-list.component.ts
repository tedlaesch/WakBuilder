import { Component } from '@angular/core';
import ITEMDATA from '../datas/items.json';
import EQUIPMENTTYPES from '../datas/equipmentItemTypes.json';
import ITEMTYPES from '../datas/itemTypes.json';
import ACTIONS from '../datas/actions.json';
import JOBS from '../datas/recipeCategories.json';
import STATES from '../datas/states.json'

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
  actions = ACTIONS as any;
  jobs = JOBS as any;
  states = STATES as any;

  itemSource = this.preItems.filter((item: { definition: { item: { baseParameters: { itemTypeId: number; }; }; }; }) => !this.isResource(this.getParentIdById(item.definition.item.baseParameters.itemTypeId)) && !this.isCosmetics(this.getParentIdById(item.definition.item.baseParameters.itemTypeId)));

  items = this.itemSource;

  itemLength = this.items.length;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [20, 50, 100];

  levelSliderStartValue = 0;
  levelSliderEndValue = 230;

  ordering:any = {};

  attSortOrder = [
    31,
    56,

    41,
    42,
    57,

    160,
    161,

    191,
    192,
    194,

    184,
    
    20,

    173,
    174,

    175,
    176,

    875,
    876,

    122,
    132,

    124,

    123,

    125,

    1068,

    120,
    130,

    26,

    1055,
    1061,

    149,
    1056,

    180,
    181,

    1052,
    1059,

    1053,
    1060,

    150,
    168,

    177,

    39,
    40,

    82,
    97,

    83,
    98,

    84,
    96,

    85,

    1069,

    80,
    90,
    100,

    988,
    1062,

    71,
    1063,

    304
  ];

  attList:string[] = [
    "AP",
    "MP",
    "Range",
    "WP",
    "Control",
    "HP",
    "Lock",
    "Dodge",
    "Block",
    "Fire Mastery",
    "Water Mastery",
    "Earth Mastery",
    "Air Mastery",
    "Mastery of 3 Random Elements",
    "Mastery of 2 Random Elements",
    "Mastery of 1 Random Element",
    "Elemental Mastery",
    "Healing Mastery",
    "Berserk Mastery",
    "Critical Mastery",
    "Rear Mastery",
    "Melee Mastery",
    "Distance Mastery",
    "Critical Hit",
    "Force of Will",
    "Armor Given",
    "Armor Received",
    "Fire Resistance",
    "Water Resistance",
    "Earth Resistance",
    "Air Resistance",
    "Resistance to 3 Random Elements",
    "Resistance to 2 Random Elements",
    "Resistance to 1 Random Element",
    "Elemental Resistance",
    "Critical Resistance",
    "Rear Resistance"
  ]

  selectedAtts:string[] = [];

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

  getPaginatedHeight() {
    let pageArr = this.items.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    let biggestLen = 0;
    for (let i of pageArr) {
      if (i.definition.equipEffects.length > biggestLen) {
        biggestLen = i.definition.equipEffects.length;
      }
    }
    let newHeight = ((biggestLen + 4) * 20) + 215;
    return newHeight;
  }

  applySearch(text: string, levelStart: any, levelEnd: any, typeArr: any, rarityArr: any) {
    /*
    helmet
    amulet
    breastplate
    ring
    boots
    cape
    epaulettes
    belt
    onehand
    twohand
    otherhand
    mount
    pet
    emblem
    tool
    */
    let start = parseInt(levelStart);
    let end = parseInt(levelEnd);
    let newItemArr = [];
    for (let item of this.itemSource) {
      let curItemType = item.definition.item.baseParameters.itemTypeId;
      let curItemParentType = this.getParentIdById(curItemType);
      let curItemRarity = item.definition.item.baseParameters.rarity;
      let curItemAttArr = item.definition.equipEffects;

      if (item.definition.item.level >= start && item.definition.item.level <= end) {
        if (!rarityArr.every((v: boolean) => v == false)) {
          if (rarityArr[0] && curItemRarity == 1) {}
          else if (rarityArr[1] && curItemRarity == 2) {}
          else if (rarityArr[2] && curItemRarity == 3) {}
          else if (rarityArr[3] && curItemRarity == 4) {}
          else if (rarityArr[4] && curItemRarity == 5) {}
          else if (rarityArr[5] && curItemRarity == 6) {}
          else if (rarityArr[6] && curItemRarity == 7) {}
          else {
            continue;
          }
        }

        if (!typeArr.every((v: boolean) => v == false)) {
          if (typeArr[0] && this.isHelmet(curItemType)) {}
          else if (typeArr[1] && this.isAmulet(curItemType)) {}
          else if (typeArr[2] && this.isBreastplate(curItemType)) {}
          else if (typeArr[3] && this.isRing(curItemType)) {}
          else if (typeArr[4] && this.isBoots(curItemType)) {}
          else if (typeArr[5] && this.isCape(curItemType)) {}
          else if (typeArr[6] && this.isEpaulettes(curItemType)) {}
          else if (typeArr[7] && this.isBelt(curItemType)) {}
          else if (typeArr[8] && this.isOneHandWeapon(curItemParentType)) {}
          else if (typeArr[9] && this.isTwoHandWeapon(curItemParentType)) {}
          else if (typeArr[10] && this.isSecondHandWeapon(curItemParentType)) {}
          else if (typeArr[11] && this.isMount(curItemType)) {}
          else if (typeArr[12] && this.isPet(curItemType)) {}
          else if (typeArr[13] && this.isEmblem(curItemType)) {}
          else if (typeArr[14] && this.isTool(curItemType)) {}
          else {
            continue;
          }
        }

        if(this.selectedAtts.length > 0){
          if (this.selectedAtts.includes("AP") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 31)) {continue;}
          if (this.selectedAtts.includes("MP") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 41)) {continue;}
          if (this.selectedAtts.includes("Range") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 160)) {continue;}
          if (this.selectedAtts.includes("WP") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 191)) {continue;}
          if (this.selectedAtts.includes("Control") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 184)) {continue;}
          if (this.selectedAtts.includes("HP") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 20)) {continue;}
          if (this.selectedAtts.includes("Lock") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 173)) {continue;}
          if (this.selectedAtts.includes("Dodge") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 175)) {continue;}
          if (this.selectedAtts.includes("Block") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 875)) {continue;}
          if (this.selectedAtts.includes("Fire Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 122)) {continue;}
          if (this.selectedAtts.includes("Water Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 124)) {continue;}
          if (this.selectedAtts.includes("Earth Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 123)) {continue;}
          if (this.selectedAtts.includes("Air Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 125)) {continue;}
          if (this.selectedAtts.includes("Mastery of 3 Random Elements") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1068 && effect.effect.definition.params[2] == 3)) {continue;}
          if (this.selectedAtts.includes("Mastery of 2 Random Elements") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1068 && effect.effect.definition.params[2] == 2)) {continue;}
          if (this.selectedAtts.includes("Mastery of 1 Random Element") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1068 && effect.effect.definition.params[2] == 1)) {continue;}
          if (this.selectedAtts.includes("Elemental Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 120)) {continue;}
          if (this.selectedAtts.includes("Healing Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 26)) {continue;}
          if (this.selectedAtts.includes("Berserk Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 1055)) {continue;}
          if (this.selectedAtts.includes("Critical Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 149)) {continue;}
          if (this.selectedAtts.includes("Rear Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 180)) {continue;}
          if (this.selectedAtts.includes("Melee Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 1052)) {continue;}
          if (this.selectedAtts.includes("Distance Mastery") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 1053)) {continue;}
          if (this.selectedAtts.includes("Critical Hit") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 150)) {continue;}
          if (this.selectedAtts.includes("Force of Will") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 177)) {continue;}
          if (this.selectedAtts.includes("% Armor Given") && !curItemAttArr.some((effect: { definition: any; effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 39 && effect.definition.params[4] == 120)) {continue;}
          if (this.selectedAtts.includes("% Armor Received") && !curItemAttArr.some((effect: { definition: any; effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 39 && effect.definition.params[4] == 121)) {continue;}
          if (this.selectedAtts.includes("Fire Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 82)) {continue;}
          if (this.selectedAtts.includes("Water Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 83)) {continue;}
          if (this.selectedAtts.includes("Earth Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 84)) {continue;}
          if (this.selectedAtts.includes("Air Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 85)) {continue;}
          if (this.selectedAtts.includes("Resistance to 3 Random Elements") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1069 && effect.effect.definition.params[2] == 3)) {continue;}
          if (this.selectedAtts.includes("Resistance to 2 Random Elements") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1069 && effect.effect.definition.params[2] == 2)) {continue;}
          if (this.selectedAtts.includes("Resistance to 1 Random Element") && !curItemAttArr.some((effect: { effect: { definition: { params: any; actionId: number; }; }; }) => effect.effect.definition.actionId == 1069 && effect.effect.definition.params[2] == 1)) {continue;}
          if (this.selectedAtts.includes("Elemental Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 80)) {continue;}
          if (this.selectedAtts.includes("Critical Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 988)) {continue;}
          if (this.selectedAtts.includes("Rear Resistance") && !curItemAttArr.some((effect: { effect: { definition: { actionId: number; }; }; }) => effect.effect.definition.actionId == 71)) {continue;}
        }

        if (item.title.en.toLowerCase() == text.toLowerCase()) {
          newItemArr.unshift(item);
        } else if (item.title.en.toLowerCase().includes(text.toLowerCase())) {
          newItemArr.push(item);
        }
      }
    }
    this.items = newItemArr;
    this.pageIndex = 0;
    this.itemLength = this.items.length;
  }

  getLevelFromId(id: any) {
    for (let item of this.items) {
      if (item.definition.item.id == id) {
        if (id == 12195) {
          return 100;
        }
        if (this.isPet(item.definition.item.baseParameters.itemTypeId)) {
          if (item.definition.item.id == 12237 || item.definition.item.id == 26673 || item.definition.item.id == 26674 || item.definition.item.id == 26675 || item.definition.item.id == 26676 || item.definition.item.id == 26677) {
            return 25;
          }
          if (item.definition.item.id == 20274) {
            return 0;
          }
          return 50;
        }
        return item.definition.item.level;
      }
    }
    return id;
  }

  getTextFromEffect(ef: any, sourcedFrom: any) {
    for (let action of this.actions) {
      if (ef.effect.definition.actionId == action.definition.id) {
        let paramArr = ef.effect.definition.params;
        let acId = ef.effect.definition.actionId;
        
        if (acId == 1068) {
          return paramArr[2] > 1 ? `${paramArr[0]} Mastery of ${paramArr[2]} random elements` : `${paramArr[0]} Mastery of ${paramArr[2]} random element`;
        } else if (acId == 42) {
          return `-${paramArr[0]} MP`;
        } else if (acId == 1069) {
          return paramArr[2] > 1 ? `${paramArr[0]} Resistance to ${paramArr[2]} random elements` : `${paramArr[0]} Resistance to ${paramArr[2]} random element`;
        } else if (acId == 39) {
          if (paramArr[4] == 121) {
            return `${Math.round(paramArr[0] + (paramArr[1] * this.getLevelFromId(sourcedFrom.definition.item.id)))} Armor received`;
          } else {
            return `${Math.round(paramArr[0] + (paramArr[1] * this.getLevelFromId(sourcedFrom.definition.item.id)))} Armor given`;
          }
        } else if (acId == 2001) {
          return `${paramArr[0]}% Harvesting Quantity in ${this.getJobTypeById(paramArr[2])}`;
        } else if (acId == 21) {
          return `-${paramArr[0]} Health Points`;
        } else if (acId == 400) {
          for (let sourceEffect of sourcedFrom.definition.equipEffects) {
            if (sourceEffect.effect.definition.actionId == 400) {
              if (sourceEffect.effect.hasOwnProperty('description')) {
                return sourceEffect.effect.description.en;
              }
              return "";
            }
          }
        } else if (acId == 1020) {
          return ef.effect.description.en.replace("|[#7.3]*100|", "10");
        } else if (acId == 304) {
          // Applies state to item 
          // ...ugh
          for (let state of this.states) {
            if (state.definition.id == paramArr[0]) {
              return `State: ${state.title.en}`;
            }
          }
        } else if (acId == 832) {
          switch(paramArr[0]) {
            case 1:
              return `${paramArr[2]} Lvl. to Fire spells`
            case 2:
              return `${paramArr[2]} Lvl. to Water spells`
            case 3:
              return `${paramArr[2]} Lvl. to Earth spells`
            case 4:
              return `${paramArr[2]} Lvl. to Air spells`
          }
        }
        else {
          try {
            return action.description.en.replace("[#1]", Math.round(paramArr[0] + (paramArr[1] * this.getLevelFromId(sourcedFrom.definition.item.id)))).replace("[el1]", "Fire").replace("[el2]", "Water").replace("[el3]", "Earth").replace("[el4]", "Air")
          } catch {
            return `!!! Error in actionID ${acId} !!!`
          }
          //return action.description.en.replace("[#1]", paramArr[0]).replace("[el1]", "Fire").replace("[el2]", "Water").replace("[el3]", "Earth").replace("[el4]", "Air")
        }
      }
    }
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
        return "Epic";
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

  isEven(n: number) {
      return n % 2 == 0;
  }

  getEffects(id: number) {
    for (let item of this.items) {
      if (item.definition.item.id == id) {
        let effectArr = item.definition.equipEffects

        for (let i = 0; i < this.attSortOrder.length; i++) {
          this.ordering[this.attSortOrder[i]] = i;
        }
        effectArr.sort((a: any, b: any) => {
          return (this.ordering[a.effect.definition.actionId] - this.ordering[b.effect.definition.actionId]);
        })
        return effectArr
      }
    }
    return 0
  }

  getJobTypeById(id: number) {
    for (let job of this.jobs) {
      if (job.definition.id == id) {
        return job.title.en;
      }
    }
    return id;
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
    // Takes normal item itemTypeId
    let pId = this.getParentIdById(id);
    return this.isEquipment(pId);
  }

  isEquipment(id: number) {
    // Takes parentId, not itemTypeId
    return id == 109 || this.isBag(id) || this.isWeapon(id) || this.isArmor(id) || this.isAccessory(id);
  }

  isWeapon(id: number) {
    // Takes parentId, not itemTypeId
    return id == 100 || this.isOneHandWeapon(id) || this.isTwoHandWeapon(id) || this.isSecondHandWeapon(id);
  }

  isOneHandWeapon(id: number) {
    // Takes parentId, not itemTypeId
    return id == 518;
  }

  isTwoHandWeapon(id: number) {
    // Takes parentId, not itemTypeId
    return id == 519;
  }

  isSecondHandWeapon(id: number) {
    // Takes parentId, not itemTypeId
    return id == 520;
  }

  isBag(id: number) {
    // Takes parentId, not itemTypeId
    return id == 218;
  }

  isArmor(id: number) {
    // Takes parentId, not itemTypeId
    return id == 118;
  }

  isAccessory(id: number) {
    // Takes parentId, not itemTypeId
    return id == 521;
  }

  isResource(id: number) {
    // Takes parentId, not itemTypeId
    return id == 226 || this.isImprovement(id);
  }

  isImprovement(id: number) {
    // Takes parentId, not itemTypeId
    return id == 602;
  }

  isCosmetics(id: number) {
    // Takes parentId, not itemTypeId
    return id == 525;
  }

  isPetOrMount(id: number) {
    // Takes parentId, not itemTypeId
    return id == 420;
  }

  isPet(id: number) {
    // Takes itemTypeId
    return id == 582;
  }

  isMount(id: number) {
    // Takes itemTypeId
    return id == 611;
  }

  isHelmet(id: number) {
    // Takes itemTypeId
    return id == 134;
  }

  isAmulet(id: number) {
    // Takes itemTypeId
    return id == 120;
  }

  isBreastplate(id: number) {
    // Takes itemTypeId
    return id == 136;
  }

  isRing(id: number) {
    // Takes itemTypeId
    return id == 103;
  }

  isBoots(id: number) {
    // Takes itemTypeId
    return id == 119;
  }

  isCape(id: number) {
    // Takes itemTypeId
    return id == 132;
  }

  isEpaulettes(id: number) {
    // Takes itemTypeId
    return id == 138;
  }
  
  isBelt(id: number) {
    // Takes itemTypeId
    return id == 133;
  }

  isEmblem(id: number) {
    // Takes itemTypeId
    return id == 646;
  }

  isTool(id: number) {
    // Takes itemTypeId
    return id == 537;
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
