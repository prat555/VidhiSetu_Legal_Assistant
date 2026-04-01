import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ragDir = path.join(projectRoot, "rag-service");
const venvPython = process.platform === "win32"
  ? path.join(ragDir, ".venv", "Scripts", "python.exe")
  : path.join(ragDir, ".venv", "bin", "python");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ragDir,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    return false;
  }

  return result.status === 0;
}

const pythonCandidates = [venvPython, "python", "python3", "py"];
let pythonToUse = null;

for (const candidate of pythonCandidates) {
  if (candidate === venvPython && !existsSync(venvPython)) {
    continue;
  }

  if (run(candidate, ["--version"])) {
    pythonToUse = candidate;
    break;
  }
}

if (!pythonToUse) {
  console.error("No Python executable found. Run npm run setup:rag first.");
  process.exit(1);
}

const started = run(pythonToUse, [
  "-m",
  "uvicorn",
  "api.main:app",
  "--host",
  "127.0.0.1",
  "--port",
  "8002",
  "--reload",
]);

if (!started) {
  process.exit(1);
}
