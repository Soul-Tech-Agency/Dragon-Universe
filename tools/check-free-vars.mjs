// Análise de escopo independente (Arquiteto, revisão do O4.1): lista identificadores livres (não ligados) por arquivo, em
// TODOS os caminhos (o stub do compare só executa alguns). Portão de cada movimento do O4 junto com o compare-scripts,
// no lugar da regra de "sombra" do check-import-bindings.
// Uso: node tools/check-free-vars.mjs [arquivos...]   (sem arquivos: todos os .js de Dragon Universe_bp/scripts)
//      sai com código 1 se houver nome livre.
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
const acorn = process.env.ACORN ? await import(process.env.ACORN) : await import("prettier/plugins/acorn");
const parse = (s) => acorn.parsers.acorn.parse(s, {});
const GLOBALS = new Set("globalThis undefined NaN Infinity Math JSON Object Array Number String Boolean Symbol BigInt Date RegExp Error TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError Promise Map Set WeakMap WeakSet WeakRef FinalizationRegistry Proxy Reflect ArrayBuffer SharedArrayBuffer DataView Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array parseInt parseFloat isNaN isFinite encodeURI encodeURIComponent decodeURI decodeURIComponent escape unescape console Atomics Intl eval Function arguments".split(" "));
function collectPattern(p, out) {
  if (!p) return;
  switch (p.type) {
    case "Identifier": out.push(p.name); break;
    case "ObjectPattern": for (const pr of p.properties) collectPattern(pr.type === "RestElement" ? pr.argument : pr.value, out); break;
    case "ArrayPattern": for (const e of p.elements) collectPattern(e, out); break;
    case "RestElement": collectPattern(p.argument, out); break;
    case "AssignmentPattern": collectPattern(p.left, out); break;
  }
}
// hoisting: declare vars/functions into function scope, let/const/class into block scope
function hoistVars(node, out, top = true) {
  if (!node || typeof node.type !== "string") return;
  if (!top && /Function/.test(node.type)) return;
  if (node.type === "VariableDeclaration" && node.kind === "var") for (const d of node.declarations) collectPattern(d.id, out);
  if (node.type === "FunctionDeclaration" && !top) return;
  for (const [k, v] of Object.entries(node)) {
    if (k === "loc" || k === "start" || k === "end") continue;
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === "string" && hoistVars(c, out, false));
    else if (v && typeof v.type === "string") hoistVars(v, out, false);
  }
}
function blockDecls(stmts) {
  const out = [];
  for (const s of stmts) {
    if (s.type === "VariableDeclaration" && s.kind !== "var") s.declarations.forEach((d) => collectPattern(d.id, out));
    else if (s.type === "ClassDeclaration" && s.id) out.push(s.id.name);
    else if (s.type === "FunctionDeclaration" && s.id) out.push(s.id.name);
    else if (s.type === "ImportDeclaration") s.specifiers.forEach((sp) => out.push(sp.local.name));
    else if ((s.type === "ExportNamedDeclaration" || s.type === "ExportDefaultDeclaration") && s.declaration) {
      const d = s.declaration;
      if (d.type === "VariableDeclaration") d.declarations.forEach((x) => collectPattern(x.id, out));
      else if (d.id) out.push(d.id.name);
    }
  }
  return out;
}
export function freeVars(src) {
  const ast = parse(src);
  const free = new Map();
  const scopes = [];
  const isBound = (n) => scopes.some((s) => s.has(n));
  const ref = (id) => { if (!isBound(id.name) && !GLOBALS.has(id.name)) free.set(id.name, (free.get(id.name) || 0) + 1); };
  const withScope = (names, fn) => { scopes.push(new Set(names)); try { fn(); } finally { scopes.pop(); } };
  function fnNode(n) {
    const names = [];
    if (n.type !== "ArrowFunctionExpression") names.push("arguments");
    if (n.type === "FunctionExpression" && n.id) names.push(n.id.name);
    n.params.forEach((p) => collectPattern(p, names));
    hoistVars(n.body, names, true);
    withScope(names, () => {
      n.params.forEach((p) => patternDefaults(p));
      if (n.body.type === "BlockStatement") withScope(blockDecls(n.body.body), () => n.body.body.forEach(walk));
      else walk(n.body);
    });
  }
  function patternDefaults(p) {
    if (!p) return;
    if (p.type === "AssignmentPattern") { walk(p.right); patternDefaults(p.left); }
    else if (p.type === "ObjectPattern") p.properties.forEach((pr) => { if (pr.type === "RestElement") patternDefaults(pr.argument); else { if (pr.computed) walk(pr.key); patternDefaults(pr.value); } });
    else if (p.type === "ArrayPattern") p.elements.forEach(patternDefaults);
    else if (p.type === "RestElement") patternDefaults(p.argument);
    else if (p.type === "MemberExpression") walk(p);
  }
  function walk(n) {
    if (!n || typeof n.type !== "string") return;
    switch (n.type) {
      case "Identifier": ref(n); return;
      case "FunctionDeclaration": case "FunctionExpression": case "ArrowFunctionExpression": fnNode(n); return;
      case "ClassDeclaration": case "ClassExpression":
        withScope(n.id ? [n.id.name] : [], () => { walk(n.superClass); n.body.body.forEach((m) => { if (m.computed) walk(m.key); if (m.type === "StaticBlock") withScope(blockDecls(m.body), () => m.body.forEach(walk)); else walk(m.value); }); });
        return;
      case "BlockStatement": withScope(blockDecls(n.body), () => n.body.forEach(walk)); return;
      case "StaticBlock": withScope(blockDecls(n.body), () => n.body.forEach(walk)); return;
      case "ForStatement": case "ForInStatement": case "ForOfStatement": {
        const init = n.init || n.left; const names = [];
        if (init && init.type === "VariableDeclaration" && init.kind !== "var") init.declarations.forEach((d) => collectPattern(d.id, names));
        withScope(names, () => { for (const k of ["init", "left", "test", "update", "right", "body"]) if (n[k]) walk(n[k]); });
        return;
      }
      case "CatchClause": { const names = []; collectPattern(n.param, names); withScope(names, () => walk(n.body)); return; }
      case "SwitchStatement": walk(n.discriminant); withScope(blockDecls(n.cases.flatMap((c) => c.consequent)), () => n.cases.forEach((c) => { walk(c.test); c.consequent.forEach(walk); })); return;
      case "VariableDeclaration": n.declarations.forEach((d) => { patternDefaults(d.id); walk(d.init); }); return;
      case "MemberExpression": walk(n.object); if (n.computed) walk(n.property); return;
      case "Property": if (n.computed) walk(n.key); walk(n.value); return;
      case "PropertyDefinition": case "MethodDefinition": if (n.computed) walk(n.key); walk(n.value); return;
      case "LabeledStatement": walk(n.body); return;
      case "BreakStatement": case "ContinueStatement": return;
      case "ImportDeclaration": return;
      case "ExportNamedDeclaration": if (n.declaration) walk(n.declaration); else if (!n.source) n.specifiers.forEach((s) => ref(s.local)); return;
      case "ExportDefaultDeclaration": walk(n.declaration); return;
      case "AssignmentExpression": if (n.left.type === "Identifier") ref(n.left); else patternDefaults(n.left), walkPatternRefs(n.left); walk(n.right); return;
      case "MetaProperty": return;
    }
    for (const [k, v] of Object.entries(n)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
      if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === "string") walk(v);
    }
  }
  function walkPatternRefs(p) { const names = []; collectPattern(p, names); names.forEach((nm) => ref({ name: nm })); }
  const top = [];
  hoistVars(ast, top, true);
  withScope([...top, ...blockDecls(ast.body)], () => ast.body.forEach(walk));
  return free;
}
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const SCRIPTS = path.join(ROOT, "Dragon Universe_bp", "scripts");
const files = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(SCRIPTS, { recursive: true }).filter((f) => f.endsWith(".js")).map((f) => path.join(SCRIPTS, f));
let total = 0;
for (const f of files) {
  const fv = freeVars(fs.readFileSync(f, "utf8"));
  if (fv.size) { total += fv.size; console.log("LIVRE " + f.split("/").slice(-2).join("/") + ": " + [...fv].map(([k, v]) => k + "×" + v).join(", ")); }
}
console.log(total ? total + " nome(s) livre(s)" : "OK: nenhum identificador livre");
process.exit(total ? 1 : 0);
