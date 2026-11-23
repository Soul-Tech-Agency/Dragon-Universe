// Treino de concentração (hL). Movido de core/14_player.js no O4.6; reformulado na 1.7.20 (planos/TREINOS.md §1,
// decisões 8 e 12, CONTRATO §11): grade 3x3 fixa à frente do jogador, com os 9 orbs criados UMA vez por sessão; a cada
// ciclo só muda a cor de cada um (verde +1, vermelho −1, preto encerra, apagado nada). A cor vale em memória e é gravada
// em dbe:color só quando muda (contrato da Aquarela): para 0..2 o script solta a partícula do orbe a cada ciclo; para
// 3 (apagado) o RP mostra sozinho o anel vazado preso à entidade, e o script não solta nada (não duplica). O jogador fica parado (Movement e Jump
// bloqueados, câmera livre). Painel no HUD pelos tokens do título e o subtítulo train_vals; a action bar antiga só
// com CONFIG.TRAINING_HUD_ACTIONBAR. Fim: orb preto, 90 s, Encerrar, ou interrupção (dano, morte, saída, dimensão,
// mais de LEASH blocos do ponto inicial), sempre com a recompensa até ali, a tentativa gasta e os orbs removidos.
// Só conta orb desta sessão (ids em memória): acertar o orb de outro jogador não pontua. Sem chave de save nova.
import { aI, aN, bN, bO } from "../core/01_util.js";
import { CONFIG as hG } from "../config/config.js";
import { InputPermissionCategory as hIP, MolangVariableMap as hH, system as hI } from "@minecraft/server";
import { hD } from "../core/13_ki_attack_hud_level.js";
import { d4 } from "../core/05_db_cooldowns.js";
var hJ = 1,
  hK = { 0: "#00ff22", 1: "#ff0000", 2: "#242424" },
  hL = class {
    constructor(sG) {
      (this.dbePlayer = sG),
        (this.data = sG.data.get("concentration_training") || { highScore: 0, remainingAttempts: 3 });
    }
    data;
    orbs = []; // [{ entity, color }] na ordem das células 0..8 (linha floor(i/3), coluna i%3, 0 = alto à esquerda)
    score = 0;
    combo = 0;
    isTraining = !1;
    session; // { runId, dimensionId, origin, health, countdown, ticksLeft, cycleLeft, lastVals }
    get config() {
      return { ...CONCENTRATION_DEFAULTS, ...(hG.CONCENTRATION ?? {}) };
    }
    get remainingAttempts() {
      return this.data.remainingAttempts;
    }
    get rewardAmount() {
      return Math.min(Math.floor(this.score / 5), this.config.MAX_REWARD);
    }
    get tickSpeed() {
      let { START_CYCLE_TICKS: sG, MIN_CYCLE_TICKS: sH } = this.config;
      return bN(Math.floor(sG - this.score / 5), sH, sG);
    }
    // 0..10: quão perto o ciclo está do mínimo (regra provisória, pergunta H)
    get pace() {
      let { START_CYCLE_TICKS: sG, MIN_CYCLE_TICKS: sH } = this.config;
      return sG <= sH ? 10 : Math.round((10 * (sG - this.tickSpeed)) / (sG - sH));
    }
    checkAndUpdateAttempts() {
      let { cooldowns: sG } = this.dbePlayer,
        sH = sG.getCooldown("concentration_training");
      sH
        ? sH.isExpired() && (sG.clearCooldown("concentration_training"), (this.data.remainingAttempts = 5), this.save())
        : this.remainingAttempts <= 0 &&
          sG.setCooldown("concentration_training", hG.CONCENTRATION_COOLDOWN_TICKS, "absolute_time");
    }
    async claimOrb(sG) {
      if (!this.isTraining || !this.session || this.session.countdown > 0 || !sG.isValid) return;
      let sK = this.orbs.findIndex((sO) => sO.id === sG.id); // só orb desta sessão (corrige o exploit em grupo)
      if (sK < 0) return;
      let sL = this.orbs[sK],
        sM = sL.color,
        { dimension: sH, location: sI } = sG;
      if (sM === ORB_OFF) return;
      this.setOrbColor(sK, ORB_OFF); // um acerto por orb por ciclo
      if (sM === 0) (this.score += 1), (this.combo += 1), sH.playSound("common.ki_blast", sI, { pitch: 1.7 });
      else if (sM === 1)
        (this.score = Math.max(this.score - 1, 0)),
          (this.combo = 0),
          aN.applyCameraShake(this.dbePlayer.player, 0.1, 0.1),
          sH.playSound("common.ki_blast", sI, { pitch: 1.5 });
      else if (sM === 2) {
        sH.playSound("common.ki_blast", sI, { pitch: 0.8 }), this.stopTraining();
        return;
      }
      this.updateHud();
    }
    startTraining() {
      if (this.isTraining || this.dbePlayer.physicalTraining?.active) return;
      let { player: sG } = this.dbePlayer,
        sH = this.config;
      (this.isTraining = !0), (this.score = 0), (this.combo = 0), --this.data.remainingAttempts, this.save();
      this.session = {
        dimensionId: sG.dimension.id,
        origin: { ...sG.location },
        health: this.health(),
        countdown: sH.COUNTDOWN_TICKS,
        ticksLeft: sH.MAX_SESSION_TICKS,
        cycleLeft: 0,
        lastVals: void 0,
      };
      this.dbePlayer.inputPermissionManager.blockInputPermission(
        "concentration",
        [hIP.Movement, hIP.Jump].filter((sI) => sI !== void 0),
      );
      try {
        for (let sL of sG.dimension.getEntities({ type: "dbe:training_orb", location: sG.location, maxDistance: 16 })) removeOrphanOrb(sL);
      } catch {}
      try {
        this.spawnGrid();
      } catch (sI) {
        console.warn("[Concentration] grid failed: " + (sI?.stack ?? sI)), this.finish(!0);
        return;
      }
      let { title: sK } = this.dbePlayer;
      sK.setTitle("train_hud", "conc;");
      this.updateHud();
      this.session.runId = hI.runInterval(() => {
        try {
          this.tick();
        } catch (sL) {
          console.warn("[Concentration] " + (sL?.stack ?? sL)), this.finish(!0);
        }
      }, 1);
    }
    stopTraining() {
      this.finish(!1);
    }
    tick() {
      let sG = this.session;
      if (!sG) return;
      let { player: sH } = this.dbePlayer;
      if (!sH.isValid) return this.finish(!0);
      let sI = this.health();
      if (
        sH.dimension.id !== sG.dimensionId ||
        bO.distance(sH.location, sG.origin) > this.config.LEASH ||
        sI <= 0 ||
        sI < sG.health
      )
        return this.finish(!0);
      sG.health = sI;
      if (sG.countdown > 0) {
        let sK = Math.ceil(sG.countdown / 20);
        this.dbePlayer.title.setTitle("train_count", sK + ";"), sG.countdown--;
        sG.countdown === 0 && (this.dbePlayer.title.setTitle("train_count", void 0), (sG.cycleLeft = 0));
        return;
      }
      if (--sG.ticksLeft <= 0) return this.finish(!1);
      if (--sG.cycleLeft <= 0) this.newCycle(), (sG.cycleLeft = this.tickSpeed);
      sG.ticksLeft % 20 === 0 && this.updateHud();
    }
    // cores do ciclo: a regra de antes (1 verde, 2 vermelhos, 2 pretos) nas 9 células; as outras 4 apagadas
    newCycle() {
      let sG = [0, 1, 1, 2, 2, ORB_OFF, ORB_OFF, ORB_OFF, ORB_OFF];
      for (let sH = sG.length - 1; sH > 0; sH--) {
        let sI = Math.floor(Math.random() * (sH + 1));
        [sG[sH], sG[sI]] = [sG[sI], sG[sH]];
      }
      let sK = this.tickSpeed / 20;
      for (let sL = 0; sL < this.orbs.length; sL++) {
        let sM = this.orbs[sL];
        if (!sM.entity.isValid) this.respawnOrb(sM); // água, pistão, despawn: volta na mesma célula
        this.setOrbColor(sL, sG[sL]);
        if (sM.entity.isValid && sG[sL] !== ORB_OFF) this.spawnOrbParticle(sM.entity.location, sG[sL], sK);
      }
      this.dbePlayer.player.dimension.playSound("common.ki_blast", this.dbePlayer.player.location, { pitch: 3 });
      this.updateHud();
    }
    respawnOrb(sG) {
      try {
        let sH = d4("dbe:training_orb", this.dbePlayer.player.dimension, sG.location);
        sH && (liveOrbIds.delete(sG.id), liveOrbIds.add(sH.id), (sG.entity = sH), (sG.id = sH.id), (sG.color = void 0));
      } catch {}
    }
    setOrbColor(sG, sH) {
      let sI = this.orbs[sG];
      if (!sI || sI.color === sH) return;
      (sI.color = sH);
      try {
        this.dbePlayer.title.setTitle("conc_c" + sG, ORB_TOKEN[sH]);
      } catch {}
      try {
        sI.entity.isValid && sI.entity.setProperty("dbe:color", sH);
      } catch {}
    }
    spawnGrid() {
      let { player: sG } = this.dbePlayer,
        { GRID_DISTANCE: sH, GRID_SPACING: sI } = this.config,
        sK = sG.getViewDirection(),
        sL = bO.normalize({ x: sK.x, y: 0, z: sK.z }),
        sM = { x: -sL.z, y: 0, z: sL.x }, // direita de quem olha para sL
        sN = sG.getHeadLocation(),
        sO = bO.add(sN, bO.scale(sL, sH));
      for (let sP = 0; sP < 9; sP++) {
        let sQ = Math.floor(sP / 3),
          sR = sP % 3,
          sS = bO.add(bO.add(sO, bO.scale(sM, (sR - 1) * sI)), { x: 0, y: (1 - sQ) * sI, z: 0 }),
          sT = d4("dbe:training_orb", sG.dimension, sS);
        if (!sT) throw new Error("orb not spawned at cell " + sP);
        liveOrbIds.add(sT.id), this.orbs.push({ entity: sT, id: sT.id, color: void 0, location: sS }), this.setOrbColor(sP, ORB_OFF);
      }
    }
    spawnOrbParticle(sG, sH, sI) {
      let sK = new hH();
      sK.setColorRGB("color", aI.colorToRgb(hK[sH])), sK.setFloat("age", sI);
      try {
        this.dbePlayer.player.spawnParticle("dbe:concentration_orb", sG, sK);
      } catch {}
    }
    health() {
      try {
        return this.dbePlayer.player.getComponent("minecraft:health")?.currentValue ?? 0;
      } catch {
        return 0;
      }
    }
    // subtítulo train_vals (CONTRATO §11.3): pontos, recompensa/teto, tentativas/máximo, combo, tempo restante
    updateHud() {
      let sG = this.session;
      if (!sG) return;
      let { MAX_REWARD: sH, MAX_ATTEMPTS: sI } = this.config,
        sK = Math.ceil(sG.ticksLeft / 20),
        sL = [this.score, this.rewardAmount + "/" + sH, Math.max(0, this.remainingAttempts) + "/" + sI, "x" + this.combo, sK + "s"].join("\n"),
        { title: sM } = this.dbePlayer;
      sM.setTitle("conc_pace", this.pace + ";");
      sL !== sG.lastVals && ((sG.lastVals = sL), sM.setSubtitle("train_vals", sL));
    }
    finish(sG) {
      if (!this.isTraining) return;
      let sH = this.session;
      (this.isTraining = !1), (this.session = void 0);
      sH?.runId !== void 0 && hI.clearRun(sH.runId);
      let { player: sI, title: sK } = this.dbePlayer;
      // primeiro destrava o jogador: nada que lance depois pode deixá-lo preso
      if (sI.isValid)
        try {
          this.dbePlayer.inputPermissionManager.unblockInputPermission("concentration");
        } catch (sL) {
          console.warn("[Concentration] unblock: " + sL);
        }
      this.removeAllOrbs();
      try {
        for (let sL of ["train_hud", "train_count", "conc_pace", ...Array.from({ length: 9 }, (_, sM) => "conc_c" + sM)])
          sK.setTitle(sL, void 0);
        sK.setSubtitle("train_vals");
      } catch (sL) {
        console.warn("[Concentration] HUD cleanup: " + sL);
      }
      if (!sI.isValid) return; // saiu do mundo: a tentativa já foi gasta e salva no início
      this.score > this.data.highScore && (this.data.highScore = this.score);
      sG && sI.sendMessage({ translate: "ui.dbe.training.concentration.interrupted" });
      this.grantReward(), (this.score = 0), (this.combo = 0), this.checkAndUpdateAttempts(), this.save();
    }
    getDescription() {
      return {
        rawtext: [
          {
            translate: "minigame.concentration.text",
            with: {
              rawtext: [
                { text: this.score + "\n" },
                { text: this.rewardAmount + " " },
                { text: "\n" },
                { text: "" + this.remainingAttempts },
              ],
            },
          },
        ],
      };
    }
    grantReward() {
      if (this.rewardAmount <= 0) return;
      let sG = new hD({ type: "points", pointType: "attribute_points", amount: this.rewardAmount });
      sG.tryGrantReward(this.dbePlayer), sG.sendRewardMessage(this.dbePlayer);
    }
    removeAllOrbs() {
      for (let { entity: sG, id: sH } of this.orbs) {
        liveOrbIds.delete(sH);
        try {
          sG.isValid && sG.remove();
        } catch {}
      }
      this.orbs.length = 0;
    }
    save() {
      this.dbePlayer.data.set("concentration_training", this.data);
    }
  };
// ids dos orbs de sessões vivas (todas): um dbe:training_orb fora daqui é órfão (mundo reaberto, jogador que saiu) e sai
const liveOrbIds = new Set();
/** Remove o orb se ele não pertence a nenhuma sessão viva. Devolve true se removeu. */
export function removeOrphanOrb(entity) {
  try {
    if (entity?.typeId !== "dbe:training_orb" || !entity.isValid || liveOrbIds.has(entity.id)) return !1;
    entity.remove();
    return !0;
  } catch {
    return !1;
  }
}
const ORB_OFF = 3, // apagado: não faz nada
  ORB_TOKEN = { 0: "g;", 1: "r;", 2: "k;", 3: "o;" },
  CONCENTRATION_DEFAULTS = {
    GRID_DISTANCE: 2.5, GRID_SPACING: 0.8, START_CYCLE_TICKS: 20, MIN_CYCLE_TICKS: 6, MAX_SESSION_TICKS: 1800,
    MAX_REWARD: 10, MAX_ATTEMPTS: 5, COUNTDOWN_TICKS: 60, LEASH: 3, COMBO_MULTIPLIES: false,
  };
export { hJ, hK, hL };
