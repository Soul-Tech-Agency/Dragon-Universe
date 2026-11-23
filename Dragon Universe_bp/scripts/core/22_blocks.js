// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–5 de então, linhas 143–406.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { CONFIG as kK } from "../config/config.js";
import { iH, iR } from "./17_items_balls_fusion.js";
import { aF, aN, aQ, bK, bP } from "./01_util.js";
import { jC } from "./18_wishes.js";
import { eO } from "./08_fusion_regions.js";
function kL() {
  if (kK.BANNED_ITEMS.ENABLED) {
    for (let sG of kK.BANNED_ITEMS.ITEMS) iR.ban(sG);
  }
}
kL();
import { system as kM } from "@minecraft/server";
import { GameMode as kN } from "@minecraft/server";
var kO = { "dbe:kame_house_sign": 12 },
  kP = class {
    constructor() {
      this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract({ block: sG, player: sH }) {
      if (sH && sH.getGameMode() === kN.Creative) {
        let sI = Number(sG.permutation.getState("dbe:part")) + 1;
        sG.setPermutation(sG.permutation.withState("dbe:part", sI % (kO[sG.typeId] + 1)));
      }
    }
  };
import { BlockPermutation as kQ, GameMode as kR, system as kS, world as kT } from "@minecraft/server";
var kU = class {
  constructor() {
    (this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this)),
      (this.onTick = this.onTick.bind(this)),
      (this.onPlayerInteract = this.onPlayerInteract.bind(this));
  }
  beforeOnPlayerPlace(sG) {
    let sH = iH.getDragonBall(sG.permutationToPlace.type.id);
    sG.permutationToPlace = sG.permutationToPlace.withState("dbe:is_petrified", sH?.isPetrified ?? !0);
  }
  onTick({ block: sG, dimension: sH }) {
    try {
    let sI = iH.getDragonBall(sG.typeId);
    if (!sI) return;
    let { permutation: sK, typeId: sL } = sG,
      sM = sG.center(),
      sN = sK.getAllStates(),
      sO = sN["dbe:is_petrified"],
      sP = sI.requiredBalls - 1;
    if (sO !== void 0) {
      if (sO !== sI.isPetrified) {
        (sN["dbe:is_petrified"] = sI.isPetrified), sG.setPermutation(kQ.resolve(sG.typeId, sN));
        return;
      }
      if (!sO && kS.currentTick % 20 === 0) {
        let sQ = aF.getNearbyBlocks(sL, sH, sM, 1);
        if (!sQ.length) return;
        let sR = sQ.some((sT) => +(sT.permutation.getState("dbe:level") === sP)),
          sS = Math.min(sP, sQ.length - 1);
        (sN["dbe:level"] = sS),
          (sN["dbe:is_powered"] = sR),
          sG.setPermutation(kQ.resolve(sG.typeId, sN)),
          sS === sP &&
          kS.runTimeout(() => {
            try {
              const block = sH.getBlock({ x: Math.floor(sM.x), y: Math.floor(sM.y), z: Math.floor(sM.z) });
              if (block?.typeId === sL) {
                sH.spawnParticle("dbe:dragon_ball_warn", sM), sH.playSound("block.dragon_ball.glowing", sM);
              }
            } catch (error) {
              if (!aF.isUnavailable(error)) console.warn("[Dragon Universe] Dragon Ball effect failed: " + (error?.stack ?? error));
            }
          });
      }
    }
    } catch (error) {
      if (!aF.isUnavailable(error)) console.warn("[Dragon Universe] Dragon Ball tick failed: " + (error?.stack ?? error));
    }
  }
  onPlayerInteract({ block: sG, dimension: sH, player: sI }) {
    if (sI) {
      let sK = iH.getDragonBall(sG.typeId);
      if (!sK || sK.isPetrified) return;
      let sL = sG.center(),
        sM = aF.getNearbyBlocks(sG.typeId, sH, sL, 1).slice(0, sK.requiredBalls);
      if (sM.length === sK.requiredBalls) {
        jC.spawnShenronFromDragonBall(sI, sK, sH, sL);
        for (let sN of sM) sN.setType("minecraft:air");
        sI?.getGameMode() !== kR.Creative && sK.petrify();
      } else {
        if (sG.getItemStack()) {
          let sO = kT.getLootTableManager().generateLootFromBlock(sG);
          if ((sG.setType("minecraft:air"), sO)) {
            for (let sP of sO) sH.spawnItem(sP, sG.center());
          }
        }
      }
    }
  }
};
import { EquipmentSlot as kV, ItemStack as kW, system as kX } from "@minecraft/server";
import { ActionFormData as kY } from "@minecraft/server-ui";
var kZ = 15,
  l0 = 10,
  l1 = { "minecraft:coal": 1, "minecraft:charcoal": 1, "minecraft:coal_block": 9, "minecraft:lava_bucket": 14 },
  l2 = class {
    static applyRegionEffects(sG, sH) {
      sG.playSound("block.gravity_machine.ambient", sH), sG.spawnParticle("dbe:gravity_machine_delimitation", sH);
      for (let sI of sG.getPlayers({ location: sH, maxDistance: 8 })) aN.applyCameraShake(sI, 0.005, 1, !0);
    }
    static getFuel(sG) {
      return Number(sG.permutation.getState("dbe:fuel"));
    }
    static getLevel(sG) {
      return Number(sG.permutation.getState("dbe:level")) + 1;
    }
    static getGravityMachineId(sG) {
      let sH = sG.bottomCenter();
      return "gravity_machine:" + JSON.stringify(sH);
    }
    static getItemFuelValue(sG) {
      return l1[sG] ?? 0;
    }
    static isEnabled(sG) {
      return sG.permutation.getState("dbe:is_powered");
    }
    static setFuel(sG, sH) {
      let sI = Math.min(sH, kZ);
      sG.setPermutation(sG.permutation.withState("dbe:fuel", sI));
    }
    static setLevel(sG, sH) {
      let sI = Math.min(sH, l0);
      sG.setPermutation(sG.permutation.withState("dbe:level", sI));
    }
    static setPoweredState(sG, sH) {
      sG.permutation.getState("dbe:is_powered") !== sH &&
        (sG.setPermutation(sG.permutation.withState("dbe:is_powered", sH)),
        this.updateRegion(sG),
        sH
          ? sG.dimension.playSound("beacon.activate", sG.location)
          : sG.dimension.playSound("beacon.deactivate", sG.location));
    }
    static showMenu(sG, sH) {
      let sI = this.getLevel(sH) + 1,
        sK = this.getFuel(sH),
        sL = new kY();
      sL.title("ui.dbe.gravity_machine.title"),
        sL.body({ translate: "ui.dbe.gravity_machine.text", with: [sK + "\n", sI + "\n\n"] });
      for (let sM = 0; sM < l0 - 1; sM++) sL.button("x" + (sM + 2));
      sL.show(sG).then((sN) => {
        if (sN.selection !== void 0) {
          let sO = sN.selection,
            sP = sI;
          this.setLevel(sH, sO), this.showMenu(sG, sH);
          let sQ = sH.center();
          sH.dimension.playSound("ui.upgrade", sQ), sP !== sO && this.updateRegion(sH);
        }
      });
    }
    static tryConsumeSlotItemAsFuel(sG, sH) {
      let sI = sH.getItem();
      if (!sI) return !1;
      let sK = this.getFuel(sG);
      if (sK >= kZ) return !1;
      let sL = this.getItemFuelValue(sI.typeId);
      return !sL || sK + sL > kZ
        ? !1
        : (this.setFuel(sG, sK + sL),
          sG.dimension.playSound("respawn_anchor.charge", sG.center()),
          sI.typeId === "minecraft:lava_bucket"
            ? sH.setItem(new kW("minecraft:bucket"))
            : sH.amount === 1
              ? sH.setItem(void 0)
              : sH.amount--,
          !0);
    }
    static updateRegion(sG) {
      let sH = this.getGravityMachineId(sG);
      if (this.isEnabled(sG)) {
        let sI = eO(sG.dimension),
          sK = sG.bottomCenter(),
          { x: sL, y: sM, z: sN } = sK;
        sI.setRegionAsync({
          id: sH,
          dimensionId: sG.dimension.id,
          gravity: this.getLevel(sG),
          pos1: new bP(sL - 8, sM, sN - 8),
          pos2: new bP(sL + 8, sM + 16, sN + 8),
          allowQuests: !1,
        });
      } else eO(sG.dimension).remove(sH);
    }
  },
  l3 = class {
    constructor() {
      (this.onPlayerInteract = this.onPlayerInteract.bind(this)),
        (this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this)),
        (this.onTick = this.onTick.bind(this));
    }
    onTick({ block: sG, dimension: sH }) {
      if (sG.isValid) {
        let sI = sG.permutation.getState("dbe:is_powered"),
          sK = l2.getFuel(sG);
        if (kX.currentTick % 8 === 0) {
          let sL = sG.offset(new bP(0, 1, 0)),
            sM = sL && sL.typeId === "minecraft:hopper" && sL.permutation.getState("facing_direction") === 0;
          if (sK < kZ && sM) {
            let sN = sL.getComponent("minecraft:inventory")?.container;
            if (sN)
              for (let sO = 0; sO < sN.size; sO++) {
                let sP = sN.getSlot(sO);
                if (l2.tryConsumeSlotItemAsFuel(sG, sP)) break;
              }
          }
        }
        if (sI) {
          let sQ = sG.bottomCenter(),
            sR = Math.floor(500 / l2.getLevel(sG)),
            sS = l2.getGravityMachineId(sG);
          sK || l2.setPoweredState(sG, !1),
            kX.currentTick % sR === 0 && l2.setFuel(sG, sK - 1),
            kX.currentTick % 20 === 0 && l2.applyRegionEffects(sH, sQ),
            kX.runTimeout(() => {
              sG.isValid && sG.typeId !== "dbe:gravity_machine" && eO(sH).remove(sS);
            }, 1);
        }
      }
    }
    onPlayerInteract({ block: sG, player: sH }) {
      if (sH && !sH.isSneaking) {
        let sI = sH?.getComponent("minecraft:equippable");
        if (sI) {
          let sK = sI.getEquipmentSlot(kV.Mainhand);
          if (l2.tryConsumeSlotItemAsFuel(sG, sK)) return;
        }
        l2.showMenu(sH, sG);
      }
    }
    onRedstoneUpdate({ block: sG, powerLevel: sH }) {
      let sI = l2.isEnabled(sG),
        sK = l2.getFuel(sG);
      !sI && sH && sK && l2.setPoweredState(sG, !0), sI && !sH && l2.setPoweredState(sG, !1);
    }
  };
import { Direction as l4, EquipmentSlot as l5 } from "@minecraft/server";
var l6 = class {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract({ block: sG, face: sH, player: sI }) {
    if (sH === l4.Up && sI) {
      let { permutation: sK } = sG;
      if (!!!sK.getState("dbe:double_bit") && aN.getEquippedItem(sI, l5.Mainhand)?.typeId === sG.typeId) {
        let sL = sG.permutation.withState("dbe:double_bit", !0);
        sG.setPermutation(sL), aQ.decrementStack(sI);
      }
    }
  }
};
bK.setEnabledBlockComponents([
  "solariscore:crop",
  "solariscore:door",
  "solariscore:grass",
  "solariscore:leaves",
  "solariscore:particle_emitter",
  "solariscore:sapling",
]),
  kM.beforeEvents.startup.subscribe(({ blockComponentRegistry: sG }) => {
    sG.registerCustomComponent("dbe:change_part", new kP()),
      sG.registerCustomComponent("dbe:dragon_ball", new kU()),
      sG.registerCustomComponent("dbe:gravity_machine", new l3()),
      sG.registerCustomComponent("dbe:slab", new l6());
  });
export { kL, kO, kP, kU, kZ, l0, l1, l2, l3, l6 };
