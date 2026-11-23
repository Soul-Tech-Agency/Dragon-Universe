// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 141–1290.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { ActionFormData as jX } from "@minecraft/server-ui";
import { cj } from "./02_forms_timers.js";
import { hN, hO } from "./14_player.js";
import { removeOrphanOrb } from "../training/concentration.js";
import { removeOrphanReplica, memoryLevel as duMemoryLevel, formatTicks as duFormatTicks } from "../training/mental.js";
import { listDefeated as duListDefeated, BOSS_IDS as DU_BOSS_IDS } from "../progression/progression.js";
import { EntityComponentTypes as g, system as gU, EntitySwingSource as i, EquipmentSlot as l, Player as m, system as n, world as o, system as r } from "@minecraft/server";
import { eJ, eO, eP, ex } from "./08_fusion_regions.js";
import { hZ, i0, i3 } from "./15_entities.js";
import { iB, iH, iK, iR, iV, iy, j4 } from "./17_items_balls_fusion.js";
import { dragonBallsData as d } from "../data/dragon_balls_data.js";
import { jC, jE, jG } from "./18_wishes.js";
import { jW } from "./20_shop_dialogues.js";
import { aM, aN, aO, aQ, bM } from "./01_util.js";
import { hj } from "./13_ki_attack_hud_level.js";
import { isTravelPending as duIsTravelPending } from "../travel_safety.js";
import { jK } from "./19_ki_explosion.js";
import { ib } from "./16_damage.js";
import { gX } from "./12_quests.js";
import { dC } from "./06_requirements.js";
import { fR } from "./11_entity_wrapper.js";
import { firstFormsRawtext as duFirstFormsRawtext, raceInfo as duRaceInfo } from "../race_info.js";
import { d2, d6 } from "./05_db_cooldowns.js";
var jY = class {
    constructor(sG, ...sH) {
      this.initiator = sG;
    }
    actionFormData = new jX();
    buttonCallbacks = [];
    responseCallbacks = [];
    addButton(sG, sH, sI) {
      return this.actionFormData.button(sG, sI?.iconPatch), this.buttonCallbacks.push(sH || (() => {})), this;
    }
    async display(sG = !1) {
      for (; this.initiator.isValid; ) {
        let sH = await this.actionFormData.show(this.initiator);
        if (sH.selection !== void 0 && sH.selection >= 0) {
          let sI = this.buttonCallbacks[sH.selection];
          sI && sI();
        }
        if (sH.cancelationReason !== "UserClosed" || !sG) {
          for (let sK of this.responseCallbacks) sK(sH);
          return sH;
        }
      }
    }
    setBody(sG) {
      return this.actionFormData.body(sG), this;
    }
    setTitle(sG) {
      return this.actionFormData.title(sG), this;
    }
    shouldDisplayForm() {
      return !0;
    }
    onResponse(sG) {
      this.responseCallbacks.push(sG);
    }
  },
  jZ = class extends jY {
    static lastMenuId = new Map();
    constructor(sG) {
      super(sG), this.addFixedButtons();
    }
    addFixedButtons() {
      let { initiator: sG } = this;
      // 0 = aba Ajuda (Guia, redesign/CONTRATO.md seção 2)
      this.addButton("", () => cj.displayForm(sG, "help")),
        this.addButton("", () => cj.displayForm(sG, "statistics")),
        this.addButton("", () => cj.displayForm(sG, "skills")),
        this.addButton("", () => cj.displayForm(sG, "quest_list")),
        this.addButton("", () => cj.displayForm(sG, "training")),
        this.addButton("", () => cj.displayForm(sG, "news")),
        this.addButton("", () => cj.displayForm(sG, "achievement_list")),
        // 7 = aba Transformações (redesign/CONTRATO.md, seção 2); 8 e 9 reservados
        this.addButton("", () => cj.displayForm(sG, "transformations")),
        this.addButton("", () => cj.displayForm(sG, "")),
        this.addButton("", () => cj.displayForm(sG, ""));
    }
    shouldDisplayForm() {
      return this.initiator.hasTag("dbe_alignment_question")
        ? (cj.displayForm(this.initiator, "alignment_question"), !1)
        : !0;
    }
  };
function k0(sG) {
  hO(sG).claimBulmaStaffReward();
  let sH = jZ.lastMenuId.get(sG.id) ?? "statistics";
  cj.displayForm(sG, sH);
}
function k1(sG) {
  let { concentrationTraining: sH, kiSense: sI, player: sK, quests: sL, title: sM } = sG,
    sN = [];
  if ((sM.reloadTitles(), sI.canSenseKi)) {
    let sO = sI.detectNearestDBEEntity();
    sO && sN.push(...sI.getDescription(sO).rawtext, { text: "\n\n" });
  }
  sL.getActiveQuests().length && sN.push(...sL.describeQuests().rawtext),
    sH.isTraining && kG.TRAINING_HUD_ACTIONBAR && sN.push(...sH.getDescription().rawtext), // painel no HUD (§11)
    sN.length && sK.onScreenDisplay.setActionBar(sN);
}
var k2 = ["dbe:menu", "dbe:functions", "dbe:techniques"],
  k3 = { "dbe:change_hair": "select_hair", "dbe:functions": "main_functions" },
  k4 = new Set();
function k5(sG, sH) {
  k4.has(sG.id) ||
    (k4.add(sG.id),
    n.runTimeout(() => k4.delete(sG.id), 50),
    n.run(() => {
      if (sG.isValid) {
        if ((sG.playSound("block.false_permissions"), sH?.type === "group")) {
          let sI = eJ.getGroupById(sH.id)?.name;
          sG.sendMessage({ translate: "message.safeRegion.noPermission.owner", with: [sI ?? ""] });
        } else sG.sendMessage({ translate: "message.safeRegion.noPermission" });
      }
    }));
}
function removeTimeChamberHostile(entity) {
  if (
    !entity.isValid ||
    entity.dimension.id !== "dbe:hyperbolic_time_chamber" ||
    !entity.typeId.startsWith("minecraft:") ||
    entity.getDynamicProperty("dbe:spawned_by") ||
    entity.getDynamicProperty("dbe:is_friendly_damage")
  )
    return !1;
  if (!entity.getComponent("minecraft:type_family")?.hasTypeFamily("monster")) return !1;
  entity.remove();
  return !0;
}
const duNpcInteractions = new Map();
async function duHandleNpcInteraction(player, target, wrapper, dimensionId) {
  const current = () => player.isValid && target.isValid && i0.get(player.id) === wrapper &&
    player.dimension.id === dimensionId && target.dimension.id === dimensionId;
  if (!current()) return;
  if (wrapper.race.id === "namekian") {
    const other = i3.getDBEEntity(target);
    if (other && iK.tryFusion(wrapper, other)) return;
  }
  for (const task of wrapper.tasks.getActiveTasksByType("collect_item")) {
    if (!current()) return;
    if (task.deliverToNpc !== target.typeId || task.isCompleted || !task.isStarted ||
        !wrapper.tasks.getActiveTasksByType("collect_item").includes(task)) continue;
    if (!task.completeNpcDelivery()) continue;
    await n.waitTicks(10);
    if (!current()) return;
  }
  for (const task of wrapper.tasks.getActiveTasksByType("interact_npc")) {
    if (!current()) return;
    if (task.npcTypeId === target.typeId) { await task.showDialog(); return; }
  }
  for (const { sourceId } of d) {
    if (!current()) return;
    if (sourceId === target.typeId) { await jC.handleWishSession(player, target); return; }
  }
  if (!current()) return;
  const dialogue = jW.getNpcDialogue(target.typeId);
  if (dialogue) {
    await jW.showDialogue(player, target, dialogue);
    if (!current()) return;
    n.run(() => {
      if (!current()) return;
      try { player.playSound("random.pop"), target.playAnimation("animation.humanoid.pop", { players: [player] }); }
      catch (error) { console.warn("[Dragon Universe] NPC interaction effect failed: " + (error?.stack ?? error)); }
    });
  }
}
var k6 = class {
  constructor() {
    let { afterEvents: sG, beforeEvents: sH } = o;
    sG.entityDie.subscribe(this.afterEntityDie),
      sG.entityHitEntity.subscribe(this.afterEntityHitEntity),
      sG.entityLoad.subscribe(this.afterEntityLoad),
      sG.entitySpawn.subscribe(this.afterEntitySpawn),
      sG.itemCompleteUse.subscribe(this.afterItemCompleteUse),
      sG.itemStartUse.subscribe(this.afterItemStartUse),
      sG.itemStopUse.subscribe(this.afterItemStopUse),
      sG.itemUse.subscribe(this.afterItemUse),
      sG.playerDimensionChange.subscribe(this.afterPlayerDimensionChange),
      sG.playerHotbarSelectedSlotChange.subscribe(this.afterPlayerHotbarSelectedSlotChange),
      sG.playerInventoryItemChange.subscribe(this.afterPlayerInventoryItemChange),
      sG.playerSpawn.subscribe(this.afterPlayerSpawn),
      sG.playerSwingStart.subscribe(this.afterPlayerSwingStart),
      sG.projectileHitBlock.subscribe(this.afterProjectileHitBlock),
      sG.projectileHitEntity.subscribe(this.afterProjectileHitEntity),
      sG.worldLoad.subscribe(this.afterWorldLoad),
      sH.entityHurt.subscribe(this.beforeEntityHurt),
      sH.entityItemPickup.subscribe(this.beforeEntityItemPickup),
      sH.explosion.subscribe(this.beforeExplosion),
      sH.playerInteractWithBlock.subscribe(this.beforePlayerInteractWithBlock),
      sH.playerInteractWithEntity.subscribe(this.beforePlayerInteractWithEntity),
      sH.playerBreakBlock.subscribe(this.beforePlayerBreakBlock),
      sH.playerPlaceBlock.subscribe(this.beforePlayerPlaceBlock),
      n.runInterval(this.onTickEvent),
      n.beforeEvents.watchdogTerminate.subscribe((sI) => {
        console.warn("Watchdog solicitou encerramento; proteção mantida. Motivo: " + sI.terminateReason);
      });
  }
  afterEntityDie({ damageSource: sG, deadEntity: sH }) {
    let sI = i3.getDBEEntity(sH);
    sI instanceof hN && (sI.quests.stopActiveQuests(), sH.addTag("dbe:join_other_world")),
      bM.dispatch("entity_died", { entity: sH, damageSource: sG, dbeEntity: sI });
  }
  afterEntityHitEntity({ damagingEntity: sG, hitEntity: sH }) {
    let sI = i3.getDBEEntity(sG);
    sI instanceof hN && sH.typeId === "dbe:training_orb" && sI.concentrationTraining.claimOrb(sH);
  }
  afterEntityLoad({ entity }) {
    removeTimeChamberHostile(entity) || removeOrphanOrb(entity) || removeOrphanReplica(entity); // orb/réplica sem sessão viva
  }
  afterEntitySpawn({ cause: sG, entity: sH }) {
    if (removeTimeChamberHostile(sH)) return;
    if (
      !sH.isValid ||
      sG !== "Spawned" ||
      sH.typeId === "minecraft:item" ||
      sH.getDynamicProperty("dbe:spawned_by") ||
      sH.getDynamicProperty("dbe:is_friendly_damage")
    )
      return;
    if (eO(sH.dimension).getTopRegionAt(sH.location)?.preventMobSpawning ?? !1) {
      let sI = sH.getComponent("minecraft:type_family");
      sI && (["inanimate", "ki_attack", "npc"].some((sK) => sI.hasTypeFamily(sK)) || sH.remove());
    }
  }
  afterItemCompleteUse({ source: sG, itemStack: sH }) {
    let sI = hO(sG);
    aQ.isFood(sH) && jG.applyFoodEffect(sI, sH);
  }
  afterItemStartUse({ itemStack: sG, source: sH }) {
    let sI = i3.getDBEEntity(sH);
    if (sI instanceof hN && sG?.typeId === "dbe:techniques") {
      if (sI.isActionBlocked || sI.isLoadingAttack || sI.transformations.currentTransformation.isOozaru) return;
      let { selectedSkill: sK } = sI.skillsContainer;
      sK instanceof iV && sK.useSkill(), sK instanceof hj && sK.startCharge();
    }
  }
  afterItemStopUse({ itemStack: sG, source: sH }) {
    let sI = i3.getDBEEntity(sH);
    if (sI instanceof hN && sG?.typeId === "dbe:techniques") {
      let { selectedSkill: sK } = sI.skillsContainer;
      sK instanceof hj && sK.stopCharge();
    }
  }
  async afterItemUse({ source: sG, itemStack: sH }) {
    let { hasStartedAdventure: sI, isActionBlocked: sK, physicalTraining: duPhysical } = hO(sG);
    // flexões (TREINOS §2.3): o item de Funções troca de fase (modo alternativo) e o menu abre a tela Treino (Encerrar)
    if (duPhysical?.active) {
      if (sH.typeId === "dbe:functions") duPhysical.onFunctionsItem();
      else if (sH.typeId === "dbe:menu") cj.displayForm(sG, "training");
      return;
    }
    if (!sK) {
      if (sI) {
        let sL = k3[sH.typeId];
        if (sH.typeId === "dbe:menu") {
          k0(sG);
          return;
        }
        sL && cj.displayForm(sG, sL);
      } else duCustomizationOpen.has(sG.id) || cj.displayForm(sG, "select_race");
    }
  }
  afterPlayerDimensionChange({ fromDimension: sG, player: sH, toDimension: sI }) {
    jE.reset(sH);
    let flight = i0.get(sH.id)?.skills.getToggleSkill("fly");
    // o voo desliga na troca (a montaria não atravessa) e religa sozinho no destino (roteiro: Star Navigator voando)
    flight?.isEnabled && (flight.disable(), flight.resumeAfterDimensionChange?.(sI.id));
    eO(sG).updateEntityRegions(sH), eO(sI).updateEntityRegions(sH);
  }
  afterPlayerHotbarSelectedSlotChange({ newSlotSelected: sG, player: sH, previousSlotSelected: sI }) {
    let radar = aN.getEquippedItem(sH, l.Mainhand);
    radar?.typeId === "dbe:dragon_radar" ? jE.scanDragonBalls(sH) : jE.reset(sH);
    let { guard: sK, physicalTraining: duPhysical } = hO(sH);
    if (duPhysical?.active) return; // flexões: o slot 8 é o item do modo alternativo, não a guarda
    sG === 8 && sK.tryGuard(), sI === 8 && sK.breakGuard();
  }
  afterPlayerInventoryItemChange({ itemStack: sG, player: sH, slot: sI }) {
    if (sG) {
      if (iR.isBanned(sG.typeId)) {
        sH.getComponent("inventory")?.container.setItem(sI);
        return;
      }
      if (sG.hasComponent("dbe:patreon") && !hO(sH).redeem.hasCode("patreon")) {
        sH.getComponent("inventory")?.container.setItem(sI), sH.dimension.spawnItem(sG, sH.location);
        return;
      }
      !sG.keepOnDeath &&
        sG.hasComponent("dbe:keep_on_death") &&
        ((sG.keepOnDeath = !0), sH.getComponent("inventory")?.container.setItem(sI, sG));
    }
  }
  afterPlayerSpawn({ player: sG }) {
    jE.reset(sG);
    let sH = hO(sG);
    sH.recoverConstitution(),
      sG.hasTag("dbe:join_other_world") &&
        n.runTimeout(() => {
          if (!sG.isValid || i0.get(sG.id) !== sH || sH.data.get("afterlife_return") ||
              !sG.hasTag("dbe:join_other_world") || duIsTravelPending(sG)) return;
          let sI = o.getDimension("dbe:other_world"),
            sK = eO(sI).getRegion("other_world");
          sK && (sH.trySetProperty("dbe:is_death", !0), sK.teleportToRegion(sG));
        }, 20);
  }
  afterWorldLoad(sG) {
    o.gameRules.showTags = !1;
    try {
      for (let entity of o.getDimension("dbe:hyperbolic_time_chamber").getEntities()) removeTimeChamberHostile(entity);
    } catch (error) {
      console.warn("[Dragon Universe] Time chamber hostile cleanup failed:", error);
    }
  }
  afterProjectileHitBlock({ dimension: sG, location: sH, projectile: sI }) {
    if (sI.typeId === "dbe:ki_attack") {
      let sK = i3.getKiAttackEntity(sI);
      sK && jK.explodeAttack(sK, sG, sH);
    }
  }
  afterProjectileHitEntity(sG) {
    let { dimension: sH, location: sI, projectile: sK } = sG;
    if (sK.typeId === "dbe:ki_attack") {
      let sL = i3.getKiAttackEntity(sK);
      if (sL) {
        let { entity: sM } = sG.getEntityHit();
        jK.explodeAttack(sL, sH, sI, sM);
      }
    }
  }
  afterPlayerSwingStart({ heldItemStack: sG, player: sH, swingSource: sI }) {
    if (sI === i.Attack) {
      let sK = hO(sH),
        { transformations: sL } = sK,
        { currentTransformation: sM } = sL;
      if ((sK.guard.breakGuard(20), sG?.hasTag("dbe:area_damage"))) {
        iB(sK, { radius: 3, damage: 2 });
        return;
      }
      sM.isOozaru && iB(sK, { radius: 6, damage: 2 });
    }
  }
  beforeEntityHurt(sG) {
    ib.applyDamageToEntity(sG);
  }
  beforeEntityItemPickup(sG) {
    let sH = sG.item.getComponent(g.Item)?.itemStack;
    if (sH && sG.entity instanceof m) {
      let sI = hO(sG.entity),
        sK = sI.getCurrentFusion();
      if (iR.isBanned(sH.typeId)) {
        sG.cancel = !0;
        return;
      }
      if (sK && !sK.isController) {
        sG.cancel = !0;
        return;
      }
      if (sH.hasComponent("dbe:patreon") && !sI.redeem.hasCode("patreon")) {
        sG.cancel = !0;
        return;
      }
    }
  }
  beforeExplosion(sG) {
    let sH = sG.getImpactedBlocks();
    for (let { dimension: sI, location: sK } of sH) if (((sG.cancel = eO(sI).isBlockProtection(sK)), sG.cancel)) break;
  }
  beforePlayerInteractWithBlock(sG) {
    let { dimension: sH, location: sI } = sG.block;
    if (sG.block.getTags().includes("dragon_ball")) return;
    let sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  beforePlayerInteractWithEntity(sG) {
    let { itemStack: sH, player: sI, target: sK } = sG;
    const wrapper = i0.get(sI.id);
    if (sH?.hasComponent("dbe:hoi_poi_capsule")) {
      sG.cancel = !0;
      n.run(() => {
        if (sI.isValid && sK.isValid && wrapper && i0.get(sI.id) === wrapper && sI.dimension.id === sK.dimension.id)
          try { iy.tryStoreEntitiesFromLocation(sI, sH, sK.location); }
          catch (error) { console.warn("[Dragon Universe] Capsule interaction failed: " + (error?.stack ?? error)); }
      });
      return;
    }
    if (!wrapper || !sI.isValid || !sK.isValid || duNpcInteractions.get(sI.id)?.wrapper === wrapper) return;
    const dimensionId = sI.dimension.id, token = { wrapper };
    duNpcInteractions.set(sI.id, token);
    try {
      n.run(() => {
        duHandleNpcInteraction(sI, sK, wrapper, dimensionId).catch(error => {
          console.warn("[Dragon Universe] NPC interaction failed: " + (error?.stack ?? error));
        }).finally(() => {
          if (duNpcInteractions.get(sI.id) === token) duNpcInteractions.delete(sI.id);
        });
      });
    } catch (error) {
      if (duNpcInteractions.get(sI.id) === token) duNpcInteractions.delete(sI.id);
      console.warn("[Dragon Universe] NPC interaction scheduling failed: " + (error?.stack ?? error));
    }
  }
  beforePlayerBreakBlock(sG) {
    let { dimension: sH, location: sI } = sG.block;
    if (sG.block.getTags().includes("dragon_ball")) return;
    let sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  beforePlayerPlaceBlock(sG) {
    let { dimension: sH, location: sI } = sG.block,
      sK = eO(sH).getTopRegionAt(sI);
    sK && !sK.canBuild(sG.player) && ((sG.cancel = !0), k5(sG.player, sK.owner));
  }
  onTickEvent() {
    let { currentTick: sG } = n,
      sH = sG % 20 === 0,
      sI = sG % 100 === 2,
      sK = sG % 600 === 3;
    for (let sL of i3.getDBEEntities())
      if (sL instanceof hN) {
        let { cooldowns: sM, player: sN, transformations: sO } = sL;
        if ((j4(sN), sH)) {
          let sP = aN.getEquippedItem(sN, l.Mainhand);
          sL.updateTrainingWeight(),
            ex.fusionHandler(sL),
            eP.syncEntityRegionState(sN),
            k1(sL),
            sP?.typeId === "dbe:dragon_radar" ? jE.scanDragonBalls(sN) : jE.reset(sN);
        }
        if ((sI && (aQ.setPlayerFixedItems(sN, k2), k7(sL), sO.updateAvailableTransformations()), sK)) {
          let sQ = sM.getCooldown("senzu_bean_daily"),
            sR = sM.getCooldown("tail_regeneration");
          sQ?.isExpired() &&
            (sM.clearCooldown("senzu_bean_daily"),
            sN.sendMessage({ translate: "message.senzuBeanDaily.korinWarning" })),
            sR?.isExpired() && sL.addTail();
        }
      }
    hZ.testAllCollisions(i3.getKiAttackEntities());
    sI && iH.updateBalls();
  }
};
function k7(sG) {
  let { player: sH, tasks: sI } = sG,
    { dimension: sK, location: sL } = sH,
    sM = sK.getEntities({ location: sL, maxDistance: 16 });
  for (let sN of sM) sI.isQuestNpc(sN) && sH.spawnParticle("dbe:task_warn", sN.getHeadLocation());
}
var k8 = new k6(),
  k9 = class extends jY {
    constructor(sG, sH) {
      if ((super(sG), !sH)) throw new Error("A conquista fornecida como parâmetro é inválida ou está ausente.");
      this.setTitle("ui.dbe.achievement.title"),
        this.setBody({ rawtext: gX.getFormatedDescription(sH.tasks).rawtext }),
        this.addButton("ui.dbe.backButton", () => cj.displayForm(sG, "achievement_list"));
      // du2_detail (CONTRATO §10.3) lê os índices 1-27: "" em todos, como no kB, para o slot 2 vazio mostrar o body
      for (let k = 1; k <= 27; k++) this.addButton("", () => {});
    }
  },
  kb = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { achievements: sI } = sH;
      jZ.lastMenuId.set(sG.id, "achievement_list"), this.setTitle("ui.dbe.achievement_list.title");
      for (let sK of sI.getVisibleAchievements()) {
        let sL = sK.isCompleted ? this.getCompletedAchievementButtonText(sK) : this.getAchievementButtonText(sK);
        this.addButton(sL, () => new k9(sG, sK).display(), { iconPatch: duAchievementIcon(sK) });
      }
    }
    getAchievementButtonText(sG) {
      return {
        rawtext: [
          {
            translate: "ui.dbe.achievement_list.button.achievement",
            with: { rawtext: [{ translate: sG.titleKey }, { text: "" + sG.progressPercent }] },
          },
          { text: "\n§r" },
          { translate: sG.descriptionKey },
        ],
      };
    }
    getCompletedAchievementButtonText(sG) {
      return {
        rawtext: [
          {
            translate: "ui.dbe.achievement_list.button.completed_achievement",
            with: { rawtext: [{ translate: sG.titleKey }] },
          },
          { text: "\n§r" },
          { translate: sG.descriptionKey },
        ],
      };
    }
  },
  kf = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { attributes: sI } = sH;
      jZ.lastMenuId.set(sG.id, "statistics_view"), this.setTitle("ui.dbe.statistics.title"); // mesmo título do kF; o JSON separa pela flag "du2;" (só o kF manda)
      let sK = [];
      for (let sL of sI.stats.getStats())
        sK.push({ translate: "stat." + sL.id }, { text: ": §u" + sL.getFormatedValue() + "\n§r" });
      this.setBody({ rawtext: sK });
    }
  },
  kj = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { ki: sI, race: sK, transformations: sL } = sH;
      jZ.lastMenuId.set(sG.id, "transformations"), this.setTitle("ui.dbe.transformations.title");
      const forms = [...sL.getTransformations()];
      if (sK.id === "glind") {
        const mystic = forms.findIndex(form => form.id === "ultimate_form");
        if (mystic >= 0 && forms.some(form => form.id === "demon_lord")) {
          const [form] = forms.splice(mystic, 1);
          forms.splice(forms.findIndex(entry => entry.id === "demon_lord"), 0, form);
        }
      }
      for (let sM of forms) {
        let { id: sN, canTransform: sO, isBase: sP, requirements: sQ } = sM;
        if (sP && sO) continue;
        let sR = {
          rawtext: [{ translate: sK.id + ".transformation." + sN }, ...(dC.listDescription(sQ).rawtext ?? [])],
        };
        this.addButton(
          sR,
          () => {
            sO && sI.currentValue ? sM.transform() : cj.displayForm(sG, "transformations");
          },
          { iconPatch: sO ? "" : DU_ICON + "lock" }, // 12b (CONTRATO §10.2)
        );
      }
    }
  },
  kk = class extends jY {
    constructor(sG) {
      super(sG);
      let { alignment: sH } = hO(sG);
      this.setTitle("ui.dbe.alignment_question.title"),
        this.setBody("ui.dbe.alignment_question.text"),
        this.addButton("ui.dbe.alignment_question.button.to_protect", () => sH.addAlignment(5)),
        this.addButton("ui.dbe.alignment_question.button.for_my_self", () => sH.removeAlignment(1)),
        this.addButton("ui.dbe.alignment_question.button.for_evil", () => sH.removeAlignment(5)),
        this.onResponse((sI) => {
          sI.canceled || this.skipAlignmentQuestion();
        });
    }
    skipAlignmentQuestion() {
      this.initiator.removeTag("dbe_alignment_question"), cj.displayForm(this.initiator, "quest_list");
    }
  };
// sorteia um valor em [0, sG) fora de sH (randomExclude dos dados da raça); sem sobra, ignora a exclusão
function kpPick(sG, sH) {
  let sI = Array.isArray(sH) ? sH : [],
    sK = [];
  for (let sL = 0; sL < sG; sL++) sI.includes(sL) || sK.push(sL);
  return sK.length ? sK[Math.floor(Math.random() * sK.length)] : Math.floor(Math.random() * sG);
}
function kp(sG) {
  let { playerCustomization: sH } = sG,
    sI = fR.getAvailableRaces(sG),
    sK = Math.floor(Math.random() * sI.length),
    sL = sI[sK];
  sG.trySetProperty("dbe:race", sL.id), (sH.raceIndex = fR.getIndex(sL.id) ?? 0);
  let { activeCustomizations: sM } = sH,
    { options: sN } = sM;
  if (sN) {
    let sO = Object.entries(sN);
    for (let [sP, sQ] of sO) {
      // randomExclude: opções que o sorteio não usa, mas que continuam escolhíveis na criação e na barbearia
      if (sQ.type === "variant") {
        let sR = kpPick(sQ.optionCount, sQ.randomExclude);
        sH.setOptionValue(sP, sR);
      }
      if (sQ.type === "color") {
        let sS = kpPick(sQ.palette.length, sQ.randomExclude);
        sH.setOptionValue(sP, sS);
      }
    }
  }
  if (sM.hasGender) {
    let sT = Math.round(Math.random());
    sH.setGender(sT ? "female" : "male");
  }
  return sL;
}
// Redesign 1.7.17 (redesign/CONTRATO.md): ordem dos atributos nas Estatísticas e no bônus de raça; multiplicador como texto.
const DU_ATTRIBUTE_ORDER = ["constitution", "dexterity", "spirit", "strength", "willpower"];
// sempre com pelo menos 1 casa (x1.0, x2.0, x1.5) e no máximo 2, para não arredondar dado real (x1.25, x1.15)
const duMultiplierText = (value) => {
  const n = parseFloat(Number(value).toFixed(2));
  return "x" + (Number.isInteger(n * 10) ? n.toFixed(1) : String(n));
};
const DU_RACE_GRID = 8; // botões 4-11 da seleção de raça
// Jogadores com o formulário de customização aberto (ver showCustomizationForm e afterItemUse).
var duCustomizationOpen = new Set();
// Quem sai com a customização aberta não pode voltar "travado" (sem abrir a seleção de raça).
o.afterEvents.playerLeave.subscribe(({ playerId: sG }) => duCustomizationOpen.delete(sG));
var kq = class t8 extends jY {
    constructor(sG, sH = 1) {
      super(sG), (this.selectedRaceIndex = sH);
      let sI = hO(this.initiator),
        sK = fR.getAvailableRaces(sI),
        sL = sK[sH];
      if (!sL) return;
      let sM = sL.getData();
      if (!sM) return;
      sI.trySetProperty("dbe:race", sM.id);
      let { playerCustomization: sN } = sI;
      (sN.raceIndex = sH),
        sN.reset(),
        this.setTitle("ui.dbe.select_race.title"),
        // redesign/CONTRATO.md, seção 4: body = só a descrição longa; 0-3 = navegação, 4-11 = grade de raças,
        // 12-31 = slots de dado (botões que o JSON UI só lê, sem clique).
        this.setBody({ rawtext: [{ translate: sM.id + ".description" }] }),
        this.addButton(this.lockRace ? "" : "ui.dbe.bigPreviousButton", () => this.selectRaceByIndex(sH - 1, sK)),
        this.addButton({ translate: "ui.dbe.select_race.button.select_race", with: { rawtext: [{ translate: sM.id }] } },
          async () => this.showCustomizationForm(sM.id)),
        this.addButton(this.lockRace ? "" : "ui.dbe.select_race.button.random_select", async () => {
          let sO = kp(sI);
          this.showCustomizationForm(sO.id);
        }),
        this.addButton(this.lockRace ? "" : "ui.dbe.bigNextButton", () => this.selectRaceByIndex(sH + 1, sK));
      for (let k = 0; k < DU_RACE_GRID; k++) {
        const race = sK[k];
        if (!race || (this.lockRace && k !== sH)) this.addButton("", () => {});
        else this.addButton((k === sH ? "*" : "") + race.id, () => this.selectRaceByIndex(k, sK), { iconPatch: "textures/ui/du2/icons/race_" + race.id });
      }
      const info = duRaceInfo(sM.id),
        slot = (content, icon) => this.addButton(content, () => {}, icon ? { iconPatch: icon } : void 0);
      slot(sM.id + ".description.short"); // 12
      slot(info ? duMultiplierText(info.regen) : ""); // 13
      slot(info ? "" + info.formCount : ""); // 14
      slot(info ? (info.gender ? "ui.dbe.yes" : "ui.dbe.no") : ""); // 15
      slot(info ? { rawtext: duFirstFormsRawtext(info) } : ""); // 16
      slot(sM.id + ".customization"); // 17
      slot(sH + 1 + " / " + sK.length); // 18
      slot(sM.id); // 19
      const bonuses = info ? info.bonuses.map(({ id, value }) => ({ key: "attribute." + id, icon: "attr_" + id, value })) : [];
      if (info && info.size !== 1) bonuses.push({ key: "ui.dbe.size", icon: "attr_size", value: info.size });
      for (let k = 0; k < 6; k++) slot(bonuses[k]?.key ?? "", bonuses[k] && "textures/ui/du2/icons/" + bonuses[k].icon); // 20-25
      for (let k = 0; k < 6; k++) slot(bonuses[k] ? duMultiplierText(bonuses[k].value) : ""); // 26-31
    }
    lockRace = !1;
    confirmRaceSelection(sG) {
      let sH = hO(this.initiator);
      sH.setRace(sG), sH.startAdventure();
    }
    selectRaceByIndex(sG, sH) {
      let sI = sH.length,
        sK = this.lockRace ? this.selectedRaceIndex : (sG + sI) % sI;
      new t8(this.initiator, sK).display();
    }
    async showCustomizationForm(sG) {
      let sI = this.initiator.id;
      // um laço por jogador: dois laços mostravam formulários com valores diferentes
      if (duCustomizationOpen.has(sI)) return;
      duCustomizationOpen.add(sI);
      try {
        for (; this.initiator.isValid; ) {
          let sH = await new kv(this.initiator).display(!0);
          if (sH && Number(sH.selection) <= 1) {
            sH.selection === 1 && this.confirmRaceSelection(sG);
            break;
          }
          // UserBusy (formulário anterior ainda fechando, chat aberto): espera em vez de recriar a cada tick (C20)
          if (sH?.cancelationReason === "UserBusy") await new Promise((sK) => gU.runTimeout(sK, 5));
        }
      } finally {
        duCustomizationOpen.delete(sI);
      }
    }
  },
  kv = class extends jY {
    constructor(sG) {
      super(sG);
      let { playerCustomization: sH } = hO(sG);
      this.setTitle("ui.dbe.customization.title"),
        this.addButton("ui.dbe.backButton", () => new kq(sG, sH.raceIndex).display()),
        this.addButton("ui.dbe.customization.button.confirm", () => {}),
        this.setBody(this.generateCustomizationData());
    }
    // 12d (CONTRATO §10.4): 2-17 = setas da linha k (2+2k ◀, 3+2k ▶), 18-25 = nome da linha k (com ícone cust_<id>),
    // 26-33 = valor "<n>/<total>". Sempre 8 linhas: as que sobram vêm vazias. Body = nomes, como reserva.
    generateCustomizationData() {
      let { playerCustomization: sG } = hO(this.initiator),
        { activeCustomizations: sH, gender: sI } = sG,
        sK = [],
        rows = [];
      if (sH.hasGender) {
        sK.push({ translate: "customization.gender" }, { text: "\n" });
        // lê o gênero na hora do clique: um formulário reexibido não pode desfazer a escolha
        let sL = () => sG.setGender(sG.gender === "male" ? "female" : "male");
        this.addButton(" ", sL), this.addButton(" ", sL);
        rows.push({ id: "gender", value: (sI === "female" ? 2 : 1) + "/2" });
      }
      for (let sM in sH.options) {
        let sN = sG.getOption(sM);
        if (
          !sN ||
          (sN.activeGenders && !sN.activeGenders.includes(sI)) ||
          (sN.type === "variant" ? sN.optionCount : sN.palette.length) <= 1
        )
          continue;
        sK.push({ translate: "customization." + sM }, { text: "\n" });
        // valor atual lido no clique (antes: o valor de quando o formulário foi montado; um formulário
        // reexibido ou atrasado aplicava "antigo ± 1" e a opção voltava para a anterior)
        this.addButton(" ", () => sG.setOptionValue(sM, sG.getOptionValue(sM) - 1)),
          this.addButton(" ", () => sG.setOptionValue(sM, sG.getOptionValue(sM) + 1));
        rows.push({ id: sM, value: duOptionValue(sG, sM, sN) });
      }
      duCustomizationSlots(this, rows, 8);
      return sK.length ? { rawtext: sK } : "";
    }
  },
  kw = class extends jY {
    dbePlayer;
    skills;
    slots = new Array(17).fill(void 0);
    constructor(sG, sH = 0) {
      super(sG),
        (this.dbePlayer = hO(sG)),
        (this.skills = this.dbePlayer.skills),
        this.setTitle("ui.dbe.functions.title");
      let sI = this.skills.getSkillsByType("toggle");
      sH === 0 && (this.slots[1] = this.getSelectTransformationButtonConfig()),
        sH === 1 && (this.slots[7] = this.getTailModeButtonConfig());
      let sK = sH * 9,
        sL = sK + 8;
      for (let sM of sI) {
        let sN = sM.functionSlotIndex;
        if (sN === void 0 || sN < sK || sN > sL || !dC.testAll(this.dbePlayer, sM.requirements)) continue;
        let sO = sN - sK;
        this.slots[sO] = this.getSkillToggleButtonConfig(sM);
      }
      for (let sP = 0; sP < this.slots.length; sP++) {
        if (sP === 4) {
          this.addButton("ui.dbe.functions.button.more");
          continue;
        }
        let sQ = this.slots[sP];
        sQ ? this.addButton(sQ.text, sQ.callback) : this.addButton(" ");
      }
    }
    getSkillToggleButtonConfig(sG) {
      return {
        text: sG.canSwitchTier
          ? sG.getTranslationKey()
          : {
              rawtext: [
                { translate: "skill." + sG.id },
                { text: " " },
                { translate: "skill." + (sG.isEnabled ? "enabled" : "disabled") },
              ],
            },
        callback: () => (sG.canSwitchTier ? sG.increaseTier() : sG.isEnabled ? sG.disable() : sG.enable()),
      };
    }
    getSelectTransformationButtonConfig() {
      let { transformations: sG } = this.dbePlayer,
        { selectedTransformation: sH } = sG,
        sI = sG.getCurrentBaseTransformation(),
        sK = sG.getAvailableTransformations().filter(({ id: sL, isBase: sM }) => !sM || (sM && sL === sI.id));
      if (this.dbePlayer.race.id === "glind") {
        const mystic = sK.findIndex(form => form.id === "ultimate_form");
        if (mystic >= 0 && sK.some(form => form.id === "demon_lord")) {
          const [form] = sK.splice(mystic, 1);
          sK.splice(sK.findIndex(entry => entry.id === "demon_lord"), 0, form);
        }
      }
      return {
        text: "" + sH.localizationKey,
        callback: () => {
          let sL = (sK.indexOf(sH) + 1) % sK.length,
            sM = sK[sL];
          sM && (sG.selectedTransformationId = sM.id);
        },
      };
    }
    getTailModeButtonConfig() {
      let { hasTail: sG, race: sH } = this.dbePlayer;
      if (sH.id !== "saiyan" || !sG) return;
      let sI = this.initiator.getProperty("dbe:tail_curled");
      return {
        text: {
          rawtext: [
            {
              translate: "ui.dbe.functions.button.tail_mode",
              with: { rawtext: [{ translate: "tailMode." + (sI ? "curled" : "loose") }] },
            },
          ],
        },
        callback: () => this.dbePlayer.trySetProperty("dbe:tail_curled", !sI),
      };
    }
  },
  kx = class extends kw {
    constructor(sG) {
      super(sG, 0),
        this.onResponse((sH) => {
          !sH.canceled && sH.selection !== 4 && cj.displayForm(this.initiator, "main_functions"),
            sH.selection === 4 && cj.displayForm(this.initiator, "side_functions");
        });
    }
  },
  ky = class extends kw {
    constructor(sG) {
      super(sG, 1),
        this.onResponse((sH) => {
          !sH.canceled && sH.selection !== 4 && cj.displayForm(this.initiator, "side_functions"),
            sH.selection === 4 && cj.displayForm(this.initiator, "main_functions");
        });
    }
  },
  kz = class extends jZ {
    constructor(sG) {
      super(sG),
        this.setTitle("ui.dbe.news.title"),
        this.setBody({
          rawtext: [
            { translate: "pack.news" },
          ],
        });
    }
  };
function kA(sG) {
  return {
    translate: "message.objective.recentlyStarted",
    with: { rawtext: [{ ...aM.convertTimeToRawText(sG * 50) }] },
  };
}
// Item 12 da 1.7.18 (redesign/CONTRATO.md §10): ícones do du2, sempre "textures/ui/du2/icons/<nome>" sem extensão. A
// cor é fixa por ícone e decidida no JSON, que compara o caminho: o script manda só o caminho exato.
const DU_ICON = "textures/ui/du2/icons/";
// Tela Treino (§13): linha 1 (ação) + "\n" + linha 2 (estado); com a linha 2 vazia, só a chave da linha 1.
function duTrainingLine(action, state) {
  const part = (v) => (typeof v === "string" ? [{ translate: v }] : Array.isArray(v) ? v : [v]);
  if (state === "" || state === undefined) return action;
  return { rawtext: [...part(action), { text: "\n" }, ...part(state)] };
}
// "Recarrega em <tempo>" de um cooldown (§13.1)
function duRecharge(cooldown) {
  return { translate: "ui.dbe.training.status.recharge", with: { rawtext: [aM.convertTimeToRawText(cooldown.getRemainingTicks() * 50)] } };
}
// multiplicador de treino no código "mul;x<n>" (§13.1): inteiro sem casas, senão até 2
const duTrainingMult = (value) => "x" + parseFloat(Number(value).toFixed(2));
const DU_QUEST_TYPE_ICON = { main: "quest_main", mentor: "quest_mentor", side: "quest_side", challenge: "quest_challenge" };
const DU_ACHIEVEMENT_ICON = { battle_power: "ach_battle_power", defeat_enemy: "ach_defeat", item: "ach_item",
  learn_skill: "ach_skill", requirement: "ach_requirement" };
// Prioridade (§10.1): bloqueada (não iniciada e o objetivo atual não pode começar) > concluída > tipo.
function duQuestIcon(quest) {
  const objective = quest.getInProgressObjective(),
    name = !objective ? "quest_done" : !quest.isStarted && !objective.canStart ? "lock" : DU_QUEST_TYPE_ICON[quest.type];
  return name ? DU_ICON + name : "";
}
// 12d: valor atual de uma opção de customização, "<n>/<total>" com n a partir de 1.
function duOptionValue(customization, id, option) {
  const total = option.type === "variant" ? option.optionCount : option.palette.length;
  return customization.getOptionValue(id) + 1 + "/" + total;
}
// 12d: completa as setas até `max` linhas (pares vazios, sem clique) e manda os nomes (com ícone) e os valores.
function duCustomizationSlots(form, rows, max) {
  const noop = () => {};
  for (let k = rows.length; k < max; k++) form.addButton("", noop), form.addButton("", noop);
  for (let k = 0; k < max; k++)
    rows[k] ? form.addButton("customization." + rows[k].id, noop, { iconPatch: DU_ICON + "cust_" + rows[k].id }) : form.addButton("", noop);
  for (let k = 0; k < max; k++) form.addButton(rows[k]?.value ?? "", noop);
}
// Concluída > categoria (o type da 1ª tarefa). Categoria sem ícone: "" (a linha fica sem ícone).
function duAchievementIcon(achievement) {
  const name = achievement.isCompleted ? "ach_done" : DU_ACHIEVEMENT_ICON[achievement.achievementData?.tasks?.[0]?.type];
  return name ? DU_ICON + name : "";
}
var kB = class extends jY {
    constructor(sG, sH) {
      if ((super(sG), !sH)) throw new Error("A missão fornecida como parâmetro é inválida ou está ausente.");
      let sI = sH.getRecommendedLevel(),
        sK = sH.getInProgressObjective();
      if (!sK) return;
      let { restartCooldown: sL, startRequirements: sM } = sK,
        sN;
      for (let sP of sK.getTasks()) if (((sN = sP.startError), sN)) break;
      this.setTitle("ui.dbe.quest.title"),
        this.setBody({
          rawtext: [
            { text: "§u" },
            { translate: sH.titleKey },
            { text: "\n§6" },
            { translate: "ui.dbe.quest.recommended_level", with: ["" + sI] },
            { text: "§r\n\n" },
            { translate: sH.descriptionKey },
            { text: "\n\n" },
            { translate: "ui.dbe.quest.objectives", with: { rawtext: [{ rawtext: sH.listObjectives().rawtext }] } },
            ...(sM.length
              ? [
                  { text: "\n\n" },
                  {
                    translate: "ui.dbe.quest.requirements",
                    with: { rawtext: [{ rawtext: dC.listDescription(sM).rawtext }] },
                  },
                ]
              : []),
            ...(sH.getRewards().length
              ? [
                  { text: "\n\n" },
                  { translate: "ui.dbe.quest.rewards", with: { rawtext: [{ rawtext: sH.listRewards().rawtext }] } },
                ]
              : []),
            ...(sL && !sL.isExpired() ? [{ text: "\n\n" }, kA(sL.getRemainingTicks())] : []),
            ...(sN ? [{ text: "\n\n" }, this.getErrorMessage(sN)] : []),
          ],
        }),
        this.addButton("ui.dbe.backButton", () => cj.displayForm(sG, "quest_list"));
      // 1 = Iniciar/Reiniciar (mesmas condições de antes); sem botão, "" para os índices seguintes não andarem
      let sO = "ui.dbe.quest.button.start",
        start;
      if (sK.canStart) {
        if (!sH.isStarted) start = () => sH.startQuest();
        else if (!sK.isStarted) start = () => sK.startObjective();
        else if (sL && sL.isExpired()) (sO = "ui.dbe.quest.button.restart"), (start = () => sH.restartInProgressObjective());
      }
      start ? this.addButton(sO, start) : this.addButton("", () => {});
      this.addDetailSlots(sH, sI, sL, sM, sN);
    }
    // 12c (CONTRATO §10.3): 2 título, 3 tipo (com o ícone da lista), 4 nível (código), 5 descrição, 6-13 objetivos,
    // 14-17 requisitos, 18-25 recompensas (com ícone pelo tipo), 26 espera para reiniciar, 27 erro de início.
    // Só leitura (sem clique). O body continua completo, como reserva.
    addDetailSlots(quest, level, cooldown, requirements, startError) {
      const noop = () => {},
        slot = (content, icon) => this.addButton(content, noop, icon ? { iconPatch: icon } : void 0),
        fill = (list, max, make) => {
          for (let k = 0; k < max; k++) list[k] ? make(list[k]) : slot("");
        };
      slot({ rawtext: [{ translate: quest.titleKey }] });
      slot("quest." + quest.type + ".single", duQuestIcon(quest));
      slot("" + level);
      slot({ rawtext: [{ translate: quest.descriptionKey }] });
      // mesma ordem e filtro do listObjectives (iniciada = só o objetivo atual; não iniciada = todos), sem "\n N. "
      const objectives = [];
      for (const objective of quest.isStarted ? [quest.getInProgressObjective()] : quest.getAllObjectives()) {
        const text = objective && gX.getFormatedDescription(objective.getTasks(), objective.durationCooldown).rawtext;
        text && objectives.push({ rawtext: [...(objective.isCompleted ? [{ text: "*" }] : []), ...text] });
      }
      fill(objectives, 8, (text) => slot(text));
      // mesmo filtro do dC.listDescription usado no body (sem jogador), um requisito por slot, sem "\n- "
      fill(requirements.filter((r) => !r.exceptRaceIds?.includes(void 0) && dC.get(r.test)), 4, (r) =>
        slot({ rawtext: [dC.getDescription(r)] }));
      const rewardIcon = { item: "ach_item", points: "skill_points", zeni: "reward_zeni", z_points: "reward_xp" };
      fill(quest.getRewards().filter((r) => r.description?.rawtext), 8, (r) => {
        const icon = rewardIcon[r.rewardData?.type];
        slot({ rawtext: r.description.rawtext }, icon ? DU_ICON + icon : "");
      });
      slot(cooldown && !cooldown.isExpired() ? { rawtext: [kA(cooldown.getRemainingTicks())] } : "");
      slot(startError ? { rawtext: [this.getErrorMessage(startError)] } : "");
    }
    getErrorMessage(sG) {
      return sG === "SafeRegion"
        ? { translate: "message.quest.error.safeRegion" }
        : sG === "TrainingWeight"
          ? { translate: "message.quest.error.trainingWeight" }
          : { translate: "message.quest.error.commonError" };
    }
  },
  kC = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { quests: sI } = sH;
      jZ.lastMenuId.set(sG.id, "quest_list"), this.setTitle("ui.dbe.quest_list.title");
      for (let sK of sI.getQuests()) {
        let sL = {
          rawtext: [
            {
              translate: "ui.dbe.quest_list.button.quest",
              with: { rawtext: [{ translate: "quest." + sK.type + ".single" }, { translate: sK.titleKey }] },
            },
          ],
        };
        this.addButton(sL, () => new kB(this.initiator, sK).display(), { iconPatch: duQuestIcon(sK) });
      }
    }
  },
  kD = class extends jZ {
    constructor(sG) {
      super(sG);
      let sH = hO(sG);
      jZ.lastMenuId.set(sG.id, "skills");
      let sI = [];
      for (let sK of sH.skills.getSkills()) sK.canBeUpgraded && sI.push(sK);
      // 12e (CONTRATO §10.5): 10 = Transformações, 11 = pontos ("pts;<n>", só leitura, com ícone), 12+ = habilidades
      this.setTitle("ui.dbe.skills.title"),
        this.setBody(this.listInfo(sI)),
        this.addButton("ui.dbe.skills.button.transformations", () => cj.displayForm(sG, "transformations"));
      this.addButton("pts;" + aO.shortenNumber(sH.pointsManager.get("skill_points")), () => cj.displayForm(sG, "skills"),
        { iconPatch: DU_ICON + "skill_points" });
      for (let sL of sI) {
        let sM = sL.level >= sL.maxLevel,
          sN = {
            rawtext: [
              {
                translate: sM ? "ui.dbe.skills.button.maximized_skill" : "ui.dbe.skills.button.upgrade_skill",
                with: { rawtext: [{ translate: "skill." + sL.id }, { text: "" + sL.level }] },
              },
              ...(sM ? [] : [{ text: " " }, ...(d6(sL.upgradeCost, "skill_points").rawtext ?? [])]),
            ],
          };
        this.addButton(sN, () => {
          let { pointsManager: sO } = sH;
          sL.level < sL.maxLevel &&
            sO.trySpend("skill_points", sL.upgradeCost) &&
            (sL.upgradeSkill(), sG.playSound("ui.upgrade")),
            cj.displayForm(sG, "skills");
        }, { iconPatch: sM ? DU_ICON + "skill_max" : "" });
      }
    }
    // Os pontos saíram do body (vão no slot 11); o body só avisa quando não há habilidade para melhorar.
    listInfo(sG) {
      return sG.length ? "" : { rawtext: [{ translate: "ui.dbe.skills.text.empty" }] };
    }
  },
  kE = new Map(),
  kF = class extends jZ {
    // Layout do redesign 1.7.17 (redesign/CONTRATO.md, seção 3): 10 = Informações, 11-13 = x1/x10/x100, 14-18 = comprar
    // atributo, 19 reservado, 20-47 = slots de dado (botões que o JSON UI só lê, sem clique). Body = flag "du2;".
    constructor(sG) {
      super(sG);
      let sH = hO(sG),
        { attributes: sI } = sH,
        sK = kE.get(sG.id) ?? 1;
      jZ.lastMenuId.set(sG.id, "statistics"), this.setTitle("ui.dbe.statistics.title");
      this.addButton("ui.dbe.statistics.button.info", () => cj.displayForm(sG, "statistics_view"));
      for (const amount of [1, 10, 100])
        this.addButton((amount === sK ? "*" : "") + "x" + amount, () => {
          kE.set(sG.id, amount), cj.displayForm(sG, "statistics");
        });
      const attributes = new Map([...sI.getAttributes()].map((attribute) => [attribute.id, attribute])),
        rows = DU_ATTRIBUTE_ORDER.map((id) => attributes.get(id));
      for (const sL of rows) {
        if (!sL) {
          this.addButton("", () => {});
          continue;
        }
        const sP = sL.getUpgradeCost(sK);
        this.addButton("attribute." + sL.id, () => {
          this.tryBuyAttribute(sL, sK, sP), cj.displayForm(sG, "statistics");
        }, { iconPatch: "textures/ui/du2/icons/attr_" + sL.id });
      }
      this.addButton("", () => {}); // 19 reservado
      const slot = (content) => this.addButton(content, () => {});
      const { alignment: alignment, masteries: masteries, masterManager: masterManager, race: race, trainingMultiplier: training,
          pointsManager: points, transformations: transformations, level: level } = sH,
        { currentTransformation: form } = transformations,
        mastery = masteries.getMastery(form.id),
        stat = (id) => aO.shortenNumber(Math.round(sI.stats.getStat(id)?.value ?? 0)),
        next = level.getPointsToNextLevel();
      slot(race.id); // 20
      slot({ rawtext: [{ translate: "" + form.localizationKey }, { text: mastery ? " x" + mastery.masteryMultiplier : "" }] }); // 21
      slot("alignment." + alignment.getAlignment()); // 22
      slot(masterManager.getMasterLocalizationKey()); // 23
      slot("" + level.currentLevel); // 24
      slot(level.currentPoints + " / " + next + " XP"); // 25 (XP cru, como antes)
      slot("" + (Math.max(0, Math.min(10, Math.floor((10 * Number(level.currentPoints)) / Math.max(1, Number(next))))) || 0)); // 26 (código, 0..10)
      slot({ translate: "ui.dbe.statistics.free_points", with: [aO.shortenNumber(points.get("attribute_points"))] }); // 27
      slot(aO.shortenNumber(Math.round(sI.battlePower ?? 0))); // 28
      slot(stat("melee_damage")); // 29
      slot(stat("defense")); // 30
      slot(stat("max_ki")); // 31
      for (const sL of rows) slot(sL ? "" + sL.value : ""); // 32-36
      for (const sL of rows) slot(sL ? duMultiplierText(sI.modifiers.getMultiplier(sL.id)) : ""); // 37-41
      for (const sL of rows) slot(sL ? d6(sL.getUpgradeCost(sK), "attribute_points") : ""); // 42-46
      slot(training !== 1 ? "x" + parseFloat(Number(training).toFixed(2)) : ""); // 47
      this.setBody("du2;"); // du2; = layout novo (o kf, mesmo título, não manda). "ozr;" saiu: a UI não lê mais (5ba9258)
    }
    tryBuyAttribute(sG, sH, sI) {
      if (sG.value + sH >= sG.maxValue) return;
      let { pointsManager: sK } = hO(this.initiator);
      sK.trySpend("attribute_points", sI) && sG.addValue(sH, !0);
    }
  };
import { CONFIG as kG } from "../config/config.js";
var kH = class extends jZ {
    // Tela Treino (CONTRATO §13.1, Engrenagem): 10 = "mul;x<n>" (multiplicador de treino, "" em x1), 11 = "",
    // 12 sombra, 13 concentração, 14 flexões, 15 treino mental. As 4 linhas vêm sempre; o estado decide o texto (duas
    // linhas: ação e estado), o ícone (iconPatch) e o clique. Prioridade: em andamento > outro treino ativo > bloqueado
    // > recarga/limite > disponível. Linha bloqueada ou em recarga: mensagem do motivo e reabre a tela.
    constructor(sG) {
      super(sG), jZ.lastMenuId.set(sG.id, "training"), this.setTitle("ui.dbe.training.title"), this.setBody("");
      let sH = hO(sG),
        { concentrationTraining: sI, physicalTraining: sK } = sH,
        sL = sH.mentalTraining,
        sM = sI.isTraining ? "concentration" : sK?.active ? "physical" : sL?.active ? "mental" : void 0,
        reopen = () => cj.displayForm(sG, "training"),
        warn = (key) => () => (sG.sendMessage({ translate: key }), reopen()),
        mult = sH.trainingMultiplier ?? 1;
      sI.checkAndUpdateAttempts();
      this.addButton(mult === 1 ? "" : "mul;" + duTrainingMult(mult), reopen, { iconPatch: DU_ICON + "tab_training" }); // 10
      this.addButton("", reopen); // 11
      // 12 sombra
      let shadowCd = sH.cooldowns.getCooldown("shadow_dummy");
      if (sM) this.addButton(duTrainingLine("ui.dbe.training.button.shadow_dummy", "ui.dbe.training.status.busy"), warn("ui.dbe.training.physical.blocked.busy"), { iconPatch: DU_ICON + "lock" });
      else if (shadowCd && !shadowCd.isExpired())
        this.addButton(duTrainingLine("ui.dbe.training.button.shadow_dummy", duRecharge(shadowCd)), () => (this.shadowTraining(), reopen()), { iconPatch: DU_ICON + "clock" });
      else this.addButton("ui.dbe.training.button.shadow_dummy", () => this.shadowTraining(), { iconPatch: DU_ICON + "train_shadow" });
      // 13 concentração
      let concCd = sH.cooldowns.getCooldown("concentration_training"),
        maxTries = kG.CONCENTRATION?.MAX_ATTEMPTS ?? 5;
      if (sM === "concentration")
        this.addButton(duTrainingLine("ui.dbe.training.button.stop_concentration", "ui.dbe.training.status.active"), () => sI.stopTraining(), { iconPatch: DU_ICON + "train_stop" });
      else if (sM) this.addButton(duTrainingLine("ui.dbe.training.button.concentration", "ui.dbe.training.status.busy"), warn("ui.dbe.training.physical.blocked.busy"), { iconPatch: DU_ICON + "lock" });
      else if (sI.remainingAttempts <= 0)
        this.addButton(duTrainingLine("ui.dbe.training.button.concentration", concCd ? duRecharge(concCd) : ""), warn("ui.dbe.training.concentration.no_tries"), { iconPatch: DU_ICON + "clock" });
      else
        this.addButton(duTrainingLine("ui.dbe.training.button.concentration", [{ translate: "ui.dbe.du2.tries" }, { text: " " + sI.remainingAttempts + "/" + maxTries }]),
          () => sI.startTraining(), { iconPatch: DU_ICON + "train_concentration" });
      // 14 flexões
      let physCd = sK?.checkSeries(),
        maxSeries = sK?.config.DAILY_SERIES ?? 3;
      if (sM === "physical")
        this.addButton(duTrainingLine("ui.dbe.training.button.stop_physical", "ui.dbe.training.status.active"), () => sK.stop(), { iconPatch: DU_ICON + "train_stop" });
      else if (sM) this.addButton(duTrainingLine("ui.dbe.training.button.physical", "ui.dbe.training.status.busy"), warn("ui.dbe.training.physical.blocked.busy"), { iconPatch: DU_ICON + "lock" });
      else if (!sK || sK.data.seriesLeft <= 0)
        this.addButton(duTrainingLine("ui.dbe.training.button.physical", physCd ? duRecharge(physCd) : ""), warn("ui.dbe.training.physical.blocked.daily"), { iconPatch: DU_ICON + "clock" });
      else
        this.addButton(duTrainingLine("ui.dbe.training.button.physical", [{ translate: "ui.dbe.du2.series" }, { text: " " + sK.seriesDone + "/" + maxSeries }]),
          () => cj.displayForm(sG, "training_physical"), { iconPatch: DU_ICON + "train_physical" });
      // 15 treino mental (a lista é o §12.1; até o script dela existir, a linha mostra o estado e reabre a tela)
      let defeated = duListDefeated(sH).length,
        mentalDaily = sL?.dailyDone ?? 0,
        mentalMax = kG.MENTAL?.DAILY_REPEATS ?? 3;
      if (sM === "mental")
        this.addButton(duTrainingLine("ui.dbe.training.button.stop_mental", "ui.dbe.training.status.active"), () => sL.stop(), { iconPatch: DU_ICON + "train_stop" });
      else if (sM) this.addButton(duTrainingLine("ui.dbe.training.button.mental", "ui.dbe.training.status.busy"), warn("ui.dbe.training.physical.blocked.busy"), { iconPatch: DU_ICON + "lock" });
      else if (!defeated)
        this.addButton(duTrainingLine("ui.dbe.training.button.mental", "ui.dbe.training.mental.locked"), warn("ui.dbe.training.mental.locked"), { iconPatch: DU_ICON + "lock" });
      else if (sL?.dailyCooldown?.())
        this.addButton(duTrainingLine("ui.dbe.training.button.mental", duRecharge(sL.dailyCooldown())), reopen, { iconPatch: DU_ICON + "clock" });
      else
        this.addButton(duTrainingLine("ui.dbe.training.button.mental", [{ translate: "ui.dbe.training.mental.daily" }, { text: " " + mentalDaily + "/" + mentalMax }]),
          () => cj.displayForm(sG, "training_mental"), { iconPatch: DU_ICON + "train_mental" });
    }
    shadowTraining() {
      let sG = hO(this.initiator),
        sH = sG.cooldowns.getCooldown("shadow_dummy");
      if (!sH || sH.isExpired()) {
        let { dimension: sI, location: sK } = this.initiator,
          sL = d2(sI, sK, 4);
        sL
          ? (sG.cooldowns.setCooldown("shadow_dummy", kG.SHADOW_DUMMY_COOLDOWN_TICKS),
            sG.despawnShadowDummies(),
            sG.trySpawnShadowDummy(sL))
          : this.initiator.sendMessage({ translate: "message.summon.obstructedArea" });
      } else {
        let sM = aM.convertTimeToRawText(sH.getRemainingTicks() * 50);
        this.initiator.sendMessage({
          translate: "message.shadowDummy.cooldownWarning",
          with: { rawtext: [{ ...sM }] },
        });
      }
    }
  },
  // Séries das flexões (CONTRATO §13.2): 10 = "day;<feitas>/<máx>", 11 = "", 12–14 = séries 20/30/50, 15 = modo
  // alternativo. Clique numa série: confere os requisitos; se falhar, mensagem do motivo e reabre; senão a contagem
  // começa (a tela fecha).
  kHPhysical = class extends jZ {
    constructor(sG) {
      super(sG), jZ.lastMenuId.set(sG.id, "training"), this.setTitle("ui.dbe.training_physical.title"), this.setBody("");
      let sH = hO(sG).physicalTraining,
        reopen = () => cj.displayForm(sG, "training_physical"),
        sI = sH.config,
        sK = sH.checkSeries();
      this.addButton("day;" + sH.seriesDone + "/" + sI.DAILY_SERIES, reopen, { iconPatch: DU_ICON + "train_physical" }); // 10
      this.addButton("", reopen); // 11
      for (let sL of [20, 30, 50]) {
        let sM = { translate: "ui.dbe.training.physical.series", with: ["" + sL] },
          sN = sI.SERIES_MIN_LEVEL?.[sL] ?? 0;
        if (sN > hO(sG).level.currentLevel)
          this.addButton(duTrainingLine(sM, { translate: "ui.dbe.training.physical.locked_level", with: ["" + sN] }),
            () => (sG.sendMessage({ translate: "ui.dbe.training.physical.blocked.level" }), reopen()), { iconPatch: DU_ICON + "lock" });
        else if (sH.data.seriesLeft <= 0)
          this.addButton(duTrainingLine(sM, sK ? duRecharge(sK) : ""),
            () => (sG.sendMessage({ translate: "ui.dbe.training.physical.blocked.daily" }), reopen()), { iconPatch: DU_ICON + "clock" });
        else
          this.addButton(duTrainingLine(sM, { translate: "ui.dbe.training.physical.reward", with: [Math.round(100 * sH.rewardShare(sL)) + "%"] }),
            () => {
              let sO = sH.start(sL);
              sO && (sG.sendMessage({ translate: "ui.dbe.training.physical.blocked." + sO }), reopen());
            }, { iconPatch: DU_ICON + "train_physical" });
      }
      let sP = !!sH.data.altMode; // 15
      this.addButton(duTrainingLine("ui.dbe.training.physical.alt_mode", sP ? "ui.dbe.yes" : "ui.dbe.no"),
        () => (sH.toggleAltMode(), reopen()), { iconPatch: DU_ICON + (sP ? "check" : "close") });
    }
  },
  // Treino mental, lista de réplicas (CONTRATO §12.1): 10 = "day;<n>/<máx>" (vitórias repetidas que contam hoje) com
  // train_mental, 11 = "", 12+ = um botão por chefe na ordem da campanha (progression_data), vencidos ou não. Texto: nome
  // + "\n" + estado; ícone lock (não vencido na campanha) / quest_done (as duas dificuldades) / train_mental.
  kHMental = class extends jZ {
    constructor(sG) {
      super(sG), jZ.lastMenuId.set(sG.id, "training"), this.setTitle("ui.dbe.training_mental.title"), this.setBody("");
      let sH = hO(sG).mentalTraining,
        sI = sH.config,
        reopen = () => cj.displayForm(sG, "training_mental");
      this.addButton("day;" + sH.dailyDone + "/" + sI.DAILY_REPEATS, reopen, { iconPatch: DU_ICON + "train_mental" }); // 10
      this.addButton("", reopen); // 11
      for (let sK of DU_BOSS_IDS) {
        let sL = { translate: "entity." + sK + ".name" };
        if (!sH.isUnlocked(sK)) {
          this.addButton({ rawtext: [sL, { text: "\n" }, { translate: "ui.dbe.training.mental.locked" }] }, reopen, { iconPatch: DU_ICON + "lock" });
          continue;
        }
        let sM = sH.clearsOf(sK),
          sN = sM.memory && sM.challenge;
        this.addButton(
          { rawtext: [sL, { text: "\n" }, { translate: "ui.dbe.training.mental.status", with: [sM.memory ? "✓" : "–", sM.challenge ? "✓" : "–", sM.best ? duFormatTicks(sM.best) : "–"] }] },
          () => cj.displayForm(sG, "training_mental_confirm", !1, sK),
          { iconPatch: DU_ICON + (sN ? "quest_done" : "train_mental") },
        );
      }
    }
  },
  // Treino mental, confirmação (CONTRATO §12.2): 0 Voltar, 1/2 Começar Memória/Desafio ("" quando não pode), 3 nome com
  // train_mental, 4 melhor tempo, 5 vitórias repetidas hoje, 6 aviso, 7/9 nível de cada dificuldade, 8/10 recompensa da
  // 1ª vitória com skill_points ("*" no começo se já feita). Body: ui.dbe.training.mental.desc.
  kHMentalConfirm = class extends jY {
    constructor(sG, sH) {
      super(sG), this.setTitle("ui.dbe.training_mental.confirm.title"), this.setBody({ rawtext: [{ translate: "ui.dbe.training.mental.desc" }] });
      let sI = hO(sG),
        sK = sI.mentalTraining,
        sL = sK.config,
        reopen = () => cj.displayForm(sG, "training_mental_confirm", !1, sH),
        noop = () => {},
        sM = sK.blockedReason(sH, "memory"),
        sN = sK.blockedReason(sH, "challenge"),
        start = (sO) => () => {
          let sP = sK.start(sH, sO);
          sP && (sG.sendMessage({ translate: "ui.dbe.training.mental.blocked." + sP }), reopen());
        },
        sQ = sK.clearsOf(sH),
        sR = sM ?? sN;
      this.addButton("ui.dbe.backButton", () => cj.displayForm(sG, "training_mental")); // 0
      this.addButton(sM ? "" : "ui.dbe.training.mental.start", sM ? noop : start("memory")); // 1
      this.addButton(sN ? "" : "ui.dbe.training.mental.start", sN ? noop : start("challenge")); // 2
      this.addButton({ rawtext: [{ translate: "entity." + sH + ".name" }] }, noop, { iconPatch: DU_ICON + "train_mental" }); // 3
      this.addButton(sQ.best ? duFormatTicks(sQ.best) : "", noop); // 4
      this.addButton(sK.dailyDone + "/" + sL.DAILY_REPEATS, noop); // 5
      this.addButton(sM && sN ? { rawtext: [{ translate: "ui.dbe.training.mental.blocked." + sR }] } : "", noop); // 6
      this.addButton("" + duMemoryLevel(sH), noop); // 7
      this.addButton({ rawtext: [...(sQ.memory ? [{ text: "*" }] : []), { translate: "ui.dbe.training.mental.reward_memory" }] }, noop, { iconPatch: DU_ICON + "skill_points" }); // 8
      this.addButton("" + Math.max(1, Math.round(sI.level.currentLevel * sL.CHALLENGE_LEVEL_MULT)), noop); // 9
      this.addButton({ rawtext: [...(sQ.challenge ? [{ text: "*" }] : []), { translate: "ui.dbe.training.mental.reward_challenge" }] }, noop, { iconPatch: DU_ICON + "skill_points" }); // 10
    }
  },
  kI = class extends jY {
    constructor(sG) {
      super(sG),
        this.setTitle("ui.dbe.select_hair.title"),
        this.setBody(this.generateCustomizationData()),
        this.onResponse((sH) => {
          sH.canceled || (this.playShearSoundEffect(), cj.displayForm(this.initiator, "select_hair"));
        });
    }
    shouldDisplayForm() {
      let { playerCustomization: sG } = hO(this.initiator),
        sH = Object.values(sG.activeCustomizations.options || {}).some(({ barberEditable: sI }) => sI);
      return sH || this.haircutNotAvailable(), sH;
    }
    generateCustomizationData() {
      let { playerCustomization: sG } = hO(this.initiator),
        { activeCustomizations: sH, gender: sI } = sG,
        sK = [],
        rows = [];
      for (let sL in sH.options) {
        let sM = sG.getOption(sL);
        if (
          !sM?.barberEditable ||
          (sM.activeGenders && !sM.activeGenders.includes(sI)) ||
          (sM.type === "variant" ? sM.optionCount : sM.palette.length) <= 1
        )
          continue;
        sK.push({ translate: "customization." + sL }, { text: "\n" });
        this.addButton(" ", () => sG.setOptionValue(sL, sG.getOptionValue(sL) - 1)),
          this.addButton(" ", () => sG.setOptionValue(sL, sG.getOptionValue(sL) + 1));
        rows.push({ id: sL, value: duOptionValue(sG, sL, sM) });
      }
      // 12d (CONTRATO §10.4): 0-9 = setas, 10-14 = nomes, 15-19 = valores; sempre 5 linhas. O marcador "§r§o§r" do
      // Oozaru saiu: a UI não lê mais (5ba9258).
      duCustomizationSlots(this, rows, 5);
      return sK.length ? { rawtext: sK } : "";
    }
    playShearSoundEffect() {
      this.initiator.playSound("mob.sheep.shear");
    }
    haircutNotAvailable() {
      this.initiator.sendMessage({ translate: "message.changeHair.withoutCutsWarning" });
    }
  };
// Guia da aba Ajuda (redesign/CONTRATO.md, seção 5): 10+ = um botão por tópico; o clique reabre o form com o tópico no body.
// Cada texto tem parágrafos: ui.dbe.help.text.<id>, depois .2, .3… (o .lang não tem quebra de linha).
const DU_HELP_PARAGRAPHS = { intro: 2, evolve: 4, transformations: 4, quests: 4, dragon_balls: 3, planets: 4, commands: 4 };
const DU_HELP_TOPICS = ["evolve", "transformations", "quests", "dragon_balls", "planets", "commands"];
var duHelpForm = class extends jZ {
    constructor(sG, topic) {
      super(sG);
      const open = DU_HELP_TOPICS.includes(topic) ? topic : "intro",
        body = [{ translate: "ui.dbe.help.text." + open }];
      for (let n = 2; n <= DU_HELP_PARAGRAPHS[open]; n++) body.push({ text: "\n\n" }, { translate: "ui.dbe.help.text." + open + "." + n });
      this.setTitle("ui.dbe.help.title"), this.setBody({ rawtext: body });
      for (const id of DU_HELP_TOPICS) this.addButton("ui.dbe.help.topic." + id, () => cj.displayForm(sG, "help", !1, id));
    }
  };
function kJ() {
  cj.registerActionForm("achievement_list", kb),
    cj.registerActionForm("help", duHelpForm),
    cj.registerActionForm("alignment_question", kk),
    cj.registerActionForm("customization", kv),
    cj.registerActionForm("main_functions", kx),
    cj.registerActionForm("news", kz),
    cj.registerActionForm("quest", kB),
    cj.registerActionForm("quest_list", kC),
    cj.registerActionForm("select_hair", kI),
    cj.registerActionForm("select_race", kq),
    cj.registerActionForm("side_functions", ky),
    cj.registerActionForm("skills", kD),
    cj.registerActionForm("statistics", kF),
    cj.registerActionForm("statistics_view", kf),
    cj.registerActionForm("training", kH),
    cj.registerActionForm("training_physical", kHPhysical),
    cj.registerActionForm("training_mental", kHMental),
    cj.registerActionForm("training_mental_confirm", kHMentalConfirm),
    cj.registerActionForm("transformations", kj);
}
kJ();
export { jY, jZ, k0, k1, k2, k3, k4, k5, removeTimeChamberHostile, duNpcInteractions, duHandleNpcInteraction, k6, k7, k8, k9, kb, kf, kj, kk, kpPick, kp, DU_ATTRIBUTE_ORDER, duMultiplierText, DU_RACE_GRID, duCustomizationOpen, kq, kv, kw, kx, ky, kz, kA, DU_ICON, DU_QUEST_TYPE_ICON, DU_ACHIEVEMENT_ICON, duQuestIcon, duOptionValue, duCustomizationSlots, duAchievementIcon, kB, kC, kD, kE, kF, kH, kHPhysical, kHMental, kHMentalConfirm, kI, DU_HELP_PARAGRAPHS, DU_HELP_TOPICS, duHelpForm, kJ };
