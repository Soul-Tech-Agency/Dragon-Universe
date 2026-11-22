// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 81–201.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { system as dq } from "@minecraft/server";
import { bindLate } from "./late.js";
var dv = class {
  constructor(sG) {
    (this.dbeEntity = sG),
      (dq.run(() => {
        if (sG.entity.isValid)
          try {
            this.dbeEntity.entity.triggerEvent("dbe:enable_movement");
          } catch {}
      }),
      sG.runInterval(() => {
        if (!sG.isLoadingAttack && sG.advancedCombat) {
          for (let sH of this.getAllBehaviors()) {
            if (!sG.entity.isValid) return;
            if (sH.isInCooldown || this.runningBehaviors.has(sH) || Math.random() >= sH.triggerChance) continue;
            this.runningBehaviors.add(sH);
            try {
              Promise.resolve(sH.onTimedExecution()).catch(error => {
                console.warn("[Dragon Universe] Combat behavior " + sH.constructor.name + " failed: " + (error?.stack ?? error));
              }).finally(() => this.runningBehaviors.delete(sH));
            } catch (error) {
              this.runningBehaviors.delete(sH);
              console.warn("[Dragon Universe] Combat behavior " + sH.constructor.name + " failed: " + (error?.stack ?? error));
            }
          }
        }
      }, 20));
  }
  behaviorsMap = new Map();
  runningBehaviors = new Set();
  cachedBehaviors = null;
  lastEventId;
  get isFlying() {
    return !!this.dbeEntity.entity.getProperty("dbe:is_flying");
  }
  addBehavior(sG, sH) {
    this.behaviorsMap.set(sG, sH), (this.cachedBehaviors = null);
  }
  getBehavior(sG) {
    return this.behaviorsMap.get(sG);
  }
  getAllBehaviors() {
    return (
      this.cachedBehaviors ||
        (this.cachedBehaviors = [...this.behaviorsMap.values()].sort((sG, sH) => sG.priority - sH.priority)),
      this.cachedBehaviors
    );
  }
};
import {
  GameMode as dw,
  Player as dx,
  PlayerPermissionLevel as dy,
  system as dz,
  world as dA,
} from "@minecraft/server";
var dB = class {
    requirementTypesMap = new Map();
    buildRequirementLocalizationKey(sG, sH) {
      return "requirement." + sG + (dC.isEqualityOperator(sH) ? "" : ".not_equal");
    }
    compare(sG, sH, sI = "==") {
      switch (sI) {
        case "==":
          return sG === sH;
        case "!=":
          return sG !== sH;
        case "<":
          return sG < sH;
        case "<=":
          return sG <= sH;
        case ">":
          return sG > sH;
        case ">=":
          return sG >= sH;
      }
    }
    get(sG) {
      let sH = this.requirementTypesMap.get(sG);
      if (!sH) {
        console.warn("Requerimento não registrado: " + sG);
        return;
      }
      return sH;
    }
    getDescription(sG) {
      let sH = this.get(sG.test);
      if (!sH) throw new Error("Requisito '" + sG.test + "' não está registrado.");
      return { rawtext: sH.localizationKey?.(sG) };
    }
    getOperatorLocalizationKey(sG) {
      return {
        "==": "requirement.operator.equal",
        "!=": "requirement.operator.not_equal",
        "<": "requirement.operator.less_than",
        "<=": "requirement.operator.less_or_equal",
        ">": "requirement.operator.greater_than",
        ">=": "requirement.operator.greater_or_equal",
      }[sG];
    }
    isEqualityOperator(sG) {
      return sG === "==" || !sG;
    }
    listDescription(sG, sK) {
      let sH = [];
      for (let sI of sG)
        !sI.exceptRaceIds?.includes(sK?.race?.id) && this.get(sI.test) &&
          sH.push({ text: "\n- " }, this.getDescription(sI));
      return { rawtext: sH };
    }
    register(sG) {
      this.requirementTypesMap.set(sG.type, sG);
    }
    test(sG, sH) {
      return this.get(sH.test)?.test(sG, sH) ?? !1;
    }
    testAll(sG, sH) {
      return sH.every((sI) => this.test(sG, sI));
    }
  },
  dC = new dB();
bindLate("dC", () => dC);
export { dv, dB, dC };
