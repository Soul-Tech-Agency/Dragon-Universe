// Treino físico: flexões com o agachar (planos/TREINOS.md §2; decisões 9, 10, 11 e 12; CONTRATO §11; contrato do RP com
// a Aquarela). Uma série de 20, 30 ou 50 flexões; o jogador fica no lugar (Movement, Jump e Mount bloqueados; o agachar
// fica livre). Cada repetição: pausa curta (… "wait"), DESÇA ("down": segurar o agachar), SUBA ("up": soltar).
//   - fase de baixo e fase de cima >= MIN_PHASE_TICKS; do pedido de descer até soltar <= MAX_CYCLE_TICKS, senão
//     "ritmo perdido"; apertar antes do pedido = repetição inválida; a pausa antes de cada pedido tem 0..CUE_JITTER ticks
//     a mais (um macro de ritmo fixo erra a sincronia).
//   - "embaixo" = agachando OU, com o modo alternativo ligado (tela de séries, decisão 10a), depois de um uso do item
//     dbe:functions (slot 8; cada uso troca de fase). Desligado, só o agachar conta.
//   - a fase vai para o cliente pelo dbe:fly_mode: "pushup" (em cima) e "pushup_down" (embaixo), só quando muda, pela
//     API do voo (rP: setFlyModeProperty + forgetFlyCache), como manda o contrato do dbe:fly_mode.
//   - cada repetição válida gasta STAMINA_PER_REP de vigor; sem vigor a série pausa (sem perder o progresso).
//   - fim: série completa; Encerrar (tela Treino ou o item dbe:menu); dano, morte, saída, troca de dimensão ou
//     AFK_TICKS sem responder (interrompida, paga INTERRUPTED_PAY). Pagamento uma vez, no fim: XP por repetição =
//     ceil(XP_PER_REP_PCT × XP do próximo nível) × min(multiplicador de treino, MULT_CAP). Sem repetição válida, a série
//     não é gasta.
// Save (chave aprovada, decisão A): physical_training = { v: 1, seriesLeft, totalReps, bestSeries, altMode }; cooldown
// "physical_training" (absolute_time) recarrega as séries do dia.
import { system, InputPermissionCategory } from "@minecraft/server";
import { CONFIG } from "../config/config.js";
import { cT } from "../core/04_tournament_dims.js";

const DEFAULTS = {
  SERIES: [20, 30, 50],
  SERIES_MIN_LEVEL: { 50: 30 },
  MIN_PHASE_TICKS: 8,
  MAX_CYCLE_TICKS: 60,
  CUE_JITTER: 10,
  AFK_TICKS: 100,
  DAILY_SERIES: 3,
  COOLDOWN_TICKS: 24000,
  XP_PER_REP_PCT: 0.004,
  MULT_CAP: 3,
  STAMINA_PER_REP: 5,
  INTERRUPTED_PAY: 0.5,
  COUNTDOWN_TICKS: 60,
  RECENT_DAMAGE_TICKS: 200,
  LEASH: 1.5,
  BLOCK_ON_BOSS_FIGHT: true, // pergunta I (provisório): bloqueia com tarefa defeat_enemy ativa e chefe surgido
};
const PUSHUP_MODES = new Set(["pushup", "pushup_down"]);
const SAVE_KEY = "physical_training";
const COOLDOWN = "physical_training";

export const isPushupMode = (mode) => PUSHUP_MODES.has(mode);

export class PhysicalTraining {
  constructor(dbePlayer) {
    this.dbePlayer = dbePlayer;
    this.data = { v: 1, seriesLeft: this.config.DAILY_SERIES, totalReps: 0, bestSeries: 0, altMode: false, ...(dbePlayer.data.get(SAVE_KEY) ?? {}) };
    this.session = undefined;
    // quem saiu no meio de uma série volta com a pose da flexão: ela sai aqui (sem cache de voo para invalidar ainda)
    try {
      if (isPushupMode(dbePlayer.player.getProperty("dbe:fly_mode"))) dbePlayer.trySetProperty("dbe:fly_mode", "none");
    } catch {}
  }
  get config() {
    return { ...DEFAULTS, ...(CONFIG.PHYSICAL ?? {}) };
  }
  get active() {
    return !!this.session;
  }
  get seriesDone() {
    return Math.max(0, this.config.DAILY_SERIES - this.data.seriesLeft);
  }
  save() {
    this.dbePlayer.data.set(SAVE_KEY, this.data);
  }
  /** Recarrega as séries do dia quando a recarga venceu. Devolve o cooldown em andamento, se houver. */
  checkSeries() {
    const { cooldowns } = this.dbePlayer, cd = cooldowns.getCooldown(COOLDOWN);
    if (cd?.isExpired()) {
      cooldowns.clearCooldown(COOLDOWN);
      this.data.seriesLeft = this.config.DAILY_SERIES;
      this.save();
      return undefined;
    }
    if (!cd && this.data.seriesLeft <= 0) return cooldowns.setCooldown(COOLDOWN, this.config.COOLDOWN_TICKS, "absolute_time");
    return cd;
  }
  toggleAltMode() {
    this.data.altMode = !this.data.altMode;
    this.save();
  }
  /** XP de uma repetição válida agora (antes do teto de metade da interrompida). */
  xpPerRep() {
    const { level } = this.dbePlayer, c = this.config;
    return Math.ceil(c.XP_PER_REP_PCT * level.getPointsToNextLevel()) * Math.min(this.dbePlayer.trainingMultiplier ?? 1, c.MULT_CAP);
  }
  /** Fração de um nível que uma série completa de `goal` paga (para o texto da tela de séries). */
  rewardShare(goal) {
    const { level } = this.dbePlayer;
    return (goal * this.xpPerRep()) / Math.max(1, level.getPointsToNextLevel());
  }
  /** Motivo (sufixo da chave ui.dbe.training.physical.blocked.<motivo>) que impede começar, ou undefined. */
  blockedReason(goal) {
    const p = this.dbePlayer, player = p.player, c = this.config;
    if (this.active || p.concentrationTraining?.isTraining || p.mentalTraining?.active) return "busy";
    if ((c.SERIES_MIN_LEVEL[goal] ?? 0) > p.level.currentLevel) return "level";
    if (this.checkSeries() || this.data.seriesLeft <= 0) return "daily";
    if (p.isKnockedOut) return "knocked";
    if (p.getCurrentFusion?.()) return "fusion";
    if (p.isLoadingAttack) return "charging";
    if (p.skills.getToggleSkill("fly")?.isEnabled) return "flying";
    if (player.getComponent("minecraft:riding")?.entityRidingOn) return "riding";
    if (player.isInWater) return "water";
    if (!player.isOnGround) return "ground";
    if (cT.inTournament(player)) return "tournament";
    if (system.currentTick - (p.lastHurtTick ?? -Infinity) < c.RECENT_DAMAGE_TICKS) return "damage";
    if (c.BLOCK_ON_BOSS_FIGHT && p.tasks.getActiveTasksByType("defeat_enemy").some((t) => t.spawnedEntities?.some((e) => e?.isValid)))
      return "quest";
    return undefined;
  }
  /** Começa a série (o chamador já mostrou o motivo, se blockedReason devolveu um). */
  start(goal) {
    const reason = this.blockedReason(goal);
    if (reason) return reason;
    const p = this.dbePlayer, player = p.player, c = this.config;
    this.session = {
      goal,
      reps: 0,
      dimensionId: player.dimension.id,
      origin: { ...player.location },
      startTick: system.currentTick,
      countdown: c.COUNTDOWN_TICKS,
      state: "wait",
      timer: c.MIN_PHASE_TICKS,
      cueTick: 0,
      pressTick: 0,
      lastInput: system.currentTick,
      altDown: false,
      down: false,
      mode: undefined,
      lastVals: undefined,
      lastStamina: undefined,
      earlyWarned: false,
    };
    p.inputPermissionManager.blockInputPermission("physical_training",
      [InputPermissionCategory.Movement, InputPermissionCategory.Jump, InputPermissionCategory.Mount].filter((x) => x !== undefined));
    // quem começa com o slot 8 selecionado estaria com a guarda ligada (is_defending), que muda a pose
    try {
      p.guard?.isGuarding && p.guard.breakGuard();
    } catch {}
    this.setMode("pushup");
    p.title.setTitle("train_hud", "phys;");
    this.updateHud();
    this.session.runId = system.runInterval(() => {
      try {
        this.tick();
      } catch (error) {
        console.warn("[Physical training] " + (error?.stack ?? error));
        this.finish("interrupted");
      }
    }, 1);
    return undefined;
  }
  /** Item dbe:functions durante a série: troca de fase, só com o modo alternativo ligado. */
  onFunctionsItem() {
    if (!this.session || !this.data.altMode) return;
    this.session.altDown = !this.session.altDown;
  }
  stop() {
    this.finish("interrupted");
  }
  isDown() {
    const s = this.session;
    let sneaking = false;
    try {
      sneaking = this.dbePlayer.player.isSneaking;
    } catch {}
    return sneaking || s.altDown;
  }
  // fase para o cliente (RP): pela API do voo, para o cache dele não reescrever um valor velho
  setMode(mode) {
    const s = this.session;
    if (s && s.mode === mode) return;
    if (s) s.mode = mode;
    const fly = this.dbePlayer.skills.getToggleSkill("fly");
    try {
      if (fly && typeof fly.setFlyModeProperty === "function") {
        fly.forgetFlyCache?.();
        fly.setFlyModeProperty(mode);
      } else this.dbePlayer.trySetProperty("dbe:fly_mode", mode);
    } catch (error) {
      console.warn("[Physical training] fly_mode: " + error);
    }
  }
  tick() {
    const s = this.session;
    if (!s) return;
    const p = this.dbePlayer, player = p.player, c = this.config, now = system.currentTick;
    if (!player.isValid) return this.finish("interrupted");
    let health = 0;
    try {
      health = player.getComponent("minecraft:health")?.currentValue ?? 0;
    } catch {}
    if (player.dimension.id !== s.dimensionId || health <= 0 || (p.lastHurtTick ?? -Infinity) > s.startTick ||
      Math.hypot(player.location.x - s.origin.x, player.location.z - s.origin.z) > c.LEASH)
      return this.finish("interrupted");
    const down = this.isDown();
    if (down !== s.down) (s.down = down), (s.lastInput = now);
    this.setMode(down ? "pushup_down" : "pushup");
    if (s.countdown > 0) {
      p.title.setTitle("train_count", Math.ceil(s.countdown / 20) + ";");
      if (--s.countdown === 0) p.title.setTitle("train_count", undefined), (s.lastInput = now);
      return;
    }
    const stamina = p.stamina;
    switch (s.state) {
      case "wait": // pausa antes do pedido: apertar aqui é cedo demais (avisa uma vez e espera soltar)
        this.cue("wait");
        if (down) {
          if (!s.earlyWarned) (s.earlyWarned = true), this.invalid("early");
          return;
        }
        s.earlyWarned = false;
        if (--s.timer > 0) return;
        if (stamina.currentValue < c.STAMINA_PER_REP) return; // sem vigor: pausa até regenerar
        s.state = "down", s.cueTick = now, s.lastInput = now;
        break;
      case "down": // DESÇA: esperando apertar
        this.cue("down");
        if (down) s.state = "hold", s.pressTick = now;
        break;
      case "hold": // embaixo: segurar MIN_PHASE_TICKS
        this.cue("down");
        if (!down) return this.invalid("early");
        if (now - s.pressTick >= c.MIN_PHASE_TICKS) s.state = "up";
        break;
      case "up": // SUBA: esperando soltar
        this.cue("up");
        if (down) break;
        if (now - s.cueTick > c.MAX_CYCLE_TICKS) return this.invalid("lost");
        s.reps++;
        stamina.removeCurrent(c.STAMINA_PER_REP);
        if (s.reps >= s.goal) return this.finish("complete");
        s.state = "wait", s.timer = c.MIN_PHASE_TICKS + Math.floor(Math.random() * (c.CUE_JITTER + 1));
        break;
    }
    if (s.state !== "wait" && now - s.lastInput > c.AFK_TICKS) return this.finish("interrupted");
    if (s.state === "up" && now - s.cueTick > c.MAX_CYCLE_TICKS + c.AFK_TICKS) return this.finish("interrupted");
    if (now % 5 === 0) this.updateHud();
  }
  cue(value) {
    this.dbePlayer.title.setTitle("phys_cue", value + ";");
  }
  // repetição inválida (cedo demais ou ritmo perdido): não conta; recomeça a pausa depois de soltar
  invalid(kind) {
    const s = this.session, c = this.config;
    try {
      this.dbePlayer.player.onScreenDisplay.setActionBar({ translate: "ui.dbe.training.physical." + kind });
    } catch {}
    s.state = "wait", s.timer = c.MIN_PHASE_TICKS + Math.floor(Math.random() * (c.CUE_JITTER + 1));
    this.updateHud();
  }
  updateHud() {
    const s = this.session;
    if (!s) return;
    const p = this.dbePlayer, c = this.config, now = system.currentTick;
    const stamina = Math.round((10 * p.stamina.currentValue) / Math.max(1, p.stamina.maxValue));
    if (stamina !== s.lastStamina) (s.lastStamina = stamina), p.title.setTitle("phys_stamina", stamina + ";");
    const idle = s.state === "wait" ? 0 : now - s.lastInput;
    const afk = idle > c.AFK_TICKS / 2 ? Math.max(0, Math.ceil((c.AFK_TICKS - idle) / 20)) + "s" : "";
    const vals = [s.reps + "/" + s.goal, this.seriesDone + "/" + c.DAILY_SERIES, afk].join("\n");
    if (vals !== s.lastVals) (s.lastVals = vals), p.title.setSubtitle("train_vals", vals);
  }
  /** outcome: "complete" | "interrupted". Um finally só (TREINOS §2.3): destrava, pose, HUD, pagamento e save. */
  finish(outcome) {
    const s = this.session;
    if (!s) return;
    this.session = undefined;
    const p = this.dbePlayer, player = p.player, c = this.config;
    try {
      system.clearRun(s.runId);
    } catch {}
    if (player.isValid)
      try {
        p.inputPermissionManager.unblockInputPermission("physical_training");
      } catch (error) {
        console.warn("[Physical training] unblock: " + error);
      }
    try {
      if (player.isValid) {
        const fly = p.skills.getToggleSkill("fly");
        if (fly && typeof fly.setFlyModeProperty === "function") fly.forgetFlyCache?.(), fly.setFlyModeProperty("none");
        else p.trySetProperty("dbe:fly_mode", "none");
      }
    } catch {}
    try {
      for (const key of ["train_hud", "train_count", "phys_cue", "phys_stamina"]) p.title.setTitle(key, undefined);
      p.title.setSubtitle("train_vals");
    } catch (error) {
      console.warn("[Physical training] HUD cleanup: " + error);
    }
    if (!player.isValid || s.reps <= 0) {
      if (player.isValid) player.sendMessage({ translate: "ui.dbe.training.physical.none" });
      return; // sem repetição válida: a série não é gasta
    }
    let xp = s.reps * this.xpPerRep();
    if (outcome !== "complete") xp = Math.floor(xp * c.INTERRUPTED_PAY);
    p.level.addPoints(xp);
    this.data.seriesLeft = Math.max(0, this.data.seriesLeft - 1);
    this.data.totalReps += s.reps;
    this.data.bestSeries = Math.max(this.data.bestSeries, s.reps);
    this.save();
    this.checkSeries();
    player.sendMessage({
      translate: outcome === "complete" ? "ui.dbe.training.physical.summary" : "ui.dbe.training.physical.interrupted",
      with: [String(s.reps), String(xp)],
    });
  }
}
