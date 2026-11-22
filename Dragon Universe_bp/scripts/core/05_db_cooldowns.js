// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 79–259.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { EntityComponentTypes as cZ, Player as d0 } from "@minecraft/server";
import { every } from "./scheduler.js";
import { bN } from "./01_util.js";
function d1(sG, sH) {
  let sI = sG.getBlock(sH),
    sK = sI?.above(),
    sL = sI?.below();
  return !sI || !sK || !sL
    ? !1
    : sI.getLightLevel() >= 4
      ? !!(sL.isSolid && !sL.isLiquid && !sI.isSolid && !sI.isLiquid && !sK.isSolid && !sK.isLiquid)
      : !1;
}
function d2(sG, sH, sI) {
  let sK,
    sL = -1 / 0;
  for (let sM = 0; sM < 50; sM++) {
    let sN = Math.random() * Math.PI * 2,
      sO = Math.random() * sI,
      sP = Math.floor(sH.x + Math.cos(sN) * sO),
      sQ = Math.floor(sH.z + Math.sin(sN) * sO),
      sR = sG.getTopmostBlock({ x: sP, z: sQ }, sH.y + sI)?.y;
    if (sR == null) continue;
    let sS = { x: sP, y: sR + 1, z: sQ };
    if (!d1(sG, sS)) continue;
    let sT = sO;
    sT > sL && ((sL = sT), (sK = sS));
  }
  return sK;
}
function d3(sG) {
  return sG instanceof d0 || (sG.typeId.startsWith("dbe:") && !sG.hasComponent(cZ.Item));
}
function d4(sG, sH, sI, sK) {
  if (sH.isChunkLoaded(sI)) {
    let { heightRange: sL } = sH,
      { y: sM } = sI;
    if (sM >= sL.min && sM <= sL.max) return sH.spawnEntity(sG, sI, sK);
  }
}
function d5(sG = 12) {
  let sH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    sI = "";
  for (let sK = 0; sK < sG; sK++) sI += sH[Math.floor(Math.random() * sH.length)];
  return sI;
}
function d6(sG, sH, sI = "8") {
  return {
    rawtext: [
      { text: "\u00a7" + sI + "(" + sG + " " },
      { translate: sH === "zeni" ? "zeni" : "point." + sH + ".abbreviation" },
      { text: ")§r" },
    ],
  };
}
import { system as d7, world as d8 } from "@minecraft/server";
function d9(sG) {
  return sG === "absolute_time" ? d8.getAbsoluteTime() : d7.currentTick;
}
var db = class {
    constructor(sG, sH) {
      (this.cooldownData = sG),
        (this.cooldownManager = sH),
        ((this.id = sG.id),
        (this.startTime = sG.startTime),
        (this.value = sG.value),
        (this.timeSource = sG.timeSource));
    }
    id;
    startTime;
    value;
    timeSource;
    getData() {
      return { id: this.id, startTime: this.startTime, value: this.value, timeSource: this.timeSource };
    }
    getElapsedTicks() {
      return d9(this.timeSource) - this.startTime;
    }
    getRemainingTicks() {
      return Math.max(0, this.value - this.getElapsedTicks());
    }
    isExpired() {
      return this.getElapsedTicks() >= this.value;
    }
    reset() {
      (this.startTime = d9(this.timeSource)), this.cooldownManager.saveCooldowns();
    }
  },
  df = class sX {
    constructor(sG) {
      (this.dataManager = sG), this.loadCooldowns();
    }
    static instances = new Map();
    cooldownsMap = new Map();
    static cleanup() {
      for (let [sG, sH] of this.instances) sG.isProviderValid() || (sH.cooldownsMap.clear(), this.instances.delete(sG));
    }
    static getInstance(sG) {
      return this.instances.has(sG) || this.instances.set(sG, new sX(sG)), this.instances.get(sG);
    }
    clearCooldown(sG) {
      this.cooldownsMap.delete(sG), this.saveCooldowns();
    }
    getCooldown(sG) {
      return this.cooldownsMap.get(sG);
    }
    saveCooldowns() {
      let sG = [];
      for (let sH of this.cooldownsMap.values()) sG.push(sH.getData());
      this.dataManager.set("cooldowns", sG);
    }
    setCooldown(sG, sH, sI = "elapsed_ticks") {
      let sK = this.getCooldown(sG);
      if (sK) return (sK.value = sH), (sK.timeSource = sI), sK.reset(), sK;
      {
        let sL = new db({ id: sG, startTime: d9(sI), value: sH, timeSource: sI }, this);
        return this.cooldownsMap.set(sL.id, sL), this.saveCooldowns(), sL;
      }
    }
    loadCooldowns() {
      let sG = this.dataManager.get("cooldowns"),
        sH = Array.isArray(sG) ? sG : [];
      for (let sI of sH) this.cooldownsMap.set(sI.id, new db(sI, this));
    }
  };
function dj(sG) {
  let sH = df.getInstance(sG);
  if (sH instanceof df) return sH;
  throw new Error("Instância de CooldownManager não encontrada para DynamicDatabase fornecido.");
}
every(1200, "core.cooldown_cleanup", () => df.cleanup(), { phase: 401 }); // G2
var dk = class {
    constructor(sG, sH, sI) {
      (this.masteryId = sG), (this.initialValue = sH), (this.masteryManager = sI), (this.masteryPercent = sH);
    }
    masteryPercent;
    get id() {
      return this.masteryId;
    }
    get masteryMultiplier() {
      return parseFloat((this.masteryPercent / 100 + 1).toFixed(2));
    }
    addPercentage(sG) {
      this.setPercentage(this.masteryPercent + sG);
    }
    removePercentage(sG) {
      this.setPercentage(this.masteryPercent - sG);
    }
    setPercentage(sG) {
      let sH = bN(sG, 0, 100);
      sH != this.masteryPercent && ((this.masteryPercent = sH), this.masteryManager.saveMasteries());
    }
  },
  dp = class sY {
    constructor(sG) {
      (this.dataManager = sG), ((this.masteriesData = this.dataManager.get("masteries") || {}), this.loadMasteries());
    }
    static localizationKeys = new Map();
    masteriesMap = new Map();
    masteriesData;
    static getLocalizationKey(sG) {
      return this.localizationKeys.get(sG) ?? "";
    }
    addMastery(sG, sH) {
      if (!this.masteriesMap.has(sG)) {
        let sI = new dk(sG, 0, this);
        this.masteriesMap.set(sG, sI), sY.localizationKeys.set(sG, sH ?? "");
      }
    }
    getMastery(sG) {
      return this.masteriesMap.get(sG);
    }
    saveMasteries() {
      for (let [sG, sH] of this.masteriesMap) this.masteriesData[sG] = sH.masteryPercent;
      this.dataManager.set("masteries", this.masteriesData);
    }
    loadMasteries() {
      for (let sG in this.masteriesData)
        if (!this.masteriesMap.has(sG)) {
          let sH = new dk(sG, this.masteriesData[sG], this);
          this.masteriesMap.set(sG, sH);
        }
    }
  };
export { d1, d2, d3, d4, d5, d6, d9, db, df, dj, dk, dp };
