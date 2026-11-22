/**
 * Unique landmarks placed once per world from .mcstructure pieces (see relatorios/F_estruturas.md).
 *
 * Every landmark gets one random spot per world, saved in PLAN_PROP, on the surface of its dimension:
 *   - the spot is drawn the first time the script runs in a world and placed only when a player comes close. Overworld
 *     draws look for a footprint well inside the biome (seed probes, no chunk loaded): the closest point of a biome is on its
 *     border, next to hills, rivers or beaches, and that is where large landmarks used to be rejected;
 *   - before anything is written, the surface under the whole footprint is sampled and the footprint is searched for
 *     blocks a player or a village would have placed (PLACED_BLOCKS). Overworld: a spot that fails tries nearby positions
 *     (SHIFT), then a few nearby draws during the same visit (NEARBY_TRIES, one per scan, without SHIFT); only then is it drawn
 *     again anywhere. Nothing is written before a spot passes, so worlds created before this module keep what they have;
 *   - pieces are placed one at a time inside their own temporary loaded area, and the piece count is saved, so an
 *     interrupted placement resumes at the piece it stopped on;
 *   - whatever the lowest layer of the structure does not touch is filled down to the ground (FOUNDATION_DEPTH).
 *
 * Operators: /scriptevent dbe:landmarks            -> lists every spot and its state
 *            /scriptevent dbe:landmarks_retry key  -> unlocks a spot that gave up
 */
import * as mc from "@minecraft/server";
import { acquireLoadedArea, releaseLoadedArea, isSafeStanding } from "./travel_safety.js";
import { friezaLandmarkEnv } from "./space_planets.js";
import { namekLandmarkEnv } from "./namek_dimension.js";
import { tournaments_data } from "./data/tournaments_data.js";

const { world, system, BlockVolume } = mc;

const OVERWORLD = "minecraft:overworld";
const PLAN_PROP = "dbe:world_landmarks"; // JSON { v, spots: { key: { x, z, y?, done?, placed?, tries?, rejects?, none? } } }
const PLAN_VERSION = 2; // 2: 1.7.15 resets the reject and try counters of landmarks not placed yet (migratePlan)
const STRUCTURES_PROP = "dbe:world_structures"; // plan of world_structures.js, read only
const SCAN_TICKS = 40;
const PLACE_MARGIN = 64; // planets: a player this close to the footprint (horizontally) triggers the placement
const OVERWORLD_MARGIN = 160; // overworld: further out, so the build is finished before the player gets there and sees it
const MIN_SEPARATION = 400; // between the landmarks and the spots of world_structures.js
const MIN_DIST = 900; // overworld: distance range from the world spawn
const MAX_DIST = 3500;
const MAX_TRIES = 5; // placement errors before a spot gives up
const MAX_REJECTS = 12; // spots drawn again before a landmark gives up
const SAMPLE_STEP = 8; // blocks between surface samples
const MAX_WET = 0.1; // share of samples that may be liquid
const FOUNDATION_DEPTH = 48;
const SHIFT = 48; // overworld: a spot whose ground fails first tries every position this close (SAMPLE_STEP apart)
const NEARBY_TRIES = 3; // overworld: then this many draws around it, one per scan (spot.nearby keeps the count)
const NEARBY_MIN = 160; // distance of those draws from the failed spot
const NEARBY_MAX = 320;
const BIOME_TOL = 12; // a seed probe closer than this to its biome is inside it
const BIOME_MARGIN = 24; // ground around the footprint that must also be inside the biome
const PROBE_STEP = 48; // at most this far between two biome probes across the footprint
const DRAW_COOLDOWN = 600; // ticks before a landmark whose draw found nothing is drawn again (placements go on meanwhile)
const SAMPLE_TILE = 64; // side of each temporary loaded area while the ground is sampled
const SETTLE_TICKS = 10; // wait after loading a sample area, so chunks a teleport just loaded are complete

const LAND = ["minecraft:plains", "minecraft:sunflower_plains", "minecraft:forest", "minecraft:birch_forest", "minecraft:savanna", "minecraft:taiga", "dbe:dirtstone_plains", "dbe:west_forest"];

// Not part of any natural surface here. Found inside a footprint, they mean a player build or an existing structure.
const PLACED_BLOCKS = ["chest", "trapped_chest", "barrel", "ender_chest", "crafting_table", "furnace", "blast_furnace", "smoker", "bed", "torch",
  "lantern", "glass", "glass_pane", "oak_planks", "spruce_planks", "birch_planks", "jungle_planks", "acacia_planks", "dark_oak_planks", "mangrove_planks",
  "cherry_planks", "stone_bricks", "cobblestone", "brick_block", "wooden_door", "iron_door", "spruce_door", "birch_door", "oak_fence", "spruce_fence",
  "white_wool", "white_concrete", "quartz_block", "smooth_quartz", "bookshelf", "lectern", "anvil", "enchanting_table", "hopper", "dispenser", "dropper", "lever",
  "redstone_wire", "rail", "ladder", "standing_sign", "wall_sign", "flower_pot", "composter", "bell", "purple_concrete", "polished_blackstone_bricks"]
  .map((id) => "minecraft:" + id);

const SOFT = /leaves|_log$|_wood$|vine|short_grass|tall_grass|fern|flower|poppy|dandelion|tulip|orchid|allium|bluet|daisy|cornflower|lily|peony|rose|lilac|snow_layer|mushroom|bush|azalea|sapling|dead_bush|bamboo|sugar_cane|cactus|pumpkin|melon|seagrass|kelp|moss_carpet|web|^minecraft:air$/;

// What a foundation column may replace: plants only. Trunks and wood below the structure may be a player's wall.
const FOUNDATION_SOFT = /leaves|vine|short_grass|tall_grass|fern|flower(?!_pot)|poppy|dandelion|tulip|orchid|allium|bluet|daisy|cornflower|lily|peony|rose|lilac|snow_layer|bush|sapling|seagrass|kelp|moss_carpet/;

/**
 * Ground of a structure recolored where it is placed, so the .mcstructure stays as it was made: the bottom `layers` layers of
 * each piece get `swap` (`support`: what a swapped block becomes where nothing is under it). The Frieza base was saved on Earth
 * grass; on the planet that was a green square under it. version is
 * saved in the spot (spot.floor), so a base placed before this also gets it once, when a player comes near (followUp).
 */
const FRIEZA_FLOOR = {
  version: 1,
  layers: 3,
  swap: { "minecraft:grass_block": "dbe:frieza_soil", "minecraft:dirt": "dbe:frieza_soil", "minecraft:moss_block": "dbe:frieza_rock", "minecraft:mossy_cobblestone": "dbe:frieza_rock" },
};

/**
 * The Yamcha house was saved on a square of dirt (its whole bottom layer): in the desert that was a brown slab under it. The
 * dirt of that layer becomes sand, or sandstone where nothing holds the sand up (support).
 */
const YAMCHA_FLOOR = {
  version: 1,
  layers: 1,
  swap: { "minecraft:dirt": "minecraft:sand" },
  support: { "minecraft:sand": "minecraft:sandstone" },
};

// What a skirt may cover: low plants only. Leaves, trunks and anything else are left as they are.
const SKIRT_SOFT = /short_grass|tall_grass|fern|flower(?!_pot)|poppy|dandelion|tulip|orchid|allium|bluet|daisy|cornflower|lily|peony|rose|lilac|snow_layer|dead_bush|sapling|moss_carpet/;
// What a skirt may rest on: natural ground only. Over leaves, trunks, cactus, mushrooms or anything else the column is skipped.
const SKIRT_GROUND = /^minecraft:(grass_block|dirt|coarse_dirt|podzol|rooted_dirt|mycelium|mud|sand|red_sand|sandstone|red_sandstone|stone|gravel|clay|andesite|diorite|granite|deepslate|tuff|calcite|hardened_clay|[a-z_]*terracotta|snow)$|^dbe:[a-z_]*(soil|stone|grass|dirt|sand|rock)[a-z_]*$/;

/**
 * Slope around a landmark whose bottom layer stands above the ground: up to `width` blocks out, one block lower per block, so the
 * foundation is not a square wall. `top` covers it and `fill` is under it. Saved as spot.skirt = version, like spot.floor.
 * Known and accepted: on a house placed before this (follow-up), a hole a player dug inside the skirt below the house level, or
 * low plants they planted there, get covered once, like any natural dip.
 */
const PICCOLO_SKIRT = { version: 1, width: 4, top: "minecraft:grass_block", fill: "minecraft:dirt" };
const YAMCHA_SKIRT = { version: 1, width: 4, top: "minecraft:sand", fill: "minecraft:sandstone" };

/** Floor swap and skirt of a landmark placed before them (spot.floor / spot.skirt older), done once when a player comes near. */
const touchUp = (key) => {
  const specOf = () => SPECS.find((s) => s.key === key);
  const floorDue = (spec, spot) => spec.floor && spot.floor !== spec.floor.version;
  const skirtDue = (spec, spot) => spec.skirt && spot.skirt !== spec.skirt.version;
  return {
    pending: (spot) => floorDue(specOf(), spot) || skirtDue(specOf(), spot),
    run: async (spot, dim) => {
      const spec = specOf();
      if (floorDue(spec, spot)) await refloor(dim, key, spot);
      if (skirtDue(spec, spot)) await reskirt(dim, spec, spot);
    },
  };
};

const single = (id, size) => [{ id, dx: 0, dz: 0, ...size }];
const grid = (prefix, widths, depths) => {
  const pieces = [];
  let dx = 0;
  for (const x of widths) {
    let dz = 0;
    for (const z of depths) {
      pieces.push({ id: prefix + (pieces.length + 1), dx, dz, x, z });
      dz += z;
    }
    dx += x;
  }
  return pieces;
};
/**
 * dim: "overworld" or a key of ENV. size: x, y, z of the assembled structure. pieces: structure ids with their offset.
 * biomes: overworld biomes to look for. maxRange: allowed height difference across the footprint. foundation: fill block.
 */
const SPECS = [
  { key: "piccolo_house", dim: "overworld", size: { x: 42, y: 27, z: 23 }, pieces: single("dbe:landmarks/piccolo_house", { x: 42, z: 23 }), biomes: LAND, maxRange: 8, foundation: "minecraft:dirt", skirt: PICCOLO_SKIRT, followUp: touchUp("piccolo_house") },
  { key: "yamcha_house", dim: "overworld", size: { x: 26, y: 45, z: 25 }, pieces: single("dbe:landmarks/yamcha_house", { x: 26, z: 25 }), biomes: ["minecraft:desert"], maxRange: 8, foundation: "minecraft:sandstone", floor: YAMCHA_FLOOR, skirt: YAMCHA_SKIRT, followUp: touchUp("yamcha_house") },
  { key: "red_ribbon_tower", dim: "overworld", size: { x: 33, y: 65, z: 32 }, pieces: single("dbe:landmarks/red_ribbon_tower", { x: 33, z: 32 }), biomes: LAND, maxRange: 8, foundation: "minecraft:dirt" },
  { key: "frieza_army_base", dim: "frieza", size: { x: 59, y: 46, z: 59 }, pieces: single("dbe:landmarks/frieza_army_base", { x: 59, z: 59 }), maxRange: 7, foundation: "dbe:frieza_soil", floor: FRIEZA_FLOOR, followUp: touchUp("frieza_army_base") },
  { key: "guru_house", dim: "namek", size: { x: 91, y: 105, z: 91 }, pieces: grid("dbe:landmarks/guru_house_", [64, 27], [64, 27]), maxRange: 12, foundation: "dbe:namek_stone" },
  { key: "capsule_corp", dim: "overworld", size: { x: 141, y: 42, z: 154 }, pieces: grid("dbe:landmarks/capsule_corp_", [64, 64, 13], [64, 64, 26]), biomes: ["minecraft:plains", "dbe:dirtstone_plains", "dbe:west_forest"], maxRange: 10, foundation: "minecraft:dirt" },
  { key: "martial_arts_tournament", dim: "overworld", size: { x: 110, y: 21, z: 100 }, pieces: grid("dbe:landmarks/martial_arts_tournament_", [64, 46], [64, 36]), biomes: ["minecraft:plains", "minecraft:sunflower_plains", "dbe:dirtstone_plains"], maxRange: 6, foundation: "minecraft:dirt", enabled: () => martialArtsMode() === "relative", onPlaced: martialArtsPlaced, followUp: { pending: (spot) => !spot.announcer, run: spawnAnnouncer } },
];

// ---------------------------------------------------------------- World Martial Arts Tournament
// Worlds that already have the old build keep it in its own dimension. The others get the new one in a plains biome, and
// the tournament data follows the drawn spot. index.js settles the mode once, when the old region loads.
const MARTIAL_MODE_PROP = "dbe:martial_arts_mode";
const MARTIAL = { fighterOne: [54, 2, 44], fighterTwo: [71, 2, 61], spectator: [66, 1, 34], announcer: [38, 1, 53], ring: [50, 40, 75, 65] };
const martialListeners = [];

const martialArtsMode = () => world.getDynamicProperty(MARTIAL_MODE_PROP);

export function resolveMartialArtsMode(alreadyLoaded) {
  let mode = martialArtsMode();
  if (mode !== "legacy" && mode !== "relative") {
    mode = alreadyLoaded ? "legacy" : "relative";
    world.setDynamicProperty(MARTIAL_MODE_PROP, mode);
  }
  return mode;
}

/** The two regions of a placed tournament, for index.js: they are not saved, so they are registered again on every load. */
export function onMartialArtsSite(listener) {
  martialListeners.push(listener);
}

function applyMartialSite(spot) {
  const at = ([x, y, z]) => ({ x: spot.x + x, y: spot.y + y, z: spot.z + z });
  const data = tournaments_data[0];
  data.dimensionId = OVERWORLD;
  data.spectatorSpawn = at(MARTIAL.spectator);
  data.opponentOneSpawnLocation = at(MARTIAL.fighterOne);
  data.opponentTwoSpawnLocation = at(MARTIAL.fighterTwo);
  const [x1, z1, x2, z2] = MARTIAL.ring;
  const common = { dimensionId: OVERWORLD, allowQuests: false, blockProtection: true, preventMobSpawning: true };
  const regions = [
    { ...common, id: "world_martial_arts_tournament", allowPvP: false, pos1: { x: spot.x, y: spot.y, z: spot.z }, pos2: { x: spot.x + 109, y: 319, z: spot.z + 99 }, spawnLocation: data.spectatorSpawn },
    { ...common, id: "world_martial_arts_tournament_arena", allowPvP: true, priority: 1, pos1: { x: spot.x + x1, y: spot.y, z: spot.z + z1 }, pos2: { x: spot.x + x2, y: 319, z: spot.z + z2 } },
  ];
  for (const listener of martialListeners) listener(regions);
}

async function martialArtsPlaced(spot, dim) {
  applyMartialSite(spot);
  await spawnAnnouncer(spot, dim);
}

/** Opens the tournament queue. A failure leaves spot.announcer unset, and scan tries again while a player is near. */
async function spawnAnnouncer(spot, dim) {
  const location = { x: spot.x + MARTIAL.announcer[0] + 0.5, y: spot.y + MARTIAL.announcer[1], z: spot.z + MARTIAL.announcer[2] + 0.5 };
  let area;
  try {
    area = await acquireLoadedArea(dim, location, location, "tournament announcer");
    dim.spawnEntity("dbe:announcer", location);
    spot.announcer = true;
  } catch (e) {
    console.warn("[Landmarks] tournament announcer not spawned: " + e);
  } finally {
    if (area) releaseLoadedArea(area);
  }
}

const ENV = { frieza: friezaLandmarkEnv, namek: namekLandmarkEnv };

const enabled = (spec) => !spec.enabled || spec.enabled();
const waitTicks = (n) => new Promise((resolve) => system.runTimeout(resolve, n));

function runJobAsync(gen) {
  return new Promise((resolve, reject) => {
    system.runJob((function* () {
      try {
        yield* gen;
        resolve();
      } catch (e) {
        reject(e);
      }
    })());
  });
}

/**
 * Version 1 (1.7.14) rejected spots without trying nearby ground, so test worlds may hold landmarks that gave up.
 * Once, every landmark not placed yet loses none, rejects, tries and its last reject; placed ones are not touched.
 */
function migratePlan(plan) {
  const reset = [];
  for (const [key, spot] of Object.entries(plan.spots)) {
    if (spot.placed) continue;
    if (spot.none) delete plan.spots[key];
    else for (const k of ["rejects", "tries", "lastError", "lastReject", "waits"]) delete spot[k];
    reset.push(key);
  }
  delete plan.rejects;
  delete plan.lastRejects;
  plan.v = PLAN_VERSION;
  console.warn("[Landmarks] plan updated to v" + PLAN_VERSION + "; counters reset for: " + (reset.join(", ") || "none"));
  return plan;
}

function loadPlan() {
  let plan;
  try {
    const raw = world.getDynamicProperty(PLAN_PROP);
    plan = typeof raw === "string" ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("[Landmarks] saved plan unreadable, planning again: " + e);
    return { v: PLAN_VERSION, spots: {} };
  }
  if (plan && plan.v === 1 && plan.spots) {
    migratePlan(plan); // in memory: a failed save below must not look like an unreadable plan
    try {
      savePlan(plan);
    } catch (e) {
      console.warn("[Landmarks] migrated plan not saved yet, kept in memory (migrated again on the next load): " + e);
    }
    return plan;
  }
  if (plan && plan.v === PLAN_VERSION && plan.spots) return plan;
  return { v: PLAN_VERSION, spots: {} };
}

const savePlan = (plan) => world.setDynamicProperty(PLAN_PROP, JSON.stringify(plan));

function structureSpots() {
  try {
    const raw = world.getDynamicProperty(STRUCTURES_PROP);
    return (typeof raw === "string" ? JSON.parse(raw) : {}).spots ?? {};
  } catch (e) {
    return {};
  }
}

/** Overworld landmark spots, so world_structures.js does not plan a city on top of one. */
export function overworldLandmarkCenters() {
  const plan = loadPlan();
  return SPECS.filter((s) => s.dim === "overworld" && plan.spots[s.key] && !plan.spots[s.key].none).map((s) => centerOf(s, plan.spots[s.key]));
}

const dimensionOf = (spec) => world.getDimension(spec.dim === "overworld" ? OVERWORLD : ENV[spec.dim].id);
const centerOf = (spec, spot) => ({ x: spot.x + spec.size.x / 2, z: spot.z + spec.size.z / 2 });

function spawnPoint() {
  try {
    const s = world.getDefaultSpawnLocation();
    return { x: s.x, z: s.z };
  } catch (e) {
    return { x: 0, z: 0 };
  }
}

/** Centers of every planned spot in this dimension, to keep the landmarks apart. */
function takenCenters(spec, plan) {
  const taken = [];
  for (const other of SPECS) {
    const s = plan.spots[other.key];
    if (other !== spec && other.dim === spec.dim && s && !s.none) taken.push(centerOf(other, s));
  }
  if (spec.dim === "overworld") for (const s of Object.values(structureSpots())) if (!s.none) taken.push(s);
  return taken;
}

const farFrom = (taken, x, z) => !taken.some((t) => Math.hypot(t.x - x, t.z - z) < MIN_SEPARATION);

/** Overworld center allowed: apart from the other spots and at least MIN_DIST from the world spawn (nearby draws too). */
const overworldFree = (taken, spawn, x, z) => farFrom(taken, x, z) && Math.hypot(x - spawn.x, z - spawn.z) >= MIN_DIST;

/** Taken again right before a drawn spot is saved: world_structures.js may have planned one meanwhile. */
function stillFree(spec, plan, spot) {
  const c = centerOf(spec, spot);
  const taken = takenCenters(spec, plan);
  return spec.dim === "overworld" ? overworldFree(taken, spawnPoint(), c.x, c.z) : farFrom(taken, c.x, c.z);
}

function closestBiome(dim, from, biome, options) {
  try {
    return dim.calculateClosestBiomeFromSeed(from, biome, options);
  } catch (e) {
    return undefined; // biome unknown in this world type (e.g. flat world), or options not supported
  }
}

// A probe only needs to know whether the biome is right here, so its search is bounded to a small box. Until a bounded search
// has found a biome once (or PROBE_CHECKS misses agreed), a miss is checked with an open search: if that one finds the biome
// here, the option is dropped.
const PROBE_BOX = { boundingSize: { x: 64, y: 64, z: 64 } };
const PROBE_CHECKS = 3; // open searches that may check a bounded miss before the bounded mode is kept for good
let probeBounded = true, probeVerified = false, probeChecks = 0;

const nearTo = (p, x, z) => !!p && Math.hypot(p.x - x, p.z - z) <= BIOME_TOL;

/** True when (x, z) is in one of the biomes, by the seed: nothing is loaded. One search per tick (they can be slow). */
async function inBiome(dim, biomes, x, z) {
  const at = { x, y: 64, z };
  for (const biome of biomes) {
    let inside;
    if (probeBounded) {
      inside = nearTo(closestBiome(dim, at, biome, PROBE_BOX), x, z);
      if (inside) probeVerified = true;
      else if (!probeVerified) {
        if (nearTo(closestBiome(dim, at, biome), x, z)) {
          probeBounded = false;
          inside = true;
          console.warn("[Landmarks] bounded biome search not usable here; probes use the open search");
        } else if (++probeChecks >= PROBE_CHECKS) probeVerified = true; // both agreed every time: keep the bounded search
      }
    } else inside = nearTo(closestBiome(dim, at, biome), x, z);
    await waitTicks(1);
    if (inside) return true;
  }
  return false;
}

/** Probe points covering the footprint centered on c, plus BIOME_MARGIN: the center first, then the edges. */
function probePoints(spec, c) {
  const hx = spec.size.x / 2 + BIOME_MARGIN, hz = spec.size.z / 2 + BIOME_MARGIN;
  const nx = Math.max(2, Math.ceil((2 * hx) / PROBE_STEP)), nz = Math.max(2, Math.ceil((2 * hz) / PROBE_STEP));
  const points = [[Math.round(c.x), Math.round(c.z)]];
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j <= nz; j++) points.push([Math.round(c.x - hx + (2 * hx * i) / nx), Math.round(c.z - hz + (2 * hz * j) / nz)]);
  return points;
}

/**
 * A center whose whole footprint (and its margin) lies inside the allowed biomes, found from p, the closest biome point to
 * `from`. p is on the border of the biome, so the candidates go into it, away from `from`.
 */
async function interiorCenter(dim, spec, from, p, taken, spawn) {
  const len = Math.hypot(p.x - from.x, p.z - from.z);
  const half = Math.hypot(spec.size.x, spec.size.z) / 2 + BIOME_MARGIN;
  const candidates = len > 1
    ? [1, 1.75, 2.5].map((k) => ({ x: p.x + ((p.x - from.x) / len) * half * k, z: p.z + ((p.z - from.z) / len) * half * k }))
    : [{ x: p.x, z: p.z }, { x: p.x + half, z: p.z }, { x: p.x - half, z: p.z }, { x: p.x, z: p.z + half }, { x: p.x, z: p.z - half }];
  for (const c of candidates) {
    if (!overworldFree(taken, spawn, c.x, c.z)) continue;
    let inside = true;
    for (const [x, z] of probePoints(spec, c)) {
      if (!(await inBiome(dim, spec.biomes, x, z))) {
        inside = false;
        break;
      }
    }
    if (inside) return c;
  }
}

/**
 * Overworld draw. around: the center of a spot that failed, to draw near it (NEARBY_MIN..NEARBY_MAX) instead of anywhere
 * between MIN_DIST and MAX_DIST from the world spawn. Returns the corner { x, z }, with edge: true when no footprint fully
 * inside the biome was found and the closest biome point is used as before; undefined when no biome is found.
 */
async function drawOverworld(spec, plan, dim, around) {
  const spawn = spawnPoint();
  const taken = takenCenters(spec, plan);
  const a = Math.random() * Math.PI * 2;
  const base = around ?? spawn;
  const d = around ? NEARBY_MIN + Math.random() * (NEARBY_MAX - NEARBY_MIN) : MIN_DIST + Math.random() * (MAX_DIST - MIN_DIST);
  const from = { x: Math.round(base.x + Math.cos(a) * d), y: 64, z: Math.round(base.z + Math.sin(a) * d) };
  const found = [];
  for (const biome of spec.biomes) {
    const p = closestBiome(dim, from, biome);
    await waitTicks(1);
    if (!p || !overworldFree(taken, spawn, p.x, p.z)) continue;
    found.push({ x: p.x, z: p.z, d: Math.hypot(p.x - from.x, p.z - from.z) });
  }
  if (!found.length) return undefined;
  found.sort((u, v) => u.d - v.d);
  const corner = (c) => ({ x: Math.round(c.x - spec.size.x / 2), z: Math.round(c.z - spec.size.z / 2) });
  for (const p of found.slice(0, 2)) {
    const c = await interiorCenter(dim, spec, from, p, taken, spawn);
    if (c) return corner(c);
  }
  return { ...corner(found[0]), edge: true };
}

async function draw(spec, plan, dim, around) {
  return spec.dim === "overworld" ? drawOverworld(spec, plan, dim, around) : drawOnPlanet(spec, plan);
}

/** Heights of the planets are known without loading anything, so a bad spot is discarded here. */
function drawOnPlanet(spec, plan) {
  const env = ENV[spec.dim];
  const taken = takenCenters(spec, plan);
  for (let attempt = 0; attempt < 40; attempt++) {
    const a = Math.random() * Math.PI * 2;
    const d = 300 + Math.random() * 1200;
    const x = Math.round(Math.cos(a) * d);
    const z = Math.round(Math.sin(a) * d);
    if (!farFrom(taken, x, z)) continue;
    if (planetSurface(spec, env, { x, z })) return { x, z };
  }
  return undefined;
}

function planetSurface(spec, env, spot) {
  const heights = [], points = [];
  for (let x = spot.x; x <= spot.x + spec.size.x + SAMPLE_STEP - 1; x += SAMPLE_STEP) {
    for (let z = spot.z; z <= spot.z + spec.size.z + SAMPLE_STEP - 1; z += SAMPLE_STEP) {
      if (!env.clear(x, z)) return undefined;
      const h = env.surface(x, z);
      if (h <= env.sea + 1) return undefined;
      heights.push(h);
      points.push([x, z]);
    }
  }
  const y = surfaceLevel(spec, heights);
  // env.free is the expensive test (Frieza replays the chunk decoration), so it only runs on terrain that already passed
  if (y === undefined || (env.free && points.some(([x, z]) => !env.free(x, z)))) return undefined;
  return y;
}

/** The level the lowest layer sits on, or undefined when the ground is too uneven or the top leaves the world. */
function surfaceLevel(spec, heights) {
  heights.sort((a, b) => a - b);
  if (heights[heights.length - 1] - heights[0] > spec.maxRange) return undefined;
  const y = heights[heights.length >> 1];
  return y + spec.size.y > 319 ? undefined : y;
}

const pieceFrom = (spot, piece, y) => ({ x: spot.x + piece.dx, y, z: spot.z + piece.dz });
const pieceTo = (spot, piece, y, height) => ({ x: spot.x + piece.dx + piece.x - 1, y: y + height - 1, z: spot.z + piece.dz + piece.z - 1 });

async function withPieceArea(dim, spec, spot, piece, y, work) {
  const from = pieceFrom(spot, piece, y);
  const to = pieceTo(spot, piece, y, 1);
  const area = await acquireLoadedArea(dim, from, to, "landmark " + spec.key);
  try {
    return await work();
  } finally {
    releaseLoadedArea(area);
  }
}

// Same test as the core (aF.isUnavailable in index.js): the block is outside loaded chunks or the world, not a real error.
const isUnavailable = (error) => /LocationInUnloadedChunk|LocationOutOfWorldBoundaries|unloaded chunk|outside.*(?:world|bound)/i.test(error?.name + ": " + error);

function surfaceAt(dim, x, z) {
  let block = dim.getTopmostBlock({ x, z });
  while (block && !block.isLiquid && SOFT.test(block.typeId)) block = block.below();
  return block;
}

/** Sample offsets of a spec relative to its spot: every SAMPLE_STEP inside each piece. */
function sampleOffsets(spec) {
  const offsets = new Map();
  for (const piece of spec.pieces)
    for (let i = 0; i < piece.x; i += SAMPLE_STEP) for (let j = 0; j < piece.z; j += SAMPLE_STEP) offsets.set(piece.dx + i + "," + (piece.dz + j), [piece.dx + i, piece.dz + j]);
  return [...offsets.values()];
}

/** Surface of every SAMPLE_STEP grid column around the spot (SHIFT on each side): "x,z" -> { y, wet } or null when unreadable. */
async function sampleGround(dim, spec, spot, offsets, shift) {
  const maxI = Math.max(...offsets.map((o) => o[0])), maxJ = Math.max(...offsets.map((o) => o[1]));
  const x1 = spot.x - shift, x2 = spot.x + maxI + shift, z1 = spot.z - shift, z2 = spot.z + maxJ + shift;
  const ground = new Map();
  for (let tx = x1; tx <= x2; tx += SAMPLE_TILE) {
    for (let tz = z1; tz <= z2; tz += SAMPLE_TILE) {
      const ex = Math.min(tx + SAMPLE_TILE - 1, x2), ez = Math.min(tz + SAMPLE_TILE - 1, z2);
      const area = await acquireLoadedArea(dim, { x: tx, y: -64, z: tz }, { x: ex, y: -64, z: ez }, "landmark " + spec.key + " ground");
      try {
        await waitTicks(SETTLE_TICKS);
        for (let x = tx; x <= ex; x += SAMPLE_STEP) {
          for (let z = tz; z <= ez; z += SAMPLE_STEP) {
            let block;
            try {
              block = surfaceAt(dim, x, z);
            } catch (e) {
              if (!isUnavailable(e)) throw e; // any other error is a real failure of this attempt
              ground.set(x + "," + z, null); // chunk not readable yet
              continue;
            }
            ground.set(x + "," + z, block ? { y: block.location.y, wet: block.isLiquid } : { none: true });
          }
        }
      } finally {
        releaseLoadedArea(area);
      }
    }
  }
  return ground;
}

/** Verdict of the ground for the spot moved by (ox, oz): { y } or { why, unreadable? }. */
function groundVerdict(spec, spot, offsets, ground, ox, oz) {
  const heights = [];
  let wet = 0;
  for (const [i, j] of offsets) {
    const sample = ground.get(spot.x + ox + i + "," + (spot.z + oz + j));
    if (!sample) return { why: "surface not readable", unreadable: true };
    if (sample.none) return { why: "no ground in a column" };
    heights.push(sample.y);
    if (sample.wet) wet++;
  }
  if (wet / heights.length > MAX_WET) return { why: "water on " + Math.round((100 * wet) / heights.length) + "% of the ground (max " + MAX_WET * 100 + "%)" };
  const low = Math.min(...heights), high = Math.max(...heights);
  const y = surfaceLevel(spec, heights);
  if (y === undefined) return { why: high - low > spec.maxRange ? "ground uneven by " + (high - low) + " blocks (max " + spec.maxRange + ")" : "top would leave the world" };
  return { y };
}

/**
 * Overworld: the drawn spot, or the closest position up to `shift` blocks away, whose ground and footprint are usable. The
 * nearby draws use shift 0: each one samples only its own footprint, so it stays short.
 */
async function chooseOverworldLevel(dim, spec, spot, shift = SHIFT) {
  const offsets = sampleOffsets(spec);
  const ground = await sampleGround(dim, spec, spot, offsets, shift);
  const shifts = [];
  for (let ox = -shift; ox <= shift; ox += SAMPLE_STEP) for (let oz = -shift; oz <= shift; oz += SAMPLE_STEP) shifts.push([ox, oz]);
  shifts.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
  const usable = [];
  let first;
  for (let k = 0; k < shifts.length; k++) {
    const [ox, oz] = shifts[k];
    if (k && k % 10 === 0) await waitTicks(1); // up to ~29k cached reads for the Capsule: spread over ticks
    const verdict = groundVerdict(spec, spot, offsets, ground, ox, oz);
    if (!ox && !oz) first = verdict;
    if (verdict.y !== undefined) usable.push({ x: spot.x + ox, z: spot.z + oz, y: verdict.y });
  }
  // The drawn spot itself unreadable: nothing is known about it yet, so it is kept and tried again later.
  if (!usable.length && first.unreadable) return { reason: "surface not readable yet", transient: true };
  let builds;
  for (const candidate of usable.slice(0, 3)) {
    builds = await findBuilds(dim, spec, candidate, candidate.y);
    if (!builds) return candidate;
  }
  return { reason: builds ? "found " + builds : first.why + (shift ? "; no position within " + shift + " blocks is better" : "") };
}

/** The first block from PLACED_BLOCKS where the piece would be written ("type at x,y,z"), or undefined. */
async function pieceHasBuilds(dim, spec, spot, piece, y) {
  const top = y + spec.size.y - 1;
  const ignored = ENV[spec.dim]?.generated ?? [];
  const types = ignored.length ? PLACED_BLOCKS.filter((t) => !ignored.includes(t)) : PLACED_BLOCKS;
  for (let cx = spot.x + piece.dx; cx < spot.x + piece.dx + piece.x; cx += 16) {
    for (let cz = spot.z + piece.dz; cz < spot.z + piece.dz + piece.z; cz += 16) {
      const volume = new BlockVolume({ x: cx, y, z: cz }, {
        x: Math.min(cx + 15, spot.x + piece.dx + piece.x - 1),
        y: top,
        z: Math.min(cz + 15, spot.z + piece.dz + piece.z - 1),
      });
      const found = dim.getBlocks(volume, { includeTypes: types }, true);
      if (found.getCapacity() > 0) {
        for (const p of found.getBlockLocationIterator()) return (dim.getBlock(p)?.typeId ?? "a placed block") + " at " + p.x + "," + p.y + "," + p.z;
        return "a placed block";
      }
      await waitTicks(1);
    }
  }
}

/** First PLACED_BLOCKS block found under any piece at this level, or undefined. */
async function findBuilds(dim, spec, spot, y) {
  for (const piece of spec.pieces) {
    const found = await withPieceArea(dim, spec, spot, piece, y, () => pieceHasBuilds(dim, spec, spot, piece, y));
    if (found) return found;
  }
}

/**
 * Decides where and how high a drawn spot is built. Returns { x, z, y }, or { reason } when the spot has to be drawn
 * again, or { reason, transient: true } when the ground could not be read yet (the spot is kept and tried later).
 */
async function chooseLevel(dim, spec, spot, shift) {
  const env = ENV[spec.dim];
  if (!env) return chooseOverworldLevel(dim, spec, spot, shift);
  const y = planetSurface(spec, env, spot);
  if (y === undefined) return { reason: "planet ground too uneven, wet or reserved" };
  const first = (v) => Math.floor(v / 16);
  const ready = await env.prepare(first(spot.x), first(spot.z), first(spot.x + spec.size.x - 1), first(spot.z + spec.size.z - 1));
  if (!ready) return { reason: "planet chunk edited by a player (protected) or legacy" };
  const builds = await findBuilds(dim, spec, spot, y);
  return builds ? { reason: "found " + builds } : { x: spot.x, z: spot.z, y };
}

/**
 * Swaps the floor blocks of spec.floor in the bottom layers of a piece. Only where the template itself has that block: dirt or
 * moss a player put on a base placed earlier stays as it is. Without the template nothing is swapped.
 */
function* floorJob(dim, spec, spot, piece, y) {
  const { swap, layers, support } = spec.floor;
  let template;
  try {
    template = world.structureManager.get(piece.id);
  } catch (e) {
    template = undefined;
  }
  if (!template) {
    console.warn("[Landmarks] " + spec.key + ": structure " + piece.id + " not found; floor left as is");
    return;
  }
  const templateType = (i, k, j) => {
    try {
      return template.getBlockPermutation({ x: i, y: k, z: j })?.type.id;
    } catch (e) {
      return undefined;
    }
  };
  for (let i = 0; i < piece.x; i++) {
    for (let j = 0; j < piece.z; j++) {
      for (let k = 0; k < layers; k++) {
        const block = dim.getBlock({ x: spot.x + piece.dx + i, y: y + k, z: spot.z + piece.dz + j });
        let to = block && swap[block.typeId];
        if (!to || templateType(i, k, j) !== block.typeId) continue;
        if (support?.[to]) {
          const below = block.below();
          if (!below || below.isAir || below.isLiquid) to = support[to];
        }
        block.setType(to);
      }
    }
    yield;
  }
}

/** Follow-up of a landmark placed before its floor swap (or of an interrupted one): swaps it now, once. */
async function refloor(dim, key, spot) {
  const spec = SPECS.find((s) => s.key === key);
  for (const piece of spec.pieces) await withPieceArea(dim, spec, spot, piece, spot.y, () => runJobAsync(floorJob(dim, spec, spot, piece, spot.y)));
  spot.floor = spec.floor.version;
  console.log("[Landmarks] " + key + ": floor swapped to the planet ground");
}

/** Fills the columns under the lowest layer of a piece. Only air, liquid and plants are replaced. */
function* foundationJob(dim, spec, spot, piece, y) {
  for (let i = 0; i < piece.x; i++) {
    for (let j = 0; j < piece.z; j++) {
      const x = spot.x + piece.dx + i;
      const z = spot.z + piece.dz + j;
      if (dim.getBlock({ x, y, z })?.isAir !== false) continue;
      for (let below = y - 1; below >= y - FOUNDATION_DEPTH; below--) {
        const block = dim.getBlock({ x, y: below, z });
        if (!block || !(block.isAir || block.isLiquid || FOUNDATION_SOFT.test(block.typeId))) break;
        block.setType(spec.foundation);
      }
    }
    yield;
  }
}

/**
 * Skirt of spec.skirt around the footprint. A column gets it only where the landmark has ground at its edge, the slope is above
 * the natural ground, and that ground is natural terrain (SKIRT_GROUND: never water, leaves, trunks, cactus or mushrooms). Only
 * air and low plants are replaced, and never in a column where a player is.
 */
function* skirtJob(dim, spec, spot) {
  const { width, top, fill } = spec.skirt;
  const x0 = spot.x, z0 = spot.z, x1 = spot.x + spec.size.x - 1, z1 = spot.z + spec.size.z - 1, y = spot.y;
  const out = (v, lo, hi) => (v < lo ? lo - v : v > hi ? v - hi : 0);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  for (let x = x0 - width; x <= x1 + width; x++) {
    const players = dim.getPlayers().map((p) => p.location); // read again each row: the job spans ticks
    for (let z = z0 - width; z <= z1 + width; z++) {
      const d = out(x, x0, x1) + out(z, z0, z1);
      if (d === 0 || d > width) continue;
      if (players.some((p) => Math.abs(p.x - (x + 0.5)) < 1.3 && Math.abs(p.z - (z + 0.5)) < 1.3 && p.y > y - width - FOUNDATION_DEPTH && p.y < y + 2)) continue;
      const edge = dim.getBlock({ x: clamp(x, x0, x1), y, z: clamp(z, z0, z1) });
      if (!edge || edge.isAir || edge.isLiquid) continue;
      const t = y - d;
      let g = t;
      let ground;
      for (; g >= t - FOUNDATION_DEPTH; g--) {
        const block = dim.getBlock({ x, y: g, z });
        if (!block) break;
        if (block.isAir || SKIRT_SOFT.test(block.typeId)) continue;
        ground = block;
        break;
      }
      if (!ground || g >= t || !SKIRT_GROUND.test(ground.typeId)) continue;
      for (let k = g + 1; k <= t; k++) dim.getBlock({ x, y: k, z })?.setType(k === t ? top : fill);
    }
    yield;
  }
}

/** Skirt of a landmark (placement or follow-up). The area loaded is the footprint plus the skirt width. */
async function reskirt(dim, spec, spot) {
  const w = spec.skirt.width;
  const from = { x: spot.x - w, y: spot.y, z: spot.z - w };
  const to = { x: spot.x + spec.size.x - 1 + w, y: spot.y, z: spot.z + spec.size.z - 1 + w };
  const area = await acquireLoadedArea(dim, from, to, "landmark " + spec.key + " skirt");
  try {
    await runJobAsync(skirtJob(dim, spec, spot));
  } finally {
    releaseLoadedArea(area);
  }
  spot.skirt = spec.skirt.version;
  console.log("[Landmarks] " + spec.key + ": skirt done");
}

let busy = false;
let drawTurn = 0;
const drawAfter = new Map(); // key -> tick before which a landmark whose draw found nothing is not drawn again

/**
 * Overworld: one nearby draw for a spot that failed while a player was near (spot.nearby = { k, reason }, saved). Each call
 * checks one alternative without SHIFT and returns, so busy is released between them and the other landmarks go on. Returns a
 * usable level ({ x, z, y, nearby }), { pending: true } while draws remain, or the final verdict once NEARBY_TRIES failed.
 */
async function nextNearby(dim, spec, spot, plan) {
  const state = spot.nearby;
  const k = ++state.k;
  let alt, level;
  try {
    alt = await drawOverworld(spec, plan, dim, centerOf(spec, spot));
    level = alt ? await chooseLevel(dim, spec, alt, 0) : { reason: "no biome found around it" };
    if (level.transient) level = { reason: level.reason }; // an alternative is never waited for
    if (level.y !== undefined && !stillFree(spec, plan, level)) level = { reason: "another spot was planned there meanwhile" };
  } catch (e) {
    level = { reason: "error: " + String(e?.message ?? e).slice(0, 80) }; // loading failure or other: this draw is rejected
  }
  console.warn("[Landmarks] " + spec.key + ": nearby draw " + k + "/" + NEARBY_TRIES + (alt ? " at " + alt.x + ", " + alt.z : "") + (level.y === undefined ? " rejected: " + level.reason : " usable"));
  if (level.y !== undefined) return { ...level, nearby: k };
  if (k < NEARBY_TRIES) return { pending: true };
  return { reason: state.reason + "; " + NEARBY_TRIES + " nearby draws also failed" };
}

/** Draws a spot for a landmark that has none. Runs over several ticks (seed probes), with busy set. */
async function drawMissing(spec, plan) {
  busy = true;
  try {
    const rejects = plan.rejects?.[spec.key] ?? 0;
    const drawn = await draw(spec, plan, dimensionOf(spec));
    if (drawn && !stillFree(spec, plan, drawn)) {
      console.warn("[Landmarks] " + spec.key + ": drawn spot " + drawn.x + ", " + drawn.z + " was taken meanwhile; drawing again");
      return;
    }
    if (!drawn) {
      drawAfter.set(spec.key, system.currentTick + DRAW_COOLDOWN);
      return;
    }
    plan.spots[spec.key] = rejects ? { ...drawn, rejects, lastReject: plan.lastRejects?.[spec.key] } : drawn;
    savePlan(plan);
    if (drawn.edge) console.warn("[Landmarks] " + spec.key + ": no footprint fully inside its biome found; using the biome border at " + drawn.x + ", " + drawn.z);
  } catch (e) {
    drawAfter.set(spec.key, system.currentTick + DRAW_COOLDOWN);
    console.warn("[Landmarks] " + spec.key + ": draw failed: " + e);
  } finally {
    busy = false;
  }
}

async function placeLandmark(dim, spec, spot, plan) {
  busy = true;
  try {
    if (spot.y === undefined) {
      let level;
      if (spot.nearby) {
        level = await nextNearby(dim, spec, spot, plan);
        if (level.pending) return; // next alternative on a later scan
      } else {
        level = await chooseLevel(dim, spec, spot);
        if (spec.dim === "overworld" && level.y === undefined && !level.transient) {
          spot.nearby = { k: 0, reason: level.reason };
          console.warn("[Landmarks] " + spec.key + ": " + level.reason + "; trying " + NEARBY_TRIES + " nearby draws, one per scan");
          return;
        }
      }
      if (level.transient) {
        // Not an error: kept and tried again on a later scan, without counting towards MAX_TRIES.
        spot.waits = (spot.waits ?? 0) + 1;
        console.warn("[Landmarks] " + spec.key + ": spot kept, " + level.reason + " (wait " + spot.waits + ")");
        return;
      }
      if (level.y === undefined) {
        // No new spot right now is not the end: scan keeps drawing, with the count kept in plan.rejects.
        // The new draw runs in drawMissing on a later scan, so busy is not held for it here.
        const rejects = (spot.rejects ?? 0) + 1;
        for (const k of Object.keys(spot)) delete spot[k];
        if (rejects >= MAX_REJECTS) Object.assign(spot, { none: true, rejects, lastReject: level.reason });
        else {
          delete plan.spots[spec.key];
          (plan.rejects ??= {})[spec.key] = rejects;
          (plan.lastRejects ??= {})[spec.key] = level.reason;
        }
        console.warn("[Landmarks] " + spec.key + ": spot rejected (" + rejects + "): " + level.reason + (rejects >= MAX_REJECTS ? "; giving up" : "; drawing again"));
        return;
      }
      if (level.x !== spot.x || level.z !== spot.z) console.warn("[Landmarks] " + spec.key + ": moved " + (level.x - spot.x) + ", " + (level.z - spot.z) + " blocks to usable ground" + (level.nearby ? " (nearby draw " + level.nearby + ")" : ""));
      delete spot.edge;
      delete spot.nearby;
      spot.x = level.x;
      spot.z = level.z;
      spot.y = level.y;
      spot.done = 0;
      savePlan(plan);
    }
    for (let i = spot.done ?? 0; i < spec.pieces.length; i++) {
      const piece = spec.pieces[i];
      await withPieceArea(dim, spec, spot, piece, spot.y, async () => {
        world.structureManager.place(piece.id, dim, pieceFrom(spot, piece, spot.y));
      });
      spot.done = i + 1;
      savePlan(plan);
      await waitTicks(10);
    }
    for (const piece of spec.pieces) {
      await withPieceArea(dim, spec, spot, piece, spot.y, async () => {
        await runJobAsync(foundationJob(dim, spec, spot, piece, spot.y)); // first: a swapped floor may need ground under it
        if (spec.floor) await runJobAsync(floorJob(dim, spec, spot, piece, spot.y));
      });
    }
    if (spec.floor) spot.floor = spec.floor.version;
    if (spec.skirt) {
      try {
        await reskirt(dim, spec, spot);
      } catch (e) {
        console.warn("[Landmarks] " + spec.key + ": skirt not done yet (tried again when a player comes near): " + e);
      }
    }
    liftPlayersInside(dim, spec, spot);
    spot.placed = true;
    delete spot.lastError;
    console.log("[Landmarks] placed " + spec.key + " at " + spot.x + ", " + spot.y + ", " + spot.z);
    await spec.onPlaced?.(spot, dim);
  } catch (e) {
    if (e.stage !== "loading") spot.tries = (spot.tries ?? 0) + 1;
    spot.lastError = String(e?.message ?? e).slice(0, 120);
    console.warn("[Landmarks] could not place " + spec.key + " (attempt " + spot.tries + "): " + e);
  } finally {
    try {
      savePlan(plan);
    } catch (e) {
      console.warn("[Landmarks] could not save the plan: " + e);
    }
    busy = false;
  }
}

/** A player who stood on the spot (a teleport right onto it) may now be inside the build: move them up to clear ground. */
function liftPlayersInside(dim, spec, spot) {
  for (const player of dim.getPlayers()) {
    try {
      const { x, y, z } = player.location;
      if (x < spot.x || x >= spot.x + spec.size.x || z < spot.z || z >= spot.z + spec.size.z || y < spot.y - 1 || y > spot.y + spec.size.y + 1) continue;
      if (isSafeStanding(dim, player.location)) continue;
      let target;
      for (let ty = Math.max(Math.floor(y), spot.y); ty <= spot.y + spec.size.y + 1 && !target; ty++) if (isSafeStanding(dim, { x, y: ty, z })) target = { x, y: ty, z };
      if (!target) {
        const top = dim.getTopmostBlock({ x: Math.floor(x), z: Math.floor(z) });
        if (top) target = { x, y: top.location.y + 1, z };
      }
      if (!target) continue;
      player.teleport(target);
      console.warn("[Landmarks] " + player.name + " was inside " + spec.key + "; moved up to y=" + target.y);
    } catch (e) {
      console.warn("[Landmarks] could not move a player out of " + spec.key + ": " + e);
    }
  }
}

async function finishFollowUp(dim, spec, spot, plan) {
  busy = true;
  try {
    await spec.followUp.run(spot, dim);
    savePlan(plan);
  } catch (e) {
    console.warn("[Landmarks] " + spec.key + " follow-up failed: " + e);
  } finally {
    busy = false;
  }
}

function scan() {
  if (busy) return;
  const plan = loadPlan();

  // Spots with a player near. Those already checked (level known, or a follow-up) go first: one landmark still looking for
  // ground (nearby draws, one per scan) never holds back one that only has to be written.
  const ready = [], unchecked = [];
  for (const spec of SPECS) {
    if (!enabled(spec)) continue;
    const spot = plan.spots[spec.key];
    if (!spot || spot.none) continue;
    const followUp = spot.placed && spec.followUp?.pending(spot);
    if (spot.placed ? !followUp : (spot.tries ?? 0) >= MAX_TRIES) continue;
    const dim = dimensionOf(spec);
    const margin = spec.dim === "overworld" ? OVERWORLD_MARGIN : PLACE_MARGIN;
    const near = dim.getPlayers().some((p) => {
      const dx = Math.max(spot.x - p.location.x, 0, p.location.x - (spot.x + spec.size.x));
      const dz = Math.max(spot.z - p.location.z, 0, p.location.z - (spot.z + spec.size.z));
      return Math.hypot(dx, dz) < margin;
    });
    if (near) (followUp || spot.y !== undefined ? ready : unchecked).push({ spec, spot, dim, followUp });
  }
  const job = ready[0];
  if (job) {
    if (job.followUp) finishFollowUp(job.dim, job.spec, job.spot, plan);
    else placeLandmark(job.dim, job.spec, job.spot, plan);
    return;
  }

  // one draw at a time, its biome searches spread over ticks; a landmark still without a spot (no usable draw yet) waits
  // DRAW_COOLDOWN and does not hold back the others
  const missing = SPECS.filter((s) => enabled(s) && !plan.spots[s.key] && !(system.currentTick < (drawAfter.get(s.key) ?? 0)));
  if (missing.length) {
    drawMissing(missing[drawTurn++ % missing.length], plan);
    return;
  }

  const check = unchecked[0];
  if (check) placeLandmark(check.dim, check.spec, check.spot, plan);
}

/**
 * Every landmark used in this world, for the Star Navigator list (world_structures.js): key, dimension key ("overworld",
 * "frieza", "namek"), center x/z when a spot exists, y once known, and state: "placed", "planned" (drawn, not built yet),
 * "none" (no usable spot) or "unplanned" (not drawn yet).
 */
export function landmarkSummary() {
  const plan = loadPlan();
  return SPECS.filter(enabled).map((spec) => {
    const s = plan.spots[spec.key];
    const c = s && !s.none ? centerOf(spec, s) : undefined;
    return {
      key: spec.key,
      dim: spec.dim,
      x: c ? Math.round(c.x) : undefined,
      z: c ? Math.round(c.z) : undefined,
      y: s?.y,
      state: !s ? "unplanned" : s.none ? "none" : s.placed ? "placed" : "planned",
    };
  });
}

function report(player) {
  const plan = loadPlan();
  player.sendMessage("§e[Landmarks] spots:");
  for (const spec of SPECS) {
    const s = plan.spots[spec.key];
    let state;
    if (!enabled(spec)) state = "§7not used in this world";
    else if (!s) state = "§7not planned yet";
    else if (s.none) state = "§cno usable spot found";
    else if (s.placed) state = "§aplaced";
    else if ((s.tries ?? 0) >= MAX_TRIES) state = "§cgave up: " + s.lastError;
    else state = "§6waiting for a player nearby" + (s.waits ? " §7(ground not readable " + s.waits + "x)" : "") + (s.nearby ? " §7(nearby draws " + s.nearby.k + "/" + NEARBY_TRIES + ")" : "");
    // the center of the footprint: walking to the corner put the build behind the player
    const c = s && !s.none ? centerOf(spec, s) : undefined;
    const where = c ? " §fX: " + Math.round(c.x) + " Z: " + Math.round(c.z) + (s.y !== undefined ? " Y: " + s.y : "") + (s.edge && !s.placed ? " §7(biome border)" : "") : "";
    const rejected = s?.rejects ? " §7(rejected " + s.rejects + "x; last: " + (s.lastReject ?? "?") + ")" : "";
    player.sendMessage(" §b" + spec.key + " §7(" + spec.dim + ")" + where + " " + state + rejected);
  }
}

/** Operator unlock of a spot that gave up. A new spot is drawn on the next scan if none was found. */
function retry(player, key) {
  if (player && !(player.commandPermissionLevel >= 1)) return;
  if (busy) return player?.sendMessage("§e[Landmarks] busy drawing or placing a landmark; try again in a few seconds.");
  const plan = loadPlan();
  const spot = plan.spots[key];
  if (!SPECS.some((s) => s.key === key) || !spot || spot.placed) return player?.sendMessage("§c[Landmarks] nothing to retry: " + key);
  if (spot.none) {
    delete plan.spots[key];
    delete plan.rejects?.[key]; // otherwise the next reject is already past MAX_REJECTS
  } else spot.tries = 0;
  drawAfter.delete(key);
  savePlan(plan);
  player?.sendMessage("§a[Landmarks] " + key + " unlocked.");
}

world.afterEvents.worldLoad.subscribe(() => {
  const site = loadPlan().spots.martial_arts_tournament;
  if (site?.placed && martialArtsMode() === "relative") applyMartialSite(site);

  system.runInterval(() => {
    try {
      scan();
    } catch (e) {
      console.warn("[Landmarks] scan error: " + e);
    }
  }, SCAN_TICKS);

  system.afterEvents.scriptEventReceive.subscribe((ev) => {
    const src = ev.sourceEntity;
    if (!src || src.typeId !== "minecraft:player") return;
    if (ev.id === "dbe:landmarks") report(src);
    else if (ev.id === "dbe:landmarks_retry") retry(src, ev.message.trim());
  });
});
