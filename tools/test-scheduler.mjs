// Testa o relógio único (Dragon Universe_bp/scripts/core/scheduler.js) sem o jogo, com um @minecraft/server falso e um
// relógio controlado. Cobre os 8 casos de planos/O3_DETALHE.md §5 ("Despacho do relógio").
// Uso: node tools/test-scheduler.mjs   (sai com código 1 se algum caso falhar)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "Dragon Universe_bp", "scripts", "core", "scheduler.js");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "du-scheduler-"));

// @minecraft/server falso: um estado global que cada caso reinicia
fs.writeFileSync(path.join(work, "fake-mc.mjs"), `
export const state = globalThis.__fakeMc = globalThis.__fakeMc ?? {};
export function reset() {
  Object.assign(state, { tick: 0, intervals: [], cleared: [], worldLoad: [], getPlayers: 0, nextRun: 1, players: [] });
}
reset();
export const system = {
  get currentTick() { return state.tick; },
  runInterval(fn, period) { const id = state.nextRun++; state.intervals.push({ id, fn, period, args: arguments.length }); return id; },
  clearRun(id) { state.cleared.push(id); state.intervals = state.intervals.filter((i) => i.id !== id); },
};
export const world = {
  afterEvents: { worldLoad: { subscribe(fn) { state.worldLoad.push(fn); } } },
  getPlayers() { state.getPlayers++; return state.players; },
};
`);
fs.writeFileSync(path.join(work, "fake-perf.mjs"), "import { system } from \"./fake-mc.mjs\";\nexport function perfTask(name, fn) { return fn; }\nexport function schedulerInterval(fn, ticks) { return system.runInterval(fn, ticks); }\n");
const source = fs.readFileSync(SRC, "utf8")
  .replace(/from\s*["']@minecraft\/server["']/, 'from "./fake-mc.mjs"')
  .replace(/from\s*["']\.\/perf\.js["']/, 'from "./fake-perf.mjs"');
fs.writeFileSync(path.join(work, "scheduler.mjs"), source);

const fake = await import(url.pathToFileURL(path.join(work, "fake-mc.mjs")).href);
let instance = 0;
async function load({ stub = false } = {}) {
  fake.reset();
  if (stub) globalThis.__DU_STUB__ = true;
  else delete globalThis.__DU_STUB__;
  const mod = await import(url.pathToFileURL(path.join(work, "scheduler.mjs")).href + "?i=" + instance++);
  delete globalThis.__DU_STUB__;
  return mod;
}
const fireWorldLoad = () => fake.state.worldLoad.forEach((f) => f());
const clockInterval = () => fake.state.intervals.find((i) => i.period === 1);
async function runTicks(from, to) {
  for (let t = from; t <= to; t++) {
    fake.state.tick = t;
    for (const i of [...fake.state.intervals]) if (i.period === 1) i.fn();
    await null;
  }
}
const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(String(m));

let failed = 0;
async function test(name, fn) {
  warnings.length = 0;
  try {
    await fn();
    realWarn.call(console, "  ok    " + name);
  } catch (e) {
    failed++;
    realWarn.call(console, "  FALHOU " + name + "\n         " + e.message);
  }
}
const eq = (a, b, what) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(what + ": esperado " + JSON.stringify(b) + ", veio " + JSON.stringify(a));
};

await test("1. a tarefa roda só quando (tick - phase) % period === 0", async () => {
  const s = await load();
  const ran = [];
  s.every(4, "a", () => ran.push(fake.state.tick), { phase: 1 });
  fireWorldLoad();
  await runTicks(0, 12);
  eq(ran, [1, 5, 9], "ticks");
});

await test("2. no mesmo tick, as tarefas rodam na ordem do registro", async () => {
  const s = await load();
  const order = [];
  for (const n of ["c", "a", "b"]) s.every(2, n, () => order.push(n));
  fireWorldLoad();
  await runTicks(0, 2);
  eq(order, ["c", "a", "b", "c", "a", "b"], "ordem");
});

await test("3. erro numa tarefa não para as seguintes; aviso no máximo 1 vez por minuto", async () => {
  const s = await load();
  let after = 0;
  s.every(1, "quebrada", () => { throw new Error("boom"); });
  s.every(1, "depois", () => after++);
  fireWorldLoad();
  await runTicks(0, 2399);
  eq(after, 2400, "execuções da tarefa seguinte");
  eq(warnings.length, 2, "avisos em 2400 ticks");
  if (!warnings[0].includes('"quebrada"') || !warnings[0].includes("boom")) throw new Error("aviso sem nome ou pilha: " + warnings[0]);
  if (!warnings[1].includes("+1199 erro(s) repetido(s)")) throw new Error("aviso sem a contagem dos repetidos: " + warnings[1]);
});

await test("4. cancel funciona, inclusive de dentro da própria tarefa", async () => {
  const s = await load();
  let a = 0, b = 0, c = 0;
  const idA = s.every(1, "a", () => a++);
  const idB = s.every(1, "b", () => { b++; if (b === 3) s.cancel(idB); });
  s.every(1, "c", () => c++);
  fireWorldLoad();
  await runTicks(0, 4);
  s.cancel(idA);
  await runTicks(5, 9);
  eq([a, b, c], [5, 3, 10], "execuções a/b/c");
});

await test("5. tarefa registrada antes do worldLoad começa no worldLoad", async () => {
  const s = await load();
  const ran = [];
  s.every(1, "cedo", () => ran.push(fake.state.tick));
  eq(fake.state.intervals.length, 0, "intervalos antes do worldLoad");
  fake.state.tick = 5;
  fireWorldLoad();
  await runTicks(6, 8);
  eq(ran, [6, 7, 8], "ticks");
  fireWorldLoad(); // um segundo worldLoad não duplica o relógio
  eq(fake.state.intervals.length, 1, "intervalos do relógio");
});

await test("6. players() chama getPlayers 1 vez por tick, com N tarefas", async () => {
  const s = await load();
  fake.state.players = [{ dimension: { id: "dbe:namek" } }, { dimension: { id: "minecraft:overworld" } }, { get dimension() { throw new Error("saiu"); } }];
  let seen = 0;
  for (let k = 0; k < 5; k++) s.every(1, "t" + k, () => { seen += s.players().length; s.playersIn("dbe:namek"); });
  fireWorldLoad();
  await runTicks(0, 9);
  eq(fake.state.getPlayers, 10, "getPlayers em 10 ticks");
  eq(seen, 5 * 10 * 3, "jogadores vistos");
  eq(s.playersIn("dbe:namek").length, 1, "playersIn");
});

await test("7. sem __DU_STUB__ existe um único system.runInterval; com a flag, um por tarefa (passagem)", async () => {
  const s = await load();
  for (let k = 0; k < 6; k++) s.every(4 + k, "t" + k, () => {});
  fireWorldLoad();
  eq(fake.state.intervals.map((i) => i.period), [1], "intervalos sem a flag");
  const p = await load({ stub: true });
  const fns = [() => {}, () => {}];
  const ids = [p.every(4, "a", fns[0], { phase: 3 }), p.every(100, "b", fns[1], { phase: 51 })];
  eq(fake.state.worldLoad.length, 0, "inscrições no worldLoad com a flag");
  eq(fake.state.intervals.map((i) => [i.period, i.fn === fns[fake.state.intervals.indexOf(i)]]), [[4, true], [100, true]], "intervalos com a flag (mesma função, mesmo período)");
  p.cancel(ids[0]);
  eq(fake.state.cleared, [ids[0]], "cancel com a flag = system.clearRun");
  p.every(undefined, "sem período", () => {});
  eq(fake.state.intervals.at(-1).args, 1, "período ausente continua ausente na passagem");
  const r = await load();
  let n = 0;
  r.every(undefined, "1 tick", () => n++);
  fireWorldLoad();
  await runTicks(0, 4);
  eq(n, 5, "período ausente = 1 tick no relógio");
});

await test("8. Promise rejeitada é registrada", async () => {
  const s = await load();
  s.every(1, "assincrona", () => Promise.reject(new Error("falhou depois")));
  fireWorldLoad();
  await runTicks(0, 0);
  await new Promise((r) => setTimeout(r, 0));
  eq(warnings.length, 1, "avisos");
  if (!warnings[0].includes('"assincrona"') || !warnings[0].includes("falhou depois")) throw new Error("aviso: " + warnings[0]);
});

console.warn = realWarn;
fs.rmSync(work, { recursive: true, force: true });
console.log(failed ? `\n${failed} caso(s) falharam.` : "\nOK: 8 casos.");
process.exit(failed ? 1 : 0);
