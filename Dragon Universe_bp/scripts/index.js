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
import { pJ, pN, pO, pP, pQ, pR } from "./core/25_terrain_generator.js"; // O4: movido do index.js
import { Player as pS } from "@minecraft/server";
import "./core/26_item_use.js"; // O4: movido do index.js
import { modifiers_data as pZ } from "./data/modifiers_data.js";
import { system as q0 } from "@minecraft/server";
import "./core/27_modifiers.js"; // O4: movido do index.js
import { challenge_quests_data as q3 } from "./data/challenge_quests_data.js";
import { main_quests_data as q4 } from "./data/main_quests_data.js";
import { side_quests_data as q5 } from "./data/side_quests_data.js";
import { system as q6 } from "@minecraft/server";
import { EntityTypes as q7 } from "@minecraft/server";
import "./core/28_tasks_rewards.js"; // O4: movido do index.js
import { regionsData as qR } from "./data/regions_data.js";
import { system as qS, world as qT } from "@minecraft/server";
import { BlockVolume as qU, Player as qV, world as qW } from "@minecraft/server";
import { r2 } from "./core/29_future_city.js"; // O4: movido do index.js
import { Player as r7 } from "@minecraft/server";
import "./core/30_structures_regions.js"; // O4: movido do index.js
import { shop_data as rI } from "./data/shop_data.js";
import { system as rJ } from "@minecraft/server";
import "./core/31_shop_registry.js"; // O4: movido do index.js
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
