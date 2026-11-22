// Núcleo do Dragon Universe.
// Gerado por tools/deobfuscate-core.mjs a partir da versão ofuscada (commit 2d4f628): textos decodificados e
// código formatado, sem mudança de lógica. Os nomes curtos de variáveis vêm do ofuscador e não puderam ser recuperados.
import "./core/perf.js"; // primeiro import: a sonda (CONFIG.DEBUG_PERF) envolve os agendadores antes dos módulos
import { every } from "./core/scheduler.js"; // relógio único das tarefas gerais (O3-12: G1-G6)
import { late, bindLate } from "./core/late.js"; // ligação tardia (O4.0)
import "./kaioshin_dimension.js";
import "./other_world_kai.js";
import "./world_structures.js";
import "./hell_dimension.js";
import "./universe_6_dimension.js";
import "./world_spawn_policy.js";
import { safeTeleport as duSafeTeleport, isTravelPending as duIsTravelPending,
  acquireLoadedArea as duAcquireLoadedArea, releaseLoadedArea as duReleaseLoadedArea,
  safeReturnToEarth as duSafeReturnToEarth,
  physicalDestinationId as duPhysicalDestinationId, isSafeStanding as duIsSafeStanding,
  reportTravelFailure as duReportTravelFailure } from "./travel_safety.js";
import { initializeFutureTerrain, prepareFutureCity } from "./future_terrain.js";
import { duTravel } from "./core/du_travel.js"; // O4.0-1: movido do segmento 0, como estava
import { recordBossKill as duRecordBossKill, listDefeated as duListDefeated, BOSS_IDS as DU_BOSS_IDS } from "./progression/progression.js";
import { namekDragonBallSpot as __nbl } from "./namek_dimension.js";
import { raceInfo as duRaceInfo, firstFormsRawtext as duFirstFormsRawtext } from "./race_info.js";
import { dragonBallsData as d } from "./data/dragon_balls_data.js";
import {
  EntityComponentTypes as g,
  EntitySwingSource as i,
  EquipmentSlot as l,
  Player as m,
  system as n,
  world as o,
} from "@minecraft/server";
import { system as r } from "@minecraft/server";
import "@minecraft/server";
import { EquipmentSlot as s, GameMode as t, ItemStack as C } from "@minecraft/server";
import { system as G, world as Z } from "@minecraft/server";
import { system as a0 } from "@minecraft/server";
import {
  EquipmentSlot as a1,
  GameMode as a2,
  ItemLockMode as a3,
  ItemStack as a4,
  Player as a5,
} from "@minecraft/server";
import { Direction as a6 } from "@minecraft/server";
import { TimeOfDay as a7, world as a8 } from "@minecraft/server";
import { BlockPermutation as a9 } from "@minecraft/server";
import { EquipmentSlot as ab, GameMode as af, system as aj, world as ak } from "@minecraft/server";
import { MolangVariableMap as ap, world as aq } from "@minecraft/server";
import { world as av } from "@minecraft/server";
import { EquipmentSlot as aw, GameMode as ax } from "@minecraft/server";
import { Entity as ay, system as az, World as aA } from "@minecraft/server";
import { bZ as aT, c0 as aU, c1 as aV, c2 as aW, c3 as aX, c4 as aY, c5 as aZ, c6 as b0, c7 as b1, c8 as b2, c9 as b3, cb as b4 } from "./vendor/vanilla_data.js"; // vanilla-data: nomes da antiga cópia A, agora apelidos da B (O1 passo 2)
import { aF, aH, aI, aM, aN, aO, aQ, aR, aS, b5, bG, bK, bL, bM, bN, bO, bP } from "./core/01_util.js"; // O4: movido do index.js
import { BlockVolume as bQ } from "@minecraft/server";
import { Player as bR, system as bS, world as bT } from "@minecraft/server";
import {
  EquipmentSlot as bU,
  GameMode as bV,
  InputPermissionCategory as bW,
  system as bX,
  world as bY,
} from "@minecraft/server";
import { bZ, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, cb } from "./vendor/vanilla_data.js"; // vanilla-data, cópia única (O1 passo 2)
import { CONFIG as ck } from "./config/config.js"; // O4: import que ficou no index.js (estava no trecho movido)
import { ki_colors_data as cp } from "./data/ki_colors_data.js"; // O4: import que ficou no index.js (estava no trecho movido)
import { EquipmentSlot as cq, Player as cv, system as cw } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { Player as cx, system as cy } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { cj, cA, cB } from "./core/02_forms_timers.js"; // O4: movido do index.js
import { skills_data as cC } from "./data/skills_data.js";
import { system as cD } from "@minecraft/server";
import { skills_data as cE } from "./data/skills_data.js";
import { duRestorePassive, cF, cG, cH, cI } from "./core/03_skill_base.js"; // O4: movido do index.js
// Religa uma skill passiva desligada (hoje só o Hakai, ver cH.disable e o init das skills), sem som nem mensagem.
 // O4.0: ligação tardia
import { Player as cJ, system as cK, world as cL } from "@minecraft/server";
import { system as cM } from "@minecraft/server";
import { cT, cY } from "./core/04_tournament_dims.js"; // O4: movido do index.js
import { EntityComponentTypes as cZ, Player as d0 } from "@minecraft/server";
import { d2, d3, d4, d5, d6, dj, dp } from "./core/05_db_cooldowns.js"; // O4: movido do index.js
import { system as dq } from "@minecraft/server";
import { GameMode as dw, Player as dx, PlayerPermissionLevel as dy, system as dz, world as dA } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { dv, dC } from "./core/06_requirements.js"; // O4: movido do index.js
 // O4.0: ligação tardia
import { InputPermissionCategory as dD, system as dE } from "@minecraft/server";
import { CONFIG as dF } from "./config/config.js";
import { Player as dG, world as dH } from "@minecraft/server";
import { CONFIG as dI } from "./config/config.js";
import { EntityComponentTypes as dJ, Player as dK, system as dL } from "@minecraft/server";
import { system as dM } from "@minecraft/server";
function dN(sG, sH, sI) {
  for (let [sK, sL] of Object.entries(sH)) sG.multiply(sK, sL ?? 1);
  sI !== 1 &&
    (sG.multiply("ki_consume", 1 / sI),
    sG.multiply("dexterity", sI),
    sG.multiply("strength", sI),
    sG.multiply("willpower", sI));
}
var dO = class {
    constructor(sG, sH, sI) {
      (this.id = sG), (this.onApply = sH), (this.modifierData = sI);
    }
    get propertyId() {
      return this.modifierData?.propertyId;
    }
    applyModifier(sG, sH) {
      this.onApply(sG, {
        get: (sI) => sH[sI] ?? 0,
        multiply: (sI, sK) => {
          sH[sI] = (sH[sI] ?? 0) * sK;
        },
      });
    }
  },
  dP = class sZ {
    constructor(sG, sH) {
      (this.dbeEntity = sG), (this.attributes = sH), (this.modifierIds = new Set(sG.data.get("modifiers") ?? []));
    }
    static modifiersMap = new Map();
    modifierIds;
    multipliers = {};
    static registerModifier(sG) {
      this.modifiersMap.set(sG.id, sG);
    }
    applyBuff(sG, sH, sI) {
      let sK = new dO(sG, (sL, sM) => {
        dN(sM, sH, 1);
      });
      sZ.registerModifier(sK),
        this.setModifier(sG),
        dM.runTimeout(() => {
          this.dbeEntity.entity.isValid && this.removeModifier(sG);
        }, sI * 20);
    }
    applyDefaultModifiers() {
      this.setModifier("race"), this.setModifier("skills"), this.setModifier("transformation");
    }
    applyRacialModifiers() {
      if (this.dbeEntity.race) {
        for (let sG of this.dbeEntity.race.modifierIds) this.setModifier(sG);
      }
    }
    getMultiplier(sG) {
      return this.multipliers[sG] ?? 1;
    }
    applyModifiers() {
      let sG = [...this.attributes.getAttributes()],
        sH = [...this.attributes.stats.getStats()];
      for (let { id: sI } of [...sG, ...sH]) this.multipliers[sI] = 1;
      for (let sK of this.modifierIds) {
        let sL = sZ.modifiersMap.get(sK);
        sL && sL.applyModifier(this.dbeEntity, this.multipliers);
      }
      for (let sM of sG) {
        let sN = this.multipliers[sM.id];
        sN && sM.setModifiedValue(sN * sM.value);
      }
      this.attributes.stats.updateStats();
    }
    hasModifier(sG) {
      return this.modifierIds.has(sG);
    }
    removeAllModifiers() {
      for (let sG of this.modifierIds) this.removeModifier(sG);
      this.applyDefaultModifiers();
    }
    removeModifier(sG) {
      let sH = sZ.modifiersMap.get(sG);
      sH &&
        this.modifierIds.has(sG) &&
        (this.modifierIds.delete(sG),
        this.attributes.updateStats(),
        this.saveModifiers(),
        sH.propertyId && this.dbeEntity.trySetProperty(sH.propertyId, !1));
    }
    setModifier(sG) {
      let sH = sZ.modifiersMap.get(sG);
      if (sH) {
        let { propertyId: sI } = sH;
        this.modifierIds.has(sG) || (this.modifierIds.add(sG), this.saveModifiers()),
          sI && this.dbeEntity.trySetProperty(sI, !0),
          this.attributes.updateStats();
      }
    }
    saveModifiers() {
      this.dbeEntity.data.set("modifiers", [...this.modifierIds]);
    }
  },
  dQ = class {
    statsMap = new Map();
    addStat(sG) {
      this.statsMap.set(sG.id, sG), sG.update();
    }
    getStat(sG) {
      return this.statsMap.get(sG);
    }
    getStats() {
      return this.statsMap.values();
    }
    updateStats() {
      for (let sG of this.getStats()) sG.update();
    }
  },
  dR = class {
    constructor(sG, sH) {
      (this.statId = sG), (this.dbeEntity = sH);
    }
    _value = 0;
    get id() {
      return this.statId;
    }
    get value() {
      return this._value;
    }
    getFormatedValue() {
      return String(Number(this.value.toFixed(2)));
    }
    update() {
      this.setValue(1);
    }
    setValue(sG) {
      let sH = this.dbeEntity.attributes.modifiers.getMultiplier(this.id);
      this._value = sG * sH;
    }
  },
  dS = class extends dR {
    constructor(sG) {
      super("body", sG);
    }
    update() {
      let { attributes: sG, health: sH } = this.dbeEntity,
        sI = sG.getAttribute("constitution")?.modifiedValue || 1;
      this.setValue(sI * 20), sH.tryRegenerateHealth(), sH.updateBar();
    }
  },
  dT = class extends dR {
    constructor(sG) {
      super("defense", sG);
    }
    update() {
      let sG = this.dbeEntity.attributes.getAttribute("dexterity")?.modifiedValue || 1;
      this.setValue(sG / 500 + 1);
    }
  },
  dU = class extends dR {
    constructor(sG) {
      super("dodge", sG);
    }
  };
import { EntityComponentTypes as dV } from "@minecraft/server";
var dW = class extends dR {
    constructor(sG) {
      if ((super("flying_speed", sG), !(sG instanceof late.hN))) {
        let sH = sG.entity.getComponent(dV.FlyingSpeed),
          sI = sG.entity.getComponent(dV.UnderwaterMovement);
        sG.runInterval(() => {
          let sK = (sG.attributes.stats.getStat("running_speed")?.value ?? 0) * 2;
          sH && (sH.value = sK), sI && sI.setCurrentValue(sK);
        }, 20);
      }
    }
    update() {
      let sG = this.dbeEntity.getGravity();
      this.setValue(0.028 / (sG + 1));
    }
  },
  dX = class extends dR {
    constructor(sG) {
      super("jump", sG);
    }
    update() {
      let sG = this.dbeEntity.getGravity();
      this.setValue(1 / (sG + 1));
    }
  },
  dY = class extends dR {
    constructor(sG) {
      super("ki_consume", sG);
    }
    update() {
      let sG = this.getTotalSkillKiDrain(),
        sH = this.getTransformationKiDrain();
      this.setValue(sG + sH);
    }
    getTotalSkillKiDrain() {
      return this.dbeEntity.skills
        .getSkillsByType("toggle")
        .filter(({ isEnabled: sG }) => sG)
        .reduce((sG, { kiDrain: sH, kiDrainTrigger: sI }) => (sH > 0 && sI === "always" ? sG + sH : sG), 0);
    }
    getTransformationKiDrain() {
      return this.dbeEntity.transformations.currentTransformation.kiDrain;
    }
  },
  dZ = class extends dR {
    constructor(sG) {
      super("max_ki", sG);
    }
    update() {
      let { attributes: sG, ki: sH } = this.dbeEntity,
        sI = sG.getAttribute("spirit")?.modifiedValue || 1;
      this.setValue(sI * 50), sH.updateBar();
    }
  },
  e0 = class extends dR {
    constructor(sG) {
      super("melee_damage", sG);
    }
    update() {
      let sG = this.dbeEntity.attributes.getAttribute("strength")?.modifiedValue || 1;
      this.setValue(sG);
    }
  },
  e1 = class extends dR {
    constructor(sG) {
      super("regen_rate", sG);
    }
    update() {
      let sG = this.dbeEntity.race?.regenRate ?? 1;
      this.setValue(sG);
    }
  };
import { EntityComponentTypes as e2, system as e3 } from "@minecraft/server";
var e4 = class extends dR {
  wasSprinting = !1;
  isPlayer;
  movementComponent;
  underwaterMovementComponent;
  constructor(sG) {
    super("running_speed", sG),
      (this.isPlayer = sG instanceof late.hN),
      (this.movementComponent = sG.entity.getComponent(e2.Movement)),
      (this.underwaterMovementComponent = sG.entity.getComponent(e2.UnderwaterMovement)),
      this.isPlayer && sG.runInterval(() => this.handleSpeed());
  }
  get staminaCost() {
    return Math.floor(this.value * 2 + 1);
  }
  setSpeed(sG) {
    let { entity: sH } = this.dbeEntity,
      sI = this.normalizeSpeedValue(sG),
      sK = this.normalizeSpeedValue(this.movementComponent?.currentValue ?? 1);
    sI !== sK &&
      e3.run(() => {
        sH.isValid &&
          (this.movementComponent && this.movementComponent.setCurrentValue(sI),
          this.underwaterMovementComponent && this.underwaterMovementComponent?.setCurrentValue(sI / 5));
      });
  }
  update() {
    let { attributes: sG, guard: sH } = this.dbeEntity,
      sI = sG.getAttribute("dexterity")?.modifiedValue || 1,
      sK = this.dbeEntity.getGravity(),
      sL = Math.min((sI / 1000 + 0.1) / (sK + 1), 0.2);
    this.setValue(sL),
      this.dbeEntity instanceof late.hN ? this.updateSpeed() : this.setSpeed(sH.isGuarding ? this.value / 2 : this.value);
  }
  handleSpeed() {
    let { entity: sG, stamina: sH } = this.dbeEntity,
      { isSprinting: sI } = sG,
      sK = this.staminaCost,
      sL = sH.currentValue >= sK;
    sI &&
      (sH.removeCurrent(sK), !this.wasSprinting && sH.currentValue && ((this.wasSprinting = !0), this.updateSpeed())),
      this.wasSprinting && (!sI || !sL) && ((this.wasSprinting = !1), this.updateSpeed());
  }
  normalizeSpeedValue(sG) {
    let sH = Math.round(sG * 5000) / 5000;
    return this.isPlayer ? sH : sH + 0.2;
  }
  updateSpeed() {
    let { entity: sG, stamina: sH } = this.dbeEntity,
      { isSprinting: sI } = sG;
    this.setSpeed((sI && sH.currentValue) || !this.isPlayer ? this.value * 1.5 : this.value);
  }
};
import { system as e5 } from "@minecraft/server";
var e6 = class extends dR {
    inTransition = !1;
    targetSize = 1;
    constructor(sG) {
      super("size", sG);
    }
    getFormatedValue() {
      return (this.value * 1.875).toFixed(2) + "m";
    }
    update() {
      let { defaultScale: sG, entity: sH } = this.dbeEntity;
      if ((this.setValue(sG), this.dbeEntity instanceof late.hN)) {
        let sI = this.dbeEntity.getCurrentFusion();
        if (sI && !sI.isController) {
          this.setScale(0);
          return;
        }
      }
      if (((this.targetSize = bN(this.value, 0, 2)), !this.inTransition)) {
        let sK = sH.getComponent("minecraft:scale")?.value ?? 1;
        this.transitionSize(sK);
      }
    }
    setScale(sG) {
      let sH = Math.round(sG * 100);
      e5.run(() => {
        try {
          this.dbeEntity.entity.triggerEvent("dbe:scale_" + sH);
        } catch {
          this.inTransition = !1;
        }
      });
    }
    async transitionSize(sG) {
      let sH = sG;
      for (this.inTransition = !0; this.inTransition; ) {
        this.targetSize > sH
          ? (sH = Math.min(sH + 0.05, this.targetSize))
          : this.targetSize < sH && (sH = Math.max(sH - 0.05, this.targetSize)),
          this.setScale(sH);
        let sI = bN(this.value, 0, 2);
        if (sH === this.targetSize || this.targetSize !== sI) {
          this.inTransition = !1;
          break;
        }
        await e5.waitTicks(1);
      }
    }
  },
  e7 = class extends dR {
    constructor(sG) {
      super("stamina", sG);
    }
    update() {
      let { attributes: sG } = this.dbeEntity,
        sH = sG.getAttribute("constitution")?.modifiedValue || 1;
      this.setValue(Math.max(sH * 20, 200));
    }
  },
  e8 = ["constitution", "dexterity", "spirit", "strength", "willpower"];
function e9() {
  return { constitution: 0, dexterity: 0, spirit: 0, strength: 0, willpower: 0 };
}
var eb = class {
    constructor(sG, sH, sI, sK) {
      (this.dbeEntity = sG),
        (this.attributeId = sH),
        (this.attributeManager = sI),
        ((this._value = aO.safeNumber(sK, 1)), (this._modifiedValue = this._value));
    }
    _value;
    _modifiedValue;
    get id() {
      return this.attributeId;
    }
    get maxValue() {
      return dI.ATTRIBUTE_LIMIT[this.id];
    }
    get modifiedValue() {
      return this._modifiedValue;
    }
    get value() {
      return this._value;
    }
    addValue(sG, sH = !1) {
      this.setValue(this._value + sG), sH && this.applyBuyEffects(sG);
    }
    getUpgradeCost(sG) {
      let sH = (sK) => Math.floor((sK * dI.ATTRIBUTE_COST) / 100) + 1;
      if (!sG) return sH(this.value);
      let sI = 0;
      for (let sK = this.value; sK < this.value + sG; sK++) sI += sH(sK);
      return sI;
    }
    removeValue(sG) {
      this.setValue(this._value - sG);
    }
    resetModifiedValue() {
      this._modifiedValue = this._value;
    }
    setModifiedValue(sG) {
      this._modifiedValue = bN(sG, 0, this.maxValue);
    }
    setValue(sG) {
      (this._value = Math.floor(bN(sG, 0, this.maxValue))), this.attributeManager.saveAttributes();
    }
    applyBuyEffects(sG) {
      if (this.dbeEntity instanceof late.hN) {
        let { player: sH } = this.dbeEntity,
          sI = Math.floor(this.value % 3) + 1;
        sH.sendMessage({ translate: "attribute." + this.id + ".upgrade." + sI, with: ["" + sG] }),
          aN.applyCameraShake(sH, 0.3, 0.5),
          dL.run(() => sH.playSound("ui.upgrade"));
      }
    }
  },
  ef = class {
    constructor(sG) {
      (this.dbeEntity = sG),
        ((this.storedAttributes = sG.data.get("attributes") || {}), (this.modifiers = new dP(sG, this)));
    }
    storedAttributes;
    attributesMap = new Map();
    battlePowerInTransition = !1;
    cachedBattlePower = 0;
    targetBattlePower = 1;
    stats = new dQ();
    modifiers;
    get battlePower() {
      return this.cachedBattlePower;
    }
    addAttribute(sG) {
      if (!this.attributesMap.has(sG)) {
        let sH = new eb(this.dbeEntity, sG, this, this.storedAttributes[sG]);
        this.attributesMap.set(sG, sH);
      }
    }
    addAttributeValues(sG) {
      for (let [sH, sI] of Object.entries(sG)) this.getAttribute(sH)?.addValue(sI);
    }
    getAttribute(sG) {
      return this.attributesMap.get(sG);
    }
    getAttributes() {
      return this.attributesMap.values();
    }
    getAttributeValues() {
      return this.storedAttributes;
    }
    init() {
      let { modifiers: sG, stats: sH } = this;
      this.dbeEntity.hasAttributesDefined &&
        (this.addAttribute("constitution"),
        this.addAttribute("dexterity"),
        this.addAttribute("spirit"),
        this.addAttribute("strength"),
        this.addAttribute("willpower"),
        this.loadAttributes(),
        sH.addStat(new dS(this.dbeEntity)),
        sH.addStat(new dT(this.dbeEntity)),
        sH.addStat(new dU(this.dbeEntity)),
        sH.addStat(new dW(this.dbeEntity)),
        sH.addStat(new dX(this.dbeEntity)),
        sH.addStat(new dY(this.dbeEntity)),
        sH.addStat(new dZ(this.dbeEntity)),
        sH.addStat(new e0(this.dbeEntity)),
        sH.addStat(new e1(this.dbeEntity)),
        sH.addStat(new e4(this.dbeEntity)),
        sH.addStat(new e6(this.dbeEntity)),
        sH.addStat(new e7(this.dbeEntity))),
        dL.run(() => {
          let { entity: sI } = this.dbeEntity;
          sI.isValid &&
            (sI instanceof dK && sI.triggerEvent("dbe:setup"),
            sG.applyDefaultModifiers(),
            (this.cachedBattlePower = this.calculateBattlePower()),
            this.updateStats());
        });
    }
    saveAttributes() {
      for (let [sG, sH] of this.attributesMap) this.storedAttributes[sG] = sH.value;
      this.dbeEntity.data.set("attributes", this.storedAttributes), this.updateStats();
    }
    setAttributeValues(sG) {
      for (let [sH, sI] of Object.entries(sG)) this.getAttribute(sH)?.setValue(sI);
    }
    transferAttributes(sG, sH = 1) {
      let sI = sG.attributes;
      for (let sK of this.getAttributes()) {
        let sL = Math.max(sK.value * sH, 1);
        sK.removeValue(sL), sI.getAttribute(sK.id)?.addValue(sL);
      }
    }
    updateStats(sG = !0) {
      if (sG && this.dbeEntity instanceof late.hN) {
        let sH = this.dbeEntity.getCurrentFusion()?.partnerPlayer;
        sH && late.hO(sH).attributes.updateStats(!1);
      }
      this.modifiers.applyModifiers(), this.stats.updateStats(), this.updateBattlePower();
    }
    static getAttributesFromEntity(sG) {
      let sH = late.i3.getDBEEntity(sG);
      return sH ? sH.attributes.getAttributeValues() : this.getVanillaEntityAttributes(sG);
    }
    static getVanillaEntityAttributes(sG) {
      let sH = sG.getComponent(dJ.Health),
        sI = sG.getComponent(dJ.Strength);
      return {
        constitution: (sH?.defaultValue ?? 20) / 20,
        strength: sI?.value ?? 1,
        dexterity: 1,
        spirit: 1,
        willpower: 1,
      };
    }
    calculateBattlePower() {
      let sG = this.getAttribute("strength")?.modifiedValue ?? 1,
        sH = this.getAttribute("constitution")?.modifiedValue ?? 1,
        sI = this.getAttribute("spirit")?.modifiedValue ?? 1,
        sK = this.getAttribute("dexterity")?.modifiedValue ?? 1,
        sL = this.getAttribute("willpower")?.modifiedValue ?? 1,
        sM = sG * 1.4 + sL * 1.3 + sH * 1.2 + sK * 1 + sI * 1;
      return Math.floor(Math.pow(sM, 2));
    }
    loadAttributes() {
      let sG = Object.entries(this.storedAttributes);
      for (let [sH, sI] of sG) {
        let sK = new eb(this.dbeEntity, sH, this, sI);
        this.attributesMap.set(sH, sK);
      }
    }
    async transitionBattlePower(sG) {
      let { health: sH } = this.dbeEntity;
      for (this.battlePowerInTransition = !0; this.cachedBattlePower !== this.targetBattlePower; ) {
        let sI = Math.max(1, Math.abs(sG - this.targetBattlePower) / 50);
        this.cachedBattlePower < this.targetBattlePower &&
          (this.cachedBattlePower = Math.min(Math.floor(this.cachedBattlePower + sI), this.targetBattlePower)),
          this.cachedBattlePower > this.targetBattlePower &&
            (this.cachedBattlePower = Math.max(Math.floor(this.cachedBattlePower - sI), this.targetBattlePower)),
          sH.updateBar(),
          await dL.waitTicks(1);
      }
      this.battlePowerInTransition = !1;
    }
    async updateBattlePower() {
      (this.targetBattlePower = this.calculateBattlePower()),
        this.battlePower !== this.targetBattlePower &&
          (this.battlePowerInTransition || this.transitionBattlePower(this.battlePower),
          bM.dispatch("battle_power_changed", {
            dbeEntity: this.dbeEntity,
            newValue: this.targetBattlePower,
            oldValue: this.battlePower,
          }));
    }
  };
import { EquipmentSlot as ej, system as ek } from "@minecraft/server";
var ep = class {
    isWearingPotara(sG) {
      return aN.getEquippedItem(sG, ej.Head)?.typeId === "dbe:potara_earring";
    }
    async tryFusion(sG) {
      let sH = sG.player;
      if (this.isWearingPotara(sH)) {
        let sI = this.findNearbyPlayer(sH);
        if (!sI) return;
        let sK = late.hO(sI),
          sL = 0;
        for (; this.checkPotaraConditions(sG) && this.checkPotaraConditions(sK) && !(sL >= 100); ) {
          if (bO.distance(sI.location, sH.location) <= 0.1) {
            ex.startFusion("potara", sH, sI, 1);
            break;
          }
          this.moveToward(sH, sI.location), await ek.waitTicks(1), sL++;
        }
      }
    }
    checkPotaraConditions(sG) {
      return sG.player.isValid && !sG.isFused && this.isWearingPotara(sG.player);
    }
    findNearbyPlayer(sG) {
      return sG.dimension.getPlayers({ location: sG.location, maxDistance: 5 }).find((sH) => sH !== sG);
    }
    moveToward(sG, sH) {
      let sI = bO.normalize(bO.subtract(sH, sG.location)),
        sK = 0.1;
      sG.applyImpulse({ x: sI.x * sK, y: sI.y * sK, z: sI.z * sK });
    }
  },
  eq = new ep(),
  ev = class {
    constructor(sG, sH) {
      (this.dbePlayer = sG), (this.fusionData = sH);
    }
    get compatibility() {
      return this.fusionData.compatibility;
    }
    get isController() {
      return this.fusionData.isController;
    }
    get isValid() {
      if (!this.partnerPlayer) return !1;
      switch (this.type) {
        case "metamoran":
          return this.dbePlayer.skills.isSkillActive("metamoran_dance");
        case "potara":
          return eq.isWearingPotara(this.dbePlayer.player);
      }
    }
    get name() {
      return this.fusionData.fusionName;
    }
    get partnerId() {
      return this.fusionData.partnerId;
    }
    get partnerPlayer() {
      let sG = dH.getEntity(this.partnerId);
      if (sG instanceof dG) return late.hO(sG).getCurrentFusion()?.partnerId === this.dbePlayer.player.id ? sG : void 0;
    }
    get type() {
      return this.fusionData.type;
    }
    getMultipliers() {
      let { compatibility: sG, partnerPlayer: sH } = this,
        sI = e9(),
        sK = this.type === "metamoran" ? dF.FUSION.METAMORAN_FUSION_MULTIPLIER : dF.FUSION.POTARA_FUSION_MULTIPLIER,
        sL = sG * sK;
      if (sH) {
        let { attributes: sM } = this.dbePlayer,
          sN = late.hO(sH).attributes;
        for (let sO of sN.getAttributes()) {
          let sP = (sM.getAttribute(sO.id)?.value ?? 1) + sO.value;
          sI[sO.id] = (sP / 100) * sL + 1;
        }
      }
      return sI;
    }
  },
  ew = class {
    fusionMap = new Map();
    fusionHandler(sG) {
      let sH = sG.getCurrentFusion();
      sH ? sH.isValid || this.tryStopFusion(sG) : eq.tryFusion(sG);
    }
    getFusion(sG) {
      let sH = sG.player.id,
        sI = this.fusionMap.get(sH);
      if (!sI) {
        let sK = sG.data.get("fusion");
        sK && ((sI = new ev(sG, sK)), this.fusionMap.set(sH, sI));
      }
      return sI;
    }
    isFused(sG) {
      return this.fusionMap.has(sG.player.id);
    }
    startFusion(sG, sH, sI, sK) {
      let sL = this.createFusionName(sH.name, sI.name);
      this.setFusion(sH, sI, { type: sG, compatibility: sK, fusionName: sL, isController: !0, partnerId: sI.id }),
        this.setFusion(sI, sH, { type: sG, compatibility: sK, fusionName: sL, isController: !1, partnerId: sH.id });
    }
    createFusionName(sG, sH) {
      let sI = sG.slice(0, 4) + sH.slice(0, 4);
      return (sI[0].toUpperCase() + sI.slice(1).toLowerCase()).replace(" ", "");
    }
    setFusion(sG, sH, sI) {
      let sK = late.hO(sG),
        { attributes: sL, data: sM, inputPermissionManager: sN } = sK;
      sK.trySetProperty("dbe:fusion_type", sI.type),
        sG.triggerEvent("dbe:fusion_player_" + (sI.isController ? 1 : 2)),
        sI.isController
          ? ((sK.isArmorVisible = !1),
            sG.dimension.playSound("common.fusion_potara", sG.location),
            sG.dimension.spawnParticle("dbe:potara_sphere", sG.location))
          : (sG.camera.setCamera("minecraft:third_person"),
            dE.runTimeout(() => sH.runCommand('ride @p[name="' + sG.name + '"] start_riding @s'), 10),
            sN.blockInputPermission("fusion", [dD.Movement])),
        sM.set("fusion", sI),
        dE.run(() => sL.modifiers.setModifier("fusion")),
        sK.updateNameTag();
      let sO = new ev(sK, sI);
      this.fusionMap.set(sG.id, sO);
    }
    async tryStopFusion(sG) {
      let sH = this.getFusion(sG);
      if (sH) {
        let { attributes: sI, data: sK, inputPermissionManager: sL, player: sM, skills: sN, transformations: sO } = sG;
        sK.delete("fusion"),
          this.fusionMap.delete(sM.id),
          sG.trySetProperty("dbe:fusion_type", "none"),
          sM.triggerEvent("dbe:unfused"),
          sN.disableToggleSkills(),
          sO.untransform(),
          sI.modifiers.removeModifier("fusion"),
          sH.isController ||
            (sM.camera.clear(),
            sL.unblockInputPermission("fusion"),
            dE.run(() => sM.runCommand("ride @s stop_riding"))),
          sG.updateNameTag(),
          (sG.isArmorVisible = sO.currentTransformation.isArmorVisible),
          await dE.waitTicks(50);
      }
    }
  };
bM.on("entity_died", ({ dbeEntity: sG }) => {
  sG instanceof late.hN && ex.tryStopFusion(sG);
});
var ex = new ew();
import { CONFIG as ey } from "./config/config.js";
import { system as ez, world as eA } from "@minecraft/server";
import { system as eB, TextPrimitive as eC, world as eD } from "@minecraft/server";
var eE = class {
    textPrimitive;
    battlePowerRanking = new Map();
    initialized = !1;
    getBattlePowerLeaderboardEntry(sG) {
      return this.battlePowerRanking.get(sG);
    }
    getBattlePowerLeaderboardEntries() {
      return this.battlePowerRanking.values();
    }
    init() {
      this.initialized || ((this.initialized = !0), this.loadLeaderboard());
    }
    updatePlayerEntry(sG) {
      let { attributes: sH, player: sI } = sG,
        sK = this.battlePowerRanking.get(sI.id),
        { battlePower: sL } = sH;
      (!sK || sL > sK.battlePower) &&
        (this.battlePowerRanking.set(sI.id, { battlePower: sL, playerId: sI.id, playerName: sI.name }),
        this.saveLeaderboard(),
        this.updateBattlePowerHologram());
    }
    loadLeaderboard() {
      eB.run(() => {
        this.textPrimitive = new eC({ dimension: b5.dimensions.overworld, x: 150, y: 310, z: 150 }, "");
        let sG = bG(eD, "leaderboard_v2").get("battle_power") ?? [];
        for (let sH of sG) this.battlePowerRanking.set(sH.playerId, sH);
        (this.textPrimitive.scale = 2),
          eD.primitiveShapesManager.addText(this.textPrimitive),
          this.updateBattlePowerHologram();
      });
    }
    saveLeaderboard() {
      let sG = [...this.battlePowerRanking.entries()]
        .sort(([, sH], [, sI]) => sI.battlePower - sH.battlePower)
        .slice(0, 10);
      (this.battlePowerRanking = new Map(sG)),
        bG(eD, "leaderboard_v2").set("battle_power", [...this.battlePowerRanking.values()]);
    }
    updateBattlePowerHologram() {
      let sG = [...this.battlePowerRanking.values()],
        sH = [{ translate: "hologram.battle_power_ranking" }];
      sG.forEach(({ battlePower: sI, playerName: sK }, sL) => {
        sH.push({ text: "\n" }, { text: "§l§u" + (sL + 1) + ". §r§6" + sK + " §r§l§e" + aO.shortenNumber(sI) });
      }),
        this.textPrimitive?.setText({ rawtext: sH });
    }
  },
  eF = new eE();
bM.on("battle_power_changed", ({ dbeEntity: sG }) => {
  eF.initialized && sG instanceof late.hN && !sG.isFused && eF.updatePlayerEntry(sG);
});
function eG(sG) {
  return sG.replace(/[^a-zA-Z0-9_]/g, "");
}
var eH = class {
    constructor(sG) {
      (this.groupData = sG), (this.members = sG.members ?? []);
    }
    members = [];
    get claimedRegions() {
      return eP.getAllRegions().filter((sG) => sG.isOwner(this.id));
    }
    get friendlyFire() {
      return this.groupData.friendlyFire ?? !1;
    }
    get id() {
      return this.groupData.id;
    }
    get maxClaims() {
      return this.totalMembers;
    }
    get memberIds() {
      return this.members.map(({ id: sG }) => sG);
    }
    get name() {
      return this.groupData.name;
    }
    get ownerId() {
      return this.groupData.ownerId;
    }
    get spawnPoint() {
      return this.groupData.spawnPoint;
    }
    get totalMembers() {
      return this.members.length;
    }
    addPlayerToGroup(sG) {
      if (eJ.getPlayerGroup(sG.id)) {
        sG.sendMessage({ translate: "player_group.already_in_group" });
        return;
      }
      this.isMember(sG.id) ||
        (this.members.push({ id: sG.id, name: sG.name }),
        this.getOwner() || this.setOwner(sG.id),
        this.saveGroup(),
        late.hO(sG).updateNameTag(),
        sG.sendMessage({ translate: "player_group.join.success", with: [this.name] }));
    }
    deleteClaims() {
      for (let sG of this.claimedRegions) eO(sG.dimension).remove(sG.id);
    }
    deleteSpawnPoint() {
      delete this.groupData.spawnPoint, this.saveGroup();
    }
    displayClaimBorder(sG, sH) {
      ez.run(() => {
        if (sH.dimension.isChunkLoaded(sH.center)) {
          let sI = sH.pos1.x,
            sK = sH.pos2.x,
            sL = sH.pos1.z,
            sM = sH.pos2.z,
            sN = sG.location.y;
          for (let sO = sI; sO <= sK; sO++)
            sG.spawnParticle("dbe:claimed_delimitation", { x: sO, y: sN, z: sL }),
              sG.spawnParticle("dbe:claimed_delimitation", { x: sO, y: sN, z: sM });
          for (let sP = sL + 1; sP < sM; sP++)
            sG.spawnParticle("dbe:claimed_delimitation", { x: sI, y: sN, z: sP }),
              sG.spawnParticle("dbe:claimed_delimitation", { x: sK, y: sN, z: sP });
        }
      });
    }
    getData() {
      return { ...this.groupData, members: this.members };
    }
    getGroupPower() {
      let sG = 0;
      for (let sH of this.members) sG += eF.getBattlePowerLeaderboardEntry(sH.id)?.battlePower ?? 0;
      return sG;
    }
    getMemberByName(sG) {
      return this.members.find(({ name: sH }) => sH === sG);
    }
    getMemberById(sG) {
      return this.members.find(({ id: sH }) => sH === sG);
    }
    getOnlinePlayers() {
      let sG = [];
      for (let sH of eA.getAllPlayers()) this.isMember(sH.id) && sG.push(sH);
      return sG;
    }
    getOwner() {
      return this.ownerId ? this.getMemberById(this.ownerId) : void 0;
    }
    getPlayerById(sG) {
      return this.getOnlinePlayers().find((sH) => sH.id === sG);
    }
    isMember(sG) {
      return this.members.some(({ id: sH }) => sH === sG);
    }
    isOwner(sG) {
      return this.ownerId === sG;
    }
    removePlayerFromGroup(sG) {
      let sH = this.getMemberById(sG);
      if (sH) {
        let sI = this.getPlayerById(sG),
          sK = this.members.indexOf(sH);
        this.members.splice(sK, 1),
          this.totalMembers > 0
            ? (this.isOwner(sH.id) && this.setOwner(this.members[0].id), this.saveGroup())
            : eJ.deleteGroup(this.id),
          sI && late.hO(sI).updateNameTag();
      }
    }
    setFriendlyFire(sG) {
      (this.groupData.friendlyFire = sG), this.saveGroup();
    }
    setOwner(sG) {
      (this.groupData.ownerId = sG), this.saveGroup();
    }
    setSpawnPoint(sG, sH) {
      (this.groupData.spawnPoint = { dimensionId: sG.id, location: sH }), this.saveGroup();
    }
    toggleFriendlyFire() {
      return (this.groupData.friendlyFire = !this.friendlyFire), this.saveGroup(), this.friendlyFire;
    }
    async tryClaimLocation(sG, sH) {
      let sI = aH.getChunk(sG, sH),
        sK = eO(sG);
      if (
        sK.isBlockProtection(sH) ||
        sG.id.startsWith("dbe:angel_staff_dimension") ||
        ey.CLAIM.FORBIDDEN_DIMENSIONS.includes(sG.id)
      )
        return !1;
      if (!sK.hasRegion(sI.id)) {
        let sL = await sK.setRegionAsync({
          id: sI.id,
          dimensionId: sG.id,
          blockProtection: !0,
          memberIds: this.memberIds,
          persist: !0,
          owner: { type: "group", id: this.id, name: this.name },
          pos1: { x: sI.chunkOrigin.x, y: sG.heightRange.min, z: sI.chunkOrigin.z },
          pos2: { x: sI.chunkOrigin.x + 15, y: sG.heightRange.max, z: sI.chunkOrigin.z + 15 },
        });
        for (let sM of this.getOnlinePlayers()) this.displayClaimBorder(sM, sL);
        return !0;
      }
      return !1;
    }
    unClaimLocation(sG, sH) {
      let sI = eO(sG);
      for (let sK of sI.getChunkRegions(sH)) sK.owner?.id === this.id && sI.remove(sK.id);
    }
    saveGroup() {
      eJ.saveGroups(), this.updateRegions();
    }
    updateRegions() {
      for (let sG of this.claimedRegions) sG.setMembers(this.memberIds);
    }
  },
  eI = class {
    database;
    groupsMap = new Map();
    constructor() {
      ez.run(() => {
        (this.database = bG(eA, "groups")), this.initializeGroups();
      });
    }
    acceptInvite(sG, sH) {
      let sI = this.getPendingInvites(sG),
        sK = this.getGroupById(sH);
      if (sK && sI.includes(sH)) {
        if (sK.totalMembers >= 10) {
          sG.sendMessage({ translate: "player_group.join.group_full" });
          return;
        }
        sK.addPlayerToGroup(sG),
          bG(sG, "group").set(
            "invites",
            sI.filter((sL) => sL !== sH),
          );
      } else sG.sendMessage({ translate: "player_group.join.group_not_found" });
    }
    areInSameGroup(sG, sH) {
      let sI = this.getPlayerGroup(sG.id),
        sK = this.getPlayerGroup(sH.id);
      return !sI || !sK ? !1 : sI === sK;
    }
    createGroup(sG) {
      let sH = this.getGroupByName(sG);
      if (!sH) {
        let sI = { id: d5(), friendlyFire: !1, name: sG };
        return (sH = new eH(sI)), this.groupsMap.set(sI.id, sH), this.saveGroups(), sH;
      }
    }
    deleteGroup(sG) {
      let sH = this.getGroupById(sG);
      sH && (sH.deleteClaims(), this.groupsMap.delete(sG), this.saveGroups());
    }
    getGroups() {
      return this.groupsMap.values();
    }
    getGroupById(sG) {
      return this.groupsMap.get(sG);
    }
    getGroupByName(sG) {
      for (let sH of this.getGroups()) if (sH.name === sG) return sH;
    }
    getPendingInvites(sG) {
      return bG(sG, "group").get("invites") || [];
    }
    getPlayerGroup(sG) {
      for (let sH of this.getGroups()) if (sH.isMember(sG)) return sH;
    }
    hasGroup(sG) {
      for (let sH of this.getGroups()) if (sH.isMember(sG.id)) return !0;
      return !1;
    }
    invitePlayerToGroup(sG, sH) {
      let sI = this.getGroupById(sH);
      if (sI) {
        let sK = eJ.getPendingInvites(sG);
        sK.includes(sH) ||
          (sK.push(sH),
          sG.sendMessage({ translate: "player_group.invite.received", with: [sI.name, sI.name] }),
          bG(sG, "group").set("invites", sK));
      }
    }
    saveGroups() {
      let sG = [];
      for (let sH of this.getGroups()) sG.push(sH.getData());
      this.database?.set("groups", sG);
    }
    initializeGroups() {
      if (this.database) {
        let sG = this.database.get("groups") || [];
        for (let sH of sG) {
          let sI = new eH(sH);
          this.groupsMap.set(sH.id, sI);
        }
      }
    }
  },
  eJ = new eI(),
  eK = 16,
  eL = class {
    constructor(sG, sH) {
      (this.dimensionRegionManager = sG), (this.options = sH);
    }
    get accessRequirements() {
      return this.options.accessRequirements;
    }
    get allowPvP() {
      return this.options.allowPvP ?? !0;
    }
    get allowQuests() {
      return this.options.allowQuests ?? !0;
    }
    get blockProtection() {
      return this.options.blockProtection ?? !1;
    }
    get center() {
      return new bP((this.pos1.x + this.pos2.x) / 2, (this.pos1.y + this.pos2.y) / 2, (this.pos1.z + this.pos2.z) / 2);
    }
    get dimension() {
      return this.dimensionRegionManager.dimension;
    }
    get gravity() {
      return this.options.gravity ?? 0;
    }
    get id() {
      return this.options.id;
    }
    get memberIds() {
      return this.options.memberIds || [];
    }
    get owner() {
      return this.options.owner;
    }
    get persist() {
      return this.options.persist ?? !1;
    }
    get pos1() {
      return this.options.pos1;
    }
    get pos2() {
      return this.options.pos2;
    }
    get priority() {
      return this.options.priority ?? 0;
    }
    get preventMobSpawning() {
      return this.options.preventMobSpawning ?? !1;
    }
    get spawnPoint() {
      return this.options.spawnLocation || this.center;
    }
    canBuild(sG) {
      return this.blockProtection ? this.isAdmin(sG) || this.isOwner(sG.id) || this.isMember(sG.id) : !0;
    }
    canEnter(sG) {
      return this.accessRequirements ? dC.testAll(sG, this.accessRequirements.requirements) : !0;
    }
    claim(sG) {
      return this.options.owner
        ? !1
        : ((this.options.owner = { type: sG instanceof dx ? "player" : "group", id: sG.id, name: sG.name }),
          this.dimensionRegionManager.save(),
          !0);
    }
    isInside(sG, sH) {
      return sG !== this.dimension
        ? !1
        : ["x", "y", "z"].every((sI) => {
            let sK = Math.floor(sH[sI]),
              sL = Math.min(this.pos1[sI], this.pos2[sI]),
              sM = Math.max(this.pos1[sI], this.pos2[sI]);
            return sK >= sL && sK <= sM;
          });
    }
    isMember(sG) {
      return this.memberIds.includes(sG);
    }
    isOwner(sG) {
      return this.owner?.id === sG;
    }
    setMembers(sG) {
      (this.options.memberIds = sG), this.dimensionRegionManager.save();
    }
    setSpawnPoint(sG) {
      (this.options.spawnLocation = sG), this.dimensionRegionManager.save();
    }
    teleportToFallbackLocation(sG) {
      return new Promise((resolve) => dz.run(async () => {
        try {
          if (!this.accessRequirements) return resolve(!1);
          if (sG instanceof dx) await ex.tryStopFusion(late.hO(sG));
          resolve(await duTravel(sG, this.accessRequirements.deniedAccessLocation,
            { dimension: this.dimension, label: "region fallback " + this.id }));
        } catch (error) {
          console.warn(`[Dragon Universe] Region fallback failed: ${error?.stack ?? error}`);
          resolve(!1);
        }
      }));
    }
    teleportToRegion(sG) {
      return new Promise((resolve) => dz.run(async () => {
        try {
          if (!this.spawnPoint) return resolve(!1);
          if (sG instanceof dx) await ex.tryStopFusion(late.hO(sG));
          resolve(await duTravel(sG, this.spawnPoint, { dimension: this.dimension, label: "region " + this.id }));
        } catch (error) {
          console.warn(`[Dragon Universe] Region travel failed: ${error?.stack ?? error}`);
          resolve(!1);
        }
      }));
    }
    isAdmin(sG) {
      return sG.playerPermissionLevel === dy.Operator && sG.getGameMode() === dw.Creative;
    }
  },
  eM = class t0 {
    constructor(sG) {
      (this.dimension = sG), dz.runJob(this.load());
    }
    static instances = new Map();
    regions = new Map();
    globalRegion;
    spatialIndex = new Map();
    entityRegionCache = new Map();
    regionsLoaded = !1;
    static getDimensionRegionManagers() {
      return this.instances.values();
    }
    static getInstance(sG) {
      return this.instances.has(sG.id) || this.instances.set(sG.id, new t0(sG)), this.instances.get(sG.id);
    }
    canPlayerBuild(sG, sH) {
      let sI = this.getTopRegionAt(sH);
      return !sI || !sI.blockProtection ? this.regionsLoaded : sI.canBuild(sG);
    }
    cleanup() {
      for (let sG of this.entityRegionCache.keys()) dA.getEntity(sG) || this.entityRegionCache.delete(sG);
    }
    getRegion(sG) {
      return this.regions.get(sG);
    }
    getRegions() {
      return this.regions.values();
    }
    getChunkRegions(sG) {
      let sH = Math.floor(sG.x / eK) + "." + Math.floor(sG.z / eK),
        sI = this.spatialIndex.get(sH) ?? [];
      return this.globalRegion ? [...sI, this.globalRegion] : sI;
    }
    getTopRegionAt(sG) {
      let sH;
      for (let sI of this.getChunkRegions(sG))
        sI.isInside(this.dimension, sG) && (!sH || sI.priority > sH.priority) && (sH = sI);
      return sH;
    }
    hasRegion(sG) {
      return this.regions.has(sG);
    }
    isBlockProtection(sG) {
      return this.getTopRegionAt(sG)?.blockProtection ?? !this.regionsLoaded;
    }
    isSafeZoneLocation(sG) {
      let sH = this.getTopRegionAt(sG);
      return sH ? !sH.allowPvP : !this.regionsLoaded;
    }
    remove(sG) {
      let sH = this.regions.get(sG);
      sH && (this.regions.delete(sG), this.removeRegionFromIndex(sH), this.save());
    }
    save() {
      let sG = [];
      for (let sH of this.getRegions()) sH.persist && sG.push(sH.options);
      bG(dA, "regions").set(this.dimension.id, sG);
    }
    async setRegionAsync(sG) {
      for (; !this.regionsLoaded; ) await dz.waitTicks(1);
      let sH = new eL(this, sG);
      return dz.runJob(this.indexRegion(sH)), dz.run(() => this.save()), sH;
    }
    updateEntityRegions(sG) {
      if (this.regionsLoaded) {
        let sH = bO.floor(sG.location),
          sI = this.getChunkRegions(sH),
          sK = new Set(),
          sL = this.entityRegionCache.get(sG.id);
        if ((sL || ((sL = new Set()), this.entityRegionCache.set(sG.id, sL)), this.dimension === sG.dimension)) {
          for (let sM of sI)
            sM.isInside(this.dimension, sH) && (sK.add(sM), sL.has(sM) || this.addEntityToRegion(sM, sG));
        }
        for (let sN of sL) sK.has(sN) || this.removeEntityFromRegion(sN, sG);
        this.entityRegionCache.set(sG.id, sK);
      }
    }
    addEntityToRegion(sG, sH) {
      dz.run(() => {
        let sI = late.i3.getDBEEntity(sH);
        if (sI) {
          if (!sG.canEnter(sI)) {
            sG.teleportToFallbackLocation(sH),
              sI instanceof late.hN &&
                sI.sendQueueMessage({ message: sG.accessRequirements?.deniedAccessMessage ?? "", tickDelay: 0 });
            return;
          }
          sG.gravity && sI?.attributes.updateStats();
        }
        sH instanceof dx &&
          !sG.allowPvP &&
          sH.sendMessage({
            rawtext: [
              { translate: "message.safeRegion.join", with: { rawtext: [{ translate: "region." + sG.id + ".name" }] } },
            ],
          }),
          bM.dispatch("entity_enter_region", { entity: sH, region: sG });
      });
    }
    *indexRegion(sG) {
      let sH = this.hasRegion(sG.id);
      sH && this.remove(sG.id), this.regions.set(sG.id, sG);
      let sI = Math.floor(Math.min(sG.pos1.x, sG.pos2.x) / eK),
        sK = Math.floor(Math.max(sG.pos1.x, sG.pos2.x) / eK),
        sL = Math.floor(Math.min(sG.pos1.z, sG.pos2.z) / eK),
        sM = Math.floor(Math.max(sG.pos1.z, sG.pos2.z) / eK);
      for (let sN = sI; sN <= sK; sN++)
        for (let sO = sL; sO <= sM; sO++) {
          let sP = sN + "." + sO,
            sQ = this.spatialIndex.get(sP);
          sQ || ((sQ = []), this.spatialIndex.set(sP, sQ)), sQ.push(sG), yield;
        }
      if ((sH || bM.dispatch("region_load", { region: sG }), sG.owner?.type === "group")) {
        let sR = sG.owner.id;
        dz.run(() => {
          eJ.getGroupById(sR) ||
            (this.remove(sG.id),
            console.warn('A região "' + sG.id + '" foi removida porque o grupo "' + sR + '" não existe mais.'));
        });
      }
    }
    *load() {
      let sG = bG(dA, "regions").get(this.dimension.id);
      if (Array.isArray(sG))
        for (let sH of sG) {
          let sI = new eL(this, sH);
          yield* this.indexRegion(sI);
        }
      this.regionsLoaded = !0;
    }
    removeEntityFromRegion(sG, sH) {
      dz.run(() => {
        sG.gravity && late.i3.getDBEEntity(sH)?.attributes.updateStats(),
          sH instanceof dx &&
            !sG.allowPvP &&
            sH.sendMessage({
              rawtext: [
                {
                  translate: "message.safeRegion.exit",
                  with: { rawtext: [{ translate: "region." + sG.id + ".name" }] },
                },
              ],
            }),
          bM.dispatch("entity_exit_region", { entity: sH, region: sG });
      });
    }
    removeRegionFromIndex(sG) {
      let sH = Math.floor(Math.min(sG.pos1.x, sG.pos2.x) / eK),
        sI = Math.floor(Math.max(sG.pos1.x, sG.pos2.x) / eK),
        sK = Math.floor(Math.min(sG.pos1.z, sG.pos2.z) / eK),
        sL = Math.floor(Math.max(sG.pos1.z, sG.pos2.z) / eK);
      for (let sM = sH; sM <= sI; sM++)
        for (let sN = sK; sN <= sL; sN++) {
          let sO = sM + "." + sN,
            sP = this.spatialIndex.get(sO);
          if (!sP) continue;
          let sQ = sP.filter((sR) => sR !== sG);
          sQ.length ? this.spatialIndex.set(sO, sQ) : this.spatialIndex.delete(sO);
        }
    }
  },
  eN = class {
    findRegion(sG) {
      return this.getAllRegions().find((sH) => sH.id === sG);
    }
    getAllRegions() {
      let sG = [];
      for (let sH of eM.getDimensionRegionManagers()) sG.push(...sH.getRegions());
      return sG;
    }
    syncEntityRegionState(sG) {
      eO(sG.dimension).updateEntityRegions(sG);
    }
  };
function eO(sG) {
  let sH = eM.getInstance(sG);
  if (sH instanceof eM) return sH;
  throw new Error("Instância de RegionManager não encontrada para a dimensão fornecida.");
}
var eP = new eN();
every(1200, "core.region_cleanup", () => { // G3
  for (let sG of eM.getDimensionRegionManagers()) sG.cleanup();
}, { phase: 701 });
import { skills_data as eQ } from "./data/skills_data.js";
import { Player as eR, system as eS } from "@minecraft/server";
var eT = class {
  constructor(sG) {
    this.dbeEntity = sG;
  }
  skillsMap = new Map();
  addSkill(sG) {
    let sH = { id: sG, level: 1, state: {} },
      sI = this.loadSkill(sH);
    this.saveState(),
      sI instanceof cH && sI.isPassive && sI.enable(),
      this.dbeEntity instanceof late.hN && this.dbeEntity.skillsContainer.updateSideBar(),
      bM.dispatch("skill_unlocked", { dbeEntity: this.dbeEntity, skill: sI });
  }
  canLearnSkill(sG) {
    let sH = eQ.find(({ id: sI }) => sI === sG);
    return sH && sH.requirements ? dC.testAll(this.dbeEntity, sH.requirements) : !0;
  }
  disableToggleSkills() {
    for (let sG of this.getSkillsByType("toggle")) sG.isEnabled && !sG.isPassive && sG.disable();
  }
  getSkills() {
    return this.skillsMap.values();
  }
  getEnabledSkills() {
    let sG = [];
    for (let sH of this.getSkills()) sH.isEnabled && sG.push(sH);
    return sG;
  }
  getSkill(sG) {
    return this.skillsMap.get(sG);
  }
  getToggleSkill(sG) {
    let sH = this.skillsMap.get(sG);
    if (sH instanceof cH) return sH;
  }
  getSkillsByType(sG) {
    let sH = [];
    for (let sI of this.getSkills()) sI.type === sG && sH.push(sI);
    return sH;
  }
  getHighestPriorityColorOverrides() {
    let sG = {},
      sH = this.getSkillsByType("toggle").filter(({ isEnabled: sL }) => sL),
      sI = this.dbeEntity.transformations.currentTransformation.auraProperties?.overridableByLegendary;
    for (let sL of sH) {
      let { colorPriority: sM, colorOverrides: sN, id: sO } = sL;
      if (!(sO === "legendary" && !sI))
        for (let sP in sN) {
          let sQ = sG[sP];
          (!sQ || sM > sQ.priority) && (sG[sP] = { priority: sM, color: sN[sP] });
        }
    }
    let sK = {};
    for (let sR in sG) sK[sR] = sG[sR].color;
    return sK;
  }
  hasSkill(sG) {
    return this.skillsMap.has(sG);
  }
  isSkillActive(sG) {
    return this.skillsMap.get(sG)?.isEnabled ?? !1;
  }
  init() {
    this.loadAllSkills(),
      this.isSkillActive("ultra_instinct")
        ? this.getToggleSkill("hakai")?.disable()
        : duRestorePassive(this.getToggleSkill("hakai")), // Hakai preso desligado por versões antigas
      this.dbeEntity.trySetProperty("dbe:charging_attack", 0),
      (this.initialized = !0),
      this.skillsMap.size && this.startSkillTicker();
  }
  // O2d (decisão O2d-1, opção a): o intervalo de 1 tick das habilidades só existe para quem tem pelo menos uma
  // habilidade. Com 0 habilidades o corpo não fazia nada; agora nem é criado. Nasce no init (se já houver
  // habilidade) ou quando a primeira habilidade entra depois do init (loadSkill). Quem fica sem habilidade
  // mantém o intervalo, como antes.
  startSkillTicker() {
    this.skillTickerRunId === void 0 &&
      (this.skillTickerRunId = this.dbeEntity.runInterval(() => {
        let { attributes: sG, masteries: sH } = this.dbeEntity,
          { currentTick: sI } = eS,
          sK = this.getSkills(),
          sL = !1;
        for (let sM of sK)
          if ((sM.onTick?.(), sI % 50 === 0)) {
            let { isEnabled: sN, masteryOptions: sO } = sM;
            sN && sO?.hasDecay && (sH.getMastery(sM.id)?.removePercentage(1), (sL = !0));
          }
        sL && sG.updateStats();
      }));
  }
  removeSkill(sG) {
    if (this.hasSkill(sG)) {
      let sH = this.skillsMap.get(sG);
      sH &&
        (sH instanceof cH && (sH.disable(), sH.updateIcon()),
        this.skillsMap.delete(sG),
        this.saveState(),
        this.dbeEntity instanceof late.hN && this.dbeEntity.skillsContainer.updateSideBar());
    }
  }
  saveState() {
    let sG = [];
    for (let sH of this.getSkills()) sG.push(sH.getEntitySkillData());
    this.dbeEntity.data.set("skills", sG);
  }
  tryLearnRandomSkill() {
    for (let { id: sG, spawnChance: sH } of eQ)
      sH && this.canLearnSkill(sG) && Math.random() * 100 < sH && this.tryLearnSkill(sG);
  }
  tryLearnSkill(sG) {
    if (cG.has(sG)) {
      if (this.hasSkill(sG))
        this.dbeEntity.entity instanceof eR &&
          this.dbeEntity.entity.sendMessage({ translate: "message.learn.error.3" });
      else if (this.dbeEntity instanceof late.hN && !this.canLearnSkill(sG)) {
        let sH = eQ.find(({ id: sI }) => sI === sG);
        this.dbeEntity.player.sendMessage(dC.listDescription(sH?.requirements ?? [], this.dbeEntity));
      } else
        return (
          this.addSkill(sG),
          this.dbeEntity instanceof late.hN &&
            this.dbeEntity.entity.sendMessage({
              rawtext: [{ translate: "message.learn.success", with: { rawtext: [{ translate: "skill." + sG }] } }],
            }),
          this.getSkill(sG)
        );
    }
  }
  loadAllSkills() {
    let sG = this.dbeEntity.data.get("skills") || [];
    for (let sH of sG) this.loadSkill(sH);
  }
  loadSkill(sG) {
    let sH = cG.get(sG.id);
    if (!sH) throw new Error("A habilidade '" + sG.id + "' não está registrada.");
    let sI = new sH(this.dbeEntity, sG);
    return this.skillsMap.set(sG.id, sI), this.initialized && this.startSkillTicker(), sI;
  }
};
bM.on("entity_died", ({ dbeEntity: sG }) => {
  if (sG) {
    let { skills: sH } = sG;
    for (let sI of sH.getSkillsByType("toggle"))
      sI.isPassive || sI.disable(), sI.removeOnDeath && sH.removeSkill(sI.id);
  }
});
var eU = class {
  constructor(sG, sH) {
    (this.dbeEntity = sG), (this.barId = sH);
  }
  increaseCallbacks = [];
  increaseSpeed = 1;
  barValue = 0;
  isLoading = !1;
  get barFrame() {
    return Math.floor(this.currentValue / 2);
  }
  get currentValue() {
    return Math.floor(this.barValue);
  }
  reset() {
    this.barValue = 0;
  }
  onIncrease(sG) {
    this.increaseCallbacks.push(sG);
  }
  startIncrease(sG) {
    if (!this.isLoading) {
      (this.isLoading = !0), sG && (this.increaseSpeed = sG);
      let sH = this.dbeEntity.runInterval(() => {
        if (!this.increaseCallbacks.length) {
          this.dbeEntity.clearRun(sH);
          return;
        }
        for (let sI of this.increaseCallbacks) sI(this.barValue);
        this.isLoading && ((this.barValue = Math.min(this.barValue + this.increaseSpeed, 100)), this.update());
      });
    }
  }
  stopIncrease() {
    this.reset(),
      (this.isLoading = !1),
      (this.increaseCallbacks.length = 0),
      this.dbeEntity instanceof late.hN && this.dbeEntity.title.setTitle(this.barId + "_frame");
  }
  update() {
    this.dbeEntity instanceof late.hN && this.dbeEntity.title.setTitle(this.barId + "_frame", this.barFrame);
  }
};
import { system as eV } from "@minecraft/server";
import { CONFIG as eW } from "./config/config.js";
import { EntityDamageCause as eX, Player as eY, system as eZ, world as f0 } from "@minecraft/server";
var f1 = class {
    ingoredTags = ["dbe:not_destroyed_by_ki_attacks"];
    createExplosion(sG, sH, sI, sK) {
      let sL = this.getEntitiesInRadius(sG, sH, sI * 4),
        sM = eO(sG).isBlockProtection(sH);
      this.playEffects(sG, sH, sI, sK),
        f0.gameRules.mobGriefing && !sM && sK?.breakBlocks && this.createSphericalHole(sG, sH, sI);
      for (let { distance: sN, entity: sO } of sL) {
        let sP = sK?.ignoredEntities?.includes(sO) ?? !1,
          sQ = sN <= sI,
          sR = sO === sK?.damagingEntity,
          sS = !1;
        if (
          (sQ &&
            !sR &&
            !sP &&
            (sS = sO.applyDamage(sK?.damage ?? 0, { cause: eX.entityExplosion, damagingEntity: sK?.damagingEntity })),
          sS)
        ) {
          let sT = Math.max(0, 1 - sN / sI) * 10,
            sU = bO.normalize(bO.subtract(sO.location, sH));
          try {
            sO.applyKnockback({ x: sU.x * sT, z: sU.z * sT }, 0);
          } catch {}
        }
        if (sO instanceof eY) {
          let t1 = Math.min(0.025 * sI, 0.5);
          aN.applyCameraShake(sO, t1, t1, !0);
        }
      }
    }
    async createSphericalHole(sG, sH, sI) {
      let sK = sI * sI,
        sL = 0;
      for (let sM = 0; sM < sI; sM++) {
        let sN = sM >= sI - 1;
        for (let sO = -sM; sO <= sM; sO++) {
          let sP = sO * sO;
          for (let sQ = -sM; sQ <= sM; sQ++) {
            let sR = sQ * sQ;
            for (let sS = -sM; sS <= sM; sS++) {
              let sT = sS * sS;
              if (!(sR + sP + sT > sK) && !(sN && Math.random() >= 0.5))
                try {
                  let sU = new bP(sH.x + sQ, sH.y + sO, sH.z + sS),
                    t1 = sG.getBlock(sU);
                  t1 && (this.tryRemoveBlock(t1), sL++);
                } catch {}
            }
          }
        }
        await eZ.waitTicks(1);
      }
    }
    getEntitiesInRadius(sG, sH, sI) {
      let sK = [],
        sL = sG.getEntities({ location: sH, maxDistance: sI });
      for (let sM of sL) sK.push({ entity: sM, distance: bO.distance(sH, sM.location) });
      return sK;
    }
    playEffects(sG, sH, sI, sK) {
      sG.playSound(sK?.soundEffect || "common.explode", sH, { volume: sI * 4 });
    }
    tryRemoveBlock(sG) {
      sG.getTags().some((sH) => this.ingoredTags.includes(sH)) ||
        eW.INDESTRUCTIBLE_BLOCKS.includes(sG.typeId) ||
        sG.setType("minecraft:air");
    }
  },
  f2 = new f1(),
  f3 = 30,
  f4 = 3,
  f5 = 5,
  f6 = class {
    constructor(sG) {
      this.dbeEntity = sG;
    }
    comboLoopId;
    comboTickLock = !1;
    lastComboTicks = eV.currentTick;
    comboMultiplier = 0;
    get damageMultiplier() {
      return 1 + this.comboMultiplier / 2;
    }
    async applyComboIn(sG) {
      if (!this.comboTickLock) {
        (this.comboTickLock = !0), eV.run(() => (this.comboTickLock = !1));
        for (let sH of sG) sH?.isValid && (await this.onHit(sH));
        this.increaseMultiplier(), this.startComboLoop();
      }
    }
    resetCombo() {
      (this.comboMultiplier = 0),
        this.comboLoopId && (this.dbeEntity.clearRun(this.comboLoopId), (this.comboLoopId = void 0));
    }
    async applyRecoil(sG, sH, sI) {
      let sK = sG.getComponent("minecraft:type_family"),
        sL = sK ? !sK.hasTypeFamily("npc") : !0;
      (sI = sI ?? this.dbeEntity.entity.getViewDirection()),
        sL && sG.applyKnockback({ x: sI.x * sH, z: sI.z * sH }, 0.1),
        this.dbeEntity.entity.hasTag("test") &&
          (await eV.waitTicks(2),
          f2.createExplosion(sG.dimension, sG.location, 3, { breakBlocks: !0, damagingEntity: this.dbeEntity.entity }),
          this.dbeEntity.entity.applyKnockback({ x: sI.x * sH, z: sI.z * sH }, 0.1),
          this.dbeEntity instanceof late.hN &&
            (this.dbeEntity.player.camera.setCamera(c1.ThirdPerson),
            await eV.waitTicks(10),
            this.dbeEntity.player.camera.clear()));
    }
    increaseMultiplier() {
      let { currentTick: sG } = eV;
      this.comboMultiplier++, (this.lastComboTicks = sG);
    }
    async onHit(sG) {
      let sH = late.i3.getDBEEntity(sG),
        { dimension: sI, location: sK } = sG,
        sL = sG.getHeadLocation();
      if (
        (this.playComboSoundEffects(sI, sL),
        sH && sH.guard.isGuarding && sH.guard.tryBreakGuard(this.dbeEntity.entity),
        this.comboMultiplier >= f4)
      ) {
        let sM = this.dbeEntity.skills.getSkill("rapid_movement");
        this.applyRecoil(sG, f5), this.resetCombo();
      }
      sI.spawnParticle("dbe:sword_impact_circle", sL),
        sI.spawnParticle("dbe:sword_impact", sL),
        aN.applyCameraShake(this.dbeEntity.entity, 0.1, 0.1);
    }
    playComboSoundEffects(sG, sH) {
      let sI = "combat.small_hit";
      switch (this.comboMultiplier) {
        case 1:
          sI = "combat.middle_hit";
          break;
        case 2:
          sI = "combat.large_hit";
          break;
        case 3:
          sI = "combat.xlarge_hit";
          break;
      }
      sG.playSound("common.whoosh", sH), sG.playSound(sI, sH);
    }
    startComboLoop() {
      this.comboLoopId ||
        (this.comboLoopId = this.dbeEntity.runInterval(() => {
          let { currentTick: sG } = eV;
          this.lastComboTicks < sG - f3 && this.resetCombo();
        }));
    }
  },
  f7 = class {
    constructor(sG) {
      (this.dbeEntity = sG), (this.alignmentValue = sG.data.get("alignment") ?? 0);
    }
    alignmentValue;
    getAlignment() {
      return this.alignmentValue < -25 ? "evil" : this.alignmentValue > 25 ? "good" : "neutral";
    }
    addAlignment(sG) {
      this.setAlignment(this.alignmentValue + sG);
    }
    removeAlignment(sG) {
      this.setAlignment(this.alignmentValue - sG);
    }
    setAlignment(sG) {
      if (typeof sG != "number") throw new TypeError("O valor precisa ser um número.");
      if (isNaN(sG)) throw new TypeError("O valor fornecido não é um número válido.");
      (this.alignmentValue = bN(sG, -100, 100)), this.dbeEntity.data.set("alignment", this.alignmentValue);
    }
  };
import { CONFIG as f8 } from "./config/config.js";
import { Player as f9, system as fb, world as ff } from "@minecraft/server";
var fj = class {
    constructor(sG, sH) {
      (this.valueId = sG), (this.dataManager = sH), (this.value = this.dataManager.get(sG));
    }
    value;
    isInteger = !0;
    get currentValue() {
      return (
        this.maxValue !== void 0 && this.value > this.maxValue && this.resetToMaxValue(),
        this.value === void 0 ? this.defaultValue : this.value
      );
    }
    get defaultValue() {
      return this.maxValue ?? 0;
    }
    get id() {
      return this.valueId;
    }
    get maxValue() {}
    get minValue() {}
    addCurrent(sG) {
      this.setCurrent(this.currentValue + sG);
    }
    removeCurrent(sG) {
      this.setCurrent(this.currentValue - sG);
    }
    resetToMaxValue() {
      this.maxValue !== void 0 && this.setCurrent(this.maxValue);
    }
    setCurrent(sG) {
      if (typeof sG != "number") throw new TypeError("O valor precisa ser um número.");
      if (isNaN(sG)) throw new TypeError("O valor fornecido não é um número válido.");
      if (sG !== this.value) {
        let sH = this.value,
          sI = sG;
        this.isInteger && (sI = Math.floor(sI)),
          this.maxValue !== void 0 && sI > this.maxValue
            ? (sI = this.maxValue)
            : this.minValue !== void 0 && sI < this.minValue
              ? (sI = this.minValue)
              : (sI = sI),
          (this.value = sI),
          this.dataManager.set(this.id, sI),
          this.onValueChanged({ newValue: sI, oldValue: sH });
      }
    }
    onValueChanged(sG) {}
  },
  fk = class extends fj {
    constructor(sG) {
      super("health", sG.data), (this.dbeEntity = sG);
    }
    isRegenerating = !1;
    entityRewardLog = new Map();
    get healthPercent() {
      return (this.currentValue * 100) / this.maxValue;
    }
    get isHealthDraining() {
      return this.dbeEntity.skills.getEnabledSkills().some(({ healthDrain: sG }) => sG);
    }
    get maxValue() {
      let { stats: sG } = this.dbeEntity.attributes;
      return sG.getStat("body")?.value || 20;
    }
    get minValue() {
      return 0;
    }
    applyDamage(sG, sH) {
      if (this.dbeEntity instanceof late.hN && !this.dbeEntity.isInActiveMode) return 0;
      let sI = sH ? late.i3.getDBEEntity(sH) : void 0,
        sK = sI?.isFriendlyDamage,
        sL = Math.floor(sG - this.getDamageReduction(sG)),
        sM = this.currentValue - sL,
        sN = sM <= 0,
        sO = sK && sN;
      if (sH && !sO) {
        if (sI instanceof late.hN) {
          let { multiplier: sP } = sI.level;
          this.addEntityToRewardLog(sH.id, sP);
        }
        this.increaseMastering(), this.processOnDamageTriggers();
      }
      return (
        sO
          ? (this.setCurrent(1),
            fb.run(() => {
              this.dbeEntity instanceof late.hN && this.dbeEntity.knockout(),
                sH && !(sH instanceof f9) && (sH.dimension.playSound("common.teleport2", sH.location), sH.remove());
            }))
          : this.setCurrent(sM),
        sL
      );
    }
    getDamageReduction(sG) {
      let { attributes: sH } = this.dbeEntity,
        sI = sH.stats.getStat("defense")?.value || 1;
      return sG - sG / sI;
    }
    init() {
      this.tryRegenerateHealth(), this.updateBar();
    }
    onValueChanged() {
      this.currentValue <= 0 && this.distributeRewards(), this.tryRegenerateHealth(), this.updateBar();
    }
    restoreHealth(sG) {
      let sH = this.dbeEntity.attributes.stats.getStat("regen_rate")?.value ?? 1,
        sI = Math.max(1, (this.maxValue * sG) / 100) * sH;
      this.addCurrent(sI);
    }
    tryRegenerateHealth() {
      !this.isRegenerating &&
        this.healthPercent < 100 &&
        ((this.isRegenerating = !0),
        fb.runTimeout(() => {
          this.isHealthDraining || this.restoreHealth(2), (this.isRegenerating = !1), this.tryRegenerateHealth();
        }, 50));
    }
    updateBar() {
      if (this.dbeEntity instanceof late.hN) {
        let sG = Math.floor(this.currentValue),
          sH = Math.floor(this.maxValue),
          sI = Math.floor((sG * 50) / sH);
        this.dbeEntity.title.setSubtitle(
          "health_bar_value",
          "§r" + sG + "/" + sH + "            BP " + aO.shortenNumber(this.dbeEntity.attributes.battlePower),
        ),
          this.dbeEntity.title.setTitle("health_bar_frame", sI);
      }
    }
    addEntityToRewardLog(sG, sH) {
      let sI = this.entityRewardLog.get(sG) ?? { hitAmount: 0, rewardAmount: 0 };
      sI.hitAmount < this.maxValue && (sI.hitAmount++, (sI.rewardAmount += sH), this.entityRewardLog.set(sG, sI));
    }
    distributeRewards() {
      for (let [sG, sH] of this.entityRewardLog) {
        let sI = ff.getEntity(sG);
        if (sI instanceof f9) {
          let { level: sK } = late.hO(sI),
            sL = Math.floor(sH.rewardAmount * f8.REWARD_MODIFIERS.DEFEAT_MOBS);
          sK.addPoints(sL);
          try {
            let zq = Math.max(3, Math.floor(sL / 5));
            late.hO(sI).zeni.addValue(zq);
            sI.sendMessage(d6(zq, "zeni", "e"));
          } catch (zr) {}
        }
      }
      this.entityRewardLog.clear();
    }
    increaseMastering() {
      if (this.dbeEntity instanceof late.hN) {
        let { masteries: sG, transformations: sH } = this.dbeEntity,
          sI = sG.getMastery(sH.currentTransformation.id);
        if (sI && !this.isHealthDraining) {
          let sK = sI.masteryPercent + f8.REWARD_MODIFIERS.MASTERING;
          sI.setPercentage(sK);
        }
      }
    }
    processOnDamageTriggers() {
      let { attributes: sG, ki: sH, masteries: sI, skills: sK } = this.dbeEntity,
        sL = !1;
      for (let sM of sK.getSkillsByType("toggle"))
        sM.isEnabled &&
          (sM.kiDrainTrigger === "on_damage" &&
            (sH.currentValue >= sM.kiDrain ? sH.removeCurrent(sM.kiDrain) : sM.disable()),
          sM.masteryOptions?.grantTrigger === "on_damage" && (sI.getMastery(sM.id)?.addPercentage(1), (sL = !0)));
      sL && sG.updateStats();
    }
  };
import { ki_colors_data as fp } from "./data/ki_colors_data.js";
import { system as fq } from "@minecraft/server";
var fv = class extends fj {
  constructor(sG) {
    super("ki", sG.data), (this.dbeEntity = sG);
  }
  currentAuraProperties;
  get auraEnabled() {
    return this.dbeEntity instanceof late.hN && this.dbeEntity.player.isSneaking
      ? !0
      : this.dbeEntity.skills.isSkillActive("aura_boost");
  }
  get defaultKiColor() {
    return this.dbeEntity.colors.getDefaultColor("ki");
  }
  get kiPercent() {
    return (this.currentValue * 100) / this.maxValue;
  }
  get maxValue() {
    let { stats: sG } = this.dbeEntity.attributes;
    return sG.getStat("max_ki")?.value ?? 100;
  }
  get minValue() {
    return 0;
  }
  chargeKi() {
    let sG = Math.max(this.maxValue / 25, 1);
    this.addCurrent(sG);
  }
  getCurrentAuraProperties() {
    let sG = this.dbeEntity.skills.getSkillsByType("toggle").filter(({ isEnabled: sI }) => sI),
      sH;
    for (let { auraProperties: sI, id: sK } of sG)
      if (sI) {
        if (sK === "legendary" && this.currentAuraProperties) {
          let { currentTransformation: sL } = this.dbeEntity.transformations;
          if (!(sL.auraProperties?.overridableByLegendary ?? !1)) continue;
        }
        sH = sI;
        break;
      }
    return sH || this.currentAuraProperties;
  }
  getCurrentKiColor() {
    return this.getCurrentAuraProperties()?.color ?? this.getDefaultKiColor();
  }
  getDefaultKiColor() {
    return this.defaultKiColor ?? fp.blue;
  }
  init() {
    (this.currentAuraProperties = this.dbeEntity.data.get("aura_properties") || void 0),
      this.updateAuraColor(),
      this.handleKi(),
      this.updateBar();
  }
  onValueChanged({ newValue: sG, oldValue: sH }) {
    if ((this.currentValue <= 0 && this.noKi(), this.dbeEntity instanceof late.hN)) {
      let { tasks: sI } = this.dbeEntity,
        sK = sG - sH,
        sL = Math.abs(sK);
      if (Math.sign(sK) === 1) {
        for (let sM of sI.getActiveTasksByType("ki_charge")) sM.addProgress(sL);
      } else {
        for (let sN of sI.getActiveTasksByType("consume_ki")) sN.addProgress(sL);
      }
    }
    this.updateBar();
  }
  setCurrentAura(sG) {
    if (
      (sG ? this.dbeEntity.data.set("aura_properties", sG) : this.dbeEntity.data.delete("aura_properties"),
      this.dbeEntity instanceof late.hN)
    ) {
      let sH = sG?.soundIndex,
        sI = sG?.type;
      this.dbeEntity.trySetProperty("dbe:aura_sound", sH || 0),
        this.dbeEntity.trySetProperty("dbe:aura_type", sI || "normal");
    }
    (this.currentAuraProperties = sG), this.updateAuraColor();
  }
  setDefaultKiColor(sG) {
    this.dbeEntity.colors.setDefaultColor("ki", sG), this.updateAuraColor();
  }
  updateAuraColor() {
    fq.run(() => {
      let sG = this.getCurrentKiColor();
      this.dbeEntity.colors.setColorProperty(0, sG);
    });
  }
  updateBar() {
    if (this.dbeEntity instanceof late.hN) {
      let sG = Math.floor(this.currentValue),
        sH = Math.floor(this.maxValue),
        sI = Math.floor((sG * 50) / sH),
        sK = this.getCurrentAuraProperties()?.kiBarColor || "blue";
      this.dbeEntity.title.setSubtitle("ki_bar_value", "§r" + sG + "/" + sH),
        this.dbeEntity.title.setTitle("ki_bar_frame", sI),
        this.dbeEntity.title.setTitle("ki_bar_color", sK);
    }
  }
  applySkillDamage() {
    let { health: sG, skills: sH } = this.dbeEntity,
      sI = sH.getEnabledSkills();
    for (let sK of sI) {
      let { healthDrain: sL } = sK;
      sL && sG.removeCurrent(sL);
    }
  }
  decreaseKi() {
    if (this.currentValue) {
      let sG = this.dbeEntity.attributes.stats.getStat("ki_consume");
      if (sG) {
        let sH = sG.value;
        sH && this.removeCurrent(sH);
      }
    }
  }
  handleKi() {
    let { dbeEntity: sG } = this;
    sG instanceof late.hN &&
      sG.runInterval(() => {
        let { isInActiveMode: sH, isActionBlocked: sI, player: sK, skills: sL, transformations: sM } = sG;
        if (!sI) {
          if (Math.random() < 0.25 && this.auraEnabled && sM.currentTransformation.auraProperties?.sparks) {
            let { dimension: sN, location: sO } = sK;
            if (!duIsTravelPending(sK) && sN.isChunkLoaded(sO)) {
              sN.spawnParticle("dbe:aura_spark", sO);
              sN.playSound("common.spark", sO, { volume: 0.15 });
            }
          }
          if (sK.isSneaking) {
            let sP = sL.getToggleSkill("limiter");
            this.chargeKi(), sP && sP.isEnabled && this.kiPercent >= 100 && sP.increaseTier();
          }
          sH && (this.applySkillDamage(), this.decreaseKi());
        }
      }, 5);
  }
  noKi() {
    let { skills: sG, transformations: sH } = this.dbeEntity;
    sH.isTransformed() && sH.untransform();
    for (let sI of sG.getSkillsByType("toggle")) sI.isEnabled && sI.kiDrain > 0 && sI.disable();
  }
};
import { CONFIG as fw } from "./config/config.js";
var fx = class extends fj {
  constructor(sG) {
    super("stamina", sG.data), (this.dbeEntity = sG);
  }
  cooldown;
  isRegenerating = !1;
  get inCooldown() {
    return !this.cooldown?.isExpired();
  }
  get maxValue() {
    let { stats: sG } = this.dbeEntity.attributes;
    return sG.getStat("stamina")?.value ?? 0;
  }
  get minValue() {
    return 0;
  }
  get staminaPercent() {
    return (this.currentValue * 100) / this.maxValue;
  }
  init() {
    let { cooldowns: sG } = this.dbeEntity;
    (this.cooldown = sG.getCooldown("stamina") ?? sG.setCooldown("stamina", fw.STAMINA.COOLDOWN_TICKS)),
      this.staminaPercent < 100 && this.startRestore(),
      this.updateBar();
  }
  onValueChanged() {
    this.updateBar();
  }
  removeCurrent(sG) {
    (this.dbeEntity instanceof late.hN && !this.dbeEntity.isInActiveMode) ||
      !fw.STAMINA.ENABLED ||
      this.dbeEntity.isDeath ||
      (this.setCurrent(this.currentValue - sG),
      this.dbeEntity.cooldowns.setCooldown("stamina", fw.STAMINA.COOLDOWN_TICKS),
      this.startRestore());
  }
  restoreStaminaByPercent(sG) {
    let sH = this.maxValue * (sG / 100);
    this.addCurrent(sH);
  }
  updateBar() {
    if (this.dbeEntity instanceof late.hN) {
      let sG = Math.floor((this.currentValue * 50) / this.maxValue);
      this.dbeEntity.title.setTitle("stamina_bar_frame", sG);
    }
  }
  startRestore() {
    if (fw.STAMINA.ENABLED && !this.isRegenerating) {
      this.isRegenerating = !0;
      let sG = this.dbeEntity.runInterval(() => {
        this.inCooldown || this.restoreStaminaByPercent(2),
          this.staminaPercent === 100 && (this.dbeEntity.clearRun(sG), (this.isRegenerating = !1));
      }, 2);
    }
  }
};
import { entity_data as fy } from "./data/entities_data.js";
import { EntityTypes as fz, system as fA } from "@minecraft/server";
var fB = class {
    entitiesData = new Map();
    constructor() {
      fA.run(() => {
        let sG = fz.getAll().filter(({ id: sI }) => sI.startsWith("dbe:")),
          sH = [];
        for (let sI of sG) fy.some(({ id: sK }) => sK === sI.id) || sH.push(sI.id);
        sH.length > 0 &&
          console.warn("Não foram encontradas informações para as seguintes entidades do Dragon Universe:\n- " + sH.join("\n- "));
      });
    }
    getDBEEntityDataByTypeId(sG) {
      return this.entitiesData.get(sG);
    }
    registerDBEEntityData(sG) {
      this.entitiesData.set(sG.id, sG);
    }
  },
  fC = new fB();
import { races_data as fD } from "./data/races_data.js";
var fE = class {
    constructor(sG) {
      this.roleOptions = sG;
    }
    get default() {
      return this.roleOptions.default ?? !1;
    }
    get displayTag() {
      return this.roleOptions.displayTag;
    }
    get id() {
      return this.roleOptions.id;
    }
    get permissions() {
      let sG = this.roleOptions.permissions ?? [];
      return sG.push("role." + this.id), sG;
    }
    get priority() {
      return this.roleOptions.priority;
    }
  },
  fF = class {
    roleMap = new Map();
    addRoleToPlayer(sG, sH) {
      let sI = this.getRole(sH);
      if (sI) {
        let sK = this.getPlayerRoleIds(sG);
        sK.includes(sH) || (sK.push(sH), sG.serverData.set("roles", sK), sI.displayTag && sG.updateNameTag());
      }
    }
    hasRole(sG) {
      return this.roleMap.has(sG);
    }
    getHighestPlayerDisplayTag(sG) {
      for (let sH of fG.getPlayerRoles(sG)) if (sH.displayTag) return sH.displayTag;
    }
    getHighestPlayerRole(sG) {
      return this.getPlayerRoles(sG)[0];
    }
    getPlayerRoles(sG) {
      let sH = [];
      for (let sI of this.getPlayerRoleIds(sG)) {
        let sK = this.getRole(sI);
        sK && sH.push(sK);
      }
      return sH.sort((sL, sM) => sM.priority - sL.priority);
    }
    getPlayerRoleIds(sG) {
      let sH = sG.serverData.get("roles");
      return Array.isArray(sH) ? sH : [];
    }
    getRole(sG) {
      return this.roleMap.get(sG);
    }
    playerHasPermission(sG, sH) {
      return this.getPlayerRoles(sG).some((sI) => sI.permissions.includes(sH));
    }
    playerHasAllPermission(sG, sH) {
      return sH.every((sI) => this.playerHasPermission(sG, sI));
    }
    playerHasRole(sG, sH) {
      return this.getPlayerRoleIds(sG).includes(sH);
    }
    registerRoles(sG) {
      for (let sH of sG) {
        let sI = new fE(sH);
        this.roleMap.set(sH.id, sI);
      }
    }
    removeRoleFromPlayer(sG, sH) {
      let sI = this.getPlayerRoleIds(sG),
        sK = sI.indexOf(sH);
      sK !== -1 && (sI.splice(sK, 1), sG.serverData.set("roles", sI), sG.updateNameTag());
    }
  },
  fG = new fF();
import { global_transformations_data as fH } from "./data/global_transformations_data.js";
import { Player as fI, world as fJ } from "@minecraft/server";
import { system as fK } from "@minecraft/server";
function fL(sG, sH) {
  let { camera: sI } = sG.player;
  sG.statusIndicator.removeIcon(sH.id), sH.isOozaru && fK.run(() => sI.clear());
}
var fM = class {
  constructor(sG, sH) {
    (this.dbeEntity = sG),
      (this.transformationData = sH),
      this.isBase || this.dbeEntity.masteries.addMastery(this.id, this.localizationKey);
  }
  get auraProperties() {
    return this.transformationData.auraProperties;
  }
  get bodyType() {
    return this.transformationData.bodyType;
  }
  get canTransform() {
    return this.isRaceAllowed && dC.testAll(this.dbeEntity, this.requirements);
  }
  get isRaceAllowed() {
    let sG = this.transformationData.allowedRaceIds;
    return !sG || sG.includes(this.dbeEntity.race?.id);
  }
  get colorOverrides() {
    if ("raceColorOverrides" in this.transformationData) {
      let { raceColorOverrides: sG } = this.transformationData,
        sH = sG?.find(({ raceId: sI }) => sI === this.dbeEntity.race?.id);
      if (sH) return sH.overrides;
    }
    return this.transformationData.colorOverrides ?? {};
  }
  get isArmorVisible() {
    return this.transformationData.isArmorVisible ?? !0;
  }
  get isBase() {
    return this.transformationData.isBase ?? !1;
  }
  get isOozaru() {
    return this.tags.includes("oozaru");
  }
  get id() {
    return this.transformationData.id;
  }
  get kiDrain() {
    return this.transformationData.kiDrain ?? 1;
  }
  get localizationKey() {
    return this.dbeEntity.race?.id + ".transformation." + this.id;
  }
  get multipliers() {
    return this.transformationData.multipliers ?? {};
  }
  get requirements() {
    return this.transformationData.requirements ?? [];
  }
  get showHudIcon() {
    return this.transformationData.showHudIcon ?? !1;
  }
  get tags() {
    return this.transformationData.tags || [];
  }
  applyTransformation() {
    if (!this.isRaceAllowed) return !1;
    if (this.id === "ultra_ego")
      this.dbeEntity.skills.getToggleSkill("ultra_instinct")?.disable();
    let { attributes: sG, transformations: sH } = this.dbeEntity,
      sI = sH.currentTransformation;
    if (this.dbeEntity instanceof late.hN) {
      let { isFused: sL } = this.dbeEntity;
      fL(this.dbeEntity, sI),
        (this.dbeEntity.isArmorVisible = !sL && this.isArmorVisible),
        this.dbeEntity.playerCustomization.setBodyType(this.bodyType),
        this.isOozaru && this.setOozaruCamera();
    }
    let sK = sH.getTransformationOrder(this);
    sH.setCurrentTransformationIndex(sK),
      sG.updateStats(),
      this.dbeEntity.colors.updateColorOverrides(),
      this.updateAura(),
      this.updateIcon();
  }
  transform() {
    if (this.applyTransformation() !== !1) this.applyTransformationEffects();
  }
  updateIcon() {
    if (this.dbeEntity instanceof late.hN) {
      let { statusIndicator: sG } = this.dbeEntity;
      this.showHudIcon ? sG.addIcon(this.id) : sG.removeIcon(this.id);
    }
  }
  applyTransformationEffects() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    this.isBase
      ? sG.playSound("common.power_down", sH)
      : (sG.playSound("common.transform", sH),
        this.dbeEntity.entity.playAnimation("animation.player.transform"),
        this.dbeEntity instanceof late.hN && this.dbeEntity.player.runCommand("camerashake add @s 0.1 0.4 rotational"));
  }
  setOozaruCamera() {
    fK.run(() => {
      this.dbeEntity instanceof late.hN && this.dbeEntity.player.camera.setCamera(c1.FollowOrbit);
    });
  }
  updateAura() {
    let { ki: sG } = this.dbeEntity;
    this.isBase ? sG.setCurrentAura(void 0) : sG.setCurrentAura(this.auraProperties);
  }
};
function fN(sG) {
  let sH = [];
  for (let sI of sG) {
    if (typeof sI != "string") {
      sH.push(sI);
      continue;
    }
    let sK = fH.find((sL) => sL.id === sI);
    sK && sH.push(sK);
  }
  return sH;
}
var fO = class {
  constructor(sG, sH) {
    (this.dbeEntity = sG), (this.entityData = sH);
  }
  transformationsMap = new Map();
  availableTransformationIds = new Set();
  unlockedTransformationIds = new Set();
  currentTransformationIndex = 0;
  selectedTransformationId = "base";
  static getAllTransformationIds() {
    let sG = new Set();
    for (let sH of fR.getAll()) {
      let sI = sH.getData();
      if (sI) {
        for (let sK of sI.transformations) sG.add(typeof sK == "string" ? sK : sK.id);
      }
    }
    return [...sG.values()];
  }
  get currentTransformation() {
    return this.getTransformationByIndex(this.currentTransformationIndex) ?? this.getCurrentBaseTransformation();
  }
  get selectedTransformation() {
    let sG = this.getTransformationById(this.selectedTransformationId);
    return sG?.isRaceAllowed ? sG : this.currentTransformation;
  }
  get transformationsData() {
    let { race: sG } = this.dbeEntity,
      sH = sG?.transformationsData || [],
      sI = this.entityData?.transformations || [],
      sK = [...sH, ...sI];
    return fN(sK);
  }
  clearTransformations() {
    this.transformationsMap.clear(),
      this.availableTransformationIds.clear(),
      this.unlockedTransformationIds.clear(),
      this.dbeEntity.data.delete("unlocked_transformation_ids"),
      this.initializeTransformations(),
      this.getCurrentBaseTransformation().applyTransformation();
  }
  getTransformations() {
    return this.transformationsMap.values();
  }
  getAvailableTransformations() {
    let sG = [];
    for (let sH of this.getTransformations()) this.isTransformationAvailable(sH.id) && sG.push(sH);
    return sG;
  }
  getCurrentBaseTransformation() {
    let sG = this.getAvailableTransformations();
    for (let sH = sG.length - 1; sH >= 0; sH--) {
      let sI = sG[sH];
      if (sI.isBase) return sI;
    }
    return this.ensureBaseTransformation();
  }
  getTransformationById(sG) {
    return this.transformationsMap.get(sG);
  }
  getTransformationByIndex(sG) {
    let sH = [...this.getTransformations()],
      sI = bN(sG, 0, sH.length - 1);
    return sH[sI];
  }
  getTransformationOrder(sG) {
    return [...this.getTransformations()].indexOf(sG);
  }
  init() {
    (this.currentTransformationIndex = Number(this.dbeEntity.entity.getProperty("dbe:transformation")) || 0),
      this.initializeTransformations(),
      this.updateAvailableTransformations();
    if (!this.currentTransformation.isRaceAllowed ||
        (this.currentTransformation.id === "ultra_ego" &&
          this.dbeEntity.skills.isSkillActive("ultra_instinct")))
      this.getCurrentBaseTransformation().applyTransformation();
    this.selectedTransformationId = this.currentTransformation.id;
  }
  isTransformationAvailable(sG) {
    return this.availableTransformationIds.has(sG) && !!this.getTransformationById(sG)?.isRaceAllowed;
  }
  isTransformed() {
    return !this.currentTransformation.isBase;
  }
  setAvailableTransformations(sG) {
    if (this.dbeEntity instanceof late.hN)
      throw new Error("Não é possível definir manualmente as transformações disponíveis para jogadores.");
    this.availableTransformationIds.clear();
    for (let sH of sG) this.availableTransformationIds.add(sH);
  }
  setCurrentTransformationIndex(sG) {
    (this.currentTransformationIndex = sG),
      this.dbeEntity.trySetProperty("dbe:transformation", this.currentTransformationIndex);
  }
  async tryTransform() {
    let { concentrationBar: sG, ki: sH } = this.dbeEntity,
      { currentTransformation: sI, selectedTransformation: sK } = this;
    if (!sG.isLoading && sI.id !== sK.id && sK.canTransform) {
      if (sK.isBase) {
        sK.transform();
        return;
      }
      if (sH.currentValue >= 20) {
        let sL = this.dbeEntity.masteries.getMastery(sK.id)?.masteryMultiplier || 1;
        sG.startIncrease(2.5 * sL),
          sG.onIncrease((sM) => {
            (sM === 25 || sM === 75) && this.handleOozaruSound(),
              this.dbeEntity.entity.isSneaking || (sM >= 100 && sK.transform(), sG.stopIncrease());
          });
      }
    }
  }
  untransform() {
    let sG = this.getCurrentBaseTransformation();
    this.currentTransformation !== sG && sG.transform();
  }
  updateAvailableTransformations() {
    if (this.dbeEntity instanceof late.hN && this.dbeEntity.hasStartedAdventure)
      for (let sG of this.getTransformations()) {
        let { canTransform: sH } = sG,
          sI = this.availableTransformationIds.has(sG.id);
        sH &&
          !sI &&
          (this.availableTransformationIds.add(sG.id),
          this.unlockedTransformationIds.has(sG.id) ||
            (this.saveUnlockedTransformation(sG.id),
            sG !== this.currentTransformation &&
              (this.notifyNewTransformationUnlock(sG), sG.isBase && sG.transform()))),
          !sH &&
            sI &&
            (this.availableTransformationIds.delete(sG.id), sG === this.currentTransformation && this.untransform());
      }
  }
  addTransformation(sG) {
    let sH = this.transformationsMap.get(sG.id);
    if (!sH) {
      let sI = new fM(this.dbeEntity, sG);
      return this.transformationsMap.set(sG.id, sI), sI;
    }
    return sH;
  }
  ensureBaseTransformation() {
    let sG = this.transformationsMap.get("base");
    return sG || this.addTransformation({ id: "base", isBase: !0, kiDrain: 0 });
  }
  handleOozaruSound() {
    if (this.dbeEntity.transformations.selectedTransformation.isOozaru) {
      let { dimension: sG, location: sH } = this.dbeEntity.entity;
      sG.playSound("common.looking_full_moon", sH), aN.applyCameraShake(this.dbeEntity.entity, 0.2, 1);
    }
  }
  initializeTransformations() {
    let sG = this.dbeEntity.data.get("unlocked_transformation_ids") ?? [];
    this.ensureBaseTransformation().updateIcon();
    for (let sH of sG) this.unlockedTransformationIds.add(sH);
    for (let sI of this.transformationsData) this.addTransformation(sI);
    this.selectedTransformationId = this.currentTransformation.id;
  }
  notifyNewTransformationUnlock(sG) {
    if (
      (bM.dispatch("transformation_unlocked", { dbeEntity: this.dbeEntity, transformation: sG }),
      this.dbeEntity instanceof late.hN)
    ) {
      let { race: sH } = this.dbeEntity;
      this.dbeEntity.sendQueueMessage({
        soundId: "common.transform",
        tickDelay: 5,
        message: {
          rawtext: [
            {
              translate: "message.unlockedTransformation",
              with: { rawtext: [{ translate: sH.id + ".transformation." + sG.id }] },
            },
          ],
        },
      });
    }
  }
  saveUnlockedTransformation(sG) {
    this.unlockedTransformationIds.has(sG) ||
      (this.unlockedTransformationIds.add(sG),
      this.dbeEntity.data.set("unlocked_transformation_ids", [...this.unlockedTransformationIds]));
  }
};
bM.on("entity_died", ({ dbeEntity: sG }) => {
  sG && sG.transformations.untransform();
}),
  fJ.afterEvents.entityStartSneaking.subscribe(({ entity: sG }) => {
    if (sG instanceof fI) {
      let sH = late.hO(sG);
      if (!sH.isActionBlocked) {
        let sI = sH.runInterval(() => {
          let { selectedSlotIndex: sK } = sG;
          sK === 7 && sH.transformations.tryTransform(), sG.isSneaking || sH.clearRun(sI);
        });
      }
    }
  });
var fP = class extends Error {
    constructor(sG) {
      super("Raça inválida: " + sG), (this.name = "InvalidRaceError");
    }
  },
  fQ = class {
    constructor(sG) {
      this.id = sG;
    }
    get permissions() {
      return this.getData()?.permissions ?? [];
    }
    getData() {
      return fD.find(({ id: sG }) => sG === this.id);
    }
  },
  fR = class {
    static raceTypesCache = new Map();
    static getAll() {
      return (
        this.raceTypesCache.size || fD.map(({ id: sG }) => this.raceTypesCache.set(sG, new fQ(sG))),
        [...this.raceTypesCache.values()]
      );
    }
    static getAvailableRaces(sG) {
      return this.getAll().filter(({ id: sH }) => this.isRaceAvailableForPlayer(sG, sH));
    }
    static get(sG) {
      this.getAll();
      return this.raceTypesCache.get(sG === "demon" ? "glind" : sG);
    }
    static getByIndex(sG) {
      return this.getAll()[sG];
    }
    static getIndex(sG) {
      let sH = this.get(sG);
      return sH ? this.getAll().indexOf(sH) : void 0;
    }
    static isRaceAvailableForPlayer(sG, sH) {
      let sI = this.get(sH);
      return sI ? (sI.permissions ? fG.playerHasAllPermission(sG, sI.permissions) : !0) : !1;
    }
  },
  fS = class {
    constructor(sG) {
      this.raceData = sG;
    }
    get colorIndexes() {
      return this.raceData.colorIndexes || {};
    }
    get defaultColors() {
      let sG = this.raceData.customizations?.options,
        sH = {};
      for (let sI in sG) {
        let sK = sG[sI];
        sK.type === "color" && (sH[sK.colorId] = sK.palette[0]);
      }
      return sH;
    }
    get defaultSkills() {
      return this.raceData.defaultSkills ?? [];
    }
    get id() {
      return this.raceData.id;
    }
    get modifierIds() {
      return this.raceData.modifiers ?? [];
    }
    get multipliers() {
      return this.raceData.multipliers;
    }
    get regenRate() {
      return this.raceData.regenRate;
    }
    get transformationsData() {
      return fN(this.raceData.transformations);
    }
  },
  fT = class {
    constructor(sG) {
      this.dbeEntity = sG;
    }
    colors = new Map();
    static getAllOptionIds() {
      let sG = new Set();
      for (let sH of fR.getAll()) {
        let sI = sH.getData()?.colorIndexes ?? {};
        for (let sK in sI) sG.add(sK);
      }
      return [...sG];
    }
    get colorIndexes() {
      if (this.dbeEntity instanceof late.hN) {
        let { raceIndex: sG } = this.dbeEntity.playerCustomization;
        return fR.getByIndex(sG).getData()?.colorIndexes || {};
      }
      return this.dbeEntity.race?.colorIndexes || {};
    }
    getColorIndex(sG) {
      let sH = this.dbeEntity.race?.colorIndexes;
      if (sH)
        return (
          this.dbeEntity instanceof late.hN &&
            !this.dbeEntity.hasStartedAdventure &&
            (sH = fR.getByIndex(this.dbeEntity.playerCustomization.raceIndex).getData()?.colorIndexes || {}),
          sH[sG]
        );
    }
    getDefaultColor(sG) {
      return this.colors.get(sG);
    }
    init() {
      this.loadColors(), this.updateColorOverrides();
    }
    resetAllColors() {
      this.colors.clear(), this.saveColors();
    }
    setColorProperty(sG, sH, sI = "dbe:color") {
      let sK = aI.colorToRgb(sH),
        sL = (sN) => bN(Math.floor(sN * 255) + 100, 100, 355),
        sM = +("" + sL(sK.red) + sL(sK.green) + sL(sK.blue));
      this.dbeEntity.trySetProperty(sI + "_" + sG, sM);
    }
    setDefaultColor(sG, sH) {
      sH ? this.colors.set(sG, sH) : this.colors.delete(sG), this.saveColors(), this.updateColorOverrides();
    }
    updateColorOverrides() {
      let { skills: sG, transformations: sH } = this.dbeEntity,
        { currentTransformation: sI } = sH,
        { colorOverrides: sK } = sI,
        sL = ["aura", "eyes", "hair", "tail"],
        sM = sG.getHighestPriorityColorOverrides(),
        { colorIndexes: sN } = this;
      for (let sO of sL) {
        if (!Object.hasOwn(sN, sO)) continue;
        let sP = sM[sO] || sK?.[sO] || this.getDefaultColor(sO) || this.dbeEntity.race?.defaultColors[sO];
        if (!sP) continue;
        let sQ = this.getColorIndex(sO);
        sQ && this.setColorProperty(sQ, sP);
      }
    }
    loadColors() {
      let sG = this.dbeEntity.data.get("colors") ?? {};
      for (let [sH, sI] of Object.entries(sG)) this.colors.set(sH, sI);
    }
    saveColors() {
      let sG = {};
      for (let [sH, sI] of this.colors) sG[sH] = sI;
      this.dbeEntity.data.set("colors", sG);
    }
  },
  fU = class {
    constructor(sG) {
      this.dbeEntity = sG;
    }
    _isGuarding = !1;
    get isGuarding() {
      return this._isGuarding;
    }
    set isGuarding(sG) {
      if (sG !== this.isGuarding) {
        (this._isGuarding = sG),
          this.dbeEntity.trySetProperty("dbe:is_defending", sG),
          this.dbeEntity instanceof late.hN && this.dbeEntity.toggleMovement(!sG);
        let { dimension: sH, location: sI } = this.dbeEntity.entity;
        sH.playSound("common.swing", sI);
      }
    }
    applyDodgeEffects() {
      let { entity: sG } = this.dbeEntity,
        { dimension: sH, location: sI } = sG,
        sK = [
          "animation.player.dodge_middle",
          "animation.player.dodge_left_1",
          "animation.player.dodge_left_2",
          "animation.player.dodge_right_1",
          "animation.player.dodge_right_2",
        ],
        sL = sK[Math.floor(Math.random() * sK.length)];
      sG.playAnimation(sL), sH.playSound("common.dodge", sI);
    }
    breakGuard(sG) {
      let { cooldowns: sH } = this.dbeEntity;
      sG ? sH.setCooldown("guard", sG ?? 20) : sH.clearCooldown("guard"), (this.isGuarding = !1);
    }
    init() {
      this.isGuarding = this.dbeEntity instanceof late.hN
        ? this.dbeEntity.player.selectedSlotIndex === 8
        : !!this.dbeEntity.entity.getProperty("dbe:is_defending");
      this.dbeEntity.trySetProperty("dbe:is_defending", this.isGuarding);
    }
    shouldDodge(sG) {
      if (this.dbeEntity.isLoadingAttack) return !1;
      let sH = this.dbeEntity.attributes.modifiers.getMultiplier("dodge"),
        sI = this.dbeEntity.attributes.getAttribute("dexterity")?.modifiedValue ?? 1,
        sK = this.getOpponentDexterity(sG),
        sL = sI - sK,
        sM = sI + sK,
        sN = bN((sL / sM) * sH * 0.25, 0, 1);
      return Math.random() < sN;
    }
    tryBreakGuard(sG) {
      let sH = late.i3.getDBEEntity(sG);
      if (sH) {
        let { entity: sI, stamina: sK } = this.dbeEntity,
          sL = (sH.attributes.stats.getStat("melee_damage")?.value ?? 1) * 25;
        sK.removeCurrent(sL),
          this.applyGuardEffects(),
          sK.currentValue || (this.breakGuard(40), sI.dimension.playSound("common.guard_brake", sI.location));
      }
    }
    tryGuard() {
      let { cooldowns: sG, stamina: sH } = this.dbeEntity,
        sI = sG.getCooldown("guard");
      if (sI && !sI.isExpired()) return;
      let { staminaPercent: sK } = sH;
      !this.isGuarding && sK >= 50 && (this.isGuarding = !0);
    }
    applyGuardEffects() {
      let { entity: sG } = this.dbeEntity,
        { dimension: sH, location: sI } = sG,
        sK = sG.getViewDirection(),
        sL = 1.1;
      sG.applyKnockback({ x: -sK.x * sL, z: -sK.z * sL }, 0),
        sG.playAnimation("animation.player.defense_impact"),
        sH.playSound("common.guard", sI);
    }
    getOpponentDexterity(sG) {
      let sH = late.i3.getDBEEntity(sG);
      if (sH) {
        let { attributes: sI } = sH;
        return sI.getAttribute("dexterity")?.modifiedValue ?? 1;
      } else {
        let sK = sG.getComponent("minecraft:health")?.defaultValue ?? 20;
        return Math.floor(sK / 20);
      }
    }
  },
  fV = class {
    constructor(sG, sH) {
      (this.entity = sG),
        ((this.entityDefinitions = sH),
        (this.entityData = fC.getDBEEntityDataByTypeId(sG.typeId)),
        (this.data = bG(sG, "dbe")));
      this.loadRace();
      let sI = this.entityData?.entityDefinitions;
      if (sI) {
        let sK = this.data.get("entity_definitions");
        sK
          ? (this.entityDefinitions = sK)
          : ((this.entityDefinitions = JSON.parse(JSON.stringify({ ...sI, ...(this.entityDefinitions ?? {}) }))),
            this.data.set("entity_definitions", this.entityDefinitions));
      }
      if (
        sG.typeId === "dbe:goku_black" &&
        this.entityDefinitions?.powerDefinition?.level === 125 &&
        this.entityDefinitions.availableTransformations?.length === 1 &&
        this.entityDefinitions.availableTransformations[0] === "ssjg"
      ) {
        this.entityDefinitions.availableTransformations = ["ssjr"];
        this.data.set("entity_definitions", this.entityDefinitions);
      }
      (this.alignment = new f7(this)),
        (this.attributes = new ef(this)),
        (this.chargeBar = new eU(this, "charge_bar")),
        (this.colors = new fT(this)),
        (this.combatManager = this.entity instanceof cv ? void 0 : new dv(this)),
        (this.combo = new f6(this)),
        (this.concentrationBar = new eU(this, "concentration_bar")),
        (this.cooldowns = dj(this.data)),
        (this.health = new fk(this)),
        (this.guard = new fU(this)),
        (this.ki = new fv(this)),
        (this.masteries = new dp(this.data)),
        (this.skills = new eT(this)),
        (this.stamina = new fx(this)),
        (this.transformations = new fO(this, this.entityData));
    }
    entityData;
    runIds = new Set();
    entityDefinitions;
    alignment;
    attributes;
    chargeBar;
    colors;
    combatManager;
    combo;
    data;
    concentrationBar;
    cooldowns;
    health;
    guard;
    ki;
    masteries;
    skills;
    stamina;
    transformations;
    _race;
    get alwaysDodge() {
      return this.entityDefinitions?.alwaysDodge ?? !1;
    }
    get defaultScale() {
      return this.entityData?.scale ?? 1;
    }
    get advancedCombat() {
      return this.entity instanceof cv || !!this.entityDefinitions;
    }
    get hasAttributesDefined() {
      return !!(this.entity instanceof cv || this.entityDefinitions?.powerDefinition);
    }
    get hasTail() {
      return this.attributes.modifiers.hasModifier("saiyan_tail");
    }
    get isAndroid() {
      return this.entityData?.isAndroid ?? !1;
    }
    get isDeath() {
      return !!this.entity.getProperty("dbe:is_death");
    }
    get isFriendlyDamage() {
      return (
        this.skills.isSkillActive("friendly_fist") ||
        !!this.entity.getDynamicProperty("dbe:is_friendly_damage") ||
        cT.inTournament(this.entity)
      );
    }
    get isKnockedOut() {
      return !!this.entity.getProperty("dbe:is_knocked_out");
    }
    get isLoadingAttack() {
      return !!this.entity.getProperty("dbe:charging_attack");
    }
    get race() {
      return this._race;
    }
    get target() {
      if (!this.entity.isValid) return;
      let { target: sG } = this.entity;
      if (sG?.isValid) return sG;
    }
    get tailCurled() {
      return !!this.entity.getProperty("dbe:tail_curled");
    }
    get trainingMultiplier() {
      return (
        ({
          "dbe:hell": 8,
          "dbe:namek": 3,
          "dbe:vegeta": 10,
          "dbe:frieza_planet": 10,
          "dbe:yardrat": 9,
          "dbe:hyperbolic_time_chamber": 25,
        }[this.entity?.dimension?.id] ?? 1) *
        (this.getGravity() * ck.REWARD_MODIFIERS.TRAINING_WEIGHTS + 1)
      );
    }
    addTail() {
      this._race?.id === "saiyan" && this.attributes.modifiers.setModifier("saiyan_tail"),
        this.cooldowns.clearCooldown("tail_regeneration");
    }
    clearRun(sG) {
      cw.clearRun(sG), this.runIds.delete(sG);
    }
    getGravity() {
      let sG = aN.getEquippedItem(this.entity, cq.Offhand),
        { dimension: sH, location: sI } = this.entity,
        sK = 0,
        sL = 0;
      if ((sH.id === "dbe:hyperbolic_time_chamber" && (sK += 1.5), sG)) {
        let sM = sG.getComponent("dbe:weight");
        if (sM) {
          let sN = sM.customComponentParameters.params;
          sK += sN.value ?? 0;
        }
      }
      for (let sO of eO(sH).getChunkRegions(sI))
        sO.isInside(sH, sI) &&
          (sO.id.startsWith("gravity_machine:") ? (sL = Math.max(sL, sO.gravity)) : (sK += sO.gravity));
      return (sK += sL), sK;
    }
    initialize() {
      this.attributes.init(),
        this.colors.init(),
        this.guard.init(),
        this.health.init(),
        this.ki.init(),
        this.skills.init(),
        this.stamina.init(),
        this.transformations.init(),
        this.loadDefinitions();
    }
    recoverConstitution() {
      this.health.resetToMaxValue(), this.ki.resetToMaxValue(), this.stamina.resetToMaxValue();
    }
    removeTail(sG = !1) {
      this._race?.id === "saiyan" && this.attributes.modifiers.removeModifier("saiyan_tail"),
        sG
          ? this.cooldowns.clearCooldown("tail_regeneration")
          : this.cooldowns.setCooldown("tail_regeneration", 12000, "absolute_time"),
        this.entity.dimension.playSound("mob.sheep.shear", this.entity.location);
    }
    runInterval(sG, sH) {
      let running = false;
      const failed = error => {
        console.warn("[Dragon Universe] Entity interval failed: " + (error?.stack ?? error));
        try { this.clearRun(sI); }
        catch (cleanup) { console.warn("[Dragon Universe] Entity interval cleanup failed: " + (cleanup?.stack ?? cleanup)); }
      };
      const finished = () => {
        running = false;
        try { if (!this.entity.isValid) this.clearAllRuns(); }
        catch (error) { failed(error); }
      };
      let sI = cw.runInterval(() => {
        try {
          if (!this.entity.isValid) { this.clearAllRuns(); return; }
          if (running) return;
          running = true;
          Promise.resolve(sG(this)).then(finished, error => { failed(error); finished(); });
        } catch (error) { running = false; failed(error); }
      }, sH);
      return this.runIds.add(sI), sI;
    }
    // O2b (decisão O2b-1, opção a): pedidos da mesma propriedade no mesmo tick viram um só run, que grava o ÚLTIMO
    // valor pedido; e só grava se o valor atual da entidade for outro. O valor atual é relido na hora de gravar
    // (outro caminho, como setProperty direto, eventos do JSON ou o respawn, pode tê-lo mudado), sem cache.
    trySetProperty(sG, sH) {
      const pending = (this.pendingProperties ??= new Map());
      if (pending.has(sG)) {
        pending.set(sG, sH);
        return;
      }
      // o pedido só entra no pending depois de agendado: se cw.run falhar, os próximos pedidos não se perdem
      cw.run(() => {
        const value = pending.get(sG);
        pending.delete(sG);
        if (this.entity.isValid)
          try {
            let current;
            try { current = this.entity.getProperty(sG); } catch {}
            if (current === void 0 || current !== value) this.entity.setProperty(sG, value);
          } catch {}
      });
      pending.set(sG, sH);
    }
    async trySpread(sG, sH) {
      try {
        let entity = this.entity,
          dimension = entity.dimension,
          origin = { ...entity.location },
          target = { ...sG };
        // Block/light queries must run outside beforeEvents.entityHurt.
        await cw.waitTicks(1);
        if (!entity.isValid || entity.dimension.id !== dimension.id) return !1;
        let location = entity.location;
        if (Math.hypot(location.x - origin.x, location.y - origin.y, location.z - origin.z) > 1) return !1;
        let sI = this.skills.getSkill("rapid_movement");
        if (sI instanceof cI) {
          let sK = d2(dimension, target, sH);
          if (sK) return await sI.tryTeleportToLocation(sK);
        }
      } catch (error) {
        console.warn("[Dragon Universe] Rapid movement failed:", error);
      }
      return !1;
    }
    clearAllRuns() {
      for (let sG of this.runIds) this.clearRun(sG);
    }
    loadRace() {
      let sG = this.entity instanceof cv ? this.entity.getProperty("dbe:race") : this.entityData?.race;
      if (this.entity instanceof cv && (!sG || typeof sG !== "string")) {
        throw new Error("Propriedade dbe:race indisponível para " + this.entity.name +
          ". Verifique se o Behavior Pack correto está ativo e se a definição do jogador foi carregada.");
      }
      if (sG) {
        let sH = fR.get(sG)?.getData();
        if (sH) {
          this._race = new fS(sH);
          if (sG === "demon" && this.entity instanceof cv) this.trySetProperty("dbe:race", "glind");
        } else throw new fP(sG);
      }
    }
    distributeAttributes(sG, sH) {
      let sI = Object.values(sH).reduce((sL, sM) => sL + sM, 0),
        sK = {};
      for (let [sL, sM] of Object.entries(sH)) sK[sL] = Math.round((sM / sI) * sG);
      this.attributes.setAttributeValues(sK);
    }
    loadDefinitions() {
      if (this.entityDefinitions && !(this.entity instanceof cv)) {
        if (
          (this.data.set("entity_definitions", this.entityDefinitions),
          this.entity.setDynamicProperty("dbe:is_friendly_damage", this.entityDefinitions.friendlyDamage),
          this.entityDefinitions.powerDefinition)
        ) {
          let { focus: sG, level: sH } = this.entityDefinitions.powerDefinition,
            sI = 0;
          typeof sH == "number" ? (sI = sH) : (sI = aO.randomInt(sH[0], sH[1]));
          let { ATTRIBUTE_POINTS_PER_LEVEL: sK, SKILL_POINTS_PER_LEVEL: sL } = ck.LEVEL,
            sM = (sK + sL) * sI * 1.1;
          this.distributeAttributes(sM, sG);
        }
        if (this.entityDefinitions.kiColor) {
          if (typeof this.entityDefinitions.kiColor == "string") {
            let sN = cp[this.entityDefinitions.kiColor];
            this.ki.setDefaultKiColor(sN);
          } else this.ki.setDefaultKiColor(this.entityDefinitions.kiColor);
        }
        if (this.entityDefinitions.skills) {
          for (let sO of this.entityDefinitions.skills) this.skills.tryLearnSkill(sO);
        }
        if (this.entityDefinitions.availableTransformations) {
          let sP = this.entityDefinitions.availableTransformations[0];
          this.transformations.setAvailableTransformations(this.entityDefinitions.availableTransformations),
            this.transformations.getTransformationById(sP)?.applyTransformation();
        }
      }
    }
  };
import { InputPermissionCategory as fW, system as fX, world as fY } from "@minecraft/server";
import { ModalFormData as fZ } from "@minecraft/server-ui";
var g0 = class {
    earlyAccessType = "private";
    isEarlyAccessEnabled = !1;
    worldLocked = !1;
    expirationDate;
    get isExpired() {
      return this.expirationDate ? Date.now() >= this.expirationDate.getTime() : !1;
    }
    validatePlayerAccess(sG) {
      if (!this.isEarlyAccessEnabled || !this.worldLocked) return;
      let { isExpired: sH } = this;
      if ((this.playerHasPatreonCode(sG.redeem) || this.earlyAccessType === "public") && !sH) {
        this.worldLocked = !1;
        return;
      }
      let { player: sI } = sG,
        sK = () => {
          let sM = new fZ();
          sM.title("Acesso Antecipado"),
            sM.label(
              sH
                ? "Esta versão de acesso antecipado está expirada" +
                    (this.expirationDate ? " (" + this.expirationDate.toString() + ")" : "") +
                    ". Procure uma nova ou aguarde o lançamento oficial."
                : "Você está jogando uma versão de acesso antecipado. Para continuar, insira seu código (sem aspas). O mundo será liberado após o resgate e você, junto com os demais, poderá jogar.",
            ),
            sH || sM.textField("Código", "seu código"),
            sM.show(sI).then(({ formValues: sN }) => {
              if (sN) {
                let sO = sN[1];
                if (typeof sO == "string") {
                  let sP = sO.replace(/["']|\/dbe:redeem|\/redeem/g, "").trim();
                  sG.redeem.redeemCode(sP);
                }
              }
              this.playerHasPatreonCode(sG.redeem) || fX.runTimeout(() => sK(), 10);
            });
        };
      sK();
      let sL = sG.runInterval(() => {
        let { camera: sM, onScreenDisplay: sN } = sI;
        sN.hideAllExcept(),
          sG.inputPermissionManager.blockInputPermission("early_access", [fW.Camera, fW.Movement]),
          sM.fade({
            fadeColor: { blue: 0, green: 0, red: 0 },
            fadeTime: { fadeInTime: 1, fadeOutTime: 1, holdTime: 1 },
          }),
          (this.playerHasPatreonCode(sG.redeem) || !this.worldLocked) &&
            (sG.clearRun(sL),
            sG.inputPermissionManager.unblockInputPermission("early_access"),
            sN.resetHudElementsVisibility(),
            (this.worldLocked = !1));
      }, 20);
    }
    enableEarlyAccess(sG, sH) {
      if (
        ((this.earlyAccessType = sG),
        (this.isEarlyAccessEnabled = !0),
        (this.worldLocked = !0),
        (this.expirationDate = sH),
        sH)
      ) {
        let sI = Math.floor(Math.max((sH.getTime() - Date.now()) / 50, 0)) + 20;
        fX.runTimeout(() => {
          this.worldLocked = !0;
          for (let sK of fY.getAllPlayers()) {
            let sL = late.hO(sK);
            this.validatePlayerAccess(sL);
          }
        }, sI);
      }
    }
    playerHasPatreonCode(sG) {
      return sG.hasCode("patreon");
    }
  },
  g1 = new g0();
import { EntityTypes as g2 } from "@minecraft/server";
var g3 = { Challenge: "challenge", Main: "main", Mentor: "mentor", Side: "side" },
  g4 = class {
    questsData = { challenge: [], main: [], mentor: [], side: [] };
    registerQuestData(sG) {
      this.questsData[sG.type].push(sG);
    }
    getNextMainQuestData(sG) {
      let sH = this.questsData.main,
        sI = (sH.findIndex((sK) => sK.id === sG) + 1) % sH.length;
      return sH[sI];
    }
    getQuestDataById(sG) {
      for (let sH in this.questsData) {
        let sI = this.questsData[sH].find((sK) => sK.id === sG);
        if (sI) return sI;
      }
    }
    getQuestDataByIndex(sG, sH) {
      let sI = this.questsData[sH];
      if (!sI || sG < 0 || sG >= sI.length) throw new Error("Índice ou tipo de quest inválido.");
      return sI[sG];
    }
    getAllQuestData() {
      let sG = [];
      for (let sH in this.questsData) sG.push(...this.questsData[sH]);
      return sG;
    }
  },
  g5 = new g4(),
  g6 = class {
    constructor(sG, sH, sI) {
      (this.masterDefinition = sG), (this.masterManager = sH), (this.masterProgress = sI);
    }
    get currentTeachingIndex() {
      return this.masterProgress.currentTeachingIndex ?? 0;
    }
    get id() {
      return this.masterProgress.masterId;
    }
    get friendshipPoints() {
      return this.masterProgress.friendshipPoints ?? 0;
    }
    get teachings() {
      return this.masterDefinition.teachings;
    }
    addFriendshipPoints(sG) {
      (this.masterProgress.friendshipPoints = this.friendshipPoints + sG), this.masterManager.saveProgress();
    }
    getFriendshipLevel() {
      return Math.floor(this.friendshipPoints / 100) + 1;
    }
    getProgress() {
      return this.masterProgress;
    }
    startTeaching(sG) {
      (this.masterProgress.currentTeachingIndex = sG), this.masterManager.saveProgress();
      let sH = this.getCurrentQuestId();
      if (sH) {
        let { quests: sI } = this.masterManager.dbePlayer;
        sI.hasQuest(sH) || sI.addQuest(sH);
      }
    }
    getCurrentQuestId() {
      return this.teachings[this.currentTeachingIndex].trialQuest.id;
    }
  },
  g7 = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        ((this.mastersData = sG.data.get("masters") ?? { currentMasterId: "", oldMasterId: "", masters: [] }),
        this.loadMasters());
    }
    mastersData;
    mastersMap = new Map();
    getCurrentMaster() {
      return this.mastersMap.get(this.mastersData.currentMasterId);
    }
    getMaster(sG) {
      return this.mastersMap.get(sG);
    }
    getMasterLocalizationKey() {
      let sG = this.getCurrentMaster();
      if (!sG) return "master.none";
      let sH = g2.get(sG.id);
      return sH ? sH.localizationKey : "master.none";
    }
    hasMaster(sG) {
      return this.mastersMap.has(sG);
    }
    setCurrentMaster(sG) {
      let sH = g9.getMasterDefinition(sG);
      if (sH) {
        if (
          ((this.mastersData.oldMasterId = this.mastersData.currentMasterId),
          (this.mastersData.currentMasterId = sG),
          !this.hasMaster(sG))
        ) {
          let sI = { masterId: sG },
            sK = new g6(sH, this, sI);
          sK.startTeaching(0), this.mastersData.masters.push(sI), this.mastersMap.set(sK.id, sK);
        }
        this.saveProgress();
      }
    }
    loadMasters() {
      for (let sG of this.mastersData.masters) {
        let sH = g9.getMasterDefinition(sG.masterId);
        if (sH) {
          let sI = new g6(sH, this, sG);
          this.mastersMap.set(sI.id, sI);
        }
      }
    }
    saveProgress() {
      this.mastersData.masters = [];
      for (let sG of this.mastersMap.values()) this.mastersData.masters.push(sG.getProgress());
      this.dbePlayer.data.set("masters", this.mastersData);
    }
  },
  g8 = class {
    masterDefinitions = new Map();
    registerMaster(sG) {
      this.masterDefinitions.set(sG.id, sG);
      for (let sH of sG.teachings) g5.registerQuestData(sH.trialQuest);
    }
    getMasterDefinition(sG) {
      return this.masterDefinitions.get(sG);
    }
  },
  g9 = new g8();
import { ItemStack as gb, ItemTypes as gf, world as gj } from "@minecraft/server";
function gk(sG) {
  let sH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  sG = sG.replace(/=+$/, "");
  let sI = "",
    sK = 0,
    sL = 0;
  for (let sM of sG) {
    let sN = sH.indexOf(sM);
    sN !== -1 &&
      ((sK = (sK << 6) | sN), (sL += 6), sL >= 8 && ((sL -= 8), (sI += String.fromCharCode((sK >> sL) & 255))));
  }
  return sI;
}
function gp(sG) {
  let sH = sG.split(""),
    sI = sH.length;
  for (let sK = 1; sK < sI; sK++) {
    let sL = (sK * 31) % sI;
    [sH[sK], sH[sL]] = [sH[sL], sH[sK]];
  }
  return sH.join("");
}
function gq(sG, sH = 31) {
  let sI = sG.split(""),
    sK = [];
  for (let sL = sI.length - 1; sL > 0; sL--) {
    let sM = (sL * sH) % (sL + 1);
    sK.push([sL, sM]);
  }
  for (let sN = sK.length - 1; sN >= 0; sN--) {
    let [sO, sP] = sK[sN];
    [sI[sO], sI[sP]] = [sI[sP], sI[sO]];
  }
  return sI.join("");
}
function gv(sG) {
  let sH = Number(sG[0]),
    sI;
  isNaN(sH) ? (sI = gp(sG)) : (sI = gq(sG.slice(1), sH));
  let sK = gk(sI),
    [sL, sM, sN] = sK.split("|");
  return { playerId: sL, codeId: sM, expiry: parseInt(sN) };
}
var gw = class {
    constructor(sG) {
      (this.dbePlayer = sG), (this.claimedCodes = sG.serverData.get("claimed_codes_v2") || []);
    }
    claimedCodes;
    activateRedeem(sG) {
      let sH = gx.get(sG);
      sH &&
        (this.dbePlayer.updateNameTag(),
        sH.onActivate(this.dbePlayer),
        this.giveExclusiveItemsOnce(this.dbePlayer, sH.codeId, sH.items ?? {}),
        this.claimedCodes.includes(sG) || this.claimedCodes.push(sG),
        this.saveClaimedCodes());
    }
    hasCode(sG) {
      return this.claimedCodes.includes(sG);
    }
    redeemCode(sG) {
      let sH = this.validateCode(sG),
        sI = sH.rewardId;
      sH.valid && (this.activateRedeem(sI), gx.markAsUsed(sG)),
        this.dbePlayer.player.sendMessage({ translate: "redeem.result." + sH.reason });
    }
    giveExclusiveItemsOnce(sG, sH, sI) {
      let sK = sG.serverData.get("claimed_items") ?? {},
        sL = new Set(sK[sH] ?? []),
        sM = sG.player.getComponent("minecraft:inventory")?.container;
      if (!sM) return;
      let { dimension: sN, location: sO } = sG.player,
        sP = [];
      for (let [sQ, sR] of Object.entries(sI))
        if (!sL.has(sQ) && gf.get(sQ)) {
          let sS = new gb(sQ, sR);
          (sS.keepOnDeath = !0),
            sS.setLore([{ rawtext: [{ text: "§r§7" }, { translate: "redeem.lore", with: [sG.player.name] }] }]),
            sP.push(sQ),
            sM.emptySlotsCount ? sM.addItem(sS) : sN.spawnItem(sS, sO);
        }
      sP.length > 0 && ((sK[sH] = [...sL, ...sP]), sG.serverData.set("claimed_items", sK));
    }
    saveClaimedCodes() {
      this.dbePlayer.serverData.set("claimed_codes_v2", [...this.claimedCodes]);
    }
    validateCode(sG) {
      let { playerId: sH, codeId: sI, expiry: sK } = gv(sG);
      // codeId desconhecido ou validade ilegível: falha sem marcar o código como usado
      return !gx.get(sI) || !Number.isFinite(sK)
        ? { valid: !1, reason: "Invalid", rewardId: sI }
        : sH.length && sH !== this.dbePlayer.player.name
          ? { valid: !1, reason: "NotForPlayer", rewardId: sI }
          : this.claimedCodes.includes(sI)
            ? { valid: !1, reason: "AlreadyClaimed", rewardId: sI }
            : Date.now() > sK || gx.isCodeUsed(sG)
              ? { valid: !1, reason: "Expired", rewardId: sI }
              : { valid: !0, reason: "Success", rewardId: sI };
    }
  },
  gx = class {
    static codes = new Map();
    static get(sG) {
      return this.codes.get(sG);
    }
    static isCodeUsed(sG) {
      return bG(gj, "claimed_codes_v2").has(sG);
    }
    static markAsUsed(sG) {
      bG(gj, "claimed_codes_v2").set(sG, {});
    }
    static register(sG) {
      this.codes.set(sG.codeId, sG);
    }
  };
import { achievements_data as gy } from "./data/achievements_data.js";
import { world as gz } from "@minecraft/server";
var gA = class {
    constructor(sG) {
      (this.rewardData = sG), this.reloadDescription();
    }
    description;
    rewardMessage;
    get amount() {
      return Math.floor(this.rewardData.amount ?? 1);
    }
    get amountSource() {
      return this.rewardData.amountSource ?? "fixed";
    }
    grantReward(sG) {}
    reloadDescription() {
      (this.description = this.createDescription()), (this.rewardMessage = this.createRewardMessage());
    }
    sendRewardMessage(sG) {
      let { rewardMessage: sH } = this;
      sH && sG.sendQueueMessage({ message: sH, soundId: "random.pop", tickDelay: 20 });
    }
    setValue(sG) {
      (this.rewardData.amount = sG), this.reloadDescription();
    }
    tryGrantReward(sG) {
      try {
        this.grantReward(sG);
      } catch (sH) {
        console.warn("Falha ao conceder recompensa:", sH);
      }
    }
    createDescription() {
      return { rawtext: void 0 };
    }
    createRewardMessage() {}
  },
  gB = class {
    static rewardTypesMap = new Map();
    static get(sG) {
      return this.rewardTypesMap.get(sG);
    }
    static register(sG, sH) {
      this.rewardTypesMap.set(sG, sH);
    }
  },
  gC = class {
    constructor(sG, sH, sI) {
      (this.dbePlayer = sG),
        (this.achievementData = sH),
        (this.progress = sI),
        ((this._progress = { id: sH.id, isCompleted: sI?.isCompleted ?? !1, tasks: sI?.tasks ?? [] }),
        this.loadRewards(),
        this.loadTasks());
    }
    _progress;
    _progressPercent = 0;
    rewards = [];
    tasks = [];
    get descriptionKey() {
      return this.localizationKey + ".text";
    }
    get id() {
      return this.achievementData.id;
    }
    get isCompleted() {
      return this._progress.isCompleted ?? !1;
    }
    get isGoalReached() {
      return this.tasks.every(({ isCompleted: sG }) => sG);
    }
    get isVisible() {
      return dC.testAll(this.dbePlayer, this.achievementData.revealRequirements ?? []);
    }
    get localizationKey() {
      return "achievement." + this.id;
    }
    get progressPercent() {
      return this._progressPercent;
    }
    get titleKey() {
      return this.localizationKey + ".title";
    }
    async completeAchievement() {
      this.isCompleted ||
        ((this._progress.isCompleted = !0),
        this.dbePlayer.achievements.saveProgress(),
        this.sendMessage(),
        this.grantRewards());
    }
    getProgress() {
      return { ...this._progress, tasks: this.tasks.map((sG) => sG.getProgress()) };
    }
    calculateProgressPercent() {
      let sG = 0,
        sH = 0;
      for (let sI of this.tasks) (sG += sI.requiredProgress), (sH += sI.currentProgress);
      this._progressPercent = sG === 0 ? 100 : Math.min(100, Math.floor((sH / sG) * 100));
    }
    grantRewards() {
      for (let sG of this.rewards)
        sG.amount && (sG.tryGrantReward(this.dbePlayer), sG.sendRewardMessage(this.dbePlayer));
    }
    loadRewards() {
      if (this.achievementData.rewards)
        for (let sG of this.achievementData.rewards) {
          let sH = gB.get(sG.type);
          if (sH) {
            let sI = new sH(sG);
            this.rewards.push(sI);
          }
        }
    }
    loadTasks() {
      for (let sG = 0; sG < this.achievementData.tasks.length; sG++) {
        let sH = this.achievementData.tasks[sG],
          sI = this._progress.tasks[sG],
          sK = this.dbePlayer.tasks.registerTask(this.id, sH, { ...sI, isStarted: !0 });
        sK.isValid() && (this.tasks.push(sK), sK.onProgressChanged(() => this.updateProgress()));
      }
    }
    sendMessage() {
      this.dbePlayer.sendQueueMessage({
        soundId: "ui.challenge_complete",
        tickDelay: 20,
        message: {
          rawtext: [{ translate: "message.achievement.completed", with: { rawtext: [{ translate: this.titleKey }] } }],
        },
      });
      for (let sG of gz.getAllPlayers())
        sG !== this.dbePlayer.player &&
          late.hO(sG).sendQueueMessage({
            soundId: "ui.challenge_complete",
            tickDelay: 20,
            message: {
              rawtext: [
                {
                  translate: "message.achievement.completed.global",
                  with: { rawtext: [{ text: this.dbePlayer.player.name }, { translate: this.titleKey }] },
                },
              ],
            },
          });
    }
    updateProgress() {
      this.calculateProgressPercent(),
        this.dbePlayer.achievements.saveProgress(),
        !this.isCompleted && this.isGoalReached && this.completeAchievement();
    }
  },
  gD = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        ((this.achievementsInfo = sG.serverData.get("achievements") || []), this.loadAchievements());
    }
    achievements = [];
    achievementsInfo;
    getAllAchievements() {
      return this.achievements;
    }
    getVisibleAchievements() {
      let sG = [];
      for (let sH of this.getAllAchievements()) (sH.isVisible || sH.isCompleted) && sG.push(sH);
      return sG;
    }
    saveProgress() {
      this.achievementsInfo.length = 0;
      for (let sG of this.achievements) this.achievementsInfo.push(sG.getProgress());
      this.dbePlayer.serverData.set("achievements", this.achievementsInfo);
    }
    loadAchievements() {
      for (let sG of gy) {
        let sH = this.achievementsInfo.find(({ id: sK }) => sK === sG.id),
          sI = new gC(this.dbePlayer, sG, sH);
        this.achievements.push(sI);
      }
    }
  };
import { system as gE, world as gF } from "@minecraft/server";
import { CustomForm as gG } from "@minecraft/server-ui";
var gH = class {
    bannedPlayers = new Map();
    constructor() {
      this.load();
    }
    ban(sG, sH) {
      if (!this.bannedPlayers.has(sG)) {
        this.bannedPlayers.set(sG, { playerName: sG, reason: sH }), this.save();
        let sI = this.findPlayerByName(sG);
        sI && this.showBanForm(sI);
      }
    }
    getBanReason(sG) {
      return this.bannedPlayers.get(sG)?.reason;
    }
    isBanned(sG) {
      return this.bannedPlayers.has(sG);
    }
    showBanForm(sG) {
      gE.run(async () => {
        let sH = new gG(sG, "Banido");
        for (
          sH.label("Você foi banido! Motivo: §c" + (this.getBanReason(sG.name) ?? "motivo não informado"));
          sG.isValid && this.isBanned(sG.name);

        )
          await sH.show(), await gE.waitTicks(20);
      });
    }
    unban(sG) {
      this.bannedPlayers.has(sG) && (this.bannedPlayers.delete(sG), this.save());
    }
    findPlayerByName(sG) {
      for (let sH of gF.getPlayers()) if (sH.name === sG) return sH;
    }
    load() {
      gE.run(() => {
        let sG = bG(gF, "server").get("banned_players") ?? [];
        for (let sH of sG) this.bannedPlayers.set(sH.playerName, sH);
      });
    }
    save() {
      gE.run(() => {
        let sG = [];
        for (let sH of this.bannedPlayers.values()) sG.push(sH);
        bG(gF, "server").set("banned_players", sG);
      });
    }
  },
  gI = new gH();
import { system as gJ } from "@minecraft/server";
import { EntityTypes as gK, system as gL } from "@minecraft/server";
import { ActionFormData as gM } from "@minecraft/server-ui";
var gN = class {
    constructor(sG, sH, sI, sK) {
      (this.dbePlayer = sG),
        (this.id = sH),
        (this.taskData = sI),
        (this.progress = sK),
        ((this._progress = {
          id: sH,
          isCompleted: sK?.isCompleted ?? !1,
          isStarted: sK?.isStarted ?? !1,
          value: sK?.value ?? 0,
        }),
        (this.description = this.createDescription()));
    }
    events = new bL();
    _progress;
    description;
    get autoComplete() {
      return this.taskData.autoComplete ?? !0;
    }
    get currentProgress() {
      return this._progress.value;
    }
    get isCompleted() {
      return this._progress.isCompleted;
    }
    get isGoalReached() {
      return this.currentProgress >= this.requiredProgress;
    }
    get isStarted() {
      return this._progress.isStarted ?? !1;
    }
    get localizationKey() {
      return this.taskData.localizationKey ?? "";
    }
    get requiredProgress() {
      return 1;
    }
    get requirements() {
      return this.taskData.requirements ?? [];
    }
    get startError() {}
    get type() {
      return this.taskData.type;
    }
    addProgress(sG) {
      this.setProgress(this.currentProgress + sG);
    }
    completeTask() {
      this.isCompleted ||
        ((this._progress.isCompleted = !0),
        (this._progress.value = this.requiredProgress),
        this.notifyProgressChanged(),
        this.stopTask(),
        this.onComplete());
    }
    fail() {
      this.isStarted &&
        !this.isCompleted &&
        (this.events.dispatch("on_failed", { task: this }),
        (this._progress.isCompleted = !1),
        this.notifyProgressChanged(),
        this.stopTask());
    }
    getCounterText() {
      return {
        rawtext: [
          { text: this.requiredProgress > 1 ? "§u" + this.currentProgress + "/" + this.requiredProgress + "§r" : "" },
        ],
      };
    }
    getProgress() {
      return this._progress;
    }
    getRecommendedLevel() {
      return 1;
    }
    isValid() {
      return !0;
    }
    onFailed(sG) {
      this.events.on("on_failed", sG);
    }
    onProgressChanged(sG) {
      this.events.on("on_progress_changed", sG);
    }
    setProgress(sG) {
      this.currentProgress !== sG &&
        ((this._progress.value = Math.min(Math.floor(sG), this.requiredProgress)),
        this.notifyProgressChanged(),
        this.autoComplete && this.isGoalReached && this.completeTask());
    }
    startTask() {
      if (!this.isStarted && !this.isCompleted) {
        let { startError: sG } = this;
        if (sG) throw new Error("Ocorreu um erro ao iniciar a tarefa '" + this.id + "': " + sG + ".");
        (this._progress.isStarted = !0), this.notifyProgressChanged(), this.onStart();
      }
    }
    stopTask() {
      this.isCompleted || this.setProgress(0),
        (this._progress.isStarted = !1),
        this.notifyProgressChanged(),
        this.onStop();
    }
    onComplete() {}
    onStart() {}
    onStop() {}
    createDescription() {
      return { rawtext: [{ translate: "quest.objective." + this.taskData.type }] };
    }
    notifyProgressChanged() {
      this.events.dispatch("on_progress_changed", { task: this });
    }
  },
  gO = class {
    static taskTypesMap = new Map();
    static get(sG) {
      return this.taskTypesMap.get(sG);
    }
    static register(sG, sH) {
      this.taskTypesMap.set(sG, sH);
    }
  };
async function gP(sG, sH, sI) {
  let sK = sI.length;
  if (!sK) return !0;
  let sL = 0;
  return new Promise((sM) => {
    gL.run(async () => {
      for (;;) {
        let sN = new gM();
        sN.title(sH), sN.body(sI[sL]), sN.button(sL > 0 ? "ui.dbe.backButton" : ""), sN.button(">>");
        let sO = await sN.show(sG);
        if (sO.canceled) {
          sM(!1);
          return;
        }
        if ((sO.selection === 0 && sL--, sO.selection === 1)) {
          if (sL >= sK - 1) {
            sM(!0);
            return;
          } else sL++;
        }
      }
    });
  });
}
var gQ = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get dialogCount() {
      return this.taskData.dialogCount ?? 0;
    }
    get npcTypeId() {
      return this.taskData.entity;
    }
    getDialogueKeys() {
      let sG = [];
      for (let sH = 0; sH < this.dialogCount; sH++)
        sG.push({
          rawtext: [
            { text: "§9" },
            { translate: gK.get(this.npcTypeId)?.localizationKey },
            { text: ": §r" },
            { translate: this.localizationKey + ".dialog_" + (sH + 1) },
          ],
        });
      return sG;
    }
    async showDialog() {
      let sG = await gP(this.dbePlayer.player, "ui.dbe.npc", this.getDialogueKeys());
      return sG && this.completeTask(), sG;
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.objective.interact_npc",
            with: { rawtext: [{ translate: gK.get(this.npcTypeId)?.localizationKey }] },
          },
        ],
      };
    }
  },
  gR = class {
    constructor(sG) {
      (this.dbePlayer = sG), this.startTaskCheckLoop();
    }
    tasks = new Map();
    removeTask(...sG) {
      for (let sH of sG) this.tasks.get(sH.type)?.delete(sH);
    }
    getActiveTasks() {
      let sG = [];
      for (let sH of this.tasks.values()) for (let sI of sH) !sI.isCompleted && sI.isStarted && sG.push(sI);
      return sG;
    }
    getActiveTasksByType(sG) {
      let sH = this.tasks.get(sG);
      if (!sH) return [];
      let sI = [];
      for (let sK of sH) !sK.isCompleted && sK.isStarted && sI.push(sK);
      return sI;
    }
    isQuestNpc(sG) {
      return sG === this.dbePlayer.entity
        ? !1
        : this.getActiveTasks().some((sH) => sH instanceof gQ && sH.npcTypeId === sG.typeId);
    }
    registerTask(sG, sH, sI) {
      let sK = gO.get(sH.type);
      if (!sK) throw new Error("O tipo de tarefa '" + sH.type + "' não está registrado. (ID da tarefa: '" + sG + "')");
      let sL = new sK(this.dbePlayer, sG, sH, sI),
        sM = this.tasks.get(sL.type);
      return sM ? sM.add(sL) : this.tasks.set(sL.type, new Set([sL])), sL;
    }
    async startTaskCheckLoop() {
      let { player: sG } = this.dbePlayer;
      await gJ.waitTicks(1);
      for (; sG.isValid && late.i0.get(sG.id) === this.dbePlayer; ) {
        for (let sH of this.getActiveTasks())
          if (sH.updateProgress?.() && (await gJ.waitTicks(1), !sG.isValid || late.i0.get(sG.id) !== this.dbePlayer)) return;
        await gJ.waitTicks(20);
      }
    }
  },
  gS = class {
    constructor(sG) {
      (this.dbePlayer = sG), ((this._value = sG.data.get("zeni") ?? 0), this.updateIcon());
    }
    _value;
    get value() {
      return this._value;
    }
    addValue(sG) {
      this.setValue(this._value + sG);
    }
    removeValue(sG) {
      this.setValue(this._value - sG);
    }
    setValue(sG) {
      if (!Number.isFinite(sG)) {
        console.warn("[Dragon Universe] Valor de zeni inválido ignorado: " + sG);
        return;
      }
      sG !== this._value && ((this._value = sG), this.dbePlayer.data.set("zeni", sG), this.updateIcon());
    }
    transferValue(sG, sH) {
      try {
        // valor negativo invertia a transferência (creditava o autor e debitava o alvo)
        if (!Number.isSafeInteger(sG) || sG <= 0) return "InvalidAmount";
        if (sH === this) return "InvalidTarget";
        return this.value < sG ? "InsufficientBalance" : (this.removeValue(sG), sH.addValue(sG), "Success");
      } catch (sI) {
        return console.warn("Falha ao transferir:", sI), "Error";
      }
    }
    updateIcon() {
      this.dbePlayer.title.setSubtitle("zeni_value", "§r" + aO.shortenNumber(this.value));
    }
  },
  gT = class {
    constructor(sG) {
      this.dbePlayer = sG;
    }
    optionValues = new Map();
    raceIndex = 0;
    gender = "male";
    static getAllOptionIds() {
      let sG = new Set();
      for (let sH of fR.getAll()) {
        let sI = sH.getData()?.customizations?.options ?? {};
        for (let sK in sI) sG.add(sK);
      }
      return sG.add("gender"), [...sG];
    }
    get activeCustomizations() {
      return fR.getByIndex(this.raceIndex).getData()?.customizations || {};
    }
    get isBaby() {
      return this.dbePlayer.data.get("is_baby") ?? !1;
    }
    set isBaby(sG) {
      this.dbePlayer.data.set("is_baby", sG), this.setBodyType();
    }
    getOptionValue(sG) {
      return this.optionValues.get(sG) ?? 0;
    }
    getOption(sG) {
      let { options: sH } = this.activeCustomizations;
      return sH?.[sG];
    }
    init() {
      (this.raceIndex = fR.getIndex(this.dbePlayer.race.id) ?? 0),
        (this.gender = this.dbePlayer.player.getProperty("dbe:gender") ? "female" : "male"),
        this.load();
    }
    setOptionValue(sG, sH) {
      if (sG === "gender") {
        this.setGender(sH ? "female" : "male");
        return;
      }
      let sI = this.getOption(sG);
      if (!sI) return;
      let sK = sI.type === "variant" ? sI.optionCount : sI.palette.length,
        sL = sH !== 0 ? ((sH % sK) + sK) % sK : 0;
      sI.type === "variant"
        ? this.dbePlayer.trySetProperty("dbe:customization_" + sI.propertyIndex, sL)
        : this.dbePlayer.colors.setDefaultColor(sI.colorId, sI.palette[sL]),
        this.optionValues.set(sG, sL);
    }
    reset() {
      let { options: sG } = this.activeCustomizations;
      if (sG) {
        for (let sH in sG) this.setOptionValue(sH, 0);
      }
      this.setGender("male"), this.dbePlayer.colors.resetAllColors(), this.optionValues.clear();
    }
    setBodyType(sG = "normal") {
      let sH = "" + sG + (this.isBaby ? "_baby" : "");
      this.dbePlayer.trySetProperty("dbe:body_type", sH);
    }
    setGender(sG) {
      (this.gender = sG), this.dbePlayer.trySetProperty("dbe:gender", sG === "male" ? 0 : 1);
      let { options: sH } = this.activeCustomizations;
      if (sH) {
        for (let [sI, sK] of Object.entries(sH))
          sK.activeGenders && !sK.activeGenders.includes(sG) && this.setOptionValue(sI, 0);
      }
    }
    load() {
      let { options: sG } = this.activeCustomizations;
      if (sG)
        for (let sH in sG) {
          let sI = sG[sH];
          if (sI && sI.type === "variant") {
            let sK = Number(this.dbePlayer.player.getProperty("dbe:customization_" + sI.propertyIndex) ?? 0);
            this.optionValues.set(sH, sK);
          }
        }
    }
  };
import { system as gU } from "@minecraft/server";
import { CONFIG as gV } from "./config/config.js";
import { system as gW } from "@minecraft/server";
var gX = class {
  static getFormatedDescription(sG, sH) {
    let sI = [];
    if (sG.length === 1) return this.getFormatedTaskDescription(sG[0], sH);
    for (let sK of sG) {
      let sL = this.getFormatedTaskDescription(sK, sH).rawtext;
      sL && sI.push({ rawtext: [{ text: "\n §r- " }, ...sL] });
    }
    return { rawtext: sI.length ? sI : void 0 };
  }
  static getFormatedTaskDescription(sG, sH) {
    let { description: sI } = sG;
    return sI.rawtext
      ? {
          rawtext: [
            sG.description,
            ...(sH ? [{ text: " " }, ...(aM.convertTimeToRawText(sH.getRemainingTicks() * 50).rawtext ?? [])] : []),
            ...(sG.requiredProgress > 1 ? [{ text: " " }, ...(sG.getCounterText().rawtext ?? [])] : []),
            ...(sG.isCompleted ? [{ text: " §u" }, { translate: "quest.objective_completed" }, { text: "§r" }] : []),
          ],
        }
      : sI;
  }
};
import { system as gY } from "@minecraft/server";
var gZ = class {
  constructor(sG, sH, sI, sK) {
    (this.dbePlayer = sG),
      (this.id = sH),
      (this.objectiveData = sI),
      (this.progress = sK),
      ((this._progress = {
        id: sH,
        isCompleted: sK?.isCompleted ?? !1,
        isStarted: sK?.isStarted ?? !1,
        tasks: sK?.tasks ?? [],
      }),
      this.loadTasks(),
      this.isStarted && this.loadCooldowns());
  }
  events = new bL();
  taskTypesMap = new Map();
  _progress;
  durationCooldown;
  restartCooldown;
  get autoStart() {
    return this.objectiveData.autoStart ?? !0;
  }
  get completeOnTimeout() {
    return this.objectiveData.completeOnTimeout ?? !1;
  }
  get dialogs() {
    return this.objectiveData.dialogs ?? {};
  }
  get canStart() {
    return dC.testAll(this.dbePlayer, this.startRequirements) && this.getTasks().every(({ startError: sG }) => !sG);
  }
  get isRestartable() {
    return this.objectiveData.isRestartable ?? !0;
  }
  get isCompleted() {
    return this._progress.isCompleted;
  }
  get isGoalReached() {
    return this.getTasks().every(({ isCompleted: sG }) => sG);
  }
  get isStarted() {
    return this._progress.isStarted;
  }
  get localizationKey() {
    return "quest." + this.id;
  }
  get pausable() {
    return this.objectiveData.pausable ?? !0;
  }
  get startRequirements() {
    return this.objectiveData.startRequirements ?? [];
  }
  get teleportOnFinishId() {
    return this.objectiveData.teleportOnFinish;
  }
  get teleportOnStartId() {
    return this.objectiveData.teleportOnStart;
  }
  async completeObjective() {
    if (!this.isStarted || this.isCompleted || this.completing) return !1;
    this.completing = !0;
    let generation = this.startGeneration ?? 0;
    try {
      if (this.dialogs.on_finish)
        await gP(this.dbePlayer.player, "ui.dbe.npc", this.getDialogueKeys("on_finish", this.dialogs.on_finish));
      if (!this.isStarted || generation !== (this.startGeneration ?? 0)) return !1;
      if (this.teleportOnFinishId) {
        let arrived = await this.teleportToRegion(this.teleportOnFinishId);
        if (!this.isStarted || generation !== (this.startGeneration ?? 0)) return !1;
        if (!arrived) {
          this.stopObjective();
          return !1;
        }
      }
      this._progress.isCompleted = !0;
      this.stopObjective();
      this.notifyProgressChanged();
      return !0;
    } catch (error) {
      console.warn(`[Dragon Universe] Mission finish ${this.id} failed: ${error?.stack ?? error}`);
      if (generation === (this.startGeneration ?? 0)) this.stopObjective();
      return !1;
    } finally {
      this.completing = !1;
    }
  }
  fail() {
    this.isStarted &&
      !this.isCompleted &&
      (this.stopObjective(), this.events.dispatch("on_failed", { objective: this }));
  }
  getDialogueKeys(sG, sH) {
    let sI = [];
    for (let sK = 0; sK < sH; sK++) sI.push(this.localizationKey + "." + sG + ".dialog_" + (sK + 1));
    return sI;
  }
  getProgress() {
    return { ...this._progress, tasks: this.getTasks().map((sG) => sG.getProgress()) };
  }
  getTasks() {
    let sG = [];
    for (let sH of this.taskTypesMap.values()) sG.push(...sH);
    return sG;
  }
  onFailed(sG) {
    this.events.on("on_failed", sG);
  }
  onProgressChanged(sG) {
    this.events.on("on_progress_changed", sG);
  }
  restart() {
    this.isStarted && this.isRestartable && (this.stopObjective(), this.startObjective());
  }
  async startObjective() {
    if (!this.isStarted && this.canStart && !this.starting) {
      let { dbePlayer: sG, dialogs: sH, teleportOnStartId: sI } = this;
      this.starting = !0;
      let generation = this.startGeneration = (this.startGeneration ?? 0) + 1;
      try {
        if (sI && !(await this.teleportToRegion(sI))) return !1;
        if (generation !== this.startGeneration || !sG.player.isValid) return !1;
        if (sH.on_start) await gP(sG.player, "ui.dbe.npc", this.getDialogueKeys("on_start", sH.on_start));
        if (generation !== this.startGeneration || !sG.player.isValid) return !1;
        this._progress.isStarted = !0;
        this.notifyProgressChanged();
        for (let sK of this.getTasks()) sK.startTask();
        this.loadCooldowns();
        if (this.isGoalReached) await this.completeObjective();
        return !0;
      } catch (error) {
        console.warn(`[Dragon Universe] Mission start ${this.id} failed: ${error?.stack ?? error}`);
        this.stopObjective();
        return !1;
      } finally {
        this.starting = !1;
      }
    }
  }
  stopObjective() {
    this.startGeneration = (this.startGeneration ?? 0) + 1;
    if (this.isStarted) {
      (this._progress.isStarted = !1), this.notifyProgressChanged(), this.deleteCooldowns();
      for (let sG of this.getTasks()) sG.stopTask();
    }
  }
  deleteCooldowns() {
    let { cooldowns: sG } = this.dbePlayer;
    (this.durationCooldown = void 0),
      (this.restartCooldown = void 0),
      sG.clearCooldown(this.id + "_duration"),
      sG.clearCooldown(this.id + "_restart");
  }
  notifyProgressChanged() {
    this.events.dispatch("on_progress_changed", { objective: this });
  }
  loadCooldowns() {
    let { completeOnTimeout: sG, dbePlayer: sH } = this,
      { cooldowns: sI } = this.dbePlayer;
    if (this.objectiveData.duration && !this.durationCooldown) {
      let sK = this.id + "_duration";
      this.durationCooldown = sI.getCooldown(sK) ?? sI.setCooldown(sK, this.objectiveData.duration);
    }
    if (this.isRestartable && !this.restartCooldown) {
      let sL = this.id + "_restart";
      this.restartCooldown = sI.getCooldown(sL) ?? sI.setCooldown(sL, this.objectiveData.restartCooldown ?? 2400);
    }
    if (this.durationCooldown) {
      let sM = sH.runInterval(() => {
        this.durationCooldown?.isExpired() && (sG ? this.completeObjective() : this.fail()),
          (!this.isStarted || this.isCompleted) && sH.clearRun(sM);
      });
    }
  }
  loadTasks() {
    for (let sG = 0; sG < this.objectiveData.tasks.length; sG++) {
      let sH = this.objectiveData.tasks[sG];
      if (dC.testAll(this.dbePlayer, sH.requirements ?? [])) {
        let sI = this.id + ".task_" + (sG + 1),
          sK = this._progress.tasks.find(({ id: sM }) => sM === sI),
          sL = this.dbePlayer.tasks.registerTask(sI, { localizationKey: "quest." + sI, ...sH }, sK);
        if (sL.isValid()) {
          let sM = this.taskTypesMap.get(sL.type);
          sM ? sM.push(sL) : this.taskTypesMap.set(sL.type, [sL]),
            sL.onFailed(() => this.fail()),
            sL.onProgressChanged(() => {
              this.updateProgress(), this.notifyProgressChanged();
            });
        }
      }
    }
  }
  teleportToRegion(sG) {
    for (let sH of cY.getAll()) {
      let sI = eO(sH).getRegion(sG);
      if (sI) {
        return sI.teleportToRegion(this.dbePlayer.player);
      }
    }
    console.warn("[Dragon Universe] Mission destination region is unavailable: " + sG);
    this.dbePlayer.player.sendMessage("§cDestino da missão indisponível. Tente iniciar a missão novamente.");
    return Promise.resolve(!1);
  }
  updateProgress() {
    this.isGoalReached && this.completeObjective();
  }
};
import { EntityTypes as h0, Player as h1, system as h2 } from "@minecraft/server";
var h3 = class extends gN {
  taskData;
  spawnedEntities = [];
  spawnGeneration = 0;
  constructor(sG, sH, sI, sK) {
    super(sG, sH, sI, sK), (this.taskData = sI);
  }
  get entityDefinitions() {
    return this.taskData.entityDefinitions || fC.getDBEEntityDataByTypeId(this.entityTypeId)?.entityDefinitions;
  }
  get entityTypeId() {
    return this.taskData.entity;
  }
  get requiredProgress() {
    return this.taskData.count ?? 1;
  }
  get spawnEvent() {
    return this.taskData.entityDefinitions?.spawnEvent || void 0;
  }
  get spawnOnStart() {
    return this.taskData.spawnOnStart ?? !1;
  }
  get startError() {
    if (this.spawnOnStart) {
      let { dimension: sG, location: sH } = this.dbePlayer.player;
      if (!(eO(sG).getTopRegionAt(sH)?.allowQuests ?? !0)) return "SafeRegion";
    }
  }
  onStart() {
    this.spawnOnStart && this.spawnEntities();
  }
  onStop() {
    this.despawnEntities();
  }
  getRecommendedLevel() {
    let sG = this.entityDefinitions?.powerDefinition?.level,
      sH = 0;
    return typeof sG == "number" ? (sH = sG) : Array.isArray(sG) && (sH = sG[0] ?? 0), Math.floor(sH);
  }
  createDescription() {
    return {
      rawtext: [
        {
          translate: "quest.objective.defeat_enemy",
          with: { rawtext: [{ translate: h0.get(this.entityTypeId)?.localizationKey }] },
        },
      ],
    };
  }
  despawnEntities() {
    let sG = this.dbePlayer.player.id,
      sH = [...this.spawnedEntities];
    this.spawnGeneration++;
    if (!this.spawnedEntities.length) {
      for (let sI of cY.getAll())
        for (let sK of sI.getEntities())
          sK.getDynamicProperty("dbe:spawned_by") === this.localizationKey + "_" + sG && sH.push(sK);
    }
    this.spawnedEntities = [];
    h2.runTimeout(() => {
      for (let sL of sH) sL.isValid && sL.remove();
    }, 20);
  }
  async spawnEntities() {
    let generation;
    try {
      let { player: sG } = this.dbePlayer,
        { dimension: sH, location: sI } = sG,
        sK = this.entityTypeId === "dbe:shadow_dummy";
      this.despawnEntities();
      generation = this.spawnGeneration;
      for (let sL = 0; sL < this.requiredProgress; sL++) {
        if (generation !== this.spawnGeneration) return;
        if (!this.isStarted || !sG.isValid) {
          this.despawnEntities();
          return;
        }
        if (sG.dimension.id !== sH.id) {
          this.fail();
          return;
        }
        let sM = d2(sH, sI, 8);
        if (!sM) {
          this.fail();
          return;
        }
        let sN;
        if (sK) sN = this.dbePlayer.trySpawnShadowDummy(sM);
        else if (this.entityTypeId.startsWith("dbe:")) {
          let sO = late.i3.trySpawnDBEEntity(this.entityTypeId, sH, sM, { entityDefinitions: this.entityDefinitions });
          sN = sO?.entity;
        } else sN = d4(this.entityTypeId, sH, sM);
        if (!sN) {
          this.fail();
          return;
        }
        // Track ownership before callbacks that can fail.
        this.spawnedEntities.push(sN);
        sN.setDynamicProperty("dbe:spawned_by", this.localizationKey + "_" + sG.id);
        this.spawnEvent && sN.triggerEvent(this.spawnEvent);
        sH.playSound("common.teleport2", sM);
        await h2.waitTicks(5);
      }
    } catch (error) {
      console.warn("[Dragon Universe] Quest enemy spawn failed:", error);
      if (generation === undefined || generation === this.spawnGeneration) this.fail();
    }
  }
};
bM.on("entity_died", ({ damageSource: sG, entity: sH }) => {
  if (sG.damagingEntity instanceof h1) {
    let { tasks: sI } = late.hO(sG.damagingEntity);
    for (let sK of sI.getActiveTasksByType("defeat_enemy")) sH.typeId === sK.entityTypeId && sK.addProgress(1);
  }
});
// Registro de chefes derrotados (progression/progression.js, TREINOS.md §3.1): o mesmo critério de matador da tarefa
// defeat_enemy acima; réplica do treino mental (tag dbe:mental_replica) não conta.
bM.on("entity_died", ({ damageSource: sG, entity: sH }) => {
  if (!(sG.damagingEntity instanceof h1)) return;
  try {
    duRecordBossKill(late.hO(sG.damagingEntity), sH);
  } catch (error) {
    console.warn("[Dragon Universe] boss registry failed: " + (error?.stack ?? error));
  }
});
var h4 = class {
    constructor(sG, sH, sI) {
      (this.dbePlayer = sG),
        (this.questData = sH),
        ((this.progress = { id: sH.id, started: sI?.started ?? !1, objectives: sI?.objectives || [] }),
        gW.run(() => {
          this.loadObjectives(), this.loadRewards();
          if (this.id === "fetch_bulma_outfit" && sG.entity.isValid && late.i0.get(sG.entity.id) === sG &&
              sG.quests.questsMap.get(this.id) === this) sG.claimBulmaStaffReward();
        }));
    }
    objectives = [];
    rewards = [];
    progress;
    _isCompleted = !1;
    get autoStart() {
      return this.questData.autoStart ?? !1;
    }
    get descriptionKey() {
      return this.localizationKey + ".text";
    }
    get id() {
      return this.questData.id;
    }
    get isHiddenActive() {
      return this.questData.isHiddenActive ?? !1;
    }
    get isStarted() {
      return this.progress.started;
    }
    get localizationKey() {
      return "quest." + this.id;
    }
    get preDialogCount() {
      return this.questData.preDialogCount ?? 0;
    }
    get titleKey() {
      return this.localizationKey + ".title";
    }
    get type() {
      return this.questData.type;
    }
    async advanceToNextObjective() {
      if (this.isStarted && !this._isCompleted) {
        let sG = this.getInProgressObjective();
        sG &&
          !sG.isStarted &&
          (sG.autoStart && sG.canStart ? sG.startObjective() : this.stopQuest(),
          this.dbePlayer.sendQueueMessage({
            soundId: "random.pop",
            tickDelay: 20,
            message: { translate: "message.quest.objectiveUpdated", with: { rawtext: [{ translate: this.titleKey }] } },
          }));
      }
    }
    completeQuest() {
      if (this.isStarted && !this._isCompleted) {
        if (this.id === "fetch_bulma_outfit" && !this.dbePlayer.prepareBulmaStaffReward()) return !1;
        (this._isCompleted = !0),
          this.grantRewards(),
          this.onCompleted(),
          this.dbePlayer.sendQueueMessage({
            soundId: "music.game.quest_completed",
            tickDelay: 20,
            message: {
              rawtext: [{ translate: "message.quest.completed", with: { rawtext: [{ translate: this.titleKey }] } }],
            },
          });
        let { quests: sG } = this.dbePlayer;
        sG.advanceToNextMainQuest(this),
          sG.deleteQuest(this.id, !0),
          bM.dispatch("quest_completed", { dbePlayer: this.dbePlayer, quest: this });
        if (this.id === "fetch_bulma_outfit") this.dbePlayer.claimBulmaStaffReward();
      }
    }
    fail() {
      this.isStarted &&
        !this._isCompleted &&
        (this.stopQuest(),
        this.dbePlayer.sendQueueMessage({
          tickDelay: 20,
          message: { translate: "message.quest.objective.failed", with: { rawtext: [{ translate: this.titleKey }] } },
        }));
    }
    getAllObjectives() {
      return this.objectives;
    }
    getDefinedObjectives() {
      return this.questData.objectives;
    }
    getDialogueKeys() {
      let sG = [];
      for (let sH = 0; sH < this.preDialogCount; sH++) sG.push("quest." + this.id + ".dialog_" + (sH + 1));
      return sG;
    }
    getInProgressObjective() {
      return this.getAllObjectives().filter(({ isCompleted: sG }) => !sG)[0] ?? void 0;
    }
    getInProgressTasks() {
      let sG = this.getInProgressObjective(),
        sH = [];
      if (sG) {
        for (let sI of sG.getTasks()) sI.isCompleted || sH.push(sI);
      }
      return sH;
    }
    getObjectiveIndex(sG) {
      return this.getAllObjectives().indexOf(sG);
    }
    getProgress() {
      return { ...this.progress, objectives: this.getAllObjectives().map((sG) => sG.getProgress()) };
    }
    getRecommendedLevel() {
      return Math.max(...this.getAllTasks().map((sG) => sG.getRecommendedLevel()));
    }
    getRewards() {
      return this.rewards;
    }
    getAllTasks() {
      let sG = [];
      for (let sH of this.getAllObjectives()) sG.push(...sH.getTasks());
      return sG;
    }
    listObjectives() {
      let sG = [],
        sH = this.isStarted ? [this.getInProgressObjective()] : this.getAllObjectives(),
        sI = 1;
      for (let sK of sH)
        if (sK) {
          let sL = gX.getFormatedDescription(sK.getTasks(), sK.durationCooldown).rawtext,
            sM = [];
          sL ? (sM = [{ text: "\n " + (this.getObjectiveIndex(sK) + sI + ".") + " " }, ...sL]) : sI--,
            sG.push({ rawtext: sM });
        }
      return { rawtext: sG };
    }
    listRewards() {
      let sG = [];
      return (
        sG.push(
          ...this.getRewards().map((sH) => {
            let sI = sH.description?.rawtext,
              sK = [];
            return sI && (sK = [{ text: "\n - " }, ...sI]), { rawtext: sK };
          }),
        ),
        { rawtext: sG }
      );
    }
    objectivesCompleted() {
      return this.getAllObjectives().every(({ isCompleted: sG }) => sG);
    }
    restartInProgressObjective() {
      this.isStarted && this.getInProgressObjective()?.restart();
    }
    startQuest() {
      if (!this.isStarted) {
        let { player: sG, quests: sH } = this.dbePlayer,
          sI = this.getInProgressObjective();
        if (sI) {
          if (sH.hasActiveQuestOfType(this.type)) {
            sG.sendMessage({
              rawtext: [
                {
                  translate: "message.quest.error.duplicateTypeActive",
                  with: { rawtext: [{ translate: "quest." + this.type + ".plural" }] },
                },
              ],
            });
            return;
          }
          (this.progress.started = !0),
            sH.saveProgress(),
            sI.startObjective(),
            this.isStarted &&
              sG.sendMessage({
                rawtext: [{ translate: "message.quest.started", with: { rawtext: [{ translate: this.titleKey }] } }],
              });
        }
      }
    }
    stopQuest() {
      if (this.isStarted && !this._isCompleted) {
        for (let sG of this.getAllObjectives()) sG.pausable && sG.stopObjective();
        (this.progress.started = !1), this.dbePlayer.quests.saveProgress();
      }
    }
    calculateRewardFromEnemies() {
      return (
        (this.getAllTasks().reduce((sG, sH) => {
          if (sH instanceof h3) {
            let sI = sH.entityDefinitions?.powerDefinition?.level,
              sK = 0;
            return (
              typeof sI == "number" ? (sK = sI) : Array.isArray(sI) && (sK = sI[0] ?? 0), sG + sK * sH.requiredProgress
            );
          }
          return sG;
        }, 0) *
          gV.REWARD_MODIFIERS.QUEST_Z_POINTS) /
        (this.dbePlayer.quests.mainSagaRestartCount + 1)
      );
    }
    grantRewards() {
      for (let sG of this.getRewards()) {
        if (this.id === "fetch_bulma_outfit" && sG.rewardData.type === "item" && sG.rewardData.item === "dbe:power_pole") continue;
        sG.amount && (sG.tryGrantReward(this.dbePlayer), sG.sendRewardMessage(this.dbePlayer));
      }
    }
    loadObjectives() {
      for (let sG = 0; sG < this.questData.objectives.length; sG++) {
        let sH = this.questData.objectives[sG],
          sI = this.id + ".objective_" + (sG + 1),
          sK = this.progress.objectives.find(({ id: sM }) => sM === sI),
          sL = new gZ(this.dbePlayer, sI, sH, sK);
        sL.getTasks().length &&
          (this.objectives.push(sL),
          sL.onProgressChanged(() => {
            let { quests: sM } = this.dbePlayer;
            sM.saveProgress(),
              sL.isCompleted && this.advanceToNextObjective(),
              this.objectivesCompleted() && this.completeQuest();
          }),
          sL.onFailed(() => this.fail()));
      }
    }
    loadRewards() {
      if (this.questData.rewards)
        for (let sG of this.questData.rewards) {
          let sH = gB.get(sG.type);
          if (sH) {
            let sI = new sH(sG);
            if ((this.rewards.push(sI), sI.amountSource === "based_on_enemies")) {
              let sK = this.calculateRewardFromEnemies();
              sI.setValue(sK);
            }
          }
        }
    }
    onCompleted() {}
  },
  h5 = class extends h4 {
    questData;
    constructor(sG, sH, sI) {
      super(sG, sH, sI), (this.questData = sH);
    }
    get mentorId() {
      return this.questData.mentorId;
    }
    onCompleted() {
      let sG = this.dbePlayer.masterManager.getCurrentMaster();
      if (sG && sG.id === this.questData.mentorId) {
        let { currentTeachingIndex: sH, teachings: sI } = sG,
          { length: sK } = sI,
          sL = sH + 1;
        sH < sK - 1 && sG.startTeaching(sL);
      }
    }
  },
  h6 = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        ((this.questsInfo = sG.data.get("quests_info") || { quests: [], completedQuests: [], mainSagaRestartCount: 0 }),
        gU.run(() => {
          if (sG.entity.isValid && late.i0.get(sG.entity.id) === sG) this.loadQuests();
        }));
    }
    questsInfo;
    questsMap = new Map();
    isSaving = !1;
    get mainSagaRestartCount() {
      return this.questsInfo.mainSagaRestartCount;
    }
    set mainSagaRestartCount(sG) {
      (this.questsInfo.mainSagaRestartCount = sG), this.saveProgress();
    }
    async addQuest(sG) {
      if (!this.hasQuest(sG)) {
        let sH = g5.getQuestDataById(sG);
        if (sH) {
          let sI = sH.type === "mentor" ? h5 : h4,
            sK = new sI(this.dbePlayer, sH);
          return sK.preDialogCount && !(await gP(this.dbePlayer.player, "ui.dbe.npc", sK.getDialogueKeys()))
            ? void 0
            : (this.dbePlayer.sendQueueMessage({
                tickDelay: 40,
                message: {
                  rawtext: [
                    { translate: "message.quest.newQuestAvailable", with: { rawtext: [{ translate: sK.titleKey }] } },
                  ],
                },
              }),
              !this.hasActiveQuestOfType(sK.type) && sK.autoStart && !sK.isStarted && sK.startQuest(),
              this.questsMap.set(sG, sK),
              this.saveProgress(),
              sK);
        } else throw new Error("Nenhuma missão com o ID '" + sG + "' foi encontrada.");
      }
    }
    advanceToNextMainQuest(sG) {
      if (sG.type === "main") {
        let sH = g5.getNextMainQuestData(sG.id);
        sH && (this.addQuest(sH.id), sH === g5.getQuestDataByIndex(0, "main") && this.mainSagaRestartCount++);
      }
    }
    deleteQuest(sG, sH = !1) {
      let sI = this.questsMap.get(sG);
      if (sI) {
        let { tasks: sK } = this.dbePlayer;
        for (let sL of sI.getAllObjectives()) sL.stopObjective(), sK.removeTask(...sL.getTasks());
        sH && this.questsInfo.completedQuests.push(sG), this.questsMap.delete(sG), this.saveProgress();
      }
    }
    describeQuests(sG) {
      let sH = [],
        sI = this.getActiveQuests();
      for (let sK of sI) {
        if (!sG && sK.isHiddenActive) continue;
        let sL = sK.listObjectives().rawtext;
        sL && sH.push({ translate: sK.titleKey }, ...sL, { text: "\n\n" });
      }
      return { rawtext: sH };
    }
    getActiveQuests() {
      let sG = [];
      for (let sH of this.getQuests()) sH.isStarted && sG.push(sH);
      return sG;
    }
    getQuests() {
      return this.questsMap.values();
    }
    getCompletedQuestIds() {
      return this.questsInfo.completedQuests;
    }
    hasActiveQuestOfType(sG) {
      return this.getActiveQuests().some(({ type: sH }) => sH !== "challenge" && sH === sG);
    }
    hasQuest(sG) {
      return this.questsMap.has(sG);
    }
    loadQuests() {
      for (let sG of this.questsInfo.quests)
        if (!this.questsMap.has(sG.id)) {
          let sH = g5.getQuestDataById(sG.id);
          if (sH) {
            let sI = sH.type === "mentor" ? h5 : h4,
              sK = new sI(this.dbePlayer, sH, sG);
            this.questsMap.set(sK.id, sK);
          }
        }
    }
    saveProgress() {
      this.isSaving ||
        ((this.isSaving = !0),
        gU.run(() => {
          this.questsInfo.quests.length = 0;
          for (let sG of this.getQuests()) this.questsInfo.quests.push(sG.getProgress());
          this.dbePlayer.data.set("quests_info", this.questsInfo), (this.isSaving = !1);
        }));
    }
    stopActiveQuests() {
      for (let sG of this.getActiveQuests()) sG.stopQuest();
    }
  };
bM.on("quest_completed", ({ dbePlayer: sG, quest: sH }) => {
  if (sH.id === "visit_lookout") {
    let sI = [
      { translate: "tutorial.message.npc_1" },
      { translate: "tutorial.message.npc_2" },
      { translate: "tutorial.message.npc_3" },
      { translate: "tutorial.message.npc_4" },
    ];
    for (let sK of sI) sG.sendQueueMessage({ message: sK, soundId: "random.pop", tickDelay: 80 });
  }
});
import { EntitySwingSource as h7, world as h8 } from "@minecraft/server";
import { skills_data as h9 } from "./data/skills_data.js";
import { InputPermissionCategory as hb, system as hf } from "@minecraft/server";
var hj = class extends cF {
    skillData;
    kiAttackProperties;
    isLoadingAttack = !1;
    constructor(sG, sH) {
      super(sG, sH);
      let sI = h9.find((sK) => sK.id === sH.id);
      if (!sI || sI.type !== "ki_attack") throw new Error("Habilidade '" + sH.id + "' não foi definida ou é invalida.");
      (this.skillData = sI), (this.kiAttackProperties = this.skillData.kiAttackProperties);
    }
    get canMoveWhileFiring() {
      return this.skillData, this.skillData.canMoveWhileFiring ?? !1;
    }
    get chargeKiDrain() {
      return this.skillData.chargeKiDrain ?? 1;
    }
    get chargeSpeed() {
      return this.skillData.chargeSpeed ?? 1;
    }
    get color0() {
      let { color0: sG } = this.kiAttackProperties;
      return sG ?? this.dbeEntity.ki.getCurrentKiColor();
    }
    get color1() {
      let { color1: sG } = this.kiAttackProperties;
      return sG ?? this.dbeEntity.ki.getCurrentKiColor();
    }
    get ignoreAttackBar() {
      return this.skillData.ignoreAttackBar ?? !1;
    }
    get propertyIndex() {
      return this.skillData.propertyIndex;
    }
    getAttackOffset() {
      let { location: sG } = this.dbeEntity.entity,
        sH = this.getAttackDirection(),
        sI = this.skillData.offset ?? [1, 1, 0],
        sK = sI[0] * (this.kiAttackProperties.baseScale ?? 1),
        sL = { x: 0, y: 1, z: 0 },
        sM = { x: sH.z * sL.y - sH.y * sL.z, y: sH.x * sL.z - sH.z * sL.x, z: sH.y * sL.x - sH.x * sL.y };
      return {
        x: sG.x + sH.x * sK + sL.x * sI[1] + sM.x * sI[2],
        y: sG.y + sH.y * sK + sL.y * sI[1] + sM.y * sI[2],
        z: sG.z + sH.z * sK + sL.z * sI[1] + sM.z * sI[2],
      };
    }
    shootAttack(sG) {
      let sH = d4("dbe:ki_attack", this.dbeEntity.entity.dimension, this.getAttackOffset());
      if (!sH) return;
      sH.setDynamicProperty("ki_attack_id", this.id);
      let sI = sH.getComponent("minecraft:projectile"),
        sK = late.i3.getKiAttackEntity(sH);
      if (sK && sI) {
        (sI.gravity = 0),
          (sI.airInertia = 1),
          (sI.liquidInertia = 1),
          (sI.owner = this.dbeEntity.entity),
          sK.setPowerPercent(sG),
          sK.setScale(sK.baseScale),
          sK.setColor({ color0: this.color0, color1: this.color1 });
        let sL = this.getAttackVelocity(this.getAttackDirection(), sK.attackSpeed);
        sI.shoot(sL);
      }
    }
    startCharge() {
      let { chargeBar: sG, ki: sH } = this.dbeEntity;
      if (sH.currentValue <= 0) return;
      let { startChargeSound: sI } = this.skillData,
        sK = this.dbeEntity instanceof late.hN && this.dbeEntity.isInActiveMode;
      if (
        (this.updateKiManipulationColor(),
        this.dbeEntity.trySetProperty("dbe:charging_attack", this.propertyIndex),
        (this.isLoadingAttack = !0),
        this.canMoveWhileFiring ||
          (this.dbeEntity instanceof late.hN
            ? this.dbeEntity.inputPermissionManager.blockInputPermission("charge_ki_attack", [hb.Movement])
            : this.dbeEntity.entity.triggerEvent("dbe:stop_movement")),
        sI)
      ) {
        let { dimension: sL, location: sM } = this.dbeEntity.entity;
        sL.playSound(sI, sM);
      }
      hf.runTimeout(() => {
        if (!this.dbeEntity.entity.isValid) return;
        let sN = 0;
        sG.startIncrease(this.chargeSpeed),
          sG.onIncrease((sO) => {
            let sP = !(this.dbeEntity instanceof late.hN) && Math.random() < 0.1 && sO >= 50,
              sQ = sP;
            this.ignoreAttackBar && sO >= 100
              ? (this.useSkill(sO), sH.removeCurrent(sN), sG.reset())
              : (!this.isLoadingAttack || sP) && ((sQ = !0), sO >= 50 && (sH.removeCurrent(sN), this.useSkill(sO))),
              sK && sO < 100 && (sN = (this.chargeKiDrain * sO) / 100),
              (sQ || sH.currentValue - sN <= 0) && (sG.stopIncrease(), this.stopCharge());
          });
      }, 2);
    }
    stopCharge() {
      (this.isLoadingAttack = !1),
        hf.runTimeout(() => this.dbeEntity.trySetProperty("dbe:charging_attack", 0), 5),
        this.canMoveWhileFiring ||
          hf.runTimeout(() => {
            if (!this.isLoadingAttack) {
              if (this.dbeEntity instanceof late.hN)
                this.dbeEntity.inputPermissionManager.unblockInputPermission("charge_ki_attack");
              else
                try {
                  this.dbeEntity.entity.triggerEvent("dbe:enable_movement");
                } catch {}
            }
          }, 10);
    }
    useSkill(sG) {
      let { shootSound: sH } = this.skillData;
      this.dbeEntity.trySetProperty("dbe:charging_attack", -1),
        this.shootAttack(sG),
        this.ignoreAttackBar &&
          hf.runTimeout(() => this.dbeEntity.trySetProperty("dbe:charging_attack", this.propertyIndex), 1),
        sH && this.dbeEntity.entity.dimension.playSound(sH, this.dbeEntity.entity.location);
    }
    getAttackDirection() {
      let { entity: sG, target: sH } = this.dbeEntity;
      return !(this.dbeEntity instanceof late.hN) && sH
        ? bO.normalize(bO.subtract(sH.getHeadLocation(), sG.getHeadLocation()))
        : sG.getViewDirection();
    }
    getAttackVelocity(sG, sH) {
      return { x: sG.x * sH, y: sG.y * sH, z: sG.z * sH };
    }
    updateKiManipulationColor() {
      this.dbeEntity.colors.setColorProperty(0, this.color0, "dbe:ki_attack_color"),
        this.dbeEntity.colors.setColorProperty(1, this.color1, "dbe:ki_attack_color");
    }
  },
  hk = class {
    constructor(sG) {
      this.dbeEntity = sG;
    }
    selectedSlotIndex = 0;
    get selectedSkill() {
      return this.getEquippedSkills()[this.selectedSlotIndex] || void 0;
    }
    selectNextSlot() {
      let sG = this.getEquippedSkills().length,
        sH = this.selectedSkill;
      sH instanceof hj && sH.stopCharge(),
        sG && ((this.selectedSlotIndex = ++this.selectedSlotIndex % sG), this.updateSideBar());
    }
    getEquippedSkills() {
      let sG = [];
      for (let sH of this.dbeEntity.skills.getSkills())
        (sH.type === "ki_attack" || sH.skillData?.showInSidebar === !0) && sG.push(sH);
      return sG;
    }
    updateSideBar() {
      if (this.dbeEntity instanceof late.hN) {
        let { title: sG } = this.dbeEntity,
          sH = this.getEquippedSkills();
        sH.length &&
          (sG.setTitle("selected_technique_index", this.selectedSlotIndex),
          sH.forEach(({ id: sI }, sK) => {
            sG.setTitle("technique_slot_" + sK, sI);
          }));
      }
    }
  };
h8.afterEvents.playerSwingStart.subscribe(({ player: sG, swingSource: sH }) => {
  let { selectedSlotIndex: sI } = sG;
  sI === 6 && sH === h7.Attack && late.hO(sG).skillsContainer.selectNextSlot();
});
var hp = class {
  constructor(sG) {
    this.titleManager = sG;
  }
  activeIcons = new Set();
  addIcon(sG) {
    this.activeIcons.has(sG) || (this.activeIcons.add(sG), this.updateIcons());
  }
  removeIcon(sG) {
    this.activeIcons.has(sG) && (this.activeIcons.delete(sG), this.updateIcons());
  }
  updateIcons() {
    for (let sG = 0; sG < 9; sG++) {
      let sH = "status_slot_" + sG,
        sI = [...this.activeIcons.values()][sG];
      this.titleManager.setTitle(sH, sI);
    }
  }
};
import { system as hq } from "@minecraft/server";
var hv = class {
  constructor(sG) {
    this.screenDisplay = sG;
  }
  updating = !1;
  currentSubtitlesMap = new Map();
  subtitlesQueueMap = new Map();
  titlesMap = new Map();
  async reloadTitles() {
    for (; this.updating; ) await hq.waitTicks(1);
    (this.subtitlesQueueMap = new Map(this.currentSubtitlesMap)), this.updateAll();
  }
  setSubtitle(sG, sH) {
    let sI = sH ? sG + ":" + sH : " ";
    this.currentSubtitlesMap.get(sG) !== sI &&
      (this.currentSubtitlesMap.set(sG, sI), this.subtitlesQueueMap.set(sG, sI), this.updateAll());
  }
  setTitle(sG, sH) {
    let sI = sG + ":" + sH;
    this.titlesMap.get(sG) !== sI &&
      (sH === void 0 ? this.titlesMap.delete(sG) : this.titlesMap.set(sG, sI), this.updateAll());
  }
  async updateAll() {
    if (!this.updating) {
      this.updating = !0;
      let sG = hq.runInterval(() => {
        let { isValid: sH } = this.screenDisplay;
        sH && (this.updateNextSubtitle(), this.updateTitles()),
          (!sH || !this.subtitlesQueueMap.size) && ((this.updating = !1), hq.clearRun(sG));
      }, 5);
    }
  }
  updateNextSubtitle() {
    if (this.subtitlesQueueMap.size) {
      let [sG, sH] = this.subtitlesQueueMap.entries().next().value;
      this.screenDisplay.updateSubtitle(sH), this.subtitlesQueueMap.delete(sG);
    }
  }
  updateTitles() {
    if (this.titlesMap.size) {
      let sG = [...this.titlesMap.values()];
      this.screenDisplay.setTitle(sG.join(""), { fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 0 });
    }
  }
};
import { EquipmentSlot as hw, Player as hx, system as hy } from "@minecraft/server";
var hz = 24000,
  hA = class {
    constructor(sG) {
      this.dbePlayer = sG;
    }
    scannedEntities = new Map();
    get canSenseKi() {
      return this.dbePlayer.skills.hasSkill("ki_sense") || !!this.hasKiDetectorEquipped();
    }
    get kiSenseLevel() {
      if (this.hasKiDetectorEquipped()) return 5;
      let { skills: sG } = this.dbePlayer;
      return sG.getSkill("ki_sense")?.level ?? 0;
    }
    hasKiDetectorEquipped() {
      return aN.getEquippedItem(this.dbePlayer.player, hw.Head)?.hasComponent("dbe:scouter");
    }
    detectNearestDBEEntity() {
      let { attributes: sG } = this.dbePlayer,
        { battlePower: sH } = sG,
        sI = hy.currentTick;
      for (let [sL, sM] of this.scannedEntities) sI - sM > hz && this.scannedEntities.delete(sL);
      let sK = { location: this.dbePlayer.player.location, maxDistance: this.kiSenseLevel * 25.6 };
      for (let sN of late.i3.getDBEEntities(this.dbePlayer.player.dimension, sK)) {
        let { entity: sO } = sN;
        if (!sN.hasAttributesDefined || sN === this.dbePlayer || (sN instanceof late.hN && sN.isActionBlocked)) continue;
        let { battlePower: sP } = sN.attributes;
        return (
          sP > sH &&
            !this.scannedEntities.has(sO.id) &&
            (this.scannedEntities.set(sO.id, sI),
            this.hasKiDetectorEquipped()
              ? this.dbePlayer.player.playSound("item.scouter.warn")
              : this.dbePlayer.player.playSound("common.ki_sense")),
          sN
        );
      }
    }
    getDescription(sG) {
      let sH = [],
        { kiSenseLevel: sI } = this,
        { attributes: sK, entity: sL, health: sM } = sG,
        sN = aO.shortenNumber(sK.battlePower),
        sO = sL instanceof hx ? sL.name : sL.localizationKey,
        sP = sI >= 2 ? sM.currentValue + " / " + sM.maxValue : "",
        sQ = sI >= 4 ? "\nBP " + sN : "";
      return (
        sH.push(
          { text: "§r§a§l>> §r§a" },
          { translate: "" + sO },
          { text: " §l<< §r§a" },
          { text: "" + sP + sQ + "§r" },
        ),
        { rawtext: sH }
      );
    }
  };
import { CONFIG as hB } from "./config/config.js";
import { system as hC } from "@minecraft/server";
var hD = class extends gA {
    rewardData;
    constructor(sG) {
      super(sG), (this.rewardData = sG);
    }
    get pointType() {
      return this.rewardData.pointType;
    }
    grantReward(sG) {
      let { pointsManager: sH } = sG;
      sH.add(this.pointType, this.amount);
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.reward.points",
            with: { rawtext: [{ text: "" + this.amount }, { translate: "point." + this.pointType }] },
          },
        ],
      };
    }
    createRewardMessage() {
      return {
        translate: "reward.points",
        with: { rawtext: [{ text: "" + this.amount }, { translate: "point." + this.pointType }] },
      };
    }
  },
  hE = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        (this.levelData = sG.data.get("level") || { level: hB.LEVEL.INITIAL_LEVEL, points: hB.LEVEL.INITIAL_XP });
    }
    levelData;
    get currentLevel() {
      return this.levelData.level;
    }
    get currentPoints() {
      return this.levelData.points;
    }
    get multiplier() {
      return (this.dbePlayer.race.id === "glind" ? 1.1 : 1) * this.dbePlayer.trainingMultiplier;
    }
    addPoints(sG) {
      (this.levelData.points += Math.floor(sG)),
        this.currentPoints >= this.getPointsToNextLevel() && this.updateLevel(),
        this.save();
    }
    getPointsToNextLevel() {
      return this.currentLevel * hB.LEVEL.XP_PER_LEVEL;
    }
    setLevel(sG) {
      if (typeof sG != "number") throw new TypeError("O valor precisa ser um número.");
      if (isNaN(sG)) throw new TypeError("O valor fornecido não é um número válido.");
      (this.levelData.level = sG), this.save();
    }
    grantRewards(sG) {
      let { player: sH } = this.dbePlayer,
        sI = new hD({
          type: "points",
          pointType: "attribute_points",
          amount: hB.LEVEL.ATTRIBUTE_POINTS_PER_LEVEL * sG,
        }),
        sK = new hD({ type: "points", pointType: "skill_points", amount: hB.LEVEL.SKILL_POINTS_PER_LEVEL * 5 * sG });
      sI.tryGrantReward(this.dbePlayer),
        sK.tryGrantReward(this.dbePlayer),
        hC.run(() => {
          sI.sendRewardMessage(this.dbePlayer), sK.sendRewardMessage(this.dbePlayer);
        });
    }
    save() {
      this.dbePlayer.data.set("level", this.levelData);
    }
    updateLevel() {
      let sG = this.currentLevel;
      for (; this.currentPoints >= this.getPointsToNextLevel(); )
        (this.levelData.points -= this.getPointsToNextLevel()), this.levelData.level++;
      let sH = this.currentLevel - sG;
      sH > 0 &&
        (this.dbePlayer.sendQueueMessage({
          tickDelay: 20,
          message: { translate: "message.level.up", with: ["" + this.currentLevel] },
        }),
        this.grantRewards(sH));
    }
  },
  hF = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        (this.pointMap = {
          attribute_points: new fj("attribute_points", sG.data),
          skill_points: new fj("skill_points", sG.data),
        });
    }
    pointMap;
    add(sG, sH) {
      this.pointMap[sG].addCurrent(sH);
    }
    get(sG) {
      return this.pointMap[sG].currentValue;
    }
    remove(sG, sH) {
      this.pointMap[sG].removeCurrent(sH);
    }
    trySpend(sG, sH) {
      let sI = this.pointMap[sG];
      return sI.currentValue < sH
        ? (this.dbePlayer.player.sendMessage({
            translate: "message.learn.error.1",
            with: { rawtext: [{ translate: "point." + sG }] },
          }),
          !1)
        : (sI.removeCurrent(sH), !0);
    }
  };
import { CONFIG as hG } from "./config/config.js";
import { MolangVariableMap as hH, system as hI } from "@minecraft/server";
var hJ = 1,
  hK = { 0: "#00ff22", 1: "#ff0000", 2: "#242424" },
  hL = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        (this.data = sG.data.get("concentration_training") || { highScore: 0, remainingAttempts: 3 });
    }
    data;
    orbs = [];
    score = 0;
    isTraining = !1;
    get remainingAttempts() {
      return this.data.remainingAttempts;
    }
    get rewardAmount() {
      return Math.floor(this.score / 5);
    }
    get tickSpeed() {
      return bN(Math.floor(20 - this.score / 5), 1, 20);
    }
    checkAndUpdateAttempts() {
      let { cooldowns: sG } = this.dbePlayer,
        sH = sG.getCooldown("concentration_training");
      sH
        ? sH.isExpired() && (sG.clearCooldown("concentration_training"), (this.data.remainingAttempts = 5), this.save())
        : this.remainingAttempts <= 0 &&
          sG.setCooldown("concentration_training", hG.CONCENTRATION_COOLDOWN_TICKS, "absolute_time");
    }
    async claimOrb(sG) {
      if (!sG.isValid) return;
      let { dimension: sH, location: sI } = sG,
        sK = sG.getProperty("dbe:color");
      if (
        (sK === 0 && ((this.score += 1), sH.playSound("common.ki_blast", sI, { pitch: 1.7 })),
        sK === 1 &&
          ((this.score = Math.max(this.score - 1, 0)),
          aN.applyCameraShake(this.dbePlayer.player, 0.1, 0.1),
          sH.playSound("common.ki_blast", sI, { pitch: 1.5 })),
        sK === 2)
      ) {
        this.stopTraining(), sH.playSound("common.ki_blast", sI, { pitch: 0.8 });
        return;
      }
      sG.remove();
    }
    startTraining() {
      (this.isTraining = !0), --this.data.remainingAttempts, this.updateOrbs(), this.save();
      let sG = this.dbePlayer.runInterval(() => {
        if (!this.isTraining) {
          this.dbePlayer.clearRun(sG);
          return;
        }
        hI.currentTick % this.tickSpeed === 0 && this.updateOrbs();
      });
    }
    stopTraining() {
      this.score > this.data.highScore && (this.data.highScore = this.score),
        this.grantReward(),
        (this.score = 0),
        (this.isTraining = !1),
        this.checkAndUpdateAttempts(),
        this.removeAllOrbs(),
        this.save();
    }
    getDescription() {
      return {
        rawtext: [
          {
            translate: "minigame.concentration.text",
            with: {
              rawtext: [
                { text: this.score + "\n" },
                { text: this.rewardAmount + " " },
                { text: "\n" },
                { text: "" + this.remainingAttempts },
              ],
            },
          },
        ],
      };
    }
    grantReward() {
      let sG = new hD({ type: "points", pointType: "attribute_points", amount: this.rewardAmount });
      sG.tryGrantReward(this.dbePlayer), sG.sendRewardMessage(this.dbePlayer);
    }
    removeAllOrbs() {
      for (let sG of this.orbs) sG.isValid && sG.remove();
      this.orbs.length = 0;
    }
    save() {
      this.dbePlayer.data.set("concentration_training", this.data);
    }
    spawnOrb(sG = 1, sH) {
      let { dimension: sI, location: sK } = this.dbePlayer.player,
        sL = hK[sH],
        sM = this.dbePlayer.player.getViewDirection(),
        sN = bO.normalize({ x: sM.x, y: 0, z: sM.z });
      for (let sO = 0; sO < sG; sO++) {
        let sP = bO.scale(sN, hJ + 1),
          sQ = bO.add(sK, sP),
          sR = new bP(aO.random(-hJ, hJ), aO.random(1, 2), aO.random(-hJ, hJ)),
          sS = bO.add(sQ, sR),
          sT = d4("dbe:training_orb", sI, sS);
        if (!sT) throw new Error();
        sT.applyImpulse(new bP(aO.random(0, 0.01), 0, aO.random(0, 0.01))),
          sT.setProperty("dbe:color", sH),
          this.orbs.push(sT),
          this.spawnOrbParticle(sS, sL),
          sI.playSound("common.ki_blast", sS, { pitch: 3 });
      }
    }
    spawnOrbParticle(sG, sH) {
      let sI = new hH();
      sI.setColorRGB("color", aI.colorToRgb(sH)),
        sI.setFloat("age", this.tickSpeed / 20),
        this.dbePlayer.player.spawnParticle("dbe:concentration_orb", sG, sI);
    }
    async updateOrbs() {
      this.removeAllOrbs();
      try {
        this.spawnOrb(1, 0), this.spawnOrb(2, 1), this.spawnOrb(2, 2);
      } catch {
        this.stopTraining();
      }
    }
  },
  hM = class {
    constructor(sG) {
      this.inputPermissions = sG;
      // Native permissions survive reconnects; the transient owners below are rebuilt for this session.
      this.setPermissions([bW.Movement, bW.Camera], !0);
    }
    blockedPermissions = new Map();
    blockInputPermission(sG, sH) {
      this.blockedPermissions.set(sG, sH), this.updatePermissions();
    }
    unblockInputPermission(sG) {
      let sH = this.blockedPermissions.get(sG);
      sH && (this.blockedPermissions.delete(sG), this.setPermissions(sH, !0), this.updatePermissions());
    }
    setPermissions(sG, sH) {
      if (sG.length) {
        for (let sI of sG) this.inputPermissions.setPermissionCategory(sI, sH);
      }
    }
    updatePermissions() {
      for (let sG of this.blockedPermissions.values()) this.setPermissions(sG, !1);
    }
  },
  hN = class extends fV {
    constructor(sG) {
      super(sG),
        (this.player = sG),
        ((this.entity = sG),
        (this.serverData = bG(sG, "server")),
        (this.tasks = new gR(this)),
        (this.achievements = new gD(this)),
        (this.concentrationTraining = new hL(this)),
        (this.inputPermissionManager = new hM(sG.inputPermissions)),
        (this.kiSense = new hA(this)),
        (this.masterManager = new g7(this)),
        (this.playerCustomization = new gT(this)),
        (this.pointsManager = new hF(this)),
        (this.quests = new h6(this)),
        (this.redeem = new gw(this)),
        (this.skillsContainer = new hk(this)),
        (this.title = new hv(sG.onScreenDisplay)),
        (this.statusIndicator = new hp(this.title)),
        (this.level = new hE(this)),
        (this.zeni = new gS(this)));
    }
    entity;
    achievements;
    concentrationTraining;
    kiSense;
    inputPermissionManager;
    level;
    masterManager;
    playerCustomization;
    pointsManager;
    quests;
    redeem;
    skillsContainer;
    serverData;
    statusIndicator;
    tasks;
    title;
    zeni;
    currentTrainingWeight;
    processingQueueMessages = !1;
    queueMessages = [];
    get race() {
      let sG = super.race;
      if (!sG) throw new Error("Jogador " + this.player.name + " não possui raça.");
      return sG;
    }
    get hasStartedAdventure() {
      return !!this.data.get("has_started_adventure");
    }
    get isActionBlocked() {
      let sG = this.getCurrentFusion(),
        sH = sG ? sG.isController === !1 : !1,
        sI = this.player.getGameMode() === bV.Spectator;
      return this.isKnockedOut || sH || sI;
    }
    get isArmorVisible() {
      return !!this.player.getProperty("dbe:is_armor_visible");
    }
    set isArmorVisible(sG) {
      this.trySetProperty("dbe:is_armor_visible", sG);
    }
    get isInActiveMode() {
      return [bV.Adventure, bV.Survival].includes(this.player.getGameMode());
    }
    get isFused() {
      return ex.isFused(this);
    }
    despawnShadowDummies() {
      for (let sG of late.i3.getDBEEntities())
        sG.entity.typeId === "dbe:shadow_dummy" && sG.data.get("owner_id") === this.player.id && sG.entity.remove();
    }
    getCurrentFusion() {
      return ex.getFusion(this);
    }
    getTrainingWeight() {
      return aN.getEquippedItem(this.entity, bU.Offhand);
    }
    knockout() {
      if (!this.isKnockedOut) {
        this.setKnockoutState(!0), this.transformations.untransform(), this.skills.disableToggleSkills();
        let sG = this.runInterval(() => {
          this.health.healthPercent >= 15 && (this.setKnockoutState(!1), this.clearRun(sG));
        }, 20);
      }
    }
    reset() {
      return new Promise((resolve) => bX.run(() => {
        if (!this.player.isValid || late.i0.get(this.player.id) !== this) return resolve(!1);
        let sG = [
          "dbe:color_0",
          "dbe:color_1",
          "dbe:color_2",
          "dbe:color_3",
          "dbe:customization_0",
          "dbe:customization_1",
          "dbe:customization_2",
          "dbe:customization_3",
          "dbe:ki_attack_color_0",
          "dbe:ki_attack_color_1",
          "dbe:aura_boost",
          "dbe:aura_sound",
          "dbe:aura_type",
          "dbe:body_type",
          "dbe:charging_attack",
          "dbe:dragon_radar_location",
          "dbe:fusion_type",
          "dbe:gender",
          "dbe:has_majin_mark",
          "dbe:has_tail",
          "dbe:oni_blessing",
          "dbe:is_armor_visible",
          "dbe:is_death",
          "dbe:is_defending",
          "dbe:fly_mode",
          "dbe:is_knocked_out",
          "dbe:kaioken",
          "dbe:ki_scythe",
          "dbe:race",
          "dbe:tail_curled",
          "dbe:transformation",
          "dbe:ultra_instinct",
        ];
        const properties = new Map();
        let tags = [], saved;
        try {
          tags = this.player.getTags().filter(tag => tag.startsWith("dbe:"));
          saved = JSON.parse(JSON.stringify(this.data.getData()));
          for (const id of sG) {
            const value = this.entity.getProperty(id);
            if (value === undefined) throw new Error("Reset property unavailable: " + id);
            properties.set(id, value);
          }
          for (let sH of sG) this.entity.resetProperty(sH);
          for (const tag of tags) this.player.removeTag(tag);
          this.skills.disableToggleSkills();
          this.data.clear();
          this.data.save();
          if (this.data.dirty) throw new Error("Character reset could not be persisted");
          this.clearAllRuns(), late.i3.deleteEntity(this.player);
          resolve(!0);
        } catch (error) {
          console.warn("[Afterlife] character reset failed; restoring saved state: " + (error?.stack ?? error));
          try {
            for (const [id, value] of properties) this.entity.setProperty(id, value);
            for (const tag of tags) this.player.addTag(tag);
            if (saved !== undefined) {
              this.data.data = saved;
              this.data.dirty = !0;
              this.data.save();
            }
          } catch (restoreError) {
            console.warn("[Afterlife] reset rollback requires inspection: " + (restoreError?.stack ?? restoreError));
          }
          resolve(!1);
        }
      }));
    }
    sendQueueMessage(sG) {
      this.queueMessages.push(sG), this.processingQueueMessages || this.processQueueMessages();
    }
    setRace(sG) {
      let sH = fR.get(sG)?.getData();
      if (sH) {
        (this._race = new fS(sH)),
          this.attributes.modifiers.removeAllModifiers(),
          this.attributes.modifiers.applyDefaultModifiers(),
          this.attributes.modifiers.applyRacialModifiers(),
          this.transformations.clearTransformations(),
          this.skills.disableToggleSkills();
        for (let sI of this.race.defaultSkills) this.skills.addSkill(sI);
        this.trySetProperty("dbe:race", this.race.id), (this.playerCustomization.raceIndex = fR.getIndex(this.race.id) ?? 0);
      } else throw new fP(sG);
    }
    trySpawnShadowDummy(sG) {
      let sH = d4("dbe:shadow_dummy", this.player.dimension, sG);
      if (!sH) return;
      let sI = late.i3.getDBEEntity(sH);
      if (!sI) return;
      let sK = this.ki.getCurrentAuraProperties();
      sI.ki.setCurrentAura(sK), sI.data.set("owner_id", this.player.id), (sH.nameTag = this.player.nameTag);
      for (let sL of sI.attributes.getAttributes()) {
        let sM = this.attributes.getAttribute(sL.id);
        sL.setValue(sM?.modifiedValue ?? 1);
      }
      return sH;
    }
    startAdventure() {
      let { quests: sG } = this,
        sH = g5.getQuestDataByIndex(0, g3.Main);
      sH && sG.addQuest(sH.id),
        this.skills.tryLearnRandomSkill(),
        this.recoverConstitution(),
        cj.displayForm(this.player, "news"),
        this.data.set("has_started_adventure", !0);
    }
    async teleportToSpawnPoint(options = {}) {
      try {
        await duSafeReturnToEarth(this.player, { ...options, label: "return to Earth" });
        return this.player.isValid && late.i0.get(this.player.id) === this &&
          this.player.dimension.id === "minecraft:overworld" && duIsSafeStanding(this.player.dimension, this.player.location);
      } catch (error) {
        duReportTravelFailure(this.player, "return to Earth", error);
        return !1;
      }
    }
    persistAfterlifeReturn(value) {
      const previous = this.data.get("afterlife_return");
      try {
        value === undefined ? this.data.delete("afterlife_return") : this.data.set("afterlife_return", value);
        this.data.save();
        if (this.data.dirty) throw new Error("Return intent could not be saved for this player");
      } catch (error) {
        previous === undefined ? this.data.delete("afterlife_return") : this.data.set("afterlife_return", previous);
        try { this.data.save(); } catch (restoreError) { console.warn("[Afterlife] intent rollback: " + restoreError); }
        throw error;
      }
    }
    async returnFromAfterlife(kind) {
      if (!["revive", "reincarnate"].includes(kind) || this.afterlifeReturnPending) return !1;
      const current = () => this.player.isValid && late.i0.get(this.player.id) === this;
      if (!current()) return !1;
      if (!this.data.get("afterlife_return") && !this.isDeath && this.player.dimension.id !== "dbe:other_world") return !1;
      this.afterlifeReturnPending = !0;
      try {
        const success = await this.teleportToSpawnPoint({ onPrepared: (target) => {
          if (!current()) throw new Error("Player instance changed during Earth preparation");
          this.persistAfterlifeReturn({ kind, stage: "prepared", target });
        } });
        if (!success || !current()) return !1;
        const intent = this.data.get("afterlife_return");
        this.persistAfterlifeReturn({ ...intent, kind, stage: "arrived" });
        await ex.tryStopFusion(this);
        if (!current()) return !1;
        if (this.player.dimension.id !== "minecraft:overworld" || !duIsSafeStanding(this.player.dimension, this.player.location))
          throw new Error("Earth arrival was interrupted before confirmation; no character reset or revival was committed");
        if (kind === "revive") {
          const death = this.player.getProperty("dbe:is_death"), joined = this.player.getTags().includes("dbe:join_other_world");
          if (death === undefined) throw new Error("Revival property is unavailable");
          try {
            this.player.setProperty("dbe:is_death", !1);
            this.player.removeTag("dbe:join_other_world");
            this.persistAfterlifeReturn(undefined);
          } catch (error) {
            try {
              this.player.setProperty("dbe:is_death", death);
              if (joined) this.player.addTag("dbe:join_other_world");
            } catch (restoreError) { console.warn("[Afterlife] revival rollback requires inspection: " + restoreError); }
            throw error;
          }
        } else {
          if (!(await this.reset())) throw new Error("Character reset did not complete; saved progression was retained");
          if (this.player.isValid) cj.displayForm(this.player, "select_race");
        }
        return !0;
      } catch (error) {
        duReportTravelFailure(this.player, "afterlife " + kind, error);
        return !1;
      } finally { this.afterlifeReturnPending = !1; }
    }
    notifyBulmaStaff(key) {
      if (this.staffNotice?.key === key && bX.currentTick - this.staffNotice.tick < 100) return;
      this.staffNotice = { key, tick: bX.currentTick };
      try { if (this.player.isValid) this.player.sendMessage({ translate: "dbe.quest.staff." + key }); }
      catch (error) { console.warn("[Dragon Universe] Staff reward feedback unavailable: " + (error?.stack ?? error)); }
    }
    persistBulmaStaffReceipt(receipt) {
      const previous = this.data.get("bulma_staff_reward");
      try {
        this.data.set("bulma_staff_reward", receipt);
        this.data.save();
        if (this.data.dirty) throw new Error("Staff receipt was not persisted");
      } catch (error) {
        if (previous === undefined) this.data.delete("bulma_staff_reward");
        else this.data.set("bulma_staff_reward", previous);
        try { this.data.save(); } catch (cleanup) { console.warn("[Dragon Universe] Staff receipt rollback: " + (cleanup?.stack ?? cleanup)); }
        throw error;
      }
    }
    prepareBulmaStaffReward() {
      try {
        if (!this.player.isValid || late.i0.get(this.player.id) !== this) return !1;
        if (!this.data.get("bulma_staff_reward")) {
          this.persistBulmaStaffReceipt({ quest: "fetch_bulma_outfit", token: this.player.id + ":fetch_bulma_outfit", state: "pending" });
          this.notifyBulmaStaff("pending");
        }
        return !0;
      } catch (error) {
        console.warn("[Dragon Universe] Staff reward preparation failed: " + (error?.stack ?? error));
        this.notifyBulmaStaff("failed"); return !1;
      }
    }
    claimBulmaStaffReward() {
      if (this.staffClaiming || !this.player.isValid || late.i0.get(this.player.id) !== this) return !1;
      if (!this.quests.getCompletedQuestIds().includes("fetch_bulma_outfit")) {
        const quest = this.quests.questsMap?.get("fetch_bulma_outfit"), defined = quest?.getDefinedObjectives();
        if (this.staffQuestResuming || !quest?.isStarted || quest._isCompleted || !defined?.length ||
            quest.getAllObjectives().length !== defined.length) return !1;
        this.staffQuestResuming = !0;
        try {
          if (!quest.objectivesCompleted()) {
            const tasks = quest.getAllTasks(), task = tasks.length === 1 ? tasks[0] : undefined;
            if (!task?.hasPaidNpcCost || !task.completeNpcDelivery()) return !1;
          }
          if (!this.quests.getCompletedQuestIds().includes("fetch_bulma_outfit") && quest.objectivesCompleted()) quest.completeQuest();
          return this.data.get("bulma_staff_reward")?.state === "delivered";
        } catch (error) {
          console.warn("[Dragon Universe] Earned staff quest recovery failed: " + (error?.stack ?? error));
          this.notifyBulmaStaff("failed"); return !1;
        } finally { this.staffQuestResuming = !1; }
      }
      const receipt = this.data.get("bulma_staff_reward");
      if (!receipt) { this.notifyBulmaStaff("review"); return !1; }
      if (receipt.state === "delivered") return !0;
      this.staffClaiming = !0;
      let container, snapshot;
      try {
        if (receipt.quest !== "fetch_bulma_outfit" || typeof receipt.token !== "string" || !["pending", "delivering"].includes(receipt.state))
          throw new Error("Invalid staff reward receipt; operator review required");
        container = this.player.getComponent("inventory")?.container;
        const hasToken = () => {
          for (let slot = 0; slot < (container?.size ?? 0); slot++) {
            const item = container.getItem(slot);
            if (item?.typeId === "dbe:power_pole" && item.getDynamicProperty("dbe:quest_reward") === receipt.token) return !0;
          }
          return !1;
        };
        if (hasToken()) { this.persistBulmaStaffReceipt({ ...receipt, state: "delivered" }); return !0; }
        if (receipt.state === "delivering") { this.notifyBulmaStaff("review"); return !1; }
        // Persist completion and currency before the staff-only delivery; retries never rerun quest rewards.
        const info = this.quests.questsInfo;
        info.quests = [...this.quests.getQuests()].map(quest => quest.getProgress());
        this.data.set("quests_info", info);
        this.persistBulmaStaffReceipt(receipt);
        if (!container?.emptySlotsCount) { this.notifyBulmaStaff("full"); return !1; }
        this.persistBulmaStaffReceipt({ ...receipt, state: "delivering" });
        snapshot = Array.from({ length: container.size }, (_, slot) => container.getItem(slot));
        const reward = new late.qM({ type: "item", item: "dbe:power_pole", amount: 1 });
        const accepted = reward.grantReward(this, { inventoryOnly: !0, token: receipt.token });
        const inserted = hasToken();
        if (!accepted || !inserted) throw new Error("Staff insertion was not confirmed in the inventory");
        this.persistBulmaStaffReceipt({ ...receipt, state: "delivered" });
        this.notifyBulmaStaff("claimed"); return !0;
      } catch (error) {
        console.warn("[Dragon Universe] Staff reward delivery failed: " + (error?.stack ?? error));
        if (snapshot) {
          try {
            for (let slot = 0; slot < snapshot.length; slot++) container.setItem(slot, snapshot[slot]);
            this.persistBulmaStaffReceipt({ ...receipt, state: "pending" });
          } catch (rollback) { console.warn("[Dragon Universe] Staff inventory rollback uncertain; operator review required: " + (rollback?.stack ?? rollback)); }
        }
        this.notifyBulmaStaff("failed"); return !1;
      } finally { this.staffClaiming = !1; }
    }
    toggleMovement(sG) {
      sG
        ? this.inputPermissionManager.unblockInputPermission("general_movement")
        : this.inputPermissionManager.blockInputPermission("general_movement", [bW.Movement]);
    }
    updateNameTag() {
      let sG = eJ.getPlayerGroup(this.player.id),
        sH = this.getCurrentFusion(),
        sI = sH ? sH.name : this.player.name,
        sK = sG ? " §u[" + sG.name + "]§r" : "",
        sL = fG.getHighestPlayerDisplayTag(this),
        sM = sL ? "§l" + sL.colorPrefix + "  " + sL.name.toUpperCase() + "  " : "";
      bX.run(() => {
        this.player.nameTag = "" + sI + sK + "\n" + sM;
      });
    }
    updateTrainingWeight() {
      let sG = this.getTrainingWeight()?.typeId;
      this.currentTrainingWeight !== sG && ((this.currentTrainingWeight = sG), this.attributes.updateStats());
    }
    restoreInputPermissions() {
      if (this.isKnockedOut) this.inputPermissionManager.blockInputPermission("knocked", [bW.Camera, bW.Movement]);
      if (this.getCurrentFusion()?.isController === !1)
        this.inputPermissionManager.blockInputPermission("fusion", [bW.Movement]);
    }
    initialize() {
      this.restoreInputPermissions();
      super.initialize(),
        this.playerCustomization.init(),
        g1.validatePlayerAccess(this),
        bX.runTimeout(async () => {
          this.player.isValid &&
            (this.skillsContainer.updateSideBar(),
            this.updateNameTag(),
            this.isKnockedOut && this.setKnockoutState(!1),
            gI.isBanned(this.player.name) && gI.showBanForm(this.player));
        }, 100);
      if (this.data.get("afterlife_return")) bX.runTimeout(() => {
        const intent = this.data.get("afterlife_return");
        if (this.player.isValid && late.i0.get(this.player.id) === this && intent)
          this.returnFromAfterlife(intent.kind);
      }, 50);
      if (this.data.get("bulma_staff_reward") || this.quests?.questsInfo?.quests?.some(quest => quest.id === "fetch_bulma_outfit")) bX.runTimeout(() => {
        if (this.player.isValid && late.i0.get(this.player.id) === this) this.claimBulmaStaffReward();
      }, 60);
    }
    processQueueMessages() {
      let sG = this.queueMessages[0];
      if (!sG) {
        this.processingQueueMessages = !1;
        return;
      }
      (this.processingQueueMessages = !0),
        bX.runTimeout(() => {
          this.queueMessages.shift(),
            this.player.isValid &&
              (sG.soundId && this.player.playSound(sG.soundId), this.player.sendMessage(sG.message)),
            this.processQueueMessages();
        }, sG.tickDelay);
    }
    setKnockoutState(sG) {
      bX.run(() => {
        let { player: sH } = this;
        sG
          ? this.inputPermissionManager.blockInputPermission("knocked", [bW.Camera, bW.Movement])
          : this.inputPermissionManager.unblockInputPermission("knocked"),
          sG ? sH.camera.setCamera(c1.ThirdPerson) : sH.camera.clear(),
          this.trySetProperty("dbe:is_knocked_out", sG);
      });
    }
  };
bindLate("hN", () => hN); // O4.0: ligação tardia
function hO(sG) {
  let sH = late.i3.getDBEEntity(sG);
  if (sH instanceof hN) return sH;
  throw new Error("Instância de DBEPlayer não encontrada para o jogador fornecido.");
}
bindLate("hO", () => hO); // O4.0: ligação tardia
var hP = class extends cA {
    constructor(sG, sH) {
      super(sG, sH), (this.cooldownDuration = 50), (this.triggerChance = 0.7);
    }
    onTimedExecution() {
      if (this.target) {
        if (this.distanceToTarget >= 8) return;
        let sG = this.dbeEntity.skills.getToggleSkill("aura_boost");
        if (sG) {
          sG.enable(), this.startCooldown();
          let sH = 0,
            sI = this.dbeEntity.runInterval(() => {
              (sH >= 80 || this.distanceToTarget <= 2) && (sG.disable(), this.dbeEntity.clearRun(sI)), sH++;
            });
        }
      }
    }
  },
  hQ = class extends cA {
    constructor(sG, sH) {
      super(sG, sH), (this.cooldownDuration = 120), (this.triggerChance = 0.3);
    }
    async onTimedExecution() {
      const target = this.target;
      if (target) {
        const dimension = this.entity.dimension.id;
        const current = () => this.entity.isValid && target.isValid && this.entity.dimension.id === dimension &&
          target.dimension.id === dimension && this.target === target;
        if (!current()) return;
        if (this.dbeEntity.transformations.currentTransformation.isOozaru) return;
        let { distanceToTarget: sG } = this;
        if (sG > 48) return;
        let sH = late.i3.getDBEEntity(target)?.isLoadingAttack ?? !1,
          sI = target.getBlockFromViewDirection({ maxDistance: 32 })?.block.location;
        if (sI) { await this.dbeEntity.trySpread(sI, 5); if (!current()) return; }
        if (sH || sG < 8) { await this.dbeEntity.trySpread(target.location, 20); if (!current()) return; }
        let { skills: sK } = this.dbeEntity,
          sL = sK.getSkillsByType("ki_attack"),
          sM = Math.floor(Math.random() * sL.length),
          sN = sL[sM];
        sN && (this.startCooldown(), sN.startCharge());
      }
    }
  };
import { system as hR } from "@minecraft/server";
// Only these shipped entity definitions implement both movement transition events.
const duMovementModeTypes = new Set([
  "battle_jacket", "pirate_robot", "android_17", "android_18", "android_19", "android_20",
  "beerus_enemy", "botamo", "burter", "cabba", "cell", "cell_junior", "corrupted_fused_zamasu",
  "cui", "dabura", "dodoria", "fat_buu", "frieza", "frieza_soldier", "frost", "fused_zamasu",
  "general_black", "ginyu", "goku_black", "guldo", "hitto", "jeice", "kid_buu", "king_cold",
  "magetta", "majin_vegeta", "nappa", "puipui", "raditz", "recoome", "saibabrute", "saibaman",
  "shisami", "super_buu", "tagoma", "test_enemy", "vegeta", "yakon", "zamasu", "zarbon",
  "future_trunks_enemy", "goku_enemy", "namekian", "piccolo_enemy", "shadow_dummy",
].map(id => "dbe:" + id));
var hS = class extends cA {
    constructor(sG, sH) {
      super(sG, sH);
    }
    onTimedExecution() {
      if (this.target) {
        let sG = late.i3.getDBEEntity(this.target)?.skills.isSkillActive("fly") ?? !this.target.isOnGround,
          { isFlying: sH } = this.combatBehaviorManager,
          sI = this.entity.getComponent("minecraft:riding");
        if (sI) {
          sI.entityRidingOn.remove(), this.startCooldown();
          return;
        }
        if (sH && !sG && this.distanceToTarget < 8) {
          this.switchToWalk();
          return;
        }
        if (!sH && (sG || this.distanceToTarget >= 16)) {
          this.switchToHover();
          return;
        }
      }
    }
    switchToWalk() {
      this.entity.triggerEvent("dbe:switch_to_walk"),
        this.entity.dimension.playSound("common.bukujyutsu_end", this.entity.location),
        this.startCooldown(),
        hR.run(() => {
          this.entity.isValid && this.entity.clearVelocity();
        });
    }
    switchToHover() {
      this.entity.triggerEvent("dbe:switch_to_hover"),
        this.entity.dimension.playSound("common.bukujyutsu_up", this.entity.location),
        this.startCooldown();
    }
  },
  hT = class extends cA {
    constructor(sG, sH) {
      super(sG, sH), (this.cooldownDuration = 120), (this.triggerChance = 0.4);
    }
    onTimedExecution() {
      this.target &&
        this.distanceToTarget >= 4 &&
        this.distanceToTarget <= 15 &&
        (this.entity.triggerEvent("dbe:switch_to_ranged"), this.startCooldown());
    }
  },
  hU = class extends cA {
    constructor(sG, sH) {
      super(sG, sH), (this.cooldownDuration = 100);
    }
    onTimedExecution() {
      if (this.target) {
        let { transformations: sG } = this.dbeEntity,
          sH = sG.getAvailableTransformations(),
          sI = late.i3.getDBEEntity(this.target);
        if (sI && sH.length) {
          let sK = this.getNextTransformationIndex(sI),
            sL = sH[sK];
          sG.currentTransformation !== sL && sL.transform();
        }
      }
    }
    getNextTransformationIndex(sG) {
      let { transformations: sH } = this.dbeEntity,
        sI = sH.getAvailableTransformations(),
        sK = sG.attributes.battlePower / this.dbeEntity.attributes.battlePower,
        sL = sI.indexOf(sH.currentTransformation);
      return bN(Math.floor(Math.log2(sK)), sL, sI.length - 1);
    }
  };
import { skills_data as hV } from "./data/skills_data.js";
import { system as hW } from "@minecraft/server";
var hX = class {
    constructor(sG) {
      this.entity = sG;
      if (
        ((this.data = bG(sG, "dragon_evolution")),
        (this.kiAttackId = String(sG.getDynamicProperty("ki_attack_id"))),
        (this.kiAttackProperties = this.data.get("properties")),
        !this.kiAttackProperties)
      ) {
        let sH = hV.find(({ id: sI, type: sK }) => sK === "ki_attack" && sI === this.kiAttackId);
        if (sH) this.kiAttackProperties = { ...sH.kiAttackProperties };
        else throw new Error("Ataque de Ki não possui 'ki_attack_properties' definidos.");
      }
      this.initialize();
    }
    data;
    kiAttackId;
    kiAttackProperties;
    get attackSpeed() {
      return this.kiAttackProperties.speed ?? 1;
    }
    get baseDamage() {
      return this.kiAttackProperties.baseDamage;
    }
    get baseScale() {
      return this.kiAttackProperties.baseScale ?? 1;
    }
    get breakBlocks() {
      return this.kiAttackProperties.breakBlocks ?? !0;
    }
    get canCutTail() {
      return this.kiAttackProperties.type === "disc" ? (this.kiAttackProperties.canCutTail ?? !1) : !1;
    }
    get color0() {
      return this.kiAttackProperties.color0;
    }
    get color1() {
      return this.kiAttackProperties.color1;
    }
    get damage() {
      return this.baseDamage * this.damageMultiplier;
    }
    get damageMultiplier() {
      return this.kiAttackProperties.damageMultiplier ?? 1;
    }
    get explosionPower() {
      return this.kiAttackProperties.explosionPower;
    }
    get hasColor() {
      return !!(this.color0 || this.color1);
    }
    get isMoving() {
      return bO.magnitude(this.entity.getVelocity()) !== 0;
    }
    get owner() {
      let sG = this.entity.getComponent("minecraft:projectile")?.owner;
      return sG?.isValid ? sG : void 0;
    }
    setColor(sG) {
      (this.kiAttackProperties.color0 = sG.color0), (this.kiAttackProperties.color1 = sG.color1), this.saveProperties();
    }
    setPowerPercent(sG) {
      (this.kiAttackProperties.damageMultiplier = (this.calculateDamageMultiplier() * sG) / 100), this.saveProperties();
    }
    setScale(sG) {
      let sH = bN(Math.round(sG), 1, 20);
      this.entity.triggerEvent("dbe:scale_" + sH);
    }
    calculateDamageMultiplier() {
      if (this.owner) {
        let sG = i3.getDBEEntity(this.owner);
        if (sG) {
          let { attributes: sH } = sG,
            sI = sH.getAttribute("willpower");
          if (sI) return sI.modifiedValue;
        }
      }
      return 1;
    }
    initialize() {
      this.entity.setProperty("dbe:attack_type", this.kiAttackProperties.type),
        this.entity.setProperty("dbe:has_spiral", this.kiAttackProperties.hasSpiral ?? !1),
        this.entity.triggerEvent("dbe:become_" + this.kiAttackProperties.type),
        this.kiAttackProperties.type === "beam" && this.spawnBeam();
    }
    saveProperties() {
      this.data.set("properties", this.kiAttackProperties), this.updateColors();
    }
    spawnBeam() {
      let sG = this.entity.location,
        { baseScale: sH } = this,
        sI = hW.runInterval(() => {
          if (!this.entity.isValid) {
            hW.clearRun(sI);
            return;
          }
          if (this.isMoving) {
            let sK = bO.distance(this.entity.location, sG),
              sL = bN(sK / sH, 0, 128);
            this.entity.setProperty("dbe:beam_gap", sL);
          }
        });
    }
    updateColors() {
      let sG = (sK) => bN(Math.floor(sK * 255), 0, 255),
        { color0: sH, color1: sI } = this;
      if (sH) {
        let sK = aI.colorToRgb(sH);
        this.entity.setProperty("dbe:color_1_r", sG(sK.red)),
          this.entity.setProperty("dbe:color_1_g", sG(sK.green)),
          this.entity.setProperty("dbe:color_1_b", sG(sK.blue));
      }
      if (sI) {
        let sL = aI.colorToRgb(sI);
        this.entity.setProperty("dbe:color_2_r", sG(sL.red)),
          this.entity.setProperty("dbe:color_2_g", sG(sL.green)),
          this.entity.setProperty("dbe:color_2_b", sG(sL.blue));
      }
    }
  },
  hY = class {
    testCollision(sG) {
      let { entity: sH } = sG,
        sI = this.getNearbyKiAttacks(sH.dimension, sH.location, sG.baseScale * 2);
      for (let sK of sI)
        sG !== sK && sK && sG.damage > sK.damage && sK.entity.tryTeleport(sH.location, { keepVelocity: !0 });
    }
    getNearbyKiAttacks(sG, sH, sI) {
      return i3.getKiAttackEntities(sG, { location: sH, maxDistance: sI });
    }
    // O2e: a mesma regra de testCollision para todos os ataques do tick, sem K² chamadas nativas. Lê dimensão e
    // posição de cada ataque uma vez; os vizinhos (mesma dimensão, distância <= baseScale * 2, do mais perto ao mais
    // longe, na ordem do mapa) são achados em JS. Depois de um tryTeleport a posição do teleportado é relida, para os
    // testes seguintes do tick verem o mesmo que o matches() via antes. Ataque inválido fica fora (antes dava erro e
    // interrompia o resto do tick).
    testAllCollisions(sG) {
      let snap = [];
      for (let atk of sG)
        try {
          let { entity: e } = atk;
          snap.push({ atk, dim: e.dimension.id, loc: e.location });
        } catch {}
      for (let me of snap) {
        let max = me.atk.baseScale * 2,
          near = [];
        for (let o of snap) {
          if (o.dim !== me.dim) continue;
          let d = bO.distance(me.loc, o.loc);
          d <= max && near.push({ o, d });
        }
        near.length > 1 && near.sort((x, y) => x.d - y.d);
        for (let { o } of near)
          if (me.atk !== o.atk && me.atk.damage > o.atk.damage) {
            try {
              o.atk.entity.tryTeleport(me.loc, { keepVelocity: !0 });
              o.loc = o.atk.entity.location;
            } catch {} // ataque que sumiu no meio do tick: não aborta o hub (nem o updateBalls depois dele)
          }
      }
    }
  },
  hZ = new hY(),
  i0 = new Map(),
  i1 = new Map(),
  i2 = class {
    initializingEntities = new Set();
    deleteEntity(sG) {
      let { id: sH, typeId: sI } = sG;
      sI === "dbe:ki_attack" ? i1.delete(sH) : i0.delete(sH);
    }
    getDBEEntities(sG, sH) {
      let sI = [],
        sK = [],
        sL = sH?.location;
      for (let sM of i0.values())
        (sG && sM.entity.dimension !== sG) ||
          (sH && !sM.entity.matches(sH)) ||
          sK.push({ dbeEntity: sM, distance: sL ? bO.distance(sL, sM.entity.location) : 0 });
      sL && sK.length > 1 && sK.sort((sN, sO) => sN.distance - sO.distance);
      for (let { dbeEntity: sN } of sK) sI.push(sN);
      return sI;
    }
    getDBEEntity(sG) {
      return i0.get(sG.id) ?? this.createDBEEntity(sG);
    }
    getKiAttackEntities(sG, sH) {
      let sI = [],
        sK = [],
        sL = sH?.location;
      for (let sM of i1.values())
        (sG && sM.entity.dimension !== sG) ||
          (sH && !sM.entity.matches(sH)) ||
          sK.push({ kiAttackEntity: sM, distance: sL ? bO.distance(sL, sM.entity.location) : 0 });
      sL && sK.length > 1 && sK.sort((sN, sO) => sN.distance - sO.distance);
      for (let { kiAttackEntity: sN } of sK) sI.push(sN);
      return sI;
    }
    getKiAttackEntity(sG) {
      return i1.get(sG.id) ?? this.createKiAttackEntity(sG);
    }
    initializeEntity(sG) {
      bS.runTimeout(() => {
        sG.isValid && (sG.typeId === "dbe:ki_attack" ? this.createKiAttackEntity(sG) : this.createDBEEntity(sG));
      }, 20);
    }
    trySpawnDBEEntity(sG, sH, sI, sK) {
      let sL = d4(sG, sH, sI, sK);
      if (!sL) return;
      try {
        return this.createDBEEntity(sL, sK?.entityDefinitions);
      } catch (error) {
        if (sL.isValid) sL.remove();
        throw error;
      }
    }
    createDBEEntity(sG, sH) {
      if (sG.typeId !== "dbe:ki_attack") {
        let sI = i0.get(sG.id);
        if (this.initializingEntities.has(sG.id))
          throw new Error(
            "Tentativa de acessar a DBEEntity enquanto ela ainda estava sendo inicializada. Isso normalmente indica uma chamada recursiva durante a inicialização.",
          );
        if (!sI && sG.isValid && d3(sG)) {
          this.initializingEntities.add(sG.id);
          try {
            sG instanceof bR ? (sI = new hN(sG)) : ((sI = new fV(sG, sH)), this.setupCombatBehaviors(sI));
            i0.set(sG.id, sI);
            this.initializingEntities.delete(sG.id);
            sI.initialize();
          } catch (error) {
            i0.delete(sG.id);
            sI?.clearAllRuns();
            throw error;
          } finally {
            this.initializingEntities.delete(sG.id);
          }
        }
        return sI;
      }
    }
    createKiAttackEntity(sG) {
      if (sG.typeId === "dbe:ki_attack") {
        let sH = i1.get(sG.id);
        if (this.initializingEntities.has(sG.id))
          throw new Error(
            "Tentativa de acessar a KiAttackEntity enquanto ela ainda estava sendo inicializada. Isso normalmente indica uma chamada recursiva durante a inicialização.",
          );
        return (
          !sH &&
            sG.isValid &&
            d3(sG) &&
            (this.initializingEntities.add(sG.id),
            (sH = new hX(sG)),
            i1.set(sG.id, sH),
            this.initializingEntities.delete(sG.id)),
          sH
        );
      }
    }
    setupCombatBehaviors(sG) {
      let { combatManager: sH, entity: sI } = sG;
      sH &&
        (sH.addBehavior("dash", new hP(sG, sH)),
        sH.addBehavior("ki_attack", new hQ(sG, sH)),
        duMovementModeTypes.has(sI.typeId) && sH.addBehavior("movement_mode", new hS(sG, sH)),
        sH.addBehavior("transformation", new hU(sG, sH)),
        sI.typeId === "dbe:pirate_robot" && sH.addBehavior("pirate_gun", new hT(sG, sH)));
    }
  },
  i3 = new i2();
bindLate("i3", () => i3); // O4.0: ligação tardia
bindLate("i0", () => i0); // O4.0: ligação tardia
bT.afterEvents.entityLoad.subscribe(({ entity: sG }) => {
  i3.initializeEntity(sG);
}),
  bT.beforeEvents.entityRemove.subscribe(({ removedEntity: sG }) => {
    i3.deleteEntity(sG);
  }),
  bT.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
    i3.initializeEntity(sG);
  }),
  bS.run(() => {
    let sG = cY.getAll();
    for (let sH of sG) for (let sI of sH.getEntities()) i3.initializeEntity(sI);
  });
import { EntityDamageCause as i4, EquipmentSlot as i5, Player as i6, system as i7 } from "@minecraft/server";
function i8(sG, sH, sI) {
  if (sG.isChunkLoaded(sH)) {
    let sK = d4("dbe:damage_indicator", sG, sH);
    sK && ((sK.nameTag = sI), sK.applyImpulse(new bP(aO.random(0, 0.01), 0.05, aO.random(0, 0.01))));
  }
}
var i9 = class {
    applyDamageToEntity(sG) {
      let { damageSource: sH, hurtEntity: sI } = sG,
        { cause: sK, damagingEntity: sL } = sH,
        { dimension: sM, location: sN } = sI,
        sO = i3.getDBEEntity(sI),
        sP = sK === i4.entityAttack,
        sQ;
      if (sI instanceof i6 && sL instanceof i6 && eJ.areInSameGroup(sI, sL)) {
        sG.cancel = !0;
        return;
      }
      if (sP && sL) {
        let sR = i3.getDBEEntity(sL);
        sR &&
          (sR.hasAttributesDefined &&
            ((sG.damage = ib.calculateModifiedMeleeDamage(sR, sG.damage)), this.processOnHitTriggers(sR)),
          sR.advancedCombat &&
            i7.run(() => {
              sG.cancel || sR.combo.applyComboIn([sI]);
            }));
      }
      if (sO?.hasAttributesDefined) {
        let { combo: sS, guard: sT, health: sU } = sO;
        if (sK === i4.fall) {
          sG.cancel = !0;
          return;
        }
        if (sP && sL) {
          if (sO.guard.isGuarding) {
            (sG.cancel = !0), i7.run(() => sT.tryBreakGuard(sL));
            return;
          }
          if (sO.alwaysDodge) {
            (sG.cancel = !0), sO.trySpread(sI.location, 4);
            return;
          }
          if (sT.shouldDodge(sL)) {
            (sG.cancel = !0), i7.run(() => sT.applyDodgeEffects());
            return;
          }
        }
        if (sO instanceof hN) {
          let { dimension: t1, location: t2 } = sI;
          if (sO.getCurrentFusion()?.isController === !1) {
            sG.cancel = !0;
            return;
          }
          if (sL instanceof i6 && eO(t1).isSafeZoneLocation(t2)) {
            sG.cancel = !0;
            return;
          }
        }
        (sQ = sU.applyDamage(sG.damage, sL)),
          sU.currentValue
            ? i7.run(() => {
                if (sI.isValid) {
                  let t3 = sI.getComponent("minecraft:health");
                  t3 && t3.currentValue > 0 && t3.resetToMaxValue();
                }
              })
            : (sG.damage = 2000000000);
      }
      sI.typeId !== "dbe:damage_indicator" &&
        i7.run(() => {
          let t3 = "§l§e-" + Math.floor(sQ ?? sG.damage);
          i8(sM, sN, t3);
        });
    }
    calculateModifiedMeleeDamage(sG, sH) {
      let { attributes: sI, combo: sK } = sG,
        sL = sI.stats.getStat("melee_damage");
      if (sL) {
        let sM = this.getModifiedSkillDamage(sG);
        return (sH + sL.value + sM) * sK.damageMultiplier * (sG.race?.id === "glind" ? 2.25 : 1);
      }
      return sH;
    }
    getModifiedSkillDamage(sG) {
      let { attributes: sH, entity: sI, skills: sK } = sG;
      if (aN.getEquippedItem(sI, i5.Mainhand)) return 0;
      let sL = sK
          .getSkillsByType("toggle")
          .filter(({ wilDamage: sN, isEnabled: sO }) => sO && sN > 0)
          .reduce((sN, sO) => sN + sO.wilDamage, 0),
        sM = sH.getAttribute("willpower")?.modifiedValue ?? 1;
      return sL * sM;
    }
    processOnHitTriggers(sG) {
      let { attributes: sH, ki: sI, masteries: sK, skills: sL } = sG,
        sM = !1;
      // Só skills ligadas: ki_fist/ki_scythe desligadas cobravam ki a cada golpe (o on_damage já checava isEnabled).
      for (let sN of sL.getSkillsByType("toggle"))
        sN.isEnabled &&
          (sN.kiDrainTrigger === "on_hit" && (sI.currentValue >= sN.kiDrain ? sI.removeCurrent(sN.kiDrain) : sN.disable()),
          sN.masteryOptions?.grantTrigger === "on_hit" && sK.getMastery(sN.id)?.addPercentage(1));
      sM && sH.updateStats();
    }
  },
  ib = new i9();
import { CONFIG as ij } from "./config/config.js";
import {
  Block as ik,
  EntityComponentTypes as ip,
  EquipmentSlot as iq,
  Player as iv,
  StructureSaveMode as iw,
  world as ix,
} from "@minecraft/server";
var iy = class t4 {
    static generateId() {
      let sG = Math.floor(Math.random() * 1000000);
      return "dbe:" + Date.now() + "_" + sG;
    }
    static generateLore(sG) {
      if (sG instanceof ik) return [{ rawtext: [{ text: "§r§7" }, { translate: sG.localizationKey }] }];
      let sH = sG.reduce((sI, sK) => {
        let sL = sK.nameTag || sK.localizationKey;
        return (sI[sL] = (sI[sL] || 0) + 1), sI;
      }, {});
      return Object.entries(sH).map(([sI, sK]) => ({
        rawtext: [{ text: "§r§7" }, { translate: sI }, { text: " x" + sK }],
      }));
    }
    static getStoredStructure(sG) {
      let sH = String(sG.getDynamicProperty("structure_id"));
      return ix.structureManager.get(sH);
    }
    static placeStoredStructure(sG, sH, sI, sK) {
      let sL = t4.getStoredStructure(sH);
      sL &&
        (ix.structureManager.place(sL, sI, sK),
        ix.structureManager.delete(sL),
        sI.spawnParticle("dbe:hoi_poi_capsule_spawn", sK),
        sI.playSound("common.explode", sK, { pitch: 2 }),
        this.updateItemStack(sG, sH, void 0, void 0),
        aQ.tryDamageHeldItem(sG, 1));
    }
    static isStoring(sG) {
      return !!sG.getDynamicProperty("structure_id");
    }
    static tryStoreBlock(sG, sH, sI) {
      if (sI.getParts() || ij.INDESTRUCTIBLE_BLOCKS.includes(sI.typeId)) return;
      let sK = eO(sG.dimension).canPlayerBuild(sG, sI.location),
        sL = sH.getComponent("dbe:hoi_poi_capsule");
      if (sK && sL) {
        let { dimension: sM, location: sN } = sI,
          sO = this.storeLocation(sM, sN, { includeEntities: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sO.id),
          sI.getComponent("minecraft:inventory")?.container?.clearAll(),
          sI.setType("minecraft:air");
      }
    }
    static tryStoreEntitiesFromLocation(sG, sH, sI) {
      let { dimension: sK } = sG,
        sL = eO(sK).canPlayerBuild(sG, sI),
        sM = sH.getComponent("dbe:hoi_poi_capsule");
      if (sL && sM) {
        let sN = sH.getComponent("minecraft:cooldown"),
          { exclude_families: sO } = sM.customComponentParameters.params;
        if (sN?.getCooldownTicksRemaining(sG) || this.isStoring(sH)) return;
        let sP = sK.getBlock(sI)?.center();
        if (!sP) return;
        let sQ = sK.getEntities({ excludeTypes: ["minecraft:player"], location: sI, volume: new bP(1, 1, 1) });
        for (let sR of sQ) {
          let sS = sR.getComponent(ip.TypeFamily);
          if (sS?.hasTypeFamily && sO.some((sT) => sS.hasTypeFamily(sT))) return;
          sR.teleport(sP);
        }
        this.storeEntities(sG, sH, sQ), sN?.startCooldown(sG);
      }
    }
    static storeEntities(sG, sH, sI) {
      if (sI.length) {
        let { dimension: sK, location: sL } = sI[0],
          sM = this.storeLocation(sK, sL, { includeBlocks: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sM.id);
        for (let sN of sI) sN.remove();
      }
    }
    static storeLocation(sG, sH, sI) {
      let sK = this.generateId();
      return ix.structureManager.createFromWorld(sK, sG, sH, sH, sI);
    }
    static updateItemStack(sG, sH, sI, sK) {
      sH.setLore(sI ? this.generateLore(sI) : void 0),
        sH.setDynamicProperty("structure_id", sK),
        sG.getComponent("minecraft:equippable")?.setEquipment(iq.Mainhand, sH);
    }
  },
  iz = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, itemStack: sI, source: sK }) {
      if (sK instanceof iv) {
        if (!eO(sG.dimension).canPlayerBuild(sK, sG.location)) return;
        if (iy.isStoring(sI)) {
          let sL = bO.add(sG.location, aS.faceToVector(sH));
          iy.placeStoredStructure(sK, sI, sG.dimension, sL);
        } else iy.tryStoreBlock(sK, sI, sG);
      }
    }
  };
import { EntityDamageCause as iA } from "@minecraft/server";
function iB(sG, sH) {
  let { entity: sI } = sG,
    sK = sI.getViewDirection(),
    sL = bO.add(sI.location, sK),
    sM = bO.add(sL, { x: 0, y: sI.getAABB().extent.y, z: 0 }),
    sN = b5.applyAreaDamage(sI.dimension, sH.position ?? sM, sH.radius, sH.damage, {
      damagingEntity: sH.damagingEntity ?? sI,
      cause: sH.cause ?? iA.entityAttack,
    });
  return sH.onHit?.(sN), sN;
}
import { dragonBallsData as iC } from "./data/dragon_balls_data.js";
import { system as iD, world as iE } from "@minecraft/server";
var iF = class {
    constructor(sG, sH, sI) {
      (this.dragonBallConfig = sG), (this.state = sH), (this.dragonBallManager = sI);
    }
    get cooldown() {
      return this.dragonBallConfig.cooldown;
    }
    get detectableByRadar() {
      return this.dragonBallConfig.detectableByRadar ?? !0;
    }
    get id() {
      return this.dragonBallConfig.blockId;
    }
    get isPetrified() {
      return this.state.isPetrified;
    }
    get isPetrificationExpired() {
      return this.state.lastUsedAt ? iD.currentTick - this.state.lastUsedAt >= this.cooldown : !0;
    }
    get isUsed() {
      return typeof this.state.lastUsedAt == "number";
    }
    get maxWishes() {
      return this.dragonBallConfig.maxWishes ?? 1;
    }
    get requiredBalls() {
      return this.dragonBallConfig.requiredBalls;
    }
    get sourceAnimation() {
      return this.dragonBallConfig.sourceAnimation;
    }
    get sourceId() {
      return this.dragonBallConfig.sourceId;
    }
    get spawnSound() {
      return this.dragonBallConfig.spawnSound;
    }
    getBallsInDimension(sG) {
      return this.state.tracked.filter((sH) => sH.dimensionId === sG.id);
    }
    getDragonBallAmount() {
      return this.state.tracked.length;
    }
    getState() {
      return this.state;
    }
    petrify() {
      (this.state.isPetrified = !0), (this.state.lastUsedAt = iD.currentTick), this.dragonBallManager.save();
    }
    restore() {
      (this.state.isPetrified = !1), delete this.state.lastUsedAt, this.dragonBallManager.save();
    }
    spawnInstance(sG, sH) {
      this.state.tracked.push({ dimensionId: sG.id, location: sH, placed: !1, typeId: this.id }),
        this.dragonBallManager.save();
    }
    updateBalls() {
      let { isPetrified: sG, isPetrificationExpired: sH, isUsed: sI } = this,
        sK = this.getDragonBallAmount(),
        sL = !1;
      (sK === 0 || (sG && sH)) && (this.restore(), this.spawnAll()), !sG && sI && this.petrify();
      for (let sM of this.state.tracked) {
        let sN = iE.getDimension(sM.dimensionId),
          sO = sN.getBlock(sM.location);
        sO &&
          (sM.placed &&
            sO.typeId !== this.id &&
            (sO.setType("minecraft:air"), this.state.tracked.splice(this.state.tracked.indexOf(sM), 1), (sL = !0)),
          sM.placed || (sL = this.tryPlaceDragonBall(sN, sM)));
      }
      sL && this.dragonBallManager.save();
    }
    findValidSpawnLocation(sG) {
      if (sG.dimensionId === "dbe:namek") return sG.location;
      return iE.getDimension(sG.dimensionId).getTopmostBlock(sG.location)?.above() || sG.location;
    }
    getRandomSpawnLocation(sG) {
      let sH = Math.random() * (sG * 2) - sG,
        sI = Math.random() * (sG * 2) - sG,
        sK = new bP(sH, 0, sI);
      return bO.floor(sK);
    }
    spawnAll() {
      let sG = this.getDragonBallAmount();
      for (let sH of this.dragonBallConfig.spawnRules)
        for (let sI = sG; sI < this.requiredBalls; sI++) {
          let sK, sL;
          if (sH.dimensionId === "dbe:namek") {
            try {
              sL = iE.getDimension("dbe:namek");
              sK = __nbl(sI);
            } catch (__e) {
              break;
            }
          } else {
            sK = this.getRandomSpawnLocation(sH.spawnRadius);
            sL = iE.getDimension(sH.dimensionId);
          }
          this.spawnInstance(sL, sK);
        }
    }
    tryPlaceDragonBall(sG, sH) {
      let sI = this.findValidSpawnLocation(sH);
      (sH.location = sI), (sH.placed = !0);
      try {
        return sG?.setBlockType(sI, this.id), !0;
      } catch {
        return !1;
      }
    }
  },
  iG = class {
    database;
    dragonBallMap = new Map();
    state = [];
    constructor() {
      iD.run(() => {
        this.database = bG(iE, "dragon_evolution");
        let sG = this.database.get("dragon_balls");
        Array.isArray(sG) && (this.state = sG), this.loadDragonBalls();
      });
    }
    getDragonBall(sG) {
      return this.dragonBallMap.get(sG);
    }
    getDragonBallBySourceTypeId(sG) {
      for (let sH of this.dragonBallMap.values()) if (sH.sourceId === sG) return sH;
    }
    getRadarDetectableBalls(sG, sH) {
      let sI = [];
      for (let sK of this.dragonBallMap.values())
        !sK.detectableByRadar || sK.isPetrified || sI.push(...sK.getBallsInDimension(sG));
      return sI.sort((sL, sM) => {
        let sN = bO.distance(sH, sL.location),
          sO = bO.distance(sH, sM.location);
        return sN - sO;
      });
    }
    save() {
      this.state = [];
      for (let sG of this.dragonBallMap.values()) this.state.push(sG.getState());
      this.database?.set("dragon_balls", this.state);
    }
    updateBalls() {
      for (let sG of this.dragonBallMap.values()) sG.updateBalls();
    }
    loadDragonBalls() {
      for (let sG of iC) {
        let sH = this.state.find(({ typeId: sK }) => sK === sG.blockId) ?? {
            isPetrified: !1,
            tracked: [],
            typeId: sG.blockId,
          },
          sI = new iF(sG, sH, this);
        this.dragonBallMap.set(sG.blockId, sI);
      }
    }
  },
  iH = new iG();
import { system as iI } from "@minecraft/server";
var iJ = class {
    tryFusion(sG, sH) {
      return !(sH instanceof hN) && sH.race?.id === "namekian" && sH.isKnockedOut
        ? (this.startAssimilation(sG, sH), !0)
        : !1;
    }
    startAssimilation(sG, sH) {
      for (let sI of sG.attributes.getAttributes()) {
        let sK = sH.attributes.getAttribute(sI.id)?.value ?? 1,
          sL = Math.max(0, sK - sI.value);
        sL > 0 && sI.addValue(sL, !0);
      }
      iI.run(() => sH.entity.remove());
    }
  },
  iK = new iJ();
import { Block as iL, EntityComponentTypes as iM, Player as iN, system as iO, world as iP } from "@minecraft/server";
var iQ = class {
    bannedItems = new Set();
    isBanned(sG) {
      return this.bannedItems.has(sG);
    }
    ban(sG) {
      this.bannedItems.has(sG) || this.bannedItems.add(sG);
    }
    removeBannedItems(sG) {
      aQ.forEachFilledSlot(sG, (sH, sI) => {
        iR.isBanned(sI.typeId) && sH.setItem(void 0);
      });
    }
    unban(sG) {
      this.bannedItems.has(sG) && this.bannedItems.delete(sG);
    }
    protectContainer(sG, sH) {
      let sI = sG.getComponent("minecraft:inventory")?.container,
        sK = !1;
      if (sG instanceof iL) {
        let sL = iP.afterEvents.blockContainerClosed.subscribe(({ closeSource: sM }) => {
          sH.entity === sM.entity && ((sK = !0), iP.afterEvents.blockContainerClosed.unsubscribe(sL));
        });
      } else {
        let sM = iP.afterEvents.entityContainerClosed.subscribe(({ closeSource: sN }) => {
          sH.entity === sN.entity && ((sK = !0), iP.afterEvents.entityContainerClosed.unsubscribe(sM));
        });
      }
      if (sI) {
        let sN = iO.runInterval(() => {
          sI.isValid && !sK ? iR.removeBannedItems(sI) : iO.clearRun(sN);
        }, 2);
      }
    }
  },
  iR = new iQ();
iP.afterEvents.blockContainerOpened.subscribe(({ block: sG, openSource: sH }) => {
  iR.protectContainer(sG, sH);
}),
  iP.afterEvents.entityContainerOpened.subscribe(({ entity: sG, openSource: sH }) => {
    sG instanceof iN || iR.protectContainer(sG, sH);
  }),
  iP.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
    if (sG.isValid && sG.typeId === "minecraft:item") {
      let sH = sG.getComponent(iM.Item);
      sH && iR.isBanned(sH.itemStack.typeId) && sG.remove();
    }
  });
import { EntityComponentTypes as iS, EntityDamageCause as iT, Player as iU } from "@minecraft/server";
var iV = class extends cH {
    constructor(sG, sH) {
      super(sG, sH);
    }
    useSkill() {
      if (!(this.dbeEntity instanceof hN)) {
        let { target: sG } = this.dbeEntity;
        sG && this.tryUseSkillInTarget(sG);
        return;
      }
      for (let sH of this.dbeEntity.entity.getEntitiesFromViewDirection()) {
        let { distance: sI, entity: sK } = sH;
        if (sI <= 32 && this.tryUseSkillInTarget(sK)) break;
      }
    }
    tryUseSkillInTarget(sG) {
      return sG.typeId != "dbe:absorption_cocoon_entity" &&
        sG.applyDamage(1, { cause: iT.magic, damagingEntity: this.dbeEntity.entity })
        ? (iX.startAbsorption(this.dbeEntity, sG), !0)
        : !1;
    }
  },
  iW = class {
    absorbingEntities = new Set();
    startAbsorption(sG, sH) {
      let sI = sH.id;
      if (!this.absorbingEntities.has(sI)) {
        let sK = sH.getComponent(iS.Health);
        if (!sK) return;
        let sL = sH.location,
          sM = this.trySpawnCocoonEntity(sH.dimension, sL, { initialRotation: sH.getRotation().y });
        if (!sM) return;
        let sN = sM.entity;
        sG.attributes.transferAttributes(sM, 0.1);
        let sO = sM.attributes.stats.getStat("melee_damage")?.value ?? 1,
          sP = ef.getAttributesFromEntity(sH);
        this.absorbingEntities.add(sI);
        let sQ = (sR) => {
          sR && (sM.attributes.transferAttributes(sG), sG.attributes.addAttributeValues(sP)),
            this.absorbingEntities.delete(sI),
            sN.remove();
        };
        sG instanceof hN && sM.trySetProperty("dbe:color", sG.playerCustomization.getOptionValue("skin")),
          sH instanceof iU &&
            sH.camera.fade({
              fadeColor: aI.colorToRgb("#ffb4d7"),
              fadeTime: { fadeInTime: 1, holdTime: 0.5, fadeOutTime: 1 },
            }),
          sM.runInterval(() => {
            if (!sH.isValid) {
              sQ(!1);
              return;
            }
            this.applyInvisibilityToTarget(sH),
              sN.teleport(sL),
              sH.teleport(sL),
              sH.applyDamage(sO, { cause: iT.magic, damagingEntity: sG.entity }),
              sK.currentValue <= 0 && sQ(!0);
          });
      }
    }
    applyInvisibilityToTarget(sG) {
      sG instanceof iU
        ? sG.playAnimation("animation.entity.absorbing")
        : sG.addEffect(c4.Invisibility, 1, { showParticles: !1 });
    }
    trySpawnCocoonEntity(sG, sH, sI) {
      let sK = d4("dbe:absorption_cocoon_entity", sG, sH, sI);
      if (sK) return i3.getDBEEntity(sK);
    }
  },
  iX = new iW();
import { Player as iY, system as iZ } from "@minecraft/server";
import { system as j0 } from "@minecraft/server";
// O2c (decisão O2c-1, opção a): cada cápsula tem 2 intervalos de 1 tick (sensores aqui e movimento em j5). Antes
// eles nunca eram limpos e a instância ficava num WeakMap pela entidade JS; agora a instância fica num Map pelo
// entity.id e dispose() limpa os 2 intervalos quando a cápsula deixa de ser válida. Se ela voltar (chunk
// recarregado), j4 cria uma instância nova no próximo tick em que alguém a montar.
var j1 = class t5 {
  constructor(sG) {
    (this.entity = sG),
      (this.entityId = sG.id),
      ((this.vehicleState = { direction: 0 }),
      (this.sensorRunId = j0.runInterval(() => {
        if (!sG.isValid) return this.dispose();
        this.calculateHeightSensors();
      })));
  }
  static instances = new Map();
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    j0.clearRun(this.sensorRunId);
    this._movement?.dispose();
    t5.instances.get(this.entityId) === this && t5.instances.delete(this.entityId);
  }
  vehicleState;
  _movement;
  pitchDiff = 0;
  rollDiff = 0;
  sensors = { frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0, center: 0 };
  get maxDirectionAngle() {
    return 40;
  }
  static getInstance(sG) {
    let sH = t5.instances.get(sG.id);
    if (!sH) {
      sH = new t5(sG);
      t5.instances.set(sG.id, sH);
    }
    return sH;
  }
  get isDrifting() {
    return this.movement.direction.y < 0 && this.movement.speed > 0.2;
  }
  get movement() {
    return this._movement || (this._movement = new j5(this)), this._movement;
  }
  getRiders() {
    let sG = this.entity.getComponent("rideable");
    return sG ? sG.getRiders() : [];
  }
  getDirection() {
    return this.vehicleState.direction;
  }
  setDirection(sG) {
    (this.vehicleState.direction = bN(sG, -1, 1)),
      this.entity.setProperty("dbe:movement_direction", this.vehicleState.direction * this.maxDirectionAngle);
  }
  async calculateHeightSensors() {
    let { dimension: sG, location: sH } = this.entity,
      sI = this.entity.getRotation(),
      sK = {},
      sL = {
        frontLeft: { x: -0.75, y: 2, z: 0.5 },
        frontRight: { x: 0.75, y: 2, z: 0.5 },
        backLeft: { x: -0.75, y: 2, z: -0.5 },
        backRight: { x: 0.75, y: 2, z: -0.5 },
        center: { x: 0, y: 2, z: 0 },
      };
    for (let [sR, sS] of Object.entries(sL)) {
      let sT = bO.rotateY(sS, -(sI.y * (Math.PI / 180))),
        sU = bO.add(sH, sT),
        t1 = d4("dbe:location", sG, sU);
      t1 && (t1.applyImpulse({ x: 0, y: -100, z: 0 }), (sK[sR] = t1));
    }
    await j0.waitTicks(1);
    // a cápsula pode ter sumido nesse tick (ou um sensor não ter nascido ou ter sumido): os sensores válidos saem
    if (!this.entity.isValid || Object.keys(sK).length < 5 || !Object.values(sK).every((t2) => t2.isValid)) {
      for (let t2 of Object.values(sK)) t2.isValid && t2.remove();
      return;
    }
    let sM = sK.frontLeft.location.y - this.entity.location.y,
      sN = sK.frontRight.location.y - this.entity.location.y,
      sO = sK.backLeft.location.y - this.entity.location.y,
      sP = sK.backRight.location.y - this.entity.location.y,
      sQ = sK.center.location.y - this.entity.location.y;
    (this.sensors.frontLeft = bN(sM, -1, 1)),
      (this.sensors.frontRight = bN(sN, -1, 1)),
      (this.sensors.backLeft = bN(sO, -1, 1)),
      (this.sensors.backRight = bN(sP, -1, 1)),
      (this.sensors.center = bN(sQ, -1, 1)),
      (this.pitchDiff = (sM + sN) / 2 - (sO + sP) / 2),
      (this.rollDiff = (sN + sP) / 2 - (sM + sO) / 2);
    for (let t2 of Object.values(sK)) t2.remove();
  }
};
function j2(sG) {
  return j1.getInstance(sG);
}
var j3 = 0.5;
function j4(sG) {
  let sH = sG.getComponent("minecraft:riding");
  if (sH) {
    let sI;
    try {
      sI = sH.entityRidingOn;
    } catch {}
    if (sI?.typeId === "dbe:capsule_991") {
      let sK = j2(sI);
      if (sK) {
        let sL = sG.inputInfo.getMovementVector();
        sK.movement.setDirection(sL);
      }
    }
  }
}
var j5 = class {
  constructor(sG) {
    (this.vehicle = sG),
      (this.runId = iZ.runInterval(() => {
        if (!sG.entity.isValid) return sG.dispose();
        this.updateDirection(), this.moveVehicle();
      }));
  }
  dispose() {
    iZ.clearRun(this.runId);
  }
  direction = { x: 0, y: 0 };
  speed = 0;
  get isMoving() {
    return this.direction.x !== 0;
  }
  addSpeed(sG) {
    this.setSpeed(this.speed + sG);
  }
  setDirection(sG) {
    this.direction = sG;
  }
  setSpeed(sG) {
    (this.speed = bN(sG, -0.1, j3)), this.vehicle.entity.setProperty("dbe:wheel_speed", sG);
  }
  applyFriction(sG, sH) {
    return sG > 0 ? Math.max(0, sG - sH) : sG < 0 ? Math.min(0, sG + sH) : 0;
  }
  calculateRotation() {
    let { entity: sG, pitchDiff: sH, rollDiff: sI } = this.vehicle,
      sK = sG.getRotation(),
      sL = 0.05,
      sM = bN(Math.abs(sH) > sL ? sH : 0, -1, 1),
      sN = Math.abs(sI) > sL ? sI : 0,
      sO = this.vehicle.getDirection() * this.vehicle.maxDirectionAngle * this.speed;
    (sK.y += sO), (sK.x = sM * 45), this.vehicle.entity.setRotation(sK);
  }
  moveVehicle() {
    let { entity: sG, sensors: sH } = this.vehicle,
      sI = (sH.frontLeft + sH.frontRight) / 2,
      sK = sG.getViewDirection(),
      sL = sG.getVelocity(),
      sM = this.vehicle.isDrifting ? 1 : 0,
      sN = bO.lerp(sK, sL, sM);
    this.vehicle.entity.applyImpulse({ x: sN.x * this.speed, y: 0, z: sN.z * this.speed }),
      this.setSpeed(this.speed),
      this.updateMotorSound();
  }
  updateDirection() {
    let sG = this.vehicle.getDirection(),
      sH = this.direction.x;
    if (sH !== 0) {
      let sI = Math.sign(sG),
        sK = Math.sign(sH);
      sI !== 0 && sI !== sK ? this.vehicle.setDirection(sG - sH * 0.025) : this.vehicle.setDirection(sG - sH * 0.05);
    }
    if ((this.direction.y > 0 && this.vehicle.movement.addSpeed(0.0025), this.direction.y !== 0 && !sH)) {
      let sL = this.applyFriction(sG, 0.05);
      this.vehicle.setDirection(sL);
    }
    if (this.direction.y === 0) {
      let sM = this.applyFriction(this.speed, 0.005);
      this.setSpeed(sM);
    }
    this.direction.y < 0 && this.vehicle.movement.addSpeed(this.speed > 0 ? -0.005 : -0.0025), this.calculateRotation();
  }
  updateMotorSound() {
    let { entity: sG } = this.vehicle,
      sH = this.speed / j3,
      sI;
    sH > 0.9 ? (sI = "vehicle.motor_idle3") : sH > 0.7 ? (sI = "vehicle.motor_idle2") : (sI = "vehicle.motor_idle1");
    let sK = 1,
      sL = 0.5 + sH * 0.5;
    this.vehicle.isDrifting && sG.dimension.playSound("vehicle.drifting", sG.location, { pitch: sK, volume: sL }),
      sG.dimension.playSound(sI, sG.location, { pitch: sK, volume: sL });
  }
};
import { wish_data as j6 } from "./data/wish_data.js";
import { EasingType as j7, system as j8, TimeOfDay as j9, world as jb } from "@minecraft/server";
import { ActionFormData as jf } from "@minecraft/server-ui";
var jj = class {
    constructor(sG) {
      this.wishData = sG;
    }
    get amount() {
      return this.wishData.amount || 1;
    }
    get availableIn() {
      return this.wishData.availableIn;
    }
    get name() {
      return this.wishData.name;
    }
    get requirements() {
      return this.wishData.requirements ?? [];
    }
    get singleUse() {
      return this.wishData.single_use ?? !1;
    }
    get type() {
      return this.wishData.type;
    }
    getTranslationKey() {
      return { translate: "wish." + this.name };
    }
    grantWish(sG, sH) {}
  },
  jk = class {
    static wishesMap = new Map();
    static get(sG) {
      return this.wishesMap.get(sG);
    }
    static register(sG, sH) {
      this.wishesMap.set(sG, sH);
    }
  },
  jp = class extends jj {
    getTranslationKey() {
      return { translate: "wish.change_race", with: { rawtext: [{ translate: this.name }] } };
    }
    grantWish(sG) {
      hO(sG).setRace(this.name);
    }
  };
import { ItemStack as jq, ItemTypes as jv } from "@minecraft/server";
var jw = class extends jj {
    getTranslationKey() {
      return { translate: jv.get(this.name)?.localizationKey };
    }
    grantWish(sG, sH) {
      let sI = new jq(this.name),
        { maxAmount: sK } = sI;
      for (let sL = this.amount; sL > 0; sL -= sK)
        (sI.amount = Math.min(sK, sL)),
          sI.setLore([{ rawtext: [{ text: "§r§7" }, { translate: sH.localizationKey }] }]),
          sG.dimension.spawnItem(sI, sG.location);
    }
  },
  jx = class extends jj {
    getTranslationKey() {
      return { translate: "skill." + this.name };
    }
    grantWish(sG) {
      try {
        hO(sG).skills.tryLearnSkill(this.name);
      } catch {}
    }
  },
  jy = class extends jj {
    grantWish(sG) {
      sG.addTag("dbe_" + this.name);
    }
  },
  jz = class extends jj {
    grantWish(sG) {
      hO(sG).addTail();
    }
  },
  jA = new Map(),
  jA2 = new Map(), // sessão de desejos ativa: id do dragão -> id do jogador
  jA3 = new Map(), // cinemática do dragão em curso: id do jogador -> token
  jB = class {
    wishes = [];
    constructor() {
      jk.register("change_race", jp),
        jk.register("item", jw),
        jk.register("skill", jx),
        jk.register("tag", jy),
        jk.register("tail", jz);
      for (let sG of j6) {
        let sH = jk.get(sG.type);
        sH && this.wishes.push(new sH(sG));
      }
    }
    getWishes() {
      return this.wishes;
    }
    getEligibleWishes(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [],
        sK = [];
      for (let sL of this.getWishes())
        (sL.singleUse && sI.includes(sL.name)) ||
          (sL.availableIn.includes(sH) &&
            dC.testAll(sG, sL.requirements) &&
            ((sL instanceof jx && !sG.skills.canLearnSkill(sL.name)) ||
              (sL instanceof jp && !fR.isRaceAvailableForPlayer(sG, sL.name)) ||
              sK.push(sL)));
      return sK;
    }
    async handleWishSession(sG, sH) {
      let sI = iH.getDragonBallBySourceTypeId(sH.typeId);
      if (!sI) return;
      // um jogador por dragão; a trava de quem saiu do mundo não vale mais
      let sK = jA2.get(sH.id);
      if (sK && sK !== sG.id && jb.getAllPlayers().some((sM) => sM.id === sK)) {
        sG.sendMessage({ translate: "message.shenron.busy" });
        return;
      }
      jA2.set(sH.id, sG.id);
      try {
        // abrir o desejo encerra a cinemática deste jogador e devolve a câmera na hora;
        // uma falha aqui não pode deixar a trava jA2 presa nem impedir o menu
        if (jA3.has(sG.id)) {
          jA3.delete(sG.id);
          try {
            sG.camera.clear();
          } catch (sM) {
            console.warn("[Dragon Universe] Falha ao devolver a câmera: " + String(sM));
          }
        }
        for (; sG.isValid && sH.isValid && this.getWishesMade(sH) < sI.maxWishes; ) {
          // fechar o menu encerra só a sessão: o dragão fica com os desejos restantes
          if ((await this.showWishSelectionMenu(sG, sH)) !== "granted") return;
          sG.camera.fade({
            fadeColor: { red: 1, green: 1, blue: 1 },
            fadeTime: { fadeInTime: 1, fadeOutTime: 1, holdTime: 0.1 },
          });
        }
        sG.isValid && sH.isValid && this.getWishesMade(sH) >= sI.maxWishes && this.finalizeWishes(sG, sH);
      } finally {
        jA2.get(sH.id) === sG.id && jA2.delete(sH.id);
      }
    }
    spawnShenronFromDragonBall(sG, sH, sI, sK) {
      let sL = d4(sH.sourceId, sI, sK);
      if (!sL) return;
      let sM = 32,
        { doDayLightCycle: sN } = jb.gameRules;
      if (sN) {
        jA.set(sL.id, jb.getTimeOfDay());
        let sO = j8.runInterval(() => {
          let sP = jb.getTimeOfDay();
          if (sP < j9.Midnight) {
            if ((jb.setTimeOfDay(Math.min(240000, sP + 100)), j8.currentTick % 40 === 0)) {
              let sQ = new bP((Math.random() - 0.5) * sM + sK.x, sK.y, (Math.random() - 0.5) * sM + sK.z);
              try {
                d4("minecraft:lightning_bolt", sI, sQ);
              } catch {}
            }
          } else j8.clearRun(sO);
        });
      }
      for (let sP of jb.getAllPlayers())
        hO(sP).sendQueueMessage({
          soundId: "mob.shenron.appear",
          tickDelay: 5,
          message: {
            translate: "message.shenron.summoned",
            with: { rawtext: [{ text: "" + sH.requiredBalls }, { text: sG.name }, { translate: sL.localizationKey }] },
          },
        });
      for (let sQ of sI.getPlayers({ location: sK, maxDistance: 128 })) this.playAnimation(sQ, sL, sH);
    }
    finalizeWishes(sG, sH) {
      if (!sH.isValid) return;
      let { dimension: sI, location: sK } = sH;
      sG.sendMessage({ translate: "message.shenron.wishGranted" }),
        sI.playSound("mob.shenron.flying", sK),
        this.restoreNormalTimeOfDay(sH),
        sH.remove();
    }
    getWishesMade(sG) {
      return i3.getDBEEntity(sG)?.data.get("wishes_made") ?? 0;
    }
    markWishAsGranted(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [];
      sI.push(sH.name), sG.data.set("granted_wishes", sI);
    }
    async playAnimation(sG, sH, sI) {
      let sK = sH.getComponent("minecraft:scale")?.value ?? 1,
        sT = {},
        sV = sG.id,
        // false se a cinemática foi encerrada (desejo aberto ou nova invocação) ou se o jogador saiu
        sU = () => jA3.get(sV) === sT && (sG.isValid || (jA3.delete(sV), !1));
      jA3.set(sV, sT);
      sG.camera.setCamera("minecraft:free", {
        facingLocation: bO.add(sH.location, { y: 32 * sK }),
        location: bO.add(sH.location, { x: 32 * sK, y: 32 * sK, z: 32 * sK }),
        easeOptions: { easeTime: 0.5, easeType: j7.InCirc },
      }),
        sI.spawnSound && (sG.playMusic(sI.spawnSound, { fade: 1 }), aN.applyCameraShake(sG, 0.5, 5)),
        await j8.waitTicks(40),
        sI.sourceAnimation && sH.playAnimation(sI.sourceAnimation),
        await j8.waitTicks(200);
      if (!sU()) return;
      sG.camera.fade({
        fadeColor: { red: 1, green: 1, blue: 1 },
        fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
      });
      await j8.waitTicks(15);
      sU() && (jA3.delete(sV), sG.camera.clear());
    }
    restoreNormalTimeOfDay(sG) {
      let sH = jA.get(sG.id);
      sH && (jb.setTimeOfDay(sH), jA.delete(sG.id));
    }
    // sempre resolve: "granted" | "closed" | "empty" | "invalid" | "error"
    async showWishSelectionMenu(sG, sH) {
      let sK = hO(sG);
      for (let sT = 0; sT < 10; sT++) {
        if (!sG.isValid || !sH.isValid || !sK) return "invalid";
        let sL = this.getEligibleWishes(sK, sH.typeId);
        if (!sL.length) return sG.sendMessage({ translate: "message.shenron.noWishes" }), "empty";
        let sM = new jf();
        sM.title("ui.dbe.wishes.title"), sM.body("");
        for (let sN of sL) sM.button(sN.getTranslationKey());
        let sO;
        try {
          sO = await sM.show(sG);
        } catch (sU) {
          return console.warn("[Dragon Universe] Falha no menu de desejos: " + (sU?.stack ?? sU)), "error";
        }
        if (sO.canceled) {
          // jogador com outra interface aberta: tenta de novo em 1 s
          if (sO.cancelationReason === "UserBusy") {
            await j8.waitTicks(20);
            continue;
          }
          return "closed";
        }
        let sP = sO.selection,
          sS = typeof sP == "number" ? sL[sP] : void 0;
        if (!sS || !sG.isValid || !sH.isValid) return "invalid";
        // revalida no envio: limite e elegibilidade podem ter mudado com o menu aberto
        let sQ = i3.getDBEEntity(sH),
          sR = sQ?.data.get("wishes_made") ?? 0,
          sV = iH.getDragonBallBySourceTypeId(sH.typeId);
        if (!sV || sR >= sV.maxWishes) return "invalid";
        if (!this.getEligibleWishes(sK, sH.typeId).includes(sS)) continue;
        sS.grantWish(sG, sH), sQ?.data.set("wishes_made", sR + 1), this.markWishAsGranted(sK, sS);
        return "granted";
      }
      return "closed";
    }
  },
  jC = new jB(),
  jD = class {
    reset(sG) {
      sG.setProperty("dbe:dragon_radar_location", 0);
    }
    scanDragonBalls(sG) {
      let sH = iH.getRadarDetectableBalls(sG.dimension, sG.location)[0],
        sI = 0,
        sK = 0;
      if (sH) {
        let sL = this.getRelativeLocation(sH.location, sG.location, sG.getViewDirection(), sG.getRotation().y);
        (sI = -sL.x), (sK = sL.z), aQ.tryDamageHeldItem(sG, 1);
      }
      sG.setProperty("dbe:dragon_radar_location", sH ? +("" + (sI + 164) + (sK + 164)) : 0);
    }
    getRelativeLocation(sG, sH, sI, yaw = 0) {
      if (Math.hypot(sI.x, sI.z) < 0.000001) {
        let angle = (yaw * Math.PI) / 180;
        sI = { x: -Math.sin(angle), z: Math.cos(angle) };
      }
      let sK = sG.x - sH.x,
        sL = sG.z - sH.z,
        sM = Math.hypot(sI.x, sI.z),
        sN = sI.x / sM,
        sO = sI.z / sM,
        sP = -sK * sO + sL * sN,
        sQ = -sL * sO - sK * sN,
        sR = Math.hypot(sP, sQ),
        sS = 64;
      if (sR > sS) {
        let sT = sS / sR;
        (sP *= sT), (sQ *= sT);
      }
      return { x: Math.round((sP * 64) / sS), z: Math.round((sQ * 64) / sS) };
    }
  },
  jE = new jD(),
  jF = class {
    applyFoodEffect(sG, sH) {
      switch (sH.typeId) {
        case "dbe:bucket_medical_liquid":
          this.applyBucketMedicalLiquidEffect(sG);
          break;
        case "dbe:senzu_bean":
          this.applySenzuBeanEffect(sG);
          break;
        default:
          this.applyDefaultFoodEffect(sG, sH);
          break;
      }
    }
    applyDefaultFoodEffect(sG, sH) {
      let { attributes: sI, health: sK, ki: sL } = sG,
        sM = sI.stats.getStat("body"),
        sN = sI.stats.getStat("max_ki");
      if (sM && sN) {
        let sO = (sH.getComponent("minecraft:food")?.saturationModifier || 0.6) * 0.25;
        sK.addCurrent(sM.value * sO), sL.addCurrent(sN.value * sO);
      }
    }
    applyBucketMedicalLiquidEffect(sG) {
      let { health: sH } = sG;
      sH.addCurrent(sH.maxValue * 0.4);
    }
    applySenzuBeanEffect(sG) {
      sG.recoverConstitution(),
        sG.player.addEffect("minecraft:saturation", 1, { amplifier: 255 }),
        sG.player.dimension.playSound("item.senzu_bean.use", sG.player.location),
        aQ.decrementStack(sG.player);
    }
  },
  jG = new jF();
import { EntityDamageCause as jH, system as jI } from "@minecraft/server";
var jJ = class {
    explodeAttack(sG, sH, sI, sK) {
      let { canCutTail: sL, damage: sM, entity: sN, explosionPower: sO, owner: sP } = sG;
      if (!sO && sK?.isValid) {
        if (sL && Math.random() < 0.1) {
          let sQ = i3.getDBEEntity(sK);
          sQ && sQ.race?.id === "saiyan" && !sQ.tailCurled && sQ.removeTail();
        }
        if (!!sK.applyDamage(sM, { cause: jH.entityAttack, damagingEntity: sP })) {
          let sR = sN.getVelocity(),
            sS = bO.scale(sR, 5);
          sK.applyKnockback({ x: sS.x, z: sS.z }, 0);
        }
      }
      jI.run(() => {
        if (sN.isValid) {
          sO &&
            f2.createExplosion(sH, sI, sO, {
              breakBlocks: sG.breakBlocks,
              color: sG.color1 ? aI.colorToRgb(sG.color1) : void 0,
              damage: sM,
              damagingEntity: sP,
              ignoredEntities: sP ? [sP] : [],
            });
          for (let sT of hZ.getNearbyKiAttacks(sN.dimension, sN.location, sG.baseScale * 2)) {
            let { dimension: sU, location: t1 } = sT.entity;
            jK.explodeAttack(sT, sU, t1);
          }
          sN.remove();
        }
      });
    }
  },
  jK = new jJ();
import { skills_data as jL } from "./data/skills_data.js";
import { ItemTypes as jM, system as jN } from "@minecraft/server";
import { ActionFormData as jO } from "@minecraft/server-ui";
import { ItemStack as jP } from "@minecraft/server";
function jQ(sG) {
  return function () {
    let sH = (sG += 1831565813);
    return (
      (sH = Math.imul(sH ^ (sH >>> 15), sH | 1)),
      (sH ^= sH + Math.imul(sH ^ (sH >>> 7), sH | 61)),
      ((sH ^ (sH >>> 14)) >>> 0) / 4294967296
    );
  };
}
var jR = class {
    constructor(sG) {
      this.itemData = sG;
    }
    get iconPath() {
      return this.itemData.iconPath ?? "textures/empty";
    }
    get items() {
      return this.itemData.items ?? [];
    }
    get localizationKey() {
      return "shop.item." + this.itemData.id;
    }
    get price() {
      return this.itemData.price;
    }
    giveItems(sG) {
      for (let sH of this.items) {
        let sI = new jP(sH.item, sH.amount);
        sG.getComponent("inventory")?.container.addItem(sI);
      }
    }
  },
  jS = class {
    constructor(sG) {
      this.shopData = sG;
      for (let sH of sG.catalog) {
        let sI = new jR(sH);
        this.catalog.push(sI);
      }
    }
    catalog = [];
    get id() {
      return this.shopData.id;
    }
    getCatalog() {
      return this.catalog;
    }
    getCatalogForNpc(sG) {
      let sH = this.getCatalog();
      return this.getSeededRandomItems(sH, this.shopData.npcCatalogConfig?.maxItems ?? sH.length, sG);
    }
    tryBuyItem(sG, sH) {
      let { player: sI, zeni: sK } = sG;
      return sK.value >= sH.price
        ? (sI.getComponent("inventory")?.container.emptySlotsCount ?? 0) < sH.items.length
          ? (sI.sendMessage({ translate: "shop.result.inventory_full" }), !1)
          : (sK.removeValue(sH.price), sH.giveItems(sG.player), sI.playSound("random.levelup", { pitch: 4 }), !0)
        : (sI.sendMessage({ translate: "shop.result.insufficient_zeni" }), !1);
    }
    getSeededRandomItems(sG, sH, sI) {
      let sK = jQ(sI);
      return [...sG].sort(() => sK() - 0.5).slice(0, sH);
    }
  },
  jT = class {
    instances = new Map();
    getShop(sG) {
      return this.instances.get(sG);
    }
    register(sG) {
      let sH = new jS(sG);
      this.instances.set(sG.id, sH);
    }
  },
  jU = new jT(),
  jV = class {
    dialoguesMap = new Map();
    getNpcDialogues() {
      let sG = [];
      for (let sH of this.dialoguesMap.values()) this.isNpcDialogue(sH) && sG.push(sH);
      return sG;
    }
    getDialogue(sG) {
      return this.dialoguesMap.get(sG);
    }
    getNpcDialogue(sG) {
      return this.getNpcDialogues().find((sH) => sH.npcId === sG);
    }
    registerDialogue(sG) {
      this.dialoguesMap.set(sG.id, sG);
    }
    async showDialogue(sG, sH, sI) {
      let sK = hO(sG),
        { cooldowns: sL, quests: sM } = sK;
      if (sI.npcId === "dbe:master_roshi") sK.claimBulmaStaffReward();
      if (sI.requirements) {
        let { requirements: sO } = sI;
        if (!dC.testAll(sK, sO ?? [])) {
          sG.sendMessage({ translate: "ui.dbe.npcIgnored." + aO.randomInt(1, 6) });
          return;
        }
      }
      if (sI.addQuest) {
        let { questId: sP, requirements: sQ } = sI.addQuest,
          sR = sM.hasQuest(sP),
          sS = sM.getCompletedQuestIds().includes(sP),
          sT = dC.testAll(sK, sQ ?? []);
        if (!sR && !sS && sT) {
          await sM.addQuest(sP);
          return;
        }
      }
      let sN = new jO()
        .title(sI.title ?? "")
        .body(sI.body ? this.resolveDialogueBody(sK, sI.body) : "")
        .button(sI.backButtonDialogue ? "ui.dbe.backButton" : "");
      if (sI.buttons)
        for (let sU of sI.buttons) {
          let t1 = dC.testAll(sK, sU.requirements ?? []);
          if (sU.cooldown) {
            let t2 = sL.getCooldown(sU.cooldown.id);
            t2 && !t2.isExpired() && (t1 = !1);
          }
          sN.button(t1 ? sU.buttonText : "", sU.iconPath);
        }
      jN.run(() => {
        sN.show(sG).then((t3) => {
          if (t3.selection === 0 && sI.backButtonDialogue) {
            let t6 = this.getDialogue(sI.backButtonDialogue);
            t6 && this.showDialogue(sG, sH, t6);
          }
          if (t3.selection && sI.buttons) {
            let t7 = sI.buttons[t3.selection - 1];
            this.onButtonClick(sG, sH, sI, t7);
          }
        });
      });
    }
    createMentorDialogue(sG, sH) {
      return {
        id: sG.id,
        body: "ui.dbe.mentor.invite.text",
        title: sG.title,
        buttons: [
          {
            buttonText: "ui.dbe.mentor.invite.button.confirm",
            onClick: (sI) => {
              let { masterManager: sK } = hO(sI);
              sK.setCurrentMaster(sH);
            },
          },
        ],
      };
    }
    createShopDialogue(sG, sH, sI) {
      let sK = this.generateShopMenu(sG, sH, sI);
      return { id: sI, buttons: sK.buttons, title: sK.title };
    }
    createSkillsDialogue(sG, sH, sI) {
      let sK = this.generateSkillMenu(sG, sI);
      return { id: sH, buttons: sK.buttons, title: sK.title };
    }
    generateShopMenu(sG, sH, sI) {
      let sK = hO(sG),
        sL = [],
        sM = jU.getShop(sI);
      if (sM) {
        for (let sN of sM.getCatalogForNpc(Number(sH.id)))
          sL.push({
            buttonText: {
              rawtext: [
                { translate: sN.localizationKey },
                { text: " " },
                ...(d6(sN.price, "zeni").rawtext ?? []),
                { text: "\n§8" },
                { translate: sN.localizationKey + ".description" },
                { text: "\n\n" },
                ...sN.items.map(({ item: sO }) => ({
                  rawtext: [{ translate: jM.get(sO)?.localizationKey }, { text: ", " }],
                })),
              ],
            },
            iconPath: sN.iconPath,
            onClick: () => sM.tryBuyItem(sK, sN),
          });
      }
      return { buttons: sL, title: "ui.dbe.shop.title" };
    }
    generateSkillMenu(sG, sH) {
      let { skills: sI, pointsManager: sK } = hO(sG),
        sL = [];
      for (let sM of jL) {
        let { availableTrainers: sN, id: sO, price: sP, type: sQ } = sM;
        if (!sN?.includes(sH) || !sI.canLearnSkill(sO)) continue;
        let sR = "skill." + sO,
          sS = sI.hasSkill(sO);
        sL.push({
          buttonText: {
            rawtext: [
              { translate: sR },
              { text: " " },
              ...(sS ? [{ text: "§a" }, { translate: "skill.learned" }] : (d6(sP ?? 0, "skill_points").rawtext ?? [])),
              { text: "\n\n§r§8" },
              { translate: "skill." + sO + ".description" },
              { text: " (" },
              { translate: "skill.type." + sQ },
              { text: ")" },
            ],
          },
          onClick: () => {
            if (!sI.hasSkill(sO) && sI.canLearnSkill(sO) && (!sP || sK.trySpend("skill_points", sP)))
              sI.tryLearnSkill(sO);
          },
        });
      }
      return { buttons: sL, title: "ui.dbe.learn_skills.title" };
    }
    isNpcDialogue(sG) {
      return sG.npcId !== void 0;
    }
    onButtonClick(sG, sH, sI, sK) {
      let sL = hO(sG),
        { nextDialogue: sM, rewards: sN } = sK,
        sO = sI.subMenus?.find(({ id: sP }) => sP === sM);
      if (
        (sK.onClick && sK.onClick(sG),
        sK.cooldown && sL.cooldowns.setCooldown(sK.cooldown.id, sK.cooldown.duration, sK.cooldown.source),
        sN)
      )
        for (let sP of sN) {
          let sQ = gB.get(sP.type);
          if (sQ) {
            let sR = new sQ(sP);
            sR.tryGrantReward(sL), sR.sendRewardMessage(sL);
          }
        }
      if (sO) {
        if (this.isNpcDialogue(sI)) {
          if (sO.type === "mentor_invite") {
            let sS = this.createMentorDialogue(sO, sH.typeId);
            this.showDialogue(sG, sH, sS);
            return;
          }
          if (sO.type === "shop") {
            let sT = this.createShopDialogue(sG, sH, sO.id);
            this.showDialogue(sG, sH, sT);
            return;
          }
          if (sO.type === "skills") {
            let sU = this.createSkillsDialogue(sG, sO.id, sH.typeId);
            this.showDialogue(sG, sH, sU);
            return;
          }
        }
        this.showDialogue(sG, sH, sO);
      }
    }
    resolveDialogueBody(sG, sH) {
      if (Array.isArray(sH)) {
        for (let sI of sH) if (dC.testAll(sG, sI.requirements)) return sI.text;
        return "";
      }
      return sH;
    }
  },
  jW = new jV();
import { ActionFormData as jX } from "@minecraft/server-ui";
var jY = class {
    constructor(sG, ...sH) {
      this.initiator = sG;
    }
    actionFormData = new jX();
    buttonCallbacks = [];
    responseCallbacks = [];
    addButton(sG, sH, sI) {
      return this.actionFormData.button(sG, sI?.iconPatch), this.buttonCallbacks.push(sH || (() => {})), this;
    }
    async display(sG = !1) {
      for (; this.initiator.isValid; ) {
        let sH = await this.actionFormData.show(this.initiator);
        if (sH.selection !== void 0 && sH.selection >= 0) {
          let sI = this.buttonCallbacks[sH.selection];
          sI && sI();
        }
        if (sH.cancelationReason !== "UserClosed" || !sG) {
          for (let sK of this.responseCallbacks) sK(sH);
          return sH;
        }
      }
    }
    setBody(sG) {
      return this.actionFormData.body(sG), this;
    }
    setTitle(sG) {
      return this.actionFormData.title(sG), this;
    }
    shouldDisplayForm() {
      return !0;
    }
    onResponse(sG) {
      this.responseCallbacks.push(sG);
    }
  },
  jZ = class extends jY {
    static lastMenuId = new Map();
    constructor(sG) {
      super(sG), this.addFixedButtons();
    }
    addFixedButtons() {
      let { initiator: sG } = this;
      // 0 = aba Ajuda (Guia, redesign/CONTRATO.md seção 2)
      this.addButton("", () => cj.displayForm(sG, "help")),
        this.addButton("", () => cj.displayForm(sG, "statistics")),
        this.addButton("", () => cj.displayForm(sG, "skills")),
        this.addButton("", () => cj.displayForm(sG, "quest_list")),
        this.addButton("", () => cj.displayForm(sG, "training")),
        this.addButton("", () => cj.displayForm(sG, "news")),
        this.addButton("", () => cj.displayForm(sG, "achievement_list")),
        // 7 = aba Transformações (redesign/CONTRATO.md, seção 2); 8 e 9 reservados
        this.addButton("", () => cj.displayForm(sG, "transformations")),
        this.addButton("", () => cj.displayForm(sG, "")),
        this.addButton("", () => cj.displayForm(sG, ""));
    }
    shouldDisplayForm() {
      return this.initiator.hasTag("dbe_alignment_question")
        ? (cj.displayForm(this.initiator, "alignment_question"), !1)
        : !0;
    }
  };
function k0(sG) {
  hO(sG).claimBulmaStaffReward();
  let sH = jZ.lastMenuId.get(sG.id) ?? "statistics";
  cj.displayForm(sG, sH);
}
function k1(sG) {
  let { concentrationTraining: sH, kiSense: sI, player: sK, quests: sL, title: sM } = sG,
    sN = [];
  if ((sM.reloadTitles(), sI.canSenseKi)) {
    let sO = sI.detectNearestDBEEntity();
    sO && sN.push(...sI.getDescription(sO).rawtext, { text: "\n\n" });
  }
  sL.getActiveQuests().length && sN.push(...sL.describeQuests().rawtext),
    sH.isTraining && sN.push(...sH.getDescription().rawtext),
    sN.length && sK.onScreenDisplay.setActionBar(sN);
}
var k2 = ["dbe:menu", "dbe:functions", "dbe:techniques"],
  k3 = { "dbe:change_hair": "select_hair", "dbe:functions": "main_functions" },
  k4 = new Set();
function k5(sG, sH) {
  k4.has(sG.id) ||
    (k4.add(sG.id),
    n.runTimeout(() => k4.delete(sG.id), 50),
    n.run(() => {
      if (sG.isValid) {
        if ((sG.playSound("block.false_permissions"), sH?.type === "group")) {
          let sI = eJ.getGroupById(sH.id)?.name;
          sG.sendMessage({ translate: "message.safeRegion.noPermission.owner", with: [sI ?? ""] });
        } else sG.sendMessage({ translate: "message.safeRegion.noPermission" });
      }
    }));
}
function removeTimeChamberHostile(entity) {
  if (
    !entity.isValid ||
    entity.dimension.id !== "dbe:hyperbolic_time_chamber" ||
    !entity.typeId.startsWith("minecraft:") ||
    entity.getDynamicProperty("dbe:spawned_by") ||
    entity.getDynamicProperty("dbe:is_friendly_damage")
  )
    return !1;
  if (!entity.getComponent("minecraft:type_family")?.hasTypeFamily("monster")) return !1;
  entity.remove();
  return !0;
}
const duNpcInteractions = new Map();
async function duHandleNpcInteraction(player, target, wrapper, dimensionId) {
  const current = () => player.isValid && target.isValid && i0.get(player.id) === wrapper &&
    player.dimension.id === dimensionId && target.dimension.id === dimensionId;
  if (!current()) return;
  if (wrapper.race.id === "namekian") {
    const other = i3.getDBEEntity(target);
    if (other && iK.tryFusion(wrapper, other)) return;
  }
  for (const task of wrapper.tasks.getActiveTasksByType("collect_item")) {
    if (!current()) return;
    if (task.deliverToNpc !== target.typeId || task.isCompleted || !task.isStarted ||
        !wrapper.tasks.getActiveTasksByType("collect_item").includes(task)) continue;
    if (!task.completeNpcDelivery()) continue;
    await n.waitTicks(10);
    if (!current()) return;
  }
  for (const task of wrapper.tasks.getActiveTasksByType("interact_npc")) {
    if (!current()) return;
    if (task.npcTypeId === target.typeId) { await task.showDialog(); return; }
  }
  for (const { sourceId } of d) {
    if (!current()) return;
    if (sourceId === target.typeId) { await jC.handleWishSession(player, target); return; }
  }
  if (!current()) return;
  const dialogue = jW.getNpcDialogue(target.typeId);
  if (dialogue) {
    await jW.showDialogue(player, target, dialogue);
    if (!current()) return;
    n.run(() => {
      if (!current()) return;
      try { player.playSound("random.pop"), target.playAnimation("animation.humanoid.pop", { players: [player] }); }
      catch (error) { console.warn("[Dragon Universe] NPC interaction effect failed: " + (error?.stack ?? error)); }
    });
  }
}
var k6 = class {
  constructor() {
    let { afterEvents: sG, beforeEvents: sH } = o;
    sG.entityDie.subscribe(this.afterEntityDie),
      sG.entityHitEntity.subscribe(this.afterEntityHitEntity),
      sG.entityLoad.subscribe(this.afterEntityLoad),
      sG.entitySpawn.subscribe(this.afterEntitySpawn),
      sG.itemCompleteUse.subscribe(this.afterItemCompleteUse),
      sG.itemStartUse.subscribe(this.afterItemStartUse),
      sG.itemStopUse.subscribe(this.afterItemStopUse),
      sG.itemUse.subscribe(this.afterItemUse),
      sG.playerDimensionChange.subscribe(this.afterPlayerDimensionChange),
      sG.playerHotbarSelectedSlotChange.subscribe(this.afterPlayerHotbarSelectedSlotChange),
      sG.playerInventoryItemChange.subscribe(this.afterPlayerInventoryItemChange),
      sG.playerSpawn.subscribe(this.afterPlayerSpawn),
      sG.playerSwingStart.subscribe(this.afterPlayerSwingStart),
      sG.projectileHitBlock.subscribe(this.afterProjectileHitBlock),
      sG.projectileHitEntity.subscribe(this.afterProjectileHitEntity),
      sG.worldLoad.subscribe(this.afterWorldLoad),
      sH.entityHurt.subscribe(this.beforeEntityHurt),
      sH.entityItemPickup.subscribe(this.beforeEntityItemPickup),
      sH.explosion.subscribe(this.beforeExplosion),
      sH.playerInteractWithBlock.subscribe(this.beforePlayerInteractWithBlock),
      sH.playerInteractWithEntity.subscribe(this.beforePlayerInteractWithEntity),
      sH.playerBreakBlock.subscribe(this.beforePlayerBreakBlock),
      sH.playerPlaceBlock.subscribe(this.beforePlayerPlaceBlock),
      n.runInterval(this.onTickEvent),
      n.beforeEvents.watchdogTerminate.subscribe((sI) => {
        console.warn("Watchdog solicitou encerramento; proteção mantida. Motivo: " + sI.terminateReason);
      });
  }
  afterEntityDie({ damageSource: sG, deadEntity: sH }) {
    let sI = i3.getDBEEntity(sH);
    sI instanceof hN && (sI.quests.stopActiveQuests(), sH.addTag("dbe:join_other_world")),
      bM.dispatch("entity_died", { entity: sH, damageSource: sG, dbeEntity: sI });
  }
  afterEntityHitEntity({ damagingEntity: sG, hitEntity: sH }) {
    let sI = i3.getDBEEntity(sG);
    sI instanceof hN && sH.typeId === "dbe:training_orb" && sI.concentrationTraining.claimOrb(sH);
  }
  afterEntityLoad({ entity }) {
    removeTimeChamberHostile(entity);
  }
  afterEntitySpawn({ cause: sG, entity: sH }) {
    if (removeTimeChamberHostile(sH)) return;
    if (
      !sH.isValid ||
      sG !== "Spawned" ||
      sH.typeId === "minecraft:item" ||
      sH.getDynamicProperty("dbe:spawned_by") ||
      sH.getDynamicProperty("dbe:is_friendly_damage")
    )
      return;
    if (eO(sH.dimension).getTopRegionAt(sH.location)?.preventMobSpawning ?? !1) {
      let sI = sH.getComponent("minecraft:type_family");
      sI && (["inanimate", "ki_attack", "npc"].some((sK) => sI.hasTypeFamily(sK)) || sH.remove());
    }
  }
  afterItemCompleteUse({ source: sG, itemStack: sH }) {
    let sI = hO(sG);
    aQ.isFood(sH) && jG.applyFoodEffect(sI, sH);
  }
  afterItemStartUse({ itemStack: sG, source: sH }) {
    let sI = i3.getDBEEntity(sH);
    if (sI instanceof hN && sG?.typeId === "dbe:techniques") {
      if (sI.isActionBlocked || sI.isLoadingAttack || sI.transformations.currentTransformation.isOozaru) return;
      let { selectedSkill: sK } = sI.skillsContainer;
      sK instanceof iV && sK.useSkill(), sK instanceof hj && sK.startCharge();
    }
  }
  afterItemStopUse({ itemStack: sG, source: sH }) {
    let sI = i3.getDBEEntity(sH);
    if (sI instanceof hN && sG?.typeId === "dbe:techniques") {
      let { selectedSkill: sK } = sI.skillsContainer;
      sK instanceof hj && sK.stopCharge();
    }
  }
  async afterItemUse({ source: sG, itemStack: sH }) {
    let { hasStartedAdventure: sI, isActionBlocked: sK } = hO(sG);
    if (!sK) {
      if (sI) {
        let sL = k3[sH.typeId];
        if (sH.typeId === "dbe:menu") {
          k0(sG);
          return;
        }
        sL && cj.displayForm(sG, sL);
      } else duCustomizationOpen.has(sG.id) || cj.displayForm(sG, "select_race");
    }
  }
  afterPlayerDimensionChange({ fromDimension: sG, player: sH, toDimension: sI }) {
    jE.reset(sH);
    let flight = i0.get(sH.id)?.skills.getToggleSkill("fly");
    flight?.isEnabled && flight.disable();
    eO(sG).updateEntityRegions(sH), eO(sI).updateEntityRegions(sH);
  }
  afterPlayerHotbarSelectedSlotChange({ newSlotSelected: sG, player: sH, previousSlotSelected: sI }) {
    let radar = aN.getEquippedItem(sH, l.Mainhand);
    radar?.typeId === "dbe:dragon_radar" ? jE.scanDragonBalls(sH) : jE.reset(sH);
    let { guard: sK } = hO(sH);
    sG === 8 && sK.tryGuard(), sI === 8 && sK.breakGuard();
  }
  afterPlayerInventoryItemChange({ itemStack: sG, player: sH, slot: sI }) {
    if (sG) {
      if (iR.isBanned(sG.typeId)) {
        sH.getComponent("inventory")?.container.setItem(sI);
        return;
      }
      if (sG.hasComponent("dbe:patreon") && !hO(sH).redeem.hasCode("patreon")) {
        sH.getComponent("inventory")?.container.setItem(sI), sH.dimension.spawnItem(sG, sH.location);
        return;
      }
      !sG.keepOnDeath &&
        sG.hasComponent("dbe:keep_on_death") &&
        ((sG.keepOnDeath = !0), sH.getComponent("inventory")?.container.setItem(sI, sG));
    }
  }
  afterPlayerSpawn({ player: sG }) {
    jE.reset(sG);
    let sH = hO(sG);
    sH.recoverConstitution(),
      sG.hasTag("dbe:join_other_world") &&
        n.runTimeout(() => {
          if (!sG.isValid || i0.get(sG.id) !== sH || sH.data.get("afterlife_return") ||
              !sG.hasTag("dbe:join_other_world") || duIsTravelPending(sG)) return;
          let sI = o.getDimension("dbe:other_world"),
            sK = eO(sI).getRegion("other_world");
          sK && (sH.trySetProperty("dbe:is_death", !0), sK.teleportToRegion(sG));
        }, 20);
  }
  afterWorldLoad(sG) {
    o.gameRules.showTags = !1;
    try {
      for (let entity of o.getDimension("dbe:hyperbolic_time_chamber").getEntities()) removeTimeChamberHostile(entity);
    } catch (error) {
      console.warn("[Dragon Universe] Time chamber hostile cleanup failed:", error);
    }
  }
  afterProjectileHitBlock({ dimension: sG, location: sH, projectile: sI }) {
    if (sI.typeId === "dbe:ki_attack") {
      let sK = i3.getKiAttackEntity(sI);
      sK && jK.explodeAttack(sK, sG, sH);
    }
  }
  afterProjectileHitEntity(sG) {
    let { dimension: sH, location: sI, projectile: sK } = sG;
    if (sK.typeId === "dbe:ki_attack") {
      let sL = i3.getKiAttackEntity(sK);
      if (sL) {
        let { entity: sM } = sG.getEntityHit();
        jK.explodeAttack(sL, sH, sI, sM);
      }
    }
  }
  afterPlayerSwingStart({ heldItemStack: sG, player: sH, swingSource: sI }) {
    if (sI === i.Attack) {
      let sK = hO(sH),
        { transformations: sL } = sK,
        { currentTransformation: sM } = sL;
      if ((sK.guard.breakGuard(20), sG?.hasTag("dbe:area_damage"))) {
        iB(sK, { radius: 3, damage: 2 });
        return;
      }
      sM.isOozaru && iB(sK, { radius: 6, damage: 2 });
    }
  }
  beforeEntityHurt(sG) {
    ib.applyDamageToEntity(sG);
  }
  beforeEntityItemPickup(sG) {
    let sH = sG.item.getComponent(g.Item)?.itemStack;
    if (sH && sG.entity instanceof m) {
      let sI = hO(sG.entity),
        sK = sI.getCurrentFusion();
      if (iR.isBanned(sH.typeId)) {
        sG.cancel = !0;
        return;
      }
      if (sK && !sK.isController) {
        sG.cancel = !0;
        return;
      }
      if (sH.hasComponent("dbe:patreon") && !sI.redeem.hasCode("patreon")) {
        sG.cancel = !0;
        return;
      }
    }
  }
  beforeExplosion(sG) {
    let sH = sG.getImpactedBlocks();
    for (let { dimension: sI, location: sK } of sH) if (((sG.cancel = eO(sI).isBlockProtection(sK)), sG.cancel)) break;
  }
  beforePlayerInteractWithBlock(sG) {
    let { dimension: sH, location: sI } = sG.block;
    if (sG.block.getTags().includes("dragon_ball")) return;
    let sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  beforePlayerInteractWithEntity(sG) {
    let { itemStack: sH, player: sI, target: sK } = sG;
    const wrapper = i0.get(sI.id);
    if (sH?.hasComponent("dbe:hoi_poi_capsule")) {
      sG.cancel = !0;
      n.run(() => {
        if (sI.isValid && sK.isValid && wrapper && i0.get(sI.id) === wrapper && sI.dimension.id === sK.dimension.id)
          try { iy.tryStoreEntitiesFromLocation(sI, sH, sK.location); }
          catch (error) { console.warn("[Dragon Universe] Capsule interaction failed: " + (error?.stack ?? error)); }
      });
      return;
    }
    if (!wrapper || !sI.isValid || !sK.isValid || duNpcInteractions.get(sI.id)?.wrapper === wrapper) return;
    const dimensionId = sI.dimension.id, token = { wrapper };
    duNpcInteractions.set(sI.id, token);
    try {
      n.run(() => {
        duHandleNpcInteraction(sI, sK, wrapper, dimensionId).catch(error => {
          console.warn("[Dragon Universe] NPC interaction failed: " + (error?.stack ?? error));
        }).finally(() => {
          if (duNpcInteractions.get(sI.id) === token) duNpcInteractions.delete(sI.id);
        });
      });
    } catch (error) {
      if (duNpcInteractions.get(sI.id) === token) duNpcInteractions.delete(sI.id);
      console.warn("[Dragon Universe] NPC interaction scheduling failed: " + (error?.stack ?? error));
    }
  }
  beforePlayerBreakBlock(sG) {
    let { dimension: sH, location: sI } = sG.block;
    if (sG.block.getTags().includes("dragon_ball")) return;
    let sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  beforePlayerPlaceBlock(sG) {
    let { dimension: sH, location: sI } = sG.block,
      sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  onTickEvent() {
    let { currentTick: sG } = n,
      sH = sG % 20 === 0,
      sI = sG % 100 === 2,
      sK = sG % 600 === 3;
    for (let sL of i3.getDBEEntities())
      if (sL instanceof hN) {
        let { cooldowns: sM, player: sN, transformations: sO } = sL;
        if ((j4(sN), sH)) {
          let sP = aN.getEquippedItem(sN, l.Mainhand);
          sL.updateTrainingWeight(),
            ex.fusionHandler(sL),
            eP.syncEntityRegionState(sN),
            k1(sL),
            sP?.typeId === "dbe:dragon_radar" ? jE.scanDragonBalls(sN) : jE.reset(sN);
        }
        if ((sI && (aQ.setPlayerFixedItems(sN, k2), k7(sL), sO.updateAvailableTransformations()), sK)) {
          let sQ = sM.getCooldown("senzu_bean_daily"),
            sR = sM.getCooldown("tail_regeneration");
          sQ?.isExpired() &&
            (sM.clearCooldown("senzu_bean_daily"),
            sN.sendMessage({ translate: "message.senzuBeanDaily.korinWarning" })),
            sR?.isExpired() && sL.addTail();
        }
      }
    hZ.testAllCollisions(i3.getKiAttackEntities());
    sI && iH.updateBalls();
  }
};
function k7(sG) {
  let { player: sH, tasks: sI } = sG,
    { dimension: sK, location: sL } = sH,
    sM = sK.getEntities({ location: sL, maxDistance: 16 });
  for (let sN of sM) sI.isQuestNpc(sN) && sH.spawnParticle("dbe:task_warn", sN.getHeadLocation());
}
var k8 = new k6(),
  k9 = class extends jY {
    constructor(sG, sH) {
      if ((super(sG), !sH)) throw new Error("A conquista fornecida como parâmetro é inválida ou está ausente.");
      this.setTitle("ui.dbe.achievement.title"),
        this.setBody({ rawtext: gX.getFormatedDescription(sH.tasks).rawtext }),
        this.addButton("ui.dbe.backButton", () => cj.displayForm(sG, "achievement_list"));
    }
  },
  kb = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { achievements: sI } = sH;
      jZ.lastMenuId.set(sG.id, "achievement_list"), this.setTitle("ui.dbe.achievement_list.title");
      for (let sK of sI.getVisibleAchievements()) {
        let sL = sK.isCompleted ? this.getCompletedAchievementButtonText(sK) : this.getAchievementButtonText(sK);
        this.addButton(sL, () => new k9(sG, sK).display(), { iconPatch: duAchievementIcon(sK) });
      }
    }
    getAchievementButtonText(sG) {
      return {
        rawtext: [
          {
            translate: "ui.dbe.achievement_list.button.achievement",
            with: { rawtext: [{ translate: sG.titleKey }, { text: "" + sG.progressPercent }] },
          },
          { text: "\n§r" },
          { translate: sG.descriptionKey },
        ],
      };
    }
    getCompletedAchievementButtonText(sG) {
      return {
        rawtext: [
          {
            translate: "ui.dbe.achievement_list.button.completed_achievement",
            with: { rawtext: [{ translate: sG.titleKey }] },
          },
          { text: "\n§r" },
          { translate: sG.descriptionKey },
        ],
      };
    }
  },
  kf = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { attributes: sI } = sH;
      jZ.lastMenuId.set(sG.id, "statistics_view"), this.setTitle("ui.dbe.statistics.title"); // mesmo título do kF; o JSON separa pela flag "du2;" (só o kF manda)
      let sK = [];
      for (let sL of sI.stats.getStats())
        sK.push({ translate: "stat." + sL.id }, { text: ": §u" + sL.getFormatedValue() + "\n§r" });
      this.setBody({ rawtext: sK });
    }
  },
  kj = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { ki: sI, race: sK, transformations: sL } = sH;
      jZ.lastMenuId.set(sG.id, "transformations"), this.setTitle("ui.dbe.transformations.title");
      const forms = [...sL.getTransformations()];
      if (sK.id === "glind") {
        const mystic = forms.findIndex(form => form.id === "ultimate_form");
        if (mystic >= 0 && forms.some(form => form.id === "demon_lord")) {
          const [form] = forms.splice(mystic, 1);
          forms.splice(forms.findIndex(entry => entry.id === "demon_lord"), 0, form);
        }
      }
      for (let sM of forms) {
        let { id: sN, canTransform: sO, isBase: sP, requirements: sQ } = sM;
        if (sP && sO) continue;
        let sR = {
          rawtext: [{ translate: sK.id + ".transformation." + sN }, ...(dC.listDescription(sQ).rawtext ?? [])],
        };
        this.addButton(
          sR,
          () => {
            sO && sI.currentValue ? sM.transform() : cj.displayForm(sG, "transformations");
          },
          { iconPatch: sO ? "" : DU_ICON + "lock" }, // 12b (CONTRATO §10.2)
        );
      }
    }
  },
  kk = class extends jY {
    constructor(sG) {
      super(sG);
      let { alignment: sH } = hO(sG);
      this.setTitle("ui.dbe.alignment_question.title"),
        this.setBody("ui.dbe.alignment_question.text"),
        this.addButton("ui.dbe.alignment_question.button.to_protect", () => sH.addAlignment(5)),
        this.addButton("ui.dbe.alignment_question.button.for_my_self", () => sH.removeAlignment(1)),
        this.addButton("ui.dbe.alignment_question.button.for_evil", () => sH.removeAlignment(5)),
        this.onResponse((sI) => {
          sI.canceled || this.skipAlignmentQuestion();
        });
    }
    skipAlignmentQuestion() {
      this.initiator.removeTag("dbe_alignment_question"), cj.displayForm(this.initiator, "quest_list");
    }
  };
// sorteia um valor em [0, sG) fora de sH (randomExclude dos dados da raça); sem sobra, ignora a exclusão
function kpPick(sG, sH) {
  let sI = Array.isArray(sH) ? sH : [],
    sK = [];
  for (let sL = 0; sL < sG; sL++) sI.includes(sL) || sK.push(sL);
  return sK.length ? sK[Math.floor(Math.random() * sK.length)] : Math.floor(Math.random() * sG);
}
function kp(sG) {
  let { playerCustomization: sH } = sG,
    sI = fR.getAvailableRaces(sG),
    sK = Math.floor(Math.random() * sI.length),
    sL = sI[sK];
  sG.trySetProperty("dbe:race", sL.id), (sH.raceIndex = fR.getIndex(sL.id) ?? 0);
  let { activeCustomizations: sM } = sH,
    { options: sN } = sM;
  if (sN) {
    let sO = Object.entries(sN);
    for (let [sP, sQ] of sO) {
      // randomExclude: opções que o sorteio não usa, mas que continuam escolhíveis na criação e na barbearia
      if (sQ.type === "variant") {
        let sR = kpPick(sQ.optionCount, sQ.randomExclude);
        sH.setOptionValue(sP, sR);
      }
      if (sQ.type === "color") {
        let sS = kpPick(sQ.palette.length, sQ.randomExclude);
        sH.setOptionValue(sP, sS);
      }
    }
  }
  if (sM.hasGender) {
    let sT = Math.round(Math.random());
    sH.setGender(sT ? "female" : "male");
  }
  return sL;
}
// Redesign 1.7.17 (redesign/CONTRATO.md): ordem dos atributos nas Estatísticas e no bônus de raça; multiplicador como texto.
const DU_ATTRIBUTE_ORDER = ["constitution", "dexterity", "spirit", "strength", "willpower"];
// sempre com pelo menos 1 casa (x1.0, x2.0, x1.5) e no máximo 2, para não arredondar dado real (x1.25, x1.15)
const duMultiplierText = (value) => {
  const n = parseFloat(Number(value).toFixed(2));
  return "x" + (Number.isInteger(n * 10) ? n.toFixed(1) : String(n));
};
const DU_RACE_GRID = 8; // botões 4-11 da seleção de raça
// Jogadores com o formulário de customização aberto (ver showCustomizationForm e afterItemUse).
var duCustomizationOpen = new Set();
// Quem sai com a customização aberta não pode voltar "travado" (sem abrir a seleção de raça).
o.afterEvents.playerLeave.subscribe(({ playerId: sG }) => duCustomizationOpen.delete(sG));
var kq = class t8 extends jY {
    constructor(sG, sH = 1) {
      super(sG), (this.selectedRaceIndex = sH);
      let sI = hO(this.initiator),
        sK = fR.getAvailableRaces(sI),
        sL = sK[sH];
      if (!sL) return;
      let sM = sL.getData();
      if (!sM) return;
      sI.trySetProperty("dbe:race", sM.id);
      let { playerCustomization: sN } = sI;
      (sN.raceIndex = sH),
        sN.reset(),
        this.setTitle("ui.dbe.select_race.title"),
        // redesign/CONTRATO.md, seção 4: body = só a descrição longa; 0-3 = navegação, 4-11 = grade de raças,
        // 12-31 = slots de dado (botões que o JSON UI só lê, sem clique).
        this.setBody({ rawtext: [{ translate: sM.id + ".description" }] }),
        this.addButton(this.lockRace ? "" : "ui.dbe.bigPreviousButton", () => this.selectRaceByIndex(sH - 1, sK)),
        this.addButton({ translate: "ui.dbe.select_race.button.select_race", with: { rawtext: [{ translate: sM.id }] } },
          async () => this.showCustomizationForm(sM.id)),
        this.addButton(this.lockRace ? "" : "ui.dbe.select_race.button.random_select", async () => {
          let sO = kp(sI);
          this.showCustomizationForm(sO.id);
        }),
        this.addButton(this.lockRace ? "" : "ui.dbe.bigNextButton", () => this.selectRaceByIndex(sH + 1, sK));
      for (let k = 0; k < DU_RACE_GRID; k++) {
        const race = sK[k];
        if (!race || (this.lockRace && k !== sH)) this.addButton("", () => {});
        else this.addButton((k === sH ? "*" : "") + race.id, () => this.selectRaceByIndex(k, sK), { iconPatch: "textures/ui/du2/icons/race_" + race.id });
      }
      const info = duRaceInfo(sM.id),
        slot = (content, icon) => this.addButton(content, () => {}, icon ? { iconPatch: icon } : void 0);
      slot(sM.id + ".description.short"); // 12
      slot(info ? duMultiplierText(info.regen) : ""); // 13
      slot(info ? "" + info.formCount : ""); // 14
      slot(info ? (info.gender ? "ui.dbe.yes" : "ui.dbe.no") : ""); // 15
      slot(info ? { rawtext: duFirstFormsRawtext(info) } : ""); // 16
      slot(sM.id + ".customization"); // 17
      slot(sH + 1 + " / " + sK.length); // 18
      slot(sM.id); // 19
      const bonuses = info ? info.bonuses.map(({ id, value }) => ({ key: "attribute." + id, icon: "attr_" + id, value })) : [];
      if (info && info.size !== 1) bonuses.push({ key: "ui.dbe.size", icon: "attr_size", value: info.size });
      for (let k = 0; k < 6; k++) slot(bonuses[k]?.key ?? "", bonuses[k] && "textures/ui/du2/icons/" + bonuses[k].icon); // 20-25
      for (let k = 0; k < 6; k++) slot(bonuses[k] ? duMultiplierText(bonuses[k].value) : ""); // 26-31
    }
    lockRace = !1;
    confirmRaceSelection(sG) {
      let sH = hO(this.initiator);
      sH.setRace(sG), sH.startAdventure();
    }
    selectRaceByIndex(sG, sH) {
      let sI = sH.length,
        sK = this.lockRace ? this.selectedRaceIndex : (sG + sI) % sI;
      new t8(this.initiator, sK).display();
    }
    async showCustomizationForm(sG) {
      let sI = this.initiator.id;
      // um laço por jogador: dois laços mostravam formulários com valores diferentes
      if (duCustomizationOpen.has(sI)) return;
      duCustomizationOpen.add(sI);
      try {
        for (; this.initiator.isValid; ) {
          let sH = await new kv(this.initiator).display(!0);
          if (sH && Number(sH.selection) <= 1) {
            sH.selection === 1 && this.confirmRaceSelection(sG);
            break;
          }
          // UserBusy (formulário anterior ainda fechando, chat aberto): espera em vez de recriar a cada tick (C20)
          if (sH?.cancelationReason === "UserBusy") await new Promise((sK) => gU.runTimeout(sK, 5));
        }
      } finally {
        duCustomizationOpen.delete(sI);
      }
    }
  },
  kv = class extends jY {
    constructor(sG) {
      super(sG);
      let { playerCustomization: sH } = hO(sG);
      this.setTitle("ui.dbe.customization.title"),
        this.addButton("ui.dbe.backButton", () => new kq(sG, sH.raceIndex).display()),
        this.addButton("ui.dbe.customization.button.confirm", () => {}),
        this.setBody(this.generateCustomizationData());
    }
    // 12d (CONTRATO §10.4): 2-17 = setas da linha k (2+2k ◀, 3+2k ▶), 18-25 = nome da linha k (com ícone cust_<id>),
    // 26-33 = valor "<n>/<total>". Sempre 8 linhas: as que sobram vêm vazias. Body = nomes, como reserva.
    generateCustomizationData() {
      let { playerCustomization: sG } = hO(this.initiator),
        { activeCustomizations: sH, gender: sI } = sG,
        sK = [],
        rows = [];
      if (sH.hasGender) {
        sK.push({ translate: "customization.gender" }, { text: "\n" });
        // lê o gênero na hora do clique: um formulário reexibido não pode desfazer a escolha
        let sL = () => sG.setGender(sG.gender === "male" ? "female" : "male");
        this.addButton(" ", sL), this.addButton(" ", sL);
        rows.push({ id: "gender", value: (sI === "female" ? 2 : 1) + "/2" });
      }
      for (let sM in sH.options) {
        let sN = sG.getOption(sM);
        if (
          !sN ||
          (sN.activeGenders && !sN.activeGenders.includes(sI)) ||
          (sN.type === "variant" ? sN.optionCount : sN.palette.length) <= 1
        )
          continue;
        sK.push({ translate: "customization." + sM }, { text: "\n" });
        // valor atual lido no clique (antes: o valor de quando o formulário foi montado; um formulário
        // reexibido ou atrasado aplicava "antigo ± 1" e a opção voltava para a anterior)
        this.addButton(" ", () => sG.setOptionValue(sM, sG.getOptionValue(sM) - 1)),
          this.addButton(" ", () => sG.setOptionValue(sM, sG.getOptionValue(sM) + 1));
        rows.push({ id: sM, value: duOptionValue(sG, sM, sN) });
      }
      duCustomizationSlots(this, rows, 8);
      return sK.length ? { rawtext: sK } : "";
    }
  },
  kw = class extends jY {
    dbePlayer;
    skills;
    slots = new Array(17).fill(void 0);
    constructor(sG, sH = 0) {
      super(sG),
        (this.dbePlayer = hO(sG)),
        (this.skills = this.dbePlayer.skills),
        this.setTitle("ui.dbe.functions.title");
      let sI = this.skills.getSkillsByType("toggle");
      sH === 0 && (this.slots[1] = this.getSelectTransformationButtonConfig()),
        sH === 1 && (this.slots[7] = this.getTailModeButtonConfig());
      let sK = sH * 9,
        sL = sK + 8;
      for (let sM of sI) {
        let sN = sM.functionSlotIndex;
        if (sN === void 0 || sN < sK || sN > sL || !dC.testAll(this.dbePlayer, sM.requirements)) continue;
        let sO = sN - sK;
        this.slots[sO] = this.getSkillToggleButtonConfig(sM);
      }
      for (let sP = 0; sP < this.slots.length; sP++) {
        if (sP === 4) {
          this.addButton("ui.dbe.functions.button.more");
          continue;
        }
        let sQ = this.slots[sP];
        sQ ? this.addButton(sQ.text, sQ.callback) : this.addButton(" ");
      }
    }
    getSkillToggleButtonConfig(sG) {
      return {
        text: sG.canSwitchTier
          ? sG.getTranslationKey()
          : {
              rawtext: [
                { translate: "skill." + sG.id },
                { text: " " },
                { translate: "skill." + (sG.isEnabled ? "enabled" : "disabled") },
              ],
            },
        callback: () => (sG.canSwitchTier ? sG.increaseTier() : sG.isEnabled ? sG.disable() : sG.enable()),
      };
    }
    getSelectTransformationButtonConfig() {
      let { transformations: sG } = this.dbePlayer,
        { selectedTransformation: sH } = sG,
        sI = sG.getCurrentBaseTransformation(),
        sK = sG.getAvailableTransformations().filter(({ id: sL, isBase: sM }) => !sM || (sM && sL === sI.id));
      if (this.dbePlayer.race.id === "glind") {
        const mystic = sK.findIndex(form => form.id === "ultimate_form");
        if (mystic >= 0 && sK.some(form => form.id === "demon_lord")) {
          const [form] = sK.splice(mystic, 1);
          sK.splice(sK.findIndex(entry => entry.id === "demon_lord"), 0, form);
        }
      }
      return {
        text: "" + sH.localizationKey,
        callback: () => {
          let sL = (sK.indexOf(sH) + 1) % sK.length,
            sM = sK[sL];
          sM && (sG.selectedTransformationId = sM.id);
        },
      };
    }
    getTailModeButtonConfig() {
      let { hasTail: sG, race: sH } = this.dbePlayer;
      if (sH.id !== "saiyan" || !sG) return;
      let sI = this.initiator.getProperty("dbe:tail_curled");
      return {
        text: {
          rawtext: [
            {
              translate: "ui.dbe.functions.button.tail_mode",
              with: { rawtext: [{ translate: "tailMode." + (sI ? "curled" : "loose") }] },
            },
          ],
        },
        callback: () => this.dbePlayer.trySetProperty("dbe:tail_curled", !sI),
      };
    }
  },
  kx = class extends kw {
    constructor(sG) {
      super(sG, 0),
        this.onResponse((sH) => {
          !sH.canceled && sH.selection !== 4 && cj.displayForm(this.initiator, "main_functions"),
            sH.selection === 4 && cj.displayForm(this.initiator, "side_functions");
        });
    }
  },
  ky = class extends kw {
    constructor(sG) {
      super(sG, 1),
        this.onResponse((sH) => {
          !sH.canceled && sH.selection !== 4 && cj.displayForm(this.initiator, "side_functions"),
            sH.selection === 4 && cj.displayForm(this.initiator, "main_functions");
        });
    }
  },
  kz = class extends jZ {
    constructor(sG) {
      super(sG),
        this.setTitle("ui.dbe.news.title"),
        this.setBody({
          rawtext: [
            { translate: "pack.news" },
          ],
        });
    }
  };
function kA(sG) {
  return {
    translate: "message.objective.recentlyStarted",
    with: { rawtext: [{ ...aM.convertTimeToRawText(sG * 50) }] },
  };
}
// Item 12 da 1.7.18 (redesign/CONTRATO.md §10): ícones do du2, sempre "textures/ui/du2/icons/<nome>" sem extensão. A
// cor é fixa por ícone e decidida no JSON, que compara o caminho: o script manda só o caminho exato.
const DU_ICON = "textures/ui/du2/icons/";
const DU_QUEST_TYPE_ICON = { main: "quest_main", mentor: "quest_mentor", side: "quest_side", challenge: "quest_challenge" };
const DU_ACHIEVEMENT_ICON = { battle_power: "ach_battle_power", defeat_enemy: "ach_defeat", item: "ach_item",
  learn_skill: "ach_skill", requirement: "ach_requirement" };
// Prioridade (§10.1): bloqueada (não iniciada e o objetivo atual não pode começar) > concluída > tipo.
function duQuestIcon(quest) {
  const objective = quest.getInProgressObjective(),
    name = !objective ? "quest_done" : !quest.isStarted && !objective.canStart ? "lock" : DU_QUEST_TYPE_ICON[quest.type];
  return name ? DU_ICON + name : "";
}
// 12d: valor atual de uma opção de customização, "<n>/<total>" com n a partir de 1.
function duOptionValue(customization, id, option) {
  const total = option.type === "variant" ? option.optionCount : option.palette.length;
  return customization.getOptionValue(id) + 1 + "/" + total;
}
// 12d: completa as setas até `max` linhas (pares vazios, sem clique) e manda os nomes (com ícone) e os valores.
function duCustomizationSlots(form, rows, max) {
  const noop = () => {};
  for (let k = rows.length; k < max; k++) form.addButton("", noop), form.addButton("", noop);
  for (let k = 0; k < max; k++)
    rows[k] ? form.addButton("customization." + rows[k].id, noop, { iconPatch: DU_ICON + "cust_" + rows[k].id }) : form.addButton("", noop);
  for (let k = 0; k < max; k++) form.addButton(rows[k]?.value ?? "", noop);
}
// Concluída > categoria (o type da 1ª tarefa). Categoria sem ícone: "" (a linha fica sem ícone).
function duAchievementIcon(achievement) {
  const name = achievement.isCompleted ? "ach_done" : DU_ACHIEVEMENT_ICON[achievement.achievementData?.tasks?.[0]?.type];
  return name ? DU_ICON + name : "";
}
var kB = class extends jY {
    constructor(sG, sH) {
      if ((super(sG), !sH)) throw new Error("A missão fornecida como parâmetro é inválida ou está ausente.");
      let sI = sH.getRecommendedLevel(),
        sK = sH.getInProgressObjective();
      if (!sK) return;
      let { restartCooldown: sL, startRequirements: sM } = sK,
        sN;
      for (let sP of sK.getTasks()) if (((sN = sP.startError), sN)) break;
      this.setTitle("ui.dbe.quest.title"),
        this.setBody({
          rawtext: [
            { text: "§u" },
            { translate: sH.titleKey },
            { text: "\n§6" },
            { translate: "ui.dbe.quest.recommended_level", with: ["" + sI] },
            { text: "§r\n\n" },
            { translate: sH.descriptionKey },
            { text: "\n\n" },
            { translate: "ui.dbe.quest.objectives", with: { rawtext: [{ rawtext: sH.listObjectives().rawtext }] } },
            ...(sM.length
              ? [
                  { text: "\n\n" },
                  {
                    translate: "ui.dbe.quest.requirements",
                    with: { rawtext: [{ rawtext: dC.listDescription(sM).rawtext }] },
                  },
                ]
              : []),
            ...(sH.getRewards().length
              ? [
                  { text: "\n\n" },
                  { translate: "ui.dbe.quest.rewards", with: { rawtext: [{ rawtext: sH.listRewards().rawtext }] } },
                ]
              : []),
            ...(sL && !sL.isExpired() ? [{ text: "\n\n" }, kA(sL.getRemainingTicks())] : []),
            ...(sN ? [{ text: "\n\n" }, this.getErrorMessage(sN)] : []),
          ],
        }),
        this.addButton("ui.dbe.backButton", () => cj.displayForm(sG, "quest_list"));
      // 1 = Iniciar/Reiniciar (mesmas condições de antes); sem botão, "" para os índices seguintes não andarem
      let sO = "ui.dbe.quest.button.start",
        start;
      if (sK.canStart) {
        if (!sH.isStarted) start = () => sH.startQuest();
        else if (!sK.isStarted) start = () => sK.startObjective();
        else if (sL && sL.isExpired()) (sO = "ui.dbe.quest.button.restart"), (start = () => sH.restartInProgressObjective());
      }
      start ? this.addButton(sO, start) : this.addButton("", () => {});
      this.addDetailSlots(sH, sI, sL, sM, sN);
    }
    // 12c (CONTRATO §10.3): 2 título, 3 tipo (com o ícone da lista), 4 nível (código), 5 descrição, 6-13 objetivos,
    // 14-17 requisitos, 18-25 recompensas (com ícone pelo tipo), 26 espera para reiniciar, 27 erro de início.
    // Só leitura (sem clique). O body continua completo, como reserva.
    addDetailSlots(quest, level, cooldown, requirements, startError) {
      const noop = () => {},
        slot = (content, icon) => this.addButton(content, noop, icon ? { iconPatch: icon } : void 0),
        fill = (list, max, make) => {
          for (let k = 0; k < max; k++) list[k] ? make(list[k]) : slot("");
        };
      slot({ rawtext: [{ translate: quest.titleKey }] });
      slot("quest." + quest.type + ".single", duQuestIcon(quest));
      slot("" + level);
      slot({ rawtext: [{ translate: quest.descriptionKey }] });
      // mesma ordem e filtro do listObjectives (iniciada = só o objetivo atual; não iniciada = todos), sem "\n N. "
      const objectives = [];
      for (const objective of quest.isStarted ? [quest.getInProgressObjective()] : quest.getAllObjectives()) {
        const text = objective && gX.getFormatedDescription(objective.getTasks(), objective.durationCooldown).rawtext;
        text && objectives.push({ rawtext: [...(objective.isCompleted ? [{ text: "*" }] : []), ...text] });
      }
      fill(objectives, 8, (text) => slot(text));
      // mesmo filtro do dC.listDescription usado no body (sem jogador), um requisito por slot, sem "\n- "
      fill(requirements.filter((r) => !r.exceptRaceIds?.includes(void 0) && dC.get(r.test)), 4, (r) =>
        slot({ rawtext: [dC.getDescription(r)] }));
      const rewardIcon = { item: "ach_item", points: "skill_points", zeni: "reward_zeni", z_points: "reward_xp" };
      fill(quest.getRewards().filter((r) => r.description?.rawtext), 8, (r) => {
        const icon = rewardIcon[r.rewardData?.type];
        slot({ rawtext: r.description.rawtext }, icon ? DU_ICON + icon : "");
      });
      slot(cooldown && !cooldown.isExpired() ? { rawtext: [kA(cooldown.getRemainingTicks())] } : "");
      slot(startError ? { rawtext: [this.getErrorMessage(startError)] } : "");
    }
    getErrorMessage(sG) {
      return sG === "SafeRegion"
        ? { translate: "message.quest.error.safeRegion" }
        : sG === "TrainingWeight"
          ? { translate: "message.quest.error.trainingWeight" }
          : { translate: "message.quest.error.commonError" };
    }
  },
  kC = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { quests: sI } = sH;
      jZ.lastMenuId.set(sG.id, "quest_list"), this.setTitle("ui.dbe.quest_list.title");
      for (let sK of sI.getQuests()) {
        let sL = {
          rawtext: [
            {
              translate: "ui.dbe.quest_list.button.quest",
              with: { rawtext: [{ translate: "quest." + sK.type + ".single" }, { translate: sK.titleKey }] },
            },
          ],
        };
        this.addButton(sL, () => new kB(this.initiator, sK).display(), { iconPatch: duQuestIcon(sK) });
      }
    }
  },
  kD = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG);
      jZ.lastMenuId.set(sG.id, "skills");
      let sI = [];
      for (let sK of sH.skills.getSkills()) sK.canBeUpgraded && sI.push(sK);
      // 12e (CONTRATO §10.5): 10 = Transformações, 11 = pontos ("pts;<n>", só leitura, com ícone), 12+ = habilidades
      this.setTitle("ui.dbe.skills.title"),
        this.setBody(this.listInfo(sI)),
        this.addButton("ui.dbe.skills.button.transformations", () => cj.displayForm(sG, "transformations"));
      this.addButton("pts;" + aO.shortenNumber(sH.pointsManager.get("skill_points")), () => cj.displayForm(sG, "skills"),
        { iconPatch: DU_ICON + "skill_points" });
      for (let sL of sI) {
        let sM = sL.level >= sL.maxLevel,
          sN = {
            rawtext: [
              {
                translate: sM ? "ui.dbe.skills.button.maximized_skill" : "ui.dbe.skills.button.upgrade_skill",
                with: { rawtext: [{ translate: "skill." + sL.id }, { text: "" + sL.level }] },
              },
              ...(sM ? [] : [{ text: " " }, ...(d6(sL.upgradeCost, "skill_points").rawtext ?? [])]),
            ],
          };
        this.addButton(sN, () => {
          let { pointsManager: sO } = sH;
          sL.level < sL.maxLevel &&
            sO.trySpend("skill_points", sL.upgradeCost) &&
            (sL.upgradeSkill(), sG.playSound("ui.upgrade")),
            cj.displayForm(sG, "skills");
        }, { iconPatch: sM ? DU_ICON + "skill_max" : "" });
      }
    }
    // Os pontos saíram do body (vão no slot 11); o body só avisa quando não há habilidade para melhorar.
    listInfo(sG) {
      return sG.length ? "" : { rawtext: [{ translate: "ui.dbe.skills.text.empty" }] };
    }
  },
  kE = new Map(),
  kF = class extends jZ {
    // Layout do redesign 1.7.17 (redesign/CONTRATO.md, seção 3): 10 = Informações, 11-13 = x1/x10/x100, 14-18 = comprar
    // atributo, 19 reservado, 20-47 = slots de dado (botões que o JSON UI só lê, sem clique). Body = flag "du2;".
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { attributes: sI } = sH,
        sK = kE.get(sG.id) ?? 1;
      jZ.lastMenuId.set(sG.id, "statistics"), this.setTitle("ui.dbe.statistics.title");
      this.addButton("ui.dbe.statistics.button.info", () => cj.displayForm(sG, "statistics_view"));
      for (const amount of [1, 10, 100])
        this.addButton((amount === sK ? "*" : "") + "x" + amount, () => {
          kE.set(sG.id, amount), cj.displayForm(sG, "statistics");
        });
      const attributes = new Map([...sI.getAttributes()].map((attribute) => [attribute.id, attribute])),
        rows = DU_ATTRIBUTE_ORDER.map((id) => attributes.get(id));
      for (const sL of rows) {
        if (!sL) {
          this.addButton("", () => {});
          continue;
        }
        const sP = sL.getUpgradeCost(sK);
        this.addButton("attribute." + sL.id, () => {
          this.tryBuyAttribute(sL, sK, sP), cj.displayForm(sG, "statistics");
        }, { iconPatch: "textures/ui/du2/icons/attr_" + sL.id });
      }
      this.addButton("", () => {}); // 19 reservado
      const slot = (content) => this.addButton(content, () => {});
      const { alignment: alignment, masteries: masteries, masterManager: masterManager, race: race, trainingMultiplier: training,
          pointsManager: points, transformations: transformations, level: level } = sH,
        { currentTransformation: form } = transformations,
        mastery = masteries.getMastery(form.id),
        stat = (id) => aO.shortenNumber(Math.round(sI.stats.getStat(id)?.value ?? 0)),
        next = level.getPointsToNextLevel();
      slot(race.id); // 20
      slot({ rawtext: [{ translate: "" + form.localizationKey }, { text: mastery ? " x" + mastery.masteryMultiplier : "" }] }); // 21
      slot("alignment." + alignment.getAlignment()); // 22
      slot(masterManager.getMasterLocalizationKey()); // 23
      slot("" + level.currentLevel); // 24
      slot(level.currentPoints + " / " + next + " XP"); // 25 (XP cru, como antes)
      slot("" + (Math.max(0, Math.min(10, Math.floor((10 * Number(level.currentPoints)) / Math.max(1, Number(next))))) || 0)); // 26 (código, 0..10)
      slot({ translate: "ui.dbe.statistics.free_points", with: [aO.shortenNumber(points.get("attribute_points"))] }); // 27
      slot(aO.shortenNumber(Math.round(sI.battlePower ?? 0))); // 28
      slot(stat("melee_damage")); // 29
      slot(stat("defense")); // 30
      slot(stat("max_ki")); // 31
      for (const sL of rows) slot(sL ? "" + sL.value : ""); // 32-36
      for (const sL of rows) slot(sL ? duMultiplierText(sI.modifiers.getMultiplier(sL.id)) : ""); // 37-41
      for (const sL of rows) slot(sL ? d6(sL.getUpgradeCost(sK), "attribute_points") : ""); // 42-46
      slot(training !== 1 ? "x" + parseFloat(Number(training).toFixed(2)) : ""); // 47
      this.setBody("du2;"); // du2; = layout novo (o kf, mesmo título, não manda). "ozr;" saiu: a UI não lê mais (5ba9258)
    }
    tryBuyAttribute(sG, sH, sI) {
      if (sG.value + sH >= sG.maxValue) return;
      let { pointsManager: sK } = hO(this.initiator);
      sK.trySpend("attribute_points", sI) && sG.addValue(sH, !0);
    }
  };
import { CONFIG as kG } from "./config/config.js";
var kH = class extends jZ {
    constructor(sG) {
      super(sG), jZ.lastMenuId.set(sG.id, "training"), this.setTitle("ui.dbe.training.title");
      let sH = hO(sG),
        { concentrationTraining: sI } = sH,
        { isTraining: sK } = sI;
      sI.checkAndUpdateAttempts(),
        sK || this.addButton("ui.dbe.training.button.shadow_dummy", () => this.shadowTraining()),
        (sK || sI.remainingAttempts > 0) &&
          this.addButton(
            sK ? "ui.dbe.training.button.stop_concentration" : "ui.dbe.training.button.concentration",
            () => {
              sK ? sI.stopTraining() : sI.startTraining();
            },
          );
    }
    shadowTraining() {
      let sG = hO(this.initiator),
        sH = sG.cooldowns.getCooldown("shadow_dummy");
      if (!sH || sH.isExpired()) {
        let { dimension: sI, location: sK } = this.initiator,
          sL = d2(sI, sK, 4);
        sL
          ? (sG.cooldowns.setCooldown("shadow_dummy", kG.SHADOW_DUMMY_COOLDOWN_TICKS),
            sG.despawnShadowDummies(),
            sG.trySpawnShadowDummy(sL))
          : this.initiator.sendMessage({ translate: "message.summon.obstructedArea" });
      } else {
        let sM = aM.convertTimeToRawText(sH.getRemainingTicks() * 50);
        this.initiator.sendMessage({
          translate: "message.shadowDummy.cooldownWarning",
          with: { rawtext: [{ ...sM }] },
        });
      }
    }
  },
  kI = class extends jY {
    constructor(sG) {
      super(sG),
        this.setTitle("ui.dbe.select_hair.title"),
        this.setBody(this.generateCustomizationData()),
        this.onResponse((sH) => {
          sH.canceled || (this.playShearSoundEffect(), cj.displayForm(this.initiator, "select_hair"));
        });
    }
    shouldDisplayForm() {
      let { playerCustomization: sG } = hO(this.initiator),
        sH = Object.values(sG.activeCustomizations.options || {}).some(({ barberEditable: sI }) => sI);
      return sH || this.haircutNotAvailable(), sH;
    }
    generateCustomizationData() {
      let { playerCustomization: sG } = hO(this.initiator),
        { activeCustomizations: sH, gender: sI } = sG,
        sK = [],
        rows = [];
      for (let sL in sH.options) {
        let sM = sG.getOption(sL);
        if (
          !sM?.barberEditable ||
          (sM.activeGenders && !sM.activeGenders.includes(sI)) ||
          (sM.type === "variant" ? sM.optionCount : sM.palette.length) <= 1
        )
          continue;
        sK.push({ translate: "customization." + sL }, { text: "\n" });
        this.addButton(" ", () => sG.setOptionValue(sL, sG.getOptionValue(sL) - 1)),
          this.addButton(" ", () => sG.setOptionValue(sL, sG.getOptionValue(sL) + 1));
        rows.push({ id: sL, value: duOptionValue(sG, sL, sM) });
      }
      // 12d (CONTRATO §10.4): 0-9 = setas, 10-14 = nomes, 15-19 = valores; sempre 5 linhas. O marcador "§r§o§r" do
      // Oozaru saiu: a UI não lê mais (5ba9258).
      duCustomizationSlots(this, rows, 5);
      return sK.length ? { rawtext: sK } : "";
    }
    playShearSoundEffect() {
      this.initiator.playSound("mob.sheep.shear");
    }
    haircutNotAvailable() {
      this.initiator.sendMessage({ translate: "message.changeHair.withoutCutsWarning" });
    }
  };
// Guia da aba Ajuda (redesign/CONTRATO.md, seção 5): 10+ = um botão por tópico; o clique reabre o form com o tópico no body.
// Cada texto tem parágrafos: ui.dbe.help.text.<id>, depois .2, .3… (o .lang não tem quebra de linha).
const DU_HELP_PARAGRAPHS = { intro: 2, evolve: 4, transformations: 4, quests: 4, dragon_balls: 3, planets: 4, commands: 4 };
const DU_HELP_TOPICS = ["evolve", "transformations", "quests", "dragon_balls", "planets", "commands"];
var duHelpForm = class extends jZ {
    constructor(sG, topic) {
      super(sG);
      const open = DU_HELP_TOPICS.includes(topic) ? topic : "intro",
        body = [{ translate: "ui.dbe.help.text." + open }];
      for (let n = 2; n <= DU_HELP_PARAGRAPHS[open]; n++) body.push({ text: "\n\n" }, { translate: "ui.dbe.help.text." + open + "." + n });
      this.setTitle("ui.dbe.help.title"), this.setBody({ rawtext: body });
      for (const id of DU_HELP_TOPICS) this.addButton("ui.dbe.help.topic." + id, () => cj.displayForm(sG, "help", !1, id));
    }
  };
function kJ() {
  cj.registerActionForm("achievement_list", kb),
    cj.registerActionForm("help", duHelpForm),
    cj.registerActionForm("alignment_question", kk),
    cj.registerActionForm("customization", kv),
    cj.registerActionForm("main_functions", kx),
    cj.registerActionForm("news", kz),
    cj.registerActionForm("quest", kB),
    cj.registerActionForm("quest_list", kC),
    cj.registerActionForm("select_hair", kI),
    cj.registerActionForm("select_race", kq),
    cj.registerActionForm("side_functions", ky),
    cj.registerActionForm("skills", kD),
    cj.registerActionForm("statistics", kF),
    cj.registerActionForm("statistics_view", kf),
    cj.registerActionForm("training", kH),
    cj.registerActionForm("transformations", kj);
}
kJ();
import { CONFIG as kK } from "./config/config.js";
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
import { modifiers_data as l7 } from "./data/modifiers_data.js";
import { regionsData as l8 } from "./data/regions_data.js";
import { skills_data as l9 } from "./data/skills_data.js";
import { system as lb } from "@minecraft/server";
import {
  CommandPermissionLevel as lf,
  CustomCommandParamType as lj,
  CustomCommandStatus as lk,
  Player as lp,
} from "@minecraft/server";
var lq = {
  customCommand: {
    name: "dbe:ban",
    description: "Use para banir um jogador.",
    permissionLevel: lf.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: lj.String }],
    optionalParameters: [{ name: "reason", type: lj.String }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    sG instanceof lp && sG.name !== sH && gI.ban(sH, sI), { status: lk.Success }
  ),
};
import {
  CommandPermissionLevel as lv,
  CustomCommandParamType as lw,
  CustomCommandStatus as lx,
  Player as ly,
  system as lz,
} from "@minecraft/server";
var lA = {
  customCommand: {
    name: "dbe:data",
    description: "Use para ver os dados de jogadores.",
    permissionLevel: lv.GameDirectors,
    optionalParameters: [{ name: "victim", type: lw.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    sG instanceof ly &&
      lz.run(() => {
        if (sH)
          for (let sI of sH) {
            let sK = i3.getDBEEntity(sI);
            if (sK) {
              let { data: sL } = sK;
              sG.sendMessage(
                (sI instanceof ly ? sI.name : sI.id) + ": \n§a" + JSON.stringify(sL.getData(), null, "  "),
              );
            }
          }
        else {
          let sM = i3.getDBEEntity(sG);
          if (sM) {
            let { data: sN } = sM;
            sG.sendMessage("§a" + JSON.stringify(sN.getData(), null, "  "));
          }
        }
      }),
    { status: lx.Success }
  ),
};
import {
  CommandPermissionLevel as lB,
  CustomCommandParamType as lC,
  CustomCommandStatus as lD,
  EntityTypes as lE,
  system as lF,
  world as lG,
} from "@minecraft/server";
var lH = {
  customCommand: {
    name: "dbe:entities",
    description: "",
    permissionLevel: lB.GameDirectors,
    mandatoryParameters: [
      { name: "dimension", type: lC.String },
      { name: "destination", type: lC.Location },
    ],
  },
  callback: (sG, sH, sI) => {
    let sK = lG.getDimension(sH),
      sL = lE.getAll().filter((sP) => sP.id.startsWith("dbe:")),
      sM = 2,
      sN = 0,
      sO = sI;
    return (
      lF.run(() => {
        for (let sP of sL) {
          try {
            let sQ = d4(sP.id, sK, sO);
            sQ && i3.getDBEEntity(sQ)?.attributes.getAttribute("constitution")?.setValue(9999999);
          } catch {}
          (sN += sM), (sO.x += sM), sN >= 16 && ((sO.x -= sN), (sO.z += sM), (sN = 0));
        }
      }),
      { status: lD.Success }
    );
  },
};
import { CommandPermissionLevel as lI, CustomCommandStatus as lJ, world as lK } from "@minecraft/server";
var lL = {
  customCommand: {
    name: "dbe:fixstructures",
    description: "Recarrega as estruturas. Reinicie o mundo para aplicar as alterações.",
    permissionLevel: lI.Admin,
  },
  callback: () => (bG(lK, "structures").set("loaded", []), { status: lJ.Success }),
};
import { skills_data as lM } from "./data/skills_data.js";
import {
  CommandPermissionLevel as lN,
  CustomCommandParamType as lO,
  CustomCommandStatus as lP,
  Player as lQ,
} from "@minecraft/server";
var lR = {
  customCommand: {
    name: "dbe:learn",
    description: "Use para aprender novas habilidades.",
    permissionLevel: lN.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: lO.Enum }],
    optionalParameters: [
      { name: "level", type: lO.Integer },
      { name: "victim", type: lO.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof lQ)) continue;
      let { skills: sN } = hO(sM);
      if (sH === "*")
        for (let { id: sO } of lM) {
          let sP = sN.tryLearnSkill(sO);
          sI && sP?.setLevel(sI);
        }
      else {
        let sQ = sN.tryLearnSkill(sH);
        sI && sQ?.setLevel(sI);
      }
    }
    return { status: lP.Success };
  },
};
import {
  CommandPermissionLevel as lS,
  CustomCommandParamType as lT,
  CustomCommandStatus as lU,
  system as lV,
} from "@minecraft/server";
function lW(sG, sH) {
  lV.run(() => {
    eP.getAllRegions()
      .find(({ id: sI }) => sI === sH)
      ?.teleportToRegion(sG);
  });
}
var lX = {
  customCommand: {
    name: "dbe:region",
    description: "Teleporta entidades para regiões específicas do add-on.",
    permissionLevel: lS.GameDirectors,
    mandatoryParameters: [{ name: "dbe:region", type: lT.Enum }],
    optionalParameters: [{ name: "victim", type: lT.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) lW(sL, sH);
    return { status: lU.Success };
  },
};
import {
  CommandPermissionLevel as lY,
  CustomCommandParamType as lZ,
  CustomCommandStatus as m0,
  Player as m1,
} from "@minecraft/server";
var m2 = {
  customCommand: {
    name: "dbe:removemodifier",
    description: "Remove modificadores.",
    permissionLevel: lY.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: lZ.Enum }],
    optionalParameters: [{ name: "victim", type: lZ.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof m1)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.removeModifier(sH);
    }
    return { status: m0.Success };
  },
};
import { skills_data as m3 } from "./data/skills_data.js";
import {
  CommandPermissionLevel as m4,
  CustomCommandParamType as m5,
  CustomCommandStatus as m6,
  Player as m7,
  system as m8,
} from "@minecraft/server";
var m9 = {
  customCommand: {
    name: "dbe:removeskill",
    description: "Remove habilidades.",
    permissionLevel: m4.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: m5.Enum }],
    optionalParameters: [{ name: "victim", type: m5.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    m8.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof m7)) continue;
        let { skills: sM } = hO(sL);
        if (sH === "*") {
          for (let { id: sN } of m3) sM.removeSkill(sN);
        } else sM.removeSkill(sH);
      }
    }),
    { status: m6.Success }
  ),
};
import {
  CommandPermissionLevel as mb,
  CustomCommandParamType as mf,
  CustomCommandStatus as mj,
  Player as mk,
} from "@minecraft/server";
var mp = {
  customCommand: {
    name: "dbe:reset",
    description: "Reseta os dados de um ou mais jogadores.",
    permissionLevel: mb.GameDirectors,
    optionalParameters: [{ name: "player", type: mf.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    let sI = sH ?? (sG ? [sG] : []);
    for (let sK of sI) sK instanceof mk && hO(sK).reset();
    return { status: mj.Success };
  },
};
import {
  CommandPermissionLevel as mq,
  CustomCommandParamType as mv,
  CustomCommandStatus as mw,
  Player as mx,
} from "@minecraft/server";
var my = {
  customCommand: {
    name: "dbe:setattribute",
    description: "Define atributos (força, destreza, etc.).",
    permissionLevel: mq.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:attribute", type: mv.Enum },
      { name: "value", type: mv.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mv.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof mx)) continue;
      let { attributes: sN } = hO(sM);
      if (sH === "*") {
        for (let sO of e8) sN.getAttribute(sO)?.setValue(sI);
      } else sN.getAttribute(sH)?.setValue(sI);
    }
    return { status: mw.Success };
  },
};
import {
  CommandPermissionLevel as mz,
  CustomCommandParamType as mA,
  CustomCommandStatus as mB,
} from "@minecraft/server";
var mC = {
  customCommand: {
    name: "dbe:setcolor",
    description: "Define cores específicas (aura, cabelo, etc.).",
    permissionLevel: mz.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:color", type: mA.Enum },
      { name: "red", type: mA.Integer },
      { name: "green", type: mA.Integer },
      { name: "blue", type: mA.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mA.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK, sL, sM) => {
    let sN = sM ?? (sG ? [sG] : []);
    for (let sO of sN) {
      let sP = i3.getDBEEntity(sO);
      if (sP) {
        let { colors: sQ, ki: sR } = sP;
        sQ.setDefaultColor(sH, aI.normalize({ red: sI, green: sK, blue: sL })), sR.updateAuraColor();
      }
    }
    return { status: mB.Success };
  },
};
import {
  CommandPermissionLevel as mD,
  CustomCommandParamType as mE,
  CustomCommandStatus as mF,
  Player as mG,
  system as mH,
} from "@minecraft/server";
var mI = {
  customCommand: {
    name: "dbe:setcustom",
    description: "Define customizações de um ou mais jogadores",
    permissionLevel: mD.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:customId", type: mE.Enum },
      { name: "index", type: mE.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mE.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => (
    mH.run(() => {
      let sL = sK ?? (sG ? [sG] : []);
      for (let sM of sL) sM instanceof mG && hO(sM).playerCustomization.setOptionValue(sH, sI);
    }),
    { status: mF.Success }
  ),
};
import {
  CommandPermissionLevel as mJ,
  CustomCommandParamType as mK,
  CustomCommandStatus as mL,
  Player as mM,
} from "@minecraft/server";
var mN = {
  customCommand: {
    name: "dbe:setmodifier",
    description: "Define modificadores.",
    permissionLevel: mJ.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: mK.Enum }],
    optionalParameters: [{ name: "victim", type: mK.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mM)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.setModifier(sH);
    }
    return { status: mL.Success };
  },
};
import {
  CommandPermissionLevel as mO,
  CustomCommandParamType as mP,
  CustomCommandStatus as mQ,
  Player as mR,
  system as mS,
} from "@minecraft/server";
async function mT(sG, sH) {
  let { quests: sI } = sG;
  sI.hasQuest(sH) && (sI.deleteQuest(sH), await mS.waitTicks(20)), sI.addQuest(sH);
}
var mU = {
  customCommand: {
    name: "dbe:setquest",
    description: "Use para adicionar novas missões.",
    permissionLevel: mO.GameDirectors,
    mandatoryParameters: [{ name: "dbe:quest", type: mP.Enum }],
    optionalParameters: [{ name: "victim", type: mP.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mR)) continue;
      let sM = hO(sL);
      if (sH === "*") {
        for (let { id: sN } of g5.getAllQuestData()) mT(sM, sN);
      } else mT(sM, sH);
    }
    return { status: mQ.Success };
  },
};
import {
  CommandPermissionLevel as mV,
  CustomCommandParamType as mW,
  CustomCommandStatus as mX,
  Player as mY,
  system as mZ,
} from "@minecraft/server";
var n0 = {
  customCommand: {
    name: "dbe:setrace",
    description: "Define a raça de um ou mais jogadores",
    permissionLevel: mV.GameDirectors,
    mandatoryParameters: [{ name: "dbe:race", type: mW.Enum }],
    optionalParameters: [{ name: "victim", type: mW.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    mZ.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof mY)) continue;
        let sM = hO(sL);
        fR.isRaceAvailableForPlayer(sM, sH)
          ? sM.setRace(sH)
          : sL.sendMessage({ translate: "message.changeRace.noPermission" });
      }
    }),
    { status: mX.Success }
  ),
};
import {
  CommandPermissionLevel as n1,
  CustomCommandParamType as n2,
  CustomCommandStatus as n3,
  Player as n4,
} from "@minecraft/server";
var n5 = {
  customCommand: {
    name: "dbe:setvalue",
    description: "Define certos valores (nível, pontos de treinamento, etc.).",
    permissionLevel: n1.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:value", type: n2.Enum },
      { name: "value", type: n2.Integer },
    ],
    optionalParameters: [{ name: "player", type: n2.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []),
      sM = n3.Failure;
    for (let sN of sL) {
      if (!(sN instanceof n4)) continue;
      let sO = hO(sN);
      switch (sH) {
        case "alignment":
          sO.alignment.setAlignment(sI), (sM = n3.Success);
          break;
        case "attribute_points":
          sO.pointsManager.add("attribute_points", sI), (sM = n3.Success);
          break;
        case "mastery":
          let { masteries: sP, transformations: sQ } = sO;
          sP.getMastery(sQ.currentTransformation.id)?.setPercentage(sI), (sM = n3.Success);
          break;
        case "skill_points":
          sO.pointsManager.add("skill_points", sI), (sM = n3.Success);
          break;
        case "zeni":
          sO.zeni.setValue(sI), (sM = n3.Success);
          break;
        case "level":
          sO.level.setLevel(sI), (sM = n3.Success);
          break;
      }
    }
    return { status: sM };
  },
};
import {
  CommandPermissionLevel as n6,
  CustomCommandParamType as n7,
  CustomCommandStatus as n8,
  Player as n9,
  system as nb,
} from "@minecraft/server";
var nf = {
  customCommand: {
    name: "dbe:showform",
    description: "Abre um formulário para um jogador.",
    permissionLevel: n6.GameDirectors,
    mandatoryParameters: [{ name: "dbe:actionform", type: n7.Enum }],
    optionalParameters: [{ name: "victim", type: n7.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nb.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) sL instanceof n9 && cj.displayForm(sL, sH);
    }),
    { status: n8.Success }
  ),
};
import {
  CommandPermissionLevel as nj,
  CustomCommandParamType as nk,
  CustomCommandStatus as np,
  system as nq,
} from "@minecraft/server";
var nv = {
  customCommand: {
    name: "dbe:transform",
    description: "Transforma jogadores.",
    permissionLevel: nj.GameDirectors,
    mandatoryParameters: [{ name: "dbe:transformation", type: nk.Enum }],
    optionalParameters: [{ name: "victim", type: nk.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nq.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        let sM = i3.getDBEEntity(sL);
        sM && sM.transformations.getTransformationById(sH)?.transform();
      }
    }),
    { status: np.Success }
  ),
};
import {
  CommandPermissionLevel as nw,
  CustomCommandParamType as nx,
  CustomCommandStatus as ny,
  Player as nz,
} from "@minecraft/server";
var nA = {
  customCommand: {
    name: "dbe:unban",
    description: "Use para desbanir um jogador.",
    permissionLevel: nw.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: nx.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (sG instanceof nz && sG.name !== sH && gI.unban(sH), { status: ny.Success }),
};
import {
  CommandPermissionLevel as nB,
  CustomCommandStatus as nC,
  Player as nD,
  system as nE,
  world as nF,
} from "@minecraft/server";
var nG = {
  customCommand: { name: "dbe:worlddata", description: "Exibe dados do mundo", permissionLevel: nB.GameDirectors },
  callback: ({ sourceEntity: sG }) => (
    nE.run(() => {
      let sH = bG(nF, "dragon_evolution");
      sG instanceof nD && sG.sendMessage("world: \n§a" + JSON.stringify(sH.getData(), null, "  "));
    }),
    { status: nC.Success }
  ),
};
import {
  CommandPermissionLevel as nH,
  CustomCommandParamType as nI,
  CustomCommandStatus as nJ,
  Player as nK,
  system as nL,
} from "@minecraft/server";
var nM = {
  customCommand: {
    name: "dbe:pay",
    cheatsRequired: !1,
    description: "Transfere zeni para outro jogador.",
    permissionLevel: nH.Any,
    mandatoryParameters: [
      { name: "amount", type: nI.Integer },
      { name: "player", type: nI.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nL.run(() => {
      if (sG instanceof nK)
        for (let sK of sI) {
          let { zeni: sL } = hO(sK),
            sM = hO(sG).zeni.transferValue(sH, sL);
          if (sM === "InsufficientBalance") {
            sG.sendMessage({ translate: "command.pay.insufficient_balance" });
            break;
          }
          if (sM === "InvalidAmount") {
            sG.sendMessage({ translate: "command.pay.invalid_amount" });
            break;
          }
          sM === "Success" && sG.sendMessage({ translate: "command.pay.success", with: ["" + sH, sK.name] });
        }
    }),
    { status: nJ.Success }
  ),
};
import {
  CommandPermissionLevel as nN,
  CustomCommandParamType as nO,
  CustomCommandStatus as nP,
  Player as nQ,
} from "@minecraft/server";
var nR = {
  customCommand: {
    name: "dbe:group.acceptinvite",
    description: "Aceita o convite para entrar em um grupo de jogadores.",
    permissionLevel: nN.Any,
    mandatoryParameters: [{ name: "groupName", type: nO.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof nQ) {
      let sI = eJ.getGroupByName(sH);
      return sI && eJ.acceptInvite(sG, sI.id), { status: nP.Success };
    }
  },
};
import { CommandPermissionLevel as nS, CustomCommandStatus as nT, Player as nU } from "@minecraft/server";
var nV = {
  customCommand: {
    name: "dbe:group.claim",
    description: "Reivindica a região atual como território do seu grupo.",
    permissionLevel: nS.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof nU) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      if (sH.claimedRegions.length >= sH.maxClaims) {
        sG.sendMessage({ translate: "player_group.claim.max_claims_reached" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return (
        sH.tryClaimLocation(sI, sK).then((sL) => {
          sL || sG.sendMessage({ translate: "player_group.claim.already_owned" });
        }),
        { status: nT.Success }
      );
    }
  },
};
import { CommandPermissionLevel as nW, CustomCommandStatus as nX, Player as nY } from "@minecraft/server";
var nZ = {
  customCommand: {
    name: "dbe:group.claims",
    description: "Exibe as coordenadas de todos os territórios do grupo.",
    permissionLevel: nW.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof nY)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    let { claimedRegions: sI } = sH,
      sK = sI.map(({ dimension: sL, spawnPoint: sM }, sN) => {
        let { x: sO, y: sP, z: sQ } = sM;
        return "§6" + (sN + 1) + ". §e" + sL.id + "§7: §f" + sO + " " + sP + " " + sQ;
      });
    for (let sL of sI) sH.displayClaimBorder(sG, sL);
    return sG.sendMessage([{ translate: "player_group.claim.list" }, "\n", sK.join("\n")]), { status: nX.Success };
  },
};
import { CommandPermissionLevel as o0, CustomCommandStatus as o1, Player as o2, system as o3 } from "@minecraft/server";
import { CustomForm as o4, ObservableString as o5 } from "@minecraft/server-ui";
var o6 = 800;
function o7(sG, sH) {
  let sI = eG(sH),
    sK = hO(sG),
    { zeni: sL } = sK;
  if (sL.value < o6) {
    sG.sendMessage({ translate: "shop.result.insufficient_zeni" });
    return;
  }
  if (sI.length < 3) {
    sG.sendMessage({ translate: "player_group.create.name_too_short" });
    return;
  }
  if (sI.length > 10) {
    sG.sendMessage({ translate: "player_group.create.name_too_long" });
    return;
  }
  if (eJ.getGroupByName(sI)) {
    sG.sendMessage({ translate: "player_group.create.already_exists" });
    return;
  }
  let sM = eJ.createGroup(sI);
  sM &&
    (sL.removeValue(o6),
    sG.sendMessage({ translate: "player_group.create.success", with: [sI] }),
    sM.addPlayerToGroup(sG));
}
var o8 = {
  customCommand: { name: "dbe:group.create", description: "Crie um grupo de jogadores.", permissionLevel: o0.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof o2) {
      if (eJ.hasGroup(sG)) {
        sG.sendMessage({ translate: "player_group.already_in_group" });
        return;
      }
      return (
        o3.run(() => {
          let sH = new o5("", { clientWritable: !0 }),
            sI = new o4(sG, { translate: "ui.create_group.title" });
          sI.textField({ translate: "ui.create_group.text_field.group_name" }, sH, {
            description: { translate: "ui.create_group.text", with: ["" + o6] },
          }),
            sI.button({ translate: "ui.create_group.button.confirm" }, () => {
              o7(sG, sH.getData()), sI.close();
            }),
            sI.show();
        }),
        { status: o1.Success }
      );
    }
  },
};
import { CommandPermissionLevel as o9, CustomCommandStatus as ob, Player as of } from "@minecraft/server";
var oj = {
  customCommand: {
    name: "dbe:group.friendlyfire",
    description: "Ativa ou desativa o fogo amigo do grupo.",
    permissionLevel: o9.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof of)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    if (!sH.isOwner(sG.id)) {
      sG.sendMessage({ translate: "player_group.friendlyfire.no_permission" });
      return;
    }
    let sI = sH.toggleFriendlyFire();
    sG.sendMessage({ translate: sI ? "player_group.friendlyfire.enabled" : "player_group.friendlyfire.disabled" });
    for (let sK of sH.getOnlinePlayers())
      sK.id !== sG.id &&
        sK.sendMessage({
          translate: sI ? "player_group.friendlyfire.enabled.announce" : "player_group.friendlyfire.disabled.announce",
          with: [sH.name],
        });
    return { status: ob.Success };
  },
};
import {
  CommandPermissionLevel as ok,
  CustomCommandStatus as op,
  Player as oq,
  system as ov,
  world as ow,
} from "@minecraft/server";
var ox = {
  customCommand: { name: "dbe:group.home", description: "Teleporta para a base do grupo.", permissionLevel: ok.Any },
  callback: ({ sourceEntity: sG }) => (
    ov.run(() => {
      if (sG instanceof oq) {
        let sH = eJ.getPlayerGroup(sG.id);
        if (sH) {
          let { spawnPoint: sI } = sH;
          sI
            ? (sG.sendMessage({ translate: "player_group.base.teleporting" }),
              ov.runTimeout(() => {
                if (!sG.isValid) return;
                try {
                  sG.playSound("entity.player.teleport");
                  duTravel(sG, sI.location, { dimension: ow.getDimension(duPhysicalDestinationId(sI.dimensionId)), label: "group home" });
                } catch (error) { duReportTravelFailure(sG, "group home", error); }
              }, 80))
            : sG.sendMessage({ translate: "player_group.base.not_set" });
        } else sG.sendMessage({ translate: "player_group.not_in_group" });
      }
    }),
    { status: op.Success }
  ),
};
import {
  CommandPermissionLevel as oy,
  CustomCommandParamType as oz,
  CustomCommandStatus as oA,
  Player as oB,
  system as oC,
} from "@minecraft/server";
import { CustomForm as oD } from "@minecraft/server-ui";
var oE = {
  customCommand: {
    name: "dbe:group.info",
    description: "Exibe informações de um grupo.",
    permissionLevel: oy.Any,
    mandatoryParameters: [{ type: oz.String, name: "groupName" }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oB) {
      let sI = eJ.getGroupByName(sH);
      sI &&
        oC.run(() => {
          let sK = new oD(sG, sI.name);
          sK.label("Dono: " + sI.getOwner()?.name),
            sK.spacer(),
            sK.label("Poder: " + aO.shortenNumber(sI.getGroupPower())),
            sK.spacer(),
            sK.label("Membros:");
          for (let sL of sI.members) sK.spacer(), sK.label("- " + sL.name);
          sK.show();
        });
    }
    return { status: oA.Success };
  },
};
import {
  CommandPermissionLevel as oF,
  CustomCommandParamType as oG,
  CustomCommandStatus as oH,
  Player as oI,
  world as oJ,
} from "@minecraft/server";
var oK = {
  customCommand: {
    name: "dbe:group.invite",
    description: "Convide jogadores para o seu grupo.",
    permissionLevel: oF.Any,
    mandatoryParameters: [{ name: "playerName", type: oG.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oI) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = oJ.getAllPlayers().find(({ name: sL }) => sL === sH);
      if (sK) eJ.invitePlayerToGroup(sK, sI.id);
      else {
        sG.sendMessage({ translate: "player_group.invite.player_not_found" });
        return;
      }
      return { status: oH.Success };
    }
  },
};
import {
  CommandPermissionLevel as oL,
  CustomCommandParamType as oM,
  CustomCommandStatus as oN,
  Player as oO,
} from "@minecraft/server";
var oP = {
  customCommand: {
    name: "dbe:group.kickplayer",
    description: "Remova jogadores do seu grupo.",
    permissionLevel: oL.Any,
    mandatoryParameters: [{ name: "playerName", type: oM.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oO) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = sI.getMemberByName(sH);
      if (sK) {
        if (sK.id === sG.id) {
          sG.sendMessage({ translate: "player_group.remove.owner_cannot_remove_self" });
          return;
        }
        return sI.removePlayerFromGroup(sK.id), { status: oN.Success };
      } else sG.sendMessage({ translate: "player_group.remove.player_not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oQ, CustomCommandStatus as oR, Player as oS } from "@minecraft/server";
var oT = {
  customCommand: { name: "dbe:group.leave", description: "Saia de um grupo de jogadores.", permissionLevel: oQ.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof oS) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (sH) return sH.removePlayerFromGroup(sG.id), { status: oR.Success };
      sG.sendMessage({ translate: "player_group.not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oU, CustomCommandStatus as oV, Player as oW, system as oX } from "@minecraft/server";
var oY = {
  customCommand: {
    name: "dbe:group.setbase",
    description: "Define uma base para o seu grupo.",
    permissionLevel: oU.Any,
  },
  callback: ({ sourceEntity: sG }) => (
    oX.run(() => {
      if (sG instanceof oW) {
        let { dimension: sH, location: sI } = sG,
          sK = eJ.getPlayerGroup(sG.id);
        if (!sK) {
          sG.sendMessage({ translate: "player_group.not_in_group" });
          return;
        }
        if (!sK.isOwner(sG.id)) {
          sG.sendMessage({ translate: "player_group.no_permission" });
          return;
        }
        if (
          !eO(sH)
            .getChunkRegions(sI)
            .some((sL) => sL.isOwner(sK.id))
        ) {
          sG.sendMessage({ translate: "player_group.base.not_in_claim" });
          return;
        }
        sK.setSpawnPoint(sH, sI), sG.sendMessage({ translate: "player_group.base.set.success" });
      }
    }),
    { status: oV.Success }
  ),
};
import { CommandPermissionLevel as oZ, CustomCommandStatus as p0, Player as p1 } from "@minecraft/server";
var p2 = {
  customCommand: {
    name: "dbe:group.unclaim",
    description: "Remove a reivindicação do território atual.",
    permissionLevel: oZ.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof p1) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return sH.unClaimLocation(sI, sK), { status: p0.Success };
    }
  },
};
import {
  CommandPermissionLevel as p3,
  CustomCommandParamType as p4,
  CustomCommandStatus as p5,
  Player as p6,
  system as p7,
} from "@minecraft/server";
var p8 = {
  customCommand: {
    name: "dbe:redeem",
    cheatsRequired: !1,
    description: "Resgata códigos especiais.",
    // o formato do código não tem segredo (qualquer um pode gerá-lo), então só operadores resgatam
    permissionLevel: p3.GameDirectors,
    mandatoryParameters: [{ name: "code", type: p4.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    p7.run(() => {
      sG instanceof p6 && hO(sG).redeem.redeemCode(sH);
    }),
    { status: p5.Success }
  ),
};
import { CommandPermissionLevel as p9, CustomCommandStatus as pb } from "@minecraft/server";
var pf = {
  customCommand: {
    name: "dbe:updatestats",
    cheatsRequired: !1,
    description: "Atualiza os atributos e estatísticas do jogador.",
    permissionLevel: p9.Any,
  },
  callback: ({ sourceEntity: sG }) => (sG && i3.getDBEEntity(sG)?.attributes.updateStats(), { status: pb.Success }),
};
function pj(sG) {
  sG.registerEnum("dbe:actionform", cj.getRegisteredFormIds()),
    sG.registerEnum("dbe:attribute", ["*", ...e8]),
    sG.registerEnum("dbe:color", fT.getAllOptionIds()),
    sG.registerEnum("dbe:customId", gT.getAllOptionIds()),
    sG.registerEnum(
      "dbe:modifier",
      l7.map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:quest", ["*", ...g5.getAllQuestData().map(({ id: sK }) => sK)]),
    sG.registerEnum(
      "dbe:race",
      fR.getAll().map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:region", [...l8.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:skill", ["*", ...l9.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:transformation", fO.getAllTransformationIds()),
    sG.registerEnum("dbe:value", ["alignment", "attribute_points", "mastery", "skill_points", "zeni", "level"]);
  let sH = [lq, lA, lH, lL, lR, nM, p8, lX, m2, m9, mp, my, mC, mI, mN, mU, n0, n5, nf, nv, nA, pf, nG],
    sI = [nR, nV, nZ, o8, oj, ox, oE, oK, oP, oT, oY, p2];
  for (let { customCommand: sK, callback: sL } of [...sH, ...sI]) sG.registerCommand(sK, sL);
}
lb.beforeEvents.startup.subscribe(({ customCommandRegistry: sG }) => pj(sG));
import { dialogues_data as pk } from "./data/dialogues_data.js";
import { system as pp } from "@minecraft/server";
jW.registerDialogue({
  id: "enma_daioh_main_menu",
  npcId: "dbe:enma_daioh",
  title: "ui.dbe.npc.enma_daioh.title",
  body: [
    { text: "ui.dbe.npc.enma_daioh.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
  ],
  buttons: [
    {
      buttonText: "ui.dbe.npc.enma_daioh.main.button.revive",
      onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("revive"),
    },
    { buttonText: "ui.dbe.npc.enma_daioh.main.button.reincarnate", nextDialogue: "confirm_reincarnate" },
  ],
  subMenus: [
    {
      id: "confirm_reincarnate",
      title: "ui.dbe.npc.enma_daioh.title",
      body: "ui.dbe.npc.enma_daioh.reincarnate.text",
      backButtonDialogue: "enma_daioh_main_menu",
      buttons: [
        {
          buttonText: "ui.dbe.npc.enma_daioh.reincarnate.button.confirm",
          onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("reincarnate"),
        },
      ],
    },
  ],
}),
  jW.registerDialogue({
    id: "goku_main_menu",
    npcId: "dbe:goku",
    title: "ui.dbe.npc.goku.title",
    body: [
      {
        text: "ui.dbe.npc.goku.main.text.master_bad_alignment",
        requirements: [
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 1 },
          { test: "is_alignment", value: "evil" },
        ],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_1",
        requirements: [{ test: "has_master", level: 1, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_2",
        requirements: [{ test: "has_master", level: 2, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_3",
        requirements: [{ test: "has_master", level: 3, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_4",
        requirements: [{ test: "has_master", level: 4, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_5",
        requirements: [{ test: "has_master", level: 5, value: "dbe:goku" }],
      },
      { text: "ui.dbe.npc.goku.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.goku.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.goku.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.goku.main.button.weight",
        nextDialogue: "weight",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 2 },
        ],
      },
      {
        buttonText: "ui.dbe.npc.goku.main.button.skills",
        nextDialogue: "goku_skills",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 3 },
        ],
      },
      {
        buttonText: "ui.dbe.mentor.main.button.invite",
        nextDialogue: "mentor_invite",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", operator: "!=", value: "dbe:goku" },
        ],
      },
    ],
    subMenus: [
      {
        id: "weight",
        title: "ui.dbe.npc.goku.title",
        body: "ui.dbe.weight.text",
        backButtonDialogue: "goku_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.goku.weight.button.catch",
            rewards: [{ type: "item", item: "dbe:training_shirt" }],
          },
        ],
      },
      { id: "goku_skills", backButtonDialogue: "goku_main_menu", type: "skills" },
      {
        id: "mentor_invite",
        title: "ui.dbe.npc.goku.title",
        backButtonDialogue: "goku_main_menu",
        type: "mentor_invite",
      },
    ],
  }),
  jW.registerDialogue({
    id: "kami_sama_main_menu",
    npcId: "dbe:kami_sama",
    title: "ui.dbe.npc.kami_sama.title",
    body: [
      { text: "ui.dbe.npc.kami_sama.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.cut_tail",
        nextDialogue: "cut_tail",
        requirements: [
          { test: "has_modifier", value: "saiyan_tail" },
          { test: "is_race", value: "saiyan" },
          { test: "is_alignment", operator: "!=", value: "evil" },
        ],
      },
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.skills",
        nextDialogue: "kami_sama_skills",
        requirements: [{ test: "is_alignment", operator: "!=", value: "evil" }],
      },
    ],
    subMenus: [
      {
        id: "cut_tail",
        title: "ui.dbe.npc.kami_sama.title",
        body: "ui.dbe.npc.kami_sama.cut_tail.text",
        backButtonDialogue: "kami_sama_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.kami_sama.cut_tail.button.confirm",
            onClick: (sG) => {
              hO(sG).removeTail(!0);
            },
          },
        ],
      },
      { id: "kami_sama_skills", backButtonDialogue: "kami_sama_main_menu", type: "skills" },
    ],
  });
function pv(sG) {
  jW.registerDialogue(sG);
}
function pw() {
  for (let sG of pk) pv(sG);
  pp.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:dialogue_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) pv(sL);
    }
  });
}
pw(),
  cY.register("dbe:future_trunks"),
  cY.register("dbe:hyperbolic_time_chamber"),
  cY.register("dbe:other_world"),
  cY.register("dbe:world_martial_arts_tournament");
import { entity_data as px } from "./data/entities_data.js";
import { system as py } from "@minecraft/server";
function pz() {
  for (let sG of px) fC.registerDBEEntityData(sG);
  py.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:entity_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) fC.registerDBEEntityData(sL);
    }
  });
}
pz();
import { system as pA } from "@minecraft/server";
import { Player as pB } from "@minecraft/server";
import { ItemStack as pC, system as pD, world as pE } from "@minecraft/server";
import { system as pF, world as pG } from "@minecraft/server";
var pH = class {
    constructor(sG) {
      this.dimension = sG;
    }
    onLoadCallbacks = new Set();
    *generate(sG) {
      if (!pJ.isGenerated(sG.id) && sG.isLoaded) {
        for (let sH of this.onLoadCallbacks)
          try {
            yield* sH(sG);
          } catch (sI) {
            console.error(sI);
          }
      }
    }
    onLoad(sG) {
      this.onLoadCallbacks.add(sG);
    }
  },
  pI = class {
    generatorMap = new Map();
    isGenerating = !1;
    queueMap = new Map();
    constructor() {
      every(30, "core.terrain_queue", () => { // G4
        let sG = new Set();
        for (let sH of this.generatorMap.values()) {
          let { dimension: sI } = sH;
          for (let sK of sH.dimension.getPlayers()) {
            let { location: sL } = sK,
              sM = aH.getChunkId(sI, sL);
            sG.has(sM) || (sG.add(sM), this.addToQueue(sH, sL));
          }
        }
      }, { phase: 17 });
    }
    register(sG) {
      let sH = this.getGenerator(sG);
      return sH || ((sH = new pH(sG)), this.generatorMap.set(sG.id, sH), sH);
    }
    getGenerator(sG) {
      return this.generatorMap.get(sG.id);
    }
    isGenerated(sG) {
      return !!pG.getDynamicProperty("generated:" + sG);
    }
    markChunkAsGenerated(sG) {
      return pG.setDynamicProperty("generated:" + sG, !0);
    }
    addToQueue(sG, sH) {
      let sI = aH.getNearbyChunks(sG.dimension, sH, 5);
      for (let sK of sI) {
        let { id: sL } = sK;
        !this.isGenerated(sL) && !this.queueMap.has(sL) && this.queueMap.set(sL, sG);
      }
      this.isGenerating || ((this.isGenerating = !0), pF.runJob(this.generateQueuedChunks()));
    }
    *generateQueuedChunks() {
      for (let [sG, sH] of this.queueMap) {
        let sI = aH.getChunkById(sG);
        yield* sH.generate(sI), this.queueMap.delete(sG);
      }
      this.queueMap.size ? pF.runJob(this.generateQueuedChunks()) : (this.isGenerating = !1);
    }
  },
  pJ = new pI(),
  pK = "dbe:angel_staff_dimension",
  pL = new bP(0.5, -63, 0.5),
  pM = class {
    startedDimensions = new Set();
    lastGrantedDimensionIndex = 0;
    constructor() {
      this.init();
    }
    async assignDimension(sG) {
      if (!this.getDimensionDataByOwner(sG)) {
        // só angel_staff_dimension_0..49 são registradas (init)
        if (this.lastGrantedDimensionIndex >= 49) {
          console.warn("[Dragon Universe] Sem dimensões Angel Staff livres para " + sG);
          return;
        }
        let sH = pK + "_" + ++this.lastGrantedDimensionIndex,
          sI = pE.getDimension(sH);
        await this.setup(sI),
          this.saveDimensionData({ id: sH }),
          bG(pE, "angel_staff_dimension_owners").set(sG, sH),
          bG(pE, "angel_staff_dimension").set("last_granted_dimension_index", this.lastGrantedDimensionIndex);
      }
    }
    async enterDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG,
          sL = pE.getDimension(sH);
        (sI.staffDimensionId = sK.dimension.id),
          (sI.staffLocation = sK.location),
          this.saveDimensionData(sI),
          sL &&
            (this.startedDimensions.has(sL.id) ||
              (this.startFloorGeneration(sL), this.startedDimensions.add(sL.id), await pD.waitTicks(20)),
            pD.run(() => {
              duTravel(sK, pL, { dimension: sL, label: "angel staff entry" });
            }));
      }
    }
    exitDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        pD.run(async () => {
          if (!sK.isValid) return;
          let dimension;
          try {
            if (typeof sI.staffDimensionId !== "string" || !sI.staffDimensionId)
              throw new Error("Saved angel staff return dimension is missing");
            dimension = pE.getDimension(duPhysicalDestinationId(sI.staffDimensionId));
          } catch (error) {
            duReportTravelFailure(sK, "angel staff saved destination", error);
            try { await duSafeReturnToEarth(sK, { label: "angel staff Earth fallback" }); }
            catch (fallbackError) { duReportTravelFailure(sK, "angel staff Earth fallback", fallbackError); }
            return;
          }
          await duTravel(sK, sI.staffLocation, { dimension, label: "angel staff return" });
        });
      }
    }
    getDimensionData(sG) {
      return bG(pE, "angel_staff_dimension").get(sG);
    }
    getDimensionDataByOwner(sG) {
      let sH = bG(pE, "angel_staff_dimension_owners").get(sG);
      return this.getDimensionData(sH);
    }
    isOwner(sG, sH) {
      return this.getDimensionDataByOwner(sG)?.id === sH;
    }
    saveDimensionData(sG) {
      bG(pE, "angel_staff_dimension").set(sG.id, sG);
    }
    switchDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        sK.dimension.id !== sI.id ? this.enterDimension(sG, sH) : this.exitDimension(sG, sH);
      }
    }
    init() {
      for (let sG = 0; sG < 50; sG++) cY.register(pK + "_" + sG);
      pD.run(() => {
        this.lastGrantedDimensionIndex = bG(pE, "angel_staff_dimension").get("last_granted_dimension_index") ?? 0;
      });
    }
    async setup(sG) {
      let sH = { x: 0, y: -64, z: 0 };
      let loadedArea = await duAcquireLoadedArea(sG, sH, pL, "angel staff setup");
      try {
        sG.setBlockType(sH, "minecraft:barrier");
        let sI = d4("dbe:angel_staff_entity", sG, pL);
        sI && sI.setDynamicProperty("dimension_id", sG.id);
      } finally {
        duReleaseLoadedArea(loadedArea);
      }
    }
    startFloorGeneration(sG) {
      pJ.register(sG).onLoad(function* (sH) {
        let { chunkOrigin: sI, dimension: sK } = sH,
          sL = -64;
        try {
          for (let sM = 0; sM < 16; sM++)
            for (let sN = 0; sN < 16; sN++)
              sK.setBlockType({ x: sI.x + sM, y: sL, z: sI.z + sN }, "minecraft:barrier"), yield;
          pJ.markChunkAsGenerated(sH.id);
        } catch {
          return;
        }
      });
    }
  },
  pN = new pM();
pE.afterEvents.playerDimensionChange.subscribe(({ fromDimension: sG, player: sH, toDimension: sI }) => {
  sG.id.startsWith(pK) && sH.runCommand("fog @s remove angel_staff_dimension"),
    sI.id.startsWith(pK) && sH.runCommand("fog @s push dbe:fog_angel_staff_dimension angel_staff_dimension");
}),
  pE.beforeEvents.playerInteractWithEntity.subscribe(({ player: sG, target: sH }) => {
    if (sH.typeId === "dbe:angel_staff_entity") {
      let sI = String(sH.getDynamicProperty("dimension_id"));
      if (pN.getDimensionData(sI)) {
        let { dimension: sK, isSneaking: sL } = sG,
          sM = pN.isOwner(sG.id, sI),
          sN = sK.id.startsWith(pK),
          sO = hO(sG);
        if (sM) {
          if (sL && !sN) {
            pD.run(() => {
              let { dimension: sP, location: sQ } = sH,
                sR = new pC("dbe:angel_staff");
              sP.spawnItem(sR, sQ), sH.remove();
            });
            return;
          }
          pN.switchDimension(sO, sI);
        } else sN && pN.exitDimension(sO, sI);
      }
    }
  });
var pO = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, source: sI }) {
      if (!sI.dimension.id.startsWith("dbe:angel_staff") && sI instanceof pB) {
        let sK = pN.getDimensionDataByOwner(sI.id);
        if (sK) {
          let sL = bO.add(bO.add(sG.location, aS.faceToVector(sH)), { x: 0.5, z: 0.5 }),
            sM = d4("dbe:angel_staff_entity", sG.dimension, sL);
          sM &&
            (sM.setDynamicProperty("dimension_id", sK.id), (sM.nameTag = "§w" + sI.name + "§r"), aQ.decrementStack(sI));
        }
      }
    }
  },
  pP = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL, single_use: sM } = sI,
          sN = sK.data.get("single_uses") ?? [];
        if (sM && sN.includes(sG.typeId)) return;
        for (let sO of Object.keys(sL)) sK.attributes.getAttribute(sO)?.addValue(sL[sO], !0);
        sN.push(sG.typeId), sK.data.set("single_uses", sN), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  },
  pQ = class {
    constructor() {
      this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity({ attackingEntity: sG, hitEntity: sH }) {
      let { dimension: sI, location: sK } = sH,
        sL = sI.getEntities({ location: sK, maxDistance: 3 });
      for (let sM of sL) {
        if (sM === sH || sM === sG) continue;
        let sN = bO.subtract(sM.location, sK),
          sO = bO.scale(sN, 0.9);
        sM.applyImpulse(sO);
      }
      sI.playSound("wind_charge.burst", sK), sI.spawnParticle("minecraft:wind_explosion_emitter", sK);
    }
  },
  pR = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL } = sK,
          { duration: sM, modifiers: sN } = sI;
        sL.modifiers.applyBuff(sG.typeId, sN ?? {}, sM ?? 1), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  };
import { Player as pS } from "@minecraft/server";
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
import { masters_data as pX } from "./data/masters_data.js";
function pY() {
  for (let sG of pX) g9.registerMaster(sG);
}
pY();
import { modifiers_data as pZ } from "./data/modifiers_data.js";
import { system as q0 } from "@minecraft/server";
var q1 = class {
    constructor() {
      dP.registerModifier(new dO("fusion", this.fusionModifier.bind(this))),
        dP.registerModifier(new dO("race", this.raceModifier.bind(this))),
        dP.registerModifier(new dO("skills", this.skillsModifier.bind(this))),
        dP.registerModifier(new dO("transformation", this.transformationModifier.bind(this)));
      for (let sG of pZ) this.createAndRegisterModifier(sG);
      q0.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
        if (sH === "dbe:modifier_registry") {
          let sK = JSON.parse(sI);
          for (let sL of sK) this.createAndRegisterModifier(sL);
        }
      });
    }
    fusionModifier(sG, sH) {
      if (sG instanceof hN) {
        let sI = sG.getCurrentFusion();
        if (sI) {
          for (let [sK, sL] of Object.entries(sI.getMultipliers())) sH.multiply(sK, sL);
        }
      }
    }
    raceModifier(sG, sH) {
      let { race: sI } = sG;
      sI && dN(sH, sI.multipliers, 1);
    }
    skillsModifier(sG, sH) {
      let sI = sG.skills.getSkillsByType("toggle");
      if (sI.length)
        for (let sK of sI) {
          let { isEnabled: sL, masteryMultiplier: sM, multipliers: sN } = sK;
          !sL || !sN || dN(sH, sN, sM);
        }
    }
    transformationModifier(sG, sH) {
      let { masteries: sI, transformations: sK } = sG,
        { currentTransformation: sL } = sK,
        { multipliers: sM } = sL,
        sN = sI.getMastery(sL.id)?.masteryMultiplier ?? 1;
      dN(sH, sM, sN);
    }
    createAndRegisterModifier(sG) {
      let sH = new dO(
        sG.id,
        (sI, sK) => {
          dN(sK, sG.multipliers, 1);
        },
        sG,
      );
      dP.registerModifier(sH);
    }
  },
  q2 = new q1();
import { challenge_quests_data as q3 } from "./data/challenge_quests_data.js";
import { main_quests_data as q4 } from "./data/main_quests_data.js";
import { side_quests_data as q5 } from "./data/side_quests_data.js";
import { system as q6 } from "@minecraft/server";
import { EntityTypes as q7 } from "@minecraft/server";
var q8 = class extends gA {
    rewardData;
    constructor(sG) {
      super(sG), (this.rewardData = sG);
    }
    get masterId() {
      return this.rewardData.masterId;
    }
    grantReward(sG) {
      let sH = sG.masterManager.getMaster(this.masterId);
      sH && sH.addFriendshipPoints(this.amount);
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.reward.friendship_points",
            with: {
              rawtext: [{ text: "" + this.amount }, { translate: String(q7.get(this.masterId)?.localizationKey) }],
            },
          },
        ],
      };
    }
    createRewardMessage() {
      return {
        translate: "reward.friendship_points",
        with: { rawtext: [{ text: "" + this.amount }, { translate: String(q7.get(this.masterId)?.localizationKey) }] },
      };
    }
  },
  q9 = class extends gA {
    rewardData;
    constructor(sG) {
      super(sG), (this.rewardData = sG);
    }
    get skillId() {
      return this.rewardData.skill;
    }
    grantReward(sG) {
      let { skills: sH } = sG;
      sH.tryLearnSkill(this.skillId);
    }
    createDescription() {
      return { rawtext: [{ translate: "skill." + this.skillId }] };
    }
  },
  qb = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get requiredProgress() {
      return this.taskData.amount;
    }
    createDescription() {
      return { rawtext: [{ translate: "quest.objective.battle_power", with: ["" + this.requiredProgress] }] };
    }
  };
bM.on("battle_power_changed", ({ dbeEntity: sG, newValue: sH }) => {
  if (sG instanceof hN) {
    for (let sI of sG.tasks.getActiveTasksByType("battle_power")) sI.setProgress(sH);
  }
});
import { EntityTypes as qf, ItemTypes as qj, system as qk, world as qp } from "@minecraft/server";
var qq = class extends gN {
  taskData;
  constructor(sG, sH, sI, sK) {
    super(sG, sH, sI, sK), (this.taskData = sI);
  }
  get autoComplete() {
    return this.deliverToNpc ? !1 : super.autoComplete;
  }
  get deliverToNpc() {
    return this.taskData.deliverToNpc;
  }
  get itemTypeId() {
    return this.taskData.item;
  }
  get removeItemsOnComplete() {
    return this.taskData.removeItemsOnComplete ?? !1;
  }
  get requiredProgress() {
    return this.taskData.count ?? 1;
  }
  getItemAmount() {
    let { player: sG } = this.dbePlayer,
      sH = sG.getComponent("minecraft:inventory"),
      sI = 0;
    if (sH) {
      let { container: sK } = sH;
      aQ.forEachFilledSlot(sK, (sL, sM) => {
        sM.typeId === this.itemTypeId && (sI += sM.amount);
      });
    }
    return sI;
  }
  get hasPaidNpcCost() {
    if (this.id !== "fetch_bulma_outfit.objective_1.task_1" || this.dbePlayer.quests.getCompletedQuestIds().includes("fetch_bulma_outfit")) return !1;
    const receipt = this.dbePlayer.data.get("bulma_staff_reward"), paid = receipt?.costPaid;
    return receipt?.quest === "fetch_bulma_outfit" && receipt.state === "pending" && !receipt.costReview &&
      receipt.token === this.dbePlayer.player.id + ":fetch_bulma_outfit" &&
      paid?.taskId === this.id && paid.item === this.itemTypeId && paid.count === this.requiredProgress && paid.npc === this.deliverToNpc;
  }
  completeNpcDelivery() {
    const { player } = this.dbePlayer;
    if (!player.isValid || i0.get(player.id) !== this.dbePlayer || !this.deliverToNpc || !this.isStarted || this.isCompleted) return !1;
    const staff = this.id === "fetch_bulma_outfit.objective_1.task_1";
    let container, changes, before, costPersisted = false;
    try {
      if (this.npcDeliveryCostUncertain || (staff && this.dbePlayer.data.get("bulma_staff_reward")?.costReview)) {
        if (staff) this.dbePlayer.notifyBulmaStaff("review");
        return !1;
      }
      if (this.hasPaidNpcCost) {
        this.npcDeliveryPaid = !0;
        this.completeTask();
        return this.isCompleted;
      }
      before = this.getItemAmount();
      this.setProgress(before);
      if (!this.isGoalReached) return !1;
      if (staff && !this.dbePlayer.prepareBulmaStaffReward()) return !1;
      if (this.removeItemsOnComplete) {
        container = player.getComponent("minecraft:inventory")?.container;
        if (!container || !Number.isInteger(this.requiredProgress) || this.requiredProgress < 1) throw new Error("NPC delivery inventory or required amount is invalid");
        let remaining = this.requiredProgress;
        const planned = [];
        for (let slot = 0; slot < container.size && remaining; slot++) {
          const item = container.getItem(slot);
          if (item?.typeId !== this.itemTypeId) continue;
          const amount = Math.min(remaining, item.amount), after = item.amount > amount ? item.clone() : undefined;
          if (after) after.amount -= amount;
          planned.push({ slot, before: item, after });
          remaining -= amount;
        }
        if (remaining) throw new Error("NPC delivery no longer has the required items");
        if (staff) {
          const receipt = this.dbePlayer.data.get("bulma_staff_reward");
          // Keep reconnect blocked if both inventory rollback and later receipt saves fail.
          this.dbePlayer.persistBulmaStaffReceipt({ ...receipt, costReview: { taskId: this.id, item: this.itemTypeId, count: this.requiredProgress, npc: this.deliverToNpc, before } });
        }
        changes = planned;
        for (const change of changes) container.setItem(change.slot, change.after);
        if (this.getItemAmount() !== before - this.requiredProgress) throw new Error("NPC delivery consumption was not confirmed");
        if (staff) {
          const { costReview, ...receipt } = this.dbePlayer.data.get("bulma_staff_reward");
          this.dbePlayer.persistBulmaStaffReceipt({ ...receipt, costPaid: { taskId: this.id, item: this.itemTypeId, count: this.requiredProgress, npc: this.deliverToNpc } });
          costPersisted = !0;
        }
        this.npcDeliveryPaid = !0;
      }
      this.completeTask();
      return this.isCompleted;
    } catch (error) {
      if (changes && !costPersisted && !this.isCompleted) {
        try {
          for (const change of changes) container.setItem(change.slot, change.before);
          if (this.getItemAmount() !== before) throw new Error("NPC delivery inventory restoration was not confirmed");
          if (staff) {
            const { costReview, ...receipt } = this.dbePlayer.data.get("bulma_staff_reward");
            this.dbePlayer.persistBulmaStaffReceipt(receipt);
          }
        } catch (rollback) {
          this.npcDeliveryCostUncertain = !0;
          if (staff) {
            try {
              const receipt = this.dbePlayer.data.get("bulma_staff_reward");
              this.dbePlayer.persistBulmaStaffReceipt({ ...receipt, costReview: { taskId: this.id, item: this.itemTypeId, count: this.requiredProgress, npc: this.deliverToNpc, before } });
            } catch (storage) { console.warn("[Dragon Universe] Uncertain NPC delivery cost could not be persisted: " + (storage?.stack ?? storage)); }
          }
          console.warn("[Dragon Universe] NPC delivery cost rollback uncertain: " + (rollback?.stack ?? rollback));
        }
      }
      console.warn("[Dragon Universe] NPC delivery failed: " + (error?.stack ?? error));
      return !1;
    } finally { this.npcDeliveryPaid = !1; }
  }
  onComplete() {
    this.removeItemsOnComplete && !this.npcDeliveryPaid &&
      qk.run(() => {
        let { player: sG } = this.dbePlayer;
        if (!sG.isValid || i0.get(sG.id) !== this.dbePlayer || !this.isCompleted) return;
        try { sG.runCommand("clear @s " + this.itemTypeId + " 0 " + this.requiredProgress); }
        catch (error) { console.warn("[Dragon Universe] Quest item consumption failed: " + (error?.stack ?? error)); }
      });
  }
  onStart() {
    this.setProgress(this.getItemAmount());
  }
  createDescription() {
    let { deliverToNpc: sG } = this;
    return {
      rawtext: [
        {
          translate: sG ? "quest.objective.deliver_item" : "quest.objective.collect_item",
          with: {
            rawtext: [
              { translate: qj.get(this.itemTypeId)?.localizationKey },
              sG ? { translate: qf.get(sG)?.localizationKey } : {},
            ],
          },
        },
      ],
    };
  }
};
qp.afterEvents.playerInventoryItemChange.subscribe(({ player: sG }) => {
  let { tasks: sH } = hO(sG);
  for (let sI of sH.getActiveTasksByType("collect_item"))
    if (!sI.isCompleted) {
      let sK = sI.getItemAmount();
      sI.setProgress(sK);
    }
});
var qv = class extends gN {
  taskData;
  constructor(sG, sH, sI, sK) {
    super(sG, sH, sI, sK), (this.taskData = sI);
  }
  get requiredProgress() {
    return this.taskData.amount;
  }
};
import { world as qw } from "@minecraft/server";
var qx = new Map(),
  qy = class extends gN {
    taskData;
    description;
    biomeLocation;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
      let sL = qw.getDimension(duPhysicalDestinationId(sI.dimensionId));
      if (((this.biomeLocation = qx.get(this.biomeId)), !this.biomeLocation)) {
        let sM = qw.getDefaultSpawnLocation();
        (sM.y = 0),
          (this.biomeLocation = sL.calculateClosestBiomeFromSeed(sM, duPhysicalDestinationId(this.biomeId))),
          this.biomeLocation &&
            qx.set(this.biomeId, {
              dimension: sL,
              x: this.biomeLocation.x,
              y: this.biomeLocation.y,
              z: this.biomeLocation.z,
            });
      }
      this.description = this.createDescription();
    }
    get biomeId() {
      return this.taskData.biomeId;
    }
    get dimensionId() {
      return this.taskData.dimensionId;
    }
    isValid() {
      return !!this.biomeLocation;
    }
    updateProgress() {
      !this.isCompleted && this.isInAllowedBiome() && this.completeTask();
    }
    createDescription() {
      if (this.dimensionId.startsWith("dbe:")) {
        return {
          rawtext: [
            {
              translate: "quest.objective.travel_to",
              with: { rawtext: [{ translate: "dimension." + this.dimensionId }] },
            },
          ],
        };
      }
      return {
        rawtext: [
          {
            translate: "quest.objective.enter_biome",
            with: {
              rawtext: [
                { translate: "biome." + this.biomeId },
                { translate: "dimension." + this.dimensionId },
                { translate: "X: " + this.biomeLocation?.x + " Z: " + this.biomeLocation?.z },
              ],
            },
          },
        ],
      };
    }
    isInAllowedBiome() {
      let { dimension: sG, location: sH } = this.dbePlayer.player;
      return sG.id === duPhysicalDestinationId(this.dimensionId) && sG.isChunkLoaded(sH) &&
        sG.getBiome(sH).id === duPhysicalDestinationId(this.biomeId) ? !eO(sG).isBlockProtection(sH) : !1;
    }
  };
import { LocationWaypoint as qz, system as qA } from "@minecraft/server";
var qB = new Map(),
  qC = class extends gN {
    taskData;
    region;
    waypoint;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
      let sL = eP.findRegion(this.regionId);
      if (!sL)
        throw new Error(
          "A tarefa '" + sH + "' faz referência à região '" + sI.region + "', mas ela não foi encontrada.",
        );
      (this.region = sL), (this.waypoint = this.createWaypoint()), this.isStarted && this.addWaypoint();
    }
    get regionId() {
      return this.taskData.region;
    }
    onStart() {
      let { dimension: sG, location: sH } = this.dbePlayer.player;
      this.addWaypoint(), this.region.isInside(sG, sH) && this.completeTask();
    }
    onStop() {
      qA.run(() => {
        let { locatorBar: sG } = this.dbePlayer.player;
        sG.hasWaypoint(this.waypoint) && sG.removeWaypoint(this.waypoint);
      });
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.objective.enter_region",
            with: { rawtext: [{ translate: "region." + this.regionId + ".name" }] },
          },
        ],
      };
    }
    addWaypoint() {
      if (this.waypoint.isValid) {
        let { locatorBar: sG } = this.dbePlayer.player;
        if (!sG.hasWaypoint(this.waypoint))
          try {
            sG.addWaypoint(this.waypoint);
          } catch (sH) {
            console.warn(this.dbePlayer.player.name + ":" + this.id + ":" + sH);
          }
      }
    }
    createWaypoint() {
      let sG = qB.get(this.localizationKey);
      if (!sG) {
        let sH = {
            textureBoundsList: [
              {
                lowerBound: 0,
                texture: {
                  path: this.taskData.waypointTexture ?? "textures/particle/dragon_ball_warn",
                  iconHeight: 1,
                  iconWidth: 1,
                },
              },
            ],
          },
          sI = new qz(
            {
              dimension: this.region.dimension,
              x: this.region.spawnPoint.x,
              y: this.region.spawnPoint.y,
              z: this.region.spawnPoint.z,
            },
            sH,
          );
        return qB.set(this.localizationKey, sI), sI;
      }
      return sG;
    }
  };
bM.on("entity_enter_region", ({ entity: sG }) => {
  let sH = i3.getDBEEntity(sG);
  if (sH instanceof hN) {
    let { tasks: sI } = sH,
      { dimension: sK, location: sL } = sG;
    for (let sM of sI.getActiveTasksByType("enter_region")) sM.region.isInside(sK, sL) && sM.completeTask();
  }
});
var qD = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get requiredProgress() {
      return this.taskData.amount;
    }
  },
  qE = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get skillId() {
      return this.taskData.skill;
    }
    isValid() {
      return cG.has(this.skillId);
    }
    onStart() {
      let { skills: sG } = this.dbePlayer;
      sG.hasSkill(this.skillId) && this.completeTask();
    }
    createDescription() {
      return {
        rawtext: [
          { translate: "quest.objective.learn_skill", with: { rawtext: [{ translate: "skill." + this.skillId }] } },
        ],
      };
    }
  };
bM.on("skill_unlocked", ({ dbeEntity: sG, skill: sH }) => {
  if (sG instanceof hN) {
    let { tasks: sI } = sG;
    for (let sK of sI.getActiveTasksByType("learn_skill")) sH.id === sK.skillId && sK.completeTask();
  }
});
var qF = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    updateProgress() {
      dC.test(this.dbePlayer, this.taskData.requirement) && this.completeTask();
    }
    createDescription() {
      return { rawtext: [dC.getDescription(this.taskData.requirement)] };
    }
  },
  qG = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get raceId() {
      return this.taskData.race;
    }
    get transformationId() {
      return this.taskData.transformation;
    }
    onStart() {
      let { transformations: sG } = this.dbePlayer;
      sG.isTransformationAvailable(this.transformationId) && this.completeTask();
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.objective.unlock_transformation",
            with: { rawtext: [{ translate: this.raceId + ".transformation." + this.transformationId }] },
          },
        ],
      };
    }
  };
bM.on("transformation_unlocked", ({ dbeEntity: sG, transformation: sH }) => {
  if (sG instanceof hN) {
    for (let sI of sG.tasks.getActiveTasksByType("unlock_transformation"))
      sI.transformationId === sH.id && sI.completeTask();
  }
});
import { ItemTypes as qH } from "@minecraft/server";
var qI = class extends gN {
    taskData;
    constructor(sG, sH, sI, sK) {
      super(sG, sH, sI, sK), (this.taskData = sI);
    }
    get itemTypeId() {
      return this.taskData.item;
    }
    get startError() {
      return this.usingTrainingWeight() ? void 0 : "TrainingWeight";
    }
    updateProgress() {
      this.usingTrainingWeight() ? this.isCompleted || this.setProgress(1) : this.fail();
    }
    createDescription() {
      return {
        rawtext: [
          {
            translate: "quest.objective.use_training_weight",
            with: { rawtext: [{ translate: qH.get(this.itemTypeId)?.localizationKey }] },
          },
        ],
      };
    }
    usingTrainingWeight() {
      return this.dbePlayer.getTrainingWeight()?.typeId === this.itemTypeId;
    }
  },
  qJ = class extends gA {
    constructor(sG) {
      super(sG);
    }
    grantReward(sG) {
      sG.player.addTag("dbe_alignment_question");
    }
  },
  qK = class extends gA {
    rewardData;
    constructor(sG) {
      super(sG), (this.rewardData = sG);
    }
    get questId() {
      return this.rewardData.quest;
    }
    grantReward(sG) {
      sG.quests.addQuest(this.questId);
    }
  };
import { ItemStack as qL } from "@minecraft/server";
var qM = class extends gA {
    rewardData;
    constructor(sG) {
      super(sG), (this.rewardData = sG);
    }
    get itemTypeId() {
      return this.rewardData.item;
    }
    grantReward(sG, options = {}) {
      let { player: sH } = sG,
        sI = new qL(this.itemTypeId, this.amount),
        sK = ["§r§9" + sH.name],
        sL = sH.getComponent("inventory")?.container;
      sI.setLore(sK);
      if (options.token) sI.setDynamicProperty("dbe:quest_reward", options.token);
      if (options.inventoryOnly) return !!sL && !sL.addItem(sI);
      const remainder = sL?.addItem(sI) ?? (!sL ? sI : undefined);
      if (remainder) sH.dimension.spawnItem(remainder, sH.location);
      return !0;
    }
    createDescription() {
      return { rawtext: [{ text: this.amount + "x " }, { translate: new qL(this.itemTypeId).localizationKey }] };
    }
  },
  qN = class extends gA {
    constructor(sG) {
      super(sG);
    }
    grantReward(sG) {
      let { zeni: sH } = sG;
      sH.addValue(this.amount);
    }
    createDescription() {
      return { rawtext: [{ translate: "quest.reward.zeni", with: ["" + this.amount] }] };
    }
    createRewardMessage() {
      return { translate: "reward.zeni", with: ["" + this.amount] };
    }
  },
  qO = class extends gA {
    constructor(sG) {
      super(sG);
    }
    grantReward(sG) {
      let { level: sH } = sG;
      sH.addPoints(this.amount);
    }
    createDescription() {
      return { rawtext: [{ translate: "quest.reward.z_points", with: ["" + this.amount] }] };
    }
    createRewardMessage() {
      return { translate: "reward.z_points", with: ["" + this.amount] };
    }
  };
bindLate("qM", () => qM); // O4.0: ligação tardia
function qP() {
  gO.register("battle_power", qb),
    gO.register("collect_item", qq),
    gO.register("consume_ki", qv),
    gO.register("defeat_enemy", h3),
    gO.register("enter_biome", qy),
    gO.register("enter_region", qC),
    gO.register("interact_npc", gQ),
    gO.register("ki_charge", qD),
    gO.register("learn_skill", qE),
    gO.register("requirement", qF),
    gO.register("unlock_transformation", qG),
    gO.register("use_training_weight", qI),
    gB.register("alignment_question", qJ),
    gB.register("friendship_points", q8),
    gB.register("give_quest", qK),
    gB.register("item", qM),
    gB.register("points", hD),
    gB.register("skill", q9),
    gB.register("zeni", qN),
    gB.register("z_points", qO),
    gB.register(
      "race",
      class extends gA {
        grantReward(sG) {
          sG.setRace(this.rewardData.race);
        }
        createDescription() {
          return { rawtext: [{ text: "Race: " + this.rewardData.race }] };
        }
        createRewardMessage() {
          return { rawtext: [{ text: "\u00a7bYou are now an Android!" }] };
        }
      },
    );
  let sG = [...q3, ...q4, ...q5];
  for (let sH of sG) g5.registerQuestData(sH);
  q6.afterEvents.scriptEventReceive.subscribe(({ id: sI, message: sK }) => {
    if (sI === "dbe:quest_registry") {
      let sL = JSON.parse(sK);
      for (let sM of sL) g5.registerQuestData(sM);
    }
  });
}
qP();
function duHandleStaffRecovery({ id, message, sourceEntity }) {
  if (id !== "dbe:bulma_staff_recovery" || sourceEntity?.typeId !== "minecraft:player") return;
  try {
    if (message === "claim") { hO(sourceEntity).claimBulmaStaffReward(); return; }
    if (!Number.isInteger(sourceEntity.commandPermissionLevel) || sourceEntity.commandPermissionLevel < 1 || !message.startsWith("reviewed "))
      throw new Error("Staff legacy recovery requires an operator and reviewed <exact online player name>");
    const target = o.getAllPlayers().find(player => player.name === message.slice(9).trim());
    if (!target?.isValid) throw new Error("Staff recovery target is not online");
    const wrapper = hO(target), receipt = wrapper.data.get("bulma_staff_reward");
    if (receipt?.costReview) {
      const review = receipt.costReview, quest = wrapper.quests.questsMap.get("fetch_bulma_outfit"), defined = quest?.getDefinedObjectives();
      const tasks = quest?.getAllTasks(), task = tasks?.length === 1 ? tasks[0] : undefined;
      if (receipt.quest !== "fetch_bulma_outfit" || receipt.state !== "pending" || receipt.token !== target.id + ":fetch_bulma_outfit" ||
          !quest?.isStarted || quest._isCompleted || !defined?.length || quest.getAllObjectives().length !== defined.length ||
          wrapper.quests.getCompletedQuestIds().includes("fetch_bulma_outfit") || !task?.isStarted || task.isCompleted ||
          task.id !== "fetch_bulma_outfit.objective_1.task_1" || review.taskId !== task.id ||
          review.item !== task.itemTypeId || review.count !== task.requiredProgress || review.npc !== task.deliverToNpc ||
          !Number.isInteger(review.before) || review.before < task.requiredProgress || task.getItemAmount() < review.before)
        throw new Error("Uncertain NPC delivery requires the exact active loaded task and operator-restored input inventory");
      const { costReview, costPaid, ...restored } = receipt;
      wrapper.persistBulmaStaffReceipt(restored);
      task.npcDeliveryCostUncertain = !1;
      wrapper.notifyBulmaStaff("pending");
      return;
    }
    if (!wrapper.quests.getCompletedQuestIds().includes("fetch_bulma_outfit")) throw new Error("Staff recovery requires the completed Bulma outfit quest");
    if (receipt && receipt.state !== "delivering") throw new Error("Staff reward already has a receipt; use its normal claim path");
    const container = target.getComponent("inventory")?.container;
    if (!container) throw new Error("Staff recovery inventory is unavailable");
    for (let slot = 0; slot < container.size; slot++) if (container.getItem(slot)?.typeId === "dbe:power_pole")
      throw new Error("Staff already exists in the target inventory; no recovery was granted");
    if (receipt) wrapper.persistBulmaStaffReceipt({ ...receipt, state: "pending" });
    else if (!wrapper.prepareBulmaStaffReward()) return;
    wrapper.claimBulmaStaffReward();
  } catch (error) {
    console.warn("[Dragon Universe] Staff recovery refused: " + (error?.stack ?? error));
    try { if (sourceEntity.isValid) sourceEntity.sendMessage({ translate: "dbe.quest.staff.failed" }); } catch {}
  }
}
// Consulta do registro de chefes, para teste: /scriptevent dbe:bosses (o próprio jogador). Mesma inscrição do recovery.
function duHandleBossQuery({ id, sourceEntity }) {
  if (id !== "dbe:bosses" || sourceEntity?.typeId !== "minecraft:player") return;
  const defeated = duListDefeated(hO(sourceEntity)),
    names = defeated.flatMap((b, k) => [...(k ? [{ text: ", " }] : []), { translate: "entity." + b.id + ".name" }, ...(b.wins > 1 ? [{ text: " x" + b.wins }] : [])]);
  sourceEntity.sendMessage({ rawtext: [{ text: "§e[bosses] " + defeated.length + "/" + DU_BOSS_IDS.length + ":§r " }, ...names] });
  console.warn("[bosses] " + sourceEntity.name + " " + defeated.length + "/" + DU_BOSS_IDS.length + ": " + defeated.map((b) => b.id + "=" + b.wins).join(" "));
}
q6.afterEvents.scriptEventReceive.subscribe((event) => {
  duHandleStaffRecovery(event);
  duHandleBossQuery(event);
});
var qQ = {
  "dbe:angel_staff": 1,
  "dbe:z_sword": 1,
  "dbe:scouter": 1,
  "dbe:frieza_pod": 1,
  "dbe:hakaishin_boots": 1,
  "dbe:hakaishin_chestplate": 1,
  "dbe:hakaishin_leggings": 1,
  "dbe:baby_armor_chestplate": 1,
  "dbe:baby_armor_leggings": 1,
  "dbe:baby_armor_boots": 1,
  "dbe:beat_chestplate": 1,
  "dbe:beat_leggings": 1,
  "dbe:beat_boots": 1,
  "dbe:xeno_goku_black_mask": 1,
  "dbe:xeno_goku_black_shirt": 1,
  "dbe:xeno_goku_black_leggings": 1,
  "dbe:xeno_goku_black_boots": 1,
  "dbe:divine_halo": 1,
  "dbe:power_fruit": 1,
  "dbe:senzu_bean": 16,
  "dbe:cooked_dinosaur_meat": 64,
  "dbe:angel_clothes": 1,
  "dbe:angel_halo": 1,
  "dbe:angel_chestplate": 1,
  "dbe:angel_leggings": 1,
  "dbe:angel_boots": 1,
};
aM.isChristmas && (qQ["dbe:christmas_costume"] = 1),
  gx.register({
    codeId: "creator",
    onActivate: (sG) => {
      fG.addRoleToPlayer(sG, "creator"), sG.redeem.activateRedeem("patreon");
    },
  }),
  gx.register({
    codeId: "patreon",
    items: qQ,
    onActivate: (sG) => {
      sG.redeem.hasCode("patron") || (fG.addRoleToPlayer(sG, "patreon"), pN.assignDimension(sG.player.id));
    },
  }),
  gx.register({
    codeId: "beta",
    onActivate: (sG) => {
      fG.addRoleToPlayer(sG, "beta");
    },
  }),
  gx.register({
    codeId: "patron",
    onActivate: (sG) => {
      sG.redeem.hasCode("patreon") || sG.redeem.activateRedeem("patreon");
    },
  }),
  gx.register({
    codeId: "kit_legendary",
    items: { "dbe:broly_battle_chestplate": 1, "dbe:broly_battle_leggings": 1, "dbe:broly_battle_boots": 1 },
    onActivate: (sG) => {
      sG.skills.addSkill("legendary");
    },
  }),
  gx.register({
    codeId: "kit_capsule_corp",
    items: {
      "dbe:trunks_chestplate": 1,
      "dbe:trunks_leggings": 1,
      "dbe:trunks_boots": 1,
      "dbe:dragon_radar": 1,
      "dbe:blue_hoi_poi_capsule": 1,
      "dbe:green_hoi_poi_capsule": 1,
      "dbe:purple_hoi_poi_capsule": 1,
      "dbe:red_hoi_poi_capsule": 1,
      "dbe:yellow_hoi_poi_capsule": 1,
    },
    onActivate: (sG) => {
      sG.zeni.addValue(500);
    },
  });
import { regionsData as qR } from "./data/regions_data.js";
import { system as qS, world as qT } from "@minecraft/server";
import { BlockVolume as qU, Player as qV, world as qW } from "@minecraft/server";
var qX = new Array(512),
  qY = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
    21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
    237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
    111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
    73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
    189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
    144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
    204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
    66, 215, 61, 156, 180,
  ];
for (let t9 = 0; t9 < 256; t9++) qX[256 + t9] = qX[t9] = qY[t9];
function qZ(sG) {
  return sG * sG * sG * (sG * (sG * 6 - 15) + 10);
}
function r0(sG, sH, sI) {
  return sH + sG * (sI - sH);
}
function r1(sG, sH, sI, sK) {
  let sL = sG & 15,
    sM = sL < 8 ? sH : sI,
    sN = sL < 4 ? sI : sL === 12 || sL === 14 ? sH : sK;
  return ((sL & 1) === 0 ? sM : -sM) + ((sL & 2) === 0 ? sN : -sN);
}
function r2(sG, sH, sI) {
  let sK = Math.floor(sG) & 255,
    sL = Math.floor(sH) & 255,
    sM = Math.floor(sI) & 255;
  (sG -= Math.floor(sG)), (sH -= Math.floor(sH)), (sI -= Math.floor(sI));
  let sN = qZ(sG),
    sO = qZ(sH),
    sP = qZ(sI),
    sQ = qX[sK] + sL,
    sR = qX[sQ] + sM,
    sS = qX[sQ + 1] + sM,
    sT = qX[sK + 1] + sL,
    sU = qX[sT] + sM,
    t1 = qX[sT + 1] + sM;
  return r0(
    sP,
    r0(
      sO,
      r0(sN, r1(qX[sR], sG, sH, sI), r1(qX[sU], sG - 1, sH, sI)),
      r0(sN, r1(qX[sS], sG, sH - 1, sI), r1(qX[t1], sG - 1, sH - 1, sI)),
    ),
    r0(
      sO,
      r0(sN, r1(qX[sR + 1], sG, sH, sI - 1), r1(qX[sU + 1], sG - 1, sH, sI - 1)),
      r0(sN, r1(qX[sS + 1], sG, sH - 1, sI - 1), r1(qX[t1 + 1], sG - 1, sH - 1, sI - 1)),
    ),
  );
}
function r6() {
  initializeFutureTerrain(r2);
}
r6();
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "future_trunks" &&
    sG instanceof qV &&
    (sG.removeTag("dbe_join_future_trunks"), sG.runCommand("fog @s push dbe:fog_future_trunks future_trunks"));
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "future_trunks" &&
      sG instanceof qV &&
      (sH.dimension === sG.dimension ? sH.teleportToRegion(sG) : sG.runCommand("fog @s remove future_trunks"));
  }),
  bM.on("region_load", async ({ region: sG }) => {
    if (sG.id === "future_trunks") {
      if (!qW.getDynamicProperty("futureTrunksCityLoaded")) {
        try {
          await prepareFutureCity(sG.dimension, () => qW.structureManager.placeJigsawStructure(
            "dbe:city", sG.dimension, new bP(-31, 49, -22), { ignoreStartHeight: !0 }));
        } catch (error) {
          console.warn("[Future] city initialization deferred; existing blocks/flags preserved: " + (error?.stack ?? error));
        }
      }
      r6();
    }
  });
import { Player as r7 } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "hyperbolic_time_chamber_exit_door" &&
    sG instanceof r7 &&
    eO(b5.dimensions.overworld).getRegion("hyperbolic_time_chamber_join_door")?.teleportToRegion(sG);
});
import { Player as r8, world as r9 } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  if (sH.id === "hyperbolic_time_chamber_join_door" && sG instanceof r8) {
    let sI = r9.getDimension("dbe:hyperbolic_time_chamber");
    eO(sI).getRegion("hyperbolic_time_chamber")?.teleportToRegion(sG);
  }
});
import { world as rb } from "@minecraft/server";
import { system as rf, world as rj } from "@minecraft/server";
// Measured from the shipped NBT files; the regression check validates every size against its asset.
var rk = {
    "dbe:hyperbolic_time_chamber": { x: 57, y: 17, z: 33 },
    king_kai_planet: { x: 71, y: 52, z: 57 },
    "dbe:lookout": { x: 63, y: 101, z: 63 },
    "dbe:enma_daioh_palace_front": { x: 63, y: 22, z: 64 },
    "dbe:enma_daioh_palace_back": { x: 63, y: 22, z: 20 },
    Torneio_de_artes_marciais_mundial: { x: 64, y: 64, z: 64 },
    snake_path_end: { x: 5, y: 4, z: 7 },
    snake_path_1: { x: 25, y: 7, z: 64 },
    snake_path_2: { x: 25, y: 4, z: 64 },
    snake_path_3: { x: 25, y: 7, z: 64 },
    snake_path_4: { x: 25, y: 4, z: 64 },
    snake_path_start: { x: 25, y: 9, z: 64 },
  },
  rp = class {
    loadedStructureIds;
    placingStructureIds;
    queueSet = new Map();
    isLoading = !1;
    clearedLegacyAreas = new Set();
    retryRun;
    constructor() {
      this.ready = new Promise((resolve, reject) => rf.run(() => {
        try {
          const saved = bG(rj, "structures");
          const previousLoaded = saved.get("loaded"), previousPlacing = saved.get("placing");
          const loaded = previousLoaded === undefined ? [] : previousLoaded;
          const placing = previousPlacing === undefined ? [] : previousPlacing;
          if (![loaded, placing].every(list => Array.isArray(list) && list.every(id => typeof id === "string")))
            throw new Error("Invalid saved structure metadata; no structures will be replaced");
          this.loadedStructureIds = loaded;
          this.placingStructureIds = placing;
          resolve();
        } catch (error) { reject(error); }
      }));
      this.ready.catch(error => console.warn("[Structures] saved metadata: " + (error.stack ?? error)));
    }
    addToQueue(sG, sH) {
      this.queueSet.set(sG, sH);
      this.loadAllAsync().catch(error => console.warn("[Structures] queue: " + (error.stack ?? error)));
    }
    hasLoaded(sG) {
      return this.loadedStructureIds ? this.loadedStructureIds.includes(sG) : !1;
    }
    async loadAllAsync() {
      if (this.isLoading) return;
      this.isLoading = !0;
      let ready = false;
      try {
        await this.ready;
        ready = true;
        for (const [id, placement] of [...this.queueSet]) {
          try {
            await this.loadAsync(id, placement);
            this.queueSet.delete(id);
          } catch (error) {
            // Bedrock stacks carry only the frames, so log the message too.
            console.warn("[Structures] " + id + ": " + String(error) + (error?.stack ? "\n" + error.stack : ""));
            if (error?.stage !== "loading") this.queueSet.delete(id);
          }
        }
      } finally {
        this.isLoading = !1;
        if (ready && this.queueSet.size && this.retryRun === undefined) {
          this.retryRun = rf.runTimeout(() => {
            this.retryRun = undefined;
            this.loadAllAsync().catch(error => console.warn("[Structures] retry: " + (error.stack ?? error)));
          }, 100);
        }
      }
    }
    async loadAsync(sG, sH) {
      await this.ready;
      if (!this.clearedLegacyAreas.has(sG)) {
        // These exact names were owned by the old structure loader, never by the new shared leases.
        try { rj.tickingAreaManager.removeTickingArea(sG); } catch {}
        this.clearedLegacyAreas.add(sG);
      }
      if (this.hasLoaded(sG)) return;
      // Still marked as placing: the world closed before markLoaded. Only the Snake Way pieces are resumed (a fixed
      // .mcstructure in the Other World sky places the same blocks again); every other structure keeps its blocks.
      const resumed = this.placingStructureIds.includes(sG);
      if (resumed && !sG.startsWith("snake_path_"))
        throw new Error("Structure placement was interrupted: " + sG + "; inspect a world copy before retrying. Existing blocks were preserved");
      if (resumed) console.warn("[Structures] " + sG + ": placement was interrupted in a previous session; placing it again");
      const { dimension, location, structureId } = sH, size = rk[structureId];
      if (!size || ![location.x, location.y, location.z].every(Number.isInteger))
        throw new Error("Unknown structure bounds or invalid origin: " + structureId);
      const end = { x: location.x + size.x - 1, y: location.y + size.y - 1, z: location.z + size.z - 1 };
      const area = await duAcquireLoadedArea(dimension, location, end, "structure " + sG);
      try {
        if (!resumed) {
          const placing = [...this.placingStructureIds, sG];
          bG(rj, "structures").set("placing", placing);
          this.placingStructureIds = placing;
        }
        try {
          if (structureId === "dbe:lookout" && !rj.getDynamicProperty("lookoutLoaded")) {
            dimension.fillBlocks(new ry(
              { x: rx.lookoutLocation.x, y: -64, z: rx.lookoutLocation.z },
              { x: rx.lookoutLocation.x, y: 218, z: rx.lookoutLocation.z }), "minecraft:smooth_quartz");
            rj.setDynamicProperty("lookoutLoaded", !0);
          }
          rj.structureManager.place(structureId, dimension, location);
        } catch (error) {
          // An exception ends the attempt: leave placing so the next region load can try again.
          this.clearPlacing(sG);
          throw error;
        }
        await rf.waitTicks(20);
        this.markLoaded(sG);
      } finally {
        duReleaseLoadedArea(area);
      }
    }
    markLoaded(sG) {
      const saved = bG(rj, "structures"), loaded = [...this.loadedStructureIds, sG];
      saved.set("loaded", loaded);
      this.loadedStructureIds = loaded;
      this.clearPlacing(sG);
    }
    clearPlacing(sG) {
      const placing = this.placingStructureIds.filter(id => id !== sG);
      bG(rj, "structures").set("placing", placing);
      this.placingStructureIds = placing;
    }
  },
  rq = new rp();
function rv() {
  let sG = rb.getDimension("dbe:hyperbolic_time_chamber");
  pJ.register(sG).onLoad(function* (sH) {
    let { chunkOrigin: sI, dimension: sK } = sH,
      sL = -64;
    try {
      for (let sM = 0; sM < 16; sM++)
        for (let sN = 0; sN < 16; sN++)
          sK.setBlockType({ x: sI.x + sM, y: sL, z: sI.z + sN }, "minecraft:bedrock"),
            sK.setBlockType({ x: sI.x + sM, y: sL + 1, z: sI.z + sN }, "dbe:white_tile"),
            yield;
      pJ.markChunkAsGenerated(sH.id);
    } catch {
      return;
    }
  });
}
bM.on("region_load", async ({ region: sG }) => {
  sG.id === "hyperbolic_time_chamber" &&
    (rq.addToQueue("hyperbolic_time_chamber", {
      dimension: sG.dimension,
      location: new bP(-28, -62, -12),
      structureId: "dbe:hyperbolic_time_chamber",
    }),
    rv());
}),
  rb.afterEvents.playerDimensionChange.subscribe(({ fromDimension: sG, player: sH, toDimension: sI }) => {
    sG.id === "dbe:hyperbolic_time_chamber" &&
      (sH.runCommand("fog @s remove hyperbolic_time_chamber"), sH.playMusic("", { fade: 1 })),
      sI.id === "dbe:hyperbolic_time_chamber" &&
        (sH.runCommand("fog @s push dbe:fog_hyperbolic_time_chamber hyperbolic_time_chamber"),
        sH.playMusic("music.game.hyperbolic_time_chamber_theme", { fade: 2, loop: !0 }));
  });
import { Player as rw } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "king_kai_planet" &&
    sG instanceof rw &&
    sG.playMusic("music.game.king_kai_planet_theme", { fade: 2, loop: !0 });
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "king_kai_planet" && sG instanceof rw && sG.playMusic("", { fade: 1 });
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "king_kai_planet" &&
      rq.addToQueue("king_kai_planet", {
        dimension: sG.dimension,
        location: new bP(-28, 96, -1020),
        structureId: "king_kai_planet",
      });
  });
import { variables as rx } from "./data/variables.js";
import { BlockVolume as ry, Player as rz, world as rA } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "lookout" && sG instanceof rz && sG.playMusic("music.game.lookout_theme", { fade: 2, loop: !0 });
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "lookout" && sG instanceof rz && sG.playMusic("", { fade: 1 });
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "lookout" &&
      rq.addToQueue("lookout", {
        dimension: sG.dimension,
        location: new bP(rx.lookoutLocation.x - 31, 219, rx.lookoutLocation.z - 31),
        structureId: "dbe:lookout",
      });
  });
import { Player as rB, world as rC } from "@minecraft/server";
import { world as rD } from "@minecraft/server";
async function rE() {
  let sG = rD.getDimension("dbe:other_world");
  [
    { structureId: "snake_path_end", location: new bP(8, 65, -945) },
    { structureId: "snake_path_1", location: new bP(8, 65, -938) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -874) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -810) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -746) },
    { structureId: "snake_path_1", location: new bP(8, 65, -682) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -618) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -554) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -490) },
    { structureId: "snake_path_1", location: new bP(8, 65, -426) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -362) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -298) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -234) },
    { structureId: "snake_path_1", location: new bP(8, 65, -170) },
    { structureId: "snake_path_start", location: new bP(-12, 64, -106) },
  ].forEach((sH, sI) => {
    rq.addToQueue(sH.structureId + "_" + sI, { dimension: sG, location: sH.location, structureId: sH.structureId });
  });
}
function rF() {
  let sG = rC.getDimension("dbe:other_world");
  pJ.register(sG).onLoad(function* (sH) {
    let sI = [];
    for (let sK = 0; sK < 16; sK++)
      for (let sL = 0; sL < 16; sL++) {
        let sM = sH.chunkOrigin.x + sK,
          sN = sH.chunkOrigin.z + sL,
          sO = r2(sM / 90, 0, sN / 90),
          sP = Math.floor(sO * 18) + 50;
        sI.push(new bP(sM, sP + 2, sN)), sI.push(new bP(sM, sP + 1, sN)), sI.push(new bP(sM, sP, sN)), yield;
      }
    yield;
    for (let sQ of sI)
      try {
        let sR = sH.dimension.getBlock(sQ);
        yield, sR?.typeId === "minecraft:air" && (sR.setType("dbe:yellow_cloud_block"), yield);
      } catch {
        return;
      }
    pJ.markChunkAsGenerated(sH.id);
  });
}
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "other_world" &&
    sG instanceof rB &&
    (sG.removeTag("dbe:join_other_world"),
    sG.runCommand("fog @s push dbe:fog_other_world other_world"),
    sG.playMusic("music.game.other_world_theme", { fade: 2 }));
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "other_world" &&
      sG instanceof rB &&
      (sH.dimension === sG.dimension
        ? sH.teleportToRegion(sG)
        : (sG.runCommand("fog @s remove other_world"), sG.playMusic("", { fade: 1 })));
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "other_world" &&
      (rq.addToQueue("enma_daioh_palace_front", {
        dimension: sG.dimension,
        location: new bP(-31, 64, -22),
        structureId: "dbe:enma_daioh_palace_front",
      }),
      rq.addToQueue("enma_daioh_palace_back", {
        dimension: sG.dimension,
        location: new bP(-31, 64, -42),
        structureId: "dbe:enma_daioh_palace_back",
      }),
      rE(),
      rF());
  }),
  bM.on("region_load", async ({ region: sG }) => {
    if (sG.id !== "world_martial_arts_tournament" || sG.dimension.id !== "dbe:world_martial_arts_tournament") return;
    try {
      // Worlds that already have the old build keep it; the others get the new tournament from world_landmarks.js.
      // Still in placing counts as old too: the world closed after place wrote the blocks, before markLoaded.
      await rq.ready;
      const oldBuild = rq.hasLoaded("world_martial_arts_tournament") || rq.placingStructureIds.includes("world_martial_arts_tournament");
      if (resolveMartialArtsMode(oldBuild) === "legacy")
        rq.addToQueue("world_martial_arts_tournament", {
          dimension: sG.dimension,
          location: new bP(-28, -64, -12),
          structureId: "Torneio_de_artes_marciais_mundial",
        });
    } catch (error) {
      console.warn("[Structures] tournament mode: " + String(error));
    }
  });
import { resolveMartialArtsMode, onMartialArtsSite } from "./world_landmarks.js";
// A failure here must not stop the landmark scan that starts right after this call in world_landmarks.js.
onMartialArtsSite((regions) => {
  for (const region of regions) {
    try {
      eO(rj.getDimension(region.dimensionId)).setRegionAsync(region)
        .catch((error) => console.warn("[Structures] tournament region " + region.id + ": " + String(error)));
    } catch (error) {
      console.warn("[Structures] tournament region " + region.id + ": " + String(error));
    }
  }
});
function rG() {
  for (let sG of qR) {
    let sH = qT.getDimension(sG.dimensionId);
    eO(sH).setRegionAsync(sG);
  }
}
qS.run(() => rG());
import { EntityTypes as rH } from "@minecraft/server";
dC.register({
  type: "completed_quest",
  test: (sG, sH) => {
    if (sG instanceof hN) {
      let sI = sG.quests.getCompletedQuestIds().includes(sH.value);
      return dC.compare(sI, !0, sH.operator);
    }
    return !1;
  },
  localizationKey: (sG) => [
    {
      translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
      with: { rawtext: [{ translate: "quest." + sG.value + ".title" }] },
    },
  ],
}),
  dC.register({
    type: "has_master",
    test: (sG, sH) => {
      if (sG instanceof hN) {
        let sI = sG.masterManager.getMaster(sH.value);
        return sI && sH.level !== void 0
          ? dC.compare(sI.getFriendshipLevel(), sH.level, sH.operator)
          : dC.compare(!!sI, !0, sH.operator);
      }
      return !1;
    },
    localizationKey: (sG) => {
      let sH = rH.get(sG.value)?.localizationKey;
      return sG.level
        ? [
            {
              translate: "requirement.has_master.with_level",
              with: {
                rawtext: [
                  { translate: "" + sH },
                  { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
                  { text: "" + sG.level },
                ],
              },
            },
          ]
        : [
            {
              translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
              with: { rawtext: [{ translate: "" + sH }] },
            },
          ];
    },
  }),
  dC.register({
    type: "has_mastery",
    test: (sG, sH) => {
      let { masteries: sI } = sG,
        sK = sI.getMastery(sH.value);
      return sK ? dC.compare(sK.masteryMultiplier, sH.multiplier, sH.operator) : !1;
    },
    localizationKey: (sG) => [
      {
        translate: "requirement.has_mastery",
        with: {
          rawtext: [
            { translate: dp.getLocalizationKey(sG.value) },
            { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
            { text: "" + sG.multiplier },
          ],
        },
      },
    ],
  }),
  dC.register({
    type: "has_modifier",
    test: (sG, sH) => {
      let { modifiers: sI } = sG.attributes,
        sK = sI.hasModifier(sH.value);
      return dC.compare(sK, !0, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "modifier." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "has_quest",
    test: (sG, sH) => {
      if (sG instanceof hN) {
        let sI = sG.quests.hasQuest(sH.value);
        return dC.compare(sI, !0, sH.operator);
      }
      return !1;
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "quest." + sG.value + ".title" }] },
      },
    ],
  }),
  dC.register({
    type: "has_skill",
    test: (sG, sH) => {
      if (sH.exceptRaceIds?.includes(sG.race?.id)) return !0;
      let sI = sG.skills.getSkill(sH.value);
      return sI && sH.level !== void 0
        ? dC.compare(sI.level, sH.level, sH.operator)
        : dC.compare(!!sI, !0, sH.operator);
    },
    localizationKey: (sG) =>
      sG.level !== void 0
        ? [
            {
              translate: "requirement.has_skill.with_level",
              with: {
                rawtext: [
                  { translate: "skill." + sG.value },
                  { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
                  { text: "" + (sG.level ?? 1) },
                ],
              },
            },
          ]
        : [
            {
              translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
              with: { rawtext: [{ translate: "skill." + sG.value }] },
            },
          ],
  }),
  dC.register({
    type: "has_level",
    test: (sG, sH) => (sG instanceof hN ? dC.compare(sG.level.currentLevel, sH.value, sH.operator) : !1),
    localizationKey: (sG) => [
      {
        translate: "requirement.has_level",
        with: {
          rawtext: [{ translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") }, { text: "" + (sG.value ?? 1) }],
        },
      },
    ],
  }),
  dC.register({
    type: "in_biome",
    test: (sG, sH) => {
      let { dimension: sI, location: sK } = sG.entity;
      return dC.compare(sI.getBiome(sK).id, duPhysicalDestinationId(sH.value), sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "biome." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_alignment",
    test: (sG, sH) => {
      let { alignment: sI } = sG,
        sK = sI.getAlignment();
      return dC.compare(sK, sH.value, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "alignment." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_race",
    test: (sG, sH) => {
      let { race: sI } = sG;
      return sI ? dC.compare(sI.id, sH.value, sH.operator) : !1;
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "" + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_skill_enabled",
    test: (sG, sH) => {
      let { skills: sI } = sG,
        sK = sI.isSkillActive(sH.value);
      return dC.compare(sK, !0, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "skill." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_transformation",
    test: (sG, sH) => {
      let { race: sI, transformations: sK } = sG,
        sL = sI?.id + ":" + sK.currentTransformation.id,
        sM = sH.raceId + ":" + sH.value;
      return dC.compare(sL, sM, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: sG.raceId + ".transformation." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "time_of_day",
    test: (sG, sH) => {
      let sI = b5.getTimeOfDay(),
        sK = sI === "Night" || sI === "Midnight",
        sL = sI === "Day" || sI === "Morning";
      return !(
        !(sG.entity.dimension.id === "minecraft:overworld") ||
        (sH.value === "night" && !sK) ||
        (sH.value === "day" && !sL)
      );
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "hostOption.time." + sG.value }] },
      },
    ],
  }),
  fG.registerRoles([
    { id: "member", priority: 0, displayTag: { colorPrefix: "§7", name: "Membro" } },
    { id: "patreon", priority: 10, displayTag: { colorPrefix: "§q", name: "Patreon" }, permissions: ["race.glind"] },
    { id: "early", priority: 20, displayTag: { colorPrefix: "§w", name: "Early" } },
    { id: "creator", priority: 100, displayTag: { colorPrefix: "§u", name: "Equipe Dragon Universe" } },
  ]);
import { shop_data as rI } from "./data/shop_data.js";
import { system as rJ } from "@minecraft/server";
function rK() {
  for (let sG of rI) jU.register(sG);
  rJ.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:shop_registry") {
      for (let sK of JSON.parse(sI)) jU.register(sK);
    }
  });
}
rK();
import { skills_data as rL } from "./data/skills_data.js";
import { EntityComponentTypes as rM, GameMode as rN, system as rO } from "@minecraft/server";
var rP = class extends cH {
  flyEntity;
  isLoaded = !1;
  jumpState = { lastJump: !1, jumpCount: 0 };
  // O2a: o voo deixava de reenviar dbe:fly_mode e de reescrever a velocidade da montaria a cada tick. Só escreve
  // quando o valor muda (ou a montaria é outra); a cada FLY_REFRESH_TICKS ticks os caches são esquecidos e tudo é
  // reaplicado, para o caso de outro caminho mudar a propriedade (ex.: fusão) ou o jogo reverter a velocidade.
  lastFlyMode;
  lastFlySpeed;
  lastFlySpeedEntityId;
  flyRefreshTicks = 0;
  static FLY_REFRESH_TICKS = 20;
  constructor(sG, sH) {
    super(sG, sH);
    let { dimension: sI, location: sK } = sG.entity;
    aH.waitForChunkLoad(sI, sK).then(() => {
      if (!sG.entity.isValid) return;
      if (this.isEnabled && !this.startRiding()) this.disable();
      this.isLoaded = !0;
    }).catch((error) => {
      console.warn("[Flight] initialization failed; flight can be retried: " + error);
      if (sG.entity.isValid) {
        this.disable();
        this.isLoaded = !0;
      }
    });
  }
  get flyMode() {
    return this.isHover ? "fast" : "normal";
  }
  get flySpeed() {
    return this.dbeEntity.attributes.stats.getStat("flying_speed")?.value ?? 0;
  }
  get isHover() {
    return this.dbeEntity instanceof hN ? this.dbeEntity.player.isJumping : !1;
  }
  disable() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_end", sH),
      (this.entitySkillData.state.enabled = !1),
      this.saveState(),
      this.stopRiding(),
      this.forgetFlyCache(),
      this.setFlyModeProperty("none");
  }
  async enable() {
    if (!this.startRiding()) return;
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_up", sH),
      (this.entitySkillData.state.enabled = !0),
      this.saveState(),
      this.setFlyModeProperty("normal");
  }
  onTick() {
    if (this.isLoaded && this.dbeEntity instanceof hN) {
      if (this.flyEntity && !this.flyEntity.isValid) {
        this.disable();
        return;
      }
      let { ki: sG, player: sH, transformations: sI } = this.dbeEntity,
        { currentTransformation: sK } = sI,
        sL = sH.getGameMode() === rN.Creative;
      if (this.isEnabled) {
        let riding = sH.getComponent("minecraft:riding")?.entityRidingOn;
        let sM = this.flyEntity?.isValid && riding?.id === this.flyEntity.id &&
          this.flyEntity.dimension.id === sH.dimension.id;
        ++this.flyRefreshTicks >= rP.FLY_REFRESH_TICKS && this.forgetFlyCache();
        this.setFlyModeProperty(this.flyMode), (sL || sG.currentValue <= 0 || sK.isOozaru || !sM) && this.disable();
      } else !sL && sG.currentValue > 0 && !sK.isOozaru && this.isDoubleJump && this.enable();
    }
  }
  get isDoubleJump() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let { isJumping: sG, isOnGround: sH } = this.dbeEntity.entity;
    return (
      sH && (this.jumpState.jumpCount = 0),
      sG && !this.jumpState.lastJump && (this.jumpState.jumpCount++, this.jumpState.jumpCount === 2)
        ? ((this.jumpState.jumpCount = 0), !0)
        : ((this.jumpState.lastJump = sG), !1)
    );
  }
  async setFlyModeProperty(sG) {
    if (sG === "none") {
      await rO.waitTicks(1);
      if (this.isEnabled) return;
    }
    if (sG !== this.lastFlyMode) {
      this.lastFlyMode = sG;
      this.dbeEntity.trySetProperty("dbe:fly_mode", sG);
    }
    this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
  }
  setFlySpeed(sG) {
    let sH = this.flySpeed * sG,
      fly = this.flyEntity;
    if (!fly || (sH === this.lastFlySpeed && fly.id === this.lastFlySpeedEntityId)) return;
    let sI = fly.getComponent(rM.FlyingSpeed),
      sK = fly.getComponent(rM.UnderwaterMovement);
    sI && (sI.value = sH), sK && sK.setCurrentValue(sH);
    this.lastFlySpeed = sH;
    this.lastFlySpeedEntityId = fly.id;
  }
  forgetFlyCache() {
    this.lastFlyMode = void 0;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    this.flyRefreshTicks = 0;
  }
  startRiding() {
    if (this.flyEntity?.isValid) this.stopRiding();
    this.forgetFlyCache();
    let { entity: sG } = this.dbeEntity,
      { dimension: sH, location: sI } = sG,
      sK = sG.getRotation();
    try {
      if (((this.flyEntity = d4("dbe:player_fly", sH, sI, { initialRotation: sK.y })), this.flyEntity)) {
        let sL = this.flyEntity.getComponent("minecraft:rideable");
        if (sL?.addRider(sG)) {
          this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
          return !0;
        }
      }
    } catch (error) {
      console.warn("[Flight] rider attachment failed: " + error);
    }
    if (this.flyEntity?.isValid) this.flyEntity.remove();
    this.flyEntity = void 0;
    return !1;
  }
  stopRiding() {
    let sG = this.flyEntity;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    if (((this.flyEntity = void 0), sG?.isValid)) {
      let sH = sG.getVelocity();
      let player = this.dbeEntity.entity;
      if (player.isValid && player.dimension.id === sG.dimension.id &&
          bO.distance(player.location, sG.location) < 4)
        player.applyImpulse({ x: sH.x, y: sH.y, z: sH.z });
      sG.remove();
    }
  }
};
import { ButtonState as rQ, EntityDamageCause as rR, InputButton as rS } from "@minecraft/server";
var rT = 2,
  rU = 1.25,
  rV = class extends cH {
    isMidAir = !1;
    ticks = 0;
    constructor(sG, sH) {
      super(sG, sH);
    }
    onTick() {
      if (this.dbeEntity instanceof hN) {
        if (this.dbeEntity.skills.isSkillActive("fly")) {
          this.isMidAir = !1;
          this.ticks = 0;
          return;
        }
        let { attributes: sG, player: sH, stamina: sI, transformations: sK } = this.dbeEntity;
        if ((sH.isJumping && !this.isMidAir && (this.isMidAir = !0), this.isMidAir)) {
          let sL = sG.stats.getStat("jump")?.value ?? 0,
            { inputInfo: sM } = sH,
            sN = sH.getVelocity(),
            sO = sM.getButtonState(rS.Jump) === rQ.Pressed,
            sP = sN.y >= 0 && this.ticks <= sL,
            sQ = sI.currentValue >= rT;
          sO &&
            sP &&
            sQ &&
            (sI.removeCurrent(rT), sH.applyKnockback({ x: sN.x * rU, z: sN.z * rU }, 0.5), this.ticks++),
            sH.isOnGround &&
              ((this.isMidAir = !1), (this.ticks = 0), sK.currentTransformation.isOozaru && this.triggerOozaruStomp());
        }
      }
    }
    triggerOozaruStomp() {
      let { entity: sG } = this.dbeEntity,
        sH = sG.dimension.getEntities({ location: sG.location, maxDistance: 4 });
      for (let sI of sH) {
        if (sI === sG) continue;
        let sK = bO.normalize(bO.subtract(sI.location, sG.location));
        try {
          sI.applyDamage(1, { damagingEntity: sG, cause: rR.none }) &&
            sI.applyKnockback({ x: sK.x * 5, z: sK.z * 5 }, 0);
        } catch {}
      }
    }
  };
import { InputPermissionCategory as rW, system as rX } from "@minecraft/server";
var rY = class tb extends cH {
  _startingFusion = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get startingFusion() {
    return this._startingFusion;
  }
  onTick() {
    if (this.isEnabled && !this._startingFusion && this.dbeEntity instanceof hN) {
      let sG = this.findNearbyPlayer();
      if (sG) {
        let sH = hO(sG);
        sG && this.checkMetamoranConditions(sH) && this.startFusionScene(sG);
      }
    }
  }
  checkMetamoranConditions(sG) {
    let sH = sG.skills.getSkill("metamoran_dance");
    return sH instanceof tb ? sH.isEnabled && !sH.startingFusion && !sG.isFused : !1;
  }
  checkCompatibility(sG) {
    let sH = this.dbeEntity.attributes.stats.getStat("size")?.value ?? 0,
      sI = sG.attributes.stats.getStat("size")?.value ?? 0,
      sK = Math.abs(sH - sI),
      sL = Math.abs(this.dbeEntity.entity.location.y - sG.player.location.y),
      sM = 0.2,
      sN = 0.0625,
      sO = 1 - Math.min(sK / sM, 1),
      sP = 1 - Math.min(sL / sN, 1);
    return (sO + sP) / 2;
  }
  findNearbyPlayer() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    return sG.getPlayers({ location: sH, maxDistance: 5 }).find((sI) => sI !== this.dbeEntity.entity);
  }
  async startFusionScene(sG) {
    let sH = this.dbeEntity;
    if (!this._startingFusion && sH instanceof hN) {
      let { entity: sI } = sH,
        sK = hO(sG);
      this._startingFusion = !0;
      let sL = sI.location,
        sM = bO.normalize(sI.getViewDirection()),
        sN = { x: 0, y: 1, z: 0 },
        sO = bO.normalize(bO.cross(sM, sN)),
        sP = 1.55,
        sQ = -5,
        sR = 1,
        sS = { x: sL.x - sO.x * sP, y: sL.y, z: sL.z - sO.z * sP },
        sT = { x: sL.x + sO.x * sP, y: sL.y, z: sL.z + sO.z * sP },
        sU = { x: (sS.x + sT.x) / 2, y: sL.y, z: (sS.z + sT.z) / 2 },
        t1 = { x: sU.x - sM.x * sQ, y: sU.y + sR, z: sU.z - sM.z * sQ },
        t2 = { x: sS.x + sM.x, y: sS.y + sM.y, z: sS.z + sM.z },
        t3 = { x: sT.x + sM.x, y: sT.y + sM.y, z: sT.z + sM.z };
      sI.teleport(sS, { facingLocation: t2 }),
        sG.teleport(sT, { facingLocation: t3 }),
        sI.playAnimation("animation.player.metamoran_dance_right"),
        sG.playAnimation("animation.player.metamoran_dance_left"),
        sI.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        sG.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        this.setInputLock(sH, !0),
        this.setInputLock(sK, !0),
        rX.runTimeout(() => {
          sI.camera.clear(), sG.camera.clear(), this.setInputLock(sH, !1), this.setInputLock(sK, !1);
          let t6 = this.checkCompatibility(sK);
          if (((this._startingFusion = !1), t6 < 0.8)) {
            this.dbeEntity.skills.getToggleSkill("metamoran_dance")?.disable(),
              sK.skills.getToggleSkill("metamoran_dance")?.disable();
            return;
          }
          sI.teleport(sU), sG.teleport(sU), ex.startFusion("metamoran", sI, sG, t6);
        }, 100);
    }
  }
  setInputLock(sG, sH) {
    sH
      ? sG.inputPermissionManager.blockInputPermission("fusion_scene", [rW.Camera, rW.Movement])
      : sG.inputPermissionManager.unblockInputPermission("fusion_scene");
  }
};
function rZ(sG, sH) {
  let sI = { x: sH.x, y: 0, z: sH.z },
    sK = Math.sqrt(sI.x ** 2 + sI.z ** 2);
  sK > 0 && ((sI.x /= sK), (sI.z /= sK));
  let sL = { x: sI.z, y: 0, z: -sI.x };
  return { x: sI.x * sG.y + sL.x * sG.x, y: 0, z: sI.z * sG.y + sL.z * sG.x };
}
var s0 = class extends cH {
  lastStrafeDirection = 0;
  lastStrafeTime = 0;
  strafeCooldown = 300;
  strafePressed = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get isDoubleStrafe() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let sG = this.dbeEntity.player.inputInfo.getMovementVector(),
      sH = Date.now(),
      sI = sG.x;
    if (sI !== 0 && !this.strafePressed) {
      this.strafePressed = !0;
      let sK = Math.sign(sI);
      if (this.lastStrafeDirection === sK && sH - this.lastStrafeTime <= this.strafeCooldown)
        return (this.lastStrafeDirection = 0), (this.lastStrafeTime = 0), !0;
      (this.lastStrafeDirection = sK), (this.lastStrafeTime = sH);
    }
    return sI === 0 && (this.strafePressed = !1), !1;
  }
  onTick() {
    if (this.isDoubleStrafe && this.dbeEntity instanceof hN) {
      let { player: sG } = this.dbeEntity,
        sH = sG.inputInfo.getMovementVector(),
        sI = sG.getViewDirection(),
        { x: sK, z: sL } = rZ(sH, sI);
      sG.applyImpulse({ x: sK * 4, y: 0, z: sL * 4 }),
        sG.dimension.spawnParticle("dbe:teleport", sG.location),
        sG.dimension.playSound("common.teleport2", sG.location);
    }
  }
};
function s1() {
  cG.register("absorption", iV),
    cG.register("burst_move", s0),
    cG.register("fly", rP),
    cG.register("jump", rV),
    cG.register("metamoran_dance", rY),
    cG.register("rapid_movement", cI);
  for (let sG of rL)
    if (!cG.has(sG.id))
      switch (sG.type) {
        case "ki_attack":
          cG.register(sG.id, hj);
          break;
        case "toggle":
          cG.register(sG.id, cH);
          break;
      }
}
s1();
import { tournaments_data as s2 } from "./data/tournaments_data.js";
function s3() {
  for (let sG of s2) cT.registerTournament(sG);
}
s3();
import { CONFIG as s4 } from "./config/config.js";
import { system as s5, world as s6 } from "@minecraft/server";
var s7 = class {
    initialized = !1;
    init() {
      this.initialized || ((this.initialized = !0), s6.beforeEvents.chatSend.subscribe(this.beforeChatSend.bind(this)));
    }
    beforeChatSend(sG) {
      let { message: sH, sender: sI, targets: sK } = sG;
      if (((sG.cancel = !0), !gI.isBanned(sI.name))) {
        let sL = hO(sI),
          sM = fG.getHighestPlayerDisplayTag(sL),
          sN = eJ.getPlayerGroup(sI.id),
          sO = sM ? sM.colorPrefix + "[" + sM.name + "] " : "",
          sP = sN ? "§u[" + (sN.isOwner(sI.id) ? "**" : "") + sN.name + "] " : "",
          sQ = "" + sO + sP + "§r" + sI.name + " §8>> §7" + sH.replace("\u00a7", "");
        s5.run(() => {
          if (sK) {
            for (let sR of sK) sR.sendMessage(sQ);
          } else s6.sendMessage(sQ);
        });
      }
    }
  },
  s8 = new s7();
import { system as s9, world as sb } from "@minecraft/server";
var sf = 18000,
  sj = [12000, 6000, 1200, 100, 80, 60, 40, 20],
  sk = ["minecraft:item"],
  sp = class {
    initialized = !1;
    clearEntities() {
      let sG = cY.getAll(),
        sH = 0;
      for (let sI of sG) for (let sK of sI.getEntities()) sk.includes(sK.typeId) && (sK.remove(), sH++);
      sb.sendMessage({ translate: "server.clear_lag.finish", with: ["" + sH] });
    }
    init() {
      if (!this.initialized) {
        this.initialized = !0;
        let sG = sf;
        // G5: período ausente = 1 tick (o every repassa sem período na prova, como antes)
        every(undefined, "core.clear_lag", () => {
          if ((sj.includes(sG) && this.sendWarn(sG), sG <= 0)) {
            this.clearEntities(), (sG = sf);
            return;
          }
          sG--;
        }, { phase: 0 });
      }
    }
    sendWarn(sG) {
      sb.sendMessage({ translate: "server.clear_lag.warn", with: aM.convertTimeToRawText(sG * 50) });
    }
  },
  sq = new sp();
import { system as sv, world as sw } from "@minecraft/server";
var sx = class {
    currentIndex = 0;
    init() {
      every(3600, "core.server_messages", () => { // G6
        let sG = this.getNextMessageLocalizationKey();
        sw.sendMessage({ translate: sG }), (this.currentIndex = ++this.currentIndex % 10);
      }, { phase: 1801 });
    }
    getNextMessageLocalizationKey() {
      return "server.message." + (this.currentIndex + 1);
    }
  },
  sy = new sx();
function sz() {
  s4.SERVER_MODE.BATTLE_POWER_RANKING && eF.init(),
    s4.SERVER_MODE.CLEAR_LAG && sq.init(),
    s4.SERVER_MODE.CUSTOM_CHAT && (s8.init(), sy.init());
}
sz();
import { system as sA } from "@minecraft/server";
var sB = [],
  sC = [],
  sD = [],
  sE = [],
  sF = [];
sA.run(() => {
  sA.sendScriptEvent("dbe:dialogue_registry", JSON.stringify(sB)),
    sA.sendScriptEvent("dbe:entity_registry", JSON.stringify(sC)),
    sA.sendScriptEvent("dbe:modifier_registry", JSON.stringify(sD)),
    sA.sendScriptEvent("dbe:quest_registry", JSON.stringify(sE)),
    sA.sendScriptEvent("dbe:shop_registry", JSON.stringify(sF));
});

/* ---- True Oni Rage: eating the Demonic Apple grants the oni_blessing modifier ---- */
import { world as __oniWorld } from "@minecraft/server";
__oniWorld.afterEvents.itemCompleteUse.subscribe((__oniEv) => {
  try {
    if (!__oniEv.itemStack || __oniEv.itemStack.typeId !== "dbe:demonic_apple") return;
    const __oniPlayer = __oniEv.source;
    const __oniEnt = i3.getDBEEntity(__oniPlayer);
    if (!__oniEnt || !__oniEnt.attributes || !__oniEnt.attributes.modifiers) return;
    const __oniMods = __oniEnt.attributes.modifiers;
    if (__oniMods.hasModifier("oni_blessing")) return;
    __oniMods.setModifier("oni_blessing");
    __oniPlayer.sendMessage(
      "\u00a74\u00a7lThe Demonic Apple's cursed power sinks into your blood... \u00a7r\u00a7cReach level 100 as a Demon to unleash True Oni Rage.",
    );
  } catch (__oniErr) {}
});
