// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–3 de então, linhas 188–261.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { system as s5, world as s6 } from "@minecraft/server";
import { gI } from "./12_quests.js";
import { hO } from "./14_player.js";
import { fG } from "./11_entity_wrapper.js";
import { eF, eJ } from "./08_fusion_regions.js";
import { cY } from "./04_tournament_dims.js";
import { every } from "./scheduler.js";
import { aM } from "./01_util.js";
import { CONFIG as s4 } from "../config/config.js";
var s7 = class {
    initialized = !1;
    init() {
      this.initialized || ((this.initialized = !0), s6.beforeEvents.chatSend.subscribe(this.beforeChatSend.bind(this)));
    }
    beforeChatSend(sG) {
      let { message: sH, sender: sI, targets: sK } = sG;
      if (((sG.cancel = !0), !gI.isBanned(sI.name))) {
        let sL = hO(sI),
          sM = fG.getHighestPlayerDisplayTag(sL),
          sN = eJ.getPlayerGroup(sI.id),
          sO = sM ? sM.colorPrefix + "[" + sM.name + "] " : "",
          sP = sN ? "§u[" + (sN.isOwner(sI.id) ? "**" : "") + sN.name + "] " : "",
          sQ = "" + sO + sP + "§r" + sI.name + " §8>> §7" + sH.replace("\u00a7", "");
        s5.run(() => {
          if (sK) {
            for (let sR of sK) sR.sendMessage(sQ);
          } else s6.sendMessage(sQ);
        });
      }
    }
  },
  s8 = new s7();
import { system as s9, world as sb } from "@minecraft/server";
var sf = 18000,
  sj = [12000, 6000, 1200, 100, 80, 60, 40, 20],
  sk = ["minecraft:item"],
  sp = class {
    initialized = !1;
    clearEntities() {
      let sG = cY.getAll(),
        sH = 0;
      for (let sI of sG) for (let sK of sI.getEntities()) sk.includes(sK.typeId) && (sK.remove(), sH++);
      sb.sendMessage({ translate: "server.clear_lag.finish", with: ["" + sH] });
    }
    init() {
      if (!this.initialized) {
        this.initialized = !0;
        let sG = sf;
        // G5: período ausente = 1 tick (o every repassa sem período na prova, como antes)
        every(undefined, "core.clear_lag", () => {
          if ((sj.includes(sG) && this.sendWarn(sG), sG <= 0)) {
            this.clearEntities(), (sG = sf);
            return;
          }
          sG--;
        }, { phase: 0 });
      }
    }
    sendWarn(sG) {
      sb.sendMessage({ translate: "server.clear_lag.warn", with: aM.convertTimeToRawText(sG * 50) });
    }
  },
  sq = new sp();
import { system as sv, world as sw } from "@minecraft/server";
var sx = class {
    currentIndex = 0;
    init() {
      every(3600, "core.server_messages", () => { // G6
        let sG = this.getNextMessageLocalizationKey();
        sw.sendMessage({ translate: sG }), (this.currentIndex = ++this.currentIndex % 10);
      }, { phase: 1801 });
    }
    getNextMessageLocalizationKey() {
      return "server.message." + (this.currentIndex + 1);
    }
  },
  sy = new sx();
function sz() {
  s4.SERVER_MODE.BATTLE_POWER_RANKING && eF.init(),
    s4.SERVER_MODE.CLEAR_LAG && sq.init(),
    s4.SERVER_MODE.CUSTOM_CHAT && (s8.init(), sy.init());
}
sz();
export { s7, s8, sf, sj, sk, sp, sq, sx, sy, sz };
