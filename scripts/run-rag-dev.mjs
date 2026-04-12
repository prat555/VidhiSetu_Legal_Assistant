import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ragDir = path.join(projectRoot, "rag-service");
const ragVenvPython = process.platform === "win32"
  ? path.join(ragDir, ".venv", "Scripts", "python.exe")
  : path.join(ragDir, ".venv", "bin", "python");
const workspaceVenvPython = process.platform === "win32"
  ? path.join(projectRoot, ".venv", "Scripts", "python.exe")
  : path.join(projectRoot, ".venv", "bin", "python");

function run(command, args) {
  const env = { ...process.env };
  if (!env.EMBEDDING_PROVIDER) {
    env.EMBEDDING_PROVIDER = "fastembed";
  }
  if (!env.CHROMA_DIR) {
    env.CHROMA_DIR = "./vectorstore_fastembed";
    if (!env.OLLAMA_TIMEOUT_SECONDS) {
      env.OLLAMA_TIMEOUT_SECONDS = "120";
    }
  }

  const result = spawnSync(command, args, {
    cwd: ragDir,
    stdio: "inherit",
    shell: false,
    env,
  });

  if (result.error) {
    return false;
  }

  return result.status === 0;
}

const pythonCandidates = [ragVenvPython, workspaceVenvPython, "python", "python3", "py"];
let pythonToUse = null;

for (const candidate of pythonCandidates) {
  if ((candidate === ragVenvPython && !existsSync(ragVenvPython)) ||
      (candidate === workspaceVenvPython && !existsSync(workspaceVenvPython))) {
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

console.log(`Using Python: ${pythonToUse}`);

const started = run(pythonToUse, [
  "-m",
  "uvicorn",
  "api.main:app",
  "--host",
  "127.0.0.1",
  "--port",
  "8000",
  "--reload",
]);

if (!started) {
  process.exit(1);
}
