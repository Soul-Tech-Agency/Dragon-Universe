/**
 * Tournament of Power (dbe:tournament_of_power): a large fixed map in its own space dimension, by Ricardo Vinicius.
 * The pieces around the arrival point are placed before the player arrives and the rest as players come near.
 *
 * Travel: Tournament of Power Invitation (dbe:power_tournament_invitation, craftable): use it to go, use it again to return.
 *   /scriptevent dbe:tournament_of_power        -> go
 *   /scriptevent dbe:tournament_of_power_return -> go back
 *   /scriptevent dbe:tournament_of_power_rebuild -> place the whole arena again (operators; blocks built inside are lost)
 *
 * 1.7.18: the pieces were recolored offline (tools/tp-arena.mjs: light stone, gold ring, invisible light as structure void).
 * Worlds that already had pieces placed get them updated in place (migration below, dbe:top_palette = 2).
 */
import * as mc from "@minecraft/server";
import { createSpaceArena } from "./space_arena.js";

// Same table as tools/tp-arena.mjs (PALETTE, LIGHT, RING): change both together. new block <- old blocks
const RECOLOR = [
  ["minecraft:smooth_quartz", ["minecraft:white_terracotta", "minecraft:white_concrete"]],
  ["minecraft:polished_diorite", ["minecraft:light_gray_concrete", "minecraft:light_gray_terracotta", "minecraft:blue_terracotta"]],
  ["minecraft:calcite", ["minecraft:cyan_terracotta"]],
  ["minecraft:smooth_stone", ["minecraft:brown_terracotta", "minecraft:brown_concrete", "minecraft:hardened_clay", "minecraft:purple_terracotta"]],
  ["minecraft:polished_andesite", ["minecraft:gray_concrete", "minecraft:gray_terracotta", "minecraft:red_terracotta"]],
  ["minecraft:stone", ["minecraft:green_terracotta", "minecraft:lime_terracotta"]],
  ["minecraft:polished_deepslate", ["minecraft:black_concrete", "minecraft:black_terracotta", "minecraft:dark_prismarine"]],
  ["minecraft:air", ["minecraft:light_block_15"]],
];
const RING = { block: "minecraft:gold_block", cx: 2.5, cz: 8, r0: 21, r1: 24, y: 86 };
const FLOOR = new Set(RECOLOR.flatMap(([to, from]) => (to === "minecraft:air" ? [] : [to, ...from])));
const SLICE = 32; // fillBlocks volumes of at most 32x32x32

/**
 * Updates one placed piece: each color by a filtered fill, in small volumes (one native call per step of the job), then the
 * gold ring on the floor. Idempotent. A block of the same type a player put inside the arena is recolored too (rare).
 */
function* migratePiece(dim, p) {
  for (let x = p.x; x < p.x + p.sx; x += SLICE) {
    for (let y = p.y; y < p.y + p.sy; y += SLICE) {
      for (let z = p.z; z < p.z + p.sz; z += SLICE) {
        const volume = new mc.BlockVolume({ x, y, z }, {
          x: Math.min(x + SLICE, p.x + p.sx) - 1, y: Math.min(y + SLICE, p.y + p.sy) - 1, z: Math.min(z + SLICE, p.z + p.sz) - 1,
        });
        for (const [to, from] of RECOLOR) {
          dim.fillBlocks(volume, to, { blockFilter: { includeTypes: from } });
          yield;
        }
      }
    }
  }
  if (RING.y < p.y || RING.y >= p.y + p.sy) return;
  let n = 0;
  for (let x = p.x; x < p.x + p.sx; x++) {
    for (let z = p.z; z < p.z + p.sz; z++) {
      const r = Math.hypot(x + 0.5 - RING.cx, z + 0.5 - RING.cz);
      if (r < RING.r0 || r >= RING.r1) continue;
      const block = dim.getBlock({ x, y: RING.y, z });
      if (!block || !FLOOR.has(block.typeId) || !dim.getBlock({ x, y: RING.y + 1, z })?.isAir) continue;
      block.setType(RING.block);
      if (++n % 32 === 0) yield;
    }
  }
}

// [piece, x, y, z (lowest corner), size x, y, z]
const PIECES = [
  ["tp_xn3_y1_zn2",-136,99,-79,8,18,15],
  ["tp_xn3_y1_zn1",-151,87,-64,23,30,64],
  ["tp_xn3_y1_z0",-152,87,0,24,30,64],
  ["tp_xn3_y1_z1",-143,99,64,15,18,30],
  ["tp_xn2_y0_zn2",-92,48,-90,28,16,26],
  ["tp_xn2_y0_zn1",-117,21,-64,53,43,64],
  ["tp_xn2_y0_z0",-117,21,0,53,43,64],
  ["tp_xn2_y0_z1",-102,35,64,38,29,41],
  ["tp_xn2_y1_zn3",-74,99,-132,10,18,4],
  ["tp_xn2_y1_zn2",-128,64,-128,64,53,64],
  ["tp_xn2_y1_zn1",-128,64,-64,64,53,64],
  ["tp_xn2_y1_z0",-128,64,0,64,53,64],
  ["tp_xn2_y1_z1",-128,64,64,64,53,64],
  ["tp_xn2_y1_z2",-100,99,128,36,18,22],
  ["tp_xn1_yn1_zn1",-33,-21,-28,33,21,28],
  ["tp_xn1_yn1_z0",-34,-55,0,34,55,43],
  ["tp_xn1_y0_zn2",-64,22,-110,64,42,46],
  ["tp_xn1_y0_zn1",-64,0,-64,64,50,64],
  ["tp_xn1_y0_z0",-64,0,0,64,50,64],
  ["tp_xn1_y0_z1",-64,13,64,64,51,61],
  ["tp_xn1_y1_zn3",-64,99,-147,64,19,19],
  ["tp_xn1_y1_zn2",-64,64,-128,64,54,64],
  ["tp_xn1_y1_zn1",-64,86,-64,64,42,64],
  ["tp_xn1_y1_z0",-64,86,0,64,42,64],
  ["tp_xn1_y1_z1",-64,64,64,64,51,64],
  ["tp_xn1_y1_z2",-64,66,128,64,51,35],
  ["tp_xn1_y2_zn1",-13,128,-8,13,64,8],
  ["tp_xn1_y2_z0",-13,128,0,13,64,25],
  ["tp_xn1_y3_zn1",-12,192,-6,12,6,6],
  ["tp_xn1_y3_z0",-13,192,0,13,6,21],
  ["tp_x0_yn1_zn1",0,-22,-28,38,22,28],
  ["tp_x0_yn1_z0",0,-63,0,40,63,43],
  ["tp_x0_y0_zn2",0,22,-110,64,42,46],
  ["tp_x0_y0_zn1",0,0,-64,64,50,64],
  ["tp_x0_y0_z0",0,0,0,64,50,64],
  ["tp_x0_y0_z1",0,13,64,64,51,61],
  ["tp_x0_y1_zn3",0,99,-147,11,19,19],
  ["tp_x0_y1_zn2",0,64,-128,64,54,64],
  ["tp_x0_y1_zn1",0,86,-64,64,42,64],
  ["tp_x0_y1_z0",0,86,0,64,42,64],
  ["tp_x0_y1_z1",0,64,64,64,34,64],
  ["tp_x0_y1_z2",0,66,128,45,51,35],
  ["tp_x0_y2_zn1",0,128,-8,18,64,8],
  ["tp_x0_y2_z0",0,128,0,18,64,25],
  ["tp_x0_y3_zn1",0,192,-6,17,6,6],
  ["tp_x0_y3_z0",0,192,0,17,6,21],
  ["tp_x1_y0_zn2",64,45,-93,33,19,29],
  ["tp_x1_y0_zn1",64,13,-64,58,51,64],
  ["tp_x1_y0_z0",64,13,0,58,51,64],
  ["tp_x1_y0_z1",64,35,64,43,29,44],
  ["tp_x1_y1_zn2",64,64,-112,54,34,48],
  ["tp_x1_y1_zn1",64,64,-64,64,34,64],
  ["tp_x1_y1_z0",64,64,0,64,34,64],
  ["tp_x1_y1_z1",64,64,64,59,34,58],
  ["tp_x2_yn1_z2",156,-63,160,1,1,1],
  ["tp_x2_y1_zn1",128,77,-41,64,51,41],
  ["tp_x2_y1_z0",128,77,0,64,51,52],
  ["tp_x2_y2_zn1",147,128,-18,45,44,18],
  ["tp_x2_y2_z0",142,128,0,50,44,42],
  ["tp_x3_y1_zn1",192,107,-16,15,21,16],
  ["tp_x3_y1_z0",192,107,0,15,21,42],
  ["tp_x3_y2_zn1",192,128,-16,15,44,16],
  ["tp_x3_y2_z0",192,128,0,15,44,42],
].map(([name, x, y, z, sx, sy, sz]) => ({ id: "dbe:tournament_of_power/" + name, x, y, z, sx, sy, sz }));

createSpaceArena({
  label: "the Tournament of Power",
  dimId: "dbe:tournament_of_power",
  item: "dbe:power_tournament_invitation",
  events: { go: "dbe:tournament_of_power", back: "dbe:tournament_of_power_return", rebuild: "dbe:tournament_of_power_rebuild" },
  spawn: { x: 0.5, y: 87, z: 0.5 }, // the map floor is at y = 86
  fogTag: "dbe_tournament_of_power",
  originProp: "dbe:top_origin",
  stateProp: "dbe:top_pieces",
  fallY: -68,
  pieces: PIECES,
  arrivalRadius: 40,
  // In the map this column holds only invisible light blocks; players may also place blocks here.
  arrivalClear: { height: 2 },
  loadRadius: 96,
  protectBlocks: true,
  removeMobs: true,
  migration: { prop: "dbe:top_palette", version: 2, piece: migratePiece },
});
