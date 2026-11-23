// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–4 de então, linhas 185–520.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { cG, cH, cI } from "./03_skill_base.js";
import { aH, bO } from "./01_util.js";
import { hN, hO } from "./14_player.js";
import { EntityComponentTypes as rM, GameMode as rN, system as rO } from "@minecraft/server";
import { d4 } from "./05_db_cooldowns.js";
import { c1 } from "../vendor/vanilla_data.js";
import { ex } from "./08_fusion_regions.js";
import { iV } from "./17_items_balls_fusion.js";
import { skills_data as rL } from "../data/skills_data.js";
import { hj } from "./13_ki_attack_hud_level.js";
import { isTravelPending as duIsTravelPending } from "../travel_safety.js";
import { cT } from "./04_tournament_dims.js";
var rP = class extends cH {
  flyEntity;
  isLoaded = !1;
  jumpState = { lastJump: !1, jumpCount: 0 };
  // O2a: o voo deixava de reenviar dbe:fly_mode e de reescrever a velocidade da montaria a cada tick. Só escreve
  // quando o valor muda (ou a montaria é outra); a cada FLY_REFRESH_TICKS ticks os caches são esquecidos e tudo é
  // reaplicado, para o caso de outro caminho mudar a propriedade (ex.: fusão) ou o jogo reverter a velocidade.
  lastFlyMode;
  lastFlySpeed;
  lastFlySpeedEntityId;
  flyRefreshTicks = 0;
  static FLY_REFRESH_TICKS = 20;
  constructor(sG, sH) {
    super(sG, sH);
    let { dimension: sI, location: sK } = sG.entity;
    aH.waitForChunkLoad(sI, sK).then(() => {
      if (!sG.entity.isValid) return;
      if (this.isEnabled && !this.startRiding()) this.disable();
      this.isLoaded = !0;
    }).catch((error) => {
      console.warn("[Flight] initialization failed; flight can be retried: " + error);
      if (sG.entity.isValid) {
        this.disable();
        this.isLoaded = !0;
      }
    });
  }
  get flyMode() {
    return this.isHover ? "fast" : "normal";
  }
  get flySpeed() {
    return this.dbeEntity.attributes.stats.getStat("flying_speed")?.value ?? 0;
  }
  get isHover() {
    return this.dbeEntity instanceof hN ? this.dbeEntity.player.isJumping : !1;
  }
  disable() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_end", sH),
      (this.entitySkillData.state.enabled = !1),
      this.saveState(),
      this.stopRiding(),
      this.forgetFlyCache(),
      this.setFlyModeProperty("none");
  }
  // Star Navigator / qualquer troca de dimensão com o voo ligado: a montaria não atravessa, então a troca desliga o voo
  // (afterPlayerDimensionChange) e ele religa sozinho no destino, quando a viagem terminou, o chunk carregou e o jogador
  // pode voar (vivo, com ki, fora do Oozaru e do criativo, sem montaria, sem ação bloqueada). Desiste em
  // RESUME_WINDOW_TICKS, se o jogador trocar de dimensão de novo ou se o voo já tiver sido religado.
  static RESUME_WINDOW_TICKS = 200;
  resumeAfterDimensionChange(dimensionId) {
    let player = this.dbeEntity.player,
      until = rO.currentTick + rP.RESUME_WINDOW_TICKS,
      id = rO.runInterval(() => {
        let stop = () => rO.clearRun(id);
        try {
          if (!player.isValid || player.dimension.id !== dimensionId || this.isEnabled || rO.currentTick > until) return stop();
          if (duIsTravelPending(player)) return;
          if ((player.getComponent("minecraft:health")?.currentValue ?? 0) <= 0) return; // morto: espera o respawn
          let { ki: sG, transformations: sH } = this.dbeEntity;
          if (
            player.getGameMode() === rN.Creative ||
            sG.currentValue <= 0 ||
            sH.currentTransformation.isOozaru ||
            this.dbeEntity.isActionBlocked ||
            player.getComponent("minecraft:riding")?.entityRidingOn
          )
            return stop();
          if (!player.dimension.isChunkLoaded(player.location)) return;
          stop(), this.enable();
        } catch (error) {
          stop(), console.warn("[Flight] resume after dimension change: " + error);
        }
      }, 5);
  }
  async enable() {
    if (!this.startRiding()) return;
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    sG.playSound("common.bukujyutsu_up", sH),
      (this.entitySkillData.state.enabled = !0),
      this.saveState(),
      this.setFlyModeProperty("normal");
  }
  onTick() {
    if (this.isLoaded && this.dbeEntity instanceof hN) {
      if (this.flyEntity && !this.flyEntity.isValid) {
        this.disable();
        return;
      }
      let { ki: sG, player: sH, transformations: sI } = this.dbeEntity,
        { currentTransformation: sK } = sI,
        sL = sH.getGameMode() === rN.Creative;
      if (this.isEnabled) {
        let riding = sH.getComponent("minecraft:riding")?.entityRidingOn;
        let sM = this.flyEntity?.isValid && riding?.id === this.flyEntity.id &&
          this.flyEntity.dimension.id === sH.dimension.id;
        ++this.flyRefreshTicks >= rP.FLY_REFRESH_TICKS && this.forgetFlyCache();
        this.setFlyModeProperty(this.flyMode), (sL || sG.currentValue <= 0 || sK.isOozaru || !sM) && this.disable();
      } else !sL && sG.currentValue > 0 && !sK.isOozaru && this.isDoubleJump && this.enable();
    }
  }
  get isDoubleJump() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let { isJumping: sG, isOnGround: sH } = this.dbeEntity.entity;
    return (
      sH && (this.jumpState.jumpCount = 0),
      sG && !this.jumpState.lastJump && (this.jumpState.jumpCount++, this.jumpState.jumpCount === 2)
        ? ((this.jumpState.jumpCount = 0), !0)
        : ((this.jumpState.lastJump = sG), !1)
    );
  }
  async setFlyModeProperty(sG) {
    if (sG === "none") {
      await rO.waitTicks(1);
      if (this.isEnabled) return;
    }
    if (sG !== this.lastFlyMode) {
      this.lastFlyMode = sG;
      this.dbeEntity.trySetProperty("dbe:fly_mode", sG);
    }
    this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
  }
  setFlySpeed(sG) {
    let sH = this.flySpeed * sG,
      fly = this.flyEntity;
    if (!fly || (sH === this.lastFlySpeed && fly.id === this.lastFlySpeedEntityId)) return;
    let sI = fly.getComponent(rM.FlyingSpeed),
      sK = fly.getComponent(rM.UnderwaterMovement);
    sI && (sI.value = sH), sK && sK.setCurrentValue(sH);
    this.lastFlySpeed = sH;
    this.lastFlySpeedEntityId = fly.id;
  }
  forgetFlyCache() {
    this.lastFlyMode = void 0;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    this.flyRefreshTicks = 0;
  }
  startRiding() {
    if (this.flyEntity?.isValid) this.stopRiding();
    this.forgetFlyCache();
    let { entity: sG } = this.dbeEntity,
      { dimension: sH, location: sI } = sG,
      sK = sG.getRotation();
    try {
      if (((this.flyEntity = d4("dbe:player_fly", sH, sI, { initialRotation: sK.y })), this.flyEntity)) {
        let sL = this.flyEntity.getComponent("minecraft:rideable");
        if (sL?.addRider(sG)) {
          this.setFlySpeed(this.flyMode === "fast" ? 2 : 1);
          return !0;
        }
      }
    } catch (error) {
      console.warn("[Flight] rider attachment failed: " + error);
    }
    if (this.flyEntity?.isValid) this.flyEntity.remove();
    this.flyEntity = void 0;
    return !1;
  }
  stopRiding() {
    let sG = this.flyEntity;
    this.lastFlySpeed = void 0;
    this.lastFlySpeedEntityId = void 0;
    if (((this.flyEntity = void 0), sG?.isValid)) {
      let sH = sG.getVelocity();
      let player = this.dbeEntity.entity;
      if (player.isValid && player.dimension.id === sG.dimension.id &&
          bO.distance(player.location, sG.location) < 4)
        player.applyImpulse({ x: sH.x, y: sH.y, z: sH.z });
      sG.remove();
    }
  }
};
import { ButtonState as rQ, EntityDamageCause as rR, InputButton as rS } from "@minecraft/server";
var rT = 2,
  rU = 1.25,
  rV = class extends cH {
    isMidAir = !1;
    ticks = 0;
    constructor(sG, sH) {
      super(sG, sH);
    }
    onTick() {
      if (this.dbeEntity instanceof hN) {
        if (this.dbeEntity.skills.isSkillActive("fly")) {
          this.isMidAir = !1;
          this.ticks = 0;
          return;
        }
        let { attributes: sG, player: sH, stamina: sI, transformations: sK } = this.dbeEntity;
        if ((sH.isJumping && !this.isMidAir && (this.isMidAir = !0), this.isMidAir)) {
          let sL = sG.stats.getStat("jump")?.value ?? 0,
            { inputInfo: sM } = sH,
            sN = sH.getVelocity(),
            sO = sM.getButtonState(rS.Jump) === rQ.Pressed,
            sP = sN.y >= 0 && this.ticks <= sL,
            sQ = sI.currentValue >= rT;
          sO &&
            sP &&
            sQ &&
            (sI.removeCurrent(rT), sH.applyKnockback({ x: sN.x * rU, z: sN.z * rU }, 0.5), this.ticks++),
            sH.isOnGround &&
              ((this.isMidAir = !1), (this.ticks = 0), sK.currentTransformation.isOozaru && this.triggerOozaruStomp());
        }
      }
    }
    triggerOozaruStomp() {
      let { entity: sG } = this.dbeEntity,
        sH = sG.dimension.getEntities({ location: sG.location, maxDistance: 4 });
      for (let sI of sH) {
        if (sI === sG) continue;
        let sK = bO.normalize(bO.subtract(sI.location, sG.location));
        try {
          sI.applyDamage(1, { damagingEntity: sG, cause: rR.none }) &&
            sI.applyKnockback({ x: sK.x * 5, z: sK.z * 5 }, 0);
        } catch {}
      }
    }
  };
import { InputPermissionCategory as rW, system as rX } from "@minecraft/server";
var rY = class tb extends cH {
  _startingFusion = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get startingFusion() {
    return this._startingFusion;
  }
  onTick() {
    if (this.isEnabled && !this._startingFusion && this.dbeEntity instanceof hN) {
      let sG = this.findNearbyPlayer();
      if (sG) {
        let sH = hO(sG);
        sG && this.checkMetamoranConditions(sH) && this.startFusionScene(sG);
      }
    }
  }
  checkMetamoranConditions(sG) {
    let sH = sG.skills.getSkill("metamoran_dance");
    return sH instanceof tb ? sH.isEnabled && !sH.startingFusion && !sG.isFused : !1;
  }
  checkCompatibility(sG) {
    let sH = this.dbeEntity.attributes.stats.getStat("size")?.value ?? 0,
      sI = sG.attributes.stats.getStat("size")?.value ?? 0,
      sK = Math.abs(sH - sI),
      sL = Math.abs(this.dbeEntity.entity.location.y - sG.player.location.y),
      sM = 0.2,
      sN = 0.0625,
      sO = 1 - Math.min(sK / sM, 1),
      sP = 1 - Math.min(sL / sN, 1);
    return (sO + sP) / 2;
  }
  findNearbyPlayer() {
    let { dimension: sG, location: sH } = this.dbeEntity.entity;
    return sG.getPlayers({ location: sH, maxDistance: 5 }).find((sI) => sI !== this.dbeEntity.entity);
  }
  async startFusionScene(sG) {
    let sH = this.dbeEntity;
    if (!this._startingFusion && sH instanceof hN) {
      let { entity: sI } = sH,
        sK = hO(sG);
      this._startingFusion = !0;
      let sL = sI.location,
        sM = bO.normalize(sI.getViewDirection()),
        sN = { x: 0, y: 1, z: 0 },
        sO = bO.normalize(bO.cross(sM, sN)),
        sP = 1.55,
        sQ = -5,
        sR = 1,
        sS = { x: sL.x - sO.x * sP, y: sL.y, z: sL.z - sO.z * sP },
        sT = { x: sL.x + sO.x * sP, y: sL.y, z: sL.z + sO.z * sP },
        sU = { x: (sS.x + sT.x) / 2, y: sL.y, z: (sS.z + sT.z) / 2 },
        t1 = { x: sU.x - sM.x * sQ, y: sU.y + sR, z: sU.z - sM.z * sQ },
        t2 = { x: sS.x + sM.x, y: sS.y + sM.y, z: sS.z + sM.z },
        t3 = { x: sT.x + sM.x, y: sT.y + sM.y, z: sT.z + sM.z };
      sI.teleport(sS, { facingLocation: t2 }),
        sG.teleport(sT, { facingLocation: t3 }),
        sI.playAnimation("animation.player.metamoran_dance_right"),
        sG.playAnimation("animation.player.metamoran_dance_left"),
        sI.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        sG.camera.setCamera(c1.Free, { location: t1, facingLocation: sU }),
        this.setInputLock(sH, !0),
        this.setInputLock(sK, !0),
        rX.runTimeout(() => {
          sI.camera.clear(), sG.camera.clear(), this.setInputLock(sH, !1), this.setInputLock(sK, !1);
          let t6 = this.checkCompatibility(sK);
          if (((this._startingFusion = !1), t6 < 0.8)) {
            this.dbeEntity.skills.getToggleSkill("metamoran_dance")?.disable(),
              sK.skills.getToggleSkill("metamoran_dance")?.disable();
            return;
          }
          sI.teleport(sU), sG.teleport(sU), ex.startFusion("metamoran", sI, sG, t6);
        }, 100);
    }
  }
  setInputLock(sG, sH) {
    sH
      ? sG.inputPermissionManager.blockInputPermission("fusion_scene", [rW.Camera, rW.Movement])
      : sG.inputPermissionManager.unblockInputPermission("fusion_scene");
  }
};
function rZ(sG, sH) {
  let sI = { x: sH.x, y: 0, z: sH.z },
    sK = Math.sqrt(sI.x ** 2 + sI.z ** 2);
  sK > 0 && ((sI.x /= sK), (sI.z /= sK));
  let sL = { x: sI.z, y: 0, z: -sI.x };
  return { x: sI.x * sG.y + sL.x * sG.x, y: 0, z: sI.z * sG.y + sL.z * sG.x };
}
var s0 = class extends cH {
  lastStrafeDirection = 0;
  lastStrafeTime = 0;
  strafeCooldown = 300;
  strafePressed = !1;
  constructor(sG, sH) {
    super(sG, sH);
  }
  get isDoubleStrafe() {
    if (!(this.dbeEntity instanceof hN)) return !1;
    let sG = this.dbeEntity.player.inputInfo.getMovementVector(),
      sH = Date.now(),
      sI = sG.x;
    if (sI !== 0 && !this.strafePressed) {
      this.strafePressed = !0;
      let sK = Math.sign(sI);
      if (this.lastStrafeDirection === sK && sH - this.lastStrafeTime <= this.strafeCooldown)
        return (this.lastStrafeDirection = 0), (this.lastStrafeTime = 0), !0;
      (this.lastStrafeDirection = sK), (this.lastStrafeTime = sH);
    }
    return sI === 0 && (this.strafePressed = !1), !1;
  }
  onTick() {
    if (this.isDoubleStrafe && this.dbeEntity instanceof hN) {
      let { player: sG } = this.dbeEntity,
        sH = sG.inputInfo.getMovementVector(),
        sI = sG.getViewDirection(),
        { x: sK, z: sL } = rZ(sH, sI);
      sG.applyImpulse({ x: sK * 4, y: 0, z: sL * 4 }),
        sG.dimension.spawnParticle("dbe:teleport", sG.location),
        sG.dimension.playSound("common.teleport2", sG.location);
    }
  }
};
function s1() {
  cG.register("absorption", iV),
    cG.register("burst_move", s0),
    cG.register("fly", rP),
    cG.register("jump", rV),
    cG.register("metamoran_dance", rY),
    cG.register("rapid_movement", cI);
  for (let sG of rL)
    if (!cG.has(sG.id))
      switch (sG.type) {
        case "ki_attack":
          cG.register(sG.id, hj);
          break;
        case "toggle":
          cG.register(sG.id, cH);
          break;
      }
}
s1();
import { tournaments_data as s2 } from "../data/tournaments_data.js";
function s3() {
  for (let sG of s2) cT.registerTournament(sG);
}
s3();
export { rP, rT, rU, rV, rY, rZ, s0, s1, s3 };
