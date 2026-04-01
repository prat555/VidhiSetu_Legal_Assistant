import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ragDir = path.join(projectRoot, "rag-service");
const requirementsPath = path.join(ragDir, "requirements.txt");
const venvDir = path.join(ragDir, ".venv");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    return false;
  }

  return result.status === 0;
}

function detectPython() {
  const candidates = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

  for (const candidate of candidates) {
    if (run(candidate, ["--version"], projectRoot)) {
      return candidate;
    }
  }

  return null;
}

if (!existsSync(ragDir)) {
  console.error("rag-service folder not found. Run this from the vidhisetu root.");
  process.exit(1);
}

if (!existsSync(requirementsPath)) {
  console.error("requirements.txt not found in rag-service.");
  process.exit(1);
}

const pythonCmd = detectPython();
if (!pythonCmd) {
  console.error("No Python executable found. Install Python and retry.");
  process.exit(1);
}

console.log("Creating virtual environment in rag-service/.venv ...");
if (!run(pythonCmd, ["-m", "venv", venvDir], projectRoot)) {
  console.error("Failed to create virtual environment.");
  process.exit(1);
}

const venvPython = process.platform === "win32"
  ? path.join(venvDir, "Scripts", "python.exe")
  : path.join(venvDir, "bin", "python");

console.log("Upgrading pip ...");
if (!run(venvPython, ["-m", "pip", "install", "--upgrade", "pip"], ragDir)) {
  console.error("Failed to upgrade pip in venv.");
  process.exit(1);
}

console.log("Installing RAG dependencies ...");
if (!run(venvPython, ["-m", "pip", "install", "-r", "requirements.txt"], ragDir)) {
  console.error("Failed to install rag-service requirements.");
  process.exit(1);
}

console.log("RAG environment setup complete.");
