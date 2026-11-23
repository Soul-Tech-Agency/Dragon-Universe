// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–6 de então, linhas 173–910.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { g5, gA, gB, gN, gO, gQ, gx, h3 } from "./12_quests.js";
import { world as o, system as q6, EntityTypes as q7 } from "@minecraft/server";
import { aM, aQ, bM } from "./01_util.js";
import { hN, hO } from "./14_player.js";
import { i0, i3 } from "./15_entities.js";
import { physicalDestinationId as duPhysicalDestinationId } from "../travel_safety.js";
import { eO, eP } from "./08_fusion_regions.js";
import { cG } from "./03_skill_base.js";
import { dC } from "./06_requirements.js";
import { bindLate } from "./late.js";
import { hD } from "./13_ki_attack_hud_level.js";
import { challenge_quests_data as q3 } from "../data/challenge_quests_data.js";
import { main_quests_data as q4 } from "../data/main_quests_data.js";
import { side_quests_data as q5 } from "../data/side_quests_data.js";
import { BOSS_IDS as DU_BOSS_IDS, listDefeated as duListDefeated } from "../progression/progression.js";
import { fG } from "./11_entity_wrapper.js";
import { pN } from "./25_terrain_generator.js";
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
export { q8, q9, qb, qq, qv, qx, qy, qB, qC, qD, qE, qF, qG, qI, qJ, qK, qM, qN, qO, qP, duHandleStaffRecovery, duHandleBossQuery, qQ };
