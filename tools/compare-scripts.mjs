// Compara o comportamento dos scripts de uma revisão do Git com o da pasta atual, sem Minecraft.
//
// Cada versão de Dragon Universe_bp/scripts/ é carregada com um @minecraft/server falso; tudo o que ela chama no
// "jogo" (inscrições em eventos, registros, intervalos, consultas...) é registrado, e os callbacks registrados
// também são executados. Se os dois registros forem idênticos, a mudança não alterou o que os scripts fazem nesse
// cenário. Serve para refatorações que não devem mudar a lógica (ex.: renomear variáveis do núcleo). Não substitui
// o teste no jogo: o ambiente falso não reproduz valores reais.
//
// Uso: node tools/compare-scripts.mjs [revisão] [--unordered] [--ignore=a,b,...]   (revisão padrão: HEAD)
//   A prova de um commit é SEMPRE contra o commit anterior a ele (com a mudança ainda não commitada, HEAD; depois do
//   commit, <commit>~1 com a pasta no próprio commit). Se qualquer lado não carregar ("ERRO ao carregar"), o resultado
//   é falha (código 1), mesmo que os dois registros sejam iguais.
//   --unordered   compara as chamadas como contagem (multiconjunto), sem a ordem. Para mudanças que movem código
//                 entre módulos e por isso mudam a ordem de avaliação, mas não o que é chamado.
//   --ignore=a,b  descarta as linhas que contêm qualquer um dos textos (ex.: system.runInterval,system.runTimeout),
//                 para mudanças que trocam de propósito o agendamento. Os cabeçalhos "== callback de ..." dessas
//                 chamadas também saem. Diga no commit o que foi ignorado e por quê.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { extractRevision, copyWorkingTree, runWithStub } from "./lib/scripts-snapshot.mjs";

const args = process.argv.slice(2);
const rev = args.find((a) => !a.startsWith("--")) ?? "HEAD";
const unordered = args.includes("--unordered");
const ignore = (args.find((a) => a.startsWith("--ignore=")) ?? "--ignore=").slice(9).split(",").map((s) => s.trim()).filter(Boolean);
const unknown = args.filter((a) => a.startsWith("--") && a !== "--unordered" && !a.startsWith("--ignore="));
if (unknown.length) {
  console.error("Opção desconhecida: " + unknown.join(" ") + "\nUso: node tools/compare-scripts.mjs [revisão] [--unordered] [--ignore=a,b,...]");
  process.exit(2);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "du-compare-"));
let a, b;
try {
  const before = path.join(work, "antes");
  const after = path.join(work, "depois");
  extractRevision(rev, before);
  copyWorkingTree(after);
  a = runWithStub(before, path.join(work, "antes.log"));
  b = runWithStub(after, path.join(work, "depois.log"));
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}

console.log(`${rev}: ${a.length} linhas · pasta atual: ${b.length} linhas · ${a.at(-2)} / ${b.at(-2)}`);
// Um lado que não carrega registra quase nada: dois registros "iguais" assim não provam nada.
const loadErrors = [["antes (" + rev + ")", a], ["depois (pasta atual)", b]].filter(([, log]) => log.some((l) => l.startsWith("ERRO ao carregar")));
for (const [side, log] of loadErrors) console.log(`ERRO: ${side} não carregou: ${log.find((l) => l.startsWith("ERRO ao carregar"))}`);
const keep = (line) => !ignore.some((t) => line.includes(t));
// a última linha útil ("callbacks executados: N") muda quando se ignora agendadores; fica fora da comparação
const body = (log) => log.filter((l) => l && !l.startsWith("callbacks executados: ")).filter(keep);
const mode = [unordered ? "sem ordem" : "na ordem", ignore.length ? "ignorando " + ignore.join(", ") : ""].filter(Boolean).join(", ");
if (unordered || ignore.length) console.log("Modo: " + mode);

const diffs = unordered ? multisetDiff(body(a), body(b)) : orderedDiff(ignore.length ? body(a) : a, ignore.length ? body(b) : b);
if (diffs) {
  console.log("DIFERENTE: o comportamento observado mudou.");
  process.exit(1);
}
if (loadErrors.length) {
  console.log("FALHOU: os scripts não carregaram; a comparação não vale como prova.");
  process.exit(1);
}
console.log(unordered ? "IDÊNTICO (sem ordem): as mesmas chamadas ao jogo, nas mesmas quantidades." : "IDÊNTICO: mesmas chamadas ao jogo, na mesma ordem.");

function orderedDiff(x, y) {
  const max = Math.max(x.length, y.length);
  let n = 0;
  for (let i = 0; i < max && n < 20; i++) {
    if (x[i] !== y[i]) {
      if (!n) console.log("Primeiras diferenças (linha: antes | depois):");
      console.log(`  ${i + 1}: ${x[i] ?? "(fim)"}  |  ${y[i] ?? "(fim)"}`);
      n++;
    }
  }
  return n;
}

function multisetDiff(x, y) {
  const count = new Map();
  for (const l of x) count.set(l, (count.get(l) ?? 0) + 1);
  for (const l of y) count.set(l, (count.get(l) ?? 0) - 1);
  const changed = [...count].filter(([, n]) => n !== 0);
  if (!changed.length) return 0;
  console.log(`Chamadas com contagem diferente (${changed.length}; +N = N vezes a mais antes, -N = N vezes a mais depois):`);
  for (const [line, n] of changed.slice(0, 20)) console.log(`  ${n > 0 ? "+" + n : n}  ${line}`);
  if (changed.length > 20) console.log(`  ... mais ${changed.length - 20}`);
  return changed.length;
}
