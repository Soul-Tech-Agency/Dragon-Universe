/**
 * Fixed residents: NPCs that live in one place of the world, one of each, put there by script (never inside a .mcstructure,
 * where a rebuild would copy them again).
 *
 * FIXED RULE: the id of a resident is a save key. It becomes the tag "dbe_resident:<id>" written on the entity, and that tag
 * is the only record that the resident exists. Never rename an id. If it ever has to change, put the old one in formerIds:
 * entities with the old tag are adopted and get the new one.
 *
 * Nothing is saved in the world: the truth is "an entity of this type with this tag exists". The cycle only acts with a
 * player near and the whole radius loaded (a copy may be in a chunk that is not loaded yet), never loads an area itself,
 * removes extra copies (the oldest one stays) and puts a pushed resident back in place.
 *
 *   /scriptevent dbe:residents -> list the residents and their state
 */
import * as mc from "@minecraft/server";
import { areaReady } from "./travel_safety.js";

const { world, system } = mc;

const TAG = "dbe_resident:";
const PER_CALL = 2; // residents processed per call, in turns
const AFTER_SPAWN = 200; // ticks before a resident just created is looked at again (the core sets it up 20 ticks after the spawn)
const BRAKE_COUNT = 5; // more creations than this of the same resident inside BRAKE_WINDOW stop the creations until it empties
const BRAKE_WINDOW = 12000; // 10 min
const SETTLE = 60; // ticks the area must stay ready, with a player near, before a missing resident is created
const DRIFT = 3; // blocks away from its place before a resident is moved back

/**
 * Bills and Whis, at the free side of the table with the cake in the dining room of the planet (bills_3: dark oak floor at
 * y=129, table at z=-13, ~12 blocks from the arrival). Changes when the palace exists.
 */
const BILLS_SPOTS = {
  beerus: { x: -2.5, y: 130, z: -10.5, yaw: 180 },
  whis: { x: 0.5, y: 130, z: -10.5, yaw: 180 },
};

const residents = [];
const types = new Set();
const states = new Map(); // id -> { readySince, waitUntil, status, spawns: [tick], created: [entity id] }
const urgent = new Set(); // ids whose copy just loaded: looked at first
let turn = 0;

/**
 * Registers a resident (on module load; the order does not matter).
 * { id, formerIds?, type, dim, at: pos | () => pos | undefined, yaw?, radius?, near?, drift?, adopt?, enabled?, onPresent? }
 * at as a function: a place that depends on a landmark spot (undefined = not there yet).
 * adopt: an entity of the same type without the tag inside the radius becomes the resident instead of a new one.
 */
export function addResident(def) {
  if (residents.some((r) => r.id === def.id)) throw new Error("[Residents] duplicate id " + def.id);
  residents.push({ formerIds: [], yaw: 0, radius: 24, near: 48, drift: DRIFT, adopt: false, ...def });
  types.add(def.type);
}

const stateOf = (id) => {
  let st = states.get(id);
  if (!st) states.set(id, (st = { readySince: undefined, waitUntil: 0, status: "waiting", spawns: [], created: [] }));
  return st;
};

const placeOf = (r) => (typeof r.at === "function" ? r.at() : r.at);

function idle(st, status) {
  st.readySince = undefined;
  st.status = status;
}

/** Copies with the tag (or a former one, tagged again now) in the loaded part of the whole dimension. */
function copiesOf(dim, r) {
  const tag = TAG + r.id;
  const copies = dim.getEntities({ type: r.type, tags: [tag] });
  for (const old of r.formerIds) {
    for (const entity of dim.getEntities({ type: r.type, tags: [TAG + old] })) {
      entity.removeTag(TAG + old);
      entity.addTag(tag);
      copies.push(entity);
      console.warn("[Residents] " + r.id + ": adopted a copy tagged " + old);
    }
  }
  return copies;
}

function adoptable(dim, r, at) {
  let best, bestDist = Infinity;
  for (const entity of dim.getEntities({ type: r.type, location: at, maxDistance: r.radius })) {
    if (entity.getTags().some((t) => t.startsWith(TAG)) || entity.getDynamicProperty("dbe:spawned_by") !== undefined) continue;
    const d = distance(entity.location, at);
    if (d < bestDist) (best = entity), (bestDist = d);
  }
  return best;
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/** The saved original (not created in this session) closest to its place; if all are new, the first one created. */
function oldest(copies, at, st) {
  const saved = copies.filter((e) => !st.created.includes(e.id));
  if (saved.length) return saved.reduce((a, b) => (distance(b.location, at) < distance(a.location, at) ? b : a));
  return copies.reduce((a, b) => (st.created.indexOf(b.id) < st.created.indexOf(a.id) ? b : a));
}

function step(r, players) {
  const st = stateOf(r.id);
  const now = system.currentTick;
  if (now < st.waitUntil) return;
  if (r.enabled && !r.enabled()) return idle(st, "disabled");
  const spot = placeOf(r);
  if (!spot) return idle(st, "no site");
  const at = { x: spot.x, y: spot.y, z: spot.z };
  if (!players.some((p) => Math.hypot(p.location.x - at.x, p.location.z - at.z) <= r.near)) return idle(st, "no player near");
  const dim = world.getDimension(r.dim);
  if (!areaReady(dim, { x: at.x - r.radius, y: at.y, z: at.z - r.radius }, { x: at.x + r.radius, y: at.y, z: at.z + r.radius }))
    return idle(st, "not loaded");
  const floor = dim.getBlock({ x: Math.floor(at.x), y: Math.floor(at.y) - 1, z: Math.floor(at.z) });
  if (!floor?.isSolid) return idle(st, "no floor");
  st.readySince ??= now;

  const copies = copiesOf(dim, r);
  let entity;
  if (!copies.length) {
    entity = r.adopt ? adoptable(dim, r, at) : undefined;
    if (entity) {
      entity.addTag(TAG + r.id);
      console.warn("[Residents] " + r.id + ": adopted the " + r.type + " already there");
    } else {
      // entities of a chunk may show up some ticks after its blocks: waiting SETTLE ticks of ready area before creating
      // avoids a copy next to the saved one on arrival
      if (now - st.readySince < SETTLE) return void (st.status = "waiting");
      st.spawns = st.spawns.filter((t) => now - t < BRAKE_WINDOW);
      if (st.spawns.length >= BRAKE_COUNT) {
        if (st.status !== "stopped") console.warn("[Residents] " + r.id + ": created " + st.spawns.length + "x in 10 min; creation stopped for now");
        return void (st.status = "stopped");
      }
      entity = dim.spawnEntity(r.type, at);
      entity.addTag(TAG + r.id);
      entity.setRotation({ x: 0, y: r.yaw });
      st.spawns.push(now);
      st.created.push(entity.id);
      st.waitUntil = now + AFTER_SPAWN;
      st.status = "ok";
      console.warn("[Residents] " + r.id + ": created at " + [at.x, at.y, at.z].join(" "));
      r.onPresent?.(entity);
      return;
    }
  } else {
    // adopt: the saved one (no tag) may have loaded after a copy was created here; it is adopted as the saved original and
    // the copy created in this session goes away below
    const saved = r.adopt ? adoptable(dim, r, at) : undefined;
    if (saved) {
      saved.addTag(TAG + r.id);
      copies.push(saved);
      console.warn("[Residents] " + r.id + ": adopted the " + r.type + " already there, next to a copy");
    }
    entity = oldest(copies, at, st);
    const extra = copies.filter((e) => e !== entity);
    for (const e of extra) e.remove();
    if (extra.length) console.warn("[Residents] " + r.id + ": removed duplicate x" + extra.length);
  }
  if (distance(entity.location, at) > r.drift) entity.teleport(at, { rotation: { x: 0, y: r.yaw } });
  st.status = "ok";
  r.onPresent?.(entity);
}

/** One step of the cycle: at most PER_CALL residents of dimensions with players, in turns; a copy that just loaded goes first. */
export function tickResidents() {
  if (!residents.length) return;
  const playersOf = new Map();
  const players = (dimId) => {
    if (!playersOf.has(dimId)) {
      let list = [];
      try {
        list = world.getDimension(dimId).getPlayers();
      } catch {}
      playersOf.set(dimId, list);
    }
    return playersOf.get(dimId);
  };
  const queue = [...urgent].map((id) => residents.find((r) => r.id === id)).filter(Boolean);
  urgent.clear();
  const start = turn;
  for (let i = 0; i < residents.length; i++) queue.push(residents[(start + i) % residents.length]);
  const seen = new Set();
  let done = 0;
  for (const r of queue) {
    if (done >= PER_CALL) break;
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    turn = (residents.indexOf(r) + 1) % residents.length; // the next call goes on after the last one looked at
    const list = players(r.dim);
    if (!list.length) {
      idle(stateOf(r.id), "no player near"); // a dimension without players costs nothing
      continue;
    }
    done++;
    try {
      step(r, list);
    } catch (e) {
      console.warn("[Residents] " + r.id + ": " + e);
    }
  }
}

/** For the debug command: id, type, dimension, place, state and creations in the last 10 min. */
export function residentsSummary() {
  const now = system.currentTick;
  return residents.map((r) => {
    const st = stateOf(r.id);
    let at;
    try {
      at = placeOf(r);
    } catch {}
    return { id: r.id, type: r.type, dim: r.dim, at, state: st.status, recentSpawns: st.spawns.filter((t) => now - t < BRAKE_WINDOW).length };
  });
}

function report(player) {
  player.sendMessage("§e[Residents]");
  for (const s of residentsSummary()) {
    const where = s.at ? " §f" + [s.at.x, s.at.y, s.at.z].map((v) => Math.floor(v)).join(" ") : "";
    const color = s.state === "ok" ? "§a" : s.state === "stopped" ? "§c" : "§6";
    player.sendMessage(" §b" + s.id + " §7(" + s.type + ", " + s.dim + ")" + where + " " + color + s.state + (s.recentSpawns ? " §7(created " + s.recentSpawns + "x in 10 min)" : ""));
  }
}

addResident({ id: "bills_beerus", type: "dbe:beerus", dim: "dbe:bills_planet", at: BILLS_SPOTS.beerus, yaw: BILLS_SPOTS.beerus.yaw });
addResident({ id: "bills_whis", type: "dbe:whis", dim: "dbe:bills_planet", at: BILLS_SPOTS.whis, yaw: BILLS_SPOTS.whis.yaw });

// The fish of the aquarium next to the dining room (water at x -5..-3, z -21..-18, y 131..133; bills_1/bills_3). They were
// saved in bills_3 and doubled on every rebuild; now they are residents. adopt: in older worlds the fish already in the
// tank are adopted instead of new ones being created (radius 4 keeps it to the tank). drift: they swim, so only one that
// left the tank is put back.
const AQUARIUM = [
  ["bills_fish_tropical_1", "minecraft:tropicalfish", -4.5, -20.5],
  ["bills_fish_tropical_2", "minecraft:tropicalfish", -4.5, -18.5],
  ["bills_fish_tropical_3", "minecraft:tropicalfish", -2.5, -20.5],
  ["bills_fish_puffer", "minecraft:pufferfish", -3.5, -19.5],
  ["bills_fish_oracle", "dbe:giant_fish", -6.5, -19.5],
];
for (const [id, type, x, z] of AQUARIUM)
  addResident({ id, type, dim: "dbe:bills_planet", at: { x, y: 131, z }, radius: 4, drift: 5, adopt: true });

world.afterEvents.entityLoad.subscribe(({ entity }) => {
  try {
    if (!types.has(entity.typeId)) return; // filter by type before reading tags: this event fires for every entity
    // an entity of an adopting resident's type may be the saved original without a tag yet
    for (const r of residents) if (r.adopt && r.type === entity.typeId) urgent.add(r.id);
    for (const tag of entity.getTags()) {
      if (!tag.startsWith(TAG)) continue;
      const id = tag.slice(TAG.length);
      const r = residents.find((x) => x.id === id || x.formerIds.includes(id));
      if (r) urgent.add(r.id);
    }
  } catch {}
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id !== "dbe:residents") return;
  const src = ev.sourceEntity;
  if (src?.typeId === "minecraft:player") report(src);
});

world.afterEvents.worldLoad.subscribe(() => system.runInterval(tickResidents, 20)); // the single scheduler (O3) swaps this line
