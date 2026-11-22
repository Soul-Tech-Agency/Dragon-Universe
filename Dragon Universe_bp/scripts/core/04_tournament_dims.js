// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–3 de então, linhas 77–345.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { Player as cJ, system as cK, world as cL, system as cM } from "@minecraft/server";
import { duTravel } from "./du_travel.js";
import { aR } from "./01_util.js";
import { late } from "./late.js";
var cN = class {
  constructor(sG, sH) {
    (this.tournament = sG), (this.matchParticipants = sH);
  }
  loserParticipant;
  winnerParticipant;
  async startMatch() {
    this.tournament.round++;
    let sG = this.matchParticipants[0],
      sH = this.matchParticipants[1];
    this.tournament.sendMessage(
      "§eIniciando luta " +
        this.tournament.round +
        " em 15 segundos... " +
        sG.name +
        " vs " +
        sH.name +
        ", preparem-se!",
    ),
      await cM.waitTicks(300);
    const arrivals = await Promise.all([
      duTravel(sG.entity, this.tournament.opponentOneSpawnLocation, { dimension: this.tournament.dimension, label: "tournament fighter one" }),
      duTravel(sH.entity, this.tournament.opponentTwoSpawnLocation, { dimension: this.tournament.dimension, label: "tournament fighter two" }),
    ]);
    if (arrivals.includes(!1)) throw new Error("Tournament destination unavailable; retry the queue");
    this.tournament.sendMessage("Lutem! (" + sG.name + " vs " + sH.name + ")");
    sG.recoverConstitution();
    sH.recoverConstitution();
    await this.handleMatch(sG, sH);
  }
  handleMatch(sG, sH) {
    return new Promise((sI) => {
      let sK = cM.runInterval(() => {
        let sL = !1;
        sG.isValidParticipant || (this.matchLoser(sG), this.matchWinner(sH), (sL = !0)),
          sH.isValidParticipant || (this.matchLoser(sH), this.matchWinner(sG), (sL = !0)),
          sL && (cM.clearRun(sK), sI());
      });
    });
  }
  matchLoser(sG) {
    (this.loserParticipant = sG), this.teleportToSpawn(sG);
  }
  matchWinner(sG) {
    (this.winnerParticipant = sG),
      this.teleportToSpawn(sG),
      sG.entity.isValid && this.tournament.sendMessage(sG.name + " venceu a luta!");
  }
  teleportToSpawn(sG) {
    return sG.entity.isValid && duTravel(sG.entity, this.tournament.spectatorSpawn,
      { dimension: this.tournament.dimension, label: "tournament spectator" });
  }
};
import { Player as cO } from "@minecraft/server";
var cP = class {
    constructor(sG, sH) {
      (this.tournament = sG),
        (this.entity = sH),
        (this.name = sH instanceof cO ? sH.name : sH.nameTag || aR.formatTypeId(sH.typeId));
    }
    name;
    get isAlive() {
      return !!(this.entity.isValid && this.entity.getComponent("minecraft:health")?.currentValue);
    }
    get isValidParticipant() {
      let sG = late.i3.getDBEEntity(this.entity)?.isKnockedOut ?? !1,
        sH = this.tournament.dimension === this.entity.dimension;
      return this.isAlive && !sG && sH;
    }
    recoverConstitution() {
      if (this.entity.isValid) {
        let sG = late.i3.getDBEEntity(this.entity);
        sG && sG.recoverConstitution();
      }
    }
  },
  cQ = [1200, 600, 100, 80, 60, 40, 20],
  cR = class {
    constructor(sG) {
      this.tournamentOptions = sG;
    }
    isStartSequenceActive = !1;
    _participants = [];
    waitingPlayersMap = new Set();
    round = 0;
    get dimension() {
      return cL.getDimension(this.tournamentOptions.dimensionId);
    }
    get isStarted() {
      return this._participants.length > 0;
    }
    get opponentOneSpawnLocation() {
      return this.tournamentOptions.opponentOneSpawnLocation;
    }
    get opponentTwoSpawnLocation() {
      return this.tournamentOptions.opponentTwoSpawnLocation;
    }
    get participants() {
      return this._participants;
    }
    get spectatorSpawn() {
      return this.tournamentOptions.spectatorSpawn;
    }
    get waitingPlayers() {
      return [...this.waitingPlayersMap.values()];
    }
    getMinPlayers() {
      return Math.max(4, 2 ** Math.ceil(Math.log2(this.waitingPlayersMap.size)));
    }
    sendMessage(sG) {
      this.runInAllParticipants((sH) => {
        sH instanceof cJ && (sH.sendMessage(sG), sH.playSound("random.pop"));
      });
    }
    togglePlayerQueue(sG) {
      this.isStarted ||
        (this.waitingPlayersMap.has(sG)
          ? (this.waitingPlayersMap.delete(sG), sG.sendMessage("§aVocê saiu do torneio"))
          : (this.waitingPlayersMap.add(sG),
            sG.sendMessage("§aVocê entrou no torneio"),
            !this.isStartSequenceActive &&
              this.waitingPlayers.length >= this.getMinPlayers() &&
              this.handleStartSequence()));
    }
    async createInitialBracket() {
      let sG = [];
      for (let sH = 0; sH < this._participants.length; sH += 2) {
        let sI = new cN(this, [this._participants[sH], this._participants[sH + 1]]);
        await sI.startMatch(), sG.push(sI);
      }
      return sG;
    }
    finishTournament(sG) {
      (this._participants = []), this.sendMessage("§a" + sG.name + " venceu o Torneio de Artes Marciais!");
    }
    handleStartSequence() {
      if (!this.isStartSequenceActive) {
        this.isStartSequenceActive = !0;
        let sG = 1200,
          sH = cK.runInterval(() => {
            if ((this.updateWaitingPlayers(), this.isStarted || !this.isValidTournamentSize())) {
              (this.isStartSequenceActive = !1), cK.clearRun(sH);
              return;
            }
            if (cQ.includes(sG)) {
              for (let sI of this.waitingPlayers) sI.sendMessage("§6Iniciando torneio em " + Math.floor(sG / 20));
            }
            sG <= 0 && this.startTournament(), sG--;
          });
      }
    }
    isValidTournamentSize() {
      return this.waitingPlayersMap.size === this.getMinPlayers();
    }
    runInAllParticipants(sG) {
      for (let sH of this._participants) sH.entity.isValid && sG(sH.entity, sH);
    }
    async startTournamentIntro() {
      await cK.waitTicks(100),
        this.runInAllParticipants(async (sG) => {
          sG instanceof cJ &&
            (sG.runCommand("camera @s fade time 0 5 0 color 0 0 0"),
            sG.playSound("music.game.world_martial_arts_tournament_intro"),
            await cK.waitTicks(400),
            sG.playMusic("music.game.world_martial_arts_tournament_theme", { fade: 2, loop: !0 }));
        }),
        await cK.waitTicks(100);
    }
    async startTournament() {
      try {
      for (let sI of this.waitingPlayers) {
        this._participants.push(new cP(this, sI));
        if (!(await duTravel(sI, this.spectatorSpawn, { dimension: this.dimension, label: "tournament queue" })))
          throw new Error("Tournament arrival failed");
      }
      this.waitingPlayersMap.clear(), await this.startTournamentIntro();
      let sG = await this.createInitialBracket();
      for (; sG.length > 1; ) {
        let sK = [];
        for (let sL = 0; sL < sG.length; sL += 2) {
          let sM = sG[sL].winnerParticipant,
            sN = sG[sL + 1].winnerParticipant;
          if (sM && sN) {
            let sO = new cN(this, [sM, sN]);
            await sO.startMatch(), sK.push(sO);
          }
        }
        sG = sK;
      }
      let sH = sG[0].winnerParticipant;
      sH && this.finishTournament(sH);
      } catch (error) {
        console.warn(`[Dragon Universe] Tournament travel failed: ${error?.stack ?? error}`);
        this.sendMessage("§cViagem do torneio indisponível. Entre novamente na fila para tentar outra vez.");
        for (let participant of this._participants)
          if (participant.entity.isValid) this.waitingPlayersMap.add(participant.entity);
        this._participants = [];
        this.isStartSequenceActive = !1;
        this.round = 0;
      }
    }
    updateWaitingPlayers() {
      let { waitingPlayers: sG } = this;
      for (let sH of sG) sH.isValid || this.togglePlayerQueue(sH);
    }
  },
  cS = class {
    tournaments = new Map();
    getTournament(sG) {
      return this.tournaments.get(sG);
    }
    inTournament(sG) {
      for (let sH of this.tournaments.values())
        if (sH.isStarted) {
          for (let sI of sH.participants) if (sI.entity === sG) return !0;
        }
      return !1;
    }
    registerTournament(sG) {
      this.tournaments.has(sG.id) || this.tournaments.set(sG.id, new cR(sG));
    }
  },
  cT = new cS();
function cU(sG) {
  let sH = cT.getTournament("world_martial_arts_tournament");
  if (sH) {
    let sI = cK.runInterval(() => {
      if (!sG.isValid) {
        cK.clearRun(sI);
        return;
      }
      let { isStarted: sK } = sH,
        sL = sK
          ? "§eTorneio em andamento..."
          : "§eAguardando jogadores... [" +
            sH.waitingPlayers.length +
            "/" +
            sH.getMinPlayers() +
            "]\n§a[Interaja para entrar]";
      sG.nameTag = sL;
    });
  }
}
cL.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
  sG.typeId === "dbe:announcer" && cU(sG);
}),
  cL.beforeEvents.playerInteractWithEntity.subscribe(({ player: sG, target: sH }) => {
    if (sH.typeId === "dbe:announcer") {
      let sI = cT.getTournament("world_martial_arts_tournament");
      sI && !sI.isStarted && sI.togglePlayerQueue(sG);
    }
  });
import { DimensionTypes as cV, system as cW, world as cX } from "@minecraft/server";
var cY = class {
  static customDimensionIds = [];
  static getAll() {
    let sG = [];
    for (let { typeId: sH } of this.getAllTypes()) sG.push(cX.getDimension(sH));
    return sG;
  }
  static getAllTypes() {
    return [...cV.getAll(), ...this.customDimensionIds];
  }
  static register(sG) {
    cW.beforeEvents.startup.subscribe(({ dimensionRegistry: sH }) => {
      sH.registerCustomDimension(sG), this.customDimensionIds.push({ typeId: sG });
    });
  }
};
export { cN, cP, cQ, cR, cS, cT, cU, cY };
