// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 115–399.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { aI, bG, bN, bO } from "./01_util.js";
import { skills_data as hV } from "../data/skills_data.js";
import { Player as bR, system as bS, world as bT, system as hW, world as o } from "@minecraft/server";
import { dragonBallsData as d } from "../data/dragon_balls_data.js";
import { d3, d4 } from "./05_db_cooldowns.js";
import { duMovementModeTypes, hN, hP, hQ, hS, hT, hU } from "./14_player.js";
import { fV } from "./11_entity_wrapper.js";
import { bindLate } from "./late.js";
import { cY } from "./04_tournament_dims.js";
var hX = class {
    constructor(sG) {
      this.entity = sG;
      if (
        ((this.data = bG(sG, "dragon_evolution")),
        (this.kiAttackId = String(sG.getDynamicProperty("ki_attack_id"))),
        (this.kiAttackProperties = this.data.get("properties")),
        !this.kiAttackProperties)
      ) {
        let sH = hV.find(({ id: sI, type: sK }) => sK === "ki_attack" && sI === this.kiAttackId);
        if (sH) this.kiAttackProperties = { ...sH.kiAttackProperties };
        else throw new Error("Ataque de Ki não possui 'ki_attack_properties' definidos.");
      }
      this.initialize();
    }
    data;
    kiAttackId;
    kiAttackProperties;
    get attackSpeed() {
      return this.kiAttackProperties.speed ?? 1;
    }
    get baseDamage() {
      return this.kiAttackProperties.baseDamage;
    }
    get baseScale() {
      return this.kiAttackProperties.baseScale ?? 1;
    }
    get breakBlocks() {
      return this.kiAttackProperties.breakBlocks ?? !0;
    }
    get canCutTail() {
      return this.kiAttackProperties.type === "disc" ? (this.kiAttackProperties.canCutTail ?? !1) : !1;
    }
    get color0() {
      return this.kiAttackProperties.color0;
    }
    get color1() {
      return this.kiAttackProperties.color1;
    }
    get damage() {
      return this.baseDamage * this.damageMultiplier;
    }
    get damageMultiplier() {
      return this.kiAttackProperties.damageMultiplier ?? 1;
    }
    get explosionPower() {
      return this.kiAttackProperties.explosionPower;
    }
    get hasColor() {
      return !!(this.color0 || this.color1);
    }
    get isMoving() {
      return bO.magnitude(this.entity.getVelocity()) !== 0;
    }
    get owner() {
      let sG = this.entity.getComponent("minecraft:projectile")?.owner;
      return sG?.isValid ? sG : void 0;
    }
    setColor(sG) {
      (this.kiAttackProperties.color0 = sG.color0), (this.kiAttackProperties.color1 = sG.color1), this.saveProperties();
    }
    setPowerPercent(sG) {
      (this.kiAttackProperties.damageMultiplier = (this.calculateDamageMultiplier() * sG) / 100), this.saveProperties();
    }
    setScale(sG) {
      let sH = bN(Math.round(sG), 1, 20);
      this.entity.triggerEvent("dbe:scale_" + sH);
    }
    calculateDamageMultiplier() {
      if (this.owner) {
        let sG = i3.getDBEEntity(this.owner);
        if (sG) {
          let { attributes: sH } = sG,
            sI = sH.getAttribute("willpower");
          if (sI) return sI.modifiedValue;
        }
      }
      return 1;
    }
    initialize() {
      this.entity.setProperty("dbe:attack_type", this.kiAttackProperties.type),
        this.entity.setProperty("dbe:has_spiral", this.kiAttackProperties.hasSpiral ?? !1),
        this.entity.triggerEvent("dbe:become_" + this.kiAttackProperties.type),
        this.kiAttackProperties.type === "beam" && this.spawnBeam();
    }
    saveProperties() {
      this.data.set("properties", this.kiAttackProperties), this.updateColors();
    }
    spawnBeam() {
      let sG = this.entity.location,
        { baseScale: sH } = this,
        sI = hW.runInterval(() => {
          if (!this.entity.isValid) {
            hW.clearRun(sI);
            return;
          }
          if (this.isMoving) {
            let sK = bO.distance(this.entity.location, sG),
              sL = bN(sK / sH, 0, 128);
            this.entity.setProperty("dbe:beam_gap", sL);
          }
        });
    }
    updateColors() {
      let sG = (sK) => bN(Math.floor(sK * 255), 0, 255),
        { color0: sH, color1: sI } = this;
      if (sH) {
        let sK = aI.colorToRgb(sH);
        this.entity.setProperty("dbe:color_1_r", sG(sK.red)),
          this.entity.setProperty("dbe:color_1_g", sG(sK.green)),
          this.entity.setProperty("dbe:color_1_b", sG(sK.blue));
      }
      if (sI) {
        let sL = aI.colorToRgb(sI);
        this.entity.setProperty("dbe:color_2_r", sG(sL.red)),
          this.entity.setProperty("dbe:color_2_g", sG(sL.green)),
          this.entity.setProperty("dbe:color_2_b", sG(sL.blue));
      }
    }
  },
  hY = class {
    testCollision(sG) {
      let { entity: sH } = sG,
        sI = this.getNearbyKiAttacks(sH.dimension, sH.location, sG.baseScale * 2);
      for (let sK of sI)
        sG !== sK && sK && sG.damage > sK.damage && sK.entity.tryTeleport(sH.location, { keepVelocity: !0 });
    }
    getNearbyKiAttacks(sG, sH, sI) {
      return i3.getKiAttackEntities(sG, { location: sH, maxDistance: sI });
    }
    // O2e: a mesma regra de testCollision para todos os ataques do tick, sem K² chamadas nativas. Lê dimensão e
    // posição de cada ataque uma vez; os vizinhos (mesma dimensão, distância <= baseScale * 2, do mais perto ao mais
    // longe, na ordem do mapa) são achados em JS. Depois de um tryTeleport a posição do teleportado é relida, para os
    // testes seguintes do tick verem o mesmo que o matches() via antes. Ataque inválido fica fora (antes dava erro e
    // interrompia o resto do tick).
    testAllCollisions(sG) {
      let snap = [];
      for (let atk of sG)
        try {
          let { entity: e } = atk;
          snap.push({ atk, dim: e.dimension.id, loc: e.location });
        } catch {}
      for (let me of snap) {
        let max = me.atk.baseScale * 2,
          near = [];
        for (let o of snap) {
          if (o.dim !== me.dim) continue;
          let d = bO.distance(me.loc, o.loc);
          d <= max && near.push({ o, d });
        }
        near.length > 1 && near.sort((x, y) => x.d - y.d);
        for (let { o } of near)
          if (me.atk !== o.atk && me.atk.damage > o.atk.damage) {
            try {
              o.atk.entity.tryTeleport(me.loc, { keepVelocity: !0 });
              o.loc = o.atk.entity.location;
            } catch {} // ataque que sumiu no meio do tick: não aborta o hub (nem o updateBalls depois dele)
          }
      }
    }
  },
  hZ = new hY(),
  i0 = new Map(),
  i1 = new Map(),
  i2 = class {
    initializingEntities = new Set();
    deleteEntity(sG) {
      let { id: sH, typeId: sI } = sG;
      sI === "dbe:ki_attack" ? i1.delete(sH) : i0.delete(sH);
    }
    getDBEEntities(sG, sH) {
      let sI = [],
        sK = [],
        sL = sH?.location;
      for (let sM of i0.values())
        (sG && sM.entity.dimension !== sG) ||
          (sH && !sM.entity.matches(sH)) ||
          sK.push({ dbeEntity: sM, distance: sL ? bO.distance(sL, sM.entity.location) : 0 });
      sL && sK.length > 1 && sK.sort((sN, sO) => sN.distance - sO.distance);
      for (let { dbeEntity: sN } of sK) sI.push(sN);
      return sI;
    }
    getDBEEntity(sG) {
      return i0.get(sG.id) ?? this.createDBEEntity(sG);
    }
    getKiAttackEntities(sG, sH) {
      let sI = [],
        sK = [],
        sL = sH?.location;
      for (let sM of i1.values())
        (sG && sM.entity.dimension !== sG) ||
          (sH && !sM.entity.matches(sH)) ||
          sK.push({ kiAttackEntity: sM, distance: sL ? bO.distance(sL, sM.entity.location) : 0 });
      sL && sK.length > 1 && sK.sort((sN, sO) => sN.distance - sO.distance);
      for (let { kiAttackEntity: sN } of sK) sI.push(sN);
      return sI;
    }
    getKiAttackEntity(sG) {
      return i1.get(sG.id) ?? this.createKiAttackEntity(sG);
    }
    initializeEntity(sG) {
      bS.runTimeout(() => {
        sG.isValid && (sG.typeId === "dbe:ki_attack" ? this.createKiAttackEntity(sG) : this.createDBEEntity(sG));
      }, 20);
    }
    trySpawnDBEEntity(sG, sH, sI, sK) {
      let sL = d4(sG, sH, sI, sK);
      if (!sL) return;
      try {
        return this.createDBEEntity(sL, sK?.entityDefinitions);
      } catch (error) {
        if (sL.isValid) sL.remove();
        throw error;
      }
    }
    createDBEEntity(sG, sH) {
      if (sG.typeId !== "dbe:ki_attack") {
        let sI = i0.get(sG.id);
        if (this.initializingEntities.has(sG.id))
          throw new Error(
            "Tentativa de acessar a DBEEntity enquanto ela ainda estava sendo inicializada. Isso normalmente indica uma chamada recursiva durante a inicialização.",
          );
        if (!sI && sG.isValid && d3(sG)) {
          this.initializingEntities.add(sG.id);
          try {
            sG instanceof bR ? (sI = new hN(sG)) : ((sI = new fV(sG, sH)), this.setupCombatBehaviors(sI));
            i0.set(sG.id, sI);
            this.initializingEntities.delete(sG.id);
            sI.initialize();
          } catch (error) {
            i0.delete(sG.id);
            sI?.clearAllRuns();
            throw error;
          } finally {
            this.initializingEntities.delete(sG.id);
          }
        }
        return sI;
      }
    }
    createKiAttackEntity(sG) {
      if (sG.typeId === "dbe:ki_attack") {
        let sH = i1.get(sG.id);
        if (this.initializingEntities.has(sG.id))
          throw new Error(
            "Tentativa de acessar a KiAttackEntity enquanto ela ainda estava sendo inicializada. Isso normalmente indica uma chamada recursiva durante a inicialização.",
          );
        return (
          !sH &&
            sG.isValid &&
            d3(sG) &&
            (this.initializingEntities.add(sG.id),
            (sH = new hX(sG)),
            i1.set(sG.id, sH),
            this.initializingEntities.delete(sG.id)),
          sH
        );
      }
    }
    setupCombatBehaviors(sG) {
      let { combatManager: sH, entity: sI } = sG;
      sH &&
        (sH.addBehavior("dash", new hP(sG, sH)),
        sH.addBehavior("ki_attack", new hQ(sG, sH)),
        duMovementModeTypes.has(sI.typeId) && sH.addBehavior("movement_mode", new hS(sG, sH)),
        sH.addBehavior("transformation", new hU(sG, sH)),
        sI.typeId === "dbe:pirate_robot" && sH.addBehavior("pirate_gun", new hT(sG, sH)));
    }
  },
  i3 = new i2();
bindLate("i3", () => i3); // O4.0: ligação tardia
bindLate("i0", () => i0); // O4.0: ligação tardia
bT.afterEvents.entityLoad.subscribe(({ entity: sG }) => {
  i3.initializeEntity(sG);
}),
  bT.beforeEvents.entityRemove.subscribe(({ removedEntity: sG }) => {
    i3.deleteEntity(sG);
  }),
  bT.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
    i3.initializeEntity(sG);
  }),
  bS.run(() => {
    let sG = cY.getAll();
    for (let sH of sG) for (let sI of sH.getEntities()) i3.initializeEntity(sI);
  });
export { hX, hY, hZ, i0, i1, i2, i3 };
