/**
 * Bills' planet (dbe:bills_planet): one fixed build floating in its own space dimension.
 * The whole build is placed before the first arrival.
 *
 * Travel: Bills Invitation (dbe:bills_invitation, craftable): use it to go, use it again inside to return.
 *   /scriptevent dbe:bills_planet        -> go
 *   /scriptevent dbe:bills_planet_return -> go back
 *   /scriptevent dbe:bills_planet_rebuild -> place the build again (operators; run it twice within 10 s to confirm)
 *
 * Bills, Whis, the table cushions and the aquarium fish are residents (world_residents.js), not saved in the pieces, so a
 * rebuild never doubles them.
 */
import * as mc from "@minecraft/server";
import { createSpaceArena } from "./space_arena.js";
import { BILLS_TREE_RUNS, BILLS_TREE_TYPES } from "./data/bills_tree_cells.js";

/**
 * 1.7.19 (dec. 36/37a): the central tree left the pieces (tools/bills-palace.mjs). In worlds where the island was already
 * placed, it is removed in place, once (dbe:bills_planet_version = 2): only the exact cells the tree had (9,780, from the
 * old pieces), and in each cell only if it still holds one of the tree's block types, so a block a player put there stays
 * and nothing outside those cells (the dining room ceiling, the mangrove arch at the exit) is touched. The surface cells
 * (y = 140) become grass. The palace pieces wait for this (afterMigration).
 */
const TREE_GROUND_Y = 140;
function* removeTree(dim, p) {
  let n = 0;
  for (const [x, z, y0, y1] of BILLS_TREE_RUNS) {
    if (x < p.x || x >= p.x + p.sx || z < p.z || z >= p.z + p.sz) continue;
    const volume = new mc.BlockVolume({ x, y: y0, z }, { x, y: y1, z });
    dim.fillBlocks(volume, y0 === TREE_GROUND_Y ? "dbe:namek_grass" : "minecraft:air", { blockFilter: { includeTypes: BILLS_TREE_TYPES } });
    if (++n % 16 === 0) yield;
  }
}

const X = -69, Y = 60, Z = -53;
const piece = (n, dx, dz, sx, sz) => ({ id: "dbe:bills_planet/bills_" + n, x: X + dx, y: Y, z: Z + dz, sx, sy: 134, sz });

createSpaceArena({
  label: "Bills' planet",
  dimId: "dbe:bills_planet",
  item: "dbe:bills_invitation",
  events: { go: "dbe:bills_planet", back: "dbe:bills_planet_return", rebuild: "dbe:bills_planet_rebuild" },
  spawn: { x: 0.5, y: 130, z: 1.5 }, // on the planks at build offset (69, 69, 54)
  arrivalClear: { height: 2 },
  arrivalFloor: "minecraft:dark_oak_planks",
  fogTag: "dbe_bills_planet",
  originProp: "dbe:bills_origin",
  stateProp: "dbe:bills_planet_pieces",
  fallY: 20,
  migration: { prop: "dbe:bills_planet_version", version: 2, piece: removeTree },
  pieces: [piece(1, 0, 0, 64, 64), piece(2, 0, 64, 64, 42), piece(3, 64, 0, 64, 64), piece(4, 64, 64, 64, 42), piece(5, 128, 0, 10, 64),
    // 1.7.19 palace (tools/bills-palace.mjs palace): plaza, terrace and pond, then the palace with the stairs down to the
    // dining room. Only after the tree migration and the whole island (afterMigration), so it never goes down cut.
    { id: "dbe:bills_planet/bills_palace_b", x: -24, y: 140, z: -22, sx: 47, sy: 3, sz: 50, afterMigration: true },
    { id: "dbe:bills_planet/bills_palace_a", x: -15, y: 130, z: -15, sx: 31, sy: 58, sz: 31, afterMigration: true }],
  arrivalRadius: 1000,
  rebuildWarning: "the whole planet is placed again: whatever players built, broke or changed on it goes back to the original (built blocks are lost).",
  loadRadius: 1000,
});
