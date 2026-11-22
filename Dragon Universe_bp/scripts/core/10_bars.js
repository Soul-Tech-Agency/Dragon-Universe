// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–3 de então, linhas 98–468.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { late } from "./late.js";
import { Player as f9, system as fb, world as ff } from "@minecraft/server";
import { aO } from "./01_util.js";
import { CONFIG as f8 } from "../config/config.js";
import { d6 } from "./05_db_cooldowns.js";
import { isTravelPending as duIsTravelPending } from "../travel_safety.js";
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
import { ki_colors_data as fp } from "../data/ki_colors_data.js";
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
import { CONFIG as fw } from "../config/config.js";
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
export { fj, fk, fv, fx };
