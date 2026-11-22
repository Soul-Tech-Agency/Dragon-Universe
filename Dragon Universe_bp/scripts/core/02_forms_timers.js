// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 64–128.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { bO } from "./01_util.js";
import { late } from "./late.js";
var cf = class {
    registeredForms = new Map();
    async displayForm(sG, sH, sI = !1, ...sK) {
      if (this.registeredForms.has(sH)) {
        let sL = this.registeredForms.get(sH);
        if (sL) {
          let sM = new sL(sG, ...sK);
          if (sM.shouldDisplayForm()) return sM.display(sI);
        }
      }
    }
    getRegisteredFormIds() {
      return [...this.registeredForms.keys()];
    }
    registerActionForm(sG, sH) {
      this.registeredForms.set(sG, sH);
    }
  },
  cj = new cf();
import { CONFIG as ck } from "../config/config.js";
import { ki_colors_data as cp } from "../data/ki_colors_data.js";
import { EquipmentSlot as cq, Player as cv, system as cw } from "@minecraft/server";
import { Player as cx, system as cy } from "@minecraft/server";
import { system as cz } from "@minecraft/server";
var cA = class {
    constructor(sG, sH) {
      (this.dbeEntity = sG), (this.combatBehaviorManager = sH), (this.entity = sG.entity);
    }
    entity;
    lastExecutionTime = cz.currentTick;
    cooldownDuration = 20;
    priority = 0;
    triggerChance = 1;
    get distanceToTarget() {
      const target = this.target;
      return this.entity.isValid && target?.isValid ? bO.distance(this.entity.location, target.location) : 0;
    }
    get isInCooldown() {
      return this.lastExecutionTime + this.cooldownDuration > cz.currentTick;
    }
    get target() {
      return this.dbeEntity.target;
    }
    onTimedExecution() {}
    startCooldown() {
      this.lastExecutionTime = cz.currentTick;
    }
  },
  cB = class extends cA {
    constructor(sG, sH) {
      super(sG, sH), (this.cooldownDuration = 140), (this.triggerChance = 0.2);
    }
    onTimedExecution() {
      if (this.target) {
        if (
          this.distanceToTarget <= 4 ||
          this.distanceToTarget > 8 ||
          this.dbeEntity.transformations.currentTransformation.isOozaru
        )
          return;
        let sG = this.dbeEntity.skills.getSkill("rapid_movement");
        sG instanceof late.cI && (sG.teleportToEntity(this.target), this.startCooldown());
      }
    }
  };
export { cf, cj, cA, cB };
