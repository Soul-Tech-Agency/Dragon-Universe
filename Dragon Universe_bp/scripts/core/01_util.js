// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 53–1229.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { ItemStack as C, system as G, world as Z, system as a0, EquipmentSlot as a1, GameMode as a2, ItemLockMode as a3, ItemStack as a4, Player as a5, Direction as a6, TimeOfDay as a7, world as a8, BlockPermutation as a9, World as aA, EquipmentSlot as ab, GameMode as af, system as aj, world as ak, MolangVariableMap as ap, world as aq, world as av, EquipmentSlot as aw, GameMode as ax, Entity as ay, system as az, system as r, EquipmentSlot as s, GameMode as t } from "@minecraft/server";
import { c3 as aX } from "../vendor/vanilla_data.js";
import { every } from "./scheduler.js";
function aB(sG, sH, sI) {
  return Math.min(Math.max(sG, sH), sI);
}
var aC = class sJ {
    static equals(sG, sH) {
      return sG.x === sH.x && sG.y === sH.y && sG.z === sH.z;
    }
    static add(sG, sH) {
      return { x: sG.x + (sH.x ?? 0), y: sG.y + (sH.y ?? 0), z: sG.z + (sH.z ?? 0) };
    }
    static subtract(sG, sH) {
      return { x: sG.x - (sH.x ?? 0), y: sG.y - (sH.y ?? 0), z: sG.z - (sH.z ?? 0) };
    }
    static scale(sG, sH) {
      return { x: sG.x * sH, y: sG.y * sH, z: sG.z * sH };
    }
    static dot(sG, sH) {
      return sG.x * sH.x + sG.y * sH.y + sG.z * sH.z;
    }
    static cross(sG, sH) {
      return { x: sG.y * sH.z - sG.z * sH.y, y: sG.z * sH.x - sG.x * sH.z, z: sG.x * sH.y - sG.y * sH.x };
    }
    static magnitude(sG) {
      return Math.sqrt(sG.x ** 2 + sG.y ** 2 + sG.z ** 2);
    }
    static distance(sG, sH) {
      return sJ.magnitude(sJ.subtract(sG, sH));
    }
    static normalize(sG) {
      let sH = sJ.magnitude(sG);
      return { x: sG.x / sH, y: sG.y / sH, z: sG.z / sH };
    }
    static floor(sG) {
      return { x: Math.floor(sG.x), y: Math.floor(sG.y), z: Math.floor(sG.z) };
    }
    static ceil(sG) {
      return { x: Math.ceil(sG.x), y: Math.ceil(sG.y), z: Math.ceil(sG.z) };
    }
    static min(sG, sH) {
      return { x: Math.min(sG.x, sH.x), y: Math.min(sG.y, sH.y), z: Math.min(sG.z, sH.z) };
    }
    static max(sG, sH) {
      return { x: Math.max(sG.x, sH.x), y: Math.max(sG.y, sH.y), z: Math.max(sG.z, sH.z) };
    }
    static toString(sG, sH) {
      let sI = sH?.decimals ?? 2;
      return [sG.x.toFixed(sI), sG.y.toFixed(sI), sG.z.toFixed(sI)].join(sH?.delimiter ?? ", ");
    }
    static fromString(sG, sH = ",") {
      let sI = sG.split(sH);
      if (sI.length !== 3) return;
      let sK = sI.map((sL) => parseFloat(sL));
      if (!sK.some((sL) => isNaN(sL))) return { x: sK[0], y: sK[1], z: sK[2] };
    }
    static clamp(sG, sH) {
      return {
        x: aB(sG.x, sH?.min?.x ?? Number.MIN_SAFE_INTEGER, sH?.max?.x ?? Number.MAX_SAFE_INTEGER),
        y: aB(sG.y, sH?.min?.y ?? Number.MIN_SAFE_INTEGER, sH?.max?.y ?? Number.MAX_SAFE_INTEGER),
        z: aB(sG.z, sH?.min?.z ?? Number.MIN_SAFE_INTEGER, sH?.max?.z ?? Number.MAX_SAFE_INTEGER),
      };
    }
    static lerp(sG, sH, sI) {
      return { x: sG.x + (sH.x - sG.x) * sI, y: sG.y + (sH.y - sG.y) * sI, z: sG.z + (sH.z - sG.z) * sI };
    }
    static slerp(sG, sH, sI) {
      let sK = Math.acos(sJ.dot(sG, sH)),
        sL = Math.sin(sK),
        sM = Math.sin((1 - sI) * sK) / sL,
        sN = Math.sin(sI * sK) / sL;
      return sJ.add(sJ.scale(sG, sM), sJ.scale(sH, sN));
    }
    static multiply(sG, sH) {
      return { x: sG.x * sH.x, y: sG.y * sH.y, z: sG.z * sH.z };
    }
    static rotateX(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x, y: sG.y * sI - sG.z * sK, z: sG.z * sI + sG.y * sK };
    }
    static rotateY(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x * sI + sG.z * sK, y: sG.y, z: sG.z * sI - sG.x * sK };
    }
    static rotateZ(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x * sI - sG.y * sK, y: sG.y * sI + sG.x * sK, z: sG.z };
    }
  },
  aD = class {
    x;
    y;
    z;
    constructor(sG, sH, sI) {
      if (typeof sG == "object") (this.x = sG.x), (this.y = sG.y), (this.z = sG.z);
      else {
        if (typeof sG == "string") {
          let sK = aC.fromString(sG, sH ?? ",");
          if (!sK) {
            (this.x = 0), (this.y = 0), (this.z = 0);
            return;
          }
          (this.x = sK.x), (this.y = sK.y), (this.z = sK.z);
        } else (this.x = sG), (this.y = sH ?? 0), (this.z = sI ?? 0);
      }
    }
    assign(sG) {
      return (this.x = sG.x), (this.y = sG.y), (this.z = sG.z), this;
    }
    equals(sG) {
      return aC.equals(this, sG);
    }
    add(sG) {
      return this.assign(aC.add(this, sG));
    }
    subtract(sG) {
      return this.assign(aC.subtract(this, sG));
    }
    scale(sG) {
      return this.assign(aC.scale(this, sG));
    }
    dot(sG) {
      return aC.dot(this, sG);
    }
    cross(sG) {
      return this.assign(aC.cross(this, sG));
    }
    magnitude() {
      return aC.magnitude(this);
    }
    distance(sG) {
      return aC.distance(this, sG);
    }
    normalize() {
      return this.assign(aC.normalize(this));
    }
    floor() {
      return this.assign(aC.floor(this));
    }
    ceil() {
      return this.assign(aC.ceil(this));
    }
    min(sG) {
      return this.assign(aC.min(this, sG));
    }
    max(sG) {
      return this.assign(aC.max(this, sG));
    }
    toString(sG) {
      return aC.toString(this, sG);
    }
    clamp(sG) {
      return this.assign(aC.clamp(this, sG));
    }
    lerp(sG, sH) {
      return this.assign(aC.lerp(this, sG, sH));
    }
    slerp(sG, sH) {
      return this.assign(aC.slerp(this, sG, sH));
    }
    multiply(sG) {
      return this.assign(aC.multiply(this, sG));
    }
    rotateX(sG) {
      return this.assign(aC.rotateX(this, sG));
    }
    rotateY(sG) {
      return this.assign(aC.rotateY(this, sG));
    }
    rotateZ(sG) {
      return this.assign(aC.rotateZ(this, sG));
    }
  },
  aE = {
    Black: { red: 29 / 255, green: 29 / 255, blue: 33 / 255, alpha: 1 },
    Blue: { red: 60 / 255, green: 68 / 255, blue: 170 / 255, alpha: 1 },
    Brown: { red: 131 / 255, green: 84 / 255, blue: 50 / 255, alpha: 1 },
    Cyan: { red: 22 / 255, green: 156 / 255, blue: 156 / 255, alpha: 1 },
    Gray: { red: 71 / 255, green: 79 / 255, blue: 82 / 255, alpha: 1 },
    Green: { red: 94 / 255, green: 124 / 255, blue: 22 / 255, alpha: 1 },
    LightBlue: { red: 58 / 255, green: 179 / 255, blue: 218 / 255, alpha: 1 },
    Lime: { red: 128 / 255, green: 199 / 255, blue: 31 / 255, alpha: 1 },
    Magenta: { red: 199 / 255, green: 78 / 255, blue: 189 / 255, alpha: 1 },
    Orange: { red: 249 / 255, green: 128 / 255, blue: 29 / 255, alpha: 1 },
    Pink: { red: 243 / 255, green: 139 / 255, blue: 170 / 255, alpha: 1 },
    Purple: { red: 137 / 255, green: 50 / 255, blue: 184 / 255, alpha: 1 },
    Red: { red: 176 / 255, green: 46 / 255, blue: 38 / 255, alpha: 1 },
    Silver: { red: 157 / 255, green: 157 / 255, blue: 151 / 255, alpha: 1 },
    White: { red: 240 / 255, green: 240 / 255, blue: 240 / 255, alpha: 1 },
    Yellow: { red: 254 / 255, green: 216 / 255, blue: 61 / 255, alpha: 1 },
    PureWhite: { red: 1, green: 1, blue: 1, alpha: 1 },
    PureBlack: { red: 0, green: 0, blue: 0, alpha: 1 },
    PureRed: { red: 1, green: 0, blue: 0, alpha: 1 },
    PureGreen: { red: 0, green: 1, blue: 0, alpha: 1 },
    PureBlue: { red: 0, green: 0, blue: 1, alpha: 1 },
    Transparent: { red: 0, green: 0, blue: 0, alpha: 0 },
  },
  aF = class {
    static getNearbyBlocks(sG, sH, sI, sK) {
      let sL = [];
      for (let sM = -sK; sM <= sK; sM++)
        for (let sN = -sK; sN <= sK; sN++)
          for (let sO = -sK; sO <= sK; sO++)
            try {
              let sP = sH.getBlock(new aD(sI.x + sM, sI.y + sN, sI.z + sO));
              sP && sP.typeId === sG && sL.push(sP);
            } catch (error) {
              if (!aF.isUnavailable(error)) throw error;
            }
      return sL;
    }
    static isUnavailable(error) {
      return /LocationInUnloadedChunk|LocationOutOfWorldBoundaries|unloaded chunk|outside.*(?:world|bound)/i.test(error?.name + ": " + error);
    }
  },
  aG = class {
    constructor(sG, sH) {
      (this.dimension = sG),
        (this.id = aH.getChunkId(sG, sH)),
        (this.chunkXZ = aH.getChunkXZ(sH)),
        (this.chunkOrigin = aH.getChunkOrigin(this.chunkXZ));
    }
    chunkOrigin;
    chunkXZ;
    id;
    get isLoaded() {
      return this.dimension.isChunkLoaded(this.chunkOrigin);
    }
  },
  aH = class {
    static MAX_CACHE_SIZE = 512;
    static chunkMap = new Map();
    static getChunkById(sG) {
      let [sH, sI, sK] = sG.split("|");
      return this.getChunkFromChunkXZ(Z.getDimension(sH), { x: Number(sI), z: Number(sK) });
    }
    static getChunk(sG, sH) {
      let sI = this.getChunkId(sG, sH),
        sK = this.chunkMap.get(sI);
      if ((sK || ((sK = new aG(sG, sH)), this.chunkMap.set(sI, sK)), this.chunkMap.size >= this.MAX_CACHE_SIZE)) {
        let sL = this.chunkMap.keys().next().value;
        sL !== void 0 && this.chunkMap.delete(sL);
      }
      return sK;
    }
    static getChunkFromChunkXZ(sG, sH) {
      return this.getChunk(sG, this.getChunkOrigin(sH));
    }
    static getChunkId(sG, sH) {
      let sI = this.getChunkXZ(sH);
      return sG.id + "|" + sI.x + "|" + sI.z;
    }
    static getChunkXZ(sG) {
      return { x: Math.floor(sG.x / 16), z: Math.floor(sG.z / 16) };
    }
    static getChunkOrigin(sG) {
      return { x: sG.x * 16, y: 0, z: sG.z * 16 };
    }
    static getNearbyChunks(sG, sH, sI = 5) {
      let sK = [],
        sL = this.getChunkXZ(sH);
      for (let sM = -sI; sM <= sI; sM++)
        for (let sN = -sI; sN <= sI; sN++) {
          let sO = this.getChunkFromChunkXZ(sG, { x: sL.x + sM, z: sL.z + sN });
          sK.push({ chunk: sO, distance: sM * sM + sN * sN });
        }
      return sK.sort((sP, sQ) => sP.distance - sQ.distance), sK.map((sP) => sP.chunk);
    }
    static waitForChunkLoad(sG, sH) {
      return new Promise((sI) => {
        let sK = G.runInterval(() => {
          sG.isChunkLoaded(sH) && (G.clearRun(sK), sI());
        }, 20);
      });
    }
  },
  aI = class {
    static colorToRgb(sG) {
      return typeof sG == "string" ? this.hexToRgb(sG) : Array.isArray(sG) ? this.tupleToRgb(sG) : sG;
    }
    static hexToRgb(sG) {
      var sH = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sG);
      return {
        red: sH ? parseInt(sH[1], 16) / 255 : 0,
        green: sH ? parseInt(sH[2], 16) / 255 : 0,
        blue: sH ? parseInt(sH[3], 16) / 255 : 0,
      };
    }
    static normalize(sG) {
      return { red: sG.red / 255, green: sG.green / 255, blue: sG.blue / 255 };
    }
    static rgbToTuple(sG) {
      return [sG.red, sG.green, sG.blue];
    }
    static tupleToRgb(sG) {
      return { red: sG[0], green: sG[1], blue: sG[2] };
    }
  },
  aJ = new Date(),
  aK = aJ.getDate(),
  aL = aJ.getMonth() + 1,
  aM = class {
    static get isAprilFools() {
      return aK === 1 && aL === 4;
    }
    static get isChristmas() {
      return aK === 25 && aL === 12;
    }
    static get isHalloween() {
      return aK === 31 && aL === 10;
    }
    static convertTimeToRawText(sG) {
      let sH = Math.floor(sG / 3600000);
      sG %= 3600000;
      let sI = Math.floor(sG / 60000);
      sG %= 60000;
      let sK = Math.floor(sG / 1000),
        sL = [];
      return (
        sH > 0 && sL.push({ translate: "date.hoursAbbreviated1Char", with: ["" + sH] }),
        sI > 0 && sL.push({ translate: "date.minutesAbbreviated1Char", with: ["" + sI] }),
        sK >= 0 && sL.push({ translate: "date.secondsAbbreviated1Char", with: ["" + sK] }),
        { rawtext: sL }
      );
    }
  },
  aN = class {
    static applyCameraShake(sG, sH, sI, sK = !1) {
      a0.run(() => {
        sG.isValid && sG.runCommand("camerashake add @s " + sH + " " + sI + " " + (sK ? "rotational" : ""));
      });
    }
    static getEquippedItem(sG, sH) {
      return sG.isValid ? sG.getComponent("minecraft:equippable")?.getEquipment(sH) : void 0;
    }
  },
  aO = class {
    static cubicInterpolate(sG, sH, sI, sK, sL) {
      let sM = sL * sL,
        sN = sM * sL;
      return (
        0.5 * (2 * sH + (-sG + sI) * sL + (2 * sG - 5 * sH + 4 * sI - sK) * sM + (-sG + 3 * sH - 3 * sI + sK) * sN)
      );
    }
    static isEven(sG) {
      return sG % 2 === 0;
    }
    static random(sG, sH) {
      return Math.random() * (sH - sG) + sG;
    }
    static randomInt(sG, sH) {
      return Math.floor(this.random(sG, sH));
    }
    static safeNumber(sG, sH = 1) {
      return typeof sG == "number" && !Number.isNaN(sG) ? sG : sH;
    }
    static shortenNumber(sG) {
      let sH = [
        { divider: 1000000000, suffix: "B" },
        { divider: 1000000, suffix: "M" },
        { divider: 1000, suffix: "K" },
      ];
      for (let sI of sH) if (!(sG < sI.divider)) return ((sG / sI.divider).toFixed(1) + sI.suffix).toString();
      return sG.toString();
    }
  },
  aP = ["minecraft:is_cooked", "minecraft:is_fish", "minecraft:is_food", "minecraft:is_meat"],
  aQ = class {
    static decrementStack(sG) {
      if (sG instanceof a5 && sG.getGameMode() === a2.Creative) return;
      let sH = sG.getComponent("minecraft:equippable");
      if (sH) {
        let sI = sH.getEquipmentSlot(a1.Mainhand);
        sI.hasItem() && (sI.amount > 1 ? sI.amount-- : sI.setItem(void 0));
      }
    }
    static forEachFilledSlot(sG, sH) {
      if (sG.emptySlotsCount === sG.size) return;
      let sI = sG.size;
      for (let sK = 0; sK < sI; sK++) {
        let sL = sG.getSlot(sK),
          sM = sG.getItem(sK);
        sM && sH(sL, sM);
      }
    }
    static getEnchantments(sG) {
      let sH = sG.getComponent("minecraft:enchantable");
      return sH ? sH.getEnchantments() : [];
    }
    static isFood(sG) {
      if (sG.hasComponent("minecraft:food")) return !0;
      for (let sH of sG.getTags()) if (aP.includes(sH)) return !0;
      return !1;
    }
    static setPlayerFixedItems(sG, sH) {
      let sI = sG.getComponent("minecraft:inventory");
      if (sI) {
        let { container: sK } = sI;
        if (sK)
          for (let sL = 0; sL < sH.length; sL++) {
            let sM = new a4(sH[sL]),
              sN = 8 - sL;
            sK.getItem(sN)?.typeId !== sM.typeId &&
              ((sM.keepOnDeath = !0), (sM.lockMode = a3.slot), sK.setItem(sN, sM));
          }
      }
    }
    static tryDamageHeldItem(sG, sH) {
      if (sG instanceof a5 && sG.getGameMode() === a2.Creative) return !1;
      let sI = sG.getComponent("minecraft:equippable"),
        sK = sI?.getEquipment(a1.Mainhand);
      if (sI && sK) {
        let sL = sK.getComponent("minecraft:durability");
        if (sL) {
          let sM = sK.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking"),
            sN = sL.getDamageChance(sM?.level);
          for (let sO = 0; sO < sH; sO++)
            sN >= aO.randomInt(0, 100) && (sL.damage = Math.min(sL.damage + 1, sL.maxDurability));
          return (
            sL.damage >= sL.maxDurability
              ? (sI.setEquipment(a1.Mainhand), sG.dimension.playSound("random.break", sG.location))
              : sI.setEquipment(a1.Mainhand, sK),
            !0
          );
        }
      }
      return !1;
    }
  },
  aR = class {
    static formatTypeId(sG) {
      return sG
        ?.replace(/^[^:]+:/, "")
        ?.split("_")
        .map((sH) => sH.charAt(0).toUpperCase() + sH.slice(1))
        ?.join(" ");
    }
  },
  aS = class {
    static cubicInterpolate(sG, sH, sI, sK, sL) {
      return {
        x: aO.cubicInterpolate(sG.x, sH.x, sI.x, sK.x, sL),
        y: aO.cubicInterpolate(sG.y, sH.y, sI.y, sK.y, sL),
        z: aO.cubicInterpolate(sG.z, sH.z, sI.z, sK.z, sL),
      };
    }
    static faceToVector(sG) {
      return (
        {
          [a6.Down]: new aD(0, -1, 0),
          [a6.Up]: new aD(0, 1, 0),
          [a6.South]: new aD(0, 0, 1),
          [a6.North]: new aD(0, 0, -1),
          [a6.East]: new aD(1, 0, 0),
          [a6.West]: new aD(-1, 0, 0),
        }[sG] ?? new aD(0, 0, 0)
      );
    }
  },
  b5 = class {
    static get dimensions() {
      return {
        nether: a8.getDimension(aX.Nether),
        overworld: a8.getDimension(aX.Overworld),
        theEnd: a8.getDimension(aX.TheEnd),
      };
    }
    static applyAreaDamage(sG, sH, sI, sK, sL) {
      let sM = [],
        sN = sG.getEntities({ location: sH, maxDistance: sI });
      for (let sO of sN)
        if (sL?.damagingEntity !== sO)
          try {
            sO.applyDamage(sK, sL) && sM.push(sO);
          } catch {}
      return sM;
    }
    static getTimeOfDay() {
      let sG = a8.getTimeOfDay();
      if (sG >= a7.Sunrise || sG < a7.Day) return "Sunrise";
      if (sG >= a7.Day && sG < a7.Noon) return "Day";
      if (sG >= a7.Noon && sG < a7.Sunset) return "Noon";
      if (sG >= a7.Sunset && sG < a7.Night) return "Sunset";
      if (sG >= a7.Night && sG < a7.Midnight) return "Night";
      if (sG >= a7.Midnight && sG < a7.Sunrise) return "Midnight";
    }
  };
function b6(sG) {
  let sH = sG.center();
  sG.dimension.playSound("item.bone_meal.use", sH), sG.dimension.spawnParticle("minecraft:crop_growth_emitter", sH);
}
function b7(sG, sH, sI) {
  let sK = aB(sH, 0, sI),
    sL = sG.permutation.withState("solariscore:growth", sK);
  sG.setPermutation(sL);
}
function b8(sG, sH, sI) {
  b7(sG, sH + 1, sI);
}
var b9 = class {
  constructor() {
    (this.onPlayerInteract = this.onPlayerInteract.bind(this)), (this.onRandomTick = this.onRandomTick.bind(this));
  }
  onPlayerInteract({ block: sG, dimension: sH, player: sI }, { params: sK }) {
    if (!sI) return;
    let sL = aN.getEquippedItem(sI, s.Mainhand);
    if (!sL) return;
    let { permutation: sM } = sG,
      { accumulable: sN, bone_meal_multiplication: sO, max_stage: sP } = sK,
      sQ = Number(sM.getState("solariscore:growth")),
      sR = sG.center(),
      { typeId: sS } = sL;
    if (sN && sS === sG.typeId && sQ < sP) {
      b8(sG, sQ, sP), aQ.decrementStack(sI), sH.playSound("place.pink_petals", sR);
      return;
    }
    if (!sO || sS !== "minecraft:bone_meal") return;
    let sT = sI.getGameMode() === t.Creative,
      sU = sQ >= sP;
    if (sU) {
      sH.spawnItem(new C(sG.typeId), sR), aQ.decrementStack(sI), b6(sG);
      return;
    }
    if (sT) {
      b7(sG, sP, sP), b6(sG);
      return;
    }
    sU || (b8(sG, sQ, sP), aQ.decrementStack(sI), b6(sG));
  }
  onRandomTick({ block: sG }, { params: sH }) {
    let { natural_growth: sI } = sH;
    if (sI) {
      let { permutation: sK } = sG,
        sL = Number(sK.getState("solariscore:growth")),
        { max_stage: sM } = sH;
      b7(sG, sL + 1, sM);
    }
  }
};
function bb(sG) {
  return !!sG.permutation.getAllStates()["solariscore:open_bit"];
}
function bf(sG) {
  let sH = sG.permutation.getAllStates()["minecraft:multi_block_part"] ? sG.below() : sG.above(),
    sI = bb(sG),
    sK = sI ? "close.wooden_door" : "open.wooden_door";
  sH &&
    (sH.setPermutation(sH.permutation.withState("solariscore:open_bit", !sI)),
    sG.setPermutation(sG.permutation.withState("solariscore:open_bit", !sI)),
    sG.dimension.playSound(sK, sG.location));
}
var bj = class {
    constructor() {
      (this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this)),
        (this.onPlayerInteract = this.onPlayerInteract.bind(this)),
        (this.onRedstoneUpdate = this.onRedstoneUpdate.bind(this));
    }
    beforeOnPlayerPlace(sG) {
      let { block: sH, permutationToPlace: sI } = sG,
        sK = sI.getAllStates(),
        sL = sK["minecraft:cardinal_direction"],
        sM = sH.east(),
        sN = sH.north(),
        sO = sH.south(),
        sP = sH.west(),
        sQ = (sT, sU) => ({
          left: [!sT?.isAir, !sT?.above()?.isAir].filter(Boolean).length,
          right: [!sU?.isAir, !sU?.above()?.isAir].filter(Boolean).length,
        }),
        sR,
        sS;
      switch (sL) {
        case "north":
          (sR = sM), (sS = sP);
          break;
        case "east":
          (sR = sO), (sS = sN);
          break;
        case "south":
          (sR = sP), (sS = sM);
          break;
        case "west":
          (sR = sN), (sS = sO);
          break;
      }
      if (sR && sS) {
        let { left: sT, right: sU } = sQ(sR, sS);
        (sT > sU || sS?.typeId === sI.type.id) && (sK["solariscore:door_hinge_bit"] = !0);
      }
      sG.permutationToPlace = a9.resolve(sI.type.id, sK);
    }
    onRedstoneUpdate({ block: sG, powerLevel: sH }) {
      let sI = bb(sG);
      ((sH && !sI) || (!sH && sI)) && bf(sG);
    }
    onPlayerInteract({ block: sG }) {
      bf(sG);
    }
  },
  bk = 1 / 3,
  bp = 1 / 100;
function bq(sG, sH) {
  let { hatch_only_at_night: sI, nest_block: sK } = sH;
  if (sK && sG.below()?.typeId !== sK) return !1;
  if (sI) {
    let sL = ak.getTimeOfDay();
    if (sL >= 21600 && sL <= 22550) return !0;
  }
  return Math.random() < 0.002;
}
function bv(sG, sH) {
  if (sH.sensitive) {
    let { permutation: sI } = sG,
      sK = sG.center(),
      sL = Number(sI.getState("solariscore:egg_count"));
    if (sL <= 0) {
      sG.dimension.runCommand("setblock " + sK.x + " " + sK.y + " " + sK.z + " air [] destroy");
      return;
    }
    let sM = sI.withState("solariscore:egg_count", sL - 1);
    sG.setPermutation(sM), sG.dimension.playSound(sH.break_sound ?? "dig.stone", sK);
  }
}
var bw = class {
    constructor() {
      (this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this)),
        (this.onEntityFallOn = this.onEntityFallOn.bind(this)),
        (this.onPlayerBreak = this.onPlayerBreak.bind(this)),
        (this.onPlayerInteract = this.onPlayerInteract.bind(this)),
        (this.onRandomTick = this.onRandomTick.bind(this)),
        (this.onStepOn = this.onStepOn.bind(this));
    }
    beforeOnPlayerPlace({ block: sG, player: sH }, { params: sI }) {
      if (sH) {
        let { nest_block: sK } = sI;
        if (sG.below()?.typeId === sK) {
          let sL = sG.center();
          aj.run(() => sG.dimension.spawnParticle("minecraft:crop_growth_emitter", sL));
        }
      }
    }
    onEntityFallOn({ block: sG, entity: sH }, { params: sI }) {
      if (sH) {
        let sK = sI;
        !sK.ignored_entities?.includes(sH?.typeId) && Math.random() < bk && bv(sG, sK);
      }
    }
    onPlayerBreak({ block: sG, brokenBlockPermutation: sH, player: sI }) {
      if (sI && sI.getGameMode() === af.Survival) {
        let sK = sG.center(),
          sL = Number(sH.getState("solariscore:egg_count")),
          sM = aN.getEquippedItem(sI, ab.Mainhand),
          sN = [];
        for (let sO = 0; sO < sL; sO++) {
          let sP = ak.getLootTableManager().generateLootFromBlockPermutation(sH, sM);
          sP && sN.push(...sP);
        }
        for (let sQ of sN) sG.dimension.spawnItem(sQ, sK);
      }
    }
    onPlayerInteract({ block: sG, dimension: sH, player: sI }, { params: sK }) {
      if (sI && aN.getEquippedItem(sI, ab.Mainhand)?.typeId === sG.typeId) {
        let { add_egg_sound: sL, max_eggs_per_block: sM } = sK,
          { permutation: sN } = sG,
          sO = Number(sN.getState("solariscore:egg_count"));
        if (++sO >= (sM ?? 1)) return;
        let sP = sN.withState("solariscore:egg_count", sO),
          sQ = sG.center();
        sG.setPermutation(sP), sH.playSound(sL ?? "dig.stone", sQ), aQ.decrementStack(sI);
      }
    }
    onRandomTick({ block: sG, dimension: sH }, { params: sI }) {
      let sK = sI,
        { crack_sound: sL, drop_sound: sM, entity_id: sN } = sK;
      if (bq(sG, sK)) {
        let { permutation: sO } = sG,
          sP = sG.center(),
          sQ = String(sO.getState("solariscore:cracked_state"));
        if (sQ === "max_cracked") {
          let sS = Number(sO.getState("solariscore:egg_count"));
          sH.playSound(sM ?? "", sP), sH.runCommand("setblock " + sP.x + " " + sP.y + " " + sP.z + " air [] destroy");
          for (let sT = 0; sT <= sS; sT++) sH.spawnEntity(sN, sP);
          return;
        }
        let sR = sO.withState("solariscore:cracked_state", sQ === "no_cracks" ? "cracked" : "max_cracked");
        sG.setPermutation(sR), sH.playSound(sL ?? "", sP);
      }
    }
    onStepOn({ block: sG, entity: sH }, { params: sI }) {
      if (sH) {
        let sK = sI;
        !sK.ignored_entities?.includes(sH?.typeId) && Math.random() < bp && bv(sG, sK);
      }
    }
  },
  bx = [new aD(1, 0, 0), new aD(-1, 0, 0), new aD(0, 0, 1), new aD(0, 0, -1)];
function by(sG, sH) {
  if (Math.random() > 0.25) return;
  let sI = bx[Math.floor(Math.random() * bx.length)],
    sK = sG.offset(sI);
  sK?.typeId === sH.growable_block && sK.above()?.isAir && sK.setType(sG.typeId);
}
var bz = class {
    constructor() {
      this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick({ block: sG }, { params: sH }) {
      if (sG.dimension.isChunkLoaded(sG.location)) {
        if (sG.above()?.getLightLevel() === 0) {
          let { dead_block: sI } = sH;
          sG.setType(sI);
        } else by(sG, sH);
      }
    }
  },
  bA = class {
    constructor() {
      this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick({ block: sG, dimension: sH }, { params: sI }) {
      if (Math.random() * aq.gameRules.randomTickSpeed <= 0.2 && sG.below().isAir) {
        let { color: sK } = sI,
          sL = new ap();
        sK && sL.setColorRGB("color", aI.colorToRgb(sK)),
          sH.spawnParticle("minecraft:biome_tinted_leaves_particle", sG.center(), sL);
      }
    }
  },
  bB = class {
    constructor() {
      this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick({ block: sG, dimension: sH }, { params: sI }) {
      let { particle: sK, spawn_rate: sL } = sI;
      // Chunk descarregado é tratado por bJ.guardTicks; outros erros não são mais engolidos.
      if (Math.random() * av.gameRules.randomTickSpeed <= sL) sG.above()?.isAir && sH.spawnParticle(sK, sG.center());
    }
  };
function bC(sG, sH) {
  let { feature: sI } = sH;
  sG.dimension.placeFeature(sI, sG.location) && sG.setType("minecraft:air");
}
var bD = class {
    constructor() {
      (this.onPlayerInteract = this.onPlayerInteract.bind(this)), (this.onRandomTick = this.onRandomTick.bind(this));
    }
    onPlayerInteract({ block: sG, player: sH }, { params: sI }) {
      if (sH) {
        let sK = aN.getEquippedItem(sH, aw.Mainhand);
        if (!sK || sK.typeId !== "minecraft:bone_meal") return;
        let { permutation: sL } = sG,
          sM = Number(sL.getState("solariscore:age_bit"));
        if ((b6(sG), aQ.decrementStack(sH), sH.getGameMode() === ax.Creative)) {
          bC(sG, sI);
          return;
        }
        if (Math.random() < 0.45) {
          let sN = Math.min(1, sM + 1),
            sO = sL.withState("solariscore:age_bit", sN);
          sG.setPermutation(sO), sN === 1 && bC(sG, sI);
        }
      }
    }
    onRandomTick({ block: sG }, { params: sH }) {
      let { permutation: sI } = sG,
        sK = Number(sI.getState("solariscore:age_bit"));
      if (sK === 1) bC(sG, sH);
      else {
        let sL = sI.withState("solariscore:age_bit", sK + 1);
        sG.setPermutation(sL);
      }
    }
  },
  bE = class {
    constructor() {
      (this.onHitEntity = this.onHitEntity.bind(this)), (this.onMineBlock = this.onMineBlock.bind(this));
    }
    onHitEntity({ hitEntity: sG }) {
      aQ.tryDamageHeldItem(sG, 1);
    }
    onMineBlock({ source: sG }) {
      aQ.tryDamageHeldItem(sG, 1);
    }
  },
  bF = class sV {
    constructor(sG, sH) {
      (this.provider = sG), (this.dataId = sH);
      let sI = this.provider.getDynamicProperty(sH);
      this.data = typeof sI == "string" ? this.parseData(sI) : {};
    }
    static instances = new Map();
    data;
    dirty = !1;
    isSaving = !1;
    corruptRaw; // texto original inválido ainda não copiado para <id>__corrupt
    saveFailures = 0;
    static cleanup() {
      for (let sG of [...this.instances.values()])
        for (let sH of [...sG.values()]) sH.isProviderValid() || this.deleteInstance(sH);
    }
    static deleteInstance(sG) {
      let sH = sG.provider instanceof aA ? "world" : sG.provider.id,
        sI = this.instances.get(sH);
      sI && (sI.delete(sG.id), sI.size === 0 && this.instances.delete(sH), (sG.data = {}));
    }
    static getInstance(sG, sH) {
      if (sG instanceof ay && !sG.isValid) return;
      let sI = sG instanceof aA ? "world" : sG.id,
        sK = this.instances.get(sI);
      sK || ((sK = new Map()), this.instances.set(sI, sK));
      let sL = sK.get(sH);
      if (sL) sL.provider = sG;
      return sL || ((sL = new sV(sG, sH)), sK.set(sH, sL)), sL;
    }
    static saveAllInstances() {
      for (let sG of [...this.instances.values()])
        for (let sH of [...sG.values()])
          try {
            sH.save();
          } catch (sI) {
            console.error("[Dragon Universe] Falha ao salvar '" + sH.dataId + "' no encerramento: " + sI);
          }
    }
    get id() {
      return this.dataId;
    }
    clear() {
      (this.data = {}), (this.dirty = !0), this.save();
    }
    delete(sG) {
      this.has(sG) && (delete this.data[sG], (this.dirty = !0), this.scheduleSave());
    }
    forEach(sG) {
      for (let sH in this.data) sG(sH, this.data[sH]);
    }
    get(sG) {
      return this.data[sG];
    }
    getData() {
      return { ...this.data };
    }
    has(sG) {
      return sG in this.data;
    }
    isProviderValid() {
      return this.provider instanceof aA || this.provider.isValid;
    }
    keys() {
      return Object.keys(this.data);
    }
    set(sG, sH) {
      (this.data[sG] = sH), (this.dirty = !0), this.scheduleSave();
    }
    save() {
      if (!this.dirty || !this.isProviderValid()) return;
      // nunca sobrescreve um original inválido antes de copiá-lo para <id>__corrupt
      if (this.corruptRaw !== void 0 && !this.preserveCorrupt()) return;
      let sG;
      try {
        (sG = JSON.stringify(this.data)), this.provider.setDynamicProperty(this.dataId, sG), (this.dirty = !1);
        this.saveFailures && console.warn("[Dragon Universe] '" + this.dataId + "' voltou a ser salvo.");
        this.saveFailures = 0;
      } catch (sH) {
        // dirty continua true: o próximo set() ou o encerramento tentam de novo
        this.reportSaveFailure("Falha ao salvar (" + (sG?.length ?? "?") + " caracteres)", sH);
      }
    }
    reportSaveFailure(sG, sH) {
      ++this.saveFailures,
        (this.saveFailures === 1 || this.saveFailures % 20 === 0) &&
          console.error(
            "[Dragon Universe] " + sG + " '" + this.dataId + "' (" + this.providerLabel() + ", tentativa " +
              this.saveFailures + "): " + sH,
          );
    }
    preserveCorrupt() {
      let sG = this.dataId + "__corrupt";
      try {
        this.provider.getDynamicProperty(sG) !== void 0 && (sG += "_" + Date.now());
        this.provider.setDynamicProperty(sG, this.corruptRaw);
      } catch (sH) {
        return this.reportSaveFailure("Original inválido não pôde ser preservado; nada foi gravado em", sH), !1;
      }
      return (
        console.warn("[Dragon Universe] Original inválido de '" + this.dataId + "' preservado em '" + sG + "'."),
        (this.corruptRaw = void 0),
        !0
      );
    }
    providerLabel() {
      try {
        return this.provider instanceof aA ? "world" : this.provider.typeId + " " + this.provider.id;
      } catch {
        return "?";
      }
    }
    toString() {
      return JSON.stringify(this.data);
    }
    parseData(sG) {
      let sH;
      try {
        sH = JSON.parse(sG);
      } catch (sI) {
        sH = sI;
      }
      if (sH && typeof sH == "object" && !Array.isArray(sH) && !(sH instanceof Error)) return sH;
      // começa vazio, mas guarda o texto original: save() só grava depois de copiá-lo para <id>__corrupt
      this.corruptRaw = sG;
      console.error(
        "[Dragon Universe] Dados inválidos em '" + this.dataId + "' (" + this.providerLabel() + ", " + sG.length +
          " caracteres): " + (sH instanceof Error ? sH.message : "não é um objeto") + ". O original será preservado.",
      );
      return {};
    }
    scheduleSave() {
      this.isSaving ||
        ((this.isSaving = !0),
        az.runTimeout(() => {
          try {
            this.save();
          } finally {
            this.isSaving = !1;
          }
        }, 20));
    }
  };
function bG(sG, sH) {
  let sI = bF.getInstance(sG, sH);
  if (sI instanceof bF) return sI;
  throw new Error("Instância de DynamicDatabase não encontrada para o provedor fornecido.");
}
az.beforeEvents.shutdown.subscribe(() => bF.saveAllInstances()), every(1200, "core.data_cleanup", () => bF.cleanup(), { phase: 101 }); // G1
var bH = {
    "solariscore:crop": b9,
    "solariscore:door": bj,
    "solariscore:egg": bw,
    "solariscore:grass": bz,
    "solariscore:leaves": bA,
    "solariscore:particle_emitter": bB,
    "solariscore:sapling": bD,
  },
  bI = { "solariscore:durability_sensor": bE },
  bJ = class {
    // onRandomTick/onTick leem vizinhos (below/above/offset). Durante viagem de dimensão ou
    // teleporte o chunk do bloco ou do vizinho pode deixar de estar carregado; só esse caso
    // (aF.isUnavailable) é ignorado. Qualquer outro erro continua sendo lançado.
    static guardTicks(component) {
      for (let name of ["onRandomTick", "onTick"]) {
        let fn = component[name];
        if (typeof fn != "function") continue;
        component[name] = (...args) => {
          try {
            return fn.apply(component, args);
          } catch (error) {
            if (!aF.isUnavailable(error)) throw error;
          }
        };
      }
      return component;
    }
    setEnabledBlockComponents(sG) {
      r.beforeEvents.startup.subscribe(({ blockComponentRegistry: sH }) => {
        for (let sI of sG) {
          let sK = bH[sI];
          sK && sH.registerCustomComponent(sI, bJ.guardTicks(new sK()));
        }
      });
    }
    setEnabledItemComponents(sG) {
      r.beforeEvents.startup.subscribe(({ itemComponentRegistry: sH }) => {
        for (let sI of sG) {
          let sK = bI[sI];
          sK && sH.registerCustomComponent(sI, new sK());
        }
      });
    }
  },
  bK = new bJ(),
  bL = class {
    eventsMap = new Map();
    pending = new Set();
    dispatch(sG, sH) {
      if (!this.pending.has(sG)) {
        this.pending.add(sG);
        let sI = this.eventsMap.get(sG);
        if (sI) {
          for (let sK of sI) sK(sH);
        }
        this.pending.delete(sG);
      }
    }
    on(sG, sH) {
      let sI = this.eventsMap.get(sG);
      sI || ((sI = new Set()), this.eventsMap.set(sG, sI)), sI.add(sH);
    }
    off(sG, sH) {
      let sI = this.eventsMap.get(sG);
      sI && (sI.delete(sH), sI.size || this.eventsMap.delete(sG));
    }
  },
  bM = new bL();
function bN(sG, sH, sI) {
  return Math.min(Math.max(sG, sH), sI);
}
var bO = class sW {
    static equals(sG, sH) {
      return sG.x === sH.x && sG.y === sH.y && sG.z === sH.z;
    }
    static add(sG, sH) {
      return { x: sG.x + (sH.x ?? 0), y: sG.y + (sH.y ?? 0), z: sG.z + (sH.z ?? 0) };
    }
    static subtract(sG, sH) {
      return { x: sG.x - (sH.x ?? 0), y: sG.y - (sH.y ?? 0), z: sG.z - (sH.z ?? 0) };
    }
    static scale(sG, sH) {
      return { x: sG.x * sH, y: sG.y * sH, z: sG.z * sH };
    }
    static dot(sG, sH) {
      return sG.x * sH.x + sG.y * sH.y + sG.z * sH.z;
    }
    static cross(sG, sH) {
      return { x: sG.y * sH.z - sG.z * sH.y, y: sG.z * sH.x - sG.x * sH.z, z: sG.x * sH.y - sG.y * sH.x };
    }
    static magnitude(sG) {
      return Math.sqrt(sG.x ** 2 + sG.y ** 2 + sG.z ** 2);
    }
    static distance(sG, sH) {
      return sW.magnitude(sW.subtract(sG, sH));
    }
    static normalize(sG) {
      let sH = sW.magnitude(sG);
      return { x: sG.x / sH, y: sG.y / sH, z: sG.z / sH };
    }
    static floor(sG) {
      return { x: Math.floor(sG.x), y: Math.floor(sG.y), z: Math.floor(sG.z) };
    }
    static ceil(sG) {
      return { x: Math.ceil(sG.x), y: Math.ceil(sG.y), z: Math.ceil(sG.z) };
    }
    static min(sG, sH) {
      return { x: Math.min(sG.x, sH.x), y: Math.min(sG.y, sH.y), z: Math.min(sG.z, sH.z) };
    }
    static max(sG, sH) {
      return { x: Math.max(sG.x, sH.x), y: Math.max(sG.y, sH.y), z: Math.max(sG.z, sH.z) };
    }
    static toString(sG, sH) {
      let sI = sH?.decimals ?? 2;
      return [sG.x.toFixed(sI), sG.y.toFixed(sI), sG.z.toFixed(sI)].join(sH?.delimiter ?? ", ");
    }
    static fromString(sG, sH = ",") {
      let sI = sG.split(sH);
      if (sI.length !== 3) return;
      let sK = sI.map((sL) => parseFloat(sL));
      if (!sK.some((sL) => isNaN(sL))) return { x: sK[0], y: sK[1], z: sK[2] };
    }
    static clamp(sG, sH) {
      return {
        x: bN(sG.x, sH?.min?.x ?? Number.MIN_SAFE_INTEGER, sH?.max?.x ?? Number.MAX_SAFE_INTEGER),
        y: bN(sG.y, sH?.min?.y ?? Number.MIN_SAFE_INTEGER, sH?.max?.y ?? Number.MAX_SAFE_INTEGER),
        z: bN(sG.z, sH?.min?.z ?? Number.MIN_SAFE_INTEGER, sH?.max?.z ?? Number.MAX_SAFE_INTEGER),
      };
    }
    static lerp(sG, sH, sI) {
      return { x: sG.x + (sH.x - sG.x) * sI, y: sG.y + (sH.y - sG.y) * sI, z: sG.z + (sH.z - sG.z) * sI };
    }
    static slerp(sG, sH, sI) {
      let sK = Math.acos(sW.dot(sG, sH)),
        sL = Math.sin(sK),
        sM = Math.sin((1 - sI) * sK) / sL,
        sN = Math.sin(sI * sK) / sL;
      return sW.add(sW.scale(sG, sM), sW.scale(sH, sN));
    }
    static multiply(sG, sH) {
      return { x: sG.x * sH.x, y: sG.y * sH.y, z: sG.z * sH.z };
    }
    static rotateX(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x, y: sG.y * sI - sG.z * sK, z: sG.z * sI + sG.y * sK };
    }
    static rotateY(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x * sI + sG.z * sK, y: sG.y, z: sG.z * sI - sG.x * sK };
    }
    static rotateZ(sG, sH) {
      let sI = Math.cos(sH),
        sK = Math.sin(sH);
      return { x: sG.x * sI - sG.y * sK, y: sG.y * sI + sG.x * sK, z: sG.z };
    }
  },
  bP = class {
    x;
    y;
    z;
    constructor(sG, sH, sI) {
      if (typeof sG == "object") (this.x = sG.x), (this.y = sG.y), (this.z = sG.z);
      else {
        if (typeof sG == "string") {
          let sK = bO.fromString(sG, sH ?? ",");
          if (!sK) {
            (this.x = 0), (this.y = 0), (this.z = 0);
            return;
          }
          (this.x = sK.x), (this.y = sK.y), (this.z = sK.z);
        } else (this.x = sG), (this.y = sH ?? 0), (this.z = sI ?? 0);
      }
    }
    assign(sG) {
      return (this.x = sG.x), (this.y = sG.y), (this.z = sG.z), this;
    }
    equals(sG) {
      return bO.equals(this, sG);
    }
    add(sG) {
      return this.assign(bO.add(this, sG));
    }
    subtract(sG) {
      return this.assign(bO.subtract(this, sG));
    }
    scale(sG) {
      return this.assign(bO.scale(this, sG));
    }
    dot(sG) {
      return bO.dot(this, sG);
    }
    cross(sG) {
      return this.assign(bO.cross(this, sG));
    }
    magnitude() {
      return bO.magnitude(this);
    }
    distance(sG) {
      return bO.distance(this, sG);
    }
    normalize() {
      return this.assign(bO.normalize(this));
    }
    floor() {
      return this.assign(bO.floor(this));
    }
    ceil() {
      return this.assign(bO.ceil(this));
    }
    min(sG) {
      return this.assign(bO.min(this, sG));
    }
    max(sG) {
      return this.assign(bO.max(this, sG));
    }
    toString(sG) {
      return bO.toString(this, sG);
    }
    clamp(sG) {
      return this.assign(bO.clamp(this, sG));
    }
    lerp(sG, sH) {
      return this.assign(bO.lerp(this, sG, sH));
    }
    slerp(sG, sH) {
      return this.assign(bO.slerp(this, sG, sH));
    }
    multiply(sG) {
      return this.assign(bO.multiply(this, sG));
    }
    rotateX(sG) {
      return this.assign(bO.rotateX(this, sG));
    }
    rotateY(sG) {
      return this.assign(bO.rotateY(this, sG));
    }
    rotateZ(sG) {
      return this.assign(bO.rotateZ(this, sG));
    }
  };
export { aB, aC, aD, aE, aF, aG, aH, aI, aJ, aK, aL, aM, aN, aO, aP, aQ, aR, aS, b5, b6, b7, b8, b9, bb, bf, bj, bk, bp, bq, bv, bw, bx, by, bz, bA, bB, bC, bD, bE, bF, bG, bH, bI, bJ, bK, bL, bM, bN, bO, bP };
