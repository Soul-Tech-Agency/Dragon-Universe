// Núcleo do Dragon Universe.
// Gerado por tools/deobfuscate-core.mjs a partir da versão ofuscada (commit 2d4f628): textos decodificados e
// código formatado, sem mudança de lógica. Os nomes curtos de variáveis vêm do ofuscador e não puderam ser recuperados.
import "./core/perf.js"; // primeiro import: a sonda (CONFIG.DEBUG_PERF) envolve os agendadores antes dos módulos
import { every } from "./core/scheduler.js"; // relógio único das tarefas gerais (O3-12: G1-G6)
import { late, bindLate } from "./core/late.js"; // ligação tardia (O4.0)
import "./kaioshin_dimension.js";
import "./other_world_kai.js";
import "./world_structures.js";
import "./hell_dimension.js";
import "./universe_6_dimension.js";
import "./world_spawn_policy.js";
import { safeTeleport as duSafeTeleport, isTravelPending as duIsTravelPending,
  acquireLoadedArea as duAcquireLoadedArea, releaseLoadedArea as duReleaseLoadedArea,
  safeReturnToEarth as duSafeReturnToEarth,
  physicalDestinationId as duPhysicalDestinationId, isSafeStanding as duIsSafeStanding,
  reportTravelFailure as duReportTravelFailure } from "./travel_safety.js";
import { initializeFutureTerrain, registerFutureCityPlacement } from "./future_terrain.js";
import { duTravel } from "./core/du_travel.js"; // O4.0-1: movido do segmento 0, como estava
import { recordBossKill as duRecordBossKill, listDefeated as duListDefeated, BOSS_IDS as DU_BOSS_IDS } from "./progression/progression.js";
import { namekDragonBallSpot as __nbl } from "./namek_dimension.js";
import { raceInfo as duRaceInfo, firstFormsRawtext as duFirstFormsRawtext } from "./race_info.js";
import { dragonBallsData as d } from "./data/dragon_balls_data.js";
import {
  EntityComponentTypes as g,
  EntitySwingSource as i,
  EquipmentSlot as l,
  Player as m,
  system as n,
  world as o,
} from "@minecraft/server";
import { system as r } from "@minecraft/server";
import "@minecraft/server";
import { EquipmentSlot as s, GameMode as t, ItemStack as C } from "@minecraft/server";
import { system as G, world as Z } from "@minecraft/server";
import { system as a0 } from "@minecraft/server";
import {
  EquipmentSlot as a1,
  GameMode as a2,
  ItemLockMode as a3,
  ItemStack as a4,
  Player as a5,
} from "@minecraft/server";
import { Direction as a6 } from "@minecraft/server";
import { TimeOfDay as a7, world as a8 } from "@minecraft/server";
import { BlockPermutation as a9 } from "@minecraft/server";
import { EquipmentSlot as ab, GameMode as af, system as aj, world as ak } from "@minecraft/server";
import { MolangVariableMap as ap, world as aq } from "@minecraft/server";
import { world as av } from "@minecraft/server";
import { EquipmentSlot as aw, GameMode as ax } from "@minecraft/server";
import { Entity as ay, system as az, World as aA } from "@minecraft/server";
import { bZ as aT, c0 as aU, c1 as aV, c2 as aW, c3 as aX, c4 as aY, c5 as aZ, c6 as b0, c7 as b1, c8 as b2, c9 as b3, cb as b4 } from "./vendor/vanilla_data.js"; // vanilla-data: nomes da antiga cópia A, agora apelidos da B (O1 passo 2)
import { aF, aH, aI, aM, aN, aO, aQ, aR, aS, b5, bG, bK, bL, bM, bN, bO, bP } from "./core/01_util.js"; // O4: movido do index.js
import { BlockVolume as bQ } from "@minecraft/server";
import { Player as bR, system as bS, world as bT } from "@minecraft/server";
import {
  EquipmentSlot as bU,
  GameMode as bV,
  InputPermissionCategory as bW,
  system as bX,
  world as bY,
} from "@minecraft/server";
import { bZ, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, cb } from "./vendor/vanilla_data.js"; // vanilla-data, cópia única (O1 passo 2)
import { CONFIG as ck } from "./config/config.js"; // O4: import que ficou no index.js (estava no trecho movido)
import { ki_colors_data as cp } from "./data/ki_colors_data.js"; // O4: import que ficou no index.js (estava no trecho movido)
import { EquipmentSlot as cq, Player as cv, system as cw } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { Player as cx, system as cy } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { cj, cA, cB } from "./core/02_forms_timers.js"; // O4: movido do index.js
import { skills_data as cC } from "./data/skills_data.js";
import { system as cD } from "@minecraft/server";
import { skills_data as cE } from "./data/skills_data.js";
import { duRestorePassive, cF, cG, cH, cI } from "./core/03_skill_base.js"; // O4: movido do index.js
// Religa uma skill passiva desligada (hoje só o Hakai, ver cH.disable e o init das skills), sem som nem mensagem.
 // O4.0: ligação tardia
import { Player as cJ, system as cK, world as cL } from "@minecraft/server";
import { system as cM } from "@minecraft/server";
import { cT, cY } from "./core/04_tournament_dims.js"; // O4: movido do index.js
import { EntityComponentTypes as cZ, Player as d0 } from "@minecraft/server";
import { d2, d3, d4, d5, d6, dj, dp } from "./core/05_db_cooldowns.js"; // O4: movido do index.js
import { system as dq } from "@minecraft/server";
import { GameMode as dw, Player as dx, PlayerPermissionLevel as dy, system as dz, world as dA } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { dv, dC } from "./core/06_requirements.js"; // O4: movido do index.js
 // O4.0: ligação tardia
import { InputPermissionCategory as dD, system as dE } from "@minecraft/server";
import { CONFIG as dF } from "./config/config.js";
import { Player as dG, world as dH } from "@minecraft/server";
import { CONFIG as dI } from "./config/config.js";
import { EntityComponentTypes as dJ, Player as dK, system as dL } from "@minecraft/server";
import { system as dM } from "@minecraft/server";
import { dN, dO, dP, e8, e9, ef } from "./core/07_stats.js"; // O4: movido do index.js
import { EquipmentSlot as ej, system as ek } from "@minecraft/server";
import { ex, eF, eG, eJ, eO, eP } from "./core/08_fusion_regions.js"; // O4: movido do index.js
import { skills_data as eQ } from "./data/skills_data.js";
import { Player as eR, system as eS } from "@minecraft/server";
import { eT, eU, f2, f6, f7 } from "./core/09_skills_combat.js"; // O4: movido do index.js
import { CONFIG as f8 } from "./config/config.js";
import { Player as f9, system as fb, world as ff } from "@minecraft/server";
import { fj, fk, fv, fx } from "./core/10_bars.js"; // O4: movido do index.js
import { entity_data as fy } from "./data/entities_data.js";
import { EntityTypes as fz, system as fA } from "@minecraft/server";
import { fC, fG, fO, fP, fR, fS, fT, fV } from "./core/11_entity_wrapper.js"; // O4: movido do index.js
import { InputPermissionCategory as fW, system as fX, world as fY } from "@minecraft/server";
import { ModalFormData as fZ } from "@minecraft/server-ui";
import { system as gU } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { g1, g3, g5, g7, g9, gw, gx, gA, gB, gD, gI, gN, gO, gQ, gR, gS, gT, gX, h3, h6 } from "./core/12_quests.js"; // O4: movido do index.js
import { EntitySwingSource as h7, world as h8 } from "@minecraft/server";
import { skills_data as h9 } from "./data/skills_data.js";
import { InputPermissionCategory as hb, system as hf } from "@minecraft/server";
import { hj, hk, hp, hv, hA, hD, hE, hF } from "./core/13_ki_attack_hud_level.js"; // O4: movido do index.js
import { CONFIG as hG } from "./config/config.js";
import { MolangVariableMap as hH, system as hI } from "@minecraft/server";
import { hN, hO, hP, hQ, duMovementModeTypes, hS, hT, hU } from "./core/14_player.js"; // O4: movido do index.js
import { skills_data as hV } from "./data/skills_data.js";
import { system as hW } from "@minecraft/server";
import { hZ, i0, i3 } from "./core/15_entities.js"; // O4: movido do index.js
import { EntityDamageCause as i4, EquipmentSlot as i5, Player as i6, system as i7 } from "@minecraft/server";
function i8(sG, sH, sI) {
  if (sG.isChunkLoaded(sH)) {
    let sK = d4("dbe:damage_indicator", sG, sH);
    sK && ((sK.nameTag = sI), sK.applyImpulse(new bP(aO.random(0, 0.01), 0.05, aO.random(0, 0.01))));
  }
}
var i9 = class {
    applyDamageToEntity(sG) {
      let { damageSource: sH, hurtEntity: sI } = sG,
        { cause: sK, damagingEntity: sL } = sH,
        { dimension: sM, location: sN } = sI,
        sO = i3.getDBEEntity(sI),
        sP = sK === i4.entityAttack,
        sQ;
      if (sI instanceof i6 && sL instanceof i6 && eJ.areInSameGroup(sI, sL)) {
        sG.cancel = !0;
        return;
      }
      if (sP && sL) {
        let sR = i3.getDBEEntity(sL);
        sR &&
          (sR.hasAttributesDefined &&
            ((sG.damage = ib.calculateModifiedMeleeDamage(sR, sG.damage)), this.processOnHitTriggers(sR)),
          sR.advancedCombat &&
            i7.run(() => {
              sG.cancel || sR.combo.applyComboIn([sI]);
            }));
      }
      if (sO?.hasAttributesDefined) {
        let { combo: sS, guard: sT, health: sU } = sO;
        if (sK === i4.fall) {
          sG.cancel = !0;
          return;
        }
        if (sP && sL) {
          if (sO.guard.isGuarding) {
            (sG.cancel = !0), i7.run(() => sT.tryBreakGuard(sL));
            return;
          }
          if (sO.alwaysDodge) {
            (sG.cancel = !0), sO.trySpread(sI.location, 4);
            return;
          }
          if (sT.shouldDodge(sL)) {
            (sG.cancel = !0), i7.run(() => sT.applyDodgeEffects());
            return;
          }
        }
        if (sO instanceof hN) {
          let { dimension: t1, location: t2 } = sI;
          if (sO.getCurrentFusion()?.isController === !1) {
            sG.cancel = !0;
            return;
          }
          if (sL instanceof i6 && eO(t1).isSafeZoneLocation(t2)) {
            sG.cancel = !0;
            return;
          }
        }
        (sQ = sU.applyDamage(sG.damage, sL)),
          sU.currentValue
            ? i7.run(() => {
                if (sI.isValid) {
                  let t3 = sI.getComponent("minecraft:health");
                  t3 && t3.currentValue > 0 && t3.resetToMaxValue();
                }
              })
            : (sG.damage = 2000000000);
      }
      sI.typeId !== "dbe:damage_indicator" &&
        i7.run(() => {
          let t3 = "§l§e-" + Math.floor(sQ ?? sG.damage);
          i8(sM, sN, t3);
        });
    }
    calculateModifiedMeleeDamage(sG, sH) {
      let { attributes: sI, combo: sK } = sG,
        sL = sI.stats.getStat("melee_damage");
      if (sL) {
        let sM = this.getModifiedSkillDamage(sG);
        return (sH + sL.value + sM) * sK.damageMultiplier * (sG.race?.id === "glind" ? 2.25 : 1);
      }
      return sH;
    }
    getModifiedSkillDamage(sG) {
      let { attributes: sH, entity: sI, skills: sK } = sG;
      if (aN.getEquippedItem(sI, i5.Mainhand)) return 0;
      let sL = sK
          .getSkillsByType("toggle")
          .filter(({ wilDamage: sN, isEnabled: sO }) => sO && sN > 0)
          .reduce((sN, sO) => sN + sO.wilDamage, 0),
        sM = sH.getAttribute("willpower")?.modifiedValue ?? 1;
      return sL * sM;
    }
    processOnHitTriggers(sG) {
      let { attributes: sH, ki: sI, masteries: sK, skills: sL } = sG,
        sM = !1;
      // Só skills ligadas: ki_fist/ki_scythe desligadas cobravam ki a cada golpe (o on_damage já checava isEnabled).
      for (let sN of sL.getSkillsByType("toggle"))
        sN.isEnabled &&
          (sN.kiDrainTrigger === "on_hit" && (sI.currentValue >= sN.kiDrain ? sI.removeCurrent(sN.kiDrain) : sN.disable()),
          sN.masteryOptions?.grantTrigger === "on_hit" && sK.getMastery(sN.id)?.addPercentage(1));
      sM && sH.updateStats();
    }
  },
  ib = new i9();
import { CONFIG as ij } from "./config/config.js";
import {
  Block as ik,
  EntityComponentTypes as ip,
  EquipmentSlot as iq,
  Player as iv,
  StructureSaveMode as iw,
  world as ix,
} from "@minecraft/server";
var iy = class t4 {
    static generateId() {
      let sG = Math.floor(Math.random() * 1000000);
      return "dbe:" + Date.now() + "_" + sG;
    }
    static generateLore(sG) {
      if (sG instanceof ik) return [{ rawtext: [{ text: "§r§7" }, { translate: sG.localizationKey }] }];
      let sH = sG.reduce((sI, sK) => {
        let sL = sK.nameTag || sK.localizationKey;
        return (sI[sL] = (sI[sL] || 0) + 1), sI;
      }, {});
      return Object.entries(sH).map(([sI, sK]) => ({
        rawtext: [{ text: "§r§7" }, { translate: sI }, { text: " x" + sK }],
      }));
    }
    static getStoredStructure(sG) {
      let sH = String(sG.getDynamicProperty("structure_id"));
      return ix.structureManager.get(sH);
    }
    static placeStoredStructure(sG, sH, sI, sK) {
      let sL = t4.getStoredStructure(sH);
      sL &&
        (ix.structureManager.place(sL, sI, sK),
        ix.structureManager.delete(sL),
        sI.spawnParticle("dbe:hoi_poi_capsule_spawn", sK),
        sI.playSound("common.explode", sK, { pitch: 2 }),
        this.updateItemStack(sG, sH, void 0, void 0),
        aQ.tryDamageHeldItem(sG, 1));
    }
    static isStoring(sG) {
      return !!sG.getDynamicProperty("structure_id");
    }
    static tryStoreBlock(sG, sH, sI) {
      if (sI.getParts() || ij.INDESTRUCTIBLE_BLOCKS.includes(sI.typeId)) return;
      let sK = eO(sG.dimension).canPlayerBuild(sG, sI.location),
        sL = sH.getComponent("dbe:hoi_poi_capsule");
      if (sK && sL) {
        let { dimension: sM, location: sN } = sI,
          sO = this.storeLocation(sM, sN, { includeEntities: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sO.id),
          sI.getComponent("minecraft:inventory")?.container?.clearAll(),
          sI.setType("minecraft:air");
      }
    }
    static tryStoreEntitiesFromLocation(sG, sH, sI) {
      let { dimension: sK } = sG,
        sL = eO(sK).canPlayerBuild(sG, sI),
        sM = sH.getComponent("dbe:hoi_poi_capsule");
      if (sL && sM) {
        let sN = sH.getComponent("minecraft:cooldown"),
          { exclude_families: sO } = sM.customComponentParameters.params;
        if (sN?.getCooldownTicksRemaining(sG) || this.isStoring(sH)) return;
        let sP = sK.getBlock(sI)?.center();
        if (!sP) return;
        let sQ = sK.getEntities({ excludeTypes: ["minecraft:player"], location: sI, volume: new bP(1, 1, 1) });
        for (let sR of sQ) {
          let sS = sR.getComponent(ip.TypeFamily);
          if (sS?.hasTypeFamily && sO.some((sT) => sS.hasTypeFamily(sT))) return;
          sR.teleport(sP);
        }
        this.storeEntities(sG, sH, sQ), sN?.startCooldown(sG);
      }
    }
    static storeEntities(sG, sH, sI) {
      if (sI.length) {
        let { dimension: sK, location: sL } = sI[0],
          sM = this.storeLocation(sK, sL, { includeBlocks: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sM.id);
        for (let sN of sI) sN.remove();
      }
    }
    static storeLocation(sG, sH, sI) {
      let sK = this.generateId();
      return ix.structureManager.createFromWorld(sK, sG, sH, sH, sI);
    }
    static updateItemStack(sG, sH, sI, sK) {
      sH.setLore(sI ? this.generateLore(sI) : void 0),
        sH.setDynamicProperty("structure_id", sK),
        sG.getComponent("minecraft:equippable")?.setEquipment(iq.Mainhand, sH);
    }
  },
  iz = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, itemStack: sI, source: sK }) {
      if (sK instanceof iv) {
        if (!eO(sG.dimension).canPlayerBuild(sK, sG.location)) return;
        if (iy.isStoring(sI)) {
          let sL = bO.add(sG.location, aS.faceToVector(sH));
          iy.placeStoredStructure(sK, sI, sG.dimension, sL);
        } else iy.tryStoreBlock(sK, sI, sG);
      }
    }
  };
import { EntityDamageCause as iA } from "@minecraft/server";
function iB(sG, sH) {
  let { entity: sI } = sG,
    sK = sI.getViewDirection(),
    sL = bO.add(sI.location, sK),
    sM = bO.add(sL, { x: 0, y: sI.getAABB().extent.y, z: 0 }),
    sN = b5.applyAreaDamage(sI.dimension, sH.position ?? sM, sH.radius, sH.damage, {
      damagingEntity: sH.damagingEntity ?? sI,
      cause: sH.cause ?? iA.entityAttack,
    });
  return sH.onHit?.(sN), sN;
}
import { dragonBallsData as iC } from "./data/dragon_balls_data.js";
import { system as iD, world as iE } from "@minecraft/server";
var iF = class {
    constructor(sG, sH, sI) {
      (this.dragonBallConfig = sG), (this.state = sH), (this.dragonBallManager = sI);
    }
    get cooldown() {
      return this.dragonBallConfig.cooldown;
    }
    get detectableByRadar() {
      return this.dragonBallConfig.detectableByRadar ?? !0;
    }
    get id() {
      return this.dragonBallConfig.blockId;
    }
    get isPetrified() {
      return this.state.isPetrified;
    }
    get isPetrificationExpired() {
      return this.state.lastUsedAt ? iD.currentTick - this.state.lastUsedAt >= this.cooldown : !0;
    }
    get isUsed() {
      return typeof this.state.lastUsedAt == "number";
    }
    get maxWishes() {
      return this.dragonBallConfig.maxWishes ?? 1;
    }
    get requiredBalls() {
      return this.dragonBallConfig.requiredBalls;
    }
    get sourceAnimation() {
      return this.dragonBallConfig.sourceAnimation;
    }
    get sourceId() {
      return this.dragonBallConfig.sourceId;
    }
    get spawnSound() {
      return this.dragonBallConfig.spawnSound;
    }
    getBallsInDimension(sG) {
      return this.state.tracked.filter((sH) => sH.dimensionId === sG.id);
    }
    getDragonBallAmount() {
      return this.state.tracked.length;
    }
    getState() {
      return this.state;
    }
    petrify() {
      (this.state.isPetrified = !0), (this.state.lastUsedAt = iD.currentTick), this.dragonBallManager.save();
    }
    restore() {
      (this.state.isPetrified = !1), delete this.state.lastUsedAt, this.dragonBallManager.save();
    }
    spawnInstance(sG, sH) {
      this.state.tracked.push({ dimensionId: sG.id, location: sH, placed: !1, typeId: this.id }),
        this.dragonBallManager.save();
    }
    updateBalls() {
      let { isPetrified: sG, isPetrificationExpired: sH, isUsed: sI } = this,
        sK = this.getDragonBallAmount(),
        sL = !1;
      (sK === 0 || (sG && sH)) && (this.restore(), this.spawnAll()), !sG && sI && this.petrify();
      for (let sM of this.state.tracked) {
        let sN = iE.getDimension(sM.dimensionId),
          sO = sN.getBlock(sM.location);
        sO &&
          (sM.placed &&
            sO.typeId !== this.id &&
            (sO.setType("minecraft:air"), this.state.tracked.splice(this.state.tracked.indexOf(sM), 1), (sL = !0)),
          sM.placed || (sL = this.tryPlaceDragonBall(sN, sM)));
      }
      sL && this.dragonBallManager.save();
    }
    findValidSpawnLocation(sG) {
      if (sG.dimensionId === "dbe:namek") return sG.location;
      return iE.getDimension(sG.dimensionId).getTopmostBlock(sG.location)?.above() || sG.location;
    }
    getRandomSpawnLocation(sG) {
      let sH = Math.random() * (sG * 2) - sG,
        sI = Math.random() * (sG * 2) - sG,
        sK = new bP(sH, 0, sI);
      return bO.floor(sK);
    }
    spawnAll() {
      let sG = this.getDragonBallAmount();
      for (let sH of this.dragonBallConfig.spawnRules)
        for (let sI = sG; sI < this.requiredBalls; sI++) {
          let sK, sL;
          if (sH.dimensionId === "dbe:namek") {
            try {
              sL = iE.getDimension("dbe:namek");
              sK = __nbl(sI);
            } catch (__e) {
              break;
            }
          } else {
            sK = this.getRandomSpawnLocation(sH.spawnRadius);
            sL = iE.getDimension(sH.dimensionId);
          }
          this.spawnInstance(sL, sK);
        }
    }
    tryPlaceDragonBall(sG, sH) {
      let sI = this.findValidSpawnLocation(sH);
      (sH.location = sI), (sH.placed = !0);
      try {
        return sG?.setBlockType(sI, this.id), !0;
      } catch {
        return !1;
      }
    }
  },
  iG = class {
    database;
    dragonBallMap = new Map();
    state = [];
    constructor() {
      iD.run(() => {
        this.database = bG(iE, "dragon_evolution");
        let sG = this.database.get("dragon_balls");
        Array.isArray(sG) && (this.state = sG), this.loadDragonBalls();
      });
    }
    getDragonBall(sG) {
      return this.dragonBallMap.get(sG);
    }
    getDragonBallBySourceTypeId(sG) {
      for (let sH of this.dragonBallMap.values()) if (sH.sourceId === sG) return sH;
    }
    getRadarDetectableBalls(sG, sH) {
      let sI = [];
      for (let sK of this.dragonBallMap.values())
        !sK.detectableByRadar || sK.isPetrified || sI.push(...sK.getBallsInDimension(sG));
      return sI.sort((sL, sM) => {
        let sN = bO.distance(sH, sL.location),
          sO = bO.distance(sH, sM.location);
        return sN - sO;
      });
    }
    save() {
      this.state = [];
      for (let sG of this.dragonBallMap.values()) this.state.push(sG.getState());
      this.database?.set("dragon_balls", this.state);
    }
    updateBalls() {
      for (let sG of this.dragonBallMap.values()) sG.updateBalls();
    }
    loadDragonBalls() {
      for (let sG of iC) {
        let sH = this.state.find(({ typeId: sK }) => sK === sG.blockId) ?? {
            isPetrified: !1,
            tracked: [],
            typeId: sG.blockId,
          },
          sI = new iF(sG, sH, this);
        this.dragonBallMap.set(sG.blockId, sI);
      }
    }
  },
  iH = new iG();
import { system as iI } from "@minecraft/server";
var iJ = class {
    tryFusion(sG, sH) {
      return !(sH instanceof hN) && sH.race?.id === "namekian" && sH.isKnockedOut
        ? (this.startAssimilation(sG, sH), !0)
        : !1;
    }
    startAssimilation(sG, sH) {
      for (let sI of sG.attributes.getAttributes()) {
        let sK = sH.attributes.getAttribute(sI.id)?.value ?? 1,
          sL = Math.max(0, sK - sI.value);
        sL > 0 && sI.addValue(sL, !0);
      }
      iI.run(() => sH.entity.remove());
    }
  },
  iK = new iJ();
import { Block as iL, EntityComponentTypes as iM, Player as iN, system as iO, world as iP } from "@minecraft/server";
var iQ = class {
    bannedItems = new Set();
    isBanned(sG) {
      return this.bannedItems.has(sG);
    }
    ban(sG) {
      this.bannedItems.has(sG) || this.bannedItems.add(sG);
    }
    removeBannedItems(sG) {
      aQ.forEachFilledSlot(sG, (sH, sI) => {
        iR.isBanned(sI.typeId) && sH.setItem(void 0);
      });
    }
    unban(sG) {
      this.bannedItems.has(sG) && this.bannedItems.delete(sG);
    }
    protectContainer(sG, sH) {
      let sI = sG.getComponent("minecraft:inventory")?.container,
        sK = !1;
      if (sG instanceof iL) {
        let sL = iP.afterEvents.blockContainerClosed.subscribe(({ closeSource: sM }) => {
          sH.entity === sM.entity && ((sK = !0), iP.afterEvents.blockContainerClosed.unsubscribe(sL));
        });
      } else {
        let sM = iP.afterEvents.entityContainerClosed.subscribe(({ closeSource: sN }) => {
          sH.entity === sN.entity && ((sK = !0), iP.afterEvents.entityContainerClosed.unsubscribe(sM));
        });
      }
      if (sI) {
        let sN = iO.runInterval(() => {
          sI.isValid && !sK ? iR.removeBannedItems(sI) : iO.clearRun(sN);
        }, 2);
      }
    }
  },
  iR = new iQ();
iP.afterEvents.blockContainerOpened.subscribe(({ block: sG, openSource: sH }) => {
  iR.protectContainer(sG, sH);
}),
  iP.afterEvents.entityContainerOpened.subscribe(({ entity: sG, openSource: sH }) => {
    sG instanceof iN || iR.protectContainer(sG, sH);
  }),
  iP.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
    if (sG.isValid && sG.typeId === "minecraft:item") {
      let sH = sG.getComponent(iM.Item);
      sH && iR.isBanned(sH.itemStack.typeId) && sG.remove();
    }
  });
import { EntityComponentTypes as iS, EntityDamageCause as iT, Player as iU } from "@minecraft/server";
var iV = class extends cH {
    constructor(sG, sH) {
      super(sG, sH);
    }
    useSkill() {
      if (!(this.dbeEntity instanceof hN)) {
        let { target: sG } = this.dbeEntity;
        sG && this.tryUseSkillInTarget(sG);
        return;
      }
      for (let sH of this.dbeEntity.entity.getEntitiesFromViewDirection()) {
        let { distance: sI, entity: sK } = sH;
        if (sI <= 32 && this.tryUseSkillInTarget(sK)) break;
      }
    }
    tryUseSkillInTarget(sG) {
      return sG.typeId != "dbe:absorption_cocoon_entity" &&
        sG.applyDamage(1, { cause: iT.magic, damagingEntity: this.dbeEntity.entity })
        ? (iX.startAbsorption(this.dbeEntity, sG), !0)
        : !1;
    }
  },
  iW = class {
    absorbingEntities = new Set();
    startAbsorption(sG, sH) {
      let sI = sH.id;
      if (!this.absorbingEntities.has(sI)) {
        let sK = sH.getComponent(iS.Health);
        if (!sK) return;
        let sL = sH.location,
          sM = this.trySpawnCocoonEntity(sH.dimension, sL, { initialRotation: sH.getRotation().y });
        if (!sM) return;
        let sN = sM.entity;
        sG.attributes.transferAttributes(sM, 0.1);
        let sO = sM.attributes.stats.getStat("melee_damage")?.value ?? 1,
          sP = ef.getAttributesFromEntity(sH);
        this.absorbingEntities.add(sI);
        let sQ = (sR) => {
          sR && (sM.attributes.transferAttributes(sG), sG.attributes.addAttributeValues(sP)),
            this.absorbingEntities.delete(sI),
            sN.remove();
        };
        sG instanceof hN && sM.trySetProperty("dbe:color", sG.playerCustomization.getOptionValue("skin")),
          sH instanceof iU &&
            sH.camera.fade({
              fadeColor: aI.colorToRgb("#ffb4d7"),
              fadeTime: { fadeInTime: 1, holdTime: 0.5, fadeOutTime: 1 },
            }),
          sM.runInterval(() => {
            if (!sH.isValid) {
              sQ(!1);
              return;
            }
            this.applyInvisibilityToTarget(sH),
              sN.teleport(sL),
              sH.teleport(sL),
              sH.applyDamage(sO, { cause: iT.magic, damagingEntity: sG.entity }),
              sK.currentValue <= 0 && sQ(!0);
          });
      }
    }
    applyInvisibilityToTarget(sG) {
      sG instanceof iU
        ? sG.playAnimation("animation.entity.absorbing")
        : sG.addEffect(c4.Invisibility, 1, { showParticles: !1 });
    }
    trySpawnCocoonEntity(sG, sH, sI) {
      let sK = d4("dbe:absorption_cocoon_entity", sG, sH, sI);
      if (sK) return i3.getDBEEntity(sK);
    }
  },
  iX = new iW();
import { Player as iY, system as iZ } from "@minecraft/server";
import { system as j0 } from "@minecraft/server";
// O2c (decisão O2c-1, opção a): cada cápsula tem 2 intervalos de 1 tick (sensores aqui e movimento em j5). Antes
// eles nunca eram limpos e a instância ficava num WeakMap pela entidade JS; agora a instância fica num Map pelo
// entity.id e dispose() limpa os 2 intervalos quando a cápsula deixa de ser válida. Se ela voltar (chunk
// recarregado), j4 cria uma instância nova no próximo tick em que alguém a montar.
var j1 = class t5 {
  constructor(sG) {
    (this.entity = sG),
      (this.entityId = sG.id),
      ((this.vehicleState = { direction: 0 }),
      (this.sensorRunId = j0.runInterval(() => {
        if (!sG.isValid) return this.dispose();
        this.calculateHeightSensors();
      })));
  }
  static instances = new Map();
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    j0.clearRun(this.sensorRunId);
    this._movement?.dispose();
    t5.instances.get(this.entityId) === this && t5.instances.delete(this.entityId);
  }
  vehicleState;
  _movement;
  pitchDiff = 0;
  rollDiff = 0;
  sensors = { frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0, center: 0 };
  get maxDirectionAngle() {
    return 40;
  }
  static getInstance(sG) {
    let sH = t5.instances.get(sG.id);
    if (!sH) {
      sH = new t5(sG);
      t5.instances.set(sG.id, sH);
    }
    return sH;
  }
  get isDrifting() {
    return this.movement.direction.y < 0 && this.movement.speed > 0.2;
  }
  get movement() {
    return this._movement || (this._movement = new j5(this)), this._movement;
  }
  getRiders() {
    let sG = this.entity.getComponent("rideable");
    return sG ? sG.getRiders() : [];
  }
  getDirection() {
    return this.vehicleState.direction;
  }
  setDirection(sG) {
    (this.vehicleState.direction = bN(sG, -1, 1)),
      this.entity.setProperty("dbe:movement_direction", this.vehicleState.direction * this.maxDirectionAngle);
  }
  async calculateHeightSensors() {
    let { dimension: sG, location: sH } = this.entity,
      sI = this.entity.getRotation(),
      sK = {},
      sL = {
        frontLeft: { x: -0.75, y: 2, z: 0.5 },
        frontRight: { x: 0.75, y: 2, z: 0.5 },
        backLeft: { x: -0.75, y: 2, z: -0.5 },
        backRight: { x: 0.75, y: 2, z: -0.5 },
        center: { x: 0, y: 2, z: 0 },
      };
    for (let [sR, sS] of Object.entries(sL)) {
      let sT = bO.rotateY(sS, -(sI.y * (Math.PI / 180))),
        sU = bO.add(sH, sT),
        t1 = d4("dbe:location", sG, sU);
      t1 && (t1.applyImpulse({ x: 0, y: -100, z: 0 }), (sK[sR] = t1));
    }
    await j0.waitTicks(1);
    // a cápsula pode ter sumido nesse tick (ou um sensor não ter nascido ou ter sumido): os sensores válidos saem
    if (!this.entity.isValid || Object.keys(sK).length < 5 || !Object.values(sK).every((t2) => t2.isValid)) {
      for (let t2 of Object.values(sK)) t2.isValid && t2.remove();
      return;
    }
    let sM = sK.frontLeft.location.y - this.entity.location.y,
      sN = sK.frontRight.location.y - this.entity.location.y,
      sO = sK.backLeft.location.y - this.entity.location.y,
      sP = sK.backRight.location.y - this.entity.location.y,
      sQ = sK.center.location.y - this.entity.location.y;
    (this.sensors.frontLeft = bN(sM, -1, 1)),
      (this.sensors.frontRight = bN(sN, -1, 1)),
      (this.sensors.backLeft = bN(sO, -1, 1)),
      (this.sensors.backRight = bN(sP, -1, 1)),
      (this.sensors.center = bN(sQ, -1, 1)),
      (this.pitchDiff = (sM + sN) / 2 - (sO + sP) / 2),
      (this.rollDiff = (sN + sP) / 2 - (sM + sO) / 2);
    for (let t2 of Object.values(sK)) t2.remove();
  }
};
function j2(sG) {
  return j1.getInstance(sG);
}
var j3 = 0.5;
function j4(sG) {
  let sH = sG.getComponent("minecraft:riding");
  if (sH) {
    let sI;
    try {
      sI = sH.entityRidingOn;
    } catch {}
    if (sI?.typeId === "dbe:capsule_991") {
      let sK = j2(sI);
      if (sK) {
        let sL = sG.inputInfo.getMovementVector();
        sK.movement.setDirection(sL);
      }
    }
  }
}
var j5 = class {
  constructor(sG) {
    (this.vehicle = sG),
      (this.runId = iZ.runInterval(() => {
        if (!sG.entity.isValid) return sG.dispose();
        this.updateDirection(), this.moveVehicle();
      }));
  }
  dispose() {
    iZ.clearRun(this.runId);
  }
  direction = { x: 0, y: 0 };
  speed = 0;
  get isMoving() {
    return this.direction.x !== 0;
  }
  addSpeed(sG) {
    this.setSpeed(this.speed + sG);
  }
  setDirection(sG) {
    this.direction = sG;
  }
  setSpeed(sG) {
    (this.speed = bN(sG, -0.1, j3)), this.vehicle.entity.setProperty("dbe:wheel_speed", sG);
  }
  applyFriction(sG, sH) {
    return sG > 0 ? Math.max(0, sG - sH) : sG < 0 ? Math.min(0, sG + sH) : 0;
  }
  calculateRotation() {
    let { entity: sG, pitchDiff: sH, rollDiff: sI } = this.vehicle,
      sK = sG.getRotation(),
      sL = 0.05,
      sM = bN(Math.abs(sH) > sL ? sH : 0, -1, 1),
      sN = Math.abs(sI) > sL ? sI : 0,
      sO = this.vehicle.getDirection() * this.vehicle.maxDirectionAngle * this.speed;
    (sK.y += sO), (sK.x = sM * 45), this.vehicle.entity.setRotation(sK);
  }
  moveVehicle() {
    let { entity: sG, sensors: sH } = this.vehicle,
      sI = (sH.frontLeft + sH.frontRight) / 2,
      sK = sG.getViewDirection(),
      sL = sG.getVelocity(),
      sM = this.vehicle.isDrifting ? 1 : 0,
      sN = bO.lerp(sK, sL, sM);
    this.vehicle.entity.applyImpulse({ x: sN.x * this.speed, y: 0, z: sN.z * this.speed }),
      this.setSpeed(this.speed),
      this.updateMotorSound();
  }
  updateDirection() {
    let sG = this.vehicle.getDirection(),
      sH = this.direction.x;
    if (sH !== 0) {
      let sI = Math.sign(sG),
        sK = Math.sign(sH);
      sI !== 0 && sI !== sK ? this.vehicle.setDirection(sG - sH * 0.025) : this.vehicle.setDirection(sG - sH * 0.05);
    }
    if ((this.direction.y > 0 && this.vehicle.movement.addSpeed(0.0025), this.direction.y !== 0 && !sH)) {
      let sL = this.applyFriction(sG, 0.05);
      this.vehicle.setDirection(sL);
    }
    if (this.direction.y === 0) {
      let sM = this.applyFriction(this.speed, 0.005);
      this.setSpeed(sM);
    }
    this.direction.y < 0 && this.vehicle.movement.addSpeed(this.speed > 0 ? -0.005 : -0.0025), this.calculateRotation();
  }
  updateMotorSound() {
    let { entity: sG } = this.vehicle,
      sH = this.speed / j3,
      sI;
    sH > 0.9 ? (sI = "vehicle.motor_idle3") : sH > 0.7 ? (sI = "vehicle.motor_idle2") : (sI = "vehicle.motor_idle1");
    let sK = 1,
      sL = 0.5 + sH * 0.5;
    this.vehicle.isDrifting && sG.dimension.playSound("vehicle.drifting", sG.location, { pitch: sK, volume: sL }),
      sG.dimension.playSound(sI, sG.location, { pitch: sK, volume: sL });
  }
};
import { wish_data as j6 } from "./data/wish_data.js";
import { EasingType as j7, system as j8, TimeOfDay as j9, world as jb } from "@minecraft/server";
import { ActionFormData as jf } from "@minecraft/server-ui";
var jj = class {
    constructor(sG) {
      this.wishData = sG;
    }
    get amount() {
      return this.wishData.amount || 1;
    }
    get availableIn() {
      return this.wishData.availableIn;
    }
    get name() {
      return this.wishData.name;
    }
    get requirements() {
      return this.wishData.requirements ?? [];
    }
    get singleUse() {
      return this.wishData.single_use ?? !1;
    }
    get type() {
      return this.wishData.type;
    }
    getTranslationKey() {
      return { translate: "wish." + this.name };
    }
    grantWish(sG, sH) {}
  },
  jk = class {
    static wishesMap = new Map();
    static get(sG) {
      return this.wishesMap.get(sG);
    }
    static register(sG, sH) {
      this.wishesMap.set(sG, sH);
    }
  },
  jp = class extends jj {
    getTranslationKey() {
      return { translate: "wish.change_race", with: { rawtext: [{ translate: this.name }] } };
    }
    grantWish(sG) {
      hO(sG).setRace(this.name);
    }
  };
import { ItemStack as jq, ItemTypes as jv } from "@minecraft/server";
var jw = class extends jj {
    getTranslationKey() {
      return { translate: jv.get(this.name)?.localizationKey };
    }
    grantWish(sG, sH) {
      let sI = new jq(this.name),
        { maxAmount: sK } = sI;
      for (let sL = this.amount; sL > 0; sL -= sK)
        (sI.amount = Math.min(sK, sL)),
          sI.setLore([{ rawtext: [{ text: "§r§7" }, { translate: sH.localizationKey }] }]),
          sG.dimension.spawnItem(sI, sG.location);
    }
  },
  jx = class extends jj {
    getTranslationKey() {
      return { translate: "skill." + this.name };
    }
    grantWish(sG) {
      try {
        hO(sG).skills.tryLearnSkill(this.name);
      } catch {}
    }
  },
  jy = class extends jj {
    grantWish(sG) {
      sG.addTag("dbe_" + this.name);
    }
  },
  jz = class extends jj {
    grantWish(sG) {
      hO(sG).addTail();
    }
  },
  jA = new Map(),
  jA2 = new Map(), // sessão de desejos ativa: id do dragão -> id do jogador
  jA3 = new Map(), // cinemática do dragão em curso: id do jogador -> token
  jB = class {
    wishes = [];
    constructor() {
      jk.register("change_race", jp),
        jk.register("item", jw),
        jk.register("skill", jx),
        jk.register("tag", jy),
        jk.register("tail", jz);
      for (let sG of j6) {
        let sH = jk.get(sG.type);
        sH && this.wishes.push(new sH(sG));
      }
    }
    getWishes() {
      return this.wishes;
    }
    getEligibleWishes(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [],
        sK = [];
      for (let sL of this.getWishes())
        (sL.singleUse && sI.includes(sL.name)) ||
          (sL.availableIn.includes(sH) &&
            dC.testAll(sG, sL.requirements) &&
            ((sL instanceof jx && !sG.skills.canLearnSkill(sL.name)) ||
              (sL instanceof jp && !fR.isRaceAvailableForPlayer(sG, sL.name)) ||
              sK.push(sL)));
      return sK;
    }
    async handleWishSession(sG, sH) {
      let sI = iH.getDragonBallBySourceTypeId(sH.typeId);
      if (!sI) return;
      // um jogador por dragão; a trava de quem saiu do mundo não vale mais
      let sK = jA2.get(sH.id);
      if (sK && sK !== sG.id && jb.getAllPlayers().some((sM) => sM.id === sK)) {
        sG.sendMessage({ translate: "message.shenron.busy" });
        return;
      }
      jA2.set(sH.id, sG.id);
      try {
        // abrir o desejo encerra a cinemática deste jogador e devolve a câmera na hora;
        // uma falha aqui não pode deixar a trava jA2 presa nem impedir o menu
        if (jA3.has(sG.id)) {
          jA3.delete(sG.id);
          try {
            sG.camera.clear();
          } catch (sM) {
            console.warn("[Dragon Universe] Falha ao devolver a câmera: " + String(sM));
          }
        }
        for (; sG.isValid && sH.isValid && this.getWishesMade(sH) < sI.maxWishes; ) {
          // fechar o menu encerra só a sessão: o dragão fica com os desejos restantes
          if ((await this.showWishSelectionMenu(sG, sH)) !== "granted") return;
          sG.camera.fade({
            fadeColor: { red: 1, green: 1, blue: 1 },
            fadeTime: { fadeInTime: 1, fadeOutTime: 1, holdTime: 0.1 },
          });
        }
        sG.isValid && sH.isValid && this.getWishesMade(sH) >= sI.maxWishes && this.finalizeWishes(sG, sH);
      } finally {
        jA2.get(sH.id) === sG.id && jA2.delete(sH.id);
      }
    }
    spawnShenronFromDragonBall(sG, sH, sI, sK) {
      let sL = d4(sH.sourceId, sI, sK);
      if (!sL) return;
      let sM = 32,
        { doDayLightCycle: sN } = jb.gameRules;
      if (sN) {
        jA.set(sL.id, jb.getTimeOfDay());
        let sO = j8.runInterval(() => {
          let sP = jb.getTimeOfDay();
          if (sP < j9.Midnight) {
            if ((jb.setTimeOfDay(Math.min(240000, sP + 100)), j8.currentTick % 40 === 0)) {
              let sQ = new bP((Math.random() - 0.5) * sM + sK.x, sK.y, (Math.random() - 0.5) * sM + sK.z);
              try {
                d4("minecraft:lightning_bolt", sI, sQ);
              } catch {}
            }
          } else j8.clearRun(sO);
        });
      }
      for (let sP of jb.getAllPlayers())
        hO(sP).sendQueueMessage({
          soundId: "mob.shenron.appear",
          tickDelay: 5,
          message: {
            translate: "message.shenron.summoned",
            with: { rawtext: [{ text: "" + sH.requiredBalls }, { text: sG.name }, { translate: sL.localizationKey }] },
          },
        });
      for (let sQ of sI.getPlayers({ location: sK, maxDistance: 128 })) this.playAnimation(sQ, sL, sH);
    }
    finalizeWishes(sG, sH) {
      if (!sH.isValid) return;
      let { dimension: sI, location: sK } = sH;
      sG.sendMessage({ translate: "message.shenron.wishGranted" }),
        sI.playSound("mob.shenron.flying", sK),
        this.restoreNormalTimeOfDay(sH),
        sH.remove();
    }
    getWishesMade(sG) {
      return i3.getDBEEntity(sG)?.data.get("wishes_made") ?? 0;
    }
    markWishAsGranted(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [];
      sI.push(sH.name), sG.data.set("granted_wishes", sI);
    }
    async playAnimation(sG, sH, sI) {
      let sK = sH.getComponent("minecraft:scale")?.value ?? 1,
        sT = {},
        sV = sG.id,
        // false se a cinemática foi encerrada (desejo aberto ou nova invocação) ou se o jogador saiu
        sU = () => jA3.get(sV) === sT && (sG.isValid || (jA3.delete(sV), !1));
      jA3.set(sV, sT);
      sG.camera.setCamera("minecraft:free", {
        facingLocation: bO.add(sH.location, { y: 32 * sK }),
        location: bO.add(sH.location, { x: 32 * sK, y: 32 * sK, z: 32 * sK }),
        easeOptions: { easeTime: 0.5, easeType: j7.InCirc },
      }),
        sI.spawnSound && (sG.playMusic(sI.spawnSound, { fade: 1 }), aN.applyCameraShake(sG, 0.5, 5)),
        await j8.waitTicks(40),
        sI.sourceAnimation && sH.playAnimation(sI.sourceAnimation),
        await j8.waitTicks(200);
      if (!sU()) return;
      sG.camera.fade({
        fadeColor: { red: 1, green: 1, blue: 1 },
        fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
      });
      await j8.waitTicks(15);
      sU() && (jA3.delete(sV), sG.camera.clear());
    }
    restoreNormalTimeOfDay(sG) {
      let sH = jA.get(sG.id);
      sH && (jb.setTimeOfDay(sH), jA.delete(sG.id));
    }
    // sempre resolve: "granted" | "closed" | "empty" | "invalid" | "error"
    async showWishSelectionMenu(sG, sH) {
      let sK = hO(sG);
      for (let sT = 0; sT < 10; sT++) {
        if (!sG.isValid || !sH.isValid || !sK) return "invalid";
        let sL = this.getEligibleWishes(sK, sH.typeId);
        if (!sL.length) return sG.sendMessage({ translate: "message.shenron.noWishes" }), "empty";
        let sM = new jf();
        sM.title("ui.dbe.wishes.title"), sM.body("");
        for (let sN of sL) sM.button(sN.getTranslationKey());
        let sO;
        try {
          sO = await sM.show(sG);
        } catch (sU) {
          return console.warn("[Dragon Universe] Falha no menu de desejos: " + (sU?.stack ?? sU)), "error";
        }
        if (sO.canceled) {
          // jogador com outra interface aberta: tenta de novo em 1 s
          if (sO.cancelationReason === "UserBusy") {
            await j8.waitTicks(20);
            continue;
          }
          return "closed";
        }
        let sP = sO.selection,
          sS = typeof sP == "number" ? sL[sP] : void 0;
        if (!sS || !sG.isValid || !sH.isValid) return "invalid";
        // revalida no envio: limite e elegibilidade podem ter mudado com o menu aberto
        let sQ = i3.getDBEEntity(sH),
          sR = sQ?.data.get("wishes_made") ?? 0,
          sV = iH.getDragonBallBySourceTypeId(sH.typeId);
        if (!sV || sR >= sV.maxWishes) return "invalid";
        if (!this.getEligibleWishes(sK, sH.typeId).includes(sS)) continue;
        sS.grantWish(sG, sH), sQ?.data.set("wishes_made", sR + 1), this.markWishAsGranted(sK, sS);
        return "granted";
      }
      return "closed";
    }
  },
  jC = new jB(),
  jD = class {
    reset(sG) {
      sG.setProperty("dbe:dragon_radar_location", 0);
    }
    scanDragonBalls(sG) {
      let sH = iH.getRadarDetectableBalls(sG.dimension, sG.location)[0],
        sI = 0,
        sK = 0;
      if (sH) {
        let sL = this.getRelativeLocation(sH.location, sG.location, sG.getViewDirection(), sG.getRotation().y);
        (sI = -sL.x), (sK = sL.z), aQ.tryDamageHeldItem(sG, 1);
      }
      sG.setProperty("dbe:dragon_radar_location", sH ? +("" + (sI + 164) + (sK + 164)) : 0);
    }
    getRelativeLocation(sG, sH, sI, yaw = 0) {
      if (Math.hypot(sI.x, sI.z) < 0.000001) {
        let angle = (yaw * Math.PI) / 180;
        sI = { x: -Math.sin(angle), z: Math.cos(angle) };
      }
      let sK = sG.x - sH.x,
        sL = sG.z - sH.z,
        sM = Math.hypot(sI.x, sI.z),
        sN = sI.x / sM,
        sO = sI.z / sM,
        sP = -sK * sO + sL * sN,
        sQ = -sL * sO - sK * sN,
        sR = Math.hypot(sP, sQ),
        sS = 64;
      if (sR > sS) {
        let sT = sS / sR;
        (sP *= sT), (sQ *= sT);
      }
      return { x: Math.round((sP * 64) / sS), z: Math.round((sQ * 64) / sS) };
    }
  },
  jE = new jD(),
  jF = class {
    applyFoodEffect(sG, sH) {
      switch (sH.typeId) {
        case "dbe:bucket_medical_liquid":
          this.applyBucketMedicalLiquidEffect(sG);
          break;
        case "dbe:senzu_bean":
          this.applySenzuBeanEffect(sG);
          break;
        default:
          this.applyDefaultFoodEffect(sG, sH);
          break;
      }
    }
    applyDefaultFoodEffect(sG, sH) {
      let { attributes: sI, health: sK, ki: sL } = sG,
        sM = sI.stats.getStat("body"),
        sN = sI.stats.getStat("max_ki");
      if (sM && sN) {
        let sO = (sH.getComponent("minecraft:food")?.saturationModifier || 0.6) * 0.25;
        sK.addCurrent(sM.value * sO), sL.addCurrent(sN.value * sO);
      }
    }
    applyBucketMedicalLiquidEffect(sG) {
      let { health: sH } = sG;
      sH.addCurrent(sH.maxValue * 0.4);
    }
    applySenzuBeanEffect(sG) {
      sG.recoverConstitution(),
        sG.player.addEffect("minecraft:saturation", 1, { amplifier: 255 }),
        sG.player.dimension.playSound("item.senzu_bean.use", sG.player.location),
        aQ.decrementStack(sG.player);
    }
  },
  jG = new jF();
import { EntityDamageCause as jH, system as jI } from "@minecraft/server";
var jJ = class {
    explodeAttack(sG, sH, sI, sK) {
      let { canCutTail: sL, damage: sM, entity: sN, explosionPower: sO, owner: sP } = sG;
      if (!sO && sK?.isValid) {
        if (sL && Math.random() < 0.1) {
          let sQ = i3.getDBEEntity(sK);
          sQ && sQ.race?.id === "saiyan" && !sQ.tailCurled && sQ.removeTail();
        }
        if (!!sK.applyDamage(sM, { cause: jH.entityAttack, damagingEntity: sP })) {
          let sR = sN.getVelocity(),
            sS = bO.scale(sR, 5);
          sK.applyKnockback({ x: sS.x, z: sS.z }, 0);
        }
      }
      jI.run(() => {
        if (sN.isValid) {
          sO &&
            f2.createExplosion(sH, sI, sO, {
              breakBlocks: sG.breakBlocks,
              color: sG.color1 ? aI.colorToRgb(sG.color1) : void 0,
              damage: sM,
              damagingEntity: sP,
              ignoredEntities: sP ? [sP] : [],
            });
          for (let sT of hZ.getNearbyKiAttacks(sN.dimension, sN.location, sG.baseScale * 2)) {
            let { dimension: sU, location: t1 } = sT.entity;
            jK.explodeAttack(sT, sU, t1);
          }
          sN.remove();
        }
      });
    }
  },
  jK = new jJ();
import { skills_data as jL } from "./data/skills_data.js";
import { ItemTypes as jM, system as jN } from "@minecraft/server";
import { ActionFormData as jO } from "@minecraft/server-ui";
import { ItemStack as jP } from "@minecraft/server";
function jQ(sG) {
  return function () {
    let sH = (sG += 1831565813);
    return (
      (sH = Math.imul(sH ^ (sH >>> 15), sH | 1)),
      (sH ^= sH + Math.imul(sH ^ (sH >>> 7), sH | 61)),
      ((sH ^ (sH >>> 14)) >>> 0) / 4294967296
    );
  };
}
var jR = class {
    constructor(sG) {
      this.itemData = sG;
    }
    get iconPath() {
      return this.itemData.iconPath ?? "textures/empty";
    }
    get items() {
      return this.itemData.items ?? [];
    }
    get localizationKey() {
      return "shop.item." + this.itemData.id;
    }
    get price() {
      return this.itemData.price;
    }
    giveItems(sG) {
      for (let sH of this.items) {
        let sI = new jP(sH.item, sH.amount);
        sG.getComponent("inventory")?.container.addItem(sI);
      }
    }
  },
  jS = class {
    constructor(sG) {
      this.shopData = sG;
      for (let sH of sG.catalog) {
        let sI = new jR(sH);
        this.catalog.push(sI);
      }
    }
    catalog = [];
    get id() {
      return this.shopData.id;
    }
    getCatalog() {
      return this.catalog;
    }
    getCatalogForNpc(sG) {
      let sH = this.getCatalog();
      return this.getSeededRandomItems(sH, this.shopData.npcCatalogConfig?.maxItems ?? sH.length, sG);
    }
    tryBuyItem(sG, sH) {
      let { player: sI, zeni: sK } = sG;
      return sK.value >= sH.price
        ? (sI.getComponent("inventory")?.container.emptySlotsCount ?? 0) < sH.items.length
          ? (sI.sendMessage({ translate: "shop.result.inventory_full" }), !1)
          : (sK.removeValue(sH.price), sH.giveItems(sG.player), sI.playSound("random.levelup", { pitch: 4 }), !0)
        : (sI.sendMessage({ translate: "shop.result.insufficient_zeni" }), !1);
    }
    getSeededRandomItems(sG, sH, sI) {
      let sK = jQ(sI);
      return [...sG].sort(() => sK() - 0.5).slice(0, sH);
    }
  },
  jT = class {
    instances = new Map();
    getShop(sG) {
      return this.instances.get(sG);
    }
    register(sG) {
      let sH = new jS(sG);
      this.instances.set(sG.id, sH);
    }
  },
  jU = new jT(),
  jV = class {
    dialoguesMap = new Map();
    getNpcDialogues() {
      let sG = [];
      for (let sH of this.dialoguesMap.values()) this.isNpcDialogue(sH) && sG.push(sH);
      return sG;
    }
    getDialogue(sG) {
      return this.dialoguesMap.get(sG);
    }
    getNpcDialogue(sG) {
      return this.getNpcDialogues().find((sH) => sH.npcId === sG);
    }
    registerDialogue(sG) {
      this.dialoguesMap.set(sG.id, sG);
    }
    async showDialogue(sG, sH, sI) {
      let sK = hO(sG),
        { cooldowns: sL, quests: sM } = sK;
      if (sI.npcId === "dbe:master_roshi") sK.claimBulmaStaffReward();
      if (sI.requirements) {
        let { requirements: sO } = sI;
        if (!dC.testAll(sK, sO ?? [])) {
          sG.sendMessage({ translate: "ui.dbe.npcIgnored." + aO.randomInt(1, 6) });
          return;
        }
      }
      if (sI.addQuest) {
        let { questId: sP, requirements: sQ } = sI.addQuest,
          sR = sM.hasQuest(sP),
          sS = sM.getCompletedQuestIds().includes(sP),
          sT = dC.testAll(sK, sQ ?? []);
        if (!sR && !sS && sT) {
          await sM.addQuest(sP);
          return;
        }
      }
      let sN = new jO()
        .title(sI.title ?? "")
        .body(sI.body ? this.resolveDialogueBody(sK, sI.body) : "")
        .button(sI.backButtonDialogue ? "ui.dbe.backButton" : "");
      if (sI.buttons)
        for (let sU of sI.buttons) {
          let t1 = dC.testAll(sK, sU.requirements ?? []);
          if (sU.cooldown) {
            let t2 = sL.getCooldown(sU.cooldown.id);
            t2 && !t2.isExpired() && (t1 = !1);
          }
          sN.button(t1 ? sU.buttonText : "", sU.iconPath);
        }
      jN.run(() => {
        sN.show(sG).then((t3) => {
          if (t3.selection === 0 && sI.backButtonDialogue) {
            let t6 = this.getDialogue(sI.backButtonDialogue);
            t6 && this.showDialogue(sG, sH, t6);
          }
          if (t3.selection && sI.buttons) {
            let t7 = sI.buttons[t3.selection - 1];
            this.onButtonClick(sG, sH, sI, t7);
          }
        });
      });
    }
    createMentorDialogue(sG, sH) {
      return {
        id: sG.id,
        body: "ui.dbe.mentor.invite.text",
        title: sG.title,
        buttons: [
          {
            buttonText: "ui.dbe.mentor.invite.button.confirm",
            onClick: (sI) => {
              let { masterManager: sK } = hO(sI);
              sK.setCurrentMaster(sH);
            },
          },
        ],
      };
    }
    createShopDialogue(sG, sH, sI) {
      let sK = this.generateShopMenu(sG, sH, sI);
      return { id: sI, buttons: sK.buttons, title: sK.title };
    }
    createSkillsDialogue(sG, sH, sI) {
      let sK = this.generateSkillMenu(sG, sI);
      return { id: sH, buttons: sK.buttons, title: sK.title };
    }
    generateShopMenu(sG, sH, sI) {
      let sK = hO(sG),
        sL = [],
        sM = jU.getShop(sI);
      if (sM) {
        for (let sN of sM.getCatalogForNpc(Number(sH.id)))
          sL.push({
            buttonText: {
              rawtext: [
                { translate: sN.localizationKey },
                { text: " " },
                ...(d6(sN.price, "zeni").rawtext ?? []),
                { text: "\n§8" },
                { translate: sN.localizationKey + ".description" },
                { text: "\n\n" },
                ...sN.items.map(({ item: sO }) => ({
                  rawtext: [{ translate: jM.get(sO)?.localizationKey }, { text: ", " }],
                })),
              ],
            },
            iconPath: sN.iconPath,
            onClick: () => sM.tryBuyItem(sK, sN),
          });
      }
      return { buttons: sL, title: "ui.dbe.shop.title" };
    }
    generateSkillMenu(sG, sH) {
      let { skills: sI, pointsManager: sK } = hO(sG),
        sL = [];
      for (let sM of jL) {
        let { availableTrainers: sN, id: sO, price: sP, type: sQ } = sM;
        if (!sN?.includes(sH) || !sI.canLearnSkill(sO)) continue;
        let sR = "skill." + sO,
          sS = sI.hasSkill(sO);
        sL.push({
          buttonText: {
            rawtext: [
              { translate: sR },
              { text: " " },
              ...(sS ? [{ text: "§a" }, { translate: "skill.learned" }] : (d6(sP ?? 0, "skill_points").rawtext ?? [])),
              { text: "\n\n§r§8" },
              { translate: "skill." + sO + ".description" },
              { text: " (" },
              { translate: "skill.type." + sQ },
              { text: ")" },
            ],
          },
          onClick: () => {
            if (!sI.hasSkill(sO) && sI.canLearnSkill(sO) && (!sP || sK.trySpend("skill_points", sP)))
              sI.tryLearnSkill(sO);
          },
        });
      }
      return { buttons: sL, title: "ui.dbe.learn_skills.title" };
    }
    isNpcDialogue(sG) {
      return sG.npcId !== void 0;
    }
    onButtonClick(sG, sH, sI, sK) {
      let sL = hO(sG),
        { nextDialogue: sM, rewards: sN } = sK,
        sO = sI.subMenus?.find(({ id: sP }) => sP === sM);
      if (
        (sK.onClick && sK.onClick(sG),
        sK.cooldown && sL.cooldowns.setCooldown(sK.cooldown.id, sK.cooldown.duration, sK.cooldown.source),
        sN)
      )
        for (let sP of sN) {
          let sQ = gB.get(sP.type);
          if (sQ) {
            let sR = new sQ(sP);
            sR.tryGrantReward(sL), sR.sendRewardMessage(sL);
          }
        }
      if (sO) {
        if (this.isNpcDialogue(sI)) {
          if (sO.type === "mentor_invite") {
            let sS = this.createMentorDialogue(sO, sH.typeId);
            this.showDialogue(sG, sH, sS);
            return;
          }
          if (sO.type === "shop") {
            let sT = this.createShopDialogue(sG, sH, sO.id);
            this.showDialogue(sG, sH, sT);
            return;
          }
          if (sO.type === "skills") {
            let sU = this.createSkillsDialogue(sG, sO.id, sH.typeId);
            this.showDialogue(sG, sH, sU);
            return;
          }
        }
        this.showDialogue(sG, sH, sO);
      }
    }
    resolveDialogueBody(sG, sH) {
      if (Array.isArray(sH)) {
        for (let sI of sH) if (dC.testAll(sG, sI.requirements)) return sI.text;
        return "";
      }
      return sH;
    }
  },
  jW = new jV();
import { ActionFormData as jX } from "@minecraft/server-ui";
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
    sH.isTraining && sN.push(...sH.getDescription().rawtext),
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
    removeTimeChamberHostile(entity);
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
    let { hasStartedAdventure: sI, isActionBlocked: sK } = hO(sG);
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
    flight?.isEnabled && flight.disable();
    eO(sG).updateEntityRegions(sH), eO(sI).updateEntityRegions(sH);
  }
  afterPlayerHotbarSelectedSlotChange({ newSlotSelected: sG, player: sH, previousSlotSelected: sI }) {
    let radar = aN.getEquippedItem(sH, l.Mainhand);
    radar?.typeId === "dbe:dragon_radar" ? jE.scanDragonBalls(sH) : jE.reset(sH);
    let { guard: sK } = hO(sH);
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
import { CONFIG as kG } from "./config/config.js";
var kH = class extends jZ {
    constructor(sG) {
      super(sG), jZ.lastMenuId.set(sG.id, "training"), this.setTitle("ui.dbe.training.title");
      let sH = hO(sG),
        { concentrationTraining: sI } = sH,
        { isTraining: sK } = sI;
      sI.checkAndUpdateAttempts(),
        sK || this.addButton("ui.dbe.training.button.shadow_dummy", () => this.shadowTraining()),
        (sK || sI.remainingAttempts > 0) &&
          this.addButton(
            sK ? "ui.dbe.training.button.stop_concentration" : "ui.dbe.training.button.concentration",
            () => {
              sK ? sI.stopTraining() : sI.startTraining();
            },
          );
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
    cj.registerActionForm("transformations", kj);
}
kJ();
import { CONFIG as kK } from "./config/config.js";
function kL() {
  if (kK.BANNED_ITEMS.ENABLED) {
    for (let sG of kK.BANNED_ITEMS.ITEMS) iR.ban(sG);
  }
}
kL();
import { system as kM } from "@minecraft/server";
import { GameMode as kN } from "@minecraft/server";
var kO = { "dbe:kame_house_sign": 12 },
  kP = class {
    constructor() {
      this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract({ block: sG, player: sH }) {
      if (sH && sH.getGameMode() === kN.Creative) {
        let sI = Number(sG.permutation.getState("dbe:part")) + 1;
        sG.setPermutation(sG.permutation.withState("dbe:part", sI % (kO[sG.typeId] + 1)));
      }
    }
  };
import { BlockPermutation as kQ, GameMode as kR, system as kS, world as kT } from "@minecraft/server";
var kU = class {
  constructor() {
    (this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this)),
      (this.onTick = this.onTick.bind(this)),
      (this.onPlayerInteract = this.onPlayerInteract.bind(this));
  }
  beforeOnPlayerPlace(sG) {
    let sH = iH.getDragonBall(sG.permutationToPlace.type.id);
    sG.permutationToPlace = sG.permutationToPlace.withState("dbe:is_petrified", sH?.isPetrified ?? !0);
  }
  onTick({ block: sG, dimension: sH }) {
    try {
    let sI = iH.getDragonBall(sG.typeId);
    if (!sI) return;
    let { permutation: sK, typeId: sL } = sG,
      sM = sG.center(),
      sN = sK.getAllStates(),
      sO = sN["dbe:is_petrified"],
      sP = sI.requiredBalls - 1;
    if (sO !== void 0) {
      if (sO !== sI.isPetrified) {
        (sN["dbe:is_petrified"] = sI.isPetrified), sG.setPermutation(kQ.resolve(sG.typeId, sN));
        return;
      }
      if (!sO && kS.currentTick % 20 === 0) {
        let sQ = aF.getNearbyBlocks(sL, sH, sM, 1);
        if (!sQ.length) return;
        let sR = sQ.some((sT) => +(sT.permutation.getState("dbe:level") === sP)),
          sS = Math.min(sP, sQ.length - 1);
        (sN["dbe:level"] = sS),
          (sN["dbe:is_powered"] = sR),
          sG.setPermutation(kQ.resolve(sG.typeId, sN)),
          sS === sP &&
          kS.runTimeout(() => {
            try {
              const block = sH.getBlock({ x: Math.floor(sM.x), y: Math.floor(sM.y), z: Math.floor(sM.z) });
              if (block?.typeId === sL) {
                sH.spawnParticle("dbe:dragon_ball_warn", sM), sH.playSound("block.dragon_ball.glowing", sM);
              }
            } catch (error) {
              if (!aF.isUnavailable(error)) console.warn("[Dragon Universe] Dragon Ball effect failed: " + (error?.stack ?? error));
            }
          });
      }
    }
    } catch (error) {
      if (!aF.isUnavailable(error)) console.warn("[Dragon Universe] Dragon Ball tick failed: " + (error?.stack ?? error));
    }
  }
  onPlayerInteract({ block: sG, dimension: sH, player: sI }) {
    if (sI) {
      let sK = iH.getDragonBall(sG.typeId);
      if (!sK || sK.isPetrified) return;
      let sL = sG.center(),
        sM = aF.getNearbyBlocks(sG.typeId, sH, sL, 1).slice(0, sK.requiredBalls);
      if (sM.length === sK.requiredBalls) {
        jC.spawnShenronFromDragonBall(sI, sK, sH, sL);
        for (let sN of sM) sN.setType("minecraft:air");
        sI?.getGameMode() !== kR.Creative && sK.petrify();
      } else {
        if (sG.getItemStack()) {
          let sO = kT.getLootTableManager().generateLootFromBlock(sG);
          if ((sG.setType("minecraft:air"), sO)) {
            for (let sP of sO) sH.spawnItem(sP, sG.center());
          }
        }
      }
    }
  }
};
import { EquipmentSlot as kV, ItemStack as kW, system as kX } from "@minecraft/server";
import { ActionFormData as kY } from "@minecraft/server-ui";
var kZ = 15,
  l0 = 10,
  l1 = { "minecraft:coal": 1, "minecraft:charcoal": 1, "minecraft:coal_block": 9, "minecraft:lava_bucket": 14 },
  l2 = class {
    static applyRegionEffects(sG, sH) {
      sG.playSound("block.gravity_machine.ambient", sH), sG.spawnParticle("dbe:gravity_machine_delimitation", sH);
      for (let sI of sG.getPlayers({ location: sH, maxDistance: 8 })) aN.applyCameraShake(sI, 0.005, 1, !0);
    }
    static getFuel(sG) {
      return Number(sG.permutation.getState("dbe:fuel"));
    }
    static getLevel(sG) {
      return Number(sG.permutation.getState("dbe:level")) + 1;
    }
    static getGravityMachineId(sG) {
      let sH = sG.bottomCenter();
      return "gravity_machine:" + JSON.stringify(sH);
    }
    static getItemFuelValue(sG) {
      return l1[sG] ?? 0;
    }
    static isEnabled(sG) {
      return sG.permutation.getState("dbe:is_powered");
    }
    static setFuel(sG, sH) {
      let sI = Math.min(sH, kZ);
      sG.setPermutation(sG.permutation.withState("dbe:fuel", sI));
    }
    static setLevel(sG, sH) {
      let sI = Math.min(sH, l0);
      sG.setPermutation(sG.permutation.withState("dbe:level", sI));
    }
    static setPoweredState(sG, sH) {
      sG.permutation.getState("dbe:is_powered") !== sH &&
        (sG.setPermutation(sG.permutation.withState("dbe:is_powered", sH)),
        this.updateRegion(sG),
        sH
          ? sG.dimension.playSound("beacon.activate", sG.location)
          : sG.dimension.playSound("beacon.deactivate", sG.location));
    }
    static showMenu(sG, sH) {
      let sI = this.getLevel(sH) + 1,
        sK = this.getFuel(sH),
        sL = new kY();
      sL.title("ui.dbe.gravity_machine.title"),
        sL.body({ translate: "ui.dbe.gravity_machine.text", with: [sK + "\n", sI + "\n\n"] });
      for (let sM = 0; sM < l0 - 1; sM++) sL.button("x" + (sM + 2));
      sL.show(sG).then((sN) => {
        if (sN.selection !== void 0) {
          let sO = sN.selection,
            sP = sI;
          this.setLevel(sH, sO), this.showMenu(sG, sH);
          let sQ = sH.center();
          sH.dimension.playSound("ui.upgrade", sQ), sP !== sO && this.updateRegion(sH);
        }
      });
    }
    static tryConsumeSlotItemAsFuel(sG, sH) {
      let sI = sH.getItem();
      if (!sI) return !1;
      let sK = this.getFuel(sG);
      if (sK >= kZ) return !1;
      let sL = this.getItemFuelValue(sI.typeId);
      return !sL || sK + sL > kZ
        ? !1
        : (this.setFuel(sG, sK + sL),
          sG.dimension.playSound("respawn_anchor.charge", sG.center()),
          sI.typeId === "minecraft:lava_bucket"
            ? sH.setItem(new kW("minecraft:bucket"))
            : sH.amount === 1
              ? sH.setItem(void 0)
              : sH.amount--,
          !0);
    }
    static updateRegion(sG) {
      let sH = this.getGravityMachineId(sG);
      if (this.isEnabled(sG)) {
        let sI = eO(sG.dimension),
          sK = sG.bottomCenter(),
          { x: sL, y: sM, z: sN } = sK;
        sI.setRegionAsync({
          id: sH,
          dimensionId: sG.dimension.id,
          gravity: this.getLevel(sG),
          pos1: new bP(sL - 8, sM, sN - 8),
          pos2: new bP(sL + 8, sM + 16, sN + 8),
          allowQuests: !1,
        });
      } else eO(sG.dimension).remove(sH);
    }
  },
  l3 = class {
    constructor() {
      (this.onPlayerInteract = this.onPlayerInteract.bind(this)),
        (this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this)),
        (this.onTick = this.onTick.bind(this));
    }
    onTick({ block: sG, dimension: sH }) {
      if (sG.isValid) {
        let sI = sG.permutation.getState("dbe:is_powered"),
          sK = l2.getFuel(sG);
        if (kX.currentTick % 8 === 0) {
          let sL = sG.offset(new bP(0, 1, 0)),
            sM = sL && sL.typeId === "minecraft:hopper" && sL.permutation.getState("facing_direction") === 0;
          if (sK < kZ && sM) {
            let sN = sL.getComponent("minecraft:inventory")?.container;
            if (sN)
              for (let sO = 0; sO < sN.size; sO++) {
                let sP = sN.getSlot(sO);
                if (l2.tryConsumeSlotItemAsFuel(sG, sP)) break;
              }
          }
        }
        if (sI) {
          let sQ = sG.bottomCenter(),
            sR = Math.floor(500 / l2.getLevel(sG)),
            sS = l2.getGravityMachineId(sG);
          sK || l2.setPoweredState(sG, !1),
            kX.currentTick % sR === 0 && l2.setFuel(sG, sK - 1),
            kX.currentTick % 20 === 0 && l2.applyRegionEffects(sH, sQ),
            kX.runTimeout(() => {
              sG.isValid && sG.typeId !== "dbe:gravity_machine" && eO(sH).remove(sS);
            }, 1);
        }
      }
    }
    onPlayerInteract({ block: sG, player: sH }) {
      if (sH && !sH.isSneaking) {
        let sI = sH?.getComponent("minecraft:equippable");
        if (sI) {
          let sK = sI.getEquipmentSlot(kV.Mainhand);
          if (l2.tryConsumeSlotItemAsFuel(sG, sK)) return;
        }
        l2.showMenu(sH, sG);
      }
    }
    onRedstoneUpdate({ block: sG, powerLevel: sH }) {
      let sI = l2.isEnabled(sG),
        sK = l2.getFuel(sG);
      !sI && sH && sK && l2.setPoweredState(sG, !0), sI && !sH && l2.setPoweredState(sG, !1);
    }
  };
import { Direction as l4, EquipmentSlot as l5 } from "@minecraft/server";
var l6 = class {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract({ block: sG, face: sH, player: sI }) {
    if (sH === l4.Up && sI) {
      let { permutation: sK } = sG;
      if (!!!sK.getState("dbe:double_bit") && aN.getEquippedItem(sI, l5.Mainhand)?.typeId === sG.typeId) {
        let sL = sG.permutation.withState("dbe:double_bit", !0);
        sG.setPermutation(sL), aQ.decrementStack(sI);
      }
    }
  }
};
bK.setEnabledBlockComponents([
  "solariscore:crop",
  "solariscore:door",
  "solariscore:grass",
  "solariscore:leaves",
  "solariscore:particle_emitter",
  "solariscore:sapling",
]),
  kM.beforeEvents.startup.subscribe(({ blockComponentRegistry: sG }) => {
    sG.registerCustomComponent("dbe:change_part", new kP()),
      sG.registerCustomComponent("dbe:dragon_ball", new kU()),
      sG.registerCustomComponent("dbe:gravity_machine", new l3()),
      sG.registerCustomComponent("dbe:slab", new l6());
  });
import { modifiers_data as l7 } from "./data/modifiers_data.js";
import { regionsData as l8 } from "./data/regions_data.js";
import { skills_data as l9 } from "./data/skills_data.js";
import { system as lb } from "@minecraft/server";
import {
  CommandPermissionLevel as lf,
  CustomCommandParamType as lj,
  CustomCommandStatus as lk,
  Player as lp,
} from "@minecraft/server";
var lq = {
  customCommand: {
    name: "dbe:ban",
    description: "Use para banir um jogador.",
    permissionLevel: lf.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: lj.String }],
    optionalParameters: [{ name: "reason", type: lj.String }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    sG instanceof lp && sG.name !== sH && gI.ban(sH, sI), { status: lk.Success }
  ),
};
import {
  CommandPermissionLevel as lv,
  CustomCommandParamType as lw,
  CustomCommandStatus as lx,
  Player as ly,
  system as lz,
} from "@minecraft/server";
var lA = {
  customCommand: {
    name: "dbe:data",
    description: "Use para ver os dados de jogadores.",
    permissionLevel: lv.GameDirectors,
    optionalParameters: [{ name: "victim", type: lw.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    sG instanceof ly &&
      lz.run(() => {
        if (sH)
          for (let sI of sH) {
            let sK = i3.getDBEEntity(sI);
            if (sK) {
              let { data: sL } = sK;
              sG.sendMessage(
                (sI instanceof ly ? sI.name : sI.id) + ": \n§a" + JSON.stringify(sL.getData(), null, "  "),
              );
            }
          }
        else {
          let sM = i3.getDBEEntity(sG);
          if (sM) {
            let { data: sN } = sM;
            sG.sendMessage("§a" + JSON.stringify(sN.getData(), null, "  "));
          }
        }
      }),
    { status: lx.Success }
  ),
};
import {
  CommandPermissionLevel as lB,
  CustomCommandParamType as lC,
  CustomCommandStatus as lD,
  EntityTypes as lE,
  system as lF,
  world as lG,
} from "@minecraft/server";
var lH = {
  customCommand: {
    name: "dbe:entities",
    description: "",
    permissionLevel: lB.GameDirectors,
    mandatoryParameters: [
      { name: "dimension", type: lC.String },
      { name: "destination", type: lC.Location },
    ],
  },
  callback: (sG, sH, sI) => {
    let sK = lG.getDimension(sH),
      sL = lE.getAll().filter((sP) => sP.id.startsWith("dbe:")),
      sM = 2,
      sN = 0,
      sO = sI;
    return (
      lF.run(() => {
        for (let sP of sL) {
          try {
            let sQ = d4(sP.id, sK, sO);
            sQ && i3.getDBEEntity(sQ)?.attributes.getAttribute("constitution")?.setValue(9999999);
          } catch {}
          (sN += sM), (sO.x += sM), sN >= 16 && ((sO.x -= sN), (sO.z += sM), (sN = 0));
        }
      }),
      { status: lD.Success }
    );
  },
};
import { CommandPermissionLevel as lI, CustomCommandStatus as lJ, world as lK } from "@minecraft/server";
var lL = {
  customCommand: {
    name: "dbe:fixstructures",
    description: "Recarrega as estruturas. Reinicie o mundo para aplicar as alterações.",
    permissionLevel: lI.Admin,
  },
  callback: () => (bG(lK, "structures").set("loaded", []), { status: lJ.Success }),
};
import { skills_data as lM } from "./data/skills_data.js";
import {
  CommandPermissionLevel as lN,
  CustomCommandParamType as lO,
  CustomCommandStatus as lP,
  Player as lQ,
} from "@minecraft/server";
var lR = {
  customCommand: {
    name: "dbe:learn",
    description: "Use para aprender novas habilidades.",
    permissionLevel: lN.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: lO.Enum }],
    optionalParameters: [
      { name: "level", type: lO.Integer },
      { name: "victim", type: lO.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof lQ)) continue;
      let { skills: sN } = hO(sM);
      if (sH === "*")
        for (let { id: sO } of lM) {
          let sP = sN.tryLearnSkill(sO);
          sI && sP?.setLevel(sI);
        }
      else {
        let sQ = sN.tryLearnSkill(sH);
        sI && sQ?.setLevel(sI);
      }
    }
    return { status: lP.Success };
  },
};
import {
  CommandPermissionLevel as lS,
  CustomCommandParamType as lT,
  CustomCommandStatus as lU,
  system as lV,
} from "@minecraft/server";
function lW(sG, sH) {
  lV.run(() => {
    eP.getAllRegions()
      .find(({ id: sI }) => sI === sH)
      ?.teleportToRegion(sG);
  });
}
var lX = {
  customCommand: {
    name: "dbe:region",
    description: "Teleporta entidades para regiões específicas do add-on.",
    permissionLevel: lS.GameDirectors,
    mandatoryParameters: [{ name: "dbe:region", type: lT.Enum }],
    optionalParameters: [{ name: "victim", type: lT.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) lW(sL, sH);
    return { status: lU.Success };
  },
};
import {
  CommandPermissionLevel as lY,
  CustomCommandParamType as lZ,
  CustomCommandStatus as m0,
  Player as m1,
} from "@minecraft/server";
var m2 = {
  customCommand: {
    name: "dbe:removemodifier",
    description: "Remove modificadores.",
    permissionLevel: lY.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: lZ.Enum }],
    optionalParameters: [{ name: "victim", type: lZ.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof m1)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.removeModifier(sH);
    }
    return { status: m0.Success };
  },
};
import { skills_data as m3 } from "./data/skills_data.js";
import {
  CommandPermissionLevel as m4,
  CustomCommandParamType as m5,
  CustomCommandStatus as m6,
  Player as m7,
  system as m8,
} from "@minecraft/server";
var m9 = {
  customCommand: {
    name: "dbe:removeskill",
    description: "Remove habilidades.",
    permissionLevel: m4.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: m5.Enum }],
    optionalParameters: [{ name: "victim", type: m5.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    m8.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof m7)) continue;
        let { skills: sM } = hO(sL);
        if (sH === "*") {
          for (let { id: sN } of m3) sM.removeSkill(sN);
        } else sM.removeSkill(sH);
      }
    }),
    { status: m6.Success }
  ),
};
import {
  CommandPermissionLevel as mb,
  CustomCommandParamType as mf,
  CustomCommandStatus as mj,
  Player as mk,
} from "@minecraft/server";
var mp = {
  customCommand: {
    name: "dbe:reset",
    description: "Reseta os dados de um ou mais jogadores.",
    permissionLevel: mb.GameDirectors,
    optionalParameters: [{ name: "player", type: mf.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    let sI = sH ?? (sG ? [sG] : []);
    for (let sK of sI) sK instanceof mk && hO(sK).reset();
    return { status: mj.Success };
  },
};
import {
  CommandPermissionLevel as mq,
  CustomCommandParamType as mv,
  CustomCommandStatus as mw,
  Player as mx,
} from "@minecraft/server";
var my = {
  customCommand: {
    name: "dbe:setattribute",
    description: "Define atributos (força, destreza, etc.).",
    permissionLevel: mq.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:attribute", type: mv.Enum },
      { name: "value", type: mv.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mv.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof mx)) continue;
      let { attributes: sN } = hO(sM);
      if (sH === "*") {
        for (let sO of e8) sN.getAttribute(sO)?.setValue(sI);
      } else sN.getAttribute(sH)?.setValue(sI);
    }
    return { status: mw.Success };
  },
};
import {
  CommandPermissionLevel as mz,
  CustomCommandParamType as mA,
  CustomCommandStatus as mB,
} from "@minecraft/server";
var mC = {
  customCommand: {
    name: "dbe:setcolor",
    description: "Define cores específicas (aura, cabelo, etc.).",
    permissionLevel: mz.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:color", type: mA.Enum },
      { name: "red", type: mA.Integer },
      { name: "green", type: mA.Integer },
      { name: "blue", type: mA.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mA.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK, sL, sM) => {
    let sN = sM ?? (sG ? [sG] : []);
    for (let sO of sN) {
      let sP = i3.getDBEEntity(sO);
      if (sP) {
        let { colors: sQ, ki: sR } = sP;
        sQ.setDefaultColor(sH, aI.normalize({ red: sI, green: sK, blue: sL })), sR.updateAuraColor();
      }
    }
    return { status: mB.Success };
  },
};
import {
  CommandPermissionLevel as mD,
  CustomCommandParamType as mE,
  CustomCommandStatus as mF,
  Player as mG,
  system as mH,
} from "@minecraft/server";
var mI = {
  customCommand: {
    name: "dbe:setcustom",
    description: "Define customizações de um ou mais jogadores",
    permissionLevel: mD.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:customId", type: mE.Enum },
      { name: "index", type: mE.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mE.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => (
    mH.run(() => {
      let sL = sK ?? (sG ? [sG] : []);
      for (let sM of sL) sM instanceof mG && hO(sM).playerCustomization.setOptionValue(sH, sI);
    }),
    { status: mF.Success }
  ),
};
import {
  CommandPermissionLevel as mJ,
  CustomCommandParamType as mK,
  CustomCommandStatus as mL,
  Player as mM,
} from "@minecraft/server";
var mN = {
  customCommand: {
    name: "dbe:setmodifier",
    description: "Define modificadores.",
    permissionLevel: mJ.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: mK.Enum }],
    optionalParameters: [{ name: "victim", type: mK.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mM)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.setModifier(sH);
    }
    return { status: mL.Success };
  },
};
import {
  CommandPermissionLevel as mO,
  CustomCommandParamType as mP,
  CustomCommandStatus as mQ,
  Player as mR,
  system as mS,
} from "@minecraft/server";
async function mT(sG, sH) {
  let { quests: sI } = sG;
  sI.hasQuest(sH) && (sI.deleteQuest(sH), await mS.waitTicks(20)), sI.addQuest(sH);
}
var mU = {
  customCommand: {
    name: "dbe:setquest",
    description: "Use para adicionar novas missões.",
    permissionLevel: mO.GameDirectors,
    mandatoryParameters: [{ name: "dbe:quest", type: mP.Enum }],
    optionalParameters: [{ name: "victim", type: mP.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mR)) continue;
      let sM = hO(sL);
      if (sH === "*") {
        for (let { id: sN } of g5.getAllQuestData()) mT(sM, sN);
      } else mT(sM, sH);
    }
    return { status: mQ.Success };
  },
};
import {
  CommandPermissionLevel as mV,
  CustomCommandParamType as mW,
  CustomCommandStatus as mX,
  Player as mY,
  system as mZ,
} from "@minecraft/server";
var n0 = {
  customCommand: {
    name: "dbe:setrace",
    description: "Define a raça de um ou mais jogadores",
    permissionLevel: mV.GameDirectors,
    mandatoryParameters: [{ name: "dbe:race", type: mW.Enum }],
    optionalParameters: [{ name: "victim", type: mW.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    mZ.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof mY)) continue;
        let sM = hO(sL);
        fR.isRaceAvailableForPlayer(sM, sH)
          ? sM.setRace(sH)
          : sL.sendMessage({ translate: "message.changeRace.noPermission" });
      }
    }),
    { status: mX.Success }
  ),
};
import {
  CommandPermissionLevel as n1,
  CustomCommandParamType as n2,
  CustomCommandStatus as n3,
  Player as n4,
} from "@minecraft/server";
var n5 = {
  customCommand: {
    name: "dbe:setvalue",
    description: "Define certos valores (nível, pontos de treinamento, etc.).",
    permissionLevel: n1.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:value", type: n2.Enum },
      { name: "value", type: n2.Integer },
    ],
    optionalParameters: [{ name: "player", type: n2.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []),
      sM = n3.Failure;
    for (let sN of sL) {
      if (!(sN instanceof n4)) continue;
      let sO = hO(sN);
      switch (sH) {
        case "alignment":
          sO.alignment.setAlignment(sI), (sM = n3.Success);
          break;
        case "attribute_points":
          sO.pointsManager.add("attribute_points", sI), (sM = n3.Success);
          break;
        case "mastery":
          let { masteries: sP, transformations: sQ } = sO;
          sP.getMastery(sQ.currentTransformation.id)?.setPercentage(sI), (sM = n3.Success);
          break;
        case "skill_points":
          sO.pointsManager.add("skill_points", sI), (sM = n3.Success);
          break;
        case "zeni":
          sO.zeni.setValue(sI), (sM = n3.Success);
          break;
        case "level":
          sO.level.setLevel(sI), (sM = n3.Success);
          break;
      }
    }
    return { status: sM };
  },
};
import {
  CommandPermissionLevel as n6,
  CustomCommandParamType as n7,
  CustomCommandStatus as n8,
  Player as n9,
  system as nb,
} from "@minecraft/server";
var nf = {
  customCommand: {
    name: "dbe:showform",
    description: "Abre um formulário para um jogador.",
    permissionLevel: n6.GameDirectors,
    mandatoryParameters: [{ name: "dbe:actionform", type: n7.Enum }],
    optionalParameters: [{ name: "victim", type: n7.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nb.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) sL instanceof n9 && cj.displayForm(sL, sH);
    }),
    { status: n8.Success }
  ),
};
import {
  CommandPermissionLevel as nj,
  CustomCommandParamType as nk,
  CustomCommandStatus as np,
  system as nq,
} from "@minecraft/server";
var nv = {
  customCommand: {
    name: "dbe:transform",
    description: "Transforma jogadores.",
    permissionLevel: nj.GameDirectors,
    mandatoryParameters: [{ name: "dbe:transformation", type: nk.Enum }],
    optionalParameters: [{ name: "victim", type: nk.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nq.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        let sM = i3.getDBEEntity(sL);
        sM && sM.transformations.getTransformationById(sH)?.transform();
      }
    }),
    { status: np.Success }
  ),
};
import {
  CommandPermissionLevel as nw,
  CustomCommandParamType as nx,
  CustomCommandStatus as ny,
  Player as nz,
} from "@minecraft/server";
var nA = {
  customCommand: {
    name: "dbe:unban",
    description: "Use para desbanir um jogador.",
    permissionLevel: nw.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: nx.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (sG instanceof nz && sG.name !== sH && gI.unban(sH), { status: ny.Success }),
};
import {
  CommandPermissionLevel as nB,
  CustomCommandStatus as nC,
  Player as nD,
  system as nE,
  world as nF,
} from "@minecraft/server";
var nG = {
  customCommand: { name: "dbe:worlddata", description: "Exibe dados do mundo", permissionLevel: nB.GameDirectors },
  callback: ({ sourceEntity: sG }) => (
    nE.run(() => {
      let sH = bG(nF, "dragon_evolution");
      sG instanceof nD && sG.sendMessage("world: \n§a" + JSON.stringify(sH.getData(), null, "  "));
    }),
    { status: nC.Success }
  ),
};
import {
  CommandPermissionLevel as nH,
  CustomCommandParamType as nI,
  CustomCommandStatus as nJ,
  Player as nK,
  system as nL,
} from "@minecraft/server";
var nM = {
  customCommand: {
    name: "dbe:pay",
    cheatsRequired: !1,
    description: "Transfere zeni para outro jogador.",
    permissionLevel: nH.Any,
    mandatoryParameters: [
      { name: "amount", type: nI.Integer },
      { name: "player", type: nI.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nL.run(() => {
      if (sG instanceof nK)
        for (let sK of sI) {
          let { zeni: sL } = hO(sK),
            sM = hO(sG).zeni.transferValue(sH, sL);
          if (sM === "InsufficientBalance") {
            sG.sendMessage({ translate: "command.pay.insufficient_balance" });
            break;
          }
          if (sM === "InvalidAmount") {
            sG.sendMessage({ translate: "command.pay.invalid_amount" });
            break;
          }
          sM === "Success" && sG.sendMessage({ translate: "command.pay.success", with: ["" + sH, sK.name] });
        }
    }),
    { status: nJ.Success }
  ),
};
import {
  CommandPermissionLevel as nN,
  CustomCommandParamType as nO,
  CustomCommandStatus as nP,
  Player as nQ,
} from "@minecraft/server";
var nR = {
  customCommand: {
    name: "dbe:group.acceptinvite",
    description: "Aceita o convite para entrar em um grupo de jogadores.",
    permissionLevel: nN.Any,
    mandatoryParameters: [{ name: "groupName", type: nO.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof nQ) {
      let sI = eJ.getGroupByName(sH);
      return sI && eJ.acceptInvite(sG, sI.id), { status: nP.Success };
    }
  },
};
import { CommandPermissionLevel as nS, CustomCommandStatus as nT, Player as nU } from "@minecraft/server";
var nV = {
  customCommand: {
    name: "dbe:group.claim",
    description: "Reivindica a região atual como território do seu grupo.",
    permissionLevel: nS.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof nU) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      if (sH.claimedRegions.length >= sH.maxClaims) {
        sG.sendMessage({ translate: "player_group.claim.max_claims_reached" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return (
        sH.tryClaimLocation(sI, sK).then((sL) => {
          sL || sG.sendMessage({ translate: "player_group.claim.already_owned" });
        }),
        { status: nT.Success }
      );
    }
  },
};
import { CommandPermissionLevel as nW, CustomCommandStatus as nX, Player as nY } from "@minecraft/server";
var nZ = {
  customCommand: {
    name: "dbe:group.claims",
    description: "Exibe as coordenadas de todos os territórios do grupo.",
    permissionLevel: nW.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof nY)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    let { claimedRegions: sI } = sH,
      sK = sI.map(({ dimension: sL, spawnPoint: sM }, sN) => {
        let { x: sO, y: sP, z: sQ } = sM;
        return "§6" + (sN + 1) + ". §e" + sL.id + "§7: §f" + sO + " " + sP + " " + sQ;
      });
    for (let sL of sI) sH.displayClaimBorder(sG, sL);
    return sG.sendMessage([{ translate: "player_group.claim.list" }, "\n", sK.join("\n")]), { status: nX.Success };
  },
};
import { CommandPermissionLevel as o0, CustomCommandStatus as o1, Player as o2, system as o3 } from "@minecraft/server";
import { CustomForm as o4, ObservableString as o5 } from "@minecraft/server-ui";
var o6 = 800;
function o7(sG, sH) {
  let sI = eG(sH),
    sK = hO(sG),
    { zeni: sL } = sK;
  if (sL.value < o6) {
    sG.sendMessage({ translate: "shop.result.insufficient_zeni" });
    return;
  }
  if (sI.length < 3) {
    sG.sendMessage({ translate: "player_group.create.name_too_short" });
    return;
  }
  if (sI.length > 10) {
    sG.sendMessage({ translate: "player_group.create.name_too_long" });
    return;
  }
  if (eJ.getGroupByName(sI)) {
    sG.sendMessage({ translate: "player_group.create.already_exists" });
    return;
  }
  let sM = eJ.createGroup(sI);
  sM &&
    (sL.removeValue(o6),
    sG.sendMessage({ translate: "player_group.create.success", with: [sI] }),
    sM.addPlayerToGroup(sG));
}
var o8 = {
  customCommand: { name: "dbe:group.create", description: "Crie um grupo de jogadores.", permissionLevel: o0.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof o2) {
      if (eJ.hasGroup(sG)) {
        sG.sendMessage({ translate: "player_group.already_in_group" });
        return;
      }
      return (
        o3.run(() => {
          let sH = new o5("", { clientWritable: !0 }),
            sI = new o4(sG, { translate: "ui.create_group.title" });
          sI.textField({ translate: "ui.create_group.text_field.group_name" }, sH, {
            description: { translate: "ui.create_group.text", with: ["" + o6] },
          }),
            sI.button({ translate: "ui.create_group.button.confirm" }, () => {
              o7(sG, sH.getData()), sI.close();
            }),
            sI.show();
        }),
        { status: o1.Success }
      );
    }
  },
};
import { CommandPermissionLevel as o9, CustomCommandStatus as ob, Player as of } from "@minecraft/server";
var oj = {
  customCommand: {
    name: "dbe:group.friendlyfire",
    description: "Ativa ou desativa o fogo amigo do grupo.",
    permissionLevel: o9.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof of)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    if (!sH.isOwner(sG.id)) {
      sG.sendMessage({ translate: "player_group.friendlyfire.no_permission" });
      return;
    }
    let sI = sH.toggleFriendlyFire();
    sG.sendMessage({ translate: sI ? "player_group.friendlyfire.enabled" : "player_group.friendlyfire.disabled" });
    for (let sK of sH.getOnlinePlayers())
      sK.id !== sG.id &&
        sK.sendMessage({
          translate: sI ? "player_group.friendlyfire.enabled.announce" : "player_group.friendlyfire.disabled.announce",
          with: [sH.name],
        });
    return { status: ob.Success };
  },
};
import {
  CommandPermissionLevel as ok,
  CustomCommandStatus as op,
  Player as oq,
  system as ov,
  world as ow,
} from "@minecraft/server";
var ox = {
  customCommand: { name: "dbe:group.home", description: "Teleporta para a base do grupo.", permissionLevel: ok.Any },
  callback: ({ sourceEntity: sG }) => (
    ov.run(() => {
      if (sG instanceof oq) {
        let sH = eJ.getPlayerGroup(sG.id);
        if (sH) {
          let { spawnPoint: sI } = sH;
          sI
            ? (sG.sendMessage({ translate: "player_group.base.teleporting" }),
              ov.runTimeout(() => {
                if (!sG.isValid) return;
                try {
                  sG.playSound("entity.player.teleport");
                  duTravel(sG, sI.location, { dimension: ow.getDimension(duPhysicalDestinationId(sI.dimensionId)), label: "group home" });
                } catch (error) { duReportTravelFailure(sG, "group home", error); }
              }, 80))
            : sG.sendMessage({ translate: "player_group.base.not_set" });
        } else sG.sendMessage({ translate: "player_group.not_in_group" });
      }
    }),
    { status: op.Success }
  ),
};
import {
  CommandPermissionLevel as oy,
  CustomCommandParamType as oz,
  CustomCommandStatus as oA,
  Player as oB,
  system as oC,
} from "@minecraft/server";
import { CustomForm as oD } from "@minecraft/server-ui";
var oE = {
  customCommand: {
    name: "dbe:group.info",
    description: "Exibe informações de um grupo.",
    permissionLevel: oy.Any,
    mandatoryParameters: [{ type: oz.String, name: "groupName" }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oB) {
      let sI = eJ.getGroupByName(sH);
      sI &&
        oC.run(() => {
          let sK = new oD(sG, sI.name);
          sK.label("Dono: " + sI.getOwner()?.name),
            sK.spacer(),
            sK.label("Poder: " + aO.shortenNumber(sI.getGroupPower())),
            sK.spacer(),
            sK.label("Membros:");
          for (let sL of sI.members) sK.spacer(), sK.label("- " + sL.name);
          sK.show();
        });
    }
    return { status: oA.Success };
  },
};
import {
  CommandPermissionLevel as oF,
  CustomCommandParamType as oG,
  CustomCommandStatus as oH,
  Player as oI,
  world as oJ,
} from "@minecraft/server";
var oK = {
  customCommand: {
    name: "dbe:group.invite",
    description: "Convide jogadores para o seu grupo.",
    permissionLevel: oF.Any,
    mandatoryParameters: [{ name: "playerName", type: oG.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oI) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = oJ.getAllPlayers().find(({ name: sL }) => sL === sH);
      if (sK) eJ.invitePlayerToGroup(sK, sI.id);
      else {
        sG.sendMessage({ translate: "player_group.invite.player_not_found" });
        return;
      }
      return { status: oH.Success };
    }
  },
};
import {
  CommandPermissionLevel as oL,
  CustomCommandParamType as oM,
  CustomCommandStatus as oN,
  Player as oO,
} from "@minecraft/server";
var oP = {
  customCommand: {
    name: "dbe:group.kickplayer",
    description: "Remova jogadores do seu grupo.",
    permissionLevel: oL.Any,
    mandatoryParameters: [{ name: "playerName", type: oM.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oO) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = sI.getMemberByName(sH);
      if (sK) {
        if (sK.id === sG.id) {
          sG.sendMessage({ translate: "player_group.remove.owner_cannot_remove_self" });
          return;
        }
        return sI.removePlayerFromGroup(sK.id), { status: oN.Success };
      } else sG.sendMessage({ translate: "player_group.remove.player_not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oQ, CustomCommandStatus as oR, Player as oS } from "@minecraft/server";
var oT = {
  customCommand: { name: "dbe:group.leave", description: "Saia de um grupo de jogadores.", permissionLevel: oQ.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof oS) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (sH) return sH.removePlayerFromGroup(sG.id), { status: oR.Success };
      sG.sendMessage({ translate: "player_group.not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oU, CustomCommandStatus as oV, Player as oW, system as oX } from "@minecraft/server";
var oY = {
  customCommand: {
    name: "dbe:group.setbase",
    description: "Define uma base para o seu grupo.",
    permissionLevel: oU.Any,
  },
  callback: ({ sourceEntity: sG }) => (
    oX.run(() => {
      if (sG instanceof oW) {
        let { dimension: sH, location: sI } = sG,
          sK = eJ.getPlayerGroup(sG.id);
        if (!sK) {
          sG.sendMessage({ translate: "player_group.not_in_group" });
          return;
        }
        if (!sK.isOwner(sG.id)) {
          sG.sendMessage({ translate: "player_group.no_permission" });
          return;
        }
        if (
          !eO(sH)
            .getChunkRegions(sI)
            .some((sL) => sL.isOwner(sK.id))
        ) {
          sG.sendMessage({ translate: "player_group.base.not_in_claim" });
          return;
        }
        sK.setSpawnPoint(sH, sI), sG.sendMessage({ translate: "player_group.base.set.success" });
      }
    }),
    { status: oV.Success }
  ),
};
import { CommandPermissionLevel as oZ, CustomCommandStatus as p0, Player as p1 } from "@minecraft/server";
var p2 = {
  customCommand: {
    name: "dbe:group.unclaim",
    description: "Remove a reivindicação do território atual.",
    permissionLevel: oZ.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof p1) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return sH.unClaimLocation(sI, sK), { status: p0.Success };
    }
  },
};
import {
  CommandPermissionLevel as p3,
  CustomCommandParamType as p4,
  CustomCommandStatus as p5,
  Player as p6,
  system as p7,
} from "@minecraft/server";
var p8 = {
  customCommand: {
    name: "dbe:redeem",
    cheatsRequired: !1,
    description: "Resgata códigos especiais.",
    // o formato do código não tem segredo (qualquer um pode gerá-lo), então só operadores resgatam
    permissionLevel: p3.GameDirectors,
    mandatoryParameters: [{ name: "code", type: p4.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    p7.run(() => {
      sG instanceof p6 && hO(sG).redeem.redeemCode(sH);
    }),
    { status: p5.Success }
  ),
};
import { CommandPermissionLevel as p9, CustomCommandStatus as pb } from "@minecraft/server";
var pf = {
  customCommand: {
    name: "dbe:updatestats",
    cheatsRequired: !1,
    description: "Atualiza os atributos e estatísticas do jogador.",
    permissionLevel: p9.Any,
  },
  callback: ({ sourceEntity: sG }) => (sG && i3.getDBEEntity(sG)?.attributes.updateStats(), { status: pb.Success }),
};
function pj(sG) {
  sG.registerEnum("dbe:actionform", cj.getRegisteredFormIds()),
    sG.registerEnum("dbe:attribute", ["*", ...e8]),
    sG.registerEnum("dbe:color", fT.getAllOptionIds()),
    sG.registerEnum("dbe:customId", gT.getAllOptionIds()),
    sG.registerEnum(
      "dbe:modifier",
      l7.map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:quest", ["*", ...g5.getAllQuestData().map(({ id: sK }) => sK)]),
    sG.registerEnum(
      "dbe:race",
      fR.getAll().map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:region", [...l8.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:skill", ["*", ...l9.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:transformation", fO.getAllTransformationIds()),
    sG.registerEnum("dbe:value", ["alignment", "attribute_points", "mastery", "skill_points", "zeni", "level"]);
  let sH = [lq, lA, lH, lL, lR, nM, p8, lX, m2, m9, mp, my, mC, mI, mN, mU, n0, n5, nf, nv, nA, pf, nG],
    sI = [nR, nV, nZ, o8, oj, ox, oE, oK, oP, oT, oY, p2];
  for (let { customCommand: sK, callback: sL } of [...sH, ...sI]) sG.registerCommand(sK, sL);
}
lb.beforeEvents.startup.subscribe(({ customCommandRegistry: sG }) => pj(sG));
import { dialogues_data as pk } from "./data/dialogues_data.js";
import { system as pp } from "@minecraft/server";
jW.registerDialogue({
  id: "enma_daioh_main_menu",
  npcId: "dbe:enma_daioh",
  title: "ui.dbe.npc.enma_daioh.title",
  body: [
    { text: "ui.dbe.npc.enma_daioh.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
  ],
  buttons: [
    {
      buttonText: "ui.dbe.npc.enma_daioh.main.button.revive",
      onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("revive"),
    },
    { buttonText: "ui.dbe.npc.enma_daioh.main.button.reincarnate", nextDialogue: "confirm_reincarnate" },
  ],
  subMenus: [
    {
      id: "confirm_reincarnate",
      title: "ui.dbe.npc.enma_daioh.title",
      body: "ui.dbe.npc.enma_daioh.reincarnate.text",
      backButtonDialogue: "enma_daioh_main_menu",
      buttons: [
        {
          buttonText: "ui.dbe.npc.enma_daioh.reincarnate.button.confirm",
          onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("reincarnate"),
        },
      ],
    },
  ],
}),
  jW.registerDialogue({
    id: "goku_main_menu",
    npcId: "dbe:goku",
    title: "ui.dbe.npc.goku.title",
    body: [
      {
        text: "ui.dbe.npc.goku.main.text.master_bad_alignment",
        requirements: [
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 1 },
          { test: "is_alignment", value: "evil" },
        ],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_1",
        requirements: [{ test: "has_master", level: 1, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_2",
        requirements: [{ test: "has_master", level: 2, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_3",
        requirements: [{ test: "has_master", level: 3, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_4",
        requirements: [{ test: "has_master", level: 4, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_5",
        requirements: [{ test: "has_master", level: 5, value: "dbe:goku" }],
      },
      { text: "ui.dbe.npc.goku.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.goku.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.goku.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.goku.main.button.weight",
        nextDialogue: "weight",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 2 },
        ],
      },
      {
        buttonText: "ui.dbe.npc.goku.main.button.skills",
        nextDialogue: "goku_skills",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 3 },
        ],
      },
      {
        buttonText: "ui.dbe.mentor.main.button.invite",
        nextDialogue: "mentor_invite",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", operator: "!=", value: "dbe:goku" },
        ],
      },
    ],
    subMenus: [
      {
        id: "weight",
        title: "ui.dbe.npc.goku.title",
        body: "ui.dbe.weight.text",
        backButtonDialogue: "goku_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.goku.weight.button.catch",
            rewards: [{ type: "item", item: "dbe:training_shirt" }],
          },
        ],
      },
      { id: "goku_skills", backButtonDialogue: "goku_main_menu", type: "skills" },
      {
        id: "mentor_invite",
        title: "ui.dbe.npc.goku.title",
        backButtonDialogue: "goku_main_menu",
        type: "mentor_invite",
      },
    ],
  }),
  jW.registerDialogue({
    id: "kami_sama_main_menu",
    npcId: "dbe:kami_sama",
    title: "ui.dbe.npc.kami_sama.title",
    body: [
      { text: "ui.dbe.npc.kami_sama.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.cut_tail",
        nextDialogue: "cut_tail",
        requirements: [
          { test: "has_modifier", value: "saiyan_tail" },
          { test: "is_race", value: "saiyan" },
          { test: "is_alignment", operator: "!=", value: "evil" },
        ],
      },
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.skills",
        nextDialogue: "kami_sama_skills",
        requirements: [{ test: "is_alignment", operator: "!=", value: "evil" }],
      },
    ],
    subMenus: [
      {
        id: "cut_tail",
        title: "ui.dbe.npc.kami_sama.title",
        body: "ui.dbe.npc.kami_sama.cut_tail.text",
        backButtonDialogue: "kami_sama_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.kami_sama.cut_tail.button.confirm",
            onClick: (sG) => {
              hO(sG).removeTail(!0);
            },
          },
        ],
      },
      { id: "kami_sama_skills", backButtonDialogue: "kami_sama_main_menu", type: "skills" },
    ],
  });
function pv(sG) {
  jW.registerDialogue(sG);
}
function pw() {
  for (let sG of pk) pv(sG);
  pp.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:dialogue_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) pv(sL);
    }
  });
}
pw(),
  cY.register("dbe:future_trunks"),
  cY.register("dbe:hyperbolic_time_chamber"),
  cY.register("dbe:other_world"),
  cY.register("dbe:world_martial_arts_tournament");
import { entity_data as px } from "./data/entities_data.js";
import { system as py } from "@minecraft/server";
function pz() {
  for (let sG of px) fC.registerDBEEntityData(sG);
  py.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:entity_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) fC.registerDBEEntityData(sL);
    }
  });
}
pz();
import { system as pA } from "@minecraft/server";
import { Player as pB } from "@minecraft/server";
import { ItemStack as pC, system as pD, world as pE } from "@minecraft/server";
import { system as pF, world as pG } from "@minecraft/server";
var pH = class {
    constructor(sG) {
      this.dimension = sG;
    }
    onLoadCallbacks = new Set();
    *generate(sG) {
      if (!pJ.isGenerated(sG.id) && sG.isLoaded) {
        for (let sH of this.onLoadCallbacks)
          try {
            yield* sH(sG);
          } catch (sI) {
            console.error(sI);
          }
      }
    }
    onLoad(sG) {
      this.onLoadCallbacks.add(sG);
    }
  },
  pI = class {
    generatorMap = new Map();
    isGenerating = !1;
    queueMap = new Map();
    constructor() {
      every(30, "core.terrain_queue", () => { // G4
        let sG = new Set();
        for (let sH of this.generatorMap.values()) {
          let { dimension: sI } = sH;
          for (let sK of sH.dimension.getPlayers()) {
            let { location: sL } = sK,
              sM = aH.getChunkId(sI, sL);
            sG.has(sM) || (sG.add(sM), this.addToQueue(sH, sL));
          }
        }
      }, { phase: 17 });
    }
    register(sG) {
      let sH = this.getGenerator(sG);
      return sH || ((sH = new pH(sG)), this.generatorMap.set(sG.id, sH), sH);
    }
    getGenerator(sG) {
      return this.generatorMap.get(sG.id);
    }
    isGenerated(sG) {
      return !!pG.getDynamicProperty("generated:" + sG);
    }
    markChunkAsGenerated(sG) {
      return pG.setDynamicProperty("generated:" + sG, !0);
    }
    addToQueue(sG, sH) {
      let sI = aH.getNearbyChunks(sG.dimension, sH, 5);
      for (let sK of sI) {
        let { id: sL } = sK;
        !this.isGenerated(sL) && !this.queueMap.has(sL) && this.queueMap.set(sL, sG);
      }
      this.isGenerating || ((this.isGenerating = !0), pF.runJob(this.generateQueuedChunks()));
    }
    *generateQueuedChunks() {
      for (let [sG, sH] of this.queueMap) {
        let sI = aH.getChunkById(sG);
        yield* sH.generate(sI), this.queueMap.delete(sG);
      }
      this.queueMap.size ? pF.runJob(this.generateQueuedChunks()) : (this.isGenerating = !1);
    }
  },
  pJ = new pI(),
  pK = "dbe:angel_staff_dimension",
  pL = new bP(0.5, -63, 0.5),
  pM = class {
    startedDimensions = new Set();
    lastGrantedDimensionIndex = 0;
    constructor() {
      this.init();
    }
    async assignDimension(sG) {
      if (!this.getDimensionDataByOwner(sG)) {
        // só angel_staff_dimension_0..49 são registradas (init)
        if (this.lastGrantedDimensionIndex >= 49) {
          console.warn("[Dragon Universe] Sem dimensões Angel Staff livres para " + sG);
          return;
        }
        let sH = pK + "_" + ++this.lastGrantedDimensionIndex,
          sI = pE.getDimension(sH);
        await this.setup(sI),
          this.saveDimensionData({ id: sH }),
          bG(pE, "angel_staff_dimension_owners").set(sG, sH),
          bG(pE, "angel_staff_dimension").set("last_granted_dimension_index", this.lastGrantedDimensionIndex);
      }
    }
    async enterDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG,
          sL = pE.getDimension(sH);
        (sI.staffDimensionId = sK.dimension.id),
          (sI.staffLocation = sK.location),
          this.saveDimensionData(sI),
          sL &&
            (this.startedDimensions.has(sL.id) ||
              (this.startFloorGeneration(sL), this.startedDimensions.add(sL.id), await pD.waitTicks(20)),
            pD.run(() => {
              duTravel(sK, pL, { dimension: sL, label: "angel staff entry" });
            }));
      }
    }
    exitDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        pD.run(async () => {
          if (!sK.isValid) return;
          let dimension;
          try {
            if (typeof sI.staffDimensionId !== "string" || !sI.staffDimensionId)
              throw new Error("Saved angel staff return dimension is missing");
            dimension = pE.getDimension(duPhysicalDestinationId(sI.staffDimensionId));
          } catch (error) {
            duReportTravelFailure(sK, "angel staff saved destination", error);
            try { await duSafeReturnToEarth(sK, { label: "angel staff Earth fallback" }); }
            catch (fallbackError) { duReportTravelFailure(sK, "angel staff Earth fallback", fallbackError); }
            return;
          }
          await duTravel(sK, sI.staffLocation, { dimension, label: "angel staff return" });
        });
      }
    }
    getDimensionData(sG) {
      return bG(pE, "angel_staff_dimension").get(sG);
    }
    getDimensionDataByOwner(sG) {
      let sH = bG(pE, "angel_staff_dimension_owners").get(sG);
      return this.getDimensionData(sH);
    }
    isOwner(sG, sH) {
      return this.getDimensionDataByOwner(sG)?.id === sH;
    }
    saveDimensionData(sG) {
      bG(pE, "angel_staff_dimension").set(sG.id, sG);
    }
    switchDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        sK.dimension.id !== sI.id ? this.enterDimension(sG, sH) : this.exitDimension(sG, sH);
      }
    }
    init() {
      for (let sG = 0; sG < 50; sG++) cY.register(pK + "_" + sG);
      pD.run(() => {
        this.lastGrantedDimensionIndex = bG(pE, "angel_staff_dimension").get("last_granted_dimension_index") ?? 0;
      });
    }
    async setup(sG) {
      let sH = { x: 0, y: -64, z: 0 };
      let loadedArea = await duAcquireLoadedArea(sG, sH, pL, "angel staff setup");
      try {
        sG.setBlockType(sH, "minecraft:barrier");
        let sI = d4("dbe:angel_staff_entity", sG, pL);
        sI && sI.setDynamicProperty("dimension_id", sG.id);
      } finally {
        duReleaseLoadedArea(loadedArea);
      }
    }
    startFloorGeneration(sG) {
      pJ.register(sG).onLoad(function* (sH) {
        let { chunkOrigin: sI, dimension: sK } = sH,
          sL = -64;
        try {
          for (let sM = 0; sM < 16; sM++)
            for (let sN = 0; sN < 16; sN++)
              sK.setBlockType({ x: sI.x + sM, y: sL, z: sI.z + sN }, "minecraft:barrier"), yield;
          pJ.markChunkAsGenerated(sH.id);
        } catch {
          return;
        }
      });
    }
  },
  pN = new pM();
pE.afterEvents.playerDimensionChange.subscribe(({ fromDimension: sG, player: sH, toDimension: sI }) => {
  sG.id.startsWith(pK) && sH.runCommand("fog @s remove angel_staff_dimension"),
    sI.id.startsWith(pK) && sH.runCommand("fog @s push dbe:fog_angel_staff_dimension angel_staff_dimension");
}),
  pE.beforeEvents.playerInteractWithEntity.subscribe(({ player: sG, target: sH }) => {
    if (sH.typeId === "dbe:angel_staff_entity") {
      let sI = String(sH.getDynamicProperty("dimension_id"));
      if (pN.getDimensionData(sI)) {
        let { dimension: sK, isSneaking: sL } = sG,
          sM = pN.isOwner(sG.id, sI),
          sN = sK.id.startsWith(pK),
          sO = hO(sG);
        if (sM) {
          if (sL && !sN) {
            pD.run(() => {
              let { dimension: sP, location: sQ } = sH,
                sR = new pC("dbe:angel_staff");
              sP.spawnItem(sR, sQ), sH.remove();
            });
            return;
          }
          pN.switchDimension(sO, sI);
        } else sN && pN.exitDimension(sO, sI);
      }
    }
  });
var pO = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, source: sI }) {
      if (!sI.dimension.id.startsWith("dbe:angel_staff") && sI instanceof pB) {
        let sK = pN.getDimensionDataByOwner(sI.id);
        if (sK) {
          let sL = bO.add(bO.add(sG.location, aS.faceToVector(sH)), { x: 0.5, z: 0.5 }),
            sM = d4("dbe:angel_staff_entity", sG.dimension, sL);
          sM &&
            (sM.setDynamicProperty("dimension_id", sK.id), (sM.nameTag = "§w" + sI.name + "§r"), aQ.decrementStack(sI));
        }
      }
    }
  },
  pP = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL, single_use: sM } = sI,
          sN = sK.data.get("single_uses") ?? [];
        if (sM && sN.includes(sG.typeId)) return;
        for (let sO of Object.keys(sL)) sK.attributes.getAttribute(sO)?.addValue(sL[sO], !0);
        sN.push(sG.typeId), sK.data.set("single_uses", sN), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  },
  pQ = class {
    constructor() {
      this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity({ attackingEntity: sG, hitEntity: sH }) {
      let { dimension: sI, location: sK } = sH,
        sL = sI.getEntities({ location: sK, maxDistance: 3 });
      for (let sM of sL) {
        if (sM === sH || sM === sG) continue;
        let sN = bO.subtract(sM.location, sK),
          sO = bO.scale(sN, 0.9);
        sM.applyImpulse(sO);
      }
      sI.playSound("wind_charge.burst", sK), sI.spawnParticle("minecraft:wind_explosion_emitter", sK);
    }
  },
  pR = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL } = sK,
          { duration: sM, modifiers: sN } = sI;
        sL.modifiers.applyBuff(sG.typeId, sN ?? {}, sM ?? 1), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  };
import { Player as pS } from "@minecraft/server";
function pT(sG, sH) {
  let sI = sG.getViewDirection(),
    sK = d4("dbe:flying_nimbus", sG.dimension, sG.location, {
      spawnEvent: sH === "black" ? "dbe:black_flying_nimbus" : void 0,
    });
  sK &&
    (sK.getComponent("minecraft:rideable")?.addRider(sG),
    sK.setRotation(sI),
    sK.applyImpulse(sI),
    aQ.decrementStack(sG));
}
var pU = class {
  constructor() {
    this.onUse = this.onUse.bind(this);
  }
  onUse({ source: sG }, { params: sH }) {
    if (sG instanceof pS) {
      let { color: sI } = sH;
      pT(sG, sI);
    }
  }
};
import { EquipmentSlot as pV } from "@minecraft/server";
var pW = class {
  constructor() {
    this.onUse = this.onUse.bind(this);
  }
  onUse({ source: sG, itemStack: sH }) {
    let sI = sG.getComponent("minecraft:equippable");
    if (sI) {
      let sK = sI.getEquipmentSlot(pV.Mainhand),
        sL = sI.getEquipmentSlot(pV.Offhand);
      sK.setItem(sL.getItem()), sL.setItem(sH), sG.dimension.playSound("armor.equip_generic", sG.location);
    }
  }
};
bK.setEnabledItemComponents(["solariscore:durability_sensor"]),
  pA.beforeEvents.startup.subscribe(({ itemComponentRegistry: sG }) => {
    sG.registerCustomComponent("dbe:angel_staff", new pO()),
      sG.registerCustomComponent("dbe:attribute_upgrade", new pP()),
      sG.registerCustomComponent("dbe:bansho_fan", new pQ()),
      sG.registerCustomComponent("dbe:consumable_buff", new pR()),
      sG.registerCustomComponent("dbe:flying_nimbus", new pU()),
      sG.registerCustomComponent("dbe:hoi_poi_capsule", new iz()),
      sG.registerCustomComponent("dbe:keep_on_death", {}),
      sG.registerCustomComponent("dbe:patreon", {}),
      sG.registerCustomComponent("dbe:scouter", {}),
      sG.registerCustomComponent("dbe:weight", new pW());
  });
import { masters_data as pX } from "./data/masters_data.js";
function pY() {
  for (let sG of pX) g9.registerMaster(sG);
}
pY();
import { modifiers_data as pZ } from "./data/modifiers_data.js";
import { system as q0 } from "@minecraft/server";
var q1 = class {
    constructor() {
      dP.registerModifier(new dO("fusion", this.fusionModifier.bind(this))),
        dP.registerModifier(new dO("race", this.raceModifier.bind(this))),
        dP.registerModifier(new dO("skills", this.skillsModifier.bind(this))),
        dP.registerModifier(new dO("transformation", this.transformationModifier.bind(this)));
      for (let sG of pZ) this.createAndRegisterModifier(sG);
      q0.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
        if (sH === "dbe:modifier_registry") {
          let sK = JSON.parse(sI);
          for (let sL of sK) this.createAndRegisterModifier(sL);
        }
      });
    }
    fusionModifier(sG, sH) {
      if (sG instanceof hN) {
        let sI = sG.getCurrentFusion();
        if (sI) {
          for (let [sK, sL] of Object.entries(sI.getMultipliers())) sH.multiply(sK, sL);
        }
      }
    }
    raceModifier(sG, sH) {
      let { race: sI } = sG;
      sI && dN(sH, sI.multipliers, 1);
    }
    skillsModifier(sG, sH) {
      let sI = sG.skills.getSkillsByType("toggle");
      if (sI.length)
        for (let sK of sI) {
          let { isEnabled: sL, masteryMultiplier: sM, multipliers: sN } = sK;
          !sL || !sN || dN(sH, sN, sM);
        }
    }
    transformationModifier(sG, sH) {
      let { masteries: sI, transformations: sK } = sG,
        { currentTransformation: sL } = sK,
        { multipliers: sM } = sL,
        sN = sI.getMastery(sL.id)?.masteryMultiplier ?? 1;
      dN(sH, sM, sN);
    }
    createAndRegisterModifier(sG) {
      let sH = new dO(
        sG.id,
        (sI, sK) => {
          dN(sK, sG.multipliers, 1);
        },
        sG,
      );
      dP.registerModifier(sH);
    }
  },
  q2 = new q1();
import { challenge_quests_data as q3 } from "./data/challenge_quests_data.js";
import { main_quests_data as q4 } from "./data/main_quests_data.js";
import { side_quests_data as q5 } from "./data/side_quests_data.js";
import { system as q6 } from "@minecraft/server";
import { EntityTypes as q7 } from "@minecraft/server";
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
import { regionsData as qR } from "./data/regions_data.js";
import { system as qS, world as qT } from "@minecraft/server";
import { BlockVolume as qU, Player as qV, world as qW } from "@minecraft/server";
var qX = new Array(512),
  qY = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
    21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
    237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
    111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
    73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
    189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
    144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
    204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
    66, 215, 61, 156, 180,
  ];
for (let t9 = 0; t9 < 256; t9++) qX[256 + t9] = qX[t9] = qY[t9];
function qZ(sG) {
  return sG * sG * sG * (sG * (sG * 6 - 15) + 10);
}
function r0(sG, sH, sI) {
  return sH + sG * (sI - sH);
}
function r1(sG, sH, sI, sK) {
  let sL = sG & 15,
    sM = sL < 8 ? sH : sI,
    sN = sL < 4 ? sI : sL === 12 || sL === 14 ? sH : sK;
  return ((sL & 1) === 0 ? sM : -sM) + ((sL & 2) === 0 ? sN : -sN);
}
function r2(sG, sH, sI) {
  let sK = Math.floor(sG) & 255,
    sL = Math.floor(sH) & 255,
    sM = Math.floor(sI) & 255;
  (sG -= Math.floor(sG)), (sH -= Math.floor(sH)), (sI -= Math.floor(sI));
  let sN = qZ(sG),
    sO = qZ(sH),
    sP = qZ(sI),
    sQ = qX[sK] + sL,
    sR = qX[sQ] + sM,
    sS = qX[sQ + 1] + sM,
    sT = qX[sK + 1] + sL,
    sU = qX[sT] + sM,
    t1 = qX[sT + 1] + sM;
  return r0(
    sP,
    r0(
      sO,
      r0(sN, r1(qX[sR], sG, sH, sI), r1(qX[sU], sG - 1, sH, sI)),
      r0(sN, r1(qX[sS], sG, sH - 1, sI), r1(qX[t1], sG - 1, sH - 1, sI)),
    ),
    r0(
      sO,
      r0(sN, r1(qX[sR + 1], sG, sH, sI - 1), r1(qX[sU + 1], sG - 1, sH, sI - 1)),
      r0(sN, r1(qX[sS + 1], sG, sH - 1, sI - 1), r1(qX[t1 + 1], sG - 1, sH - 1, sI - 1)),
    ),
  );
}
function r6() {
  initializeFutureTerrain(r2);
}
r6();
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "future_trunks" &&
    sG instanceof qV &&
    (sG.removeTag("dbe_join_future_trunks"), sG.runCommand("fog @s push dbe:fog_future_trunks future_trunks"));
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "future_trunks" &&
      sG instanceof qV &&
      (sH.dimension === sG.dimension ? sH.teleportToRegion(sG) : sG.runCommand("fog @s remove future_trunks"));
  }),
  bM.on("region_load", async ({ region: sG }) => {
    if (sG.id === "future_trunks") {
      // A cidade não é mais preparada no carregamento da região (abria 210 chunks e gerava o Futuro sem ninguém lá):
      // só fica registrada como colocá-la, e a 1ª viagem ao Futuro a prepara e espera (prepareDestination).
      if (!qW.getDynamicProperty("futureTrunksCityLoaded"))
        registerFutureCityPlacement(() => qW.structureManager.placeJigsawStructure(
          "dbe:city", sG.dimension, new bP(-31, 49, -22), { ignoreStartHeight: !0 }));
      r6();
    }
  });
import { Player as r7 } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "hyperbolic_time_chamber_exit_door" &&
    sG instanceof r7 &&
    eO(b5.dimensions.overworld).getRegion("hyperbolic_time_chamber_join_door")?.teleportToRegion(sG);
});
import { Player as r8, world as r9 } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  if (sH.id === "hyperbolic_time_chamber_join_door" && sG instanceof r8) {
    let sI = r9.getDimension("dbe:hyperbolic_time_chamber");
    eO(sI).getRegion("hyperbolic_time_chamber")?.teleportToRegion(sG);
  }
});
import { world as rb } from "@minecraft/server";
import { system as rf, world as rj } from "@minecraft/server";
// Measured from the shipped NBT files; the regression check validates every size against its asset.
var rk = {
    "dbe:hyperbolic_time_chamber": { x: 57, y: 17, z: 33 },
    king_kai_planet: { x: 71, y: 52, z: 57 },
    "dbe:lookout": { x: 63, y: 101, z: 63 },
    "dbe:enma_daioh_palace_front": { x: 63, y: 22, z: 64 },
    "dbe:enma_daioh_palace_back": { x: 63, y: 22, z: 20 },
    Torneio_de_artes_marciais_mundial: { x: 64, y: 64, z: 64 },
    snake_path_end: { x: 5, y: 4, z: 7 },
    snake_path_1: { x: 25, y: 7, z: 64 },
    snake_path_2: { x: 25, y: 4, z: 64 },
    snake_path_3: { x: 25, y: 7, z: 64 },
    snake_path_4: { x: 25, y: 4, z: 64 },
    snake_path_start: { x: 25, y: 9, z: 64 },
  },
  rp = class {
    loadedStructureIds;
    placingStructureIds;
    queueSet = new Map();
    isLoading = !1;
    clearedLegacyAreas = new Set();
    retryRun;
    constructor() {
      this.ready = new Promise((resolve, reject) => rf.run(() => {
        try {
          const saved = bG(rj, "structures");
          const previousLoaded = saved.get("loaded"), previousPlacing = saved.get("placing");
          const loaded = previousLoaded === undefined ? [] : previousLoaded;
          const placing = previousPlacing === undefined ? [] : previousPlacing;
          if (![loaded, placing].every(list => Array.isArray(list) && list.every(id => typeof id === "string")))
            throw new Error("Invalid saved structure metadata; no structures will be replaced");
          this.loadedStructureIds = loaded;
          this.placingStructureIds = placing;
          resolve();
        } catch (error) { reject(error); }
      }));
      this.ready.catch(error => console.warn("[Structures] saved metadata: " + (error.stack ?? error)));
    }
    addToQueue(sG, sH) {
      this.queueSet.set(sG, sH);
      this.loadAllAsync().catch(error => console.warn("[Structures] queue: " + (error.stack ?? error)));
    }
    hasLoaded(sG) {
      return this.loadedStructureIds ? this.loadedStructureIds.includes(sG) : !1;
    }
    async loadAllAsync() {
      if (this.isLoading) return;
      this.isLoading = !0;
      let ready = false;
      try {
        await this.ready;
        ready = true;
        for (const [id, placement] of [...this.queueSet]) {
          try {
            await this.loadAsync(id, placement);
            this.queueSet.delete(id);
          } catch (error) {
            // Bedrock stacks carry only the frames, so log the message too.
            console.warn("[Structures] " + id + ": " + String(error) + (error?.stack ? "\n" + error.stack : ""));
            if (error?.stage !== "loading") this.queueSet.delete(id);
          }
        }
      } finally {
        this.isLoading = !1;
        if (ready && this.queueSet.size && this.retryRun === undefined) {
          this.retryRun = rf.runTimeout(() => {
            this.retryRun = undefined;
            this.loadAllAsync().catch(error => console.warn("[Structures] retry: " + (error.stack ?? error)));
          }, 100);
        }
      }
    }
    async loadAsync(sG, sH) {
      await this.ready;
      if (!this.clearedLegacyAreas.has(sG)) {
        // These exact names were owned by the old structure loader, never by the new shared leases.
        try { rj.tickingAreaManager.removeTickingArea(sG); } catch {}
        this.clearedLegacyAreas.add(sG);
      }
      if (this.hasLoaded(sG)) return;
      // Still marked as placing: the world closed before markLoaded. Only the Snake Way pieces are resumed (a fixed
      // .mcstructure in the Other World sky places the same blocks again); every other structure keeps its blocks.
      const resumed = this.placingStructureIds.includes(sG);
      if (resumed && !sG.startsWith("snake_path_"))
        throw new Error("Structure placement was interrupted: " + sG + "; inspect a world copy before retrying. Existing blocks were preserved");
      if (resumed) console.warn("[Structures] " + sG + ": placement was interrupted in a previous session; placing it again");
      const { dimension, location, structureId } = sH, size = rk[structureId];
      if (!size || ![location.x, location.y, location.z].every(Number.isInteger))
        throw new Error("Unknown structure bounds or invalid origin: " + structureId);
      const end = { x: location.x + size.x - 1, y: location.y + size.y - 1, z: location.z + size.z - 1 };
      const area = await duAcquireLoadedArea(dimension, location, end, "structure " + sG);
      try {
        if (!resumed) {
          const placing = [...this.placingStructureIds, sG];
          bG(rj, "structures").set("placing", placing);
          this.placingStructureIds = placing;
        }
        try {
          if (structureId === "dbe:lookout" && !rj.getDynamicProperty("lookoutLoaded")) {
            dimension.fillBlocks(new ry(
              { x: rx.lookoutLocation.x, y: -64, z: rx.lookoutLocation.z },
              { x: rx.lookoutLocation.x, y: 218, z: rx.lookoutLocation.z }), "minecraft:smooth_quartz");
            rj.setDynamicProperty("lookoutLoaded", !0);
          }
          rj.structureManager.place(structureId, dimension, location);
        } catch (error) {
          // An exception ends the attempt: leave placing so the next region load can try again.
          this.clearPlacing(sG);
          throw error;
        }
        await rf.waitTicks(20);
        this.markLoaded(sG);
      } finally {
        duReleaseLoadedArea(area);
      }
    }
    markLoaded(sG) {
      const saved = bG(rj, "structures"), loaded = [...this.loadedStructureIds, sG];
      saved.set("loaded", loaded);
      this.loadedStructureIds = loaded;
      this.clearPlacing(sG);
    }
    clearPlacing(sG) {
      const placing = this.placingStructureIds.filter(id => id !== sG);
      bG(rj, "structures").set("placing", placing);
      this.placingStructureIds = placing;
    }
  },
  rq = new rp();
function rv() {
  let sG = rb.getDimension("dbe:hyperbolic_time_chamber");
  pJ.register(sG).onLoad(function* (sH) {
    let { chunkOrigin: sI, dimension: sK } = sH,
      sL = -64;
    try {
      for (let sM = 0; sM < 16; sM++)
        for (let sN = 0; sN < 16; sN++)
          sK.setBlockType({ x: sI.x + sM, y: sL, z: sI.z + sN }, "minecraft:bedrock"),
            sK.setBlockType({ x: sI.x + sM, y: sL + 1, z: sI.z + sN }, "dbe:white_tile"),
            yield;
      pJ.markChunkAsGenerated(sH.id);
    } catch {
      return;
    }
  });
}
bM.on("region_load", async ({ region: sG }) => {
  sG.id === "hyperbolic_time_chamber" &&
    (rq.addToQueue("hyperbolic_time_chamber", {
      dimension: sG.dimension,
      location: new bP(-28, -62, -12),
      structureId: "dbe:hyperbolic_time_chamber",
    }),
    rv());
}),
  rb.afterEvents.playerDimensionChange.subscribe(({ fromDimension: sG, player: sH, toDimension: sI }) => {
    sG.id === "dbe:hyperbolic_time_chamber" &&
      (sH.runCommand("fog @s remove hyperbolic_time_chamber"), sH.playMusic("", { fade: 1 })),
      sI.id === "dbe:hyperbolic_time_chamber" &&
        (sH.runCommand("fog @s push dbe:fog_hyperbolic_time_chamber hyperbolic_time_chamber"),
        sH.playMusic("music.game.hyperbolic_time_chamber_theme", { fade: 2, loop: !0 }));
  });
import { Player as rw } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "king_kai_planet" &&
    sG instanceof rw &&
    sG.playMusic("music.game.king_kai_planet_theme", { fade: 2, loop: !0 });
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "king_kai_planet" && sG instanceof rw && sG.playMusic("", { fade: 1 });
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "king_kai_planet" &&
      rq.addToQueue("king_kai_planet", {
        dimension: sG.dimension,
        location: new bP(-28, 96, -1020),
        structureId: "king_kai_planet",
      });
  });
import { variables as rx } from "./data/variables.js";
import { BlockVolume as ry, Player as rz, world as rA } from "@minecraft/server";
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "lookout" && sG instanceof rz && sG.playMusic("music.game.lookout_theme", { fade: 2, loop: !0 });
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "lookout" && sG instanceof rz && sG.playMusic("", { fade: 1 });
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "lookout" &&
      rq.addToQueue("lookout", {
        dimension: sG.dimension,
        location: new bP(rx.lookoutLocation.x - 31, 219, rx.lookoutLocation.z - 31),
        structureId: "dbe:lookout",
      });
  });
import { Player as rB, world as rC } from "@minecraft/server";
import { world as rD } from "@minecraft/server";
async function rE() {
  let sG = rD.getDimension("dbe:other_world");
  [
    { structureId: "snake_path_end", location: new bP(8, 65, -945) },
    { structureId: "snake_path_1", location: new bP(8, 65, -938) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -874) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -810) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -746) },
    { structureId: "snake_path_1", location: new bP(8, 65, -682) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -618) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -554) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -490) },
    { structureId: "snake_path_1", location: new bP(8, 65, -426) },
    { structureId: "snake_path_4", location: new bP(-12, 65, -362) },
    { structureId: "snake_path_3", location: new bP(-32, 65, -298) },
    { structureId: "snake_path_2", location: new bP(-12, 65, -234) },
    { structureId: "snake_path_1", location: new bP(8, 65, -170) },
    { structureId: "snake_path_start", location: new bP(-12, 64, -106) },
  ].forEach((sH, sI) => {
    rq.addToQueue(sH.structureId + "_" + sI, { dimension: sG, location: sH.location, structureId: sH.structureId });
  });
}
function rF() {
  let sG = rC.getDimension("dbe:other_world");
  pJ.register(sG).onLoad(function* (sH) {
    let sI = [];
    for (let sK = 0; sK < 16; sK++)
      for (let sL = 0; sL < 16; sL++) {
        let sM = sH.chunkOrigin.x + sK,
          sN = sH.chunkOrigin.z + sL,
          sO = r2(sM / 90, 0, sN / 90),
          sP = Math.floor(sO * 18) + 50;
        sI.push(new bP(sM, sP + 2, sN)), sI.push(new bP(sM, sP + 1, sN)), sI.push(new bP(sM, sP, sN)), yield;
      }
    yield;
    for (let sQ of sI)
      try {
        let sR = sH.dimension.getBlock(sQ);
        yield, sR?.typeId === "minecraft:air" && (sR.setType("dbe:yellow_cloud_block"), yield);
      } catch {
        return;
      }
    pJ.markChunkAsGenerated(sH.id);
  });
}
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "other_world" &&
    sG instanceof rB &&
    (sG.removeTag("dbe:join_other_world"),
    sG.runCommand("fog @s push dbe:fog_other_world other_world"),
    sG.playMusic("music.game.other_world_theme", { fade: 2 }));
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "other_world" &&
      sG instanceof rB &&
      (sH.dimension === sG.dimension
        ? sH.teleportToRegion(sG)
        : (sG.runCommand("fog @s remove other_world"), sG.playMusic("", { fade: 1 })));
  }),
  bM.on("region_load", async ({ region: sG }) => {
    sG.id === "other_world" &&
      (rq.addToQueue("enma_daioh_palace_front", {
        dimension: sG.dimension,
        location: new bP(-31, 64, -22),
        structureId: "dbe:enma_daioh_palace_front",
      }),
      rq.addToQueue("enma_daioh_palace_back", {
        dimension: sG.dimension,
        location: new bP(-31, 64, -42),
        structureId: "dbe:enma_daioh_palace_back",
      }),
      rE(),
      rF());
  }),
  bM.on("region_load", async ({ region: sG }) => {
    if (sG.id !== "world_martial_arts_tournament" || sG.dimension.id !== "dbe:world_martial_arts_tournament") return;
    try {
      // Worlds that already have the old build keep it; the others get the new tournament from world_landmarks.js.
      // Still in placing counts as old too: the world closed after place wrote the blocks, before markLoaded.
      await rq.ready;
      const oldBuild = rq.hasLoaded("world_martial_arts_tournament") || rq.placingStructureIds.includes("world_martial_arts_tournament");
      if (resolveMartialArtsMode(oldBuild) === "legacy")
        rq.addToQueue("world_martial_arts_tournament", {
          dimension: sG.dimension,
          location: new bP(-28, -64, -12),
          structureId: "Torneio_de_artes_marciais_mundial",
        });
    } catch (error) {
      console.warn("[Structures] tournament mode: " + String(error));
    }
  });
import { resolveMartialArtsMode, onMartialArtsSite } from "./world_landmarks.js";
// A failure here must not stop the landmark scan that starts right after this call in world_landmarks.js.
onMartialArtsSite((regions) => {
  for (const region of regions) {
    try {
      eO(rj.getDimension(region.dimensionId)).setRegionAsync(region)
        .catch((error) => console.warn("[Structures] tournament region " + region.id + ": " + String(error)));
    } catch (error) {
      console.warn("[Structures] tournament region " + region.id + ": " + String(error));
    }
  }
});
function rG() {
  for (let sG of qR) {
    let sH = qT.getDimension(sG.dimensionId);
    eO(sH).setRegionAsync(sG);
  }
}
qS.run(() => rG());
import { EntityTypes as rH } from "@minecraft/server";
dC.register({
  type: "completed_quest",
  test: (sG, sH) => {
    if (sG instanceof hN) {
      let sI = sG.quests.getCompletedQuestIds().includes(sH.value);
      return dC.compare(sI, !0, sH.operator);
    }
    return !1;
  },
  localizationKey: (sG) => [
    {
      translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
      with: { rawtext: [{ translate: "quest." + sG.value + ".title" }] },
    },
  ],
}),
  dC.register({
    type: "has_master",
    test: (sG, sH) => {
      if (sG instanceof hN) {
        let sI = sG.masterManager.getMaster(sH.value);
        return sI && sH.level !== void 0
          ? dC.compare(sI.getFriendshipLevel(), sH.level, sH.operator)
          : dC.compare(!!sI, !0, sH.operator);
      }
      return !1;
    },
    localizationKey: (sG) => {
      let sH = rH.get(sG.value)?.localizationKey;
      return sG.level
        ? [
            {
              translate: "requirement.has_master.with_level",
              with: {
                rawtext: [
                  { translate: "" + sH },
                  { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
                  { text: "" + sG.level },
                ],
              },
            },
          ]
        : [
            {
              translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
              with: { rawtext: [{ translate: "" + sH }] },
            },
          ];
    },
  }),
  dC.register({
    type: "has_mastery",
    test: (sG, sH) => {
      let { masteries: sI } = sG,
        sK = sI.getMastery(sH.value);
      return sK ? dC.compare(sK.masteryMultiplier, sH.multiplier, sH.operator) : !1;
    },
    localizationKey: (sG) => [
      {
        translate: "requirement.has_mastery",
        with: {
          rawtext: [
            { translate: dp.getLocalizationKey(sG.value) },
            { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
            { text: "" + sG.multiplier },
          ],
        },
      },
    ],
  }),
  dC.register({
    type: "has_modifier",
    test: (sG, sH) => {
      let { modifiers: sI } = sG.attributes,
        sK = sI.hasModifier(sH.value);
      return dC.compare(sK, !0, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "modifier." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "has_quest",
    test: (sG, sH) => {
      if (sG instanceof hN) {
        let sI = sG.quests.hasQuest(sH.value);
        return dC.compare(sI, !0, sH.operator);
      }
      return !1;
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "quest." + sG.value + ".title" }] },
      },
    ],
  }),
  dC.register({
    type: "has_skill",
    test: (sG, sH) => {
      if (sH.exceptRaceIds?.includes(sG.race?.id)) return !0;
      let sI = sG.skills.getSkill(sH.value);
      return sI && sH.level !== void 0
        ? dC.compare(sI.level, sH.level, sH.operator)
        : dC.compare(!!sI, !0, sH.operator);
    },
    localizationKey: (sG) =>
      sG.level !== void 0
        ? [
            {
              translate: "requirement.has_skill.with_level",
              with: {
                rawtext: [
                  { translate: "skill." + sG.value },
                  { translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") },
                  { text: "" + (sG.level ?? 1) },
                ],
              },
            },
          ]
        : [
            {
              translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
              with: { rawtext: [{ translate: "skill." + sG.value }] },
            },
          ],
  }),
  dC.register({
    type: "has_level",
    test: (sG, sH) => (sG instanceof hN ? dC.compare(sG.level.currentLevel, sH.value, sH.operator) : !1),
    localizationKey: (sG) => [
      {
        translate: "requirement.has_level",
        with: {
          rawtext: [{ translate: dC.getOperatorLocalizationKey(sG.operator ?? "==") }, { text: "" + (sG.value ?? 1) }],
        },
      },
    ],
  }),
  dC.register({
    type: "in_biome",
    test: (sG, sH) => {
      let { dimension: sI, location: sK } = sG.entity;
      return dC.compare(sI.getBiome(sK).id, duPhysicalDestinationId(sH.value), sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "biome." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_alignment",
    test: (sG, sH) => {
      let { alignment: sI } = sG,
        sK = sI.getAlignment();
      return dC.compare(sK, sH.value, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "alignment." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_race",
    test: (sG, sH) => {
      let { race: sI } = sG;
      return sI ? dC.compare(sI.id, sH.value, sH.operator) : !1;
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "" + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_skill_enabled",
    test: (sG, sH) => {
      let { skills: sI } = sG,
        sK = sI.isSkillActive(sH.value);
      return dC.compare(sK, !0, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "skill." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "is_transformation",
    test: (sG, sH) => {
      let { race: sI, transformations: sK } = sG,
        sL = sI?.id + ":" + sK.currentTransformation.id,
        sM = sH.raceId + ":" + sH.value;
      return dC.compare(sL, sM, sH.operator);
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: sG.raceId + ".transformation." + sG.value }] },
      },
    ],
  }),
  dC.register({
    type: "time_of_day",
    test: (sG, sH) => {
      let sI = b5.getTimeOfDay(),
        sK = sI === "Night" || sI === "Midnight",
        sL = sI === "Day" || sI === "Morning";
      return !(
        !(sG.entity.dimension.id === "minecraft:overworld") ||
        (sH.value === "night" && !sK) ||
        (sH.value === "day" && !sL)
      );
    },
    localizationKey: (sG) => [
      {
        translate: dC.buildRequirementLocalizationKey(sG.test, sG.operator),
        with: { rawtext: [{ translate: "hostOption.time." + sG.value }] },
      },
    ],
  }),
  fG.registerRoles([
    { id: "member", priority: 0, displayTag: { colorPrefix: "§7", name: "Membro" } },
    { id: "patreon", priority: 10, displayTag: { colorPrefix: "§q", name: "Patreon" }, permissions: ["race.glind"] },
    { id: "early", priority: 20, displayTag: { colorPrefix: "§w", name: "Early" } },
    { id: "creator", priority: 100, displayTag: { colorPrefix: "§u", name: "Equipe Dragon Universe" } },
  ]);
import { shop_data as rI } from "./data/shop_data.js";
import { system as rJ } from "@minecraft/server";
function rK() {
  for (let sG of rI) jU.register(sG);
  rJ.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:shop_registry") {
      for (let sK of JSON.parse(sI)) jU.register(sK);
    }
  });
}
rK();
import { skills_data as rL } from "./data/skills_data.js";
import { EntityComponentTypes as rM, GameMode as rN, system as rO } from "@minecraft/server";
var rP = class extends cH {
  flyEntity;
  isLoaded = !1;
  jumpState = { lastJump: !1, jumpCount: 0 };
  // O2a: o voo deixava de reenviar dbe:fly_mode e de reescrever a velocidade da montaria a cada tick. Só escreve
  // quando o valor muda (ou a montaria é outra); a cada FLY_REFRESH_TICKS ticks os caches são esquecidos e tudo é
  // reaplicado, para o caso de outro caminho mudar a propriedade (ex.: fusão) ou o jogo reverter a velocidade.
  lastFlyMode;
  lastFlySpeed;
  lastFlySpeedEntityId;
  flyRefreshTicks = 0;
  static FLY_REFRESH_TICKS = 20;
  constructor(sG, sH) {
    super(sG, sH);
    let { dimension: sI, location: sK } = sG.entity;
    aH.waitForChunkLoad(sI, sK).then(() => {
      if (!sG.entity.isValid) return;
      if (this.isEnabled && !this.startRiding()) this.disable();
      this.isLoaded = !0;
    }).catch((error) => {
      console.warn("[Flight] initialization failed; flight can be retried: " + error);
      if (sG.entity.isValid) {
        this.disable();
        this.isLoaded = !0;
      }
    });
  }
  get flyMode() {
    return this.isHover ? "fast" : "normal";
  }
  get flySpeed() {
    return this.dbeEntity.attributes.stats.getStat("flying_speed")?.value ?? 0;
  }
  get isHover() {
    return this.dbeEntity instanceof hN ? this.dbeEntity.player.isJumping : !1;
  }
  disable() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_end", sH),
      (this.entitySkillData.state.enabled = !1),
      this.saveState(),
      this.stopRiding(),
      this.forgetFlyCache(),
      this.setFlyModeProperty("none");
  }
  async enable() {
    if (!this.startRiding()) return;
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_up", sH),
      (this.entitySkillData.state.enabled = !0),
      this.saveState(),
      this.setFlyModeProperty("normal");
  }
  onTick() {
    if (this.isLoaded && this.dbeEntity instanceof hN) {
      if (this.flyEntity && !this.flyEntity.isValid) {
        this.disable();
        return;
      }
      let { ki: sG, player: sH, transformations: sI } = this.dbeEntity,
        { currentTransformation: sK } = sI,
        sL = sH.getGameMode() === rN.Creative;
      if (this.isEnabled) {
        let riding = sH.getComponent("minecraft:riding")?.entityRidingOn;
        let sM = this.flyEntity?.isValid && riding?.id === this.flyEntity.id &&
          this.flyEntity.dimension.id === sH.dimension.id;
        ++this.flyRefreshTicks >= rP.FLY_REFRESH_TICKS && this.forgetFlyCache();
        this.setFlyModeProperty(this.flyMode), (sL || sG.currentValue <= 0 || sK.isOozaru || !sM) && this.disable();
      } else !sL && sG.currentValue > 0 && !sK.isOozaru && this.isDoubleJump && this.enable();
    }
  }
  get isDoubleJump() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let { isJumping: sG, isOnGround: sH } = this.dbeEntity.entity;
    return (
      sH && (this.jumpState.jumpCount = 0),
      sG && !this.jumpState.lastJump && (this.jumpState.jumpCount++, this.jumpState.jumpCount === 2)
        ? ((this.jumpState.jumpCount = 0), !0)
        : ((this.jumpState.lastJump = sG), !1)
    );
  }
  async setFlyModeProperty(sG) {
    if (sG === "none") {
      await rO.waitTicks(1);
      if (this.isEnabled) return;
    }
    if (sG !== this.lastFlyMode) {
      this.lastFlyMode = sG;
      this.dbeEntity.trySetProperty("dbe:fly_mode", sG);
    }
    this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
  }
  setFlySpeed(sG) {
    let sH = this.flySpeed * sG,
      fly = this.flyEntity;
    if (!fly || (sH === this.lastFlySpeed && fly.id === this.lastFlySpeedEntityId)) return;
    let sI = fly.getComponent(rM.FlyingSpeed),
      sK = fly.getComponent(rM.UnderwaterMovement);
    sI && (sI.value = sH), sK && sK.setCurrentValue(sH);
    this.lastFlySpeed = sH;
    this.lastFlySpeedEntityId = fly.id;
  }
  forgetFlyCache() {
    this.lastFlyMode = void 0;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    this.flyRefreshTicks = 0;
  }
  startRiding() {
    if (this.flyEntity?.isValid) this.stopRiding();
    this.forgetFlyCache();
    let { entity: sG } = this.dbeEntity,
      { dimension: sH, location: sI } = sG,
      sK = sG.getRotation();
    try {
      if (((this.flyEntity = d4("dbe:player_fly", sH, sI, { initialRotation: sK.y })), this.flyEntity)) {
        let sL = this.flyEntity.getComponent("minecraft:rideable");
        if (sL?.addRider(sG)) {
          this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
          return !0;
        }
      }
    } catch (error) {
      console.warn("[Flight] rider attachment failed: " + error);
    }
    if (this.flyEntity?.isValid) this.flyEntity.remove();
    this.flyEntity = void 0;
    return !1;
  }
  stopRiding() {
    let sG = this.flyEntity;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    if (((this.flyEntity = void 0), sG?.isValid)) {
      let sH = sG.getVelocity();
      let player = this.dbeEntity.entity;
      if (player.isValid && player.dimension.id === sG.dimension.id &&
          bO.distance(player.location, sG.location) < 4)
        player.applyImpulse({ x: sH.x, y: sH.y, z: sH.z });
      sG.remove();
    }
  }
};
import { ButtonState as rQ, EntityDamageCause as rR, InputButton as rS } from "@minecraft/server";
var rT = 2,
  rU = 1.25,
  rV = class extends cH {
    isMidAir = !1;
    ticks = 0;
    constructor(sG, sH) {
      super(sG, sH);
    }
    onTick() {
      if (this.dbeEntity instanceof hN) {
        if (this.dbeEntity.skills.isSkillActive("fly")) {
          this.isMidAir = !1;
          this.ticks = 0;
          return;
        }
        let { attributes: sG, player: sH, stamina: sI, transformations: sK } = this.dbeEntity;
        if ((sH.isJumping && !this.isMidAir && (this.isMidAir = !0), this.isMidAir)) {
          let sL = sG.stats.getStat("jump")?.value ?? 0,
            { inputInfo: sM } = sH,
            sN = sH.getVelocity(),
            sO = sM.getButtonState(rS.Jump) === rQ.Pressed,
            sP = sN.y >= 0 && this.ticks <= sL,
            sQ = sI.currentValue >= rT;
          sO &&
            sP &&
            sQ &&
            (sI.removeCurrent(rT), sH.applyKnockback({ x: sN.x * rU, z: sN.z * rU }, 0.5), this.ticks++),
            sH.isOnGround &&
              ((this.isMidAir = !1), (this.ticks = 0), sK.currentTransformation.isOozaru && this.triggerOozaruStomp());
        }
      }
    }
    triggerOozaruStomp() {
      let { entity: sG } = this.dbeEntity,
        sH = sG.dimension.getEntities({ location: sG.location, maxDistance: 4 });
      for (let sI of sH) {
        if (sI === sG) continue;
        let sK = bO.normalize(bO.subtract(sI.location, sG.location));
        try {
          sI.applyDamage(1, { damagingEntity: sG, cause: rR.none }) &&
            sI.applyKnockback({ x: sK.x * 5, z: sK.z * 5 }, 0);
        } catch {}
      }
    }
  };
import { InputPermissionCategory as rW, system as rX } from "@minecraft/server";
var rY = class tb extends cH {
  _startingFusion = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get startingFusion() {
    return this._startingFusion;
  }
  onTick() {
    if (this.isEnabled && !this._startingFusion && this.dbeEntity instanceof hN) {
      let sG = this.findNearbyPlayer();
      if (sG) {
        let sH = hO(sG);
        sG && this.checkMetamoranConditions(sH) && this.startFusionScene(sG);
      }
    }
  }
  checkMetamoranConditions(sG) {
    let sH = sG.skills.getSkill("metamoran_dance");
    return sH instanceof tb ? sH.isEnabled && !sH.startingFusion && !sG.isFused : !1;
  }
  checkCompatibility(sG) {
    let sH = this.dbeEntity.attributes.stats.getStat("size")?.value ?? 0,
      sI = sG.attributes.stats.getStat("size")?.value ?? 0,
      sK = Math.abs(sH - sI),
      sL = Math.abs(this.dbeEntity.entity.location.y - sG.player.location.y),
      sM = 0.2,
      sN = 0.0625,
      sO = 1 - Math.min(sK / sM, 1),
      sP = 1 - Math.min(sL / sN, 1);
    return (sO + sP) / 2;
  }
  findNearbyPlayer() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    return sG.getPlayers({ location: sH, maxDistance: 5 }).find((sI) => sI !== this.dbeEntity.entity);
  }
  async startFusionScene(sG) {
    let sH = this.dbeEntity;
    if (!this._startingFusion && sH instanceof hN) {
      let { entity: sI } = sH,
        sK = hO(sG);
      this._startingFusion = !0;
      let sL = sI.location,
        sM = bO.normalize(sI.getViewDirection()),
        sN = { x: 0, y: 1, z: 0 },
        sO = bO.normalize(bO.cross(sM, sN)),
        sP = 1.55,
        sQ = -5,
        sR = 1,
        sS = { x: sL.x - sO.x * sP, y: sL.y, z: sL.z - sO.z * sP },
        sT = { x: sL.x + sO.x * sP, y: sL.y, z: sL.z + sO.z * sP },
        sU = { x: (sS.x + sT.x) / 2, y: sL.y, z: (sS.z + sT.z) / 2 },
        t1 = { x: sU.x - sM.x * sQ, y: sU.y + sR, z: sU.z - sM.z * sQ },
        t2 = { x: sS.x + sM.x, y: sS.y + sM.y, z: sS.z + sM.z },
        t3 = { x: sT.x + sM.x, y: sT.y + sM.y, z: sT.z + sM.z };
      sI.teleport(sS, { facingLocation: t2 }),
        sG.teleport(sT, { facingLocation: t3 }),
        sI.playAnimation("animation.player.metamoran_dance_right"),
        sG.playAnimation("animation.player.metamoran_dance_left"),
        sI.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        sG.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        this.setInputLock(sH, !0),
        this.setInputLock(sK, !0),
        rX.runTimeout(() => {
          sI.camera.clear(), sG.camera.clear(), this.setInputLock(sH, !1), this.setInputLock(sK, !1);
          let t6 = this.checkCompatibility(sK);
          if (((this._startingFusion = !1), t6 < 0.8)) {
            this.dbeEntity.skills.getToggleSkill("metamoran_dance")?.disable(),
              sK.skills.getToggleSkill("metamoran_dance")?.disable();
            return;
          }
          sI.teleport(sU), sG.teleport(sU), ex.startFusion("metamoran", sI, sG, t6);
        }, 100);
    }
  }
  setInputLock(sG, sH) {
    sH
      ? sG.inputPermissionManager.blockInputPermission("fusion_scene", [rW.Camera, rW.Movement])
      : sG.inputPermissionManager.unblockInputPermission("fusion_scene");
  }
};
function rZ(sG, sH) {
  let sI = { x: sH.x, y: 0, z: sH.z },
    sK = Math.sqrt(sI.x ** 2 + sI.z ** 2);
  sK > 0 && ((sI.x /= sK), (sI.z /= sK));
  let sL = { x: sI.z, y: 0, z: -sI.x };
  return { x: sI.x * sG.y + sL.x * sG.x, y: 0, z: sI.z * sG.y + sL.z * sG.x };
}
var s0 = class extends cH {
  lastStrafeDirection = 0;
  lastStrafeTime = 0;
  strafeCooldown = 300;
  strafePressed = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get isDoubleStrafe() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let sG = this.dbeEntity.player.inputInfo.getMovementVector(),
      sH = Date.now(),
      sI = sG.x;
    if (sI !== 0 && !this.strafePressed) {
      this.strafePressed = !0;
      let sK = Math.sign(sI);
      if (this.lastStrafeDirection === sK && sH - this.lastStrafeTime <= this.strafeCooldown)
        return (this.lastStrafeDirection = 0), (this.lastStrafeTime = 0), !0;
      (this.lastStrafeDirection = sK), (this.lastStrafeTime = sH);
    }
    return sI === 0 && (this.strafePressed = !1), !1;
  }
  onTick() {
    if (this.isDoubleStrafe && this.dbeEntity instanceof hN) {
      let { player: sG } = this.dbeEntity,
        sH = sG.inputInfo.getMovementVector(),
        sI = sG.getViewDirection(),
        { x: sK, z: sL } = rZ(sH, sI);
      sG.applyImpulse({ x: sK * 4, y: 0, z: sL * 4 }),
        sG.dimension.spawnParticle("dbe:teleport", sG.location),
        sG.dimension.playSound("common.teleport2", sG.location);
    }
  }
};
function s1() {
  cG.register("absorption", iV),
    cG.register("burst_move", s0),
    cG.register("fly", rP),
    cG.register("jump", rV),
    cG.register("metamoran_dance", rY),
    cG.register("rapid_movement", cI);
  for (let sG of rL)
    if (!cG.has(sG.id))
      switch (sG.type) {
        case "ki_attack":
          cG.register(sG.id, hj);
          break;
        case "toggle":
          cG.register(sG.id, cH);
          break;
      }
}
s1();
import { tournaments_data as s2 } from "./data/tournaments_data.js";
function s3() {
  for (let sG of s2) cT.registerTournament(sG);
}
s3();
import { CONFIG as s4 } from "./config/config.js";
import { system as s5, world as s6 } from "@minecraft/server";
var s7 = class {
    initialized = !1;
    init() {
      this.initialized || ((this.initialized = !0), s6.beforeEvents.chatSend.subscribe(this.beforeChatSend.bind(this)));
    }
    beforeChatSend(sG) {
      let { message: sH, sender: sI, targets: sK } = sG;
      if (((sG.cancel = !0), !gI.isBanned(sI.name))) {
        let sL = hO(sI),
          sM = fG.getHighestPlayerDisplayTag(sL),
          sN = eJ.getPlayerGroup(sI.id),
          sO = sM ? sM.colorPrefix + "[" + sM.name + "] " : "",
          sP = sN ? "§u[" + (sN.isOwner(sI.id) ? "**" : "") + sN.name + "] " : "",
          sQ = "" + sO + sP + "§r" + sI.name + " §8>> §7" + sH.replace("\u00a7", "");
        s5.run(() => {
          if (sK) {
            for (let sR of sK) sR.sendMessage(sQ);
          } else s6.sendMessage(sQ);
        });
      }
    }
  },
  s8 = new s7();
import { system as s9, world as sb } from "@minecraft/server";
var sf = 18000,
  sj = [12000, 6000, 1200, 100, 80, 60, 40, 20],
  sk = ["minecraft:item"],
  sp = class {
    initialized = !1;
    clearEntities() {
      let sG = cY.getAll(),
        sH = 0;
      for (let sI of sG) for (let sK of sI.getEntities()) sk.includes(sK.typeId) && (sK.remove(), sH++);
      sb.sendMessage({ translate: "server.clear_lag.finish", with: ["" + sH] });
    }
    init() {
      if (!this.initialized) {
        this.initialized = !0;
        let sG = sf;
        // G5: período ausente = 1 tick (o every repassa sem período na prova, como antes)
        every(undefined, "core.clear_lag", () => {
          if ((sj.includes(sG) && this.sendWarn(sG), sG <= 0)) {
            this.clearEntities(), (sG = sf);
            return;
          }
          sG--;
        }, { phase: 0 });
      }
    }
    sendWarn(sG) {
      sb.sendMessage({ translate: "server.clear_lag.warn", with: aM.convertTimeToRawText(sG * 50) });
    }
  },
  sq = new sp();
import { system as sv, world as sw } from "@minecraft/server";
var sx = class {
    currentIndex = 0;
    init() {
      every(3600, "core.server_messages", () => { // G6
        let sG = this.getNextMessageLocalizationKey();
        sw.sendMessage({ translate: sG }), (this.currentIndex = ++this.currentIndex % 10);
      }, { phase: 1801 });
    }
    getNextMessageLocalizationKey() {
      return "server.message." + (this.currentIndex + 1);
    }
  },
  sy = new sx();
function sz() {
  s4.SERVER_MODE.BATTLE_POWER_RANKING && eF.init(),
    s4.SERVER_MODE.CLEAR_LAG && sq.init(),
    s4.SERVER_MODE.CUSTOM_CHAT && (s8.init(), sy.init());
}
sz();
import { system as sA } from "@minecraft/server";
var sB = [],
  sC = [],
  sD = [],
  sE = [],
  sF = [];
sA.run(() => {
  sA.sendScriptEvent("dbe:dialogue_registry", JSON.stringify(sB)),
    sA.sendScriptEvent("dbe:entity_registry", JSON.stringify(sC)),
    sA.sendScriptEvent("dbe:modifier_registry", JSON.stringify(sD)),
    sA.sendScriptEvent("dbe:quest_registry", JSON.stringify(sE)),
    sA.sendScriptEvent("dbe:shop_registry", JSON.stringify(sF));
});

/* ---- True Oni Rage: eating the Demonic Apple grants the oni_blessing modifier ---- */
import { world as __oniWorld } from "@minecraft/server";
__oniWorld.afterEvents.itemCompleteUse.subscribe((__oniEv) => {
  try {
    if (!__oniEv.itemStack || __oniEv.itemStack.typeId !== "dbe:demonic_apple") return;
    const __oniPlayer = __oniEv.source;
    const __oniEnt = i3.getDBEEntity(__oniPlayer);
    if (!__oniEnt || !__oniEnt.attributes || !__oniEnt.attributes.modifiers) return;
    const __oniMods = __oniEnt.attributes.modifiers;
    if (__oniMods.hasModifier("oni_blessing")) return;
    __oniMods.setModifier("oni_blessing");
    __oniPlayer.sendMessage(
      "\u00a74\u00a7lThe Demonic Apple's cursed power sinks into your blood... \u00a7r\u00a7cReach level 100 as a Demon to unleash True Oni Rage.",
    );
  } catch (__oniErr) {}
});
