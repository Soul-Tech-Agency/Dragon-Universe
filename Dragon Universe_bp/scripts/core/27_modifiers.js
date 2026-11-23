// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 167–219.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { dN, dO, dP } from "./07_stats.js";
import { modifiers_data as pZ } from "../data/modifiers_data.js";
import { system as q0 } from "@minecraft/server";
import { hN } from "./14_player.js";
var q1 = class {
    constructor() {
      dP.registerModifier(new dO("fusion", this.fusionModifier.bind(this))),
        dP.registerModifier(new dO("race", this.raceModifier.bind(this))),
        dP.registerModifier(new dO("skills", this.skillsModifier.bind(this))),
        dP.registerModifier(new dO("transformation", this.transformationModifier.bind(this)));
      for (let sG of pZ) this.createAndRegisterModifier(sG);
      q0.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
        if (sH === "dbe:modifier_registry") {
          let sK = JSON.parse(sI);
          for (let sL of sK) this.createAndRegisterModifier(sL);
        }
      });
    }
    fusionModifier(sG, sH) {
      if (sG instanceof hN) {
        let sI = sG.getCurrentFusion();
        if (sI) {
          for (let [sK, sL] of Object.entries(sI.getMultipliers())) sH.multiply(sK, sL);
        }
      }
    }
    raceModifier(sG, sH) {
      let { race: sI } = sG;
      sI && dN(sH, sI.multipliers, 1);
    }
    skillsModifier(sG, sH) {
      let sI = sG.skills.getSkillsByType("toggle");
      if (sI.length)
        for (let sK of sI) {
          let { isEnabled: sL, masteryMultiplier: sM, multipliers: sN } = sK;
          !sL || !sN || dN(sH, sN, sM);
        }
    }
    transformationModifier(sG, sH) {
      let { masteries: sI, transformations: sK } = sG,
        { currentTransformation: sL } = sK,
        { multipliers: sM } = sL,
        sN = sI.getMastery(sL.id)?.masteryMultiplier ?? 1;
      dN(sH, sM, sN);
    }
    createAndRegisterModifier(sG) {
      let sH = new dO(
        sG.id,
        (sI, sK) => {
          dN(sK, sG.multipliers, 1);
        },
        sG,
      );
      dP.registerModifier(sH);
    }
  },
  q2 = new q1();
export { q1, q2 };
