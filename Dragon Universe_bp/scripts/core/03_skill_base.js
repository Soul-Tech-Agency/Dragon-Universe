// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 73–374.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { skills_data as cC, skills_data as cE } from "../data/skills_data.js";
import { bindLate, late } from "./late.js";
import { system as cD, Player as cx, system as cy } from "@minecraft/server";
import { bO, bP } from "./01_util.js";
import { cB } from "./02_forms_timers.js";
// Religa uma skill passiva desligada (hoje só o Hakai, ver cH.disable e o init das skills), sem som nem mensagem.
function duRestorePassive(skill) {
  if (!skill || !skill.isPassive || skill.isEnabled) return;
  skill.entitySkillData.state.enabled = !0;
  skill.saveState();
}
var cF = class {
    constructor(sG, sH) {
      (this.dbeEntity = sG), (this.entitySkillData = sH);
      let sI = cE.find((sK) => sK.id === sH.id);
      if (!sI) throw new Error("Habilidade '" + sH.id + "' não foi definida.");
      (this.skillData = sI), this.masteryOptions && this.dbeEntity.masteries.addMastery(this.id, this.localizationKey);
    }
    skillData;
    get canBeUpgraded() {
      return this.maxLevel > 1;
    }
    get canSwitchTier() {
      return this.skillData.canSwitchTier ?? !1;
    }
    get healthDrain() {
      return this.selectedTier?.healthDrain ?? 0;
    }
    get id() {
      return this.entitySkillData.id;
    }
    get isEnabled() {
      return !0;
    }
    get level() {
      return this.entitySkillData.level;
    }
    get localizationKey() {
      return "skill." + this.id;
    }
    get masteryMultiplier() {
      return this.dbeEntity.masteries.getMastery(this.id)?.masteryMultiplier ?? 1;
    }
    get masteryOptions() {
      return this.skillData.masteryOptions;
    }
    get maxLevel() {
      return this.allTiers.length;
    }
    get requirements() {
      return this.skillData.requirements ?? [];
    }
    get selectedTierIndex() {
      return this.entitySkillData.state.selectedTierIndex ?? 0;
    }
    get spawnChance() {
      return this.skillData.spawnChance ?? 0;
    }
    get staminaDrain() {
      return this.selectedTier?.staminaDrain ?? 0;
    }
    get type() {
      return this.skillData.type;
    }
    get upgradeCost() {
      let { unlockedTiers: sG } = this;
      return sG[sG.length - 1].upgradeCost ?? 0;
    }
    getEntitySkillData() {
      return this.entitySkillData;
    }
    getTranslationKey() {
      return this.isEnabled
        ? { translate: this.localizationKey + ".tier." + this.selectedTierIndex }
        : { rawtext: [{ translate: this.localizationKey }, { text: " " }, { translate: "skill.disabled" }] };
    }
    setLevel(sG) {
      this.maxLevel > 0 &&
        (this.canSwitchTier || (this.entitySkillData.state.selectedTierIndex = Math.max(sG - 1, 0)),
        (this.entitySkillData.level = Math.min(this.maxLevel, sG)),
        this.saveState(),
        // o bônus do novo nível vale na hora (ex.: Desbloqueio de Potencial, decisão 18), não só no próximo recálculo
        this.isEnabled && this.multipliers && this.dbeEntity.attributes.updateStats());
    }
    upgradeSkill() {
      return this.level < this.maxLevel ? (this.setLevel(this.level + 1), !0) : !1;
    }
    get allTiers() {
      return this.skillData.tiers || [];
    }
    get selectedTier() {
      return this.unlockedTiers[this.selectedTierIndex];
    }
    get unlockedTiers() {
      return this.allTiers.filter((sG, sH) => this.level > sH);
    }
    saveState() {
      this.dbeEntity.skills.saveState(), this.onStateChanged?.();
    }
  },
  cG = class {
    static skillTypesMap = new Map();
    static get(sG) {
      return this.skillTypesMap.get(sG);
    }
    static has(sG) {
      return this.skillTypesMap.has(sG);
    }
    static register(sG, sH) {
      this.skillTypesMap.set(sG, sH);
    }
  },
  cH = class extends cF {
    skillData;
    entitySkillData;
    constructor(sG, sH) {
      super(sG, sH);
      let sI = cC.find((sK) => sK.id === sH.id);
      if (!sI || sI.type !== "toggle") throw new Error("Habilidade '" + sH.id + "' não foi definida ou é invalida.");
      (this.skillData = sI), (this.entitySkillData = sH), this.updateIcon();
    }
    get activationSoundId() {
      return this.selectedTier?.activationSound ?? this.skillData.activationSound ?? "";
    }
    get auraProperties() {
      return this.skillData.auraProperties;
    }
    get colorOverrides() {
      return this.selectedTier?.colorOverrides ?? this.skillData.colorOverrides;
    }
    get colorPriority() {
      return this.skillData.colorPriority ?? 1 / 0;
    }
    get chargeTime() {
      return this.skillData.chargeTime ?? 0;
    }
    get functionSlotIndex() {
      return this.skillData.functionSlot;
    }
    get isEnabled() {
      return this.entitySkillData.state.enabled ?? !1;
    }
    get isPassive() {
      return this.skillData.isPassive ?? !1;
    }
    get kiDrain() {
      return this.selectedTier?.kiDrain ?? this.skillData.kiDrain ?? 0;
    }
    get kiDrainTrigger() {
      return this.skillData.kiDrainTrigger ?? "always";
    }
    get multipliers() {
      return this.selectedTier?.multipliers ?? this.skillData.multipliers;
    }
    get propertyId() {
      return this.skillData.propertyId;
    }
    get removeOnDeath() {
      return this.skillData.removeOnDeath ?? !1;
    }
    get showHudIcon() {
      return this.skillData.showHudIcon ?? !1;
    }
    get wilDamage() {
      return this.skillData.wilDamage ?? 0;
    }
    disable() {
      const wasEnabled = this.isEnabled;
      this.propertyId && this.dbeEntity.trySetProperty(this.propertyId, !1),
        (this.entitySkillData.state.enabled = !1),
        this.saveState();
      // O Hakai (passivo, sem botão) é desligado quando o Instinto Superior liga; volta quando o Instinto termina.
      // wasEnabled evita o laço: hakai.enable() desliga um Instinto que já está desligado.
      if (this.id === "ultra_instinct" && wasEnabled) duRestorePassive(this.dbeEntity.skills.getToggleSkill("hakai"));
    }
    enable() {
      if ((this.id === "ultra_instinct" || this.id === "hakai") &&
          this.dbeEntity instanceof late.hN && !late.dC.testAll(this.dbeEntity, this.requirements)) {
        this.dbeEntity.player.sendMessage(late.dC.listDescription(this.requirements, this.dbeEntity));
        return;
      }
      if (this.kiDrain > 0 && this.dbeEntity.ki.currentValue <= 0) {
        this.dbeEntity instanceof late.hN && this.dbeEntity.player.sendMessage({ translate: "message.noKi.warning" });
        return;
      }
      if (this.id === "ultra_instinct" || this.id === "hakai") {
        if (this.id === "ultra_instinct") {
          this.dbeEntity.skills.getToggleSkill("hakai")?.disable();
          if (this.dbeEntity.transformations.currentTransformation.id === "ultra_ego")
            this.dbeEntity.transformations.untransform();
        } else if (this.id === "hakai") this.dbeEntity.skills.getToggleSkill("ultra_instinct")?.disable();
      }
      this.propertyId && this.dbeEntity.trySetProperty(this.propertyId, !0),
        (this.entitySkillData.state.enabled = !0),
        this.playActivationSound(),
        this.saveState();
    }
    async increaseTier() {
      if (this.isEnabled) {
        let sG = (this.selectedTierIndex + 1) % this.unlockedTiers.length;
        (this.entitySkillData.state.selectedTierIndex = sG),
          sG === 0 ? this.disable() : (this.playActivationSound(), this.saveState());
      } else {
        if (this.chargeTime && !(await this.waitForChargeOrCancel())) return;
        this.enable();
      }
      if (this.dbeEntity instanceof late.hN) {
        let sH = this.getTranslationKey();
        this.dbeEntity.player.sendMessage([{ text: "§6" }, sH]);
      }
    }
    updateIcon() {
      if (this.dbeEntity instanceof late.hN) {
        let { statusIndicator: sG } = this.dbeEntity;
        this.showHudIcon && (this.isEnabled ? sG.addIcon(this.id) : sG.removeIcon(this.id));
      }
    }
    onStateChanged() {
      this.updateIcon(),
        this.auraProperties?.color && this.dbeEntity.ki.updateAuraColor(),
        this.colorOverrides && this.dbeEntity.colors.updateColorOverrides(),
        this.multipliers && this.dbeEntity.attributes.updateStats(),
        this.id === "ultra_instinct" &&
          this.dbeEntity.trySetProperty("dbe:ultra_instinct", this.isEnabled ? this.selectedTierIndex + 1 : 0);
    }
    playActivationSound() {
      let { dimension: sG, location: sH } = this.dbeEntity.entity;
      cD.run(() => sG.playSound(this.activationSoundId, sH));
    }
    waitForChargeOrCancel() {
      return new Promise((sG) => {
        let { concentrationBar: sH } = this.dbeEntity;
        sH.startIncrease(this.chargeTime / 100),
          sH.onIncrease((sI) => {
            let sK = this.dbeEntity.entity.getVelocity();
            bO.magnitude(sK) && (sH.stopIncrease(), sG(!1)), sI >= 100 && (sH.stopIncrease(), sG(!0));
          });
      });
    }
  },
  cI = class extends cH {
    rapidMovementCooldown;
    constructor(sG, sH) {
      super(sG, sH);
      let { cooldowns: sI } = sG;
      if (
        ((this.rapidMovementCooldown = sI.getCooldown("rapid_movement") || sI.setCooldown("rapid_movement", 50)),
        !(sG.entity instanceof cx))
      ) {
        let { combatManager: sK } = sG;
        sK && sK.addBehavior("rapid_movement", new cB(sG, sK));
      }
    }
    async teleportToEntity(sG) {
      if ((this.applyTeleportEffects(), await cy.waitTicks(3), sG.isValid)) {
        let sH = this.dbeEntity.skills.getToggleSkill("fly"),
          sI = sH?.isEnabled,
          { location: sK } = sG,
          sL = this.getTeleportLocation(sG);
        this.dbeEntity.entity.tryTeleport(sL, { checkForBlocks: !0, facingLocation: new bP(sK.x, sK.y - 0.5, sK.z) }) &&
          (await cy.waitTicks(3), this.dbeEntity.entity.isValid && (sI && sH.enable(), this.applyTeleportEffects()));
      }
    }
    async tryTeleportToLocation(sG) {
      let entity = this.dbeEntity.entity,
        dimension = entity.dimension;
      await cy.waitTicks(1);
      if (!entity.isValid || entity.dimension.id !== dimension.id) return !1;
      this.applyTeleportEffects();
      let sH = entity.tryTeleport(sG, {
        checkForBlocks: !0,
        facingLocation: this.dbeEntity.target?.location,
      });
      return sH && (await cy.waitTicks(3), this.applyTeleportEffects()), sH;
    }
    onTick() {
      if (this.dbeEntity instanceof late.hN && this.rapidMovementCooldown.isExpired() && this.dbeEntity.player.isJumping) {
        let sG = this.dbeEntity.entity.getEntitiesFromViewDirection();
        for (let sH of sG) {
          let { distance: sI, entity: sK } = sH;
          this.isValidOpponent(sK) && (sI > 32 || (this.teleportToEntity(sK), this.rapidMovementCooldown.reset()));
        }
      }
    }
    applyTeleportEffects() {
      cy.run(() => {
        if (this.dbeEntity.entity.isValid) {
          let { dimension: sG, location: sH } = this.dbeEntity.entity;
          sG.spawnParticle("dbe:teleport", sH), sG.playSound("common.teleport1", sH);
        }
      });
    }
    getTeleportLocation(sG) {
      let sH = sG.getViewDirection();
      sH.y = 0;
      let { dimension: sI, location: sK } = sG,
        sL = bO.subtract(sK, bO.scale(sH, -2));
      for (let sM = 0; sM <= 2; sM++) {
        let sN = new bP(sL.x, sL.y + sM, sL.z);
        if (sI.getBlock(sN)?.isAir) return sN;
      }
      return sL;
    }
    isValidOpponent(sG) {
      return sG instanceof late.hN ? !0 : late.i3.getDBEEntity(sG)?.advancedCombat === !0;
    }
  };
bindLate("cI", () => cI); // O4.0: ligação tardia
export { duRestorePassive, cF, cG, cH, cI };
