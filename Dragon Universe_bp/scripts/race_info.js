// Dados das raças para a seleção de raça (redesign 1.7.17), lidos de data/races_data.js: nada aqui é digitado à mão,
// para a tela nunca contradizer o jogo. Os nomes vêm do .lang (<raça>.transformation.*).
import { races_data } from "./data/races_data.js";

// Ordem dos bônus na tela (a mesma das Estatísticas).
const ATTRIBUTE_ORDER = ["constitution", "dexterity", "spirit", "strength", "willpower"];
// XP extra da raça: index.js (getter multiplier do nível) dá 1.1 ao Glind; fica aqui só para exibição.
const XP_MULTIPLIER = { glind: 1.1 };
const FIRST_FORMS = 4;

const byId = new Map(races_data.map((race) => [race.id, race]));
const formId = (form) => (typeof form === "string" ? form : form.id);
const fmt = (value) => "x" + parseFloat(Number(value).toFixed(2));

/**
 * Resumo de uma raça: multiplicadores diferentes de 1 (atributos e tamanho), regeneração, XP, formas (total e as
 * primeiras próprias da raça, sem as globais como Forma Mística), gênero e opções de personalização com mais de 1 valor.
 */
export function raceInfo(raceId) {
  const race = byId.get(raceId);
  if (!race) return undefined;
  const multipliers = race.multipliers ?? {};
  const forms = (race.transformations ?? []).map(formId);
  const own = (race.transformations ?? []).filter((form) => typeof form !== "string").map(formId);
  const options = Object.entries(race.customizations?.options ?? {})
    .map(([id, option]) => ({ id, count: option.optionCount ?? option.palette?.length ?? 0, genders: option.activeGenders }))
    .filter((option) => option.count > 1);
  return {
    id: race.id,
    bonuses: ATTRIBUTE_ORDER.filter((id) => (multipliers[id] ?? 1) !== 1).map((id) => ({ id, value: multipliers[id] })),
    size: multipliers.size ?? 1,
    regen: race.regenRate ?? 1,
    xp: XP_MULTIPLIER[race.id] ?? 1,
    formCount: forms.length,
    forms,
    firstForms: own.slice(0, FIRST_FORMS),
    moreForms: forms.length > Math.min(own.length, FIRST_FORMS),
    gender: !!race.customizations?.hasGender,
    options,
    defaultSkills: race.defaultSkills ?? [],
  };
}

export const raceIds = () => races_data.map((race) => race.id);

// ---------------------------------------------------------------- rawtext para os formulários

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
