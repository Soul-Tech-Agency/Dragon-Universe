// Relógio único das dimensões e das tarefas gerais (O3 de planos/O3_DETALHE.md). Um só system.runInterval de 1 tick,
// criado no worldLoad, despacha todas as tarefas periódicas registradas com every().
//
//   every(period, name, fn, { phase })  roda fn quando (currentTick - phase) % period === 0; devolve um id
//   cancel(id)                          tira a tarefa (pode ser chamado de dentro dela)
//   players()                           world.getPlayers() lido no máximo 1 vez por tick, compartilhado
//   playersIn(dimId)                    players() só da dimensão dimId
//
// - No mesmo tick, as tarefas rodam na ordem do registro, como os intervalos de antes.
// - Uma tarefa registrada antes do worldLoad espera o relógio começar.
// - Cada tarefa tem o seu try/catch: o erro vai para o console.warn com o nome e a pilha, no máximo 1 aviso por tarefa
//   por minuto (com a contagem dos repetidos), e não para as outras. Promise rejeitada é registrada do mesmo jeito
//   (o relógio não espera por ela).
// - Com a sonda ligada (core/perf.js), cada tarefa é medida como "every <name>".
// - Modo de passagem (só para a prova): se globalThis.__DU_STUB__ existe (só o tools/lib/run-with-stub.mjs define),
//   every() vira system.runInterval(fn, period) direto, no mesmo lugar, e o compare-scripts vê o mesmo registro de antes.
//   Em jogo essa flag nunca existe.
import { system, world } from "@minecraft/server";
import { perfTask } from "./perf.js";

const STUB = !!globalThis.__DU_STUB__;
const WARN_EVERY_TICKS = 1200; // 1 aviso por tarefa por minuto

const tasks = []; // na ordem do registro
let nextId = 1;
let clockRunId;
let playersTick = -1;
let playersCache = [];

export function every(period, name, fn, { phase = 0 } = {}) {
  if (STUB) return system.runInterval(fn, period);
  const p = Math.max(1, Math.floor(period));
  const task = { id: nextId++, period: p, phase: ((Math.floor(phase) % p) + p) % p, name, run: perfTask(name, fn),
    cancelled: false, lastWarn: -Infinity, suppressed: 0 };
  tasks.push(task);
  return task.id;
}

export function cancel(id) {
  if (STUB) return system.clearRun(id);
  const i = tasks.findIndex((t) => t.id === id);
  if (i >= 0) {
    tasks[i].cancelled = true;
    tasks.splice(i, 1);
  }
}

export function players() {
  const now = system.currentTick;
  if (now !== playersTick) {
    playersTick = now;
    playersCache = world.getPlayers();
  }
  return playersCache;
}

export function playersIn(dimId) {
  return players().filter((p) => {
    try {
      return p.dimension.id === dimId;
    } catch {
      return false; // jogador saiu neste tick
    }
  });
}

function report(task, error) {
  const now = system.currentTick;
  if (now - task.lastWarn < WARN_EVERY_TICKS) {
    task.suppressed++;
    return;
  }
  const repeated = task.suppressed ? " (+" + task.suppressed + " erro(s) repetido(s) no último minuto)" : "";
  task.lastWarn = now;
  task.suppressed = 0;
  console.warn("[scheduler] tarefa \"" + task.name + "\" falhou" + repeated + ": " + (error?.stack ?? error));
}

function tick() {
  const now = system.currentTick;
  for (const task of tasks.slice()) {
    if (task.cancelled || (now - task.phase) % task.period !== 0) continue;
    try {
      const result = task.run();
      if (result && typeof result.then === "function") result.then(undefined, (error) => report(task, error));
    } catch (error) {
      report(task, error);
    }
  }
}

if (!STUB)
  world.afterEvents.worldLoad.subscribe(() => {
    if (clockRunId === undefined) clockRunId = system.runInterval(tick, 1);
  });
