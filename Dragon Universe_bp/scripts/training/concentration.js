// Treino de concentração (hL) e as constantes que só ele usa (hJ, hK: cores do painel). Movido de core/14_player.js SEM
// mudança de código (O4.6; decisão do Arquiteto). O jogador (hN) cria new hL(this) no construtor, em tempo de chamada.
import { aI, aN, aO, bN, bO, bP } from "../core/01_util.js";
import { CONFIG as hG } from "../config/config.js";
import { MolangVariableMap as hH, system as hI } from "@minecraft/server";
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
    orbs = [];
    score = 0;
    isTraining = !1;
    get remainingAttempts() {
      return this.data.remainingAttempts;
    }
    get rewardAmount() {
      return Math.floor(this.score / 5);
    }
    get tickSpeed() {
      return bN(Math.floor(20 - this.score / 5), 1, 20);
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
      if (!sG.isValid) return;
      let { dimension: sH, location: sI } = sG,
        sK = sG.getProperty("dbe:color");
      if (
        (sK === 0 && ((this.score += 1), sH.playSound("common.ki_blast", sI, { pitch: 1.7 })),
        sK === 1 &&
          ((this.score = Math.max(this.score - 1, 0)),
          aN.applyCameraShake(this.dbePlayer.player, 0.1, 0.1),
          sH.playSound("common.ki_blast", sI, { pitch: 1.5 })),
        sK === 2)
      ) {
        this.stopTraining(), sH.playSound("common.ki_blast", sI, { pitch: 0.8 });
        return;
      }
      sG.remove();
    }
    startTraining() {
      (this.isTraining = !0), --this.data.remainingAttempts, this.updateOrbs(), this.save();
      let sG = this.dbePlayer.runInterval(() => {
        if (!this.isTraining) {
          this.dbePlayer.clearRun(sG);
          return;
        }
        hI.currentTick % this.tickSpeed === 0 && this.updateOrbs();
      });
    }
    stopTraining() {
      this.score > this.data.highScore && (this.data.highScore = this.score),
        this.grantReward(),
        (this.score = 0),
        (this.isTraining = !1),
        this.checkAndUpdateAttempts(),
        this.removeAllOrbs(),
        this.save();
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
      let sG = new hD({ type: "points", pointType: "attribute_points", amount: this.rewardAmount });
      sG.tryGrantReward(this.dbePlayer), sG.sendRewardMessage(this.dbePlayer);
    }
    removeAllOrbs() {
      for (let sG of this.orbs) sG.isValid && sG.remove();
      this.orbs.length = 0;
    }
    save() {
      this.dbePlayer.data.set("concentration_training", this.data);
    }
    spawnOrb(sG = 1, sH) {
      let { dimension: sI, location: sK } = this.dbePlayer.player,
        sL = hK[sH],
        sM = this.dbePlayer.player.getViewDirection(),
        sN = bO.normalize({ x: sM.x, y: 0, z: sM.z });
      for (let sO = 0; sO < sG; sO++) {
        let sP = bO.scale(sN, hJ + 1),
          sQ = bO.add(sK, sP),
          sR = new bP(aO.random(-hJ, hJ), aO.random(1, 2), aO.random(-hJ, hJ)),
          sS = bO.add(sQ, sR),
          sT = d4("dbe:training_orb", sI, sS);
        if (!sT) throw new Error();
        sT.applyImpulse(new bP(aO.random(0, 0.01), 0, aO.random(0, 0.01))),
          sT.setProperty("dbe:color", sH),
          this.orbs.push(sT),
          this.spawnOrbParticle(sS, sL),
          sI.playSound("common.ki_blast", sS, { pitch: 3 });
      }
    }
    spawnOrbParticle(sG, sH) {
      let sI = new hH();
      sI.setColorRGB("color", aI.colorToRgb(sH)),
        sI.setFloat("age", this.tickSpeed / 20),
        this.dbePlayer.player.spawnParticle("dbe:concentration_orb", sG, sI);
    }
    async updateOrbs() {
      this.removeAllOrbs();
      try {
        this.spawnOrb(1, 0), this.spawnOrb(2, 1), this.spawnOrb(2, 2);
      } catch {
        this.stopTraining();
      }
    }
  };
export { hJ, hK, hL };
