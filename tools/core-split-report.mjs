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
// Chamadas f() e new X() feitas na carga são seguidas até o corpo da função / o construtor (e campos de instância,
// e a superclasse): o que roda lá conta como carga. Chamadas de método (X.m()) não são seguidas.
//
// Uso: node tools/core-split-report.mjs [arquivo] [--json] [--only-problems] [--segment=N | --lines=A-B]
//      node tools/core-split-report.mjs [arquivo] --plan=<plano.json>
//   arquivo padrão: Dragon Universe_bp/scripts/index.js
//
// --plan: simula a divisão. O plano é um JSON { "core/util.js": ["1", "3-5"], ... } (arquivo novo → segmentos); os
// segmentos fora do plano ficam no arquivo original. Cada módulo novo importa os módulos dos quais usa nomes (em
// ordem do primeiro segmento) e o arquivo original importa todos os módulos novos (os imports sobem para o topo).
// A ordem de avaliação ES (busca em profundidade, cada módulo depois das dependências, ciclos cortados) é
// comparada com a de hoje (instruções em sequência). Acusa:
//   - NÃO AVALIADO: referência em tempo de carga (incluindo dentro de f()/new X() seguidos) a nome cuja declaração
//     ainda não rodou na ordem nova (var = undefined, let/const/class = erro). Funções declaradas não contam;
//   - ORDEM DE EFEITOS: instruções de topo com efeito (chamada, new, atribuição a membro: inscrições em eventos,
//     registros, intervalos) que trocam de ordem relativa;
//   - ATRIBUIÇÃO entre módulos (import é somente leitura).
// Também lista a LIGAÇÃO TARDIA necessária (fatia O4.0): usos, de outro módulo, de nomes declarados depois na ordem
// de hoje. Como import, eles fecham um ciclo e invertem a ordem de avaliação; como late.<nome> (objeto preenchido
// pelo módulo que declara), não. O plano é simulado de novo sem essas arestas para provar que a lista basta.
// Sai com código 1 se, mesmo com a ligação tardia, o plano causar problema.
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
const planArg = args.find((a) => a.startsWith("--plan="))?.slice(7);

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

/** nome de topo → { segment, stmt (índice da instrução de topo), kind: import|var|let|const|class|function, line } */
const top = new Map();
/** nome de topo → corpo que roda quando é chamado/instanciado: { kind: "fn"|"class", node } */
const defs = new Map();
const stmtIndex = new Map(ast.body.map((s, i) => [s, i]));
const stmtSegment = new Map();
let declaringStmt = 0;
const declare = (name, seg, kind, node) => {
  if (!top.has(name)) top.set(name, { segment: seg.index, stmt: declaringStmt, kind, line: line(node) });
  seg.declared.push(name);
};
for (const seg of segments) {
  for (const stmt of seg.statements) {
    declaringStmt = stmtIndex.get(stmt);
    stmtSegment.set(declaringStmt, seg.index);
    const decl = stmt.type.startsWith("Export") && stmt.declaration ? stmt.declaration : stmt;
    if (decl.type === "ImportDeclaration") {
      seg.imports.add(decl.source.value);
      for (const s of decl.specifiers) declare(s.local.name, seg, "import", s);
    } else if (decl.type === "VariableDeclaration") {
      for (const d of decl.declarations) {
        for (const n of patternNames(d.id)) declare(n, seg, decl.kind, d);
        if (d.id.type === "Identifier" && d.init) {
          if (/^(FunctionExpression|ArrowFunctionExpression)$/.test(d.init.type)) defs.set(d.id.name, { kind: "fn", node: d.init });
          else if (d.init.type === "ClassExpression") defs.set(d.id.name, { kind: "class", node: d.init });
        }
      }
    } else if (decl.type === "FunctionDeclaration" && decl.id) {
      declare(decl.id.name, seg, "function", decl);
      defs.set(decl.id.name, { kind: "fn", node: decl });
    } else if (decl.type === "ClassDeclaration" && decl.id) {
      declare(decl.id.name, seg, "class", decl);
      defs.set(decl.id.name, { kind: "class", node: decl });
    }
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

/**
 * Referências a nomes de topo, por instrução de topo do segmento. Em tempo de carga (evalTime), chamadas f() e
 * new X() a funções/classes de topo deste arquivo são seguidas: o corpo da função, ou o construtor e os campos de
 * instância da classe (e da superclasse), também roda na carga; as referências achadas lá ganham `via`.
 * Não segue chamadas de método (X.m()). `effects` = instruções de topo com efeito na carga (chamada, new, atribuição
 * a membro), cuja ordem relativa importa.
 */
function analyse(seg) {
  const refs = []; // { name, line, write, evalTime, stmt, via }
  const effects = new Set();
  let scopes = []; // pilha de Set
  let curStmt = 0, via, following = 0, followSeen = new Set();
  const isLocal = (name) => scopes.some((s) => s.has(name));
  const ref = (id, write, evalTime) => {
    if (!isLocal(id.name) && top.has(id.name)) refs.push({ name: id.name, line: line(id), write, evalTime, stmt: curStmt, via });
  };
  const follow = (name) => {
    const def = defs.get(name);
    if (!def || followSeen.has(name)) return;
    followSeen.add(name);
    const saved = scopes;
    const savedVia = via;
    scopes = [];
    via = via ?? name;
    following++;
    try {
      if (def.kind === "fn") fn(def.node, true);
      else cls(def.node, false, true);
    } finally {
      following--;
      scopes = saved;
      via = savedVia;
    }
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

  // bodyEval: o corpo roda agora (função chamada na carga)
  const fn = (n, bodyEval = false) => {
    const names = new Set(["arguments"]);
    if (n.type === "FunctionExpression" && n.id) names.add(n.id.name);
    for (const p of n.params) patternNames(p).forEach((x) => names.add(x));
    if (n.body.type === "BlockStatement") hoisted(n.body).forEach((x) => names.add(x));
    withScope(names, () => {
      for (const p of n.params) declPattern(p, bodyEval);
      if (n.body.type === "BlockStatement") withScope(blockNames(n.body.body), () => n.body.body.forEach((s) => visit(s, bodyEval)));
      else visit(n.body, bodyEval);
    });
  };

  // construct: a classe está sendo instanciada na carga (new X()): construtor e campos de instância rodam agora;
  // a definição em si (extends, campos estáticos) já foi visitada onde a classe é declarada.
  const cls = (n, evalTime, construct = false) => {
    const names = new Set(n.type === "ClassExpression" && n.id ? [n.id.name] : []);
    withScope(names, () => {
      if (construct) {
        if (n.superClass?.type === "Identifier" && !isLocal(n.superClass.name)) follow(n.superClass.name);
        for (const m of n.body.body) {
          if (m.type === "PropertyDefinition" && !m.static && m.value) visit(m.value, true);
          else if (m.type === "MethodDefinition" && m.kind === "constructor") fn(m.value, true);
        }
        return;
      }
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
      case "CallExpression":
      case "NewExpression":
        if (evalTime) {
          if (!following) effects.add(curStmt);
          if (n.callee.type === "Identifier" && !isLocal(n.callee.name)) follow(n.callee.name);
        }
        visit(n.callee, evalTime);
        return n.arguments.forEach((a) => visit(a, evalTime));
      case "AssignmentExpression":
        if (evalTime && !following && n.left.type === "MemberExpression") effects.add(curStmt);
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

  for (const stmt of seg.statements) {
    curStmt = stmtIndex.get(stmt);
    followSeen = new Set();
    visit(stmt, true);
  }
  return { refs, effects };
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

const analysed = new Map(); // segmento → { refs, effects }
const analysis = (seg) => {
  if (!analysed.has(seg.index)) analysed.set(seg.index, analyse(seg));
  return analysed.get(seg.index);
};

const results = pick.map((seg) => {
  const { refs } = analysis(seg);
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
      forward.push({ name: r.name, line: r.line, declaredIn: d.segment, kind: d.kind, declaredLine: d.line, via: r.via });
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

if (planArg) {
  process.exitCode = simulatePlan(JSON.parse(fs.readFileSync(path.resolve(planArg), "utf8")));
} else if (json) {
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
    for (const f of r.forwardEvalRefs) console.log(`    ADIANTADA   linha ${f.line}: ${f.name} (${f.kind} do #${f.declaredIn}, linha ${f.declaredLine})${f.via ? " [na carga, via " + f.via + "()]" : ""}`);
  }
}

// ---------------------------------------------------------------- --plan: simulação da divisão

function simulatePlan(plan) {
  const original = path.basename(file);
  const moduleOf = new Map(); // segmento → arquivo
  for (const [target, specs] of Object.entries(plan))
    for (const spec of [].concat(specs)) {
      const [a, b = a] = String(spec).split("-").map(Number);
      for (let i = a; i <= b; i++) {
        if (!segments[i]) throw new Error(`plano: segmento ${i} não existe (há ${segments.length})`);
        if (moduleOf.has(i)) throw new Error(`plano: segmento ${i} está em ${moduleOf.get(i)} e em ${target}`);
        moduleOf.set(i, target);
      }
    }
  for (const seg of segments) if (!moduleOf.has(seg.index)) moduleOf.set(seg.index, original);
  const modules = new Map(); // arquivo → { segments: [], deps: Set }
  for (const seg of segments) {
    const m = moduleOf.get(seg.index);
    if (!modules.has(m)) modules.set(m, { segments: [], deps: new Set() });
    modules.get(m).segments.push(seg.index);
  }

  // referências entre módulos (imports externos não contam)
  const allRefs = [];
  for (const seg of segments) {
    const { refs } = analysis(seg);
    for (const r of refs) {
      const d = top.get(r.name);
      if (d.kind === "import") continue;
      allRefs.push({ ...r, decl: d, from: moduleOf.get(stmtSegment.get(r.stmt)), to: moduleOf.get(d.segment) });
    }
  }
  const firstSeg = (m) => modules.get(m).segments[0];
  const where = (st) => `index.js:${ast.body[st].loc.start.line} (#${stmtSegment.get(st)}, ${moduleOf.get(stmtSegment.get(st))})`;

  // LIGAÇÃO TARDIA: uso, de outro módulo, de um nome declarado DEPOIS na ordem de hoje. Como import, essa aresta
  // fecha um ciclo contra a ordem original e o ES passa a avaliar o módulo posterior primeiro. Se ela virar
  // `late.nome` (um objeto de ligações que o módulo posterior preenche ao declarar o nome), o import some e a ordem
  // volta a ser a de hoje. Só é possível porque esses usos rodam depois da carga (chamada); um uso posterior em
  // tempo de carga já é problema hoje ("JÁ HOJE").
  // Só usos em tempo de chamada (em carga, late não ajuda) e vindos de um módulo novo (o arquivo original importa
  // todos os módulos novos de qualquer forma e roda por último).
  const isLate = (r) => !r.evalTime && r.from !== r.to && r.from !== original && r.decl.stmt > r.stmt;
  const lateRefs = allRefs.filter(isLate);

  const evaluate = (useLate) => {
    const deps = new Map([...modules.keys()].map((m) => [m, new Set()]));
    for (const r of allRefs) if (r.from !== r.to && !(useLate && isLate(r))) deps.get(r.from).add(r.to);
    for (const m of modules.keys()) if (m !== original) deps.get(original).add(m);
    // ordem de avaliação ES: DFS a partir do arquivo original; imports em ordem do primeiro segmento do módulo
    const state = new Map(), order = [];
    const visitModule = (m) => {
      if (state.has(m)) return;
      state.set(m, "visiting");
      for (const d of [...deps.get(m)].sort((x, y) => firstSeg(x) - firstSeg(y))) visitModule(d);
      state.set(m, "done");
      order.push(m);
    };
    visitModule(original);
    const stmtOrder = [];
    for (const m of order) for (const si of modules.get(m).segments) for (const st of segments[si].statements) stmtOrder.push(stmtIndex.get(st));
    const pos = new Map(stmtOrder.map((x, i) => [x, i]));
    const problems = { notEvaluated: [], effects: [], writes: [] };
    const seen = new Set();
    for (const r of allRefs) {
      if (r.write && r.from !== r.to && !(useLate && isLate(r))) problems.writes.push(r);
      if (!r.evalTime || r.decl.kind === "function" || r.decl.stmt === r.stmt) continue;
      if (pos.get(r.decl.stmt) < pos.get(r.stmt)) continue;
      const k = r.name + "@" + r.line;
      if (seen.has(k)) continue;
      seen.add(k);
      // já quebrado hoje (a declaração vem depois mesmo sem dividir): aparece à parte e não conta como causado pelo plano
      problems.notEvaluated.push({ ...r, preexisting: r.decl.stmt > r.stmt });
    }
    const effectful = [];
    for (const seg of segments) for (const st of analysis(seg).effects) effectful.push(st);
    effectful.sort((a, b) => a - b);
    for (let i = 1; i < effectful.length; i++) if (pos.get(effectful[i - 1]) > pos.get(effectful[i])) problems.effects.push({ before: effectful[i - 1], after: effectful[i] });
    const caused = problems.notEvaluated.filter((r) => !r.preexisting).length + problems.effects.length + problems.writes.length;
    return { order, problems, caused };
  };

  const before = evaluate(false);
  const after = evaluate(true);
  const lateByName = new Map();
  for (const r of lateRefs) {
    if (!lateByName.has(r.name)) lateByName.set(r.name, { decl: r.decl, to: r.to, uses: [] });
    const u = lateByName.get(r.name).uses;
    if (!u.some((x) => x.line === r.line && x.from === r.from)) u.push({ line: r.line, from: r.from });
  }

  if (json) {
    console.log(JSON.stringify({ plan, evaluationOrder: before.order, problems: before.problems,
      late: [...lateByName].map(([name, v]) => ({ name, declaredIn: v.to, declaredLine: v.decl.line, kind: v.decl.kind, uses: v.uses })),
      withLate: { evaluationOrder: after.order, problems: after.problems } }, null, 2));
    return after.caused ? 1 : 0;
  }
  const print = (title, res) => {
    const nv = res.problems.notEvaluated.filter((r) => !r.preexisting).length;
    console.log(`${title}: ordem ES ${res.order.join(" → ")}; problemas causados: ${res.caused} (${nv} não avaliado(s), ${res.problems.effects.length} troca(s) de ordem de efeitos, ${res.problems.writes.length} atribuição(ões) entre módulos).`);
    for (const r of res.problems.notEvaluated.slice(0, 40))
      console.log(`  ${r.preexisting ? "JÁ HOJE     " : "NÃO AVALIADO"}  index.js:${r.line} (${r.from}): ${r.name} (${r.decl.kind}, index.js:${r.decl.line}, ${r.to})${r.via ? " [via " + r.via + "()]" : ""}`);
    if (res.problems.notEvaluated.length > 40) console.log(`  ... mais ${res.problems.notEvaluated.length - 40}`);
    for (const e of res.problems.effects.slice(0, 40)) console.log(`  ORDEM DE EFEITOS  ${where(e.before)} passa a rodar depois de ${where(e.after)}`);
    for (const w of res.problems.writes.slice(0, 40)) console.log(`  ATRIBUIÇÃO  index.js:${w.line} (${w.from}): ${w.name} (declarado em ${w.to}, index.js:${w.decl.line})`);
  };
  console.log(`Plano: ${modules.size - 1} módulo(s) novo(s), ${segments.filter((x) => moduleOf.get(x.index) !== original).length} de ${segments.length} segmentos movidos.\n`);
  print("1. Só com imports", before);
  console.log(`\n2. Ligação tardia necessária (O4.0): ${lateRefs.length} referência(s) a ${lateByName.size} nome(s) declarados depois na ordem de hoje.`);
  console.log("   Cada nome vira late.<nome>, preenchido pelo módulo que o declara; cada uso abaixo passa a ler late.<nome>.");
  for (const [name, v] of [...lateByName].sort((a, b) => a[1].decl.line - b[1].decl.line))
    console.log(`  LATE  ${name} (${v.decl.kind}, index.js:${v.decl.line}, ${v.to}) ← ${v.uses.map((u) => `index.js:${u.line} (${u.from})`).join(", ")}`);
  console.log("");
  print("3. Com a ligação tardia acima", after);
  if (!after.caused) console.log("\nCom a ligação tardia, a divisão mantém a ordem de avaliação e de efeitos de hoje.");
  else {
    console.log("\nAinda há problemas com a ligação tardia (late só resolve usos em tempo de chamada).");
    // o arquivo original roda depois de TODOS os módulos novos: se ele guarda segmentos anteriores a um módulo novo,
    // o código de carga desse módulo roda antes deles
    const origSegs = modules.get(original)?.segments ?? [];
    const early = [...modules.keys()].filter((m) => m !== original && origSegs.some((si) => si < firstSeg(m)));
    if (early.length)
      console.log(`  Causa provável: ${early.join(", ")} recorta(m) o meio do arquivo; os segmentos anteriores (#${origSegs[0]}…#${Math.max(...origSegs.filter((si) => early.some((m) => si < firstSeg(m))))}) ficam em ${original}, que roda por último. Extraia também os segmentos anteriores (de cima para baixo) ou leve o código de carga do recorte para uma função de init chamada pelo ${original}.`);
    else console.log("  Causa provável: segmentos não contíguos num mesmo módulo, ou efeito de topo que precisa ir para uma função de init.");
  }
  return after.caused ? 1 : 0;
}
