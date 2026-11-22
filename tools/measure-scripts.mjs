// Mede o custo de agendamento e de consultas dos scripts, sem Minecraft (fatia O0 de planos/ARQUITETURA_OTIMIZACAO.md).
//
// Duas medidas:
//  1. Execução com o @minecraft/server falso (lib/run-with-stub.mjs, o mesmo do compare-scripts): conta quantas vezes
//     cada API cara é chamada na CARGA dos scripts e depois, ao rodar os callbacks registrados (3 rodadas). O stub
//     não reproduz o jogo (getAllPlayers devolve lista vazia, condições falsas...), então os números dos callbacks
//     são um piso, bons para comparar antes/depois de uma mudança, não para estimar o custo real.
//  2. Contagem estática por arquivo (texto), para ver onde estão os agendadores e as consultas.
//
// Uso: node tools/measure-scripts.mjs [revisão] [--json]
//   sem revisão: mede a pasta atual; com revisão (ex.: HEAD~3): mede os scripts daquela revisão.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { extractRevision, copyWorkingTree, runWithStub } from "./lib/scripts-snapshot.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const rev = args.find((a) => !a.startsWith("--"));

// Nome do método (último segmento do caminho registrado pelo stub) → rótulo no relatório.
const TRACKED = [
  ["runInterval", "system.runInterval"],
  ["runTimeout", "system.runTimeout"],
  ["run", "system.run"],
  ["runJob", "system.runJob"],
  ["subscribe", "eventos .subscribe"],
  ["getAllPlayers", "world.getAllPlayers"],
  ["getPlayers", "getPlayers"],
  ["getEntities", "getEntities"],
  ["getBlock", "getBlock"],
  ["setDynamicProperty", "setDynamicProperty"],
  ["setProperty", "setProperty"],
];

const work = fs.mkdtempSync(path.join(os.tmpdir(), "du-measure-"));
const dir = path.join(work, "scripts");
try {
  if (rev) extractRevision(rev, dir);
  else copyWorkingTree(dir);
  const log = runWithStub(dir, path.join(work, "log.txt"));
  const result = { source: rev ?? "pasta atual", runtime: runtimeCounts(log), files: staticCounts(dir) };
  if (json) console.log(JSON.stringify(result, null, 2));
  else print(result);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}

function runtimeCounts(log) {
  const load = {}, callbacks = {}, subscribed = {};
  let inCallbacks = false, ran = 0, loadError;
  for (const line of log) {
    if (line.startsWith("== callback de ")) {
      inCallbacks = true;
      continue;
    }
    if (line.startsWith("callbacks executados: ")) ran = Number(line.slice(22));
    if (line.startsWith("ERRO ao carregar")) loadError = line;
    const m = /^(?:new )?([\w$.()]+?)\(/.exec(line);
    if (!m) continue;
    const callPath = m[1];
    const method = callPath.split(".").at(-1);
    const tracked = TRACKED.find(([name]) => name === method);
    if (!tracked) continue;
    const bucket = inCallbacks ? callbacks : load;
    bucket[tracked[1]] = (bucket[tracked[1]] ?? 0) + 1;
    if (method === "subscribe") {
      // mc.world.afterEvents.playerSpawn.subscribe → afterEvents.playerSpawn
      const event = callPath.split(".").slice(-3, -1).join(".");
      subscribed[event] = (subscribed[event] ?? 0) + 1;
    }
  }
  return { load, callbacks, callbacksRun: ran, subscribedEvents: subscribed, loadError };
}

function staticCounts(dir) {
  const patterns = {
    runInterval: /\brunInterval\s*\(/g,
    runTimeout: /\brunTimeout\s*\(/g,
    runJob: /\brunJob\s*\(/g,
    subscribe: /\.subscribe\s*\(/g,
    getAllPlayers: /\bgetAllPlayers\s*\(|\bgetPlayers\s*\(/g,
    getEntities: /\bgetEntities\s*\(/g,
    getBlock: /\bgetBlock\s*\(/g,
  };
  const rows = [];
  // scripts/ e subpastas de código (core/…), sem data/ (tabelas puras)
  const list = fs.readdirSync(dir, { recursive: true }).map((f) => f.split(path.sep).join("/"));
  for (const f of list.filter((f) => f.endsWith(".js") && !f.startsWith("data/")).sort()) {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    const row = { file: f, lines: text.split("\n").length, bytes: Buffer.byteLength(text) };
    for (const [k, re] of Object.entries(patterns)) row[k] = (text.match(re) ?? []).length;
    rows.push(row);
  }
  return rows;
}

function print({ source, runtime, files }) {
  console.log(`Medição dos scripts (${source})\n`);
  if (runtime.loadError) console.log("  " + runtime.loadError + "\n");
  console.log("1. Execução com o stub (carga / callbacks, " + runtime.callbacksRun + " callbacks executados em 3 rodadas):");
  const labels = TRACKED.map(([, label]) => label);
  const w = Math.max(...labels.map((l) => l.length));
  for (const label of labels) {
    const a = runtime.load[label] ?? 0, b = runtime.callbacks[label] ?? 0;
    if (a || b) console.log(`   ${label.padEnd(w)}  carga ${String(a).padStart(4)}   callbacks ${String(b).padStart(4)}`);
  }
  const events = Object.entries(runtime.subscribedEvents).sort((x, y) => y[1] - x[1]);
  console.log(`\n   Inscrições por evento (${events.length} eventos): ` + events.map(([e, n]) => `${e}×${n}`).join(", "));

  console.log("\n2. Contagem estática por arquivo (texto; inclui código que nunca roda):");
  const cols = ["lines", "bytes", "runInterval", "runTimeout", "runJob", "subscribe", "getAllPlayers", "getEntities", "getBlock"];
  const head = ["arquivo", "linhas", "KB", "interval", "timeout", "runJob", "subscribe", "players", "entities", "getBlock"];
  const fw = Math.max(...files.map((r) => r.file.length), 7);
  console.log("   " + head[0].padEnd(fw) + head.slice(1).map((h) => h.padStart(10)).join(""));
  const total = { file: "TOTAL" };
  for (const r of files) {
    for (const c of cols) total[c] = (total[c] ?? 0) + r[c];
    console.log("   " + r.file.padEnd(fw) + cols.map((c) => String(c === "bytes" ? Math.round(r[c] / 1024) : r[c]).padStart(10)).join(""));
  }
  console.log("   " + total.file.padEnd(fw) + cols.map((c) => String(c === "bytes" ? Math.round(total[c] / 1024) : total[c]).padStart(10)).join(""));
}
