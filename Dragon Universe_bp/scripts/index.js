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
import { Player as cJ, system as cK, world as cL } from "@minecraft/server";
import { system as cM } from "@minecraft/server";
import { cT, cY } from "./core/04_tournament_dims.js"; // O4: movido do index.js
import { EntityComponentTypes as cZ, Player as d0 } from "@minecraft/server";
import { d2, d3, d4, d5, d6, dj, dp } from "./core/05_db_cooldowns.js"; // O4: movido do index.js
import { system as dq } from "@minecraft/server";
import { GameMode as dw, Player as dx, PlayerPermissionLevel as dy, system as dz, world as dA } from "@minecraft/server"; // O4: import que ficou no index.js (estava no trecho movido)
import { dv, dC } from "./core/06_requirements.js"; // O4: movido do index.js
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
import "./core/32_flight_skills.js"; // O4: movido do index.js
import { CONFIG as s4 } from "./config/config.js";
import { system as s5, world as s6 } from "@minecraft/server";
import "./core/33_server_modes.js"; // O4: movido do index.js
import { system as sA } from "@minecraft/server";
import "./core/34_registries.js"; // O4: movido do index.js
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
