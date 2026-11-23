// Liga a sonda (core/perf.js) ao gancho dos jobs de terreno de terrain_repair.js (terrainJobProbe.wrap). Fica fora do
// perf.js porque ele precisa ser o primeiro import do index.js; este módulo é importado depois do kaioshin_dimension.js,
// quando o terrain_repair.js já carregou, então a ordem de carga não muda. Com CONFIG.DEBUG_PERF = false o embrulho é
// null e nada é ligado.
import { terrainJobProbe } from "../terrain_repair.js";
import { terrainProbeWrap } from "./perf.js";

if (terrainProbeWrap) terrainJobProbe.wrap = terrainProbeWrap;
