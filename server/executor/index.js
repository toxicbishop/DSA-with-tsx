const path = require("path");
const os = require("os");
const fs = require("fs");
const fsPromises = fs.promises;
const crypto = require("crypto");
const util = require("util");
const { spawn, execFile } = require("child_process");
const execFilePromise = util.promisify(execFile);
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 6000;
const EXEC_TIMEOUT_MS = parseInt(process.env.EXEC_TIMEOUT_MS || "5000", 10);
const MAX_OUTPUT_BYTES = parseInt(process.env.MAX_OUTPUT_BYTES || "65536", 10);

// Trust proxy: api container is the only client; preserve forwarded IP for limiter keying
app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));

const runLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RUN_RATE_LIMIT || "30", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { run: { stderr: "Executor rate limit exceeded. Try again shortly." } },
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/run", runLimiter, async (req, res) => {
  const { language, files, stdin } = req.body || {};

  if (!language || !files || files.length === 0) {
    return res
      .status(400)
      .json({ run: { stderr: "Language and code files are required." } });
  }

  const code = files[0].content;
  const input = stdin || "";

  const fileId = crypto.randomBytes(4).toString("hex");
  const tempDir = path.join(os.tmpdir(), `dsa-exec-${fileId}`);
  await fsPromises.mkdir(tempDir, { recursive: true });

  let fileName = "";
  let compileArgs = null;
  let binRun = "";
  let argsRun = [];

  switch (language) {
    case "c":
      fileName = "main.c";
      compileArgs = ["gcc", ["main.c", "-o", "main.exe"]];
      binRun = path.join(tempDir, "main.exe");
      break;
    case "cpp":
      fileName = "main.cpp";
      compileArgs = ["g++", ["main.cpp", "-o", "main.exe"]];
      binRun = path.join(tempDir, "main.exe");
      break;
    case "python":
      fileName = "main.py";
      binRun = os.platform() === "win32" ? "python" : "python3";
      argsRun = ["main.py"];
      break;
    case "java": {
      const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      let className = match ? match[1].replace(/[^A-Za-z0-9_]/g, "") : "Main";
      if (!className) className = "Main";
      fileName = `${className}.java`;
      compileArgs = ["javac", [fileName]];
      binRun = "java";
      argsRun = [className];
      break;
    }
    default:
      await fsPromises
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {});
      return res.status(400).json({ run: { stderr: "Unsupported language" } });
  }

  const filePath = path.join(tempDir, fileName);
  await fsPromises.writeFile(filePath, code);

  let finalOutput = "";
  let finalError = "";
  let compileError = "";

  try {
    if (compileArgs) {
      try {
        await execFilePromise(compileArgs[0], compileArgs[1], {
          cwd: tempDir,
          timeout: EXEC_TIMEOUT_MS,
        });
      } catch (err) {
        compileError = err.stderr || err.message;
        await fsPromises
          .rm(tempDir, { recursive: true, force: true })
          .catch(() => {});
        return res.json({
          run: { stdout: "", stderr: "" },
          compile: { stderr: compileError },
        });
      }
    }

    try {
      finalOutput = await new Promise((resolve, reject) => {
        let stdoutData = "";
        let stderrData = "";
        let truncated = false;

        const childProcess = spawn(binRun, argsRun, {
          cwd: tempDir,
          shell: false,
        });

        const timeoutId = setTimeout(() => {
          childProcess.kill("SIGKILL");
          reject(new Error("Timeout or execution error"));
        }, EXEC_TIMEOUT_MS);

        if (input) {
          childProcess.stdin.on("error", () => {});
          childProcess.stdin.write(input);
          childProcess.stdin.end();
        }

        const appendCapped = (bufRef, chunk) => {
          if (bufRef.value.length >= MAX_OUTPUT_BYTES) {
            truncated = true;
            return;
          }
          const remaining = MAX_OUTPUT_BYTES - bufRef.value.length;
          bufRef.value += chunk.toString().slice(0, remaining);
          if (chunk.length > remaining) truncated = true;
        };

        const outRef = { value: "" };
        const errRef = { value: "" };

        childProcess.stdout.on("data", (d) => appendCapped(outRef, d));
        childProcess.stderr.on("data", (d) => appendCapped(errRef, d));

        childProcess.on("close", () => {
          clearTimeout(timeoutId);
          stdoutData = outRef.value;
          stderrData = errRef.value;
          if (truncated) stderrData += "\n[output truncated]";
          if (stderrData && !stdoutData) {
            reject(new Error(stderrData));
          } else {
            finalError = stderrData;
            resolve(stdoutData);
          }
        });

        childProcess.on("error", (err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
      });
    } catch (err) {
      finalError = err.message || "Timeout or execution error";
    }
  } catch (err) {
    finalError = err.message || "Unknown error";
  } finally {
    fsPromises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }

  res.json({ run: { stdout: finalOutput, stderr: finalError } });
});

app.listen(PORT, () => {
  console.log(`Executor listening on ${PORT}`);
});
