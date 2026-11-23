// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 112–819.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { aI, aN, aO, bG, bN, bO, bP } from "./01_util.js";
import { CONFIG as hG } from "../config/config.js";
import { EquipmentSlot as bU, GameMode as bV, InputPermissionCategory as bW, system as bX, MolangVariableMap as hH, system as hI } from "@minecraft/server";
import { hA, hD, hE, hF, hk, hp, hv } from "./13_ki_attack_hud_level.js";
import { d4 } from "./05_db_cooldowns.js";
import { fG, fP, fR, fS, fV } from "./11_entity_wrapper.js";
import { g1, g3, g5, g7, gD, gI, gR, gS, gT, gw, h6 } from "./12_quests.js";
import { eJ, ex } from "./08_fusion_regions.js";
import { bindLate, late } from "./late.js";
import { cA, cj } from "./02_forms_timers.js";
import { isSafeStanding as duIsSafeStanding, reportTravelFailure as duReportTravelFailure, safeReturnToEarth as duSafeReturnToEarth } from "../travel_safety.js";
import { c1 } from "../vendor/vanilla_data.js";
import { hL } from "../training/concentration.js"; // O4.6: a concentração saiu deste arquivo
var hM = class {
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
export { hM, hN, hO, hP, hQ, duMovementModeTypes, hS, hT, hU };
