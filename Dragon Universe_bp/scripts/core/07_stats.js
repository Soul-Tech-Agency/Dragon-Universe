// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–4 de então, linhas 90–631.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { EntityComponentTypes as dJ, Player as dK, system as dL, system as dM } from "@minecraft/server";
import { late } from "./late.js";
import { aN, aO, bM, bN } from "./01_util.js";
import { CONFIG as dI } from "../config/config.js";
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
export { dN, dO, dP, dQ, dR, dS, dT, dU, dW, dX, dY, dZ, e0, e1, e4, e6, e7, e8, e9, eb, ef };
