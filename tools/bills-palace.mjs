// Planeta do Bills, 1.7.19 (dec. 36): regrava as peças da ilha sem a árvore central.
//
// Uso:
//   node tools/bills-palace.mjs tree <pasta de saída>   bills_1..5 sem a árvore (pasta nova; conferida célula a célula)
//   node tools/bills-palace.mjs tree --check            só mede (blocos por peça), sem gravar
//   node tools/bills-palace.mjs tree-cells <pasta com as peças antigas> <saída.js>
//       lista exata das células da árvore (segmentos verticais por coluna) para a migração de scripts/bills_planet.js
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

function main(argv) {
  const [cmd, arg] = argv;
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
