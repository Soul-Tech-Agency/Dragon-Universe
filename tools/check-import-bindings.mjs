// Confere que cada nome de import do index.js original (antes do O4.1) usado num arquivo do núcleo está ligado
// nesse arquivo (import ou declaração de topo). Pega um import que ficou para trás num movimento do O4.
// Uso: node tools/check-import-bindings.mjs <revisão de referência> [arquivos...]
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import * as acorn from "prettier/plugins/acorn";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const [rev, ...files] = process.argv.slice(2);
const orig = execFileSync("git", ["show", `${rev}:Dragon Universe_bp/scripts/index.js`], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
const importNames = new Set();
for (const st of acorn.parsers.acorn.parse(orig, {}).body)
  if (st.type === "ImportDeclaration") for (const sp of st.specifiers) importNames.add(sp.local.name);

let bad = 0;
for (const f of files) {
  const src = fs.readFileSync(path.resolve(ROOT, f), "utf8");
  const ast = acorn.parsers.acorn.parse(src, {});
  const bound = new Set();
  for (const st of ast.body) {
    if (st.type === "ImportDeclaration") st.specifiers.forEach((sp) => bound.add(sp.local.name));
    else if (st.type === "VariableDeclaration") st.declarations.forEach((d) => d.id.name && bound.add(d.id.name));
    else if (st.id?.name) bound.add(st.id.name);
  }
  // nomes locais (parâmetros e declarações dentro de funções/blocos), para não acusar sombra
  const locals = new Set();
  const used = new Map();
  const visit = (node, parent, key) => {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "Identifier") {
      const isProp = (parent?.type === "MemberExpression" && key === "property" && !parent.computed) ||
        ((parent?.type === "Property" || parent?.type === "PropertyDefinition" || parent?.type === "MethodDefinition") && key === "key" && !parent.computed && !parent.shorthand);
      const isLocalDecl = (parent?.type === "VariableDeclarator" && key === "id") || key === "params" || (parent?.type === "CatchClause" && key === "param");
      if (isLocalDecl) locals.add(node.name);
      else if (!isProp && importNames.has(node.name)) used.set(node.name, (used.get(node.name) ?? 0) + 1);
      return;
    }
    if (node.type === "ImportDeclaration") return;
    for (const [k, v] of Object.entries(node)) {
      if (k === "loc") continue;
      if (Array.isArray(v)) v.forEach((c) => visit(c, node, k));
      else if (v && typeof v.type === "string") visit(v, node, k);
    }
  };
  ast.body.forEach((s) => visit(s, null, null));
  const missing = [...used.keys()].filter((n) => !bound.has(n));
  const real = missing.filter((n) => !locals.has(n));
  const maybe = missing.filter((n) => locals.has(n));
  if (real.length) { bad++; console.log(`FALTA  ${f}: ${real.join(", ")}`); }
  if (maybe.length) console.log(`(sombra, conferir à mão) ${f}: ${maybe.join(", ")}`);
}
console.log(bad ? `${bad} arquivo(s) com import faltando.` : "OK: nenhum import faltando.");
process.exit(bad ? 1 : 0);
