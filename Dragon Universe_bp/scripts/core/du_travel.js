// Viagem segura do núcleo (duTravel). Movida do index.js COMO ESTAVA (O4.0-1 de planos/O4_0_DETALHE.md): só depende de
// travel_safety.js, e assim os módulos novos do O4 a importam daqui, sem importar o index.js. Sem efeito na carga.
import { safeTeleport as duSafeTeleport, safeReturnToEarth as duSafeReturnToEarth,
  reportTravelFailure as duReportTravelFailure } from "../travel_safety.js";
export async function duTravel(entity, location, options = {}) {
  try {
    const dimension = options.dimension ?? entity.dimension;
    if (dimension.id === "minecraft:overworld" && entity.dimension.id !== dimension.id)
      await duSafeReturnToEarth(entity, { ...options, savedOrigin: { ...location, d: dimension.id } });
    else await duSafeTeleport(entity, location, options);
    return !0;
  } catch (error) {
    duReportTravelFailure(entity, options?.label ?? "destination", error);
    return !1;
  }
}
