// Aplica a ligação tardia do O4.0 (planos/O4_0_DETALHE.md §3) no index.js, a partir da lista LATE do
// core-split-report --plan: cada uso listado de um nome vira late.<nome>, e logo depois da instrução de topo que
// declara o nome entra bindLate("<nome>", () => <nome>);. Só os usos listados mudam (os do próprio segmento da
// declaração ou depois dele continuam diretos). Confere, linha a linha, que o número de usos achados é o listado.
// Uso: node tools/apply-late.mjs <saída do --plan> nome1,nome2,...   (edita Dragon Universe_bp/scripts/index.js)
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "prettier/plugins/acorn";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "Dragon Universe_bp", "scripts", "index.js");
const [planOut, namesArg] = process.argv.slice(2);
const names = new Set((namesArg ?? "").split(",").filter(Boolean));
if (!planOut || !names.size) {
  console.error("Uso: node tools/apply-late.mjs <saída do --plan> nome1,nome2,...");
  process.exit(2);
}

// nome → Map(linha → quantos usos)
const wanted = new Map();
for (const l of fs.readFileSync(planOut, "utf8").split("\n")) {
  const m = /^\s*LATE\s+(\S+) \([^)]*\) ← (.*)$/.exec(l);
  if (!m || !names.has(m[1])) continue;
  const lines = new Map();
  for (const r of m[2].matchAll(/:(\d+) \(/g)) lines.set(+r[1], (lines.get(+r[1]) ?? 0) + 1);
  wanted.set(m[1], lines);
}
for (const n of names) if (!wanted.has(n)) { console.error("nome sem LATE na saída: " + n); process.exit(2); }

const raw = fs.readFileSync(FILE, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const ast = acorn.parsers.acorn.parse(src, {});
const lineOf = (pos) => src.slice(0, pos).split("\n").length;

// identificadores que são referências (não chave de propriedade, não declaração)
const edits = []; // { start, end, text }
const found = new Map(); // nome → Map(linha → n)
function visit(node, parent, key) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "Identifier" && names.has(node.name)) {
    const isProp = (parent?.type === "MemberExpression" && key === "property" && !parent.computed) ||
      ((parent?.type === "Property" || parent?.type === "PropertyDefinition" || parent?.type === "MethodDefinition") && key === "key" && !parent.computed);
    const isDecl = (parent?.type === "VariableDeclarator" && key === "id") || (parent?.type === "FunctionDeclaration" && key === "id") ||
      (parent?.type === "ClassDeclaration" && key === "id") || (parent?.type === "ClassExpression" && key === "id");
    if (!isProp && !isDecl) {
      const ln = lineOf(node.start);
      const want = wanted.get(node.name).get(ln);
      if (want) {
        if (parent?.type === "Property" && parent.shorthand) throw new Error("uso abreviado {" + node.name + "} na linha " + ln);
        const f = found.get(node.name) ?? new Map();
        f.set(ln, (f.get(ln) ?? 0) + 1);
        found.set(node.name, f);
        edits.push({ start: node.start, end: node.end, text: "late." + node.name });
      }
    }
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === "loc" || k === "range") continue;
    if (Array.isArray(v)) v.forEach((c) => visit(c, node, k));
    else if (v && typeof v.type === "string") visit(v, node, k);
  }
}
visit(ast, null, null);

let bad = 0;
for (const [n, lines] of wanted) for (const [ln, k] of lines) {
  const got = found.get(n)?.get(ln) ?? 0;
  if (got !== k) { bad++; console.error(`${n} linha ${ln}: listado ${k}, achado ${got}`); }
}
if (bad) process.exit(1);

// bindLate depois da instrução de topo que declara cada nome
for (const n of names) {
  const stmt = ast.body.find((s) =>
    (s.type === "VariableDeclaration" && s.declarations.some((d) => d.id.type === "Identifier" && d.id.name === n)) ||
    ((s.type === "FunctionDeclaration" || s.type === "ClassDeclaration") && s.id?.name === n));
  if (!stmt) { console.error("declaração de topo não achada: " + n); process.exit(1); }
  edits.push({ start: stmt.end, end: stmt.end, text: `\nbindLate("${n}", () => ${n}); // O4.0: ligação tardia` });
}
edits.sort((a, b) => b.start - a.start || b.end - a.end);
let out = src;
for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
fs.writeFileSync(FILE, crlf ? out.replace(/\n/g, "\r\n") : out);
const total = [...found.values()].reduce((a, m) => a + [...m.values()].reduce((x, y) => x + y, 0), 0);
console.log(`late: ${total} uso(s) de ${names.size} nome(s): ${[...names].map((n) => n + " " + [...found.get(n).values()].reduce((x, y) => x + y, 0)).join(", ")}; bindLate: ${names.size}.`);
