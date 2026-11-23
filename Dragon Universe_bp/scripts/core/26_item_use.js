// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–3 de então, linhas 164–217.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { d4 } from "./05_db_cooldowns.js";
import { aQ, bK } from "./01_util.js";
import { system as pA, Player as pS } from "@minecraft/server";
import { pO, pP, pQ, pR } from "./25_terrain_generator.js";
import { iz } from "./17_items_balls_fusion.js";
import { g9 } from "./12_quests.js";
function pT(sG, sH) {
  let sI = sG.getViewDirection(),
    sK = d4("dbe:flying_nimbus", sG.dimension, sG.location, {
      spawnEvent: sH === "black" ? "dbe:black_flying_nimbus" : void 0,
    });
  sK &&
    (sK.getComponent("minecraft:rideable")?.addRider(sG),
    sK.setRotation(sI),
    sK.applyImpulse(sI),
    aQ.decrementStack(sG));
}
var pU = class {
  constructor() {
    this.onUse = this.onUse.bind(this);
  }
  onUse({ source: sG }, { params: sH }) {
    if (sG instanceof pS) {
      let { color: sI } = sH;
      pT(sG, sI);
    }
  }
};
import { EquipmentSlot as pV } from "@minecraft/server";
var pW = class {
  constructor() {
    this.onUse = this.onUse.bind(this);
  }
  onUse({ source: sG, itemStack: sH }) {
    let sI = sG.getComponent("minecraft:equippable");
    if (sI) {
      let sK = sI.getEquipmentSlot(pV.Mainhand),
        sL = sI.getEquipmentSlot(pV.Offhand);
      sK.setItem(sL.getItem()), sL.setItem(sH), sG.dimension.playSound("armor.equip_generic", sG.location);
    }
  }
};
bK.setEnabledItemComponents(["solariscore:durability_sensor"]),
  pA.beforeEvents.startup.subscribe(({ itemComponentRegistry: sG }) => {
    sG.registerCustomComponent("dbe:angel_staff", new pO()),
      sG.registerCustomComponent("dbe:attribute_upgrade", new pP()),
      sG.registerCustomComponent("dbe:bansho_fan", new pQ()),
      sG.registerCustomComponent("dbe:consumable_buff", new pR()),
      sG.registerCustomComponent("dbe:flying_nimbus", new pU()),
      sG.registerCustomComponent("dbe:hoi_poi_capsule", new iz()),
      sG.registerCustomComponent("dbe:keep_on_death", {}),
      sG.registerCustomComponent("dbe:patreon", {}),
      sG.registerCustomComponent("dbe:scouter", {}),
      sG.registerCustomComponent("dbe:weight", new pW());
  });
import { masters_data as pX } from "../data/masters_data.js";
function pY() {
  for (let sG of pX) g9.registerMaster(sG);
}
pY();
export { pT, pU, pW, pY };
