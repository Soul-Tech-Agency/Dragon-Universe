// Testa o registro de chefes derrotados (Dragon Universe_bp/scripts/progression/progression.js) sem o jogo, com um
// jogador falso. Uso: node tools/test-progression.mjs   (sai com código 1 se algum caso falhar)
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const mod = await import(url.pathToFileURL(path.join(ROOT, "Dragon Universe_bp", "scripts", "progression", "progression.js")).href);
const { progression_data } = await import(url.pathToFileURL(path.join(ROOT, "Dragon Universe_bp", "scripts", "data", "progression_data.js")).href);

const player = ({ saved, completed = [], active = [] } = {}) => {
  const store = new Map(saved ? [["progress", saved]] : []);
  let writes = 0;
  return {
    data: { get: (k) => store.get(k), set: (k, v) => { writes++; store.set(k, JSON.parse(JSON.stringify(v))); } },
    quests: { getCompletedQuestIds: () => completed, getQuests: () => active },
    get saved() { return store.get("progress"); },
    get writes() { return writes; },
  };
};
const entity = (typeId, tags = []) => ({ typeId, hasTag: (t) => tags.includes(t) });
const task = (type, entity, entityDefinitions) => ({ taskData: { type, entity, entityDefinitions } });
const objective = (done, ...tasks) => ({ isCompleted: done, objectiveData: {}, getTasks: () => tasks });

let failed = 0;
const test = (name, fn) => {
  try { fn(); console.log("  ok    " + name); } catch (e) { failed++; console.log("  FALHOU " + name + "\n         " + e.message); }
};
const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what}: esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`); };

test("1. a lista tem 39 chefes, sem os inimigos comuns, na ordem da campanha", () => {
  eq(progression_data.bosses.length, 39, "chefes");
  for (const c of ["dbe:shadow_dummy", "dbe:saibaman", "dbe:frieza_soldier", "dbe:cell_junior"]) if (mod.isBoss(c)) throw new Error(c + " não deveria ser chefe");
  eq(progression_data.bosses.slice(0, 3).map((b) => b.id), ["dbe:raditz", "dbe:nappa", "dbe:vegeta"], "primeiros");
  eq(progression_data.bosses.map((b) => b.order), progression_data.bosses.map((_, i) => i + 1), "order 1..39");
});
test("2. save antigo com a saga Saiyajin concluída: Raditz, Nappa e Vegeta (backfill, grava v: 1 uma vez)", () => {
  const p = player({ completed: ["saga_saiyan_1", "saga_saiyan_2", "saga_saiyan_3", "saga_saiyan_4", "saga_saiyan_5"] });
  eq(mod.listDefeated(p).map((b) => b.id), ["dbe:raditz", "dbe:nappa", "dbe:vegeta"], "derrotados");
  eq(p.saved.v, 1, "versão");
  const w = p.writes;
  mod.listDefeated(p); mod.hasDefeated(p, "dbe:raditz");
  eq(p.writes, w, "escritas depois do backfill (só lê)");
});
test("3. backfill também pega objetivo concluído de missão em andamento (e não o que falta)", () => {
  const quest = { getAllObjectives: () => [objective(true, task("defeat_enemy", "dbe:guldo")), objective(false, task("defeat_enemy", "dbe:recoome"))] };
  const p = player({ active: [quest] });
  eq(mod.listDefeated(p).map((b) => b.id), ["dbe:guldo"], "derrotados");
});
test("4. abate de chefe marca e conta; não chefe e réplica (dbe:mental_replica) não", () => {
  const p = player();
  eq(mod.recordBossKill(p, entity("dbe:raditz")), true, "chefe");
  eq(mod.recordBossKill(p, entity("dbe:raditz")), true, "chefe de novo");
  eq(mod.recordBossKill(p, entity("dbe:saibaman")), false, "inimigo comum");
  eq(mod.recordBossKill(p, entity("dbe:nappa", ["dbe:mental_replica"])), false, "réplica");
  eq(mod.listDefeated(p).map((b) => [b.id, b.wins]), [["dbe:raditz", 2]], "registro");
  eq(mod.hasDefeated(p, "dbe:nappa"), false, "réplica não marca");
});
test("5. save já na versão 1 não refaz o backfill; chave nova 'progress' só", () => {
  const p = player({ saved: { v: 1, bosses: { "dbe:frieza": 3 } }, completed: ["saga_saiyan_1"] });
  eq(mod.listDefeated(p).map((b) => [b.id, b.wins]), [["dbe:frieza", 3]], "registro");
  eq(mod.SAVE_KEY, "progress", "chave");
});
test("6. entidade sem hasTag utilizável (inválida) não marca", () => {
  const p = player();
  eq(mod.recordBossKill(p, { typeId: "dbe:cell", hasTag() { throw new Error("inválida"); } }), false, "marcou");
});
test("7. luta de sobrevivência não entra no backfill: saga_beerus_1 concluída não marca o Beerus", () => {
  eq(mod.SURVIVAL_FIGHTS_COUNT, false, "flag");
  const p = player({ completed: ["saga_beerus_1"] });
  eq(mod.hasDefeated(p, "dbe:beerus_enemy"), false, "Beerus marcado");
  eq(mod.isSurvivalFight({ completeOnTimeout: true }, {}), true, "completeOnTimeout");
  eq(mod.isSurvivalFight({}, { entityDefinitions: { alwaysDodge: true } }), true, "alwaysDodge");
});
test("8. idem em missão em andamento: objetivo completeOnTimeout ou chefe alwaysDodge não marcam", () => {
  const timed = { isCompleted: true, objectiveData: { completeOnTimeout: true }, getTasks: () => [task("defeat_enemy", "dbe:frieza")] };
  const dodge = objective(true, task("defeat_enemy", "dbe:cell", { alwaysDodge: true }));
  const normal = objective(true, task("defeat_enemy", "dbe:dabura"));
  const p = player({ active: [{ getAllObjectives: () => [timed, dodge, normal] }] });
  eq(mod.listDefeated(p).map((b) => b.id), ["dbe:dabura"], "derrotados");
});
console.log(failed ? `\n${failed} caso(s) falharam.` : "\nOK: 8 casos.");
process.exit(failed ? 1 : 0);
