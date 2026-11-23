// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 134–167.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { hZ, i3 } from "./15_entities.js";
import { EntityDamageCause as jH, system as jI } from "@minecraft/server";
import { aI, bO } from "./01_util.js";
import { f2 } from "./09_skills_combat.js";
var jJ = class {
    explodeAttack(sG, sH, sI, sK) {
      let { canCutTail: sL, damage: sM, entity: sN, explosionPower: sO, owner: sP } = sG;
      if (!sO && sK?.isValid) {
        if (sL && Math.random() < 0.1) {
          let sQ = i3.getDBEEntity(sK);
          sQ && sQ.race?.id === "saiyan" && !sQ.tailCurled && sQ.removeTail();
        }
        if (!!sK.applyDamage(sM, { cause: jH.entityAttack, damagingEntity: sP })) {
          let sR = sN.getVelocity(),
            sS = bO.scale(sR, 5);
          sK.applyKnockback({ x: sS.x, z: sS.z }, 0);
        }
      }
      jI.run(() => {
        if (sN.isValid) {
          sO &&
            f2.createExplosion(sH, sI, sO, {
              breakBlocks: sG.breakBlocks,
              color: sG.color1 ? aI.colorToRgb(sG.color1) : void 0,
              damage: sM,
              damagingEntity: sP,
              ignoredEntities: sP ? [sP] : [],
            });
          for (let sT of hZ.getNearbyKiAttacks(sN.dimension, sN.location, sG.baseScale * 2)) {
            let { dimension: sU, location: t1 } = sT.entity;
            jK.explodeAttack(sT, sU, t1);
          }
          sN.remove();
        }
      });
    }
  },
  jK = new jJ();
export { jJ, jK };
