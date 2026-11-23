// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 139–405.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { ItemTypes as jM, system as jN, ItemStack as jP } from "@minecraft/server";
import { hO } from "./14_player.js";
import { dC } from "./06_requirements.js";
import { aO } from "./01_util.js";
import { ActionFormData as jO } from "@minecraft/server-ui";
import { d6 } from "./05_db_cooldowns.js";
import { skills_data as jL } from "../data/skills_data.js";
import { gB } from "./12_quests.js";
function jQ(sG) {
  return function () {
    let sH = (sG += 1831565813);
    return (
      (sH = Math.imul(sH ^ (sH >>> 15), sH | 1)),
      (sH ^= sH + Math.imul(sH ^ (sH >>> 7), sH | 61)),
      ((sH ^ (sH >>> 14)) >>> 0) / 4294967296
    );
  };
}
var jR = class {
    constructor(sG) {
      this.itemData = sG;
    }
    get iconPath() {
      return this.itemData.iconPath ?? "textures/empty";
    }
    get items() {
      return this.itemData.items ?? [];
    }
    get localizationKey() {
      return "shop.item." + this.itemData.id;
    }
    get price() {
      return this.itemData.price;
    }
    giveItems(sG) {
      for (let sH of this.items) {
        let sI = new jP(sH.item, sH.amount);
        sG.getComponent("inventory")?.container.addItem(sI);
      }
    }
  },
  jS = class {
    constructor(sG) {
      this.shopData = sG;
      for (let sH of sG.catalog) {
        let sI = new jR(sH);
        this.catalog.push(sI);
      }
    }
    catalog = [];
    get id() {
      return this.shopData.id;
    }
    getCatalog() {
      return this.catalog;
    }
    getCatalogForNpc(sG) {
      let sH = this.getCatalog();
      return this.getSeededRandomItems(sH, this.shopData.npcCatalogConfig?.maxItems ?? sH.length, sG);
    }
    tryBuyItem(sG, sH) {
      let { player: sI, zeni: sK } = sG;
      return sK.value >= sH.price
        ? (sI.getComponent("inventory")?.container.emptySlotsCount ?? 0) < sH.items.length
          ? (sI.sendMessage({ translate: "shop.result.inventory_full" }), !1)
          : (sK.removeValue(sH.price), sH.giveItems(sG.player), sI.playSound("random.levelup", { pitch: 4 }), !0)
        : (sI.sendMessage({ translate: "shop.result.insufficient_zeni" }), !1);
    }
    getSeededRandomItems(sG, sH, sI) {
      let sK = jQ(sI);
      return [...sG].sort(() => sK() - 0.5).slice(0, sH);
    }
  },
  jT = class {
    instances = new Map();
    getShop(sG) {
      return this.instances.get(sG);
    }
    register(sG) {
      let sH = new jS(sG);
      this.instances.set(sG.id, sH);
    }
  },
  jU = new jT(),
  jV = class {
    dialoguesMap = new Map();
    getNpcDialogues() {
      let sG = [];
      for (let sH of this.dialoguesMap.values()) this.isNpcDialogue(sH) && sG.push(sH);
      return sG;
    }
    getDialogue(sG) {
      return this.dialoguesMap.get(sG);
    }
    getNpcDialogue(sG) {
      return this.getNpcDialogues().find((sH) => sH.npcId === sG);
    }
    registerDialogue(sG) {
      this.dialoguesMap.set(sG.id, sG);
    }
    async showDialogue(sG, sH, sI) {
      let sK = hO(sG),
        { cooldowns: sL, quests: sM } = sK;
      if (sI.npcId === "dbe:master_roshi") sK.claimBulmaStaffReward();
      if (sI.requirements) {
        let { requirements: sO } = sI;
        if (!dC.testAll(sK, sO ?? [])) {
          sG.sendMessage({ translate: "ui.dbe.npcIgnored." + aO.randomInt(1, 6) });
          return;
        }
      }
      if (sI.addQuest) {
        let { questId: sP, requirements: sQ } = sI.addQuest,
          sR = sM.hasQuest(sP),
          sS = sM.getCompletedQuestIds().includes(sP),
          sT = dC.testAll(sK, sQ ?? []);
        if (!sR && !sS && sT) {
          await sM.addQuest(sP);
          return;
        }
      }
      let sN = new jO()
        .title(sI.title ?? "")
        .body(sI.body ? this.resolveDialogueBody(sK, sI.body) : "")
        .button(sI.backButtonDialogue ? "ui.dbe.backButton" : "");
      if (sI.buttons)
        for (let sU of sI.buttons) {
          let t1 = dC.testAll(sK, sU.requirements ?? []);
          if (sU.cooldown) {
            let t2 = sL.getCooldown(sU.cooldown.id);
            t2 && !t2.isExpired() && (t1 = !1);
          }
          sN.button(t1 ? sU.buttonText : "", sU.iconPath);
        }
      jN.run(() => {
        sN.show(sG).then((t3) => {
          if (t3.selection === 0 && sI.backButtonDialogue) {
            let t6 = this.getDialogue(sI.backButtonDialogue);
            t6 && this.showDialogue(sG, sH, t6);
          }
          if (t3.selection && sI.buttons) {
            let t7 = sI.buttons[t3.selection - 1];
            this.onButtonClick(sG, sH, sI, t7);
          }
        });
      });
    }
    createMentorDialogue(sG, sH) {
      return {
        id: sG.id,
        body: "ui.dbe.mentor.invite.text",
        title: sG.title,
        buttons: [
          {
            buttonText: "ui.dbe.mentor.invite.button.confirm",
            onClick: (sI) => {
              let { masterManager: sK } = hO(sI);
              sK.setCurrentMaster(sH);
            },
          },
        ],
      };
    }
    createShopDialogue(sG, sH, sI) {
      let sK = this.generateShopMenu(sG, sH, sI);
      return { id: sI, buttons: sK.buttons, title: sK.title };
    }
    createSkillsDialogue(sG, sH, sI) {
      let sK = this.generateSkillMenu(sG, sI);
      return { id: sH, buttons: sK.buttons, title: sK.title };
    }
    generateShopMenu(sG, sH, sI) {
      let sK = hO(sG),
        sL = [],
        sM = jU.getShop(sI);
      if (sM) {
        for (let sN of sM.getCatalogForNpc(Number(sH.id)))
          sL.push({
            buttonText: {
              rawtext: [
                { translate: sN.localizationKey },
                { text: " " },
                ...(d6(sN.price, "zeni").rawtext ?? []),
                { text: "\n§8" },
                { translate: sN.localizationKey + ".description" },
                { text: "\n\n" },
                ...sN.items.map(({ item: sO }) => ({
                  rawtext: [{ translate: jM.get(sO)?.localizationKey }, { text: ", " }],
                })),
              ],
            },
            iconPath: sN.iconPath,
            onClick: () => sM.tryBuyItem(sK, sN),
          });
      }
      return { buttons: sL, title: "ui.dbe.shop.title" };
    }
    generateSkillMenu(sG, sH) {
      let { skills: sI, pointsManager: sK } = hO(sG),
        sL = [];
      for (let sM of jL) {
        let { availableTrainers: sN, id: sO, price: sP, type: sQ } = sM;
        if (!sN?.includes(sH) || !sI.canLearnSkill(sO)) continue;
        let sR = "skill." + sO,
          sS = sI.hasSkill(sO);
        sL.push({
          buttonText: {
            rawtext: [
              { translate: sR },
              { text: " " },
              ...(sS ? [{ text: "§a" }, { translate: "skill.learned" }] : (d6(sP ?? 0, "skill_points").rawtext ?? [])),
              { text: "\n\n§r§8" },
              { translate: "skill." + sO + ".description" },
              { text: " (" },
              { translate: "skill.type." + sQ },
              { text: ")" },
            ],
          },
          onClick: () => {
            if (!sI.hasSkill(sO) && sI.canLearnSkill(sO) && (!sP || sK.trySpend("skill_points", sP)))
              sI.tryLearnSkill(sO);
          },
        });
      }
      return { buttons: sL, title: "ui.dbe.learn_skills.title" };
    }
    isNpcDialogue(sG) {
      return sG.npcId !== void 0;
    }
    onButtonClick(sG, sH, sI, sK) {
      let sL = hO(sG),
        { nextDialogue: sM, rewards: sN } = sK,
        sO = sI.subMenus?.find(({ id: sP }) => sP === sM);
      if (
        (sK.onClick && sK.onClick(sG),
        sK.cooldown && sL.cooldowns.setCooldown(sK.cooldown.id, sK.cooldown.duration, sK.cooldown.source),
        sN)
      )
        for (let sP of sN) {
          let sQ = gB.get(sP.type);
          if (sQ) {
            let sR = new sQ(sP);
            sR.tryGrantReward(sL), sR.sendRewardMessage(sL);
          }
        }
      if (sO) {
        if (this.isNpcDialogue(sI)) {
          if (sO.type === "mentor_invite") {
            let sS = this.createMentorDialogue(sO, sH.typeId);
            this.showDialogue(sG, sH, sS);
            return;
          }
          if (sO.type === "shop") {
            let sT = this.createShopDialogue(sG, sH, sO.id);
            this.showDialogue(sG, sH, sT);
            return;
          }
          if (sO.type === "skills") {
            let sU = this.createSkillsDialogue(sG, sO.id, sH.typeId);
            this.showDialogue(sG, sH, sU);
            return;
          }
        }
        this.showDialogue(sG, sH, sO);
      }
    }
    resolveDialogueBody(sG, sH) {
      if (Array.isArray(sH)) {
        for (let sI of sH) if (dC.testAll(sG, sI.requirements)) return sI.text;
        return "";
      }
      return sH;
    }
  },
  jW = new jV();
export { jQ, jR, jS, jT, jU, jV, jW };
