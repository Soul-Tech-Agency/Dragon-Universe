// Treino mental: luta contra a réplica de um chefe já derrotado (planos/TREINOS.md §3; decisões 12–15; CONTRATO §12 e
// §13.3; registro de chefes em progression/progression.js). Duas dificuldades: Memória (o nível da missão original) e
// Desafio (nível do jogador × CHALLENGE_LEVEL_MULT, mesmo foco de atributos).
//   - A réplica é o próprio chefe (mesmo typeId, decisão 14a) com a tag dbe:mental_replica e as dynamic properties
//     dbe:mental_owner (= id do dono) e dbe:spawned_by ("mental_<id>"). Ela surge a ~6 blocos, no lugar onde o jogador
//     está (decisão 15a), depois da contagem 3-2-1.
//   - Só o dono causa dano nela. O golpe que a mataria é cancelado e vira vitória: ela some com a partícula de saída,
//     sem morrer (sem loot, sem XP/zeni por abate, sem evento de morte; missão, conquista e registro não contam).
//   - O combate mental não mata: dano letal no jogador durante a luta deixa a vida em 1 e encerra ("a mente cedeu").
//   - Fim por vitória, derrota, tempo (TIME_LIMIT_TICKS), desistência (tela Treino), saída, morte, troca de dimensão,
//     ou o dono a mais de LEASH blocos. A réplica sai sempre (mental_exit) e a névoa dbe:fog_mental também.
//   - O gancho de dano roda dentro de world.beforeEvents.entityHurt (só leitura): ele só decide e cancela. Vitória e
//     derrota marcam session.ending e o fim de verdade (vida 1, remover a réplica, névoa, recompensa) roda no
//     system.run seguinte; até lá, todo dano à réplica e todo dano letal ao dono continuam cancelados.
//   - Recompensa: 1ª vitória por chefe e dificuldade = pontos de habilidade (e AP no Desafio), uma vez só; vitória
//     repetida = REPEAT_XP_PCT do XP do próximo nível, no máximo DAILY_REPEATS por dia (cooldown mental_training_daily);
//     o mesmo chefe 1 vez por dia (cooldown mental:<chefe>, marcado na vitória).
// Save (aprovado, decisão B): mental_training = { v: 1, clears: { <chefe>: { memory, challenge, best } }, daily }.
import { system, world, MolangVariableMap } from "@minecraft/server";
import { CONFIG } from "../config/config.js";
import { late } from "../core/late.js";
import { d2 } from "../core/05_db_cooldowns.js";
import { fC } from "../core/11_entity_wrapper.js";
import { hD } from "../core/13_ki_attack_hud_level.js";
import { cT } from "../core/04_tournament_dims.js";
import { hasDefeated, BOSS_IDS, MENTAL_REPLICA_TAG } from "../progression/progression.js";
import { main_quests_data } from "../data/main_quests_data.js";

const DEFAULTS = {
  TIME_LIMIT_TICKS: 3600,
  DAILY_REPEATS: 3,
  DAILY_COOLDOWN_TICKS: 24000,
  BOSS_COOLDOWN_TICKS: 24000,
  CHALLENGE_LEVEL_MULT: 1.1,
  DEBUG_DAMAGE: false, // true só no teste: log (1x por sessão e origem) de dano na réplica que não veio do dono: conferir ki/explosão/combo
  LEASH: 32,
  SPAWN_RADIUS: 6,
  COUNTDOWN_TICKS: 60,
  AURA_EVERY_TICKS: 10,
  REPEAT_XP_PCT: 0.25,
  FIRST_CLEAR: { memory: { skill: 1, ap: 0 }, challenge: { skill: 2, ap: 3 } },
  // provisório (pergunta ao usuário): a réplica perde o que tornaria a luta impossível ou sem dano (Beerus da campanha)
  REPLICA_STRIP: ["alwaysDodge", "friendlyDamage", "spawnOnStart"],
};
const SAVE_KEY = "mental_training";
const DAILY_COOLDOWN = "mental_training_daily";
const bossCooldown = (bossId) => "mental:" + bossId;

const sessionsByOwner = new Map(); // id do jogador → sessão
const sessionsByReplica = new Map(); // id da réplica → sessão

export const isMentalReplica = (entity) => {
  try {
    return !!entity?.hasTag?.(MENTAL_REPLICA_TAG);
  } catch {
    return false;
  }
};

/** Réplica sem sessão viva (mundo reaberto, dono que saiu): sai. Devolve true se removeu. */
export function removeOrphanReplica(entity) {
  try {
    if (!entity?.isValid || sessionsByReplica.has(entity.id)) return false;
    if (!isMentalReplica(entity) && !entity.getDynamicProperty("dbe:mental_owner")) return false;
    entity.remove();
    return true;
  } catch {
    return false;
  }
}

/** Definições de poder da réplica na Memória: as da 1ª tarefa defeat_enemy do chefe nas missões principais. */
function memoryDefinitions(bossId) {
  for (const q of main_quests_data)
    for (const o of q.objectives ?? []) for (const t of o.tasks ?? []) if (t.type === "defeat_enemy" && t.entity === bossId && t.entityDefinitions) return t.entityDefinitions;
  return fC.getDBEEntityDataByTypeId(bossId)?.entityDefinitions;
}
function replicaDefinitions(bossId, difficulty, playerLevel, c) {
  const base = { ...(memoryDefinitions(bossId) ?? {}) };
  for (const key of c.REPLICA_STRIP) delete base[key];
  if (difficulty === "challenge") {
    const power = { ...(base.powerDefinition ?? {}) };
    power.level = Math.max(1, Math.round(playerLevel * c.CHALLENGE_LEVEL_MULT));
    base.powerDefinition = power;
  }
  return base;
}
export function memoryLevel(bossId) {
  return memoryDefinitions(bossId)?.powerDefinition?.level ?? 1;
}
export const formatTicks = (ticks) => {
  const s = Math.max(0, Math.round(ticks / 20));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

/**
 * Gancho do serviço de dano (core/16_damage.js), antes de aplicar o dano. Devolve true quando o dano deve ser
 * cancelado. hurtEntity/hurtDbe: quem leva; damager: a entidade que causou (ou undefined); health: a barra de vida dbe.
 */
export function mentalDamageHook(hurtEntity, hurtDbe, damager, damage, health, cause) {
  const lethal = () => health.currentValue - Math.floor(damage - health.getDamageReduction(damage)) <= 0;
  const asReplica = sessionsByReplica.get(hurtEntity.id);
  if (asReplica) {
    if (asReplica.ending || asReplica.countdown > 0) return true;
    if (!damager || damager.id !== asReplica.ownerId) {
      // só o dono causa dano na réplica; o log ajuda a conferir no jogo se ki/explosão/combo chegam como o jogador
      if (asReplica.training.config.DEBUG_DAMAGE) {
        const key = (damager?.typeId ?? "none") + "|" + (cause ?? "?");
        if (!asReplica.loggedDamage.has(key)) {
          asReplica.loggedDamage.add(key);
          console.warn("[Mental training] damage on replica ignored: damager=" + (damager?.typeId ?? "none") + " cause=" + (cause ?? "?"));
        }
      }
      return true;
    }
    if (lethal()) return endLater(asReplica, "win"), true;
    return false;
  }
  const asOwner = sessionsByOwner.get(hurtEntity.id);
  if (asOwner && lethal()) {
    // o combate mental não mata: o dano é cancelado agora; a vida 1 e o fim vêm no tick seguinte
    if (!asOwner.ending) endLater(asOwner, "lose", health);
    return true;
  }
  return false;
}
// marca o fim e adia as escritas para fora do beforeEvent (system.run)
function endLater(session, outcome, health) {
  session.ending = outcome;
  system.run(() => {
    if (health)
      try {
        health.setCurrent(1);
      } catch {}
    session.training.finish(outcome);
  });
}

export class MentalTraining {
  constructor(dbePlayer) {
    this.dbePlayer = dbePlayer;
    const saved = dbePlayer.data.get(SAVE_KEY) ?? {};
    this.data = { v: 1, clears: {}, daily: 0, ...saved };
    this.session = undefined;
  }
  get config() {
    return { ...DEFAULTS, ...(CONFIG.MENTAL ?? {}) };
  }
  get active() {
    return !!this.session;
  }
  save() {
    this.dbePlayer.data.set(SAVE_KEY, this.data);
  }
  /** Vitórias repetidas que já contaram hoje (zera quando a recarga do dia vence). */
  get dailyDone() {
    const { cooldowns } = this.dbePlayer, cd = cooldowns.getCooldown(DAILY_COOLDOWN);
    if (cd?.isExpired()) {
      cooldowns.clearCooldown(DAILY_COOLDOWN);
      this.data.daily = 0;
      this.save();
    } else if (!cd && this.data.daily) {
      this.data.daily = 0;
      this.save();
    }
    return this.data.daily ?? 0;
  }
  /** Cooldown do dia quando o limite de vitórias repetidas foi atingido (para a tela Treino), senão undefined. */
  dailyCooldown() {
    return this.dailyDone >= this.config.DAILY_REPEATS ? this.dbePlayer.cooldowns.getCooldown(DAILY_COOLDOWN) : undefined;
  }
  clearsOf(bossId) {
    return this.data.clears[bossId] ?? { memory: 0, challenge: 0, best: 0 };
  }
  isUnlocked(bossId) {
    return hasDefeated(this.dbePlayer, bossId);
  }
  /** Motivo (sufixo de ui.dbe.training.mental.blocked.<motivo>) que impede começar, ou undefined. */
  blockedReason(bossId, difficulty) {
    const p = this.dbePlayer, player = p.player, c = this.config;
    if (!BOSS_IDS.includes(bossId) || !this.isUnlocked(bossId)) return "locked";
    if (this.active || p.concentrationTraining?.isTraining || p.physicalTraining?.active) return "busy";
    const bossCd = p.cooldowns.getCooldown(bossCooldown(bossId));
    if (bossCd && !bossCd.isExpired()) return "boss_today";
    const firstPending = !this.clearsOf(bossId)[difficulty];
    if (!firstPending && this.dailyDone >= c.DAILY_REPEATS) return "daily_limit";
    if (p.isKnockedOut) return "knocked";
    if (p.getCurrentFusion?.()) return "fusion";
    if (cT.inTournament(player)) return "tournament";
    if (p.tasks.getActiveTasksByType("defeat_enemy").some((t) => t.spawnedEntities?.some((e) => e?.isValid))) return "quest";
    return undefined;
  }
  start(bossId, difficulty) {
    const reason = this.blockedReason(bossId, difficulty);
    if (reason) return reason;
    const p = this.dbePlayer, player = p.player, c = this.config;
    this.session = {
      training: this,
      ownerId: player.id,
      bossId,
      difficulty,
      dimensionId: player.dimension.id,
      origin: { ...player.location },
      countdown: c.COUNTDOWN_TICKS,
      ticks: 0,
      replica: undefined,
      replicaDbe: undefined,
      lastVals: undefined,
      lastHp: undefined,
      ending: undefined,
      loggedDamage: new Set(),
    };
    sessionsByOwner.set(player.id, this.session);
    try {
      player.runCommand("fog @s push dbe:fog_mental dbe_mental");
    } catch {}
    p.title.setTitle("train_hud", "ment;");
    this.session.runId = system.runInterval(() => {
      try {
        this.tick();
      } catch (error) {
        console.warn("[Mental training] " + (error?.stack ?? error));
        this.finish("cancel");
      }
    }, 1);
    return undefined;
  }
  stop() {
    this.finish("cancel");
  }
  spawnReplica() {
    const s = this.session, p = this.dbePlayer, player = p.player, c = this.config;
    const at = d2(player.dimension, player.location, c.SPAWN_RADIUS);
    if (!at) throw new Error("no free spot for the replica");
    const defs = replicaDefinitions(s.bossId, s.difficulty, p.level.currentLevel, c);
    const dbe = late.i3.trySpawnDBEEntity(s.bossId, player.dimension, at, { entityDefinitions: defs });
    const entity = dbe?.entity;
    if (!entity) throw new Error("replica not spawned: " + s.bossId);
    entity.addTag(MENTAL_REPLICA_TAG);
    entity.setDynamicProperty("dbe:mental_owner", player.id);
    entity.setDynamicProperty("dbe:spawned_by", "mental_" + player.id);
    s.replica = entity;
    s.replicaId = entity.id;
    s.replicaDbe = dbe;
    sessionsByReplica.set(entity.id, s);
    this.particle("dbe:mental_enter", entity.location);
    this.particle("dbe:mental_enter", player.location);
    try {
      player.dimension.playSound("common.teleport2", at);
    } catch {}
  }
  particle(id, location) {
    try {
      const vars = new MolangVariableMap();
      this.dbePlayer.player.dimension.spawnParticle(id, location, vars);
    } catch {}
  }
  tick() {
    const s = this.session;
    if (!s) return;
    const p = this.dbePlayer, player = p.player, c = this.config;
    if (s.ending) return; // o fim já foi marcado pelo gancho de dano; o finish roda no system.run
    if (!player.isValid) return this.finish("cancel");
    if (player.dimension.id !== s.dimensionId) return this.finish("cancel");
    if (s.countdown > 0) {
      p.title.setTitle("train_count", Math.ceil(s.countdown / 20) + ";");
      if (--s.countdown === 0) {
        p.title.setTitle("train_count", undefined);
        p.title.setTitle("ment_mode", s.difficulty + ";"); // 38237c1: o modo vai por token; a 2ª linha do train_vals fica vazia
        this.spawnReplica();
        this.updateHud();
      }
      return;
    }
    const replica = s.replica;
    if (!replica?.isValid) return this.finish("cancel"); // sumiu por outro caminho: sem vitória
    const dx = player.location.x - replica.location.x, dz = player.location.z - replica.location.z;
    if (Math.hypot(dx, dz) > c.LEASH) return this.finish("cancel");
    if (++s.ticks >= c.TIME_LIMIT_TICKS) return this.finish("timeout");
    if (s.ticks % c.AURA_EVERY_TICKS === 0) this.particle("dbe:mental_replica_aura", replica.location);
    if (s.ticks % 5 === 0) this.updateHud();
  }
  updateHud() {
    const s = this.session;
    if (!s) return;
    const p = this.dbePlayer, c = this.config, health = s.replicaDbe?.health;
    const hp = health ? Math.max(0, Math.min(10, Math.round((10 * health.currentValue) / Math.max(1, health.maxValue)))) : 10;
    if (hp !== s.lastHp) (s.lastHp = hp), p.title.setTitle("ment_boss_hp", hp + ";");
    const vals = formatTicks(c.TIME_LIMIT_TICKS - s.ticks) + "\n";
    if (vals !== s.lastVals) (s.lastVals = vals), p.title.setSubtitle("train_vals", vals);
  }
  /** outcome: "win" | "lose" | "timeout" | "cancel". Um caminho só de fim: réplica, névoa, HUD, recompensa e save. */
  finish(outcome) {
    const s = this.session;
    if (!s) return;
    this.session = undefined;
    sessionsByOwner.delete(s.ownerId);
    if (s.replicaId) sessionsByReplica.delete(s.replicaId);
    const p = this.dbePlayer, player = p.player, c = this.config;
    try {
      system.clearRun(s.runId);
    } catch {}
    try {
      if (s.replica?.isValid) {
        this.particle("dbe:mental_exit", s.replica.location);
        s.replica.remove();
      }
    } catch {}
    try {
      for (const key of ["train_hud", "train_count", "ment_boss_hp", "ment_mode"]) p.title.setTitle(key, undefined);
      p.title.setSubtitle("train_vals");
    } catch {}
    if (!player.isValid) return;
    try {
      player.runCommand("fog @s remove dbe_mental");
    } catch {}
    if (outcome !== "win") {
      player.sendMessage({ translate: "ui.dbe.training.mental." + (outcome === "lose" ? "lose" : outcome === "timeout" ? "timeout" : "cancel") });
      return;
    }
    // (sem MIN_DAMAGE_SHARE: só o dono consegue causar dano na réplica, então a parte dele é sempre 100%)
    const clears = { ...this.clearsOf(s.bossId) };
    const first = !clears[s.difficulty];
    clears[s.difficulty] = (clears[s.difficulty] ?? 0) + 1;
    if (!clears.best || s.ticks < clears.best) clears.best = s.ticks;
    this.data.clears[s.bossId] = clears;
    p.cooldowns.setCooldown(bossCooldown(s.bossId), c.BOSS_COOLDOWN_TICKS, "absolute_time");
    if (first) {
      const r = c.FIRST_CLEAR[s.difficulty] ?? { skill: 0, ap: 0 };
      if (r.skill) new hD({ type: "points", pointType: "skill_points", amount: r.skill }).tryGrantReward(p);
      if (r.ap) new hD({ type: "points", pointType: "attribute_points", amount: r.ap }).tryGrantReward(p);
      player.sendMessage({ translate: "ui.dbe.training.mental.win_first", with: [formatTicks(s.ticks)] });
    } else {
      const xp = Math.floor(c.REPEAT_XP_PCT * p.level.getPointsToNextLevel());
      if (!p.cooldowns.getCooldown(DAILY_COOLDOWN)) p.cooldowns.setCooldown(DAILY_COOLDOWN, c.DAILY_COOLDOWN_TICKS, "absolute_time");
      this.data.daily = (this.data.daily ?? 0) + 1;
      p.level.addPoints(xp);
      player.sendMessage({ translate: "ui.dbe.training.mental.win", with: [formatTicks(s.ticks), String(xp)] });
    }
    this.save();
  }
}
