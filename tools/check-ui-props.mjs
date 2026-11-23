// Verifica as propriedades de cada controle do JSON UI do RP contra a tabela por tipo de tools/ui/ui_props.json
// (o que o vanilla usa em cada tipo, mais os acréscimos provados no jogo).
// Motivo: o jogo só avisa no Content Log ("Unknown property [collection_index]" num label, "[collection_name]" num
// panel) e segue sem a propriedade. Nos testes de 23/11 (1.7.18 e 1.7.19) isso deixou telas inteiras vazias.
// Também falha com expressão (source_property_name) que usa #form_button_text sem "'§r' + " na frente: texto que
// começa com dígito vira número na expressão, e a subtração ou a comparação dá vazio ou falso (teste da 1.7.19).
// Uso: node tools/check-ui-props.mjs [pasta ui ...]   (sem argumentos: Dragon Universe_rp/ui)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RP, Report, isMain, readJson, rel, walk } from "./lib/common.mjs";

const TABLE = path.join(path.dirname(fileURLToPath(import.meta.url)), "ui", "ui_props.json");
const SKIP_FILES = new Set(["_ui_defs.json", "_global_variables.json"]);

export async function run(dirs = []) {
  const report = new Report("check-ui-props — propriedades por tipo de controle (JSON UI)");
  const table = JSON.parse(fs.readFileSync(TABLE, "utf8"));
  const allowed = Object.fromEntries(Object.entries(table.types).map(([t, props]) => [t, new Set(props)]));
  const roots = dirs.length ? dirs.map((d) => path.resolve(d)) : [path.join(RP, "ui")];

  // 1) todas as definições (namespace.nome -> { node, key, ns, file })
  const defs = new Map();
  const files = roots.flatMap((r) => walk(r, (f) => f.endsWith(".json") && !SKIP_FILES.has(path.basename(f))));
  for (const file of files) {
    const { data, error } = readJson(file);
    if (error || !data || typeof data !== "object") continue; // erro de sintaxe é do validate-json
    const ns = data.namespace;
    if (typeof ns !== "string") continue;
    for (const [key, node] of Object.entries(data)) {
      if (key === "namespace" || !node || typeof node !== "object" || Array.isArray(node)) continue;
      defs.set(`${ns}.${key.split("@")[0]}`, { node, key, ns, file });
    }
  }

  // 2) tipo de um controle: o próprio "type" ou o da definição herdada por @
  const typeOf = (ns, key, node, depth = 0) => {
    if (typeof node.type === "string") return node.type;
    const at = key.indexOf("@");
    if (at < 0 || depth > 40) return null;
    let ref = key.slice(at + 1);
    if (!ref.includes(".")) ref = `${ns}.${ref}`;
    const d = defs.get(ref);
    if (d) return typeOf(d.ns, d.key, d.node, depth + 1);
    return table.vanilla_refs[ref] ?? null;
  };

  let checked = 0;
  let untyped = 0;
  const bad = new Map(); // "arquivo: tipo.prop" -> { count, example }
  const rawText = new Map(); // "arquivo: expressão" -> { count, example }
  const RAW = /#form_button_text(?![A-Za-z0-9_])/g;
  const checkBindings = (node, file, where) => {
    if (!Array.isArray(node.bindings)) return;
    for (const b of node.bindings) {
      const expr = b && typeof b.source_property_name === "string" ? b.source_property_name : null;
      if (!expr) continue;
      for (const m of expr.matchAll(RAW)) {
        if (expr.slice(Math.max(0, m.index - 7), m.index) === "'§r' + ") continue;
        const id = `${rel(file)}: ${expr}`;
        const r = rawText.get(id) ?? { count: 0, example: where };
        r.count++;
        rawText.set(id, r);
        break;
      }
    }
  };
  const visit = (ns, key, node, file, where) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    const name = key.split("@")[0];
    const type = typeOf(ns, key, node);
    checkBindings(node, file, `${where}${name}`);
    if (type === null) untyped++;
    else if (!allowed[type]) {
      report.warn("Tipo de controle desconhecido", `${rel(file)}: ${where}${name} (type "${type}")`);
    } else {
      checked++;
      for (const prop of Object.keys(node)) {
        if (prop.startsWith("$") || allowed[type].has(prop)) continue;
        const id = `${rel(file)}: ${type}.${prop}`;
        const b = bad.get(id) ?? { count: 0, example: `${where}${name}` };
        b.count++;
        bad.set(id, b);
      }
    }
    if (Array.isArray(node.controls)) {
      for (const entry of node.controls) {
        if (!entry || typeof entry !== "object") continue;
        for (const [k, v] of Object.entries(entry)) visit(ns, k, v, file, `${where}${name}/`);
      }
    }
  };
  for (const { node, key, ns, file } of defs.values()) visit(ns, key, node, file, `${ns}.`);

  for (const [id, { count, example }] of bad) {
    report.error("Propriedade que o tipo não aceita (o jogo ignora e avisa no Content Log)", `${id} — ${count}× (ex.: ${example})`);
  }
  for (const [id, { count, example }] of rawText) {
    report.error("Expressão com #form_button_text sem \"'§r' + \" (texto com dígito no começo vira número)", `${id} — ${count}× (ex.: ${example})`);
  }
  report.summary = `${files.length} arquivos, ${checked} controles verificados, ${untyped} sem tipo conhecido (herdam de fora)`;
  return report;
}

if (isMain(import.meta.url)) (await run(process.argv.slice(2))).finish();
