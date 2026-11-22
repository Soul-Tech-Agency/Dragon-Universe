// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–4 de então, linhas 109–519.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { cF } from "./03_skill_base.js";
import { skills_data as h9 } from "../data/skills_data.js";
import { d4 } from "./05_db_cooldowns.js";
import { late } from "./late.js";
import { EntitySwingSource as h7, world as h8, InputPermissionCategory as hb, system as hf } from "@minecraft/server";
import { aN, aO, bO } from "./01_util.js";
import { gA } from "./12_quests.js";
import { fj } from "./10_bars.js";
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
import { CONFIG as hB } from "../config/config.js";
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
export { hj, hk, hp, hv, hz, hA, hD, hE, hF };
