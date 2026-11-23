// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–8 de então, linhas 179–736.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { b5, bG, bM, bP } from "./01_util.js";
import { system as qS, world as qT, Player as r7 } from "@minecraft/server";
import { eO } from "./08_fusion_regions.js";
import { acquireLoadedArea as duAcquireLoadedArea, physicalDestinationId as duPhysicalDestinationId, releaseLoadedArea as duReleaseLoadedArea } from "../travel_safety.js";
import { pJ } from "./25_terrain_generator.js";
import { r2 } from "./29_future_city.js";
import { regionsData as qR } from "../data/regions_data.js";
import { dC } from "./06_requirements.js";
import { hN } from "./14_player.js";
import { dp } from "./05_db_cooldowns.js";
import { fG } from "./11_entity_wrapper.js";
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
import { variables as rx } from "../data/variables.js";
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
import { resolveMartialArtsMode, onMartialArtsSite } from "../world_landmarks.js";
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
export { rk, rp, rq, rv, rE, rF, rG };
