// Registro de chefes derrotados (planos/TREINOS.md §3.1, versão mínima do registro de progressão da Fase 4).
// Base do treino mental, dos títulos e dos eventos.
//
// Save: chave NOVA "progress" no JSON de dados do jogador (dbePlayer.data), só acrescentada:
//   { v: 1, bosses: { "<typeId>": <vezes que venceu> } }
// Escrita: recordBossKill, chamada pelo núcleo no evento entity_died com o mesmo critério de matador da tarefa
// defeat_enemy (damageSource.damagingEntity é o jogador). Réplica do treino mental (tag dbe:mental_replica, decisões
// 13/14) não conta.
// Saves antigos: na primeira leitura sem v: 1, marca os chefes das tarefas defeat_enemy das missões concluídas e dos
// objetivos já concluídos das missões em andamento (com 1 vitória), e grava v: 1. Roda uma vez por jogador.
// Este módulo não importa o index.js: recebe o wrapper do jogador (dbePlayer) de quem chama.
import { progression_data } from "../data/progression_data.js";
import { main_quests_data } from "../data/main_quests_data.js";
import { side_quests_data } from "../data/side_quests_data.js";
import { challenge_quests_data } from "../data/challenge_quests_data.js";

export const SAVE_KEY = "progress";
export const MENTAL_REPLICA_TAG = "dbe:mental_replica";
const VERSION = 1;
export const BOSS_IDS = progression_data.bosses.map((b) => b.id);
const BOSS_SET = new Set(BOSS_IDS);
const QUESTS = new Map([...main_quests_data, ...side_quests_data, ...challenge_quests_data].map((q) => [q.id, q]));

export function isBoss(typeId) {
  return BOSS_SET.has(typeId);
}

function defeatTargets(objectives) {
  const ids = [];
  for (const objective of objectives ?? [])
    for (const task of objective?.tasks ?? []) if (task?.type === "defeat_enemy" && isBoss(task.entity)) ids.push(task.entity);
  return ids;
}

function backfill(dbePlayer, old) {
  const bosses = { ...(old?.bosses ?? {}) };
  const mark = (id) => (bosses[id] = Math.max(1, bosses[id] ?? 0));
  const { quests } = dbePlayer;
  for (const questId of quests?.getCompletedQuestIds?.() ?? []) defeatTargets(QUESTS.get(questId)?.objectives).forEach(mark);
  for (const quest of quests?.getQuests?.() ?? [])
    for (const objective of quest.getAllObjectives?.() ?? [])
      if (objective.isCompleted)
        for (const task of objective.getTasks?.() ?? [])
          if (task.taskData?.type === "defeat_enemy" && isBoss(task.taskData.entity)) mark(task.taskData.entity);
  return { v: VERSION, bosses };
}

function load(dbePlayer) {
  let progress = dbePlayer.data.get(SAVE_KEY);
  if (progress?.v !== VERSION) {
    progress = backfill(dbePlayer, progress);
    dbePlayer.data.set(SAVE_KEY, progress);
  }
  return progress;
}

/** Marca a vitória do jogador sobre o chefe `entity` (a entidade que morreu). Devolve true se marcou. */
export function recordBossKill(dbePlayer, entity) {
  if (!dbePlayer?.data || !isBoss(entity?.typeId)) return false;
  try {
    if (entity.hasTag(MENTAL_REPLICA_TAG)) return false;
  } catch {
    return false; // sem como saber se é réplica: não marca
  }
  const progress = load(dbePlayer);
  progress.bosses[entity.typeId] = (progress.bosses[entity.typeId] ?? 0) + 1;
  dbePlayer.data.set(SAVE_KEY, progress);
  return true;
}

export function hasDefeated(dbePlayer, typeId) {
  return !!load(dbePlayer).bosses[typeId];
}

/** Chefes vencidos, na ordem da campanha: [{ id, quest, order, wins }]. */
export function listDefeated(dbePlayer) {
  const { bosses } = load(dbePlayer);
  return progression_data.bosses.filter((b) => bosses[b.id]).map((b) => ({ ...b, wins: bosses[b.id] }));
}
