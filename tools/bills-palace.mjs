// Planeta do Bills, 1.7.19 (dec. 36): regrava as peças da ilha sem a árvore central.
//
// Uso:
//   node tools/bills-palace.mjs tree <pasta de saída>   bills_1..5 sem a árvore (pasta nova; conferida célula a célula)
//   node tools/bills-palace.mjs tree --check            só mede (blocos por peça), sem gravar
//   node tools/bills-palace.mjs tree-cells <pasta com as peças antigas> <saída.js>
//       lista exata das células da árvore (segmentos verticais por coluna) para a migração de scripts/bills_planet.js
//   node tools/bills-palace.mjs palace <modelo.json> <pasta de saída>
//       gera bills_palace_b (praça, terraço, lago) e bills_palace_a (palácio, escada até a sala) do modelo da Aquarela
//
// A árvore é achada por preenchimento a partir do tronco (TREE_SEED), passando só por blocos de TREE_TYPES de y=140
// para cima: o teto da sala de jantar (y=136) também é de mangue e não pode sair. Na camada y=140 (a superfície da ilha)
// a árvore vira dbe:namek_grass; acima, ar. A mesma caixa e os mesmos tipos são usados pela migração em jogo de
// scripts/bills_planet.js: mudar os dois juntos.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readMcstructure, structureParts, writeMcstructureNew } from "./mcstructure.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "Dragon Universe_bp/structures/dbe/bills_planet");
// as peças de scripts/bills_planet.js: canto em X=-69, Y=60, Z=-53
const ORIGIN = { x: -69, y: 60, z: -53 };
const PIECES = [["bills_1", 0, 0], ["bills_2", 0, 64], ["bills_3", 64, 0], ["bills_4", 64, 64], ["bills_5", 128, 0]];

export const TREE_TYPES = ["minecraft:mangrove_wood", "minecraft:stripped_mangrove_wood", "minecraft:mangrove_roots", "minecraft:crimson_hyphae",
  "minecraft:stripped_crimson_hyphae", "minecraft:mangrove_log", "minecraft:dark_oak_wood", "minecraft:dark_oak_log", "minecraft:mud"];
export const TREE_SEED = { x: -8, y: 142, z: 1 };
export const TREE_FLOOR_Y = 140; // superfície da ilha
export const TREE_BOX = { from: { x: -34, y: 140, z: -25 }, to: { x: 18, y: 186, z: 27 } }; // medida: o preenchimento cabe aqui
const GROUND = "dbe:namek_grass";

const field = (e, k) => e.find(([n]) => n.v === k)?.[1];

function loadIsland(dir = DIR) {
  return PIECES.map(([name, dx, dz]) => {
    const root = readMcstructure(path.join(dir, name + ".mcstructure"));
    const parts = structureParts(root);
    const names = parts.palette.v.items.map((e) => field(e, "name").v.v);
    return { name, root, parts, names, x: ORIGIN.x + dx, y: ORIGIN.y, z: ORIGIN.z + dz };
  });
}

function locate(island, x, y, z) {
  for (const p of island) {
    const [sx, sy, sz] = p.parts.size;
    const lx = x - p.x, ly = y - p.y, lz = z - p.z;
    if (lx < 0 || ly < 0 || lz < 0 || lx >= sx || ly >= sy || lz >= sz) continue;
    return { p, i: (lx * sy + ly) * sz + lz };
  }
}
const nameAt = (island, x, y, z) => {
  const l = locate(island, x, y, z);
  if (!l) return undefined;
  const v = l.p.parts.layers[0][l.i];
  return v < 0 ? undefined : l.p.names[v];
};

/** Células da árvore: [x, y, z] no mundo. */
export function treeCells(island) {
  const types = new Set(TREE_TYPES);
  const key = (x, y, z) => x + "," + y + "," + z;
  if (!types.has(nameAt(island, TREE_SEED.x, TREE_SEED.y, TREE_SEED.z))) throw new Error("o tronco não está em TREE_SEED");
  const seen = new Set([key(TREE_SEED.x, TREE_SEED.y, TREE_SEED.z)]), out = [], stack = [[TREE_SEED.x, TREE_SEED.y, TREE_SEED.z]];
  while (stack.length) {
    const [x, y, z] = stack.pop();
    out.push([x, y, z]);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const n = [x + dx, y + dy, z + dz];
      if (n[1] < TREE_FLOOR_Y || seen.has(key(...n))) continue;
      seen.add(key(...n));
      if (types.has(nameAt(island, ...n))) stack.push(n);
    }
  }
  for (const [x, y, z] of out) {
    const { from, to } = TREE_BOX;
    if (x < from.x || x > to.x || y < from.y || y > to.y || z < from.z || z > to.z) throw new Error("a árvore passa de TREE_BOX em " + [x, y, z]);
  }
  return out;
}

function entryIndex(p, name) {
  const entries = p.parts.palette.v.items;
  let i = entries.findIndex((e) => field(e, "name").v.v === name && !field(e, "states").v.length);
  if (i < 0) throw new Error(p.name + ": sem entrada " + name + " na paleta");
  return i;
}

function treeCommand(out) {
  const island = loadIsland();
  const cells = treeCells(island);
  const changed = new Map(island.map((p) => [p, new Set()]));
  for (const [x, y, z] of cells) {
    const { p, i } = locate(island, x, y, z);
    const to = y === TREE_FLOOR_Y ? GROUND : "minecraft:air";
    p.parts.layers[0][i] = entryIndex(p, to);
    for (const layer of p.parts.layers.slice(1)) layer[i] = -1; // nada alagado onde a árvore estava
    changed.get(p).add(i);
  }
  let total = 0;
  for (const p of island) {
    const set = changed.get(p);
    if (p.parts.positionData && set.size) p.parts.positionData.v = p.parts.positionData.v.filter(([k]) => !set.has(Number(k.v)));
    // conferência contra a original relida do disco: só as células da árvore mudaram, e para o bloco certo
    const orig = structureParts(readMcstructure(path.join(DIR, p.name + ".mcstructure")));
    const origNames = orig.palette.v.items.map((e) => field(e, "name").v.v);
    const [sx, sy, sz] = orig.size;
    for (let l = 0; l < orig.layers.length; l++) {
      for (let i = 0; i < orig.layers[l].length; i++) {
        const a = orig.layers[l][i], b = p.parts.layers[l][i];
        if (a === b) continue;
        if (!set.has(i)) throw new Error(p.name + ": mudou fora da árvore, célula " + i);
        if (l === 0 && !TREE_TYPES.includes(origNames[a])) throw new Error(p.name + ": célula " + i + " não era da árvore (" + origNames[a] + ")");
      }
    }
    if (p.parts.entities.v.items.length !== orig.entities.v.items.length) throw new Error(p.name + ": entidades mudaram");
    console.log(p.name + ": " + set.size + " bloco(s) da árvore");
    total += set.size;
    if (out && set.size) writeMcstructureNew(path.join(out, p.name + ".mcstructure"), p.root);
  }
  console.log("árvore: " + cells.length + " blocos (" + total + " trocados)");
}

/** Segmentos [x, z, y0, y1] (y1 inclusive) das células da árvore, em ordem; a camada y=140 fica num segmento próprio. */
function treeCellsCommand(dir, out) {
  const cells = treeCells(loadIsland(dir));
  const cols = new Map();
  for (const [x, y, z] of cells) {
    const k = x + "," + z;
    if (!cols.has(k)) cols.set(k, []);
    cols.get(k).push(y);
  }
  const runs = [];
  for (const [k, ys] of [...cols].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const [x, z] = k.split(",").map(Number);
    ys.sort((a, b) => a - b);
    let y0 = ys[0], prev = ys[0];
    const flush = () => runs.push([x, z, y0, prev]);
    for (const y of ys.slice(1)) {
      if (y === prev + 1 && prev !== TREE_FLOOR_Y) prev = y;
      else { flush(); y0 = prev = y; }
    }
    flush();
  }
  const total = runs.reduce((n, [, , a, b]) => n + b - a + 1, 0);
  if (total !== cells.length) throw new Error("segmentos não somam as células");
  if (fs.existsSync(out)) throw new Error("o destino já existe: " + out);
  const text = "// Gerado por tools/bills-palace.mjs tree-cells (não editar à mão): as " + cells.length + " células da árvore central do\n" +
    "// planeta do Bills, como segmentos verticais [x, z, yDe, yAté], para a migração de scripts/bills_planet.js.\n" +
    "export const BILLS_TREE_TYPES = " + JSON.stringify(TREE_TYPES_FOUND(loadIsland(dir), cells)) + ";\n" +
    "export const BILLS_TREE_RUNS = [\n" + runs.map((r) => "  [" + r.join(",") + "],").join("\n") + "\n];\n";
  fs.writeFileSync(out, text, { flag: "wx" });
  console.log(out + ": " + runs.length + " segmentos, " + cells.length + " células");
}

/** Os tipos que as células da árvore têm de fato (o filtro da migração usa só estes). */
function TREE_TYPES_FOUND(island, cells) {
  return [...new Set(cells.map(([x, y, z]) => nameAt(island, x, y, z)))].sort();
}

// ---------------------------------------------------------------- palácio (layout confirmado em 2026-11-22)
// Modelo da Aquarela (planos/palacio_bills_modelo.json): x 0..44 oeste->leste, y 0..47, z 0..59 norte->sul, centro (22,·,22).
// No mundo: centro em (0, 0), y 0 = 140 (a superfície). Mudanças sobre o modelo:
// - terraço, mesa, assentos e postes 7 blocos a leste (x 0..14), para não tampar a saída atual da sala (x -7..-3, z 18..23);
// - lago espelhado para oeste e 2 blocos mais para fora (x -24..-10), longe do anel e da saída;
// - sem o caminho de quartzo (a entrada é a saída da sala, com o arco) e sem vitórias-régias (id não confirmado);
// - a praça mantém como está a caixa da saída (abertura, borda e as 4 lanternas): x -8..-2, z 17..22;
// - escada interna: 3 de largura (z 8..10), desce para oeste do piso do palácio (y 141, x 14) até o salão (x 2, y 130);
// - luz invisível no meio de cada andar oco (para não nascer mob no escuro).
const P = { cx: 22, cz: 22, y: 140 };
export const PALACE_PIECES = {
  b: { id: "bills_palace_b", from: { x: -24, y: 140, z: -22 }, to: { x: 22, y: 142, z: 27 } },
  a: { id: "bills_palace_a", from: { x: -15, y: 130, z: -15 }, to: { x: 15, y: 187, z: 15 } },
};
const EXIT_BOX = { x0: -8, x1: -2, z0: 17, z1: 22 };
const STAIR = { z0: 8, z1: 10, top: 14, steps: 11 }; // degrau k (1..11): bloco em (14 - k, 141 - k); chega ao salão em x 2
const SOUTH = new Set(["quartz_bricks", "smooth_quartz", "quartz_pillar", "quartz_slab_top", "purple_wool", "light_blue_wool", "water", "prismarine_bricks", "lily_pad"]);
const S = (v) => ({ t: 8, v: { v: v } }), I = (v) => ({ t: 3, v }), B = (v) => ({ t: 1, v });
// estados canônicos (os mesmos das peças do pacote em 1.21.60.33)
const STATES = {
  purpur_block: [["pillar_axis", S("y")]], smooth_quartz: [["pillar_axis", S("y")]], quartz_pillar: [["pillar_axis", S("y")]],
  stripped_dark_oak_log: [["pillar_axis", S("y")]], water: [["liquid_depth", I(0)]], end_rod: [["facing_direction", I(1)]],
  quartz_slab_top: [["minecraft:vertical_half", S("top")]],
  stair: [["minecraft:corner", S("none")], ["upside_down_bit", B(0)], ["weirdo_direction", I(0)]], // sobe para leste
};
const NAME = { quartz_slab_top: "minecraft:quartz_slab", stair: "minecraft:smooth_sandstone_stairs", light: "minecraft:light_block_15", air: "minecraft:air" };
const VERSION = 18168865;

export function palaceCells(model) {
  const b = new Map(), a = new Map(); // "x,y,z" (mundo) -> bloco do modelo ("air", "stair", "light" ou nome sem namespace)
  const put = (map, x, y, z, block) => map.set(x + "," + y + "," + z, block);
  const inPalace = (x, z) => Math.abs(x) <= 15 && Math.abs(z) <= 15;
  const plaza = new Map(model.cells.filter(([, y]) => y === 0).map(([x, , z, bl]) => [x + "," + z, bl]));
  for (const [mx, my, mz, bl] of model.cells) {
    if (mx === undefined) continue;
    let x = mx - P.cx, z = mz - P.cz;
    const y = P.y + my;
    const south = mz >= 40 && (SOUTH.has(bl) || (bl === "end_rod" && my <= 2));
    if (south) {
      if (bl === "lily_pad") continue;
      if (bl === "water" || bl === "prismarine_bricks") x = (44 - mx) - P.cx - 2; // lago espelhado para oeste
      else if (mz <= 48) x += 7; // terraço, mesa, assentos, postes
      else continue; // caminho de quartzo
      put(b, x, y, z, bl);
      continue;
    }
    if (my >= 1 && inPalace(x, z)) put(a, x, y, z, bl);
    else put(b, x, y, z, bl);
  }
  // praça onde o terraço/lago saíram: o desenho espelhado em z (a borda norte da praça)
  for (const [mx, my, mz, bl] of model.cells) {
    if (my !== 0 || mz < 40 || mz > 44 || !SOUTH.has(bl)) continue;
    const x = mx - P.cx, z = mz - P.cz, k = x + ",140," + z;
    if (b.get(k) === undefined || SOUTH.has(b.get(k)) === false) { /* já preenchido */ }
    const mirror = plaza.get(mx + "," + (44 - mz));
    if (!b.has(k) || b.get(k) === bl) put(b, x, 140, z, mirror);
  }
  // terraço e lago por cima da praça: refaz na ordem certa (o que veio do sul ganha)
  for (const [mx, my, mz, bl] of model.cells) {
    if (!(mz >= 40 && (SOUTH.has(bl) || (bl === "end_rod" && my <= 2))) || bl === "lily_pad") continue;
    let x = mx - P.cx; const z = mz - P.cz;
    if (bl === "water" || bl === "prismarine_bricks") x = (44 - mx) - P.cx - 2;
    else if (mz <= 48) x += 7;
    else continue;
    put(b, x, P.y + my, z, bl);
  }
  // a saída da sala fica como está
  for (const k of [...b.keys()]) {
    const [x, y, z] = k.split(",").map(Number);
    if (y === 140 && x >= EXIT_BOX.x0 && x <= EXIT_BOX.x1 && z >= EXIT_BOX.z0 && z <= EXIT_BOX.z1) b.delete(k);
  }
  // escada interna: o vão (ar) e os degraus; a praça não cobre o vão
  for (let k = 1; k <= STAIR.steps; k++) {
    const x = STAIR.top - k;
    for (let z = STAIR.z0; z <= STAIR.z1; z++) {
      for (let y = 142 - k; y <= 141; y++) put(a, x, y, z, "air");
      put(a, x, 141 - k, z, "stair");
      for (let y = 140; y <= 141; y++) b.delete(x + "," + y + "," + z);
    }
  }
  // luz nos andares ocos (no ar do modelo, longe da escada)
  const levels = [[143, 7], [149, 6], [155, 4], [161, 3], [167, 0], [175, 0]];
  for (const [y, q] of levels) {
    for (const [dx, dz] of q ? [[-q, -q], [-q, q], [q, -q], [q, q], [0, 0]] : [[0, 0]]) {
      const k = dx + "," + y + "," + dz;
      if (!a.has(k) && !(dz >= STAIR.z0 - 1 && dz <= STAIR.z1 + 1 && dx >= 2)) put(a, dx, y, dz, "light");
    }
  }
  return { a, b };
}

function entryFor(block) {
  const name = NAME[block] ?? "minecraft:" + block;
  const states = STATES[block] ?? [];
  return [[{ v: "name" }, S(name)], [{ v: "states" }, { t: 10, v: states.map(([k, n]) => [{ v: k }, n]) }], [{ v: "version" }, I(VERSION)]];
}

function buildPiece(template, piece, cells) {
  const root = readMcstructure(template);
  const parts = structureParts(root);
  const sx = piece.to.x - piece.from.x + 1, sy = piece.to.y - piece.from.y + 1, sz = piece.to.z - piece.from.z + 1;
  if (sx > 64 || sy > 64 || sz > 64) throw new Error(piece.id + ": maior que 64 num eixo");
  const field2 = (node, k) => node.v.find(([n]) => n.v === k)?.[1];
  field2(root, "size").v.items = Int32Array.of(sx, sy, sz);
  field2(root, "structure_world_origin").v.items = Int32Array.of(0, 0, 0);
  const n = sx * sy * sz;
  const indices = field2(parts.structure, "block_indices");
  const primary = new Int32Array(n).fill(-1), water = new Int32Array(n).fill(-1);
  const palette = [], index = new Map();
  for (const [k, block] of cells) {
    const [x, y, z] = k.split(",").map(Number);
    const lx = x - piece.from.x, ly = y - piece.from.y, lz = z - piece.from.z;
    if (lx < 0 || ly < 0 || lz < 0 || lx >= sx || ly >= sy || lz >= sz) throw new Error(piece.id + ": célula fora da peça " + k);
    if (!index.has(block)) { index.set(block, palette.length); palette.push(entryFor(block)); }
    primary[(lx * sy + ly) * sz + lz] = index.get(block);
  }
  indices.v.items = indices.v.items.map((l, i) => (l instanceof Int32Array ? (i ? water : primary) : { et: l.et, items: i ? water : primary }));
  parts.palette.v.items = palette;
  if (parts.positionData) parts.positionData.v = [];
  parts.entities.v.items = [];
  return root;
}

function palaceCommand(modelFile, out) {
  const model = JSON.parse(fs.readFileSync(modelFile, "utf8"));
  const { a, b } = palaceCells(model);
  const template = path.join(DIR, "prop_cushion_1.mcstructure");
  for (const [piece, cells] of [[PALACE_PIECES.b, b], [PALACE_PIECES.a, a]]) {
    const root = buildPiece(template, piece, cells);
    const dest = path.join(out, piece.id + ".mcstructure");
    writeMcstructureNew(dest, root);
    // conferência: relida do disco, cada célula tem o bloco pedido e o resto é vazio
    const p = structureParts(readMcstructure(dest));
    const names = p.palette.v.items.map((e) => field(e, "name").v.v);
    const [sx, sy, sz] = p.size;
    let filled = 0;
    for (let i = 0; i < p.layers[0].length; i++) if (p.layers[0][i] >= 0) filled++;
    if (filled !== cells.size) throw new Error(piece.id + ": " + filled + " células, esperava " + cells.size);
    for (const [k, block] of cells) {
      const [x, y, z] = k.split(",").map(Number);
      const i = ((x - piece.from.x) * sy + (y - piece.from.y)) * sz + (z - piece.from.z);
      if (names[p.layers[0][i]] !== (NAME[block] ?? "minecraft:" + block)) throw new Error(piece.id + ": célula " + k);
    }
    const count = {};
    for (const block of cells.values()) count[block] = (count[block] ?? 0) + 1;
    console.log(piece.id + " " + sx + "x" + sy + "x" + sz + " em " + [piece.from.x, piece.from.y, piece.from.z].join(" ") + ": " + cells.size + " células " + JSON.stringify(count));
  }
}

function main(argv) {
  const [cmd, arg] = argv;
  if (cmd === "palace") {
    const [, modelFile, out] = argv;
    if (!out || fs.existsSync(out)) throw new Error("pasta de saída nova obrigatória");
    fs.mkdirSync(out, { recursive: true });
    palaceCommand(modelFile, out);
    return 0;
  }
  if (cmd === "tree-cells") {
    treeCellsCommand(argv[1], argv[2]);
    return 0;
  }
  if (cmd === "tree") {
    if (arg === "--check") return treeCommand(null), 0;
    if (!arg || fs.existsSync(arg)) throw new Error("pasta de saída nova obrigatória");
    fs.mkdirSync(arg, { recursive: true });
    treeCommand(arg);
    return 0;
  }
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).slice(0, 6).map((l) => l.slice(3)).join("\n"));
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error("erro: " + (e?.message ?? e));
    process.exitCode = 1;
  }
}
