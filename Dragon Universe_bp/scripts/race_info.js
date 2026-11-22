// Dados das raças para a seleção de raça (redesign 1.7.17), lidos de data/races_data.js: nada aqui é digitado à mão,
// para a tela nunca contradizer o jogo. Os nomes vêm do .lang (<raça>.transformation.*).
import { races_data } from "./data/races_data.js";

// Ordem dos bônus na tela (a mesma das Estatísticas).
const ATTRIBUTE_ORDER = ["constitution", "dexterity", "spirit", "strength", "willpower"];
const FIRST_FORMS = 4;

const byId = new Map(races_data.map((race) => [race.id, race]));

/**
 * Resumo de uma raça: multiplicadores de atributo diferentes de 1, tamanho, regeneração, total de formas, as primeiras
 * formas próprias da raça (sem as globais, como Forma Mística) e se ela escolhe gênero.
 */
export function raceInfo(raceId) {
  const race = byId.get(raceId);
  if (!race) return undefined;
  const multipliers = race.multipliers ?? {};
  const forms = race.transformations ?? [];
  const own = forms.filter((form) => typeof form !== "string").map((form) => form.id);
  return {
    id: race.id,
    bonuses: ATTRIBUTE_ORDER.filter((id) => (multipliers[id] ?? 1) !== 1).map((id) => ({ id, value: multipliers[id] })),
    size: multipliers.size ?? 1,
    regen: race.regenRate ?? 1,
    formCount: forms.length,
    firstForms: own.slice(0, FIRST_FORMS),
    moreForms: forms.length > Math.min(own.length, FIRST_FORMS),
    gender: !!race.customizations?.hasGender,
  };
}

/** Slot 16 da seleção de raça (redesign/CONTRATO.md 4.1): "Oozaru · Super Saiyajin · …", com "…" quando há mais. */
export function firstFormsRawtext(info) {
  const parts = [];
  info.firstForms.forEach((id, index) => {
    if (index) parts.push({ text: " · " });
    parts.push({ translate: info.id + ".transformation." + id });
  });
  if (info.moreForms) parts.push({ text: "…" });
  return parts;
}
