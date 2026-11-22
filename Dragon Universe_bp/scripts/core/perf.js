// Sonda de desempenho (fatia O0 de planos/ARQUITETURA_OTIMIZACAO.md). DESLIGADA por padrão: com
// CONFIG.DEBUG_PERF = false este módulo não instala nada, não se inscreve em nada e não muda nenhuma chamada.
//
// Ligada (CONFIG.DEBUG_PERF = true), envolve system.runInterval/runTimeout/run/runJob/clearRun e conta
// setProperty/getEntities. Comandos (operador):
//   /scriptevent dbe:perf start   zera e começa a medir
//   /scriptevent dbe:perf stop    para de medir (os números ficam para o report)
//   /scriptevent dbe:perf report  mostra, por tarefa (arquivo:linha de quem agendou), chamadas, ms médio/p95/máx
//                                 e ms por tick; mais duração dos ticks, intervalos vivos, setProperty/s,
//                                 getEntities/s e entidades dbe: carregadas.
// Precisa ser o PRIMEIRO import do index.js, para envolver os agendadores antes de os módulos os usarem.
// O tempo vem de Date.now() (resolução de 1 ms): tarefas rápidas aparecem como 0 ms e contam pelas chamadas.
import * as mc from "@minecraft/server";
import { CONFIG } from "../config/config.js";

const { system, world } = mc;
const MAX_SAMPLES = 2000; // amostras guardadas por tarefa, para o p95
const TOP = 12;

if (CONFIG.DEBUG_PERF) install();

function install() {
  const tasks = new Map(); // "tipo arquivo:linha" → { calls, total, max, samples }
  const liveIntervals = new Map(); // runId → onde foi agendado
  const failures = [];
  let running = false, startTick = 0, startMs = 0, stoppedTick = 0, stoppedMs = 0;
  let setProperties = 0, getEntitiesCalls = 0;
  const tickGaps = [];
  let lastTickMs = 0;

  // primeiro quadro da pilha fora deste arquivo: quem chamou o agendador
  const site = () => {
    const frames = String(new Error().stack ?? "").split("\n");
    for (const f of frames) {
      if (/perf\.m?js/.test(f)) continue;
      const m = /([\w./-]+\.m?js):(\d+)/.exec(f);
      if (m) return m[1].split("/").pop() + ":" + m[2];
    }
    return "?";
  };
  const record = (key, ms) => {
    let t = tasks.get(key);
    if (!t) tasks.set(key, (t = { calls: 0, total: 0, max: 0, samples: [] }));
    t.calls++;
    t.total += ms;
    if (ms > t.max) t.max = ms;
    if (t.samples.length < MAX_SAMPLES) t.samples.push(ms);
    else t.samples[t.calls % MAX_SAMPLES] = ms;
  };
  const timed = (key, fn) =>
    typeof fn !== "function"
      ? fn
      : function (...args) {
          if (!running) return fn.apply(this, args);
          const t0 = Date.now();
          try {
            return fn.apply(this, args);
          } finally {
            record(key, Date.now() - t0);
          }
        };

  const rawInterval = system.runInterval.bind(system); // o intervalo da própria sonda não entra nas tarefas
  const patch = (owner, name, make) => {
    try {
      const original = owner[name];
      if (typeof original !== "function") throw new Error("não é função");
      owner[name] = make(original);
    } catch (e) {
      failures.push(name + ": " + e);
    }
  };

  patch(system, "runInterval", (orig) => function (fn, ticks) {
    const where = site();
    const id = orig.call(system, timed("interval(" + (ticks ?? 1) + ") " + where, fn), ticks);
    liveIntervals.set(id, where);
    return id;
  });
  patch(system, "runTimeout", (orig) => function (fn, ticks) {
    return orig.call(system, timed("timeout " + site(), fn), ticks);
  });
  patch(system, "run", (orig) => function (fn) {
    return orig.call(system, timed("run " + site(), fn));
  });
  patch(system, "clearRun", (orig) => function (id) {
    liveIntervals.delete(id);
    return orig.call(system, id);
  });
  patch(system, "runJob", (orig) => function (gen) {
    const where = site();
    // cada passo do gerador é uma execução da tarefa
    const wrapped = (function* () {
      const it = gen;
      while (true) {
        const t0 = running ? Date.now() : 0;
        const step = it.next();
        if (running) record("job " + where, Date.now() - t0);
        if (step.done) return step.value;
        yield step.value;
      }
    })();
    return orig.call(system, wrapped);
  });
  const countProto = (cls, name, inc) => {
    if (!cls?.prototype) return failures.push(name + ": classe ausente");
    patch(cls.prototype, name, (orig) => function (...args) {
      if (running) inc();
      return orig.apply(this, args);
    });
  };
  countProto(mc.Entity, "setProperty", () => setProperties++);
  countProto(mc.Dimension, "getEntities", () => getEntitiesCalls++);

  // duração real de cada tick (intervalo de 1 tick próprio, fora da contagem de tarefas)
  rawInterval(() => {
    const now = Date.now();
    if (running && lastTickMs) tickGaps.push(now - lastTickMs);
    if (tickGaps.length > 20 * 60 * 10) tickGaps.shift(); // até 10 min
    lastTickMs = now;
  }, 1);

  const p95 = (list) => {
    if (!list.length) return 0;
    const s = [...list].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(s.length * 0.95))];
  };
  const fmt = (n) => (Math.round(n * 100) / 100).toString();

  function loadedDbeEntities() {
    let dbe = 0, players = 0;
    const ids = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end", "dbe:namek", "dbe:vegeta", "dbe:frieza_planet", "dbe:yardrat", "dbe:kai",
      "dbe:universe_6_arena", "dbe:hell", "dbe:space", "dbe:bills_planet", "dbe:tournament_of_power", "dbe:hyperbolic_time_chamber", "dbe:future_trunks"];
    const wasRunning = running;
    running = false; // a própria contagem não entra em getEntities/s
    try {
      for (const id of ids) {
        try {
          for (const e of world.getDimension(id).getEntities()) {
            if (e.typeId === "minecraft:player") players++;
            else if (e.typeId.startsWith("dbe:")) dbe++;
          }
        } catch (e) {
          /* dimensão ausente nesta versão */
        }
      }
    } finally {
      running = wasRunning;
    }
    return { dbe, players };
  }

  function report() {
    const endTick = running ? system.currentTick : stoppedTick;
    const endMs = running ? Date.now() : stoppedMs;
    const ticks = Math.max(1, endTick - startTick);
    const seconds = Math.max(0.001, (endMs - startMs) / 1000);
    const rows = [...tasks].sort((a, b) => b[1].total - a[1].total).slice(0, TOP);
    const { dbe, players } = loadedDbeEntities();
    const lines = [
      `§e[perf] ${ticks} ticks em ${fmt(seconds)} s (${running ? "medindo" : "parado"}). Tick: média ${fmt(tickGaps.reduce((a, b) => a + b, 0) / Math.max(1, tickGaps.length))} ms, p95 ${p95(tickGaps)} ms.`,
      `§e[perf] intervalos vivos ${liveIntervals.size}; setProperty ${fmt(setProperties / seconds)}/s; getEntities ${fmt(getEntitiesCalls / seconds)}/s; entidades dbe: ${dbe}, jogadores ${players}.`,
      `§e[perf] tarefas (top ${rows.length} por tempo total): chamadas · média · p95 · máx (ms) · ms/tick`,
      ...rows.map(([k, t]) => `  ${k}: ${t.calls} · ${fmt(t.total / t.calls)} · ${p95(t.samples)} · ${t.max} · ${fmt(t.total / ticks)}`),
    ];
    if (failures.length) lines.push("§c[perf] não instrumentado: " + failures.join("; "));
    return lines;
  }

  system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id !== "dbe:perf") return;
    const cmd = (ev.message ?? "").trim().toLowerCase();
    let out;
    if (cmd === "start") {
      tasks.clear();
      tickGaps.length = 0;
      setProperties = getEntitiesCalls = 0;
      lastTickMs = 0;
      running = true;
      startTick = system.currentTick;
      startMs = Date.now();
      out = ["§a[perf] medindo. Use /scriptevent dbe:perf report ou stop."];
    } else if (cmd === "stop") {
      if (running) {
        running = false;
        stoppedTick = system.currentTick;
        stoppedMs = Date.now();
      }
      out = ["§a[perf] parado. /scriptevent dbe:perf report mostra os números."];
    } else if (cmd === "report") out = startMs ? report() : ["§e[perf] nada medido ainda: /scriptevent dbe:perf start"];
    else out = ["§e/scriptevent dbe:perf start|stop|report"];
    for (const l of out) console.warn(l.replace(/§./g, ""));
    try {
      if (ev.sourceEntity?.typeId === "minecraft:player") for (const l of out) ev.sourceEntity.sendMessage(l);
    } catch (e) {
      /* jogador saiu */
    }
  });
  console.warn("[perf] sonda de desempenho instalada (CONFIG.DEBUG_PERF = true)" + (failures.length ? "; falhas: " + failures.join("; ") : ""));
}
