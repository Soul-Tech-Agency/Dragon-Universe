// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 118–223.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { d4 } from "./05_db_cooldowns.js";
import { aN, aO, bP } from "./01_util.js";
import { i3 } from "./15_entities.js";
import { EntityDamageCause as i4, EquipmentSlot as i5, Player as i6, system as i7 } from "@minecraft/server";
import { eJ, eO } from "./08_fusion_regions.js";
import { hN } from "./14_player.js";
import { mentalDamageHook as duMentalDamageHook } from "../training/mental.js";
function i8(sG, sH, sI) {
  if (sG.isChunkLoaded(sH)) {
    let sK = d4("dbe:damage_indicator", sG, sH);
    sK && ((sK.nameTag = sI), sK.applyImpulse(new bP(aO.random(0, 0.01), 0.05, aO.random(0, 0.01))));
  }
}
var i9 = class {
    applyDamageToEntity(sG) {
      let { damageSource: sH, hurtEntity: sI } = sG,
        { cause: sK, damagingEntity: sL } = sH,
        { dimension: sM, location: sN } = sI,
        sO = i3.getDBEEntity(sI),
        sP = sK === i4.entityAttack,
        sQ;
      if (sI instanceof i6 && sL instanceof i6 && eJ.areInSameGroup(sI, sL)) {
        sG.cancel = !0;
        return;
      }
      // último dano recebido (treinos: "sem dano nos últimos 10 s" e interrupção por dano)
      sO && (sO.lastHurtTick = i7.currentTick);
      if (sP && sL) {
        let sR = i3.getDBEEntity(sL);
        sR &&
          (sR.hasAttributesDefined &&
            ((sG.damage = ib.calculateModifiedMeleeDamage(sR, sG.damage)), this.processOnHitTriggers(sR)),
          sR.advancedCombat &&
            i7.run(() => {
              sG.cancel || sR.combo.applyComboIn([sI]);
            }));
      }
      if (sO?.hasAttributesDefined) {
        let { combo: sS, guard: sT, health: sU } = sO;
        if (sK === i4.fall) {
          sG.cancel = !0;
          return;
        }
        if (sP && sL) {
          if (sO.guard.isGuarding) {
            (sG.cancel = !0), i7.run(() => sT.tryBreakGuard(sL));
            return;
          }
          if (sO.alwaysDodge) {
            (sG.cancel = !0), sO.trySpread(sI.location, 4);
            return;
          }
          if (sT.shouldDodge(sL)) {
            (sG.cancel = !0), i7.run(() => sT.applyDodgeEffects());
            return;
          }
        }
        if (sO instanceof hN) {
          let { dimension: t1, location: t2 } = sI;
          if (sO.getCurrentFusion()?.isController === !1) {
            sG.cancel = !0;
            return;
          }
          if (sL instanceof i6 && eO(t1).isSafeZoneLocation(t2)) {
            sG.cancel = !0;
            return;
          }
        }
        // treino mental: só o dono fere a réplica; o golpe letal nela é vitória e no jogador deixa a vida em 1
        if (duMentalDamageHook(sI, sO, sL, sG.damage, sU, sK)) {
          sG.cancel = !0;
          return;
        }
        (sQ = sU.applyDamage(sG.damage, sL)),
          sU.currentValue
            ? i7.run(() => {
                if (sI.isValid) {
                  let t3 = sI.getComponent("minecraft:health");
                  t3 && t3.currentValue > 0 && t3.resetToMaxValue();
                }
              })
            : (sG.damage = 2000000000);
      }
      sI.typeId !== "dbe:damage_indicator" &&
        i7.run(() => {
          let t3 = "§l§e-" + Math.floor(sQ ?? sG.damage);
          i8(sM, sN, t3);
        });
    }
    calculateModifiedMeleeDamage(sG, sH) {
      let { attributes: sI, combo: sK } = sG,
        sL = sI.stats.getStat("melee_damage");
      if (sL) {
        let sM = this.getModifiedSkillDamage(sG);
        return (sH + sL.value + sM) * sK.damageMultiplier * (sG.race?.id === "glind" ? 2.25 : 1);
      }
      return sH;
    }
    getModifiedSkillDamage(sG) {
      let { attributes: sH, entity: sI, skills: sK } = sG;
      if (aN.getEquippedItem(sI, i5.Mainhand)) return 0;
      let sL = sK
          .getSkillsByType("toggle")
          .filter(({ wilDamage: sN, isEnabled: sO }) => sO && sN > 0)
          .reduce((sN, sO) => sN + sO.wilDamage, 0),
        sM = sH.getAttribute("willpower")?.modifiedValue ?? 1;
      return sL * sM;
    }
    processOnHitTriggers(sG) {
      let { attributes: sH, ki: sI, masteries: sK, skills: sL } = sG,
        sM = !1;
      // Só skills ligadas: ki_fist/ki_scythe desligadas cobravam ki a cada golpe (o on_damage já checava isEnabled).
      for (let sN of sL.getSkillsByType("toggle"))
        sN.isEnabled &&
          (sN.kiDrainTrigger === "on_hit" && (sI.currentValue >= sN.kiDrain ? sI.removeCurrent(sN.kiDrain) : sN.disable()),
          sN.masteryOptions?.grantTrigger === "on_hit" && sK.getMastery(sN.id)?.addPercentage(1));
      sM && sH.updateStats();
    }
  },
  ib = new i9();
export { i8, i9, ib };
