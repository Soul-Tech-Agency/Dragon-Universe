// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 190–201.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { system as sA } from "@minecraft/server";
var sB = [],
  sC = [],
  sD = [],
  sE = [],
  sF = [];
sA.run(() => {
  sA.sendScriptEvent("dbe:dialogue_registry", JSON.stringify(sB)),
    sA.sendScriptEvent("dbe:entity_registry", JSON.stringify(sC)),
    sA.sendScriptEvent("dbe:modifier_registry", JSON.stringify(sD)),
    sA.sendScriptEvent("dbe:quest_registry", JSON.stringify(sE)),
    sA.sendScriptEvent("dbe:shop_registry", JSON.stringify(sF));
});
export { sB, sC, sD, sE, sF };
