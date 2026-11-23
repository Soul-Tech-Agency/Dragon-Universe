// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–7 de então, linhas 128–726.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { Block as ik, EntityComponentTypes as ip, EquipmentSlot as iq, Player as iv, StructureSaveMode as iw, world as ix } from "@minecraft/server";
import { aI, aQ, aS, b5, bG, bN, bO, bP } from "./01_util.js";
import { CONFIG as ij } from "../config/config.js";
import { eO } from "./08_fusion_regions.js";
import { namekDragonBallSpot as __nbl } from "../namek_dimension.js";
import { hN } from "./14_player.js";
import { cH } from "./03_skill_base.js";
import { ef } from "./07_stats.js";
import { c4 } from "../vendor/vanilla_data.js";
import { d4 } from "./05_db_cooldowns.js";
import { i3 } from "./15_entities.js";
var iy = class t4 {
    static generateId() {
      let sG = Math.floor(Math.random() * 1000000);
      return "dbe:" + Date.now() + "_" + sG;
    }
    static generateLore(sG) {
      if (sG instanceof ik) return [{ rawtext: [{ text: "§r§7" }, { translate: sG.localizationKey }] }];
      let sH = sG.reduce((sI, sK) => {
        let sL = sK.nameTag || sK.localizationKey;
        return (sI[sL] = (sI[sL] || 0) + 1), sI;
      }, {});
      return Object.entries(sH).map(([sI, sK]) => ({
        rawtext: [{ text: "§r§7" }, { translate: sI }, { text: " x" + sK }],
      }));
    }
    static getStoredStructure(sG) {
      let sH = String(sG.getDynamicProperty("structure_id"));
      return ix.structureManager.get(sH);
    }
    static placeStoredStructure(sG, sH, sI, sK) {
      let sL = t4.getStoredStructure(sH);
      sL &&
        (ix.structureManager.place(sL, sI, sK),
        ix.structureManager.delete(sL),
        sI.spawnParticle("dbe:hoi_poi_capsule_spawn", sK),
        sI.playSound("common.explode", sK, { pitch: 2 }),
        this.updateItemStack(sG, sH, void 0, void 0),
        aQ.tryDamageHeldItem(sG, 1));
    }
    static isStoring(sG) {
      return !!sG.getDynamicProperty("structure_id");
    }
    static tryStoreBlock(sG, sH, sI) {
      if (sI.getParts() || ij.INDESTRUCTIBLE_BLOCKS.includes(sI.typeId)) return;
      let sK = eO(sG.dimension).canPlayerBuild(sG, sI.location),
        sL = sH.getComponent("dbe:hoi_poi_capsule");
      if (sK && sL) {
        let { dimension: sM, location: sN } = sI,
          sO = this.storeLocation(sM, sN, { includeEntities: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sO.id),
          sI.getComponent("minecraft:inventory")?.container?.clearAll(),
          sI.setType("minecraft:air");
      }
    }
    static tryStoreEntitiesFromLocation(sG, sH, sI) {
      let { dimension: sK } = sG,
        sL = eO(sK).canPlayerBuild(sG, sI),
        sM = sH.getComponent("dbe:hoi_poi_capsule");
      if (sL && sM) {
        let sN = sH.getComponent("minecraft:cooldown"),
          { exclude_families: sO } = sM.customComponentParameters.params;
        if (sN?.getCooldownTicksRemaining(sG) || this.isStoring(sH)) return;
        let sP = sK.getBlock(sI)?.center();
        if (!sP) return;
        let sQ = sK.getEntities({ excludeTypes: ["minecraft:player"], location: sI, volume: new bP(1, 1, 1) });
        for (let sR of sQ) {
          let sS = sR.getComponent(ip.TypeFamily);
          if (sS?.hasTypeFamily && sO.some((sT) => sS.hasTypeFamily(sT))) return;
          sR.teleport(sP);
        }
        this.storeEntities(sG, sH, sQ), sN?.startCooldown(sG);
      }
    }
    static storeEntities(sG, sH, sI) {
      if (sI.length) {
        let { dimension: sK, location: sL } = sI[0],
          sM = this.storeLocation(sK, sL, { includeBlocks: !1, saveMode: iw.World });
        this.updateItemStack(sG, sH, sI, sM.id);
        for (let sN of sI) sN.remove();
      }
    }
    static storeLocation(sG, sH, sI) {
      let sK = this.generateId();
      return ix.structureManager.createFromWorld(sK, sG, sH, sH, sI);
    }
    static updateItemStack(sG, sH, sI, sK) {
      sH.setLore(sI ? this.generateLore(sI) : void 0),
        sH.setDynamicProperty("structure_id", sK),
        sG.getComponent("minecraft:equippable")?.setEquipment(iq.Mainhand, sH);
    }
  },
  iz = class {
    constructor() {
      this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn({ block: sG, blockFace: sH, itemStack: sI, source: sK }) {
      if (sK instanceof iv) {
        if (!eO(sG.dimension).canPlayerBuild(sK, sG.location)) return;
        if (iy.isStoring(sI)) {
          let sL = bO.add(sG.location, aS.faceToVector(sH));
          iy.placeStoredStructure(sK, sI, sG.dimension, sL);
        } else iy.tryStoreBlock(sK, sI, sG);
      }
    }
  };
import { EntityDamageCause as iA } from "@minecraft/server";
function iB(sG, sH) {
  let { entity: sI } = sG,
    sK = sI.getViewDirection(),
    sL = bO.add(sI.location, sK),
    sM = bO.add(sL, { x: 0, y: sI.getAABB().extent.y, z: 0 }),
    sN = b5.applyAreaDamage(sI.dimension, sH.position ?? sM, sH.radius, sH.damage, {
      damagingEntity: sH.damagingEntity ?? sI,
      cause: sH.cause ?? iA.entityAttack,
    });
  return sH.onHit?.(sN), sN;
}
import { dragonBallsData as iC } from "../data/dragon_balls_data.js";
import { system as iD, world as iE } from "@minecraft/server";
var iF = class {
    constructor(sG, sH, sI) {
      (this.dragonBallConfig = sG), (this.state = sH), (this.dragonBallManager = sI);
    }
    get cooldown() {
      return this.dragonBallConfig.cooldown;
    }
    get detectableByRadar() {
      return this.dragonBallConfig.detectableByRadar ?? !0;
    }
    get id() {
      return this.dragonBallConfig.blockId;
    }
    get isPetrified() {
      return this.state.isPetrified;
    }
    get isPetrificationExpired() {
      return this.state.lastUsedAt ? iD.currentTick - this.state.lastUsedAt >= this.cooldown : !0;
    }
    get isUsed() {
      return typeof this.state.lastUsedAt == "number";
    }
    get maxWishes() {
      return this.dragonBallConfig.maxWishes ?? 1;
    }
    get requiredBalls() {
      return this.dragonBallConfig.requiredBalls;
    }
    get sourceAnimation() {
      return this.dragonBallConfig.sourceAnimation;
    }
    get sourceId() {
      return this.dragonBallConfig.sourceId;
    }
    get spawnSound() {
      return this.dragonBallConfig.spawnSound;
    }
    getBallsInDimension(sG) {
      return this.state.tracked.filter((sH) => sH.dimensionId === sG.id);
    }
    getDragonBallAmount() {
      return this.state.tracked.length;
    }
    getState() {
      return this.state;
    }
    petrify() {
      (this.state.isPetrified = !0), (this.state.lastUsedAt = iD.currentTick), this.dragonBallManager.save();
    }
    restore() {
      (this.state.isPetrified = !1), delete this.state.lastUsedAt, this.dragonBallManager.save();
    }
    spawnInstance(sG, sH) {
      this.state.tracked.push({ dimensionId: sG.id, location: sH, placed: !1, typeId: this.id }),
        this.dragonBallManager.save();
    }
    updateBalls() {
      let { isPetrified: sG, isPetrificationExpired: sH, isUsed: sI } = this,
        sK = this.getDragonBallAmount(),
        sL = !1;
      (sK === 0 || (sG && sH)) && (this.restore(), this.spawnAll()), !sG && sI && this.petrify();
      for (let sM of this.state.tracked) {
        let sN = iE.getDimension(sM.dimensionId),
          sO = sN.getBlock(sM.location);
        sO &&
          (sM.placed &&
            sO.typeId !== this.id &&
            (sO.setType("minecraft:air"), this.state.tracked.splice(this.state.tracked.indexOf(sM), 1), (sL = !0)),
          sM.placed || (sL = this.tryPlaceDragonBall(sN, sM)));
      }
      sL && this.dragonBallManager.save();
    }
    findValidSpawnLocation(sG) {
      if (sG.dimensionId === "dbe:namek") return sG.location;
      return iE.getDimension(sG.dimensionId).getTopmostBlock(sG.location)?.above() || sG.location;
    }
    getRandomSpawnLocation(sG) {
      let sH = Math.random() * (sG * 2) - sG,
        sI = Math.random() * (sG * 2) - sG,
        sK = new bP(sH, 0, sI);
      return bO.floor(sK);
    }
    spawnAll() {
      let sG = this.getDragonBallAmount();
      for (let sH of this.dragonBallConfig.spawnRules)
        for (let sI = sG; sI < this.requiredBalls; sI++) {
          let sK, sL;
          if (sH.dimensionId === "dbe:namek") {
            try {
              sL = iE.getDimension("dbe:namek");
              sK = __nbl(sI);
            } catch (__e) {
              break;
            }
          } else {
            sK = this.getRandomSpawnLocation(sH.spawnRadius);
            sL = iE.getDimension(sH.dimensionId);
          }
          this.spawnInstance(sL, sK);
        }
    }
    tryPlaceDragonBall(sG, sH) {
      let sI = this.findValidSpawnLocation(sH);
      (sH.location = sI), (sH.placed = !0);
      try {
        return sG?.setBlockType(sI, this.id), !0;
      } catch {
        return !1;
      }
    }
  },
  iG = class {
    database;
    dragonBallMap = new Map();
    state = [];
    constructor() {
      iD.run(() => {
        this.database = bG(iE, "dragon_evolution");
        let sG = this.database.get("dragon_balls");
        Array.isArray(sG) && (this.state = sG), this.loadDragonBalls();
      });
    }
    getDragonBall(sG) {
      return this.dragonBallMap.get(sG);
    }
    getDragonBallBySourceTypeId(sG) {
      for (let sH of this.dragonBallMap.values()) if (sH.sourceId === sG) return sH;
    }
    getRadarDetectableBalls(sG, sH) {
      let sI = [];
      for (let sK of this.dragonBallMap.values())
        !sK.detectableByRadar || sK.isPetrified || sI.push(...sK.getBallsInDimension(sG));
      return sI.sort((sL, sM) => {
        let sN = bO.distance(sH, sL.location),
          sO = bO.distance(sH, sM.location);
        return sN - sO;
      });
    }
    save() {
      this.state = [];
      for (let sG of this.dragonBallMap.values()) this.state.push(sG.getState());
      this.database?.set("dragon_balls", this.state);
    }
    updateBalls() {
      for (let sG of this.dragonBallMap.values()) sG.updateBalls();
    }
    loadDragonBalls() {
      for (let sG of iC) {
        let sH = this.state.find(({ typeId: sK }) => sK === sG.blockId) ?? {
            isPetrified: !1,
            tracked: [],
            typeId: sG.blockId,
          },
          sI = new iF(sG, sH, this);
        this.dragonBallMap.set(sG.blockId, sI);
      }
    }
  },
  iH = new iG();
import { system as iI } from "@minecraft/server";
var iJ = class {
    tryFusion(sG, sH) {
      return !(sH instanceof hN) && sH.race?.id === "namekian" && sH.isKnockedOut
        ? (this.startAssimilation(sG, sH), !0)
        : !1;
    }
    startAssimilation(sG, sH) {
      for (let sI of sG.attributes.getAttributes()) {
        let sK = sH.attributes.getAttribute(sI.id)?.value ?? 1,
          sL = Math.max(0, sK - sI.value);
        sL > 0 && sI.addValue(sL, !0);
      }
      iI.run(() => sH.entity.remove());
    }
  },
  iK = new iJ();
import { Block as iL, EntityComponentTypes as iM, Player as iN, system as iO, world as iP } from "@minecraft/server";
var iQ = class {
    bannedItems = new Set();
    isBanned(sG) {
      return this.bannedItems.has(sG);
    }
    ban(sG) {
      this.bannedItems.has(sG) || this.bannedItems.add(sG);
    }
    removeBannedItems(sG) {
      aQ.forEachFilledSlot(sG, (sH, sI) => {
        iR.isBanned(sI.typeId) && sH.setItem(void 0);
      });
    }
    unban(sG) {
      this.bannedItems.has(sG) && this.bannedItems.delete(sG);
    }
    protectContainer(sG, sH) {
      let sI = sG.getComponent("minecraft:inventory")?.container,
        sK = !1;
      if (sG instanceof iL) {
        let sL = iP.afterEvents.blockContainerClosed.subscribe(({ closeSource: sM }) => {
          sH.entity === sM.entity && ((sK = !0), iP.afterEvents.blockContainerClosed.unsubscribe(sL));
        });
      } else {
        let sM = iP.afterEvents.entityContainerClosed.subscribe(({ closeSource: sN }) => {
          sH.entity === sN.entity && ((sK = !0), iP.afterEvents.entityContainerClosed.unsubscribe(sM));
        });
      }
      if (sI) {
        let sN = iO.runInterval(() => {
          sI.isValid && !sK ? iR.removeBannedItems(sI) : iO.clearRun(sN);
        }, 2);
      }
    }
  },
  iR = new iQ();
iP.afterEvents.blockContainerOpened.subscribe(({ block: sG, openSource: sH }) => {
  iR.protectContainer(sG, sH);
}),
  iP.afterEvents.entityContainerOpened.subscribe(({ entity: sG, openSource: sH }) => {
    sG instanceof iN || iR.protectContainer(sG, sH);
  }),
  iP.afterEvents.entitySpawn.subscribe(({ entity: sG }) => {
    if (sG.isValid && sG.typeId === "minecraft:item") {
      let sH = sG.getComponent(iM.Item);
      sH && iR.isBanned(sH.itemStack.typeId) && sG.remove();
    }
  });
import { EntityComponentTypes as iS, EntityDamageCause as iT, Player as iU } from "@minecraft/server";
var iV = class extends cH {
    constructor(sG, sH) {
      super(sG, sH);
    }
    useSkill() {
      if (!(this.dbeEntity instanceof hN)) {
        let { target: sG } = this.dbeEntity;
        sG && this.tryUseSkillInTarget(sG);
        return;
      }
      for (let sH of this.dbeEntity.entity.getEntitiesFromViewDirection()) {
        let { distance: sI, entity: sK } = sH;
        if (sI <= 32 && this.tryUseSkillInTarget(sK)) break;
      }
    }
    tryUseSkillInTarget(sG) {
      return sG.typeId != "dbe:absorption_cocoon_entity" &&
        sG.applyDamage(1, { cause: iT.magic, damagingEntity: this.dbeEntity.entity })
        ? (iX.startAbsorption(this.dbeEntity, sG), !0)
        : !1;
    }
  },
  iW = class {
    absorbingEntities = new Set();
    startAbsorption(sG, sH) {
      let sI = sH.id;
      if (!this.absorbingEntities.has(sI)) {
        let sK = sH.getComponent(iS.Health);
        if (!sK) return;
        let sL = sH.location,
          sM = this.trySpawnCocoonEntity(sH.dimension, sL, { initialRotation: sH.getRotation().y });
        if (!sM) return;
        let sN = sM.entity;
        sG.attributes.transferAttributes(sM, 0.1);
        let sO = sM.attributes.stats.getStat("melee_damage")?.value ?? 1,
          sP = ef.getAttributesFromEntity(sH);
        this.absorbingEntities.add(sI);
        let sQ = (sR) => {
          sR && (sM.attributes.transferAttributes(sG), sG.attributes.addAttributeValues(sP)),
            this.absorbingEntities.delete(sI),
            sN.remove();
        };
        sG instanceof hN && sM.trySetProperty("dbe:color", sG.playerCustomization.getOptionValue("skin")),
          sH instanceof iU &&
            sH.camera.fade({
              fadeColor: aI.colorToRgb("#ffb4d7"),
              fadeTime: { fadeInTime: 1, holdTime: 0.5, fadeOutTime: 1 },
            }),
          sM.runInterval(() => {
            if (!sH.isValid) {
              sQ(!1);
              return;
            }
            this.applyInvisibilityToTarget(sH),
              sN.teleport(sL),
              sH.teleport(sL),
              sH.applyDamage(sO, { cause: iT.magic, damagingEntity: sG.entity }),
              sK.currentValue <= 0 && sQ(!0);
          });
      }
    }
    applyInvisibilityToTarget(sG) {
      sG instanceof iU
        ? sG.playAnimation("animation.entity.absorbing")
        : sG.addEffect(c4.Invisibility, 1, { showParticles: !1 });
    }
    trySpawnCocoonEntity(sG, sH, sI) {
      let sK = d4("dbe:absorption_cocoon_entity", sG, sH, sI);
      if (sK) return i3.getDBEEntity(sK);
    }
  },
  iX = new iW();
import { Player as iY, system as iZ } from "@minecraft/server";
import { system as j0 } from "@minecraft/server";
// O2c (decisão O2c-1, opção a): cada cápsula tem 2 intervalos de 1 tick (sensores aqui e movimento em j5). Antes
// eles nunca eram limpos e a instância ficava num WeakMap pela entidade JS; agora a instância fica num Map pelo
// entity.id e dispose() limpa os 2 intervalos quando a cápsula deixa de ser válida. Se ela voltar (chunk
// recarregado), j4 cria uma instância nova no próximo tick em que alguém a montar.
var j1 = class t5 {
  constructor(sG) {
    (this.entity = sG),
      (this.entityId = sG.id),
      ((this.vehicleState = { direction: 0 }),
      (this.sensorRunId = j0.runInterval(() => {
        if (!sG.isValid) return this.dispose();
        this.calculateHeightSensors();
      })));
  }
  static instances = new Map();
  dispose() {
    if (this.disposed) return;
    this.disposed = !0;
    j0.clearRun(this.sensorRunId);
    this._movement?.dispose();
    t5.instances.get(this.entityId) === this && t5.instances.delete(this.entityId);
  }
  vehicleState;
  _movement;
  pitchDiff = 0;
  rollDiff = 0;
  sensors = { frontLeft: 0, frontRight: 0, backLeft: 0, backRight: 0, center: 0 };
  get maxDirectionAngle() {
    return 40;
  }
  static getInstance(sG) {
    let sH = t5.instances.get(sG.id);
    if (!sH) {
      sH = new t5(sG);
      t5.instances.set(sG.id, sH);
    }
    return sH;
  }
  get isDrifting() {
    return this.movement.direction.y < 0 && this.movement.speed > 0.2;
  }
  get movement() {
    return this._movement || (this._movement = new j5(this)), this._movement;
  }
  getRiders() {
    let sG = this.entity.getComponent("rideable");
    return sG ? sG.getRiders() : [];
  }
  getDirection() {
    return this.vehicleState.direction;
  }
  setDirection(sG) {
    (this.vehicleState.direction = bN(sG, -1, 1)),
      this.entity.setProperty("dbe:movement_direction", this.vehicleState.direction * this.maxDirectionAngle);
  }
  async calculateHeightSensors() {
    let { dimension: sG, location: sH } = this.entity,
      sI = this.entity.getRotation(),
      sK = {},
      sL = {
        frontLeft: { x: -0.75, y: 2, z: 0.5 },
        frontRight: { x: 0.75, y: 2, z: 0.5 },
        backLeft: { x: -0.75, y: 2, z: -0.5 },
        backRight: { x: 0.75, y: 2, z: -0.5 },
        center: { x: 0, y: 2, z: 0 },
      };
    for (let [sR, sS] of Object.entries(sL)) {
      let sT = bO.rotateY(sS, -(sI.y * (Math.PI / 180))),
        sU = bO.add(sH, sT),
        t1 = d4("dbe:location", sG, sU);
      t1 && (t1.applyImpulse({ x: 0, y: -100, z: 0 }), (sK[sR] = t1));
    }
    await j0.waitTicks(1);
    // a cápsula pode ter sumido nesse tick (ou um sensor não ter nascido ou ter sumido): os sensores válidos saem
    if (!this.entity.isValid || Object.keys(sK).length < 5 || !Object.values(sK).every((t2) => t2.isValid)) {
      for (let t2 of Object.values(sK)) t2.isValid && t2.remove();
      return;
    }
    let sM = sK.frontLeft.location.y - this.entity.location.y,
      sN = sK.frontRight.location.y - this.entity.location.y,
      sO = sK.backLeft.location.y - this.entity.location.y,
      sP = sK.backRight.location.y - this.entity.location.y,
      sQ = sK.center.location.y - this.entity.location.y;
    (this.sensors.frontLeft = bN(sM, -1, 1)),
      (this.sensors.frontRight = bN(sN, -1, 1)),
      (this.sensors.backLeft = bN(sO, -1, 1)),
      (this.sensors.backRight = bN(sP, -1, 1)),
      (this.sensors.center = bN(sQ, -1, 1)),
      (this.pitchDiff = (sM + sN) / 2 - (sO + sP) / 2),
      (this.rollDiff = (sN + sP) / 2 - (sM + sO) / 2);
    for (let t2 of Object.values(sK)) t2.remove();
  }
};
function j2(sG) {
  return j1.getInstance(sG);
}
var j3 = 0.5;
function j4(sG) {
  let sH = sG.getComponent("minecraft:riding");
  if (sH) {
    let sI;
    try {
      sI = sH.entityRidingOn;
    } catch {}
    if (sI?.typeId === "dbe:capsule_991") {
      let sK = j2(sI);
      if (sK) {
        let sL = sG.inputInfo.getMovementVector();
        sK.movement.setDirection(sL);
      }
    }
  }
}
var j5 = class {
  constructor(sG) {
    (this.vehicle = sG),
      (this.runId = iZ.runInterval(() => {
        if (!sG.entity.isValid) return sG.dispose();
        this.updateDirection(), this.moveVehicle();
      }));
  }
  dispose() {
    iZ.clearRun(this.runId);
  }
  direction = { x: 0, y: 0 };
  speed = 0;
  get isMoving() {
    return this.direction.x !== 0;
  }
  addSpeed(sG) {
    this.setSpeed(this.speed + sG);
  }
  setDirection(sG) {
    this.direction = sG;
  }
  setSpeed(sG) {
    (this.speed = bN(sG, -0.1, j3)), this.vehicle.entity.setProperty("dbe:wheel_speed", sG);
  }
  applyFriction(sG, sH) {
    return sG > 0 ? Math.max(0, sG - sH) : sG < 0 ? Math.min(0, sG + sH) : 0;
  }
  calculateRotation() {
    let { entity: sG, pitchDiff: sH, rollDiff: sI } = this.vehicle,
      sK = sG.getRotation(),
      sL = 0.05,
      sM = bN(Math.abs(sH) > sL ? sH : 0, -1, 1),
      sN = Math.abs(sI) > sL ? sI : 0,
      sO = this.vehicle.getDirection() * this.vehicle.maxDirectionAngle * this.speed;
    (sK.y += sO), (sK.x = sM * 45), this.vehicle.entity.setRotation(sK);
  }
  moveVehicle() {
    let { entity: sG, sensors: sH } = this.vehicle,
      sI = (sH.frontLeft + sH.frontRight) / 2,
      sK = sG.getViewDirection(),
      sL = sG.getVelocity(),
      sM = this.vehicle.isDrifting ? 1 : 0,
      sN = bO.lerp(sK, sL, sM);
    this.vehicle.entity.applyImpulse({ x: sN.x * this.speed, y: 0, z: sN.z * this.speed }),
      this.setSpeed(this.speed),
      this.updateMotorSound();
  }
  updateDirection() {
    let sG = this.vehicle.getDirection(),
      sH = this.direction.x;
    if (sH !== 0) {
      let sI = Math.sign(sG),
        sK = Math.sign(sH);
      sI !== 0 && sI !== sK ? this.vehicle.setDirection(sG - sH * 0.025) : this.vehicle.setDirection(sG - sH * 0.05);
    }
    if ((this.direction.y > 0 && this.vehicle.movement.addSpeed(0.0025), this.direction.y !== 0 && !sH)) {
      let sL = this.applyFriction(sG, 0.05);
      this.vehicle.setDirection(sL);
    }
    if (this.direction.y === 0) {
      let sM = this.applyFriction(this.speed, 0.005);
      this.setSpeed(sM);
    }
    this.direction.y < 0 && this.vehicle.movement.addSpeed(this.speed > 0 ? -0.005 : -0.0025), this.calculateRotation();
  }
  updateMotorSound() {
    let { entity: sG } = this.vehicle,
      sH = this.speed / j3,
      sI;
    sH > 0.9 ? (sI = "vehicle.motor_idle3") : sH > 0.7 ? (sI = "vehicle.motor_idle2") : (sI = "vehicle.motor_idle1");
    let sK = 1,
      sL = 0.5 + sH * 0.5;
    this.vehicle.isDrifting && sG.dimension.playSound("vehicle.drifting", sG.location, { pitch: sK, volume: sL }),
      sG.dimension.playSound(sI, sG.location, { pitch: sK, volume: sL });
  }
};
export { iy, iz, iB, iF, iG, iH, iJ, iK, iQ, iR, iV, iW, iX, j1, j2, j3, j4, j5 };
