// Leitor e escritor de .mcstructure (NBT little-endian do Bedrock), sem dependências.
// Lê e regrava sem perder nada: tipos, ordem das chaves, floats e strings são preservados byte a byte.
// Nunca sobrescreve: toda operação que muda algo escreve num arquivo NOVO (o destino não pode existir).
//
// Uso:
//   node tools/mcstructure.mjs info <arquivo.mcstructure>
//       tamanho, paleta com contagens (camada 0), vazios, entidades e block entities
//   node tools/mcstructure.mjs rename <entrada> <saída> <mapa.json | '{"minecraft:a":"minecraft:b"}'>
//       renomeia entradas da block_palette (só o name; estados e version ficam)
//   node tools/mcstructure.mjs void <entrada> <saída> <bloco> [--y-from N] [--y-to N]
//       troca o bloco por vazio de estrutura (-1) nas duas camadas, opcionalmente só entre as camadas N..M
//   node tools/mcstructure.mjs strip-entities <entrada> <saída> [identificador ...]
//       remove as entidades salvas (todas, ou só as dos identificadores dados)
//   node tools/mcstructure.mjs set <entrada> <saída> <lista.json>
//       troca blocos por posição local ([{piece?, x, y, z, from, to}] ou {edits: [...]}); só onde o bloco atual é from
//   node tools/mcstructure.mjs roundtrip <arquivo ...>
//       lê e regrava em memória; confere que o resultado é igual byte a byte
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------- NBT
// Nó: { t: tipo, v: valor }. Compound: v = [[nome, nó], ...] (ordem preservada).
// List: v = { et: tipo dos elementos, items: [nó sem t...] }; listas de int viram Int32Array.
// Float/double: guardados crus (raw), com v só para leitura. String: v e os bytes crus.
const T = { END: 0, BYTE: 1, SHORT: 2, INT: 3, LONG: 4, FLOAT: 5, DOUBLE: 6, BYTE_ARRAY: 7, STRING: 8, LIST: 9, COMPOUND: 10, INT_ARRAY: 11, LONG_ARRAY: 12 };

export function parseNbt(buf) {
  let o = 0;
  const u8 = () => buf[o++];
  const str = () => {
    const n = buf.readUInt16LE(o);
    const raw = buf.subarray(o + 2, o + 2 + n);
    o += 2 + n;
    return { v: raw.toString("utf8"), raw: Buffer.from(raw) };
  };
  const payload = (t) => {
    switch (t) {
      case T.BYTE: return buf.readInt8(o++);
      case T.SHORT: { const v = buf.readInt16LE(o); o += 2; return v; }
      case T.INT: { const v = buf.readInt32LE(o); o += 4; return v; }
      case T.LONG: { const v = buf.readBigInt64LE(o); o += 8; return v; }
      case T.FLOAT: { const raw = Buffer.from(buf.subarray(o, o + 4)); o += 4; return { raw, v: raw.readFloatLE(0) }; }
      case T.DOUBLE: { const raw = Buffer.from(buf.subarray(o, o + 8)); o += 8; return { raw, v: raw.readDoubleLE(0) }; }
      case T.BYTE_ARRAY: { const n = buf.readInt32LE(o); const v = Buffer.from(buf.subarray(o + 4, o + 4 + n)); o += 4 + n; return v; }
      case T.STRING: return str();
      case T.LIST: {
        const et = u8();
        const n = buf.readInt32LE(o);
        o += 4;
        if (et === T.INT) {
          const a = new Int32Array(n);
          for (let i = 0; i < n; i++, o += 4) a[i] = buf.readInt32LE(o);
          return { et, items: a };
        }
        const items = [];
        for (let i = 0; i < n; i++) items.push(payload(et));
        return { et, items };
      }
      case T.COMPOUND: {
        const entries = [];
        for (;;) {
          const tt = u8();
          if (tt === T.END) break;
          const name = str();
          entries.push([name, { t: tt, v: payload(tt) }]);
        }
        return entries;
      }
      case T.INT_ARRAY: {
        const n = buf.readInt32LE(o);
        o += 4;
        const a = new Int32Array(n);
        for (let i = 0; i < n; i++, o += 4) a[i] = buf.readInt32LE(o);
        return a;
      }
      case T.LONG_ARRAY: {
        const n = buf.readInt32LE(o);
        o += 4;
        const a = new BigInt64Array(n);
        for (let i = 0; i < n; i++, o += 8) a[i] = buf.readBigInt64LE(o);
        return a;
      }
      default:
        throw new Error("tag NBT desconhecida " + t + " no byte " + (o - 1));
    }
  };
  const t = u8();
  const name = str();
  const root = { t, name, v: payload(t) };
  if (o !== buf.length) throw new Error("sobraram " + (buf.length - o) + " bytes depois da raiz");
  return root;
}

export function writeNbt(root) {
  const chunks = [];
  let size = 0;
  const push = (b) => { chunks.push(b); size += b.length; };
  const num = (bytes, fn) => { const b = Buffer.alloc(bytes); fn(b); push(b); };
  const strOut = (s) => {
    // Os bytes originais quando o texto não mudou (garante o round-trip); senão UTF-8 do texto novo.
    const raw = s.raw && s.raw.toString("utf8") === s.v ? s.raw : Buffer.from(s.v, "utf8");
    if (raw.length > 0xffff) throw new Error("string longa demais");
    num(2, (b) => b.writeUInt16LE(raw.length));
    push(raw);
  };
  const payload = (t, v) => {
    switch (t) {
      case T.BYTE: return num(1, (b) => b.writeInt8(v));
      case T.SHORT: return num(2, (b) => b.writeInt16LE(v));
      case T.INT: return num(4, (b) => b.writeInt32LE(v));
      case T.LONG: return num(8, (b) => b.writeBigInt64LE(BigInt(v)));
      case T.FLOAT: return push(v.raw ?? (() => { const b = Buffer.alloc(4); b.writeFloatLE(v.v); return b; })());
      case T.DOUBLE: return push(v.raw ?? (() => { const b = Buffer.alloc(8); b.writeDoubleLE(v.v); return b; })());
      case T.BYTE_ARRAY: num(4, (b) => b.writeInt32LE(v.length)); return push(Buffer.from(v));
      case T.STRING: return strOut(v);
      case T.LIST: {
        num(1, (b) => b.writeUInt8(v.et));
        num(4, (b) => b.writeInt32LE(v.items.length));
        if (v.items instanceof Int32Array) {
          const b = Buffer.alloc(v.items.length * 4);
          for (let i = 0; i < v.items.length; i++) b.writeInt32LE(v.items[i], i * 4);
          return push(b);
        }
        for (const item of v.items) payload(v.et, item);
        return;
      }
      case T.COMPOUND:
        for (const [name, node] of v) {
          num(1, (b) => b.writeUInt8(node.t));
          strOut(name);
          payload(node.t, node.v);
        }
        return num(1, (b) => b.writeUInt8(T.END));
      case T.INT_ARRAY: {
        num(4, (b) => b.writeInt32LE(v.length));
        const b = Buffer.alloc(v.length * 4);
        for (let i = 0; i < v.length; i++) b.writeInt32LE(v[i], i * 4);
        return push(b);
      }
      case T.LONG_ARRAY: {
        num(4, (b) => b.writeInt32LE(v.length));
        const b = Buffer.alloc(v.length * 8);
        for (let i = 0; i < v.length; i++) b.writeBigInt64LE(v[i], i * 8);
        return push(b);
      }
      default:
        throw new Error("tag NBT desconhecida " + t);
    }
  };
  num(1, (b) => b.writeUInt8(root.t));
  strOut(root.name);
  payload(root.t, root.v);
  return Buffer.concat(chunks, size);
}

// ---------------------------------------------------------------- acesso
/** Nó filho de um compound pelo nome (ou undefined). */
export function child(node, name) {
  if (!node || node.t !== T.COMPOUND) return undefined;
  for (const [k, n] of node.v) if (k.v === name) return n;
  return undefined;
}

const listOf = (node) => (node && node.t === T.LIST ? node.v.items : []);
const toJs = (t, v) => {
  switch (t) {
    case T.FLOAT: case T.DOUBLE: return v.v;
    case T.STRING: return v.v;
    case T.LONG: return String(v);
    case T.COMPOUND: return Object.fromEntries(v.map(([k, n]) => [k.v, toJs(n.t, n.v)]));
    case T.LIST: return Array.from(v.items, (item) => toJs(v.et, item));
    case T.INT_ARRAY: case T.BYTE_ARRAY: return Array.from(v);
    case T.LONG_ARRAY: return Array.from(v, String);
    default: return v;
  }
};

/** Partes de uma .mcstructure já lida: tamanho, camadas de índices, paleta, entidades e dados por posição. */
export function structureParts(root) {
  const size = listOf(child(root, "size"));
  const structure = child(root, "structure");
  const layers = listOf(child(structure, "block_indices")).map((l) => (l instanceof Int32Array ? l : l.items));
  const palette = child(child(child(structure, "palette"), "default"), "block_palette");
  const positionData = child(child(child(structure, "palette"), "default"), "block_position_data");
  const entities = child(structure, "entities");
  return { size: Array.from(size), structure, layers, palette, positionData, entities };
}

const entryName = (compoundValue) => {
  for (const [k, n] of compoundValue) if (k.v === "name") return n.v;
  return undefined;
};

// ---------------------------------------------------------------- operações
export function readMcstructure(file) {
  return parseNbt(fs.readFileSync(file));
}

/** Escreve num arquivo novo; recusa se o destino já existe. */
export function writeMcstructureNew(file, root) {
  if (fs.existsSync(file)) throw new Error("o destino já existe (esta ferramenta só escreve em arquivo novo): " + file);
  fs.writeFileSync(file, writeNbt(root), { flag: "wx" });
}

export function info(root) {
  const { size, layers, palette, positionData, entities } = structureParts(root);
  const counts = new Map();
  let voids = 0;
  for (const i of layers[0] ?? []) {
    if (i < 0) voids++;
    else counts.set(i, (counts.get(i) ?? 0) + 1);
  }
  const pal = listOf(palette).map((e, i) => {
    const js = toJs(T.COMPOUND, e);
    return { index: i, name: js.name, states: js.states, count: counts.get(i) ?? 0 };
  });
  const ents = {};
  for (const e of listOf(entities)) {
    const id = toJs(T.COMPOUND, e).identifier;
    ents[id] = (ents[id] ?? 0) + 1;
  }
  const blockEntities = {};
  for (const [, n] of positionData?.v ?? []) {
    const id = toJs(n.t, n.v).block_entity_data?.id;
    if (id) blockEntities[id] = (blockEntities[id] ?? 0) + 1;
  }
  return { size, cells: size[0] * size[1] * size[2], voids, layers: layers.length, palette: pal, entities: ents, blockEntities };
}

/** Renomeia entradas da paleta. map: { "minecraft:antigo": "minecraft:novo" }. Devolve quantas entradas mudaram. */
export function renamePalette(root, map) {
  for (const [from, to] of Object.entries(map)) {
    for (const id of [from, to]) {
      if (typeof id !== "string" || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(id)) throw new Error("nome inválido no mapa: " + JSON.stringify(id));
    }
  }
  let changed = 0;
  for (const entry of listOf(structureParts(root).palette)) {
    for (const [k, n] of entry) {
      if (k.v !== "name" || n.t !== T.STRING) continue;
      const to = map[n.v.v];
      if (to === undefined) continue;
      n.v = { v: to };
      changed++;
    }
  }
  return changed;
}

/** Troca um bloco por vazio (-1) nas camadas, opcionalmente só entre yFrom..yTo. Remove os dados de posição dessas células. */
export function voidBlock(root, name, { yFrom = -Infinity, yTo = Infinity } = {}) {
  const { size, layers, palette, positionData } = structureParts(root);
  const [sx, sy, sz] = size;
  const targets = new Set();
  listOf(palette).forEach((e, i) => { if (entryName(e)?.v === name) targets.add(i); });
  if (!targets.size) return 0;
  const primary = layers[0];
  const cleared = new Set();
  for (let x = 0; x < sx; x++) {
    for (let y = Math.max(0, yFrom); y <= Math.min(sy - 1, yTo); y++) {
      for (let z = 0; z < sz; z++) {
        const i = (x * sy + y) * sz + z;
        if (!targets.has(primary[i])) continue;
        for (const layer of layers) layer[i] = -1;
        cleared.add(String(i));
      }
    }
  }
  if (positionData && cleared.size) positionData.v = positionData.v.filter(([k]) => !cleared.has(k.v));
  return cleared.size;
}

/**
 * Troca blocos por posição (camada 0). edits: [{ x, y, z, from, to }] em coordenadas locais; cada troca só vale se o bloco
 * atual se chama `from` (senão é pulada e listada). `to` entra sem estados: reusa uma entrada da paleta com esse nome e
 * states vazio, ou cria uma com a version da entrada de `from`. Devolve { applied: [índices], skipped: [motivos] }.
 */
export function setBlocks(root, edits) {
  const { size, layers, palette } = structureParts(root);
  const [sx, sy, sz] = size;
  const entries = listOf(palette);
  const field = (e, k) => e.find(([n]) => n.v === k)?.[1];
  const nameAt = (i) => (i < 0 ? "structure_void" : entryName(entries[i])?.v);
  const applied = [], skipped = [];
  for (const ed of edits) {
    const { x, y, z, from, to } = ed;
    if (![x, y, z].every((v) => Number.isInteger(v)) || x < 0 || y < 0 || z < 0 || x >= sx || y >= sy || z >= sz) {
      skipped.push(x + "," + y + "," + z + ": fora da peça");
      continue;
    }
    const i = (x * sy + y) * sz + z;
    const cur = layers[0][i];
    if (nameAt(cur) !== from) {
      skipped.push(x + "," + y + "," + z + ": é " + nameAt(cur) + ", esperado " + from);
      continue;
    }
    let idx = entries.findIndex((e) => entryName(e)?.v === to && !field(e, "states").v.length);
    if (idx < 0) {
      const version = field(entries[cur], "version");
      const entry = [[{ v: "name" }, { t: T.STRING, v: { v: to } }], [{ v: "states" }, { t: T.COMPOUND, v: [] }]];
      if (version) entry.push([{ v: "version" }, { t: version.t, v: version.v }]);
      idx = entries.length;
      entries.push(entry);
    }
    layers[0][i] = idx;
    applied.push(i);
  }
  return { applied, skipped };
}

/** Remove entidades salvas: todas, ou só as dos identificadores dados. Devolve quantas saíram. */
export function stripEntities(root, ids = []) {
  const { entities } = structureParts(root);
  if (!entities) return 0;
  const before = entities.v.items.length;
  entities.v.items = ids.length ? entities.v.items.filter((e) => !ids.includes(toJs(T.COMPOUND, e).identifier)) : [];
  return before - entities.v.items.length;
}

export function roundtrip(file) {
  const original = fs.readFileSync(file);
  const again = writeNbt(parseNbt(original));
  return { file, bytes: original.length, equal: again.equals(original) };
}

// ---------------------------------------------------------------- CLI
function usage() {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).slice(0, 18).map((l) => l.slice(3)).join("\n"));
  process.exit(2);
}

function flag(args, name) {
  const at = args.indexOf(name);
  if (at < 0) return undefined;
  const v = Number(args[at + 1]);
  if (!Number.isInteger(v)) throw new Error(name + " precisa de um número inteiro");
  args.splice(at, 2);
  return v;
}

function main(argv) {
  const [cmd, ...args] = argv;
  if (cmd === "info" && args.length === 1) {
    const r = info(readMcstructure(args[0]));
    console.log(args[0] + ": " + r.size.join("x") + " (" + r.cells + " células, " + r.voids + " vazias, " + r.layers + " camadas)");
    for (const p of r.palette) console.log("  [" + p.index + "] " + p.name + (Object.keys(p.states ?? {}).length ? " " + JSON.stringify(p.states) : "") + ": " + p.count);
    console.log("  entidades: " + (JSON.stringify(r.entities) === "{}" ? "nenhuma" : JSON.stringify(r.entities)));
    console.log("  block entities: " + (JSON.stringify(r.blockEntities) === "{}" ? "nenhuma" : JSON.stringify(r.blockEntities)));
    return 0;
  }
  if (cmd === "rename" && args.length === 3) {
    const [src, out, spec] = args;
    const map = JSON.parse(fs.existsSync(spec) ? fs.readFileSync(spec, "utf8") : spec);
    const root = readMcstructure(src);
    const n = renamePalette(root, map);
    writeMcstructureNew(out, root);
    console.log(out + ": " + n + " entrada(s) da paleta renomeada(s)");
    return 0;
  }
  if (cmd === "void" && args.length >= 3) {
    const yFrom = flag(args, "--y-from");
    const yTo = flag(args, "--y-to");
    if (args.length !== 3) usage();
    const [src, out, name] = args;
    const root = readMcstructure(src);
    const n = voidBlock(root, name, { yFrom, yTo });
    writeMcstructureNew(out, root);
    console.log(out + ": " + n + " célula(s) de " + name + " viraram vazio");
    return 0;
  }
  if (cmd === "set" && args.length === 3) {
    const [src, out, list] = args;
    const data = JSON.parse(fs.readFileSync(list, "utf8"));
    const piece = path.basename(src, ".mcstructure");
    const edits = (Array.isArray(data) ? data : data.edits).filter((e) => !e.piece || e.piece === piece);
    const root = readMcstructure(src);
    const { applied, skipped } = setBlocks(root, edits);
    for (const s of skipped) console.log("  pulado " + s);
    // conferência: relida do zero, a peça nova só difere da original nas posições aplicadas
    const before = structureParts(readMcstructure(src)), after = structureParts(parseNbt(writeNbt(root)));
    const name = (p, i) => (i < 0 ? "structure_void" : entryName(listOf(p.palette)[i])?.v);
    const want = new Set(applied);
    let diff = 0;
    for (let l = 0; l < before.layers.length; l++) {
      for (let i = 0; i < before.layers[l].length; i++) {
        if (name(before, before.layers[l][i]) === name(after, after.layers[l][i])) continue;
        diff++;
        if (l !== 0 || !want.has(i)) throw new Error("mudou uma posição fora da lista: camada " + l + ", célula " + i);
      }
    }
    if (diff !== applied.length) throw new Error("esperava " + applied.length + " posições mudadas, achei " + diff);
    writeMcstructureNew(out, root);
    console.log(out + ": " + applied.length + " de " + edits.length + " troca(s) aplicada(s), " + skipped.length + " pulada(s); só essas posições mudaram");
    return skipped.length ? 1 : 0;
  }
  if (cmd === "strip-entities" && args.length >= 2) {
    const [src, out, ...ids] = args;
    const root = readMcstructure(src);
    const n = stripEntities(root, ids);
    writeMcstructureNew(out, root);
    console.log(out + ": " + n + " entidade(s) removida(s)");
    return 0;
  }
  if (cmd === "roundtrip" && args.length) {
    let bad = 0;
    for (const f of args) {
      const r = roundtrip(f);
      if (!r.equal) bad++;
      if (!r.equal || args.length === 1) console.log((r.equal ? "igual   " : "DIFERENTE ") + r.bytes + "  " + path.relative(process.cwd(), f));
    }
    console.log(args.length - bad + "/" + args.length + " arquivo(s) iguais byte a byte");
    return bad ? 1 : 0;
  }
  usage();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error("erro: " + (e?.message ?? e));
    process.exitCode = 1;
  }
}
