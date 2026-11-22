// Move uma faixa contígua de segmentos do topo do index.js para um módulo novo (O4.1+ de
// planos/ARQUITETURA_OTIMIZACAO.md §O4 e planos/O4_0_DETALHE.md §7), SEM mudar o código movido.
//
// Uso: node tools/move-segments.mjs <arquivo novo, relativo a scripts/> <último segmento> [--dry-run]
//   Move os segmentos 1..N do index.js de AGORA (de cima para baixo: o segmento 0, o bloco de imports do topo, fica).
//   Depois de um movimento os segmentos são renumerados, e o próximo movimento começa de novo no segmento 1.
//
// O que faz:
// - o módulo novo recebe o texto dos segmentos como está, e:
//   - os imports que estavam dentro da faixa, com o caminho corrigido para a pasta nova;
//   - os imports de outros segmentos (cabeçalho, módulos já extraídos, late) cujos nomes a faixa usa, repetidos;
//   - export { … } de todos os nomes de topo declarados na faixa;
// - o index.js perde a faixa e ganha, no fim do bloco de imports do topo, import { nomes usados } from "<módulo>";
// - o contents.json do BP ganha o arquivo (CRLF preservado).
// A lista de nomes usados é um superconjunto (não olha escopo): sobra import sem uso, nunca falta.
// Antes de mover, rode o --plan do recorte (core-split-report) e confira 0 problemas; depois, compare-scripts na ordem.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "prettier/plugins/acorn";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const SCRIPTS = path.join(ROOT, "Dragon Universe_bp", "scripts");
const INDEX = path.join(SCRIPTS, "index.js");
const CONTENTS = path.join(ROOT, "Dragon Universe_bp", "contents.json");
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const [target, lastArg] = args.filter((a) => !a.startsWith("--"));
const last = Number(lastArg);
if (!target || !Number.isInteger(last) || last < 1 || !target.endsWith(".js")) {
  console.error("Uso: node tools/move-segments.mjs <arquivo novo, relativo a scripts/> <último segmento> [--dry-run]");
  process.exit(2);
}
const targetAbs = path.join(SCRIPTS, target);
if (fs.existsSync(targetAbs)) {
  console.error("o arquivo já existe: " + target);
  process.exit(2);
}

const raw = fs.readFileSync(INDEX, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const ast = acorn.parsers.acorn.parse(src, {});

// segmentos: a mesma regra do core-split-report (segmento 0 = só o bloco de imports do topo)
const segs = [];
ast.body.forEach((st, i) => {
  const prev = ast.body[i - 1];
  const headerEnds = segs.length === 1 && st.type !== "ImportDeclaration" && segs[0].every((x) => x.type === "ImportDeclaration");
  if (!segs.length || headerEnds || (st.type === "ImportDeclaration" && prev && prev.type !== "ImportDeclaration")) segs.push([]);
  segs.at(-1).push(st);
});
if (last >= segs.length) {
  console.error(`o index.js tem os segmentos 0..${segs.length - 1}; não dá para mover 1..${last} (o resto do arquivo precisa ficar)`);
  process.exit(2);
}
const header = segs[0];
const moved = segs.slice(1, last + 1).flat();
const movedSet = new Set(moved);
const start = moved[0].start, end = moved.at(-1).end;

// nomes ligados por import, fora da faixa: nome local → { source, imported | "*" | "default" }
const outsideImports = new Map();
for (const st of ast.body)
  if (st.type === "ImportDeclaration" && !movedSet.has(st))
    for (const sp of st.specifiers)
      outsideImports.set(sp.local.name, {
        source: st.source.value,
        imported: sp.type === "ImportNamespaceSpecifier" ? "*" : sp.type === "ImportDefaultSpecifier" ? "default" : sp.imported.name ?? sp.imported.value,
      });

// nomes de topo declarados (não import)
const topNames = (stmts) => {
  const out = [];
  for (const st of stmts) {
    if (st.type === "VariableDeclaration") for (const d of st.declarations) collectPattern(d.id, out);
    else if ((st.type === "FunctionDeclaration" || st.type === "ClassDeclaration") && st.id) out.push(st.id.name);
  }
  return out;
};
function collectPattern(p, out) {
  if (!p) return;
  if (p.type === "Identifier") out.push(p.name);
  else if (p.type === "ObjectPattern") p.properties.forEach((q) => collectPattern(q.value ?? q.argument, out));
  else if (p.type === "ArrayPattern") p.elements.forEach((q) => collectPattern(q, out));
  else if (p.type === "AssignmentPattern") collectPattern(p.left, out);
  else if (p.type === "RestElement") collectPattern(p.argument, out);
}
// identificadores usados (superconjunto: ignora escopo; pula chave de propriedade e nome de membro)
function usedNames(stmts) {
  const names = new Set();
  const visit = (node, parent, key) => {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "Identifier") {
      const isProp = (parent?.type === "MemberExpression" && key === "property" && !parent.computed) ||
        ((parent?.type === "Property" || parent?.type === "PropertyDefinition" || parent?.type === "MethodDefinition") && key === "key" && !parent.computed && !parent.shorthand);
      if (!isProp) names.add(node.name);
      return;
    }
    if (node.type === "ImportDeclaration") return;
    for (const [k, v] of Object.entries(node)) {
      if (k === "loc") continue;
      if (Array.isArray(v)) v.forEach((c) => visit(c, node, k));
      else if (v && typeof v.type === "string") visit(v, node, k);
    }
  };
  stmts.forEach((s) => visit(s, null, null));
  return names;
}

const declared = topNames(moved);
const declaredSet = new Set(declared);
const usedByMoved = usedNames(moved);
const rest = ast.body.filter((s) => !movedSet.has(s));
const restDeclared = new Set(topNames(rest));
const usedByRest = usedNames(rest);

// referências da faixa a nomes de topo que ficam no index.js (precisariam de late): aviso (superconjunto)
const toIndex = [...usedByMoved].filter((n) => restDeclared.has(n) && !declaredSet.has(n));

// imports repetidos no módulo novo
const rel = (spec) => {
  if (!spec.startsWith(".")) return spec;
  let r = path.relative(path.dirname(targetAbs), path.join(SCRIPTS, spec)).split(path.sep).join("/");
  return r.startsWith(".") ? r : "./" + r;
};
const bySource = new Map();
for (const n of usedByMoved) {
  if (declaredSet.has(n)) continue;
  const imp = outsideImports.get(n);
  if (!imp) continue;
  if (!bySource.has(imp.source)) bySource.set(imp.source, []);
  bySource.get(imp.source).push([n, imp.imported]);
}
const borrowed = [...bySource].map(([source, list]) => {
  const ns = list.filter(([, i]) => i === "*").map(([n]) => `import * as ${n} from "${rel(source)}";`);
  const def = list.filter(([, i]) => i === "default").map(([n]) => `import ${n} from "${rel(source)}";`);
  const named = list.filter(([, i]) => i !== "*" && i !== "default").sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([n, i]) => (i === n ? n : `${i} as ${n}`));
  return [...ns, ...def, ...(named.length ? [`import { ${named.join(", ")} } from "${rel(source)}";`] : [])].join("\n");
}).filter(Boolean);

// o texto da faixa, com os imports internos de caminho relativo corrigido
let body = src.slice(start, end);
const innerImports = moved.filter((s) => s.type === "ImportDeclaration" && s.source.value.startsWith("."));
for (const st of [...innerImports].sort((a, b) => b.start - a.start)) {
  const a = st.source.start - start, b = st.source.end - start;
  const quote = body[a];
  body = body.slice(0, a) + quote + rel(st.source.value) + quote + body.slice(b);
}

const segFrom = segs[1][0].loc.start.line, segTo = moved.at(-1).loc.end.line;
const moduleText =
  `// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–${last} de então, linhas ${segFrom}–${segTo}.\n` +
  `// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.\n` +
  (borrowed.length ? borrowed.join("\n") + "\n" : "") +
  body + "\n" +
  `export { ${declared.join(", ")} };\n`;

// index.js: tira a faixa e importa o módulo no fim do bloco de imports do topo
const importedBack = declared.filter((n) => usedByRest.has(n));
const spec = "./" + target.split(path.sep).join("/");
const importLine = importedBack.length ? `import { ${importedBack.join(", ")} } from "${spec}";` : `import "${spec}";`;
const headerEnd = src.indexOf("\n", header.at(-1).end); // fim da LINHA do último import (pode ter comentário)
let newIndex = src.slice(0, start).replace(/\n+$/, "\n") + src.slice(end).replace(/^\n+/, "");
newIndex = newIndex.slice(0, headerEnd) + "\n" + importLine + " // O4: movido do index.js" + newIndex.slice(headerEnd);

console.log(`segmentos 1–${last} (linhas ${segFrom}–${segTo}, ${segTo - segFrom + 1} linhas) → ${target}`);
console.log(`  declara ${declared.length} nome(s); o index.js importa de volta ${importedBack.length}; imports repetidos de ${borrowed.length} origem(ns)`);
if (toIndex.length) console.log(`  AVISO: nomes do index.js usados pela faixa (superconjunto; o --plan diz se algum é de verdade): ${toIndex.join(", ")}`);
if (dry) process.exit(0);

fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
fs.writeFileSync(targetAbs, crlf ? moduleText.replace(/\n/g, "\r\n") : moduleText);
fs.writeFileSync(INDEX, crlf ? newIndex.replace(/\n/g, "\r\n") : newIndex);
const c = fs.readFileSync(CONTENTS);
const anchor = Buffer.from('      {\r\n         "path" : "scripts/index.js"\r\n');
const at = c.indexOf(anchor);
if (at < 0) {
  console.error("contents.json: não achei a entrada do index.js para inserir antes dela; acrescente à mão: scripts/" + target);
} else {
  const entry = Buffer.from(`      {\r\n         "path" : "scripts/${target.split(path.sep).join("/")}"\r\n      },\r\n`);
  fs.writeFileSync(CONTENTS, Buffer.concat([c.subarray(0, at), entry, c.subarray(at)]));
}
console.log("  ok: " + target + ", index.js e contents.json");
