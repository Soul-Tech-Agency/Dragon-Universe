// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–1 de então, linhas 177–255.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { initializeFutureTerrain, registerFutureCityPlacement } from "../future_terrain.js";
import { bM, bP } from "./01_util.js";
import { Player as qV, world as qW } from "@minecraft/server";
var qX = new Array(512),
  qY = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
    21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
    237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
    111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
    73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
    189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
    144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
    204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
    66, 215, 61, 156, 180,
  ];
for (let t9 = 0; t9 < 256; t9++) qX[256 + t9] = qX[t9] = qY[t9];
function qZ(sG) {
  return sG * sG * sG * (sG * (sG * 6 - 15) + 10);
}
function r0(sG, sH, sI) {
  return sH + sG * (sI - sH);
}
function r1(sG, sH, sI, sK) {
  let sL = sG & 15,
    sM = sL < 8 ? sH : sI,
    sN = sL < 4 ? sI : sL === 12 || sL === 14 ? sH : sK;
  return ((sL & 1) === 0 ? sM : -sM) + ((sL & 2) === 0 ? sN : -sN);
}
function r2(sG, sH, sI) {
  let sK = Math.floor(sG) & 255,
    sL = Math.floor(sH) & 255,
    sM = Math.floor(sI) & 255;
  (sG -= Math.floor(sG)), (sH -= Math.floor(sH)), (sI -= Math.floor(sI));
  let sN = qZ(sG),
    sO = qZ(sH),
    sP = qZ(sI),
    sQ = qX[sK] + sL,
    sR = qX[sQ] + sM,
    sS = qX[sQ + 1] + sM,
    sT = qX[sK + 1] + sL,
    sU = qX[sT] + sM,
    t1 = qX[sT + 1] + sM;
  return r0(
    sP,
    r0(
      sO,
      r0(sN, r1(qX[sR], sG, sH, sI), r1(qX[sU], sG - 1, sH, sI)),
      r0(sN, r1(qX[sS], sG, sH - 1, sI), r1(qX[t1], sG - 1, sH - 1, sI)),
    ),
    r0(
      sO,
      r0(sN, r1(qX[sR + 1], sG, sH, sI - 1), r1(qX[sU + 1], sG - 1, sH, sI - 1)),
      r0(sN, r1(qX[sS + 1], sG, sH - 1, sI - 1), r1(qX[t1 + 1], sG - 1, sH - 1, sI - 1)),
    ),
  );
}
function r6() {
  initializeFutureTerrain(r2);
}
r6();
bM.on("entity_enter_region", ({ entity: sG, region: sH }) => {
  sH.id === "future_trunks" &&
    sG instanceof qV &&
    (sG.removeTag("dbe_join_future_trunks"), sG.runCommand("fog @s push dbe:fog_future_trunks future_trunks"));
}),
  bM.on("entity_exit_region", ({ entity: sG, region: sH }) => {
    sH.id === "future_trunks" &&
      sG instanceof qV &&
      (sH.dimension === sG.dimension ? sH.teleportToRegion(sG) : sG.runCommand("fog @s remove future_trunks"));
  }),
  bM.on("region_load", async ({ region: sG }) => {
    if (sG.id === "future_trunks") {
      // A cidade não é mais preparada no carregamento da região (abria 210 chunks e gerava o Futuro sem ninguém lá):
      // só fica registrada como colocá-la, e a 1ª viagem ao Futuro a prepara e espera (prepareDestination).
      if (!qW.getDynamicProperty("futureTrunksCityLoaded"))
        registerFutureCityPlacement(() => qW.structureManager.placeJigsawStructure(
          "dbe:city", sG.dimension, new bP(-31, 49, -22), { ignoreStartHeight: !0 }));
      r6();
    }
  });
export { qX, qY, qZ, r0, r1, r2, r6 };
