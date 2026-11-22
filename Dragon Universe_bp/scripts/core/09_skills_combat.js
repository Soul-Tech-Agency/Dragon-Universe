// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 95–458.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { cG, cH, duRestorePassive } from "./03_skill_base.js";
import { late } from "./late.js";
import { aN, bM, bN, bO, bP } from "./01_util.js";
import { skills_data as eQ } from "../data/skills_data.js";
import { dC } from "./06_requirements.js";
import { Player as eR, system as eS } from "@minecraft/server";
import { eO } from "./08_fusion_regions.js";
import { c1 } from "../vendor/vanilla_data.js";
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
import { CONFIG as eW } from "../config/config.js";
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
export { eT, eU, f1, f2, f3, f4, f5, f6, f7 };
