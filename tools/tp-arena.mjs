// Arena do Torneio do Poder: regrava as 63 peças com a paleta clara (dec. 34/35), a luz invisível como vazio de estrutura
// e o anel dourado em volta do centro. Só muda block_palette e block_indices: tamanho, coordenadas, entidades e block
// entities ficam iguais.
//
// Uso:
//   node tools/tp-arena.mjs <pasta de saída>      grava as peças novas na pasta (que não pode existir) e confere cada uma
//   node tools/tp-arena.mjs --check               só confere as peças atuais do pacote (relatório, sem gravar)
//
// Depois de conferir, copiar a pasta de saída por cima de "Dragon Universe_bp/structures/dbe/tournament_of_power/".
// A mesma tabela (PALETTE, RING) é usada pela migração em jogo de scripts/tournament_of_power.js: mudar as duas juntas.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readMcstructure, structureParts, writeMcstructureNew } from "./mcstructure.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "Dragon Universe_bp/structures/dbe/tournament_of_power");
const SCRIPT = path.join(ROOT, "Dragon Universe_bp/scripts/tournament_of_power.js");

// Paleta final da Aquarela (planos/PALACIO_BILLS_ARENA_TP.md). Os nomes de destino já são os achatados e as peças têm
// version 1.21.60.33 (18168865), que os conhece. states: os do bloco canônico (smooth_quartz tem pillar_axis).
export const PALETTE = {
  "minecraft:white_terracotta": "minecraft:smooth_quartz",
  "minecraft:white_concrete": "minecraft:smooth_quartz",
  "minecraft:light_gray_concrete": "minecraft:polished_diorite",
  "minecraft:light_gray_terracotta": "minecraft:polished_diorite",
  "minecraft:blue_terracotta": "minecraft:polished_diorite",
  "minecraft:cyan_terracotta": "minecraft:calcite",
  "minecraft:brown_terracotta": "minecraft:smooth_stone",
  "minecraft:brown_concrete": "minecraft:smooth_stone",
  "minecraft:hardened_clay": "minecraft:smooth_stone",
  "minecraft:purple_terracotta": "minecraft:smooth_stone",
  "minecraft:gray_concrete": "minecraft:polished_andesite",
  "minecraft:gray_terracotta": "minecraft:polished_andesite",
  "minecraft:red_terracotta": "minecraft:polished_andesite",
  "minecraft:green_terracotta": "minecraft:stone",
  "minecraft:lime_terracotta": "minecraft:stone",
  "minecraft:black_concrete": "minecraft:polished_deepslate",
  "minecraft:black_terracotta": "minecraft:polished_deepslate",
  "minecraft:dark_prismarine": "minecraft:polished_deepslate",
};
const STATES = { "minecraft:smooth_quartz": [["pillar_axis", "y"]] };
export const LIGHT = "minecraft:light_block_15"; // vira vazio de estrutura (-1): a colocação pula essas células
// Anel dourado (dec. 34): gold_block no piso (y=86, o bloco mais alto de cada coluna da faixa) com 21 <= r < 24 do centro.
export const RING = { block: "minecraft:gold_block", cx: 2.5, cz: 8, r0: 21, r1: 24, y: 86 };
const VERSION = 18168865;

const T = { INT: 3, STRING: 8, COMPOUND: 10 };
const str = (s) => ({ v: s });
const field = (entry, name) => entry.find(([k]) => k.v === name)?.[1];
const keyOf = (entry) => field(entry, "name").v.v + JSON.stringify(field(entry, "states").v.map(([k, n]) => [k.v, n.t, n.t === T.STRING ? n.v.v : n.v])) + field(entry, "version")?.v;

export function readPieces() {
  const src = fs.readFileSync(SCRIPT, "utf8");
  return [...src.matchAll(/\["(tp_[^"]+)",(-?\d+),(-?\d+),(-?\d+),(\d+),(\d+),(\d+)\]/g)].map((m) => ({ name: m[1], x: +m[2], y: +m[3], z: +m[4] }));
}

const inRing = (wx, wz) => {
  const r = Math.hypot(wx + 0.5 - RING.cx, wz + 0.5 - RING.cz);
  return r >= RING.r0 && r < RING.r1;
};

/** Aplica paleta, luz e anel numa peça lida. Devolve as contagens. */
export function convert(root, piece) {
  const parts = structureParts(root);
  const [sx, sy, sz] = parts.size;
  const entries = parts.palette.v.items;
  const counts = { renamed: 0, voided: 0, ring: 0, merged: 0 };

  // 1. troca de nome (e states canônicos), mantendo a version
  for (const entry of entries) {
    const name = field(entry, "name").v.v;
    const to = PALETTE[name];
    if (!to) continue;
    if (field(entry, "states").v.length) throw new Error(piece.name + ": " + name + " tem states; a tabela só cobre blocos sem estado");
    if (field(entry, "version")?.v !== VERSION) throw new Error(piece.name + ": " + name + " com version inesperada " + field(entry, "version")?.v);
    field(entry, "name").v = str(to);
    field(entry, "states").v = (STATES[to] ?? []).map(([k, v]) => [str(k), { t: T.STRING, v: str(v) }]);
    counts.renamed++;
  }

  const layers = parts.layers;
  const primary = layers[0];
  const positionData = parts.positionData;
  const dropData = new Set();

  // 2. luz invisível -> vazio, nas duas camadas
  const lightIdx = new Set();
  entries.forEach((e, i) => { if (field(e, "name").v.v === LIGHT) lightIdx.add(i); });
  if (lightIdx.size) {
    for (let i = 0; i < primary.length; i++) {
      if (!lightIdx.has(primary[i])) continue;
      for (const layer of layers) layer[i] = -1;
      dropData.add(String(i));
      counts.voided++;
    }
  }

  // 3. anel dourado no piso
  const ly = RING.y - piece.y;
  if (ly >= 0 && ly < sy) {
    let goldIdx = entries.findIndex((e) => field(e, "name").v.v === RING.block && !field(e, "states").v.length);
    for (let x = 0; x < sx; x++) {
      for (let z = 0; z < sz; z++) {
        if (!inRing(piece.x + x, piece.z + z)) continue;
        const i = (x * sy + ly) * sz + z;
        if (primary[i] < 0 || field(entries[primary[i]], "name").v.v === "minecraft:air") continue;
        if (ly + 1 < sy && primary[i + sz] >= 0 && !/^minecraft:(air|light_block_15)$/.test(field(entries[primary[i + sz]], "name").v.v)) continue; // não é o topo
        if (goldIdx < 0) {
          goldIdx = entries.length;
          entries.push([[str("name"), { t: T.STRING, v: str(RING.block) }], [str("states"), { t: T.COMPOUND, v: [] }], [str("version"), { t: T.INT, v: VERSION }]]);
        }
        primary[i] = goldIdx;
        for (const layer of layers.slice(1)) layer[i] = -1;
        dropData.add(String(i));
        counts.ring++;
      }
    }
  }
  if (positionData && dropData.size) positionData.v = positionData.v.filter(([k]) => !dropData.has(k.v));

  // 4. entradas iguais depois da troca viram uma só; entradas sem uso saem; os índices são remapeados
  const used = new Set();
  for (const layer of layers) for (const v of layer) if (v >= 0) used.add(v);
  const byKey = new Map(), remap = new Map(), kept = [];
  entries.forEach((e, i) => {
    if (!used.has(i)) return;
    const k = keyOf(e);
    if (!byKey.has(k)) {
      byKey.set(k, kept.length);
      kept.push(e);
    } else counts.merged++;
    remap.set(i, byKey.get(k));
  });
  for (const layer of layers) for (let i = 0; i < layer.length; i++) if (layer[i] >= 0) layer[i] = remap.get(layer[i]);
  parts.palette.v.items = kept;
  return counts;
}

/** Confere uma peça convertida contra a original, célula por célula. */
export function verify(before, after, piece) {
  const a = structureParts(before), b = structureParts(after);
  if (a.size.join() !== b.size.join()) throw new Error(piece.name + ": tamanho mudou");
  const [sx, sy, sz] = a.size;
  const nameA = a.palette.v.items.map((e) => field(e, "name").v.v), nameB = b.palette.v.items.map((e) => field(e, "name").v.v);
  const statesB = b.palette.v.items.map((e) => field(e, "states").v);
  const verB = b.palette.v.items.map((e) => field(e, "version")?.v);
  let ring = 0;
  for (let x = 0; x < sx; x++) for (let y = 0; y < sy; y++) for (let z = 0; z < sz; z++) {
    const i = (x * sy + y) * sz + z;
    const ia = a.layers[0][i], ib = b.layers[0][i];
    const na = ia < 0 ? null : nameA[ia], nb = ib < 0 ? null : nameB[ib];
    if (na === LIGHT) {
      if (ib !== -1) throw new Error(piece.name + ": luz não virou vazio em " + i);
      continue;
    }
    if (nb === RING.block && na !== RING.block) {
      if (y + piece.y !== RING.y || !inRing(piece.x + x, piece.z + z)) throw new Error(piece.name + ": ouro fora do anel em " + i);
      ring++;
      continue;
    }
    if (nb !== (na === null ? null : PALETTE[na] ?? na)) throw new Error(piece.name + ": célula " + i + " " + na + " -> " + nb);
    if (ib >= 0 && verB[ib] !== VERSION && PALETTE[na]) throw new Error(piece.name + ": version perdida");
    if (ib >= 0 && PALETTE[na] && JSON.stringify(statesB[ib].map(([k, n]) => [k.v, n.v.v])) !== JSON.stringify(STATES[nb] ?? [])) throw new Error(piece.name + ": states errados em " + nb);
  }
  for (let l = 1; l < a.layers.length; l++) for (let i = 0; i < a.layers[l].length; i++) {
    const va = a.layers[l][i], vb = b.layers[l][i];
    if (va < 0 && vb < 0) continue;
    const na = va < 0 ? null : nameA[va], nb = vb < 0 ? null : nameB[vb];
    const blanked = (a.layers[0][i] >= 0 && nameA[a.layers[0][i]] === LIGHT) || (b.layers[0][i] >= 0 && nameB[b.layers[0][i]] === RING.block && nameA[a.layers[0][i]] !== RING.block);
    if (blanked ? vb !== -1 : nb !== (na === null ? null : PALETTE[na] ?? na)) throw new Error(piece.name + ": camada " + l + " célula " + i);
  }
  if (JSON.stringify(a.entities?.v.items.length) !== JSON.stringify(b.entities?.v.items.length)) throw new Error(piece.name + ": entidades mudaram");
  return { ring, palette: nameB.length };
}

function main(argv) {
  const pieces = readPieces();
  if (pieces.length !== 63) throw new Error("esperava 63 peças em tournament_of_power.js, achei " + pieces.length);
  const check = argv[0] === "--check";
  const out = check ? null : argv[0];
  if (!check) {
    if (!out) throw new Error("uso: node tools/tp-arena.mjs <pasta de saída> | --check");
    if (fs.existsSync(out)) throw new Error("a pasta de saída já existe: " + out);
    fs.mkdirSync(out, { recursive: true });
  }
  const total = { renamed: 0, voided: 0, ring: 0, merged: 0 };
  for (const piece of pieces) {
    const file = path.join(DIR, piece.name + ".mcstructure");
    const root = readMcstructure(file);
    const counts = convert(root, piece);
    const v = verify(readMcstructure(file), root, piece);
    for (const k in total) total[k] += counts[k];
    if (counts.ring) console.log(piece.name + ": anel " + v.ring);
    if (out) {
      const dest = path.join(out, piece.name + ".mcstructure");
      writeMcstructureNew(dest, root);
      verify(readMcstructure(file), readMcstructure(dest), piece); // relida do disco
    }
  }
  console.log("peças: " + pieces.length + "; entradas renomeadas: " + total.renamed + "; luz -> vazio: " + total.voided + " células; anel: " + total.ring + " blocos; entradas fundidas: " + total.merged);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error("erro: " + (e?.message ?? e));
    process.exitCode = 1;
  }
}
