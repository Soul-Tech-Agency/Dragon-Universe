// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 132–458.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { hO } from "./14_player.js";
import { wish_data as j6 } from "../data/wish_data.js";
import { dC } from "./06_requirements.js";
import { fR } from "./11_entity_wrapper.js";
import { iH } from "./17_items_balls_fusion.js";
import { EasingType as j7, system as j8, TimeOfDay as j9, world as jb } from "@minecraft/server";
import { d4 } from "./05_db_cooldowns.js";
import { aN, aQ, bO, bP } from "./01_util.js";
import { i3 } from "./15_entities.js";
import { ActionFormData as jf } from "@minecraft/server-ui";
var jj = class {
    constructor(sG) {
      this.wishData = sG;
    }
    get amount() {
      return this.wishData.amount || 1;
    }
    get availableIn() {
      return this.wishData.availableIn;
    }
    get name() {
      return this.wishData.name;
    }
    get requirements() {
      return this.wishData.requirements ?? [];
    }
    get singleUse() {
      return this.wishData.single_use ?? !1;
    }
    get type() {
      return this.wishData.type;
    }
    getTranslationKey() {
      return { translate: "wish." + this.name };
    }
    grantWish(sG, sH) {}
  },
  jk = class {
    static wishesMap = new Map();
    static get(sG) {
      return this.wishesMap.get(sG);
    }
    static register(sG, sH) {
      this.wishesMap.set(sG, sH);
    }
  },
  jp = class extends jj {
    getTranslationKey() {
      return { translate: "wish.change_race", with: { rawtext: [{ translate: this.name }] } };
    }
    grantWish(sG) {
      hO(sG).setRace(this.name);
    }
  };
import { ItemStack as jq, ItemTypes as jv } from "@minecraft/server";
var jw = class extends jj {
    getTranslationKey() {
      return { translate: jv.get(this.name)?.localizationKey };
    }
    grantWish(sG, sH) {
      let sI = new jq(this.name),
        { maxAmount: sK } = sI;
      for (let sL = this.amount; sL > 0; sL -= sK)
        (sI.amount = Math.min(sK, sL)),
          sI.setLore([{ rawtext: [{ text: "§r§7" }, { translate: sH.localizationKey }] }]),
          sG.dimension.spawnItem(sI, sG.location);
    }
  },
  jx = class extends jj {
    getTranslationKey() {
      return { translate: "skill." + this.name };
    }
    grantWish(sG) {
      try {
        hO(sG).skills.tryLearnSkill(this.name);
      } catch {}
    }
  },
  jy = class extends jj {
    grantWish(sG) {
      sG.addTag("dbe_" + this.name);
    }
  },
  jz = class extends jj {
    grantWish(sG) {
      hO(sG).addTail();
    }
  },
  jA = new Map(),
  jA2 = new Map(), // sessão de desejos ativa: id do dragão -> id do jogador
  jA3 = new Map(), // cinemática do dragão em curso: id do jogador -> token
  jB = class {
    wishes = [];
    constructor() {
      jk.register("change_race", jp),
        jk.register("item", jw),
        jk.register("skill", jx),
        jk.register("tag", jy),
        jk.register("tail", jz);
      for (let sG of j6) {
        let sH = jk.get(sG.type);
        sH && this.wishes.push(new sH(sG));
      }
    }
    getWishes() {
      return this.wishes;
    }
    getEligibleWishes(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [],
        sK = [];
      for (let sL of this.getWishes())
        (sL.singleUse && sI.includes(sL.name)) ||
          (sL.availableIn.includes(sH) &&
            dC.testAll(sG, sL.requirements) &&
            ((sL instanceof jx && !sG.skills.canLearnSkill(sL.name)) ||
              (sL instanceof jp && !fR.isRaceAvailableForPlayer(sG, sL.name)) ||
              sK.push(sL)));
      return sK;
    }
    async handleWishSession(sG, sH) {
      let sI = iH.getDragonBallBySourceTypeId(sH.typeId);
      if (!sI) return;
      // um jogador por dragão; a trava de quem saiu do mundo não vale mais
      let sK = jA2.get(sH.id);
      if (sK && sK !== sG.id && jb.getAllPlayers().some((sM) => sM.id === sK)) {
        sG.sendMessage({ translate: "message.shenron.busy" });
        return;
      }
      jA2.set(sH.id, sG.id);
      try {
        // abrir o desejo encerra a cinemática deste jogador e devolve a câmera na hora;
        // uma falha aqui não pode deixar a trava jA2 presa nem impedir o menu
        if (jA3.has(sG.id)) {
          jA3.delete(sG.id);
          try {
            sG.camera.clear();
          } catch (sM) {
            console.warn("[Dragon Universe] Falha ao devolver a câmera: " + String(sM));
          }
        }
        for (; sG.isValid && sH.isValid && this.getWishesMade(sH) < sI.maxWishes; ) {
          // fechar o menu encerra só a sessão: o dragão fica com os desejos restantes
          if ((await this.showWishSelectionMenu(sG, sH)) !== "granted") return;
          sG.camera.fade({
            fadeColor: { red: 1, green: 1, blue: 1 },
            fadeTime: { fadeInTime: 1, fadeOutTime: 1, holdTime: 0.1 },
          });
        }
        sG.isValid && sH.isValid && this.getWishesMade(sH) >= sI.maxWishes && this.finalizeWishes(sG, sH);
      } finally {
        jA2.get(sH.id) === sG.id && jA2.delete(sH.id);
      }
    }
    spawnShenronFromDragonBall(sG, sH, sI, sK) {
      let sL = d4(sH.sourceId, sI, sK);
      if (!sL) return;
      let sM = 32,
        { doDayLightCycle: sN } = jb.gameRules;
      if (sN) {
        jA.set(sL.id, jb.getTimeOfDay());
        let sO = j8.runInterval(() => {
          let sP = jb.getTimeOfDay();
          if (sP < j9.Midnight) {
            if ((jb.setTimeOfDay(Math.min(240000, sP + 100)), j8.currentTick % 40 === 0)) {
              let sQ = new bP((Math.random() - 0.5) * sM + sK.x, sK.y, (Math.random() - 0.5) * sM + sK.z);
              try {
                d4("minecraft:lightning_bolt", sI, sQ);
              } catch {}
            }
          } else j8.clearRun(sO);
        });
      }
      for (let sP of jb.getAllPlayers())
        hO(sP).sendQueueMessage({
          soundId: "mob.shenron.appear",
          tickDelay: 5,
          message: {
            translate: "message.shenron.summoned",
            with: { rawtext: [{ text: "" + sH.requiredBalls }, { text: sG.name }, { translate: sL.localizationKey }] },
          },
        });
      for (let sQ of sI.getPlayers({ location: sK, maxDistance: 128 })) this.playAnimation(sQ, sL, sH);
    }
    finalizeWishes(sG, sH) {
      if (!sH.isValid) return;
      let { dimension: sI, location: sK } = sH;
      sG.sendMessage({ translate: "message.shenron.wishGranted" }),
        sI.playSound("mob.shenron.flying", sK),
        this.restoreNormalTimeOfDay(sH),
        sH.remove();
    }
    getWishesMade(sG) {
      return i3.getDBEEntity(sG)?.data.get("wishes_made") ?? 0;
    }
    markWishAsGranted(sG, sH) {
      let sI = sG.data.get("granted_wishes") ?? [];
      sI.push(sH.name), sG.data.set("granted_wishes", sI);
    }
    async playAnimation(sG, sH, sI) {
      let sK = sH.getComponent("minecraft:scale")?.value ?? 1,
        sT = {},
        sV = sG.id,
        // false se a cinemática foi encerrada (desejo aberto ou nova invocação) ou se o jogador saiu
        sU = () => jA3.get(sV) === sT && (sG.isValid || (jA3.delete(sV), !1));
      jA3.set(sV, sT);
      sG.camera.setCamera("minecraft:free", {
        facingLocation: bO.add(sH.location, { y: 32 * sK }),
        location: bO.add(sH.location, { x: 32 * sK, y: 32 * sK, z: 32 * sK }),
        easeOptions: { easeTime: 0.5, easeType: j7.InCirc },
      }),
        sI.spawnSound && (sG.playMusic(sI.spawnSound, { fade: 1 }), aN.applyCameraShake(sG, 0.5, 5)),
        await j8.waitTicks(40),
        sI.sourceAnimation && sH.playAnimation(sI.sourceAnimation),
        await j8.waitTicks(200);
      if (!sU()) return;
      sG.camera.fade({
        fadeColor: { red: 1, green: 1, blue: 1 },
        fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
      });
      await j8.waitTicks(15);
      sU() && (jA3.delete(sV), sG.camera.clear());
    }
    restoreNormalTimeOfDay(sG) {
      let sH = jA.get(sG.id);
      sH && (jb.setTimeOfDay(sH), jA.delete(sG.id));
    }
    // sempre resolve: "granted" | "closed" | "empty" | "invalid" | "error"
    async showWishSelectionMenu(sG, sH) {
      let sK = hO(sG);
      for (let sT = 0; sT < 10; sT++) {
        if (!sG.isValid || !sH.isValid || !sK) return "invalid";
        let sL = this.getEligibleWishes(sK, sH.typeId);
        if (!sL.length) return sG.sendMessage({ translate: "message.shenron.noWishes" }), "empty";
        let sM = new jf();
        sM.title("ui.dbe.wishes.title"), sM.body("");
        for (let sN of sL) sM.button(sN.getTranslationKey());
        let sO;
        try {
          sO = await sM.show(sG);
        } catch (sU) {
          return console.warn("[Dragon Universe] Falha no menu de desejos: " + (sU?.stack ?? sU)), "error";
        }
        if (sO.canceled) {
          // jogador com outra interface aberta: tenta de novo em 1 s
          if (sO.cancelationReason === "UserBusy") {
            await j8.waitTicks(20);
            continue;
          }
          return "closed";
        }
        let sP = sO.selection,
          sS = typeof sP == "number" ? sL[sP] : void 0;
        if (!sS || !sG.isValid || !sH.isValid) return "invalid";
        // revalida no envio: limite e elegibilidade podem ter mudado com o menu aberto
        let sQ = i3.getDBEEntity(sH),
          sR = sQ?.data.get("wishes_made") ?? 0,
          sV = iH.getDragonBallBySourceTypeId(sH.typeId);
        if (!sV || sR >= sV.maxWishes) return "invalid";
        if (!this.getEligibleWishes(sK, sH.typeId).includes(sS)) continue;
        sS.grantWish(sG, sH), sQ?.data.set("wishes_made", sR + 1), this.markWishAsGranted(sK, sS);
        return "granted";
      }
      return "closed";
    }
  },
  jC = new jB(),
  jD = class {
    // chamado a cada 20 ticks por jogador sem radar na mão (onTickEvent): só grava quando o valor não é 0, para não mandar
    // um setProperty com client_sync por segundo à toa (achado do Arquiteto no teste da 1.7.19)
    reset(sG) {
      sG.getProperty("dbe:dragon_radar_location") !== 0 && sG.setProperty("dbe:dragon_radar_location", 0);
    }
    scanDragonBalls(sG) {
      let sH = iH.getRadarDetectableBalls(sG.dimension, sG.location)[0],
        sI = 0,
        sK = 0;
      if (sH) {
        let sL = this.getRelativeLocation(sH.location, sG.location, sG.getViewDirection(), sG.getRotation().y);
        (sI = -sL.x), (sK = sL.z), aQ.tryDamageHeldItem(sG, 1);
      }
      sG.setProperty("dbe:dragon_radar_location", sH ? +("" + (sI + 164) + (sK + 164)) : 0);
    }
    getRelativeLocation(sG, sH, sI, yaw = 0) {
      if (Math.hypot(sI.x, sI.z) < 0.000001) {
        let angle = (yaw * Math.PI) / 180;
        sI = { x: -Math.sin(angle), z: Math.cos(angle) };
      }
      let sK = sG.x - sH.x,
        sL = sG.z - sH.z,
        sM = Math.hypot(sI.x, sI.z),
        sN = sI.x / sM,
        sO = sI.z / sM,
        sP = -sK * sO + sL * sN,
        sQ = -sL * sO - sK * sN,
        sR = Math.hypot(sP, sQ),
        sS = 64;
      if (sR > sS) {
        let sT = sS / sR;
        (sP *= sT), (sQ *= sT);
      }
      return { x: Math.round((sP * 64) / sS), z: Math.round((sQ * 64) / sS) };
    }
  },
  jE = new jD(),
  jF = class {
    applyFoodEffect(sG, sH) {
      switch (sH.typeId) {
        case "dbe:bucket_medical_liquid":
          this.applyBucketMedicalLiquidEffect(sG);
          break;
        case "dbe:senzu_bean":
          this.applySenzuBeanEffect(sG);
          break;
        default:
          this.applyDefaultFoodEffect(sG, sH);
          break;
      }
    }
    applyDefaultFoodEffect(sG, sH) {
      let { attributes: sI, health: sK, ki: sL } = sG,
        sM = sI.stats.getStat("body"),
        sN = sI.stats.getStat("max_ki");
      if (sM && sN) {
        let sO = (sH.getComponent("minecraft:food")?.saturationModifier || 0.6) * 0.25;
        sK.addCurrent(sM.value * sO), sL.addCurrent(sN.value * sO);
      }
    }
    applyBucketMedicalLiquidEffect(sG) {
      let { health: sH } = sG;
      sH.addCurrent(sH.maxValue * 0.4);
    }
    applySenzuBeanEffect(sG) {
      sG.recoverConstitution(),
        sG.player.addEffect("minecraft:saturation", 1, { amplifier: 255 }),
        sG.player.dimension.playSound("item.senzu_bean.use", sG.player.location),
        aQ.decrementStack(sG.player);
    }
  },
  jG = new jF();
export { jj, jk, jp, jw, jx, jy, jz, jA, jA2, jA3, jB, jC, jD, jE, jF, jG };
