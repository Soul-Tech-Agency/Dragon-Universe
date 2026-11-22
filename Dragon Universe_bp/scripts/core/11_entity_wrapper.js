// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–3 de então, linhas 101–1037.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { EquipmentSlot as cq, Player as cv, system as cw, system as fA, EntityTypes as fz } from "@minecraft/server";
import { entity_data as fy } from "../data/entities_data.js";
import { dC, dv } from "./06_requirements.js";
import { late } from "./late.js";
import { c1 } from "../vendor/vanilla_data.js";
import { aI, aN, aO, bG, bM, bN } from "./01_util.js";
import { eT, eU, f6, f7 } from "./09_skills_combat.js";
import { ef } from "./07_stats.js";
import { d2, dj, dp } from "./05_db_cooldowns.js";
import { fk, fv, fx } from "./10_bars.js";
import { cT } from "./04_tournament_dims.js";
import { CONFIG as ck } from "../config/config.js";
import { eO } from "./08_fusion_regions.js";
import { cI } from "./03_skill_base.js";
import { ki_colors_data as cp } from "../data/ki_colors_data.js";
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
import { races_data as fD } from "../data/races_data.js";
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
import { global_transformations_data as fH } from "../data/global_transformations_data.js";
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
export { fB, fC, fE, fF, fG, fL, fM, fN, fO, fP, fQ, fR, fS, fT, fU, fV };
