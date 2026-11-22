// Teste do core-split-report --plan (sem Minecraft): um arquivo pequeno com 3 segmentos e planos válidos e inválidos.
// Uso: node tools/test-core-split-report.mjs   (sai com código 1 se algum caso falhar)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const tool = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "core-split-report.mjs");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "du-split-test-"));
const src = path.join(dir, "core.js");
// #0: entrada; #1: classe base e um efeito; #2: subclasse que usa a base na carga, var usada em chamada pelo #1
const baseSource = `import { world as w } from "@minecraft/server";
var util = { k: 1 };
import { system as s } from "@minecraft/server";
class Base { x = util.k; }
function useLater() { return later; }
s.runInterval(() => {}, 1);
import { system as s2 } from "@minecraft/server";
class Thing extends Base {}
var later = 3;
w.afterEvents.b.subscribe(() => {});
`;
const cases = [
  { name: "move todos os segmentos", plan: { "core/all.js": ["0-2"] }, exit: 2, out: /segmento 0 .* move todos os segmentos/ },
  { name: "move o segmento 0", plan: { "core/x.js": ["0"] }, exit: 2, out: /segmento 0 est/ },
  { name: "segmento repetido", plan: { "a.js": ["1"], "b.js": ["1-2"] }, exit: 2, out: /segmento 1 está em a\.js e em b\.js/ },
  { name: "segmento inexistente", plan: { "a.js": ["2-5"] }, exit: 2, out: /segmento 3 .*não existe/ },
  { name: "faixa malformada", plan: { "a.js": ["1-x"] }, exit: 2, out: /faixa "1-x"/ },
  { name: "de cima para baixo, com late", plan: { "a.js": ["1"], "b.js": ["2"] }, exit: 0,
    out: /LATE {2}util \(var, core\.js:2, core\.js\) ← core\.js:4 \(a\.js\)[\s\S]*LATE {2}later .*← core\.js:5 \(a\.js\)[\s\S]*Com a ligação tardia, a divisão mantém/ },
  { name: "módulo novo usa o original em tempo de chamada (vira LATE)", plan: { "a.js": ["1-2"] }, exit: 0, out: /LATE {2}util/ },
  { name: "recorte no meio", plan: { "b.js": ["2"] }, exit: 1, out: /NÃO AVALIADO .*Base[\s\S]*Causa provável: b\.js recorta/ },
  {
    name: "função do original chamada na carga de um módulo novo = 1 problema",
    source: `import { world as w } from "@minecraft/server";
function helper() { return 1; }
import { system as s } from "@minecraft/server";
var made = helper();
`,
    plan: { "a.js": ["1"] },
    exit: 1,
    out: /1 função\(ões\) do original usada\(s\) na carga\)[\s\S]*IMPORTA O ORIGINAL {2}core\.js:4 \(a\.js\): helper/,
  },
];
let failed = 0;
for (const c of cases) {
  fs.writeFileSync(src, c.source ?? baseSource);
  const planFile = path.join(dir, "plan.json");
  fs.writeFileSync(planFile, JSON.stringify(c.plan));
  const r = spawnSync(process.execPath, [tool, src, "--plan=" + planFile], { encoding: "utf8" });
  const out = (r.stdout ?? "") + (r.stderr ?? "");
  const ok = r.status === c.exit && c.out.test(out.replaceAll(dir + path.sep, ""));
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FALHA"} ${c.name} (código ${r.status}, esperado ${c.exit})${ok ? "" : "\n" + out}`);
}
fs.rmSync(dir, { recursive: true, force: true });
console.log(failed ? `${failed} caso(s) falharam.` : "Todos os casos passaram.");
process.exitCode = failed ? 1 : 0;
