// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 162–426.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { every } from "./scheduler.js";
import { aH, aQ, aS, bG, bO, bP } from "./01_util.js";
import { Player as pB, ItemStack as pC, system as pD, world as pE, system as pF, world as pG } from "@minecraft/server";
import { duTravel } from "./du_travel.js";
import { acquireLoadedArea as duAcquireLoadedArea, physicalDestinationId as duPhysicalDestinationId, releaseLoadedArea as duReleaseLoadedArea, reportTravelFailure as duReportTravelFailure, safeReturnToEarth as duSafeReturnToEarth } from "../travel_safety.js";
import { cY } from "./04_tournament_dims.js";
import { d4 } from "./05_db_cooldowns.js";
import { hO } from "./14_player.js";
import { i3 } from "./15_entities.js";
var pH = class {
    constructor(sG) {
      this.dimension = sG;
    }
    onLoadCallbacks = new Set();
    *generate(sG) {
      if (!pJ.isGenerated(sG.id) && sG.isLoaded) {
        for (let sH of this.onLoadCallbacks)
          try {
            yield* sH(sG);
          } catch (sI) {
            console.error(sI);
          }
      }
    }
    onLoad(sG) {
      this.onLoadCallbacks.add(sG);
    }
  },
  pI = class {
    generatorMap = new Map();
    isGenerating = !1;
    queueMap = new Map();
    constructor() {
      every(30, "core.terrain_queue", () => { // G4
        let sG = new Set();
        for (let sH of this.generatorMap.values()) {
          let { dimension: sI } = sH;
          for (let sK of sH.dimension.getPlayers()) {
            let { location: sL } = sK,
              sM = aH.getChunkId(sI, sL);
            sG.has(sM) || (sG.add(sM), this.addToQueue(sH, sL));
          }
        }
      }, { phase: 17 });
    }
    register(sG) {
      let sH = this.getGenerator(sG);
      return sH || ((sH = new pH(sG)), this.generatorMap.set(sG.id, sH), sH);
    }
    getGenerator(sG) {
      return this.generatorMap.get(sG.id);
    }
    isGenerated(sG) {
      return !!pG.getDynamicProperty("generated:" + sG);
    }
    markChunkAsGenerated(sG) {
      return pG.setDynamicProperty("generated:" + sG, !0);
    }
    addToQueue(sG, sH) {
      let sI = aH.getNearbyChunks(sG.dimension, sH, 5);
      for (let sK of sI) {
        let { id: sL } = sK;
        !this.isGenerated(sL) && !this.queueMap.has(sL) && this.queueMap.set(sL, sG);
      }
      this.isGenerating || ((this.isGenerating = !0), pF.runJob(this.generateQueuedChunks()));
    }
    *generateQueuedChunks() {
      for (let [sG, sH] of this.queueMap) {
        let sI = aH.getChunkById(sG);
        yield* sH.generate(sI), this.queueMap.delete(sG);
      }
      this.queueMap.size ? pF.runJob(this.generateQueuedChunks()) : (this.isGenerating = !1);
    }
  },
  pJ = new pI(),
  pK = "dbe:angel_staff_dimension",
  pL = new bP(0.5, -63, 0.5),
  pM = class {
    startedDimensions = new Set();
    lastGrantedDimensionIndex = 0;
    constructor() {
      this.init();
    }
    async assignDimension(sG) {
      if (!this.getDimensionDataByOwner(sG)) {
        // só angel_staff_dimension_0..49 são registradas (init)
        if (this.lastGrantedDimensionIndex >= 49) {
          console.warn("[Dragon Universe] Sem dimensões Angel Staff livres para " + sG);
          return;
        }
        let sH = pK + "_" + ++this.lastGrantedDimensionIndex,
          sI = pE.getDimension(sH);
        await this.setup(sI),
          this.saveDimensionData({ id: sH }),
          bG(pE, "angel_staff_dimension_owners").set(sG, sH),
          bG(pE, "angel_staff_dimension").set("last_granted_dimension_index", this.lastGrantedDimensionIndex);
      }
    }
    async enterDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG,
          sL = pE.getDimension(sH);
        (sI.staffDimensionId = sK.dimension.id),
          (sI.staffLocation = sK.location),
          this.saveDimensionData(sI),
          sL &&
            (this.startedDimensions.has(sL.id) ||
              (this.startFloorGeneration(sL), this.startedDimensions.add(sL.id), await pD.waitTicks(20)),
            pD.run(() => {
              duTravel(sK, pL, { dimension: sL, label: "angel staff entry" });
            }));
      }
    }
    exitDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        pD.run(async () => {
          if (!sK.isValid) return;
          let dimension;
          try {
            if (typeof sI.staffDimensionId !== "string" || !sI.staffDimensionId)
              throw new Error("Saved angel staff return dimension is missing");
            dimension = pE.getDimension(duPhysicalDestinationId(sI.staffDimensionId));
          } catch (error) {
            duReportTravelFailure(sK, "angel staff saved destination", error);
            try { await duSafeReturnToEarth(sK, { label: "angel staff Earth fallback" }); }
            catch (fallbackError) { duReportTravelFailure(sK, "angel staff Earth fallback", fallbackError); }
            return;
          }
          await duTravel(sK, sI.staffLocation, { dimension, label: "angel staff return" });
        });
      }
    }
    getDimensionData(sG) {
      return bG(pE, "angel_staff_dimension").get(sG);
    }
    getDimensionDataByOwner(sG) {
      let sH = bG(pE, "angel_staff_dimension_owners").get(sG);
      return this.getDimensionData(sH);
    }
    isOwner(sG, sH) {
      return this.getDimensionDataByOwner(sG)?.id === sH;
    }
    saveDimensionData(sG) {
      bG(pE, "angel_staff_dimension").set(sG.id, sG);
    }
    switchDimension(sG, sH) {
      let sI = this.getDimensionData(sH);
      if (sI) {
        let { player: sK } = sG;
        sK.dimension.id !== sI.id ? this.enterDimension(sG, sH) : this.exitDimension(sG, sH);
      }
    }
    init() {
      for (let sG = 0; sG < 50; sG++) cY.register(pK + "_" + sG);
      pD.run(() => {
        this.lastGrantedDimensionIndex = bG(pE, "angel_staff_dimension").get("last_granted_dimension_index") ?? 0;
      });
    }
    async setup(sG) {
      let sH = { x: 0, y: -64, z: 0 };
      let loadedArea = await duAcquireLoadedArea(sG, sH, pL, "angel staff setup");
      try {
        sG.setBlockType(sH, "minecraft:barrier");
        let sI = d4("dbe:angel_staff_entity", sG, pL);
        sI && sI.setDynamicProperty("dimension_id", sG.id);
      } finally {
        duReleaseLoadedArea(loadedArea);
      }
    }
    startFloorGeneration(sG) {
      pJ.register(sG).onLoad(function* (sH) {
        let { chunkOrigin: sI, dimension: sK } = sH,
          sL = -64;
        try {
          for (let sM = 0; sM < 16; sM++)
            for (let sN = 0; sN < 16; sN++)
              sK.setBlockType({ x: sI.x + sM, y: sL, z: sI.z + sN }, "minecraft:barrier"), yield;
          pJ.markChunkAsGenerated(sH.id);
        } catch {
          return;
        }
      });
    }
  },
  pN = new pM();
pE.afterEvents.playerDimensionChange.subscribe(({ fromDimension: sG, player: sH, toDimension: sI }) => {
  sG.id.startsWith(pK) && sH.runCommand("fog @s remove angel_staff_dimension"),
    sI.id.startsWith(pK) && sH.runCommand("fog @s push dbe:fog_angel_staff_dimension angel_staff_dimension");
}),
  pE.beforeEvents.playerInteractWithEntity.subscribe(({ player: sG, target: sH }) => {
    if (sH.typeId === "dbe:angel_staff_entity") {
      let sI = String(sH.getDynamicProperty("dimension_id"));
      if (pN.getDimensionData(sI)) {
        let { dimension: sK, isSneaking: sL } = sG,
          sM = pN.isOwner(sG.id, sI),
          sN = sK.id.startsWith(pK),
          sO = hO(sG);
        if (sM) {
          if (sL && !sN) {
            pD.run(() => {
              let { dimension: sP, location: sQ } = sH,
                sR = new pC("dbe:angel_staff");
              sP.spawnItem(sR, sQ), sH.remove();
            });
            return;
          }
          pN.switchDimension(sO, sI);
        } else sN && pN.exitDimension(sO, sI);
      }
    }
  });
var pO = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, source: sI }) {
      if (!sI.dimension.id.startsWith("dbe:angel_staff") && sI instanceof pB) {
        let sK = pN.getDimensionDataByOwner(sI.id);
        if (sK) {
          let sL = bO.add(bO.add(sG.location, aS.faceToVector(sH)), { x: 0.5, z: 0.5 }),
            sM = d4("dbe:angel_staff_entity", sG.dimension, sL);
          sM &&
            (sM.setDynamicProperty("dimension_id", sK.id), (sM.nameTag = "§w" + sI.name + "§r"), aQ.decrementStack(sI));
        }
      }
    }
  },
  pP = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL, single_use: sM } = sI,
          sN = sK.data.get("single_uses") ?? [];
        if (sM && sN.includes(sG.typeId)) return;
        for (let sO of Object.keys(sL)) sK.attributes.getAttribute(sO)?.addValue(sL[sO], !0);
        sN.push(sG.typeId), sK.data.set("single_uses", sN), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  },
  pQ = class {
    constructor() {
      this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity({ attackingEntity: sG, hitEntity: sH }) {
      let { dimension: sI, location: sK } = sH,
        sL = sI.getEntities({ location: sK, maxDistance: 3 });
      for (let sM of sL) {
        if (sM === sH || sM === sG) continue;
        let sN = bO.subtract(sM.location, sK),
          sO = bO.scale(sN, 0.9);
        sM.applyImpulse(sO);
      }
      sI.playSound("wind_charge.burst", sK), sI.spawnParticle("minecraft:wind_explosion_emitter", sK);
    }
  },
  pR = class {
    constructor() {
      this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse({ itemStack: sG, source: sH }, { params: sI }) {
      let sK = i3.getDBEEntity(sH);
      if (sK) {
        let { attributes: sL } = sK,
          { duration: sM, modifiers: sN } = sI;
        sL.modifiers.applyBuff(sG.typeId, sN ?? {}, sM ?? 1), sH.dimension.playSound("ui.upgrade", sH.location);
      }
    }
  };
export { pH, pI, pJ, pK, pL, pM, pN, pO, pP, pQ, pR };
