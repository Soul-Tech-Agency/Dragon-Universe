// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 182–190.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { shop_data as rI } from "../data/shop_data.js";
import { jU } from "./20_shop_dialogues.js";
import { system as rJ } from "@minecraft/server";
function rK() {
  for (let sG of rI) jU.register(sG);
  rJ.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:shop_registry") {
      for (let sK of JSON.parse(sI)) jU.register(sK);
    }
  });
}
rK();
export { rK };
