// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–9 de então, linhas 104–1741.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { ModalFormData as fZ } from "@minecraft/server-ui";
import { InputPermissionCategory as fW, system as fX, world as fY } from "@minecraft/server";
import { late } from "./late.js";
import { aM, aO, bG, bL, bM } from "./01_util.js";
import { dC } from "./06_requirements.js";
import { fC, fR } from "./11_entity_wrapper.js";
import { cY } from "./04_tournament_dims.js";
import { eO } from "./08_fusion_regions.js";
import { d2, d4 } from "./05_db_cooldowns.js";
import { recordBossKill as duRecordBossKill } from "../progression/progression.js";
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
import { achievements_data as gy } from "../data/achievements_data.js";
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
import { CONFIG as gV } from "../config/config.js";
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
export { g0, g1, g3, g4, g5, g6, g7, g8, g9, gk, gp, gq, gv, gw, gx, gA, gB, gC, gD, gH, gI, gN, gO, gP, gQ, gR, gS, gT, gX, gZ, h3, h4, h5, h6 };
