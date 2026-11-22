// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 92–843.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { aH, aN, aO, b5, bG, bM, bO, bP } from "./01_util.js";
import { world as dA, InputPermissionCategory as dD, system as dE, Player as dG, world as dH, GameMode as dw, Player as dx, PlayerPermissionLevel as dy, system as dz, EquipmentSlot as ej, system as ek } from "@minecraft/server";
import { late } from "./late.js";
import { e9 } from "./07_stats.js";
import { CONFIG as dF } from "../config/config.js";
import { d5 } from "./05_db_cooldowns.js";
import { dC } from "./06_requirements.js";
import { duTravel } from "./du_travel.js";
import { every } from "./scheduler.js";
var ep = class {
    isWearingPotara(sG) {
      return aN.getEquippedItem(sG, ej.Head)?.typeId === "dbe:potara_earring";
    }
    async tryFusion(sG) {
      let sH = sG.player;
      if (this.isWearingPotara(sH)) {
        let sI = this.findNearbyPlayer(sH);
        if (!sI) return;
        let sK = late.hO(sI),
          sL = 0;
        for (; this.checkPotaraConditions(sG) && this.checkPotaraConditions(sK) && !(sL >= 100); ) {
          if (bO.distance(sI.location, sH.location) <= 0.1) {
            ex.startFusion("potara", sH, sI, 1);
            break;
          }
          this.moveToward(sH, sI.location), await ek.waitTicks(1), sL++;
        }
      }
    }
    checkPotaraConditions(sG) {
      return sG.player.isValid && !sG.isFused && this.isWearingPotara(sG.player);
    }
    findNearbyPlayer(sG) {
      return sG.dimension.getPlayers({ location: sG.location, maxDistance: 5 }).find((sH) => sH !== sG);
    }
    moveToward(sG, sH) {
      let sI = bO.normalize(bO.subtract(sH, sG.location)),
        sK = 0.1;
      sG.applyImpulse({ x: sI.x * sK, y: sI.y * sK, z: sI.z * sK });
    }
  },
  eq = new ep(),
  ev = class {
    constructor(sG, sH) {
      (this.dbePlayer = sG), (this.fusionData = sH);
    }
    get compatibility() {
      return this.fusionData.compatibility;
    }
    get isController() {
      return this.fusionData.isController;
    }
    get isValid() {
      if (!this.partnerPlayer) return !1;
      switch (this.type) {
        case "metamoran":
          return this.dbePlayer.skills.isSkillActive("metamoran_dance");
        case "potara":
          return eq.isWearingPotara(this.dbePlayer.player);
      }
    }
    get name() {
      return this.fusionData.fusionName;
    }
    get partnerId() {
      return this.fusionData.partnerId;
    }
    get partnerPlayer() {
      let sG = dH.getEntity(this.partnerId);
      if (sG instanceof dG) return late.hO(sG).getCurrentFusion()?.partnerId === this.dbePlayer.player.id ? sG : void 0;
    }
    get type() {
      return this.fusionData.type;
    }
    getMultipliers() {
      let { compatibility: sG, partnerPlayer: sH } = this,
        sI = e9(),
        sK = this.type === "metamoran" ? dF.FUSION.METAMORAN_FUSION_MULTIPLIER : dF.FUSION.POTARA_FUSION_MULTIPLIER,
        sL = sG * sK;
      if (sH) {
        let { attributes: sM } = this.dbePlayer,
          sN = late.hO(sH).attributes;
        for (let sO of sN.getAttributes()) {
          let sP = (sM.getAttribute(sO.id)?.value ?? 1) + sO.value;
          sI[sO.id] = (sP / 100) * sL + 1;
        }
      }
      return sI;
    }
  },
  ew = class {
    fusionMap = new Map();
    fusionHandler(sG) {
      let sH = sG.getCurrentFusion();
      sH ? sH.isValid || this.tryStopFusion(sG) : eq.tryFusion(sG);
    }
    getFusion(sG) {
      let sH = sG.player.id,
        sI = this.fusionMap.get(sH);
      if (!sI) {
        let sK = sG.data.get("fusion");
        sK && ((sI = new ev(sG, sK)), this.fusionMap.set(sH, sI));
      }
      return sI;
    }
    isFused(sG) {
      return this.fusionMap.has(sG.player.id);
    }
    startFusion(sG, sH, sI, sK) {
      let sL = this.createFusionName(sH.name, sI.name);
      this.setFusion(sH, sI, { type: sG, compatibility: sK, fusionName: sL, isController: !0, partnerId: sI.id }),
        this.setFusion(sI, sH, { type: sG, compatibility: sK, fusionName: sL, isController: !1, partnerId: sH.id });
    }
    createFusionName(sG, sH) {
      let sI = sG.slice(0, 4) + sH.slice(0, 4);
      return (sI[0].toUpperCase() + sI.slice(1).toLowerCase()).replace(" ", "");
    }
    setFusion(sG, sH, sI) {
      let sK = late.hO(sG),
        { attributes: sL, data: sM, inputPermissionManager: sN } = sK;
      sK.trySetProperty("dbe:fusion_type", sI.type),
        sG.triggerEvent("dbe:fusion_player_" + (sI.isController ? 1 : 2)),
        sI.isController
          ? ((sK.isArmorVisible = !1),
            sG.dimension.playSound("common.fusion_potara", sG.location),
            sG.dimension.spawnParticle("dbe:potara_sphere", sG.location))
          : (sG.camera.setCamera("minecraft:third_person"),
            dE.runTimeout(() => sH.runCommand('ride @p[name="' + sG.name + '"] start_riding @s'), 10),
            sN.blockInputPermission("fusion", [dD.Movement])),
        sM.set("fusion", sI),
        dE.run(() => sL.modifiers.setModifier("fusion")),
        sK.updateNameTag();
      let sO = new ev(sK, sI);
      this.fusionMap.set(sG.id, sO);
    }
    async tryStopFusion(sG) {
      let sH = this.getFusion(sG);
      if (sH) {
        let { attributes: sI, data: sK, inputPermissionManager: sL, player: sM, skills: sN, transformations: sO } = sG;
        sK.delete("fusion"),
          this.fusionMap.delete(sM.id),
          sG.trySetProperty("dbe:fusion_type", "none"),
          sM.triggerEvent("dbe:unfused"),
          sN.disableToggleSkills(),
          sO.untransform(),
          sI.modifiers.removeModifier("fusion"),
          sH.isController ||
            (sM.camera.clear(),
            sL.unblockInputPermission("fusion"),
            dE.run(() => sM.runCommand("ride @s stop_riding"))),
          sG.updateNameTag(),
          (sG.isArmorVisible = sO.currentTransformation.isArmorVisible),
          await dE.waitTicks(50);
      }
    }
  };
bM.on("entity_died", ({ dbeEntity: sG }) => {
  sG instanceof late.hN && ex.tryStopFusion(sG);
});
var ex = new ew();
import { CONFIG as ey } from "../config/config.js";
import { system as ez, world as eA } from "@minecraft/server";
import { system as eB, TextPrimitive as eC, world as eD } from "@minecraft/server";
var eE = class {
    textPrimitive;
    battlePowerRanking = new Map();
    initialized = !1;
    getBattlePowerLeaderboardEntry(sG) {
      return this.battlePowerRanking.get(sG);
    }
    getBattlePowerLeaderboardEntries() {
      return this.battlePowerRanking.values();
    }
    init() {
      this.initialized || ((this.initialized = !0), this.loadLeaderboard());
    }
    updatePlayerEntry(sG) {
      let { attributes: sH, player: sI } = sG,
        sK = this.battlePowerRanking.get(sI.id),
        { battlePower: sL } = sH;
      (!sK || sL > sK.battlePower) &&
        (this.battlePowerRanking.set(sI.id, { battlePower: sL, playerId: sI.id, playerName: sI.name }),
        this.saveLeaderboard(),
        this.updateBattlePowerHologram());
    }
    loadLeaderboard() {
      eB.run(() => {
        this.textPrimitive = new eC({ dimension: b5.dimensions.overworld, x: 150, y: 310, z: 150 }, "");
        let sG = bG(eD, "leaderboard_v2").get("battle_power") ?? [];
        for (let sH of sG) this.battlePowerRanking.set(sH.playerId, sH);
        (this.textPrimitive.scale = 2),
          eD.primitiveShapesManager.addText(this.textPrimitive),
          this.updateBattlePowerHologram();
      });
    }
    saveLeaderboard() {
      let sG = [...this.battlePowerRanking.entries()]
        .sort(([, sH], [, sI]) => sI.battlePower - sH.battlePower)
        .slice(0, 10);
      (this.battlePowerRanking = new Map(sG)),
        bG(eD, "leaderboard_v2").set("battle_power", [...this.battlePowerRanking.values()]);
    }
    updateBattlePowerHologram() {
      let sG = [...this.battlePowerRanking.values()],
        sH = [{ translate: "hologram.battle_power_ranking" }];
      sG.forEach(({ battlePower: sI, playerName: sK }, sL) => {
        sH.push({ text: "\n" }, { text: "§l§u" + (sL + 1) + ". §r§6" + sK + " §r§l§e" + aO.shortenNumber(sI) });
      }),
        this.textPrimitive?.setText({ rawtext: sH });
    }
  },
  eF = new eE();
bM.on("battle_power_changed", ({ dbeEntity: sG }) => {
  eF.initialized && sG instanceof late.hN && !sG.isFused && eF.updatePlayerEntry(sG);
});
function eG(sG) {
  return sG.replace(/[^a-zA-Z0-9_]/g, "");
}
var eH = class {
    constructor(sG) {
      (this.groupData = sG), (this.members = sG.members ?? []);
    }
    members = [];
    get claimedRegions() {
      return eP.getAllRegions().filter((sG) => sG.isOwner(this.id));
    }
    get friendlyFire() {
      return this.groupData.friendlyFire ?? !1;
    }
    get id() {
      return this.groupData.id;
    }
    get maxClaims() {
      return this.totalMembers;
    }
    get memberIds() {
      return this.members.map(({ id: sG }) => sG);
    }
    get name() {
      return this.groupData.name;
    }
    get ownerId() {
      return this.groupData.ownerId;
    }
    get spawnPoint() {
      return this.groupData.spawnPoint;
    }
    get totalMembers() {
      return this.members.length;
    }
    addPlayerToGroup(sG) {
      if (eJ.getPlayerGroup(sG.id)) {
        sG.sendMessage({ translate: "player_group.already_in_group" });
        return;
      }
      this.isMember(sG.id) ||
        (this.members.push({ id: sG.id, name: sG.name }),
        this.getOwner() || this.setOwner(sG.id),
        this.saveGroup(),
        late.hO(sG).updateNameTag(),
        sG.sendMessage({ translate: "player_group.join.success", with: [this.name] }));
    }
    deleteClaims() {
      for (let sG of this.claimedRegions) eO(sG.dimension).remove(sG.id);
    }
    deleteSpawnPoint() {
      delete this.groupData.spawnPoint, this.saveGroup();
    }
    displayClaimBorder(sG, sH) {
      ez.run(() => {
        if (sH.dimension.isChunkLoaded(sH.center)) {
          let sI = sH.pos1.x,
            sK = sH.pos2.x,
            sL = sH.pos1.z,
            sM = sH.pos2.z,
            sN = sG.location.y;
          for (let sO = sI; sO <= sK; sO++)
            sG.spawnParticle("dbe:claimed_delimitation", { x: sO, y: sN, z: sL }),
              sG.spawnParticle("dbe:claimed_delimitation", { x: sO, y: sN, z: sM });
          for (let sP = sL + 1; sP < sM; sP++)
            sG.spawnParticle("dbe:claimed_delimitation", { x: sI, y: sN, z: sP }),
              sG.spawnParticle("dbe:claimed_delimitation", { x: sK, y: sN, z: sP });
        }
      });
    }
    getData() {
      return { ...this.groupData, members: this.members };
    }
    getGroupPower() {
      let sG = 0;
      for (let sH of this.members) sG += eF.getBattlePowerLeaderboardEntry(sH.id)?.battlePower ?? 0;
      return sG;
    }
    getMemberByName(sG) {
      return this.members.find(({ name: sH }) => sH === sG);
    }
    getMemberById(sG) {
      return this.members.find(({ id: sH }) => sH === sG);
    }
    getOnlinePlayers() {
      let sG = [];
      for (let sH of eA.getAllPlayers()) this.isMember(sH.id) && sG.push(sH);
      return sG;
    }
    getOwner() {
      return this.ownerId ? this.getMemberById(this.ownerId) : void 0;
    }
    getPlayerById(sG) {
      return this.getOnlinePlayers().find((sH) => sH.id === sG);
    }
    isMember(sG) {
      return this.members.some(({ id: sH }) => sH === sG);
    }
    isOwner(sG) {
      return this.ownerId === sG;
    }
    removePlayerFromGroup(sG) {
      let sH = this.getMemberById(sG);
      if (sH) {
        let sI = this.getPlayerById(sG),
          sK = this.members.indexOf(sH);
        this.members.splice(sK, 1),
          this.totalMembers > 0
            ? (this.isOwner(sH.id) && this.setOwner(this.members[0].id), this.saveGroup())
            : eJ.deleteGroup(this.id),
          sI && late.hO(sI).updateNameTag();
      }
    }
    setFriendlyFire(sG) {
      (this.groupData.friendlyFire = sG), this.saveGroup();
    }
    setOwner(sG) {
      (this.groupData.ownerId = sG), this.saveGroup();
    }
    setSpawnPoint(sG, sH) {
      (this.groupData.spawnPoint = { dimensionId: sG.id, location: sH }), this.saveGroup();
    }
    toggleFriendlyFire() {
      return (this.groupData.friendlyFire = !this.friendlyFire), this.saveGroup(), this.friendlyFire;
    }
    async tryClaimLocation(sG, sH) {
      let sI = aH.getChunk(sG, sH),
        sK = eO(sG);
      if (
        sK.isBlockProtection(sH) ||
        sG.id.startsWith("dbe:angel_staff_dimension") ||
        ey.CLAIM.FORBIDDEN_DIMENSIONS.includes(sG.id)
      )
        return !1;
      if (!sK.hasRegion(sI.id)) {
        let sL = await sK.setRegionAsync({
          id: sI.id,
          dimensionId: sG.id,
          blockProtection: !0,
          memberIds: this.memberIds,
          persist: !0,
          owner: { type: "group", id: this.id, name: this.name },
          pos1: { x: sI.chunkOrigin.x, y: sG.heightRange.min, z: sI.chunkOrigin.z },
          pos2: { x: sI.chunkOrigin.x + 15, y: sG.heightRange.max, z: sI.chunkOrigin.z + 15 },
        });
        for (let sM of this.getOnlinePlayers()) this.displayClaimBorder(sM, sL);
        return !0;
      }
      return !1;
    }
    unClaimLocation(sG, sH) {
      let sI = eO(sG);
      for (let sK of sI.getChunkRegions(sH)) sK.owner?.id === this.id && sI.remove(sK.id);
    }
    saveGroup() {
      eJ.saveGroups(), this.updateRegions();
    }
    updateRegions() {
      for (let sG of this.claimedRegions) sG.setMembers(this.memberIds);
    }
  },
  eI = class {
    database;
    groupsMap = new Map();
    constructor() {
      ez.run(() => {
        (this.database = bG(eA, "groups")), this.initializeGroups();
      });
    }
    acceptInvite(sG, sH) {
      let sI = this.getPendingInvites(sG),
        sK = this.getGroupById(sH);
      if (sK && sI.includes(sH)) {
        if (sK.totalMembers >= 10) {
          sG.sendMessage({ translate: "player_group.join.group_full" });
          return;
        }
        sK.addPlayerToGroup(sG),
          bG(sG, "group").set(
            "invites",
            sI.filter((sL) => sL !== sH),
          );
      } else sG.sendMessage({ translate: "player_group.join.group_not_found" });
    }
    areInSameGroup(sG, sH) {
      let sI = this.getPlayerGroup(sG.id),
        sK = this.getPlayerGroup(sH.id);
      return !sI || !sK ? !1 : sI === sK;
    }
    createGroup(sG) {
      let sH = this.getGroupByName(sG);
      if (!sH) {
        let sI = { id: d5(), friendlyFire: !1, name: sG };
        return (sH = new eH(sI)), this.groupsMap.set(sI.id, sH), this.saveGroups(), sH;
      }
    }
    deleteGroup(sG) {
      let sH = this.getGroupById(sG);
      sH && (sH.deleteClaims(), this.groupsMap.delete(sG), this.saveGroups());
    }
    getGroups() {
      return this.groupsMap.values();
    }
    getGroupById(sG) {
      return this.groupsMap.get(sG);
    }
    getGroupByName(sG) {
      for (let sH of this.getGroups()) if (sH.name === sG) return sH;
    }
    getPendingInvites(sG) {
      return bG(sG, "group").get("invites") || [];
    }
    getPlayerGroup(sG) {
      for (let sH of this.getGroups()) if (sH.isMember(sG)) return sH;
    }
    hasGroup(sG) {
      for (let sH of this.getGroups()) if (sH.isMember(sG.id)) return !0;
      return !1;
    }
    invitePlayerToGroup(sG, sH) {
      let sI = this.getGroupById(sH);
      if (sI) {
        let sK = eJ.getPendingInvites(sG);
        sK.includes(sH) ||
          (sK.push(sH),
          sG.sendMessage({ translate: "player_group.invite.received", with: [sI.name, sI.name] }),
          bG(sG, "group").set("invites", sK));
      }
    }
    saveGroups() {
      let sG = [];
      for (let sH of this.getGroups()) sG.push(sH.getData());
      this.database?.set("groups", sG);
    }
    initializeGroups() {
      if (this.database) {
        let sG = this.database.get("groups") || [];
        for (let sH of sG) {
          let sI = new eH(sH);
          this.groupsMap.set(sH.id, sI);
        }
      }
    }
  },
  eJ = new eI(),
  eK = 16,
  eL = class {
    constructor(sG, sH) {
      (this.dimensionRegionManager = sG), (this.options = sH);
    }
    get accessRequirements() {
      return this.options.accessRequirements;
    }
    get allowPvP() {
      return this.options.allowPvP ?? !0;
    }
    get allowQuests() {
      return this.options.allowQuests ?? !0;
    }
    get blockProtection() {
      return this.options.blockProtection ?? !1;
    }
    get center() {
      return new bP((this.pos1.x + this.pos2.x) / 2, (this.pos1.y + this.pos2.y) / 2, (this.pos1.z + this.pos2.z) / 2);
    }
    get dimension() {
      return this.dimensionRegionManager.dimension;
    }
    get gravity() {
      return this.options.gravity ?? 0;
    }
    get id() {
      return this.options.id;
    }
    get memberIds() {
      return this.options.memberIds || [];
    }
    get owner() {
      return this.options.owner;
    }
    get persist() {
      return this.options.persist ?? !1;
    }
    get pos1() {
      return this.options.pos1;
    }
    get pos2() {
      return this.options.pos2;
    }
    get priority() {
      return this.options.priority ?? 0;
    }
    get preventMobSpawning() {
      return this.options.preventMobSpawning ?? !1;
    }
    get spawnPoint() {
      return this.options.spawnLocation || this.center;
    }
    canBuild(sG) {
      return this.blockProtection ? this.isAdmin(sG) || this.isOwner(sG.id) || this.isMember(sG.id) : !0;
    }
    canEnter(sG) {
      return this.accessRequirements ? dC.testAll(sG, this.accessRequirements.requirements) : !0;
    }
    claim(sG) {
      return this.options.owner
        ? !1
        : ((this.options.owner = { type: sG instanceof dx ? "player" : "group", id: sG.id, name: sG.name }),
          this.dimensionRegionManager.save(),
          !0);
    }
    isInside(sG, sH) {
      return sG !== this.dimension
        ? !1
        : ["x", "y", "z"].every((sI) => {
            let sK = Math.floor(sH[sI]),
              sL = Math.min(this.pos1[sI], this.pos2[sI]),
              sM = Math.max(this.pos1[sI], this.pos2[sI]);
            return sK >= sL && sK <= sM;
          });
    }
    isMember(sG) {
      return this.memberIds.includes(sG);
    }
    isOwner(sG) {
      return this.owner?.id === sG;
    }
    setMembers(sG) {
      (this.options.memberIds = sG), this.dimensionRegionManager.save();
    }
    setSpawnPoint(sG) {
      (this.options.spawnLocation = sG), this.dimensionRegionManager.save();
    }
    teleportToFallbackLocation(sG) {
      return new Promise((resolve) => dz.run(async () => {
        try {
          if (!this.accessRequirements) return resolve(!1);
          if (sG instanceof dx) await ex.tryStopFusion(late.hO(sG));
          resolve(await duTravel(sG, this.accessRequirements.deniedAccessLocation,
            { dimension: this.dimension, label: "region fallback " + this.id }));
        } catch (error) {
          console.warn(`[Dragon Universe] Region fallback failed: ${error?.stack ?? error}`);
          resolve(!1);
        }
      }));
    }
    teleportToRegion(sG) {
      return new Promise((resolve) => dz.run(async () => {
        try {
          if (!this.spawnPoint) return resolve(!1);
          if (sG instanceof dx) await ex.tryStopFusion(late.hO(sG));
          resolve(await duTravel(sG, this.spawnPoint, { dimension: this.dimension, label: "region " + this.id }));
        } catch (error) {
          console.warn(`[Dragon Universe] Region travel failed: ${error?.stack ?? error}`);
          resolve(!1);
        }
      }));
    }
    isAdmin(sG) {
      return sG.playerPermissionLevel === dy.Operator && sG.getGameMode() === dw.Creative;
    }
  },
  eM = class t0 {
    constructor(sG) {
      (this.dimension = sG), dz.runJob(this.load());
    }
    static instances = new Map();
    regions = new Map();
    globalRegion;
    spatialIndex = new Map();
    entityRegionCache = new Map();
    regionsLoaded = !1;
    static getDimensionRegionManagers() {
      return this.instances.values();
    }
    static getInstance(sG) {
      return this.instances.has(sG.id) || this.instances.set(sG.id, new t0(sG)), this.instances.get(sG.id);
    }
    canPlayerBuild(sG, sH) {
      let sI = this.getTopRegionAt(sH);
      return !sI || !sI.blockProtection ? this.regionsLoaded : sI.canBuild(sG);
    }
    cleanup() {
      for (let sG of this.entityRegionCache.keys()) dA.getEntity(sG) || this.entityRegionCache.delete(sG);
    }
    getRegion(sG) {
      return this.regions.get(sG);
    }
    getRegions() {
      return this.regions.values();
    }
    getChunkRegions(sG) {
      let sH = Math.floor(sG.x / eK) + "." + Math.floor(sG.z / eK),
        sI = this.spatialIndex.get(sH) ?? [];
      return this.globalRegion ? [...sI, this.globalRegion] : sI;
    }
    getTopRegionAt(sG) {
      let sH;
      for (let sI of this.getChunkRegions(sG))
        sI.isInside(this.dimension, sG) && (!sH || sI.priority > sH.priority) && (sH = sI);
      return sH;
    }
    hasRegion(sG) {
      return this.regions.has(sG);
    }
    isBlockProtection(sG) {
      return this.getTopRegionAt(sG)?.blockProtection ?? !this.regionsLoaded;
    }
    isSafeZoneLocation(sG) {
      let sH = this.getTopRegionAt(sG);
      return sH ? !sH.allowPvP : !this.regionsLoaded;
    }
    remove(sG) {
      let sH = this.regions.get(sG);
      sH && (this.regions.delete(sG), this.removeRegionFromIndex(sH), this.save());
    }
    save() {
      let sG = [];
      for (let sH of this.getRegions()) sH.persist && sG.push(sH.options);
      bG(dA, "regions").set(this.dimension.id, sG);
    }
    async setRegionAsync(sG) {
      for (; !this.regionsLoaded; ) await dz.waitTicks(1);
      let sH = new eL(this, sG);
      return dz.runJob(this.indexRegion(sH)), dz.run(() => this.save()), sH;
    }
    updateEntityRegions(sG) {
      if (this.regionsLoaded) {
        let sH = bO.floor(sG.location),
          sI = this.getChunkRegions(sH),
          sK = new Set(),
          sL = this.entityRegionCache.get(sG.id);
        if ((sL || ((sL = new Set()), this.entityRegionCache.set(sG.id, sL)), this.dimension === sG.dimension)) {
          for (let sM of sI)
            sM.isInside(this.dimension, sH) && (sK.add(sM), sL.has(sM) || this.addEntityToRegion(sM, sG));
        }
        for (let sN of sL) sK.has(sN) || this.removeEntityFromRegion(sN, sG);
        this.entityRegionCache.set(sG.id, sK);
      }
    }
    addEntityToRegion(sG, sH) {
      dz.run(() => {
        let sI = late.i3.getDBEEntity(sH);
        if (sI) {
          if (!sG.canEnter(sI)) {
            sG.teleportToFallbackLocation(sH),
              sI instanceof late.hN &&
                sI.sendQueueMessage({ message: sG.accessRequirements?.deniedAccessMessage ?? "", tickDelay: 0 });
            return;
          }
          sG.gravity && sI?.attributes.updateStats();
        }
        sH instanceof dx &&
          !sG.allowPvP &&
          sH.sendMessage({
            rawtext: [
              { translate: "message.safeRegion.join", with: { rawtext: [{ translate: "region." + sG.id + ".name" }] } },
            ],
          }),
          bM.dispatch("entity_enter_region", { entity: sH, region: sG });
      });
    }
    *indexRegion(sG) {
      let sH = this.hasRegion(sG.id);
      sH && this.remove(sG.id), this.regions.set(sG.id, sG);
      let sI = Math.floor(Math.min(sG.pos1.x, sG.pos2.x) / eK),
        sK = Math.floor(Math.max(sG.pos1.x, sG.pos2.x) / eK),
        sL = Math.floor(Math.min(sG.pos1.z, sG.pos2.z) / eK),
        sM = Math.floor(Math.max(sG.pos1.z, sG.pos2.z) / eK);
      for (let sN = sI; sN <= sK; sN++)
        for (let sO = sL; sO <= sM; sO++) {
          let sP = sN + "." + sO,
            sQ = this.spatialIndex.get(sP);
          sQ || ((sQ = []), this.spatialIndex.set(sP, sQ)), sQ.push(sG), yield;
        }
      if ((sH || bM.dispatch("region_load", { region: sG }), sG.owner?.type === "group")) {
        let sR = sG.owner.id;
        dz.run(() => {
          eJ.getGroupById(sR) ||
            (this.remove(sG.id),
            console.warn('A região "' + sG.id + '" foi removida porque o grupo "' + sR + '" não existe mais.'));
        });
      }
    }
    *load() {
      let sG = bG(dA, "regions").get(this.dimension.id);
      if (Array.isArray(sG))
        for (let sH of sG) {
          let sI = new eL(this, sH);
          yield* this.indexRegion(sI);
        }
      this.regionsLoaded = !0;
    }
    removeEntityFromRegion(sG, sH) {
      dz.run(() => {
        sG.gravity && late.i3.getDBEEntity(sH)?.attributes.updateStats(),
          sH instanceof dx &&
            !sG.allowPvP &&
            sH.sendMessage({
              rawtext: [
                {
                  translate: "message.safeRegion.exit",
                  with: { rawtext: [{ translate: "region." + sG.id + ".name" }] },
                },
              ],
            }),
          bM.dispatch("entity_exit_region", { entity: sH, region: sG });
      });
    }
    removeRegionFromIndex(sG) {
      let sH = Math.floor(Math.min(sG.pos1.x, sG.pos2.x) / eK),
        sI = Math.floor(Math.max(sG.pos1.x, sG.pos2.x) / eK),
        sK = Math.floor(Math.min(sG.pos1.z, sG.pos2.z) / eK),
        sL = Math.floor(Math.max(sG.pos1.z, sG.pos2.z) / eK);
      for (let sM = sH; sM <= sI; sM++)
        for (let sN = sK; sN <= sL; sN++) {
          let sO = sM + "." + sN,
            sP = this.spatialIndex.get(sO);
          if (!sP) continue;
          let sQ = sP.filter((sR) => sR !== sG);
          sQ.length ? this.spatialIndex.set(sO, sQ) : this.spatialIndex.delete(sO);
        }
    }
  },
  eN = class {
    findRegion(sG) {
      return this.getAllRegions().find((sH) => sH.id === sG);
    }
    getAllRegions() {
      let sG = [];
      for (let sH of eM.getDimensionRegionManagers()) sG.push(...sH.getRegions());
      return sG;
    }
    syncEntityRegionState(sG) {
      eO(sG.dimension).updateEntityRegions(sG);
    }
  };
function eO(sG) {
  let sH = eM.getInstance(sG);
  if (sH instanceof eM) return sH;
  throw new Error("Instância de RegionManager não encontrada para a dimensão fornecida.");
}
var eP = new eN();
every(1200, "core.region_cleanup", () => { // G3
  for (let sG of eM.getDimensionRegionManagers()) sG.cleanup();
}, { phase: 701 });
export { ep, eq, ev, ew, ex, eE, eF, eG, eH, eI, eJ, eK, eL, eM, eN, eO, eP };
