// Cópias de Dragon Universe_bp/scripts/ (de uma revisão do Git ou da pasta atual) e execução com o
// @minecraft/server falso (lib/run-with-stub.mjs). Compartilhado por compare-scripts e measure-scripts.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

export const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..", "..");
export const SCRIPTS = "Dragon Universe_bp/scripts";
// revisões anteriores a 2026-10-16 usam o nome antigo da pasta do Behavior Pack
const OLD_SCRIPTS = "Dragon Block_bp/scripts";
const runner = path.join(ROOT, "tools", "lib", "run-with-stub.mjs");

/** Copia os scripts da revisão `rev` para `target`, sem mexer na pasta de trabalho. */
export function extractRevision(rev, target) {
  const list = (dir) => execFileSync("git", ["ls-tree", "-r", "--name-only", rev, "--", dir], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  let base = SCRIPTS;
  let files = list(SCRIPTS);
  if (!files.length) {
    base = OLD_SCRIPTS;
    files = list(OLD_SCRIPTS);
  }
  if (!files.length) throw new Error(`nenhum arquivo de ${SCRIPTS} na revisão ${rev}`);
  for (const f of files) {
    const dest = path.join(target, path.relative(base, f));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, execFileSync("git", ["show", `${rev}:${f}`], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }));
  }
}

// fs.cpSync encerra o processo sem erro em caminhos com acento no Windows (Node 22); cópia manual
export function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.writeFileSync(b, fs.readFileSync(a));
  }
}

/** Copia a pasta atual de scripts para `target`. */
export function copyWorkingTree(target) {
  copyDir(path.join(ROOT, SCRIPTS), target);
}

/** Executa a cópia com o stub e devolve as linhas do registro de chamadas. */
export function runWithStub(dir, logFile) {
  execFileSync(process.execPath, [runner, dir, logFile], { stdio: ["ignore", "ignore", "inherit"], timeout: 600000 });
  return fs.readFileSync(logFile, "utf8").split("\n");
}
