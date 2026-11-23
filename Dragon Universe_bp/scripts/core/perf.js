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
// Precisa ser o PRIMEIRO import do index.js, para envolver os agendadores antes de os módulos os usarem. Por isso
// ligar a sonda = CONFIG.DEBUG_PERF = true E reabrir o mundo (o /reload também recarrega os scripts).
// O tempo vem de Date.now() (resolução de 1 ms): tarefas rápidas aparecem como 0 ms e contam pelas chamadas.
// O local (arquivo:linha) de runInterval/runJob é calculado no registro (uma vez por tarefa, também antes do start);
// o de run/runTimeout só com a medição ligada.
// Jobs de terreno: desde a bomba do Marco (588e682) eles não passam mais por system.runJob; a bomba (um runInterval de
// terrain_repair.js) dá os passos. A sonda usa o gancho terrainJobProbe.wrap de terrain_repair.js (ligado por
// core/perf_terrain.js, só com a sonda): cada job é agrupado pelo sistema (espaço/planetas, Kaioshin, Futuro, reparo,
// pelo rótulo do job; o arquivo de quem chamou runTerrainJob vai junto), e cada passo do job é medido. Um job do
// planeta Freeza (rótulo "frieza:…") iniciado durante a medição com jogador perto da base ainda não colocada fica
// num grupo à parte, "base do Freeza?" (estimativa: o job não diz para que é). A linha "interval(1) terrain_repair.js"
// é a bomba: o tempo dela inclui o dos jobs. O report lista a dimensão e o chunk de cada jogador. Tudo só leitura.
// As tarefas do relógio único (core/scheduler.js, O3) passam por perfTask e aparecem como "every <nome>"; sem isso,
// todas apareceriam como o intervalo do scheduler.js.
import * as mc from "@minecraft/server";
import { CONFIG } from "../config/config.js";

const { system, world } = mc;
const MAX_SAMPLES = 2000; // amostras guardadas por tarefa, para o p95
const TOP = 12;

// Com a sonda desligada, perfTask devolve a própria função (custo zero). install() troca a implementação.
let wrapTask = (name, fn) => fn;
export function perfTask(name, fn) {
  return wrapTask(name, fn);
}
// O intervalo do próprio relógio (core/scheduler.js) não passa pela medição: o tempo dele é a soma das tarefas, que já
// aparecem uma por uma como "every <nome>". Com a sonda desligada é o system.runInterval normal.
let clockInterval = (fn, ticks) => system.runInterval(fn, ticks);
export function schedulerInterval(fn, ticks) {
  return clockInterval(fn, ticks);
}

// Embrulho dos jobs de terreno para o gancho de terrain_repair.js (null com a sonda desligada).
export let terrainProbeWrap = null;

if (CONFIG.DEBUG_PERF) install();

function install() {
  const tasks = new Map(); // "tipo arquivo:linha" → { calls, total, max, samples }
  const liveIntervals = new Map(); // runId → onde foi agendado
  const failures = [];
  let running = false, startTick = 0, startMs = 0, stoppedTick = 0, stoppedMs = 0;
  let setProperties = 0, getEntitiesCalls = 0, getPlayersCalls = 0;
  const tickGaps = [];
  let lastTickMs = 0;

  // Quem agendou: os 2 primeiros quadros da pilha fora deste arquivo. Se o 1º é um embrulho de agendamento do núcleo
  // (o runInterval/runTimeout das entidades, index.js, que repassa para o system), a tarefa é atribuída ao 2º,
  // "local (via embrulho)"; senão ao 1º. runInterval/runJob calculam sempre (always = true): são registrados uma vez e
  // rodam por muito tempo, e os scanners agendados na carga precisam aparecer separados por arquivo:linha. run e
  // runTimeout (uso único, muitos por tick) só calculam com a medição ligada.
  const site = (always = false) => {
    if (!running && !always) return "antes do start";
    const frames = [];
    for (const f of String(new Error().stack ?? "").split("\n")) {
      if (/perf\.m?js/.test(f)) continue;
      const m = /([\w./-]+\.m?js):(\d+)/.exec(f);
      if (m) frames.push({ at: m[1].split("/").pop() + ":" + m[2], wrapper: /\b(runInterval|runTimeout|runTerrainJob)\b/.test(f) });
      if (frames.length === 2) break;
    }
    if (!frames.length) return "?";
    if (frames[0].wrapper && frames[1]) return frames[1].at + " (via " + frames[0].at + ")";
    return frames[0].at;
  };
  const entry = (key) => {
    let t = tasks.get(key);
    if (!t) tasks.set(key, (t = { calls: 0, total: 0, max: 0, samples: [], jobs: 0 }));
    return t;
  };
  // leitura do jogo sem contar nos próprios contadores (getPlayers/getEntities/s)
  const quiet = (fn) => {
    const wasRunning = running;
    running = false;
    try {
      return fn();
    } finally {
      running = wasRunning;
    }
  };
  const TERRAIN = [["space_planets.js", "espaço/planetas"], ["kaioshin_dimension.js", "Kaioshin"], ["future_terrain.js", "Futuro"], ["terrain_repair.js", "reparo"]];
  const FRIEZA_DIM = "dbe:frieza_planet", FRIEZA_BASE = { key: "frieza_army_base", size: 59, margin: 64 };
  const friezaBaseNear = () => {
    try {
      const spot = JSON.parse(world.getDynamicProperty("dbe:world_landmarks") ?? "{}")?.spots?.[FRIEZA_BASE.key];
      if (!spot || spot.placed || spot.none || !Number.isFinite(spot.x) || !Number.isFinite(spot.z)) return false;
      return world.getDimension(FRIEZA_DIM).getPlayers().some(({ location: l }) => {
        const dx = Math.max(spot.x - l.x, 0, l.x - (spot.x + FRIEZA_BASE.size)), dz = Math.max(spot.z - l.z, 0, l.z - (spot.z + FRIEZA_BASE.size));
        return Math.hypot(dx, dz) < FRIEZA_BASE.margin;
      });
    } catch {
      return false;
    }
  };
  // sistema de um job de terreno: pelo rótulo (runTerrainJob label) e, sem rótulo conhecido, pelo arquivo do chamador
  const terrainSystem = (label, at) => {
    if (/^Kaioshin/.test(label)) return "Kaioshin";
    if (/^Future/.test(label)) return "Futuro";
    if (/^Terrain repair/.test(label)) return "reparo";
    return TERRAIN.find(([file]) => at.startsWith(file.replace(/\.js$/, ".")))?.[1] ?? "terreno";
  };
  const record = (key, ms) => {
    const t = entry(key);
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
    const where = site(true);
    const id = orig.call(system, timed("interval(" + (ticks ?? 1) + ") " + where, fn), ticks);
    liveIntervals.set(id, where);
    return id;
  });
  // run/runTimeout são de uso único: só embrulha (e monta a pilha) com a medição ligada. runInterval e runJob ficam
  // embrulhados sempre, porque uma tarefa agendada antes do start continua rodando durante a medição.
  patch(system, "runTimeout", (orig) => function (fn, ticks) {
    return orig.call(system, running ? timed("timeout " + site(), fn) : fn, ticks);
  });
  patch(system, "run", (orig) => function (fn) {
    return orig.call(system, running ? timed("run " + site(), fn) : fn);
  });
  patch(system, "clearRun", (orig) => function (id) {
    liveIntervals.delete(id);
    return orig.call(system, id);
  });
  patch(system, "runJob", (orig) => function (gen) {
    const where = site(true);
    if (running) entry("job " + where).jobs++;
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
  // gancho de terrain_repair.js: wrap(runner, label) é chamado com quem chamou runTerrainJob ainda na pilha
  terrainProbeWrap = (runner, label) => {
    const at = site(true), name = terrainSystem(String(label ?? ""), at);
    const freeza = name === "espaço/planetas" && /^frieza:/.test(String(label ?? "")) && running && quiet(friezaBaseNear);
    const key = "terreno " + name + (freeza ? ", base do Freeza?" : "") + " (" + at.replace(/ \(via .*\)$/, "") + ")";
    if (running) entry(key).jobs++;
    return (function* () {
      while (true) {
        const t0 = running ? Date.now() : 0;
        const step = runner.next();
        if (running) record(key, Date.now() - t0);
        if (step.done) return step.value;
        yield step.value;
      }
    })();
  };
  const countProto = (cls, name, inc) => {
    if (!cls?.prototype) return failures.push(name + ": classe ausente");
    patch(cls.prototype, name, (orig) => function (...args) {
      if (running) inc();
      return orig.apply(this, args);
    });
  };
  countProto(mc.Entity, "setProperty", () => setProperties++);
  countProto(mc.Dimension, "getEntities", () => getEntitiesCalls++);
  countProto(mc.World, "getPlayers", () => getPlayersCalls++);
  countProto(mc.World, "getAllPlayers", () => getPlayersCalls++);
  countProto(mc.Dimension, "getPlayers", () => getPlayersCalls++);
  wrapTask = (name, fn) => timed("every " + name, fn);
  clockInterval = rawInterval;

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

  // dimensão e chunk de cada jogador no momento do report (e a marca da base do Freeza)
  function playerLines() {
    return quiet(() => {
      const lines = [];
      try {
        const near = friezaBaseNear();
        for (const p of world.getPlayers()) {
          const { x, z } = p.location, dim = p.dimension.id;
          lines.push(`  jogador ${p.name}: ${dim} chunk ${Math.floor(x / 16)},${Math.floor(z / 16)}` + (dim === FRIEZA_DIM && near ? " (perto da base do Freeza não colocada)" : ""));
        }
      } catch (e) {
        lines.push("  jogadores: indisponível (" + e + ")");
      }
      return lines.length ? ["§e[perf] jogadores agora:", ...lines] : [];
    });
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
      `§e[perf] intervalos vivos ${liveIntervals.size}; setProperty ${fmt(setProperties / seconds)}/s; getEntities ${fmt(getEntitiesCalls / seconds)}/s; getPlayers ${fmt(getPlayersCalls / seconds)}/s; entidades dbe: ${dbe}, jogadores ${players}.`,
      `§e[perf] tarefas (top ${rows.length} por tempo total): chamadas · média · p95 · máx (ms) · ms/tick. Nos jobs e no "terreno", "chamadas" = jobs iniciados na medição · passos. O relógio do O3 não entra nos intervalos: as tarefas dele são as linhas "every". A linha "interval(1) terrain_repair.js" é a bomba dos jobs de terreno e inclui o tempo deles.`,
      ...rows.map(([k, t]) => `  ${k}: ${k.startsWith("job ") || k.startsWith("terreno ") ? t.jobs + " job(s) iniciado(s) · " + t.calls + " passo(s)" : t.calls} · ${fmt(t.total / Math.max(1, t.calls))} · ${p95(t.samples)} · ${t.max} · ${fmt(t.total / ticks)}`),
      ...playerLines(),
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
      setProperties = getEntitiesCalls = getPlayersCalls = 0;
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
