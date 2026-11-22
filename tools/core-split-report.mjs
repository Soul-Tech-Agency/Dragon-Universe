// Relatório para dividir o núcleo (index.js) em módulos (fatia O0/O4 de planos/ARQUITETURA_OTIMIZACAO.md).
//
// O bundler emitiu os módulos-fonte em sequência e deixou os `import` de cada um no meio do arquivo. Cada bloco de
// imports que vem depois de código abre um "segmento" (a costura natural para cortar). Para cada segmento o relatório
// lista os nomes de topo declarados, de quais segmentos ele usa nomes, e os dois problemas que impedem mover o
// segmento para um módulo ES sem mudar o código antes:
//   - ATRIBUIÇÃO a um nome de topo declarado em outro segmento (ex.: `kE = 10`): um import é somente leitura;
//   - REFERÊNCIA ADIANTADA EM TEMPO DE AVALIAÇÃO: código que roda ao carregar (fora de funções: inicializadores,
//     `extends`, campos estáticos, chamadas de topo) usando um nome de um segmento POSTERIOR. Em módulos separados a
//     ordem de avaliação pode mudar; `class`/`let`/`const` dão TDZ e `var` vale undefined. Funções declaradas
//     (`function f`) são içadas e não contam.
// Também lista os imports usados fora do segmento que os declara (o módulo novo terá de importar de novo).
// Limite: chamadas de topo a funções do próprio arquivo executam o corpo delas na carga; o corpo não é seguido.
//
// Uso: node tools/core-split-report.mjs [arquivo] [--json] [--only-problems] [--segment=N | --lines=A-B]
//   arquivo padrão: Dragon Universe_bp/scripts/index.js
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "prettier/plugins/acorn";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const file = path.resolve(ROOT, args.find((a) => !a.startsWith("--")) ?? "Dragon Universe_bp/scripts/index.js");
const json = args.includes("--json");
const onlyProblems = args.includes("--only-problems");
const segArg = args.find((a) => a.startsWith("--segment="))?.slice(10);
const linesArg = args.find((a) => a.startsWith("--lines="))?.slice(8);

const source = fs.readFileSync(file, "utf8");
const ast = acorn.parsers.acorn.parse(source, {});
const line = (node) => node.loc.start.line;
const shown = path.relative(ROOT, file).startsWith("..") ? file : path.relative(ROOT, file);

// ---------------------------------------------------------------- segmentos e nomes de topo

const segments = [];
ast.body.forEach((stmt, i) => {
  const prev = ast.body[i - 1];
  if (!segments.length || (stmt.type === "ImportDeclaration" && prev && prev.type !== "ImportDeclaration"))
    segments.push({ index: segments.length, statements: [], from: line(stmt), to: line(stmt), declared: [], imports: new Set() });
  const seg = segments.at(-1);
  seg.statements.push(stmt);
  seg.to = stmt.loc.end.line;
});

/** nome de topo → { segment, kind: import|var|let|const|class|function, line } */
const top = new Map();
const declare = (name, seg, kind, node) => {
  if (!top.has(name)) top.set(name, { segment: seg.index, kind, line: line(node) });
  seg.declared.push(name);
};
for (const seg of segments) {
  for (const stmt of seg.statements) {
    const decl = stmt.type.startsWith("Export") && stmt.declaration ? stmt.declaration : stmt;
    if (decl.type === "ImportDeclaration") {
      seg.imports.add(decl.source.value);
      for (const s of decl.specifiers) declare(s.local.name, seg, "import", s);
    } else if (decl.type === "VariableDeclaration") {
      for (const d of decl.declarations) for (const n of patternNames(d.id)) declare(n, seg, decl.kind, d);
    } else if (decl.type === "FunctionDeclaration" && decl.id) declare(decl.id.name, seg, "function", decl);
    else if (decl.type === "ClassDeclaration" && decl.id) declare(decl.id.name, seg, "class", decl);
  }
}

// ---------------------------------------------------------------- escopos e referências

function patternNames(p, out = []) {
  if (!p) return out;
  if (p.type === "Identifier") out.push(p.name);
  else if (p.type === "ObjectPattern") for (const q of p.properties) patternNames(q.type === "RestElement" ? q.argument : q.value, out);
  else if (p.type === "ArrayPattern") for (const q of p.elements) patternNames(q, out);
  else if (p.type === "RestElement") patternNames(p.argument, out);
  else if (p.type === "AssignmentPattern") patternNames(p.left, out);
  return out;
}

/** Nomes `var` e funções içados num corpo de função (sem entrar em funções aninhadas). */
function hoisted(body, out = new Set()) {
  const visit = (n) => {
    if (!n || typeof n.type !== "string") return;
    if (/Function/.test(n.type) && n !== body) {
      if (n.type === "FunctionDeclaration" && n.id) out.add(n.id.name);
      return;
    }
    if (n.type === "VariableDeclaration" && n.kind === "var") for (const d of n.declarations) patternNames(d.id).forEach((x) => out.add(x));
    if (n.type === "ClassExpression" || n.type === "ClassDeclaration") return;
    for (const k of Object.keys(n)) {
      if (k === "loc" || k === "range") continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v.type === "string") visit(v);
    }
  };
  visit(body);
  return out;
}

/** Declarações léxicas diretas de um bloco (let/const/class/function). */
function blockNames(statements) {
  const out = new Set();
  for (const s of statements) {
    if (s.type === "VariableDeclaration" && s.kind !== "var") for (const d of s.declarations) patternNames(d.id).forEach((x) => out.add(x));
    if ((s.type === "ClassDeclaration" || s.type === "FunctionDeclaration") && s.id) out.add(s.id.name);
  }
  return out;
}

function analyse(seg) {
  const refs = []; // { name, line, write, evalTime }
  const scopes = []; // pilha de Set
  const isLocal = (name) => scopes.some((s) => s.has(name));
  const ref = (id, write, evalTime) => {
    if (!isLocal(id.name) && top.has(id.name)) refs.push({ name: id.name, line: line(id), write, evalTime });
  };
  const withScope = (names, fn) => {
    scopes.push(names);
    try {
      fn();
    } finally {
      scopes.pop();
    }
  };

  // escreve nomes de um padrão de atribuição (não declaração) e visita defaults/chaves computadas
  const assignPattern = (p, evalTime) => {
    if (!p) return;
    if (p.type === "Identifier") ref(p, true, evalTime);
    else if (p.type === "ObjectPattern")
      for (const q of p.properties) {
        if (q.type === "RestElement") assignPattern(q.argument, evalTime);
        else {
          if (q.computed) visit(q.key, evalTime);
          assignPattern(q.value, evalTime);
        }
      }
    else if (p.type === "ArrayPattern") p.elements.forEach((q) => assignPattern(q, evalTime));
    else if (p.type === "RestElement") assignPattern(p.argument, evalTime);
    else if (p.type === "AssignmentPattern") {
      assignPattern(p.left, evalTime);
      visit(p.right, evalTime);
    } else visit(p, evalTime); // alvo membro: a.b = …
  };
  // padrões de declaração: só defaults e chaves computadas são expressões
  const declPattern = (p, evalTime) => {
    if (!p || p.type === "Identifier") return;
    if (p.type === "ObjectPattern")
      for (const q of p.properties) {
        if (q.type === "RestElement") declPattern(q.argument, evalTime);
        else {
          if (q.computed) visit(q.key, evalTime);
          declPattern(q.value, evalTime);
        }
      }
    else if (p.type === "ArrayPattern") p.elements.forEach((q) => declPattern(q, evalTime));
    else if (p.type === "RestElement") declPattern(p.argument, evalTime);
    else if (p.type === "AssignmentPattern") {
      declPattern(p.left, evalTime);
      visit(p.right, evalTime);
    }
  };

  const fn = (n) => {
    const names = new Set(["arguments"]);
    if (n.type === "FunctionExpression" && n.id) names.add(n.id.name);
    for (const p of n.params) patternNames(p).forEach((x) => names.add(x));
    if (n.body.type === "BlockStatement") hoisted(n.body).forEach((x) => names.add(x));
    withScope(names, () => {
      for (const p of n.params) declPattern(p, false);
      if (n.body.type === "BlockStatement") withScope(blockNames(n.body.body), () => n.body.body.forEach((s) => visit(s, false)));
      else visit(n.body, false);
    });
  };

  const cls = (n, evalTime) => {
    const names = new Set(n.type === "ClassExpression" && n.id ? [n.id.name] : []);
    withScope(names, () => {
      if (n.superClass) visit(n.superClass, evalTime);
      for (const m of n.body.body) {
        if (m.computed) visit(m.key, evalTime);
        if (m.type === "MethodDefinition") fn(m.value);
        else if (m.type === "PropertyDefinition") {
          if (m.value) visit(m.value, m.static ? evalTime : false);
        } else if (m.type === "StaticBlock") withScope(blockNames(m.body), () => m.body.forEach((s) => visit(s, evalTime)));
      }
    });
  };

  function visit(n, evalTime) {
    if (!n || typeof n.type !== "string") return;
    switch (n.type) {
      case "Identifier":
        return ref(n, false, evalTime);
      case "ImportDeclaration":
      case "ExportAllDeclaration":
        return;
      case "ExportNamedDeclaration":
        if (n.declaration) return visit(n.declaration, evalTime);
        for (const s of n.specifiers) if (!n.source) ref(s.local, false, evalTime);
        return;
      case "ExportDefaultDeclaration":
        return visit(n.declaration, evalTime);
      case "MemberExpression":
        visit(n.object, evalTime);
        if (n.computed) visit(n.property, evalTime);
        return;
      case "Property":
        if (n.computed) visit(n.key, evalTime);
        if (n.value.type === "FunctionExpression") return fn(n.value);
        return visit(n.value, evalTime);
      case "LabeledStatement":
        return visit(n.body, evalTime);
      case "BreakStatement":
      case "ContinueStatement":
      case "MetaProperty":
      case "Super":
      case "ThisExpression":
      case "Literal":
      case "TemplateElement":
        return;
      case "VariableDeclaration":
        for (const d of n.declarations) {
          declPattern(d.id, evalTime);
          visit(d.init, evalTime);
        }
        return;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        return fn(n);
      case "ClassDeclaration":
      case "ClassExpression":
        return cls(n, evalTime);
      case "AssignmentExpression":
        assignPattern(n.left, evalTime);
        return visit(n.right, evalTime);
      case "UpdateExpression":
        return n.argument.type === "Identifier" ? ref(n.argument, true, evalTime) : visit(n.argument, evalTime);
      case "BlockStatement":
      case "StaticBlock":
        return withScope(blockNames(n.body), () => n.body.forEach((s) => visit(s, evalTime)));
      case "ForStatement":
      case "ForInStatement":
      case "ForOfStatement": {
        const head = n.init ?? n.left;
        const names = head && head.type === "VariableDeclaration" && head.kind !== "var" ? new Set(head.declarations.flatMap((d) => patternNames(d.id))) : new Set();
        return withScope(names, () => {
          if (n.type === "ForStatement") {
            visit(n.init, evalTime);
            visit(n.test, evalTime);
            visit(n.update, evalTime);
          } else {
            if (n.left.type === "VariableDeclaration") visit(n.left, evalTime);
            else assignPattern(n.left, evalTime);
            visit(n.right, evalTime);
          }
          visit(n.body, evalTime);
        });
      }
      case "CatchClause":
        return withScope(new Set(patternNames(n.param)), () => {
          declPattern(n.param, evalTime);
          visit(n.body, evalTime);
        });
      case "SwitchStatement":
        visit(n.discriminant, evalTime);
        return withScope(blockNames(n.cases.flatMap((c) => c.consequent)), () => n.cases.forEach((c) => visit(c, evalTime)));
      default:
        for (const k of Object.keys(n)) {
          if (k === "loc" || k === "range" || k === "type" || k === "start" || k === "end") continue;
          const v = n[k];
          if (Array.isArray(v)) v.forEach((x) => visit(x, evalTime));
          else if (v && typeof v.type === "string") visit(v, evalTime);
        }
    }
  }

  for (const stmt of seg.statements) visit(stmt, true);
  return refs;
}

// ---------------------------------------------------------------- relatório

const pick = segments.filter((s) => {
  if (segArg !== undefined) return s.index === Number(segArg);
  if (linesArg) {
    const [a, b] = linesArg.split("-").map(Number);
    return s.to >= a && s.from <= b;
  }
  return true;
});

const results = pick.map((seg) => {
  const refs = analyse(seg);
  const uses = new Map(); // segmento → Set(nomes)
  const borrowedImports = new Set();
  const writes = [], forward = [];
  for (const r of refs) {
    const d = top.get(r.name);
    if (d.segment === seg.index) continue;
    if (d.kind === "import") {
      borrowedImports.add(r.name);
      continue;
    }
    if (!uses.has(d.segment)) uses.set(d.segment, new Set());
    uses.get(d.segment).add(r.name);
    if (r.write) writes.push({ name: r.name, line: r.line, declaredIn: d.segment, declaredLine: d.line });
    if (r.evalTime && d.segment > seg.index && d.kind !== "function")
      forward.push({ name: r.name, line: r.line, declaredIn: d.segment, kind: d.kind, declaredLine: d.line });
  }
  return {
    segment: seg.index,
    lines: [seg.from, seg.to],
    imports: [...seg.imports],
    declared: seg.declared.filter((n) => top.get(n)?.kind !== "import").length,
    usesSegments: Object.fromEntries([...uses].sort((a, b) => a[0] - b[0]).map(([k, v]) => [k, [...v].sort()])),
    borrowedImports: [...borrowedImports].sort(),
    crossWrites: dedupe(writes),
    forwardEvalRefs: dedupe(forward),
  };
});

function dedupe(list) {
  const seen = new Set();
  return list.filter((x) => {
    const k = x.name + "@" + x.line;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

if (json) {
  console.log(JSON.stringify({ file: shown, segments: segments.length, topLevelNames: top.size, results }, null, 2));
} else {
  const writes = results.reduce((n, r) => n + r.crossWrites.length, 0);
  const forward = results.reduce((n, r) => n + r.forwardEvalRefs.length, 0);
  console.log(`${shown}: ${source.split("\n").length} linhas, ${segments.length} segmentos (costuras de import), ${top.size} nomes de topo.`);
  console.log(`Problemas para extrair: ${writes} atribuições entre segmentos, ${forward} referências adiantadas em tempo de avaliação.\n`);
  for (const r of results) {
    const problems = r.crossWrites.length + r.forwardEvalRefs.length;
    if (onlyProblems && !problems) continue;
    const deps = Object.entries(r.usesSegments);
    console.log(`#${r.segment}  linhas ${r.lines[0]}–${r.lines[1]}  ·  ${r.declared} declarações  ·  importa: ${r.imports.join(", ") || "—"}`);
    if (!onlyProblems) {
      if (deps.length) console.log("    usa de: " + deps.map(([s, names]) => `#${s} (${names.length}: ${names.slice(0, 6).join(", ")}${names.length > 6 ? ", …" : ""})`).join("; "));
      if (r.borrowedImports.length) console.log("    imports de outro segmento: " + r.borrowedImports.join(", "));
    }
    for (const w of r.crossWrites) console.log(`    ATRIBUIÇÃO  linha ${w.line}: ${w.name} (declarado no #${w.declaredIn}, linha ${w.declaredLine})`);
    for (const f of r.forwardEvalRefs) console.log(`    ADIANTADA   linha ${f.line}: ${f.name} (${f.kind} do #${f.declaredIn}, linha ${f.declaredLine})`);
  }
}
