// Núcleo do Dragon Universe.
// Gerado por tools/deobfuscate-core.mjs a partir da versão ofuscada (commit 2d4f628): textos decodificados e
// código formatado, sem mudança de lógica. Os nomes curtos de variáveis vêm do ofuscador e não puderam ser recuperados.
import "./core/perf.js"; // primeiro import: a sonda (CONFIG.DEBUG_PERF) envolve os agendadores antes dos módulos
import { every } from "./core/scheduler.js"; // relógio único das tarefas gerais (O3-12: G1-G6)
import { late, bindLate } from "./core/late.js"; // ligação tardia (O4.0)
import "./kaioshin_dimension.js";
import "./core/perf_terrain.js"; // sonda: gancho dos jobs de terreno (depois do terrain_repair, via kaioshin)
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
import { ib } from "./core/16_damage.js"; // O4: movido do index.js
import { CONFIG as ij } from "./config/config.js";
import {
  Block as ik,
  EntityComponentTypes as ip,
  EquipmentSlot as iq,
  Player as iv,
  StructureSaveMode as iw,
  world as ix,
} from "@minecraft/server";
import { iy, iz, iB, iH, iK, iR, iV, j4 } from "./core/17_items_balls_fusion.js"; // O4: movido do index.js
import { wish_data as j6 } from "./data/wish_data.js";
import { EasingType as j7, system as j8, TimeOfDay as j9, world as jb } from "@minecraft/server";
import { ActionFormData as jf } from "@minecraft/server-ui";
import { jC, jE, jG } from "./core/18_wishes.js"; // O4: movido do index.js
import { EntityDamageCause as jH, system as jI } from "@minecraft/server";
import { jK } from "./core/19_ki_explosion.js"; // O4: movido do index.js
import { skills_data as jL } from "./data/skills_data.js";
import { ItemTypes as jM, system as jN } from "@minecraft/server";
import { ActionFormData as jO } from "@minecraft/server-ui";
import { ItemStack as jP } from "@minecraft/server";
import { jU, jW } from "./core/20_shop_dialogues.js"; // O4: movido do index.js
import { ActionFormData as jX } from "@minecraft/server-ui";
import "./core/21_menus.js"; // O4: movido do index.js
import { CONFIG as kK } from "./config/config.js";
import "./core/22_blocks.js"; // O4: movido do index.js
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
import "./core/23_commands.js"; // O4: movido do index.js
import { dialogues_data as pk } from "./data/dialogues_data.js";
import { system as pp } from "@minecraft/server";
import "./core/24_npc_registries.js"; // O4: movido do index.js
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
