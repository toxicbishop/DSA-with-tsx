const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// Render/Proxy Support: Trust the first proxy to get real user IP for rate limiting
app.set("trust proxy", 1);

// Security: Set various HTTP headers for security
app.use(helmet());

// Debug Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Global Rate Limiting: Sensible defaults for all public endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use(globalLimiter);

// Specific Rate Limiting for Issue Submission (Stricter)
const issueLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 issue reports per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many reports submitted. Please wait an hour before submitting more feedback.",
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent DOS
app.use(cookieParser());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

// Admin Auth Middleware (For protected GET routes)
const validateAdminKey = (req, res, next) => {
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;
  const providedPassword =
    req.headers["x-admin-password"] || req.query.password;

  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid admin password",
    });
  }
  next();
};

// API Key Validation Middleware (For public submissions)
const validateAPIKey = (req, res, next) => {
  const apiKey = process.env.API_KEY;
  const providedKey = req.headers["x-api-key"];

  if (!providedKey || providedKey !== apiKey) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid API Key" });
  }
  next();
};

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes

// API Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.get("/api/", (req, res) => {
  res.send("DSA Study Hub API is running securely");
});

// Enable CORS Pre-Flight for all routes
app.options("*", cors());

// Mount Auth Routes
// Auth Routes Removed

const execLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    run: { stderr: "Too many execution requests. Please wait a minute." },
  },
});

app.post("/api/execute", execLimiter, async (req, res) => {
  const { language, files, stdin } = req.body;
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

  let fileName, compileCmd, runCmd;

  switch (language) {
    case "c":
      fileName = `main.c`;
      compileCmd = `gcc main.c -o main.exe`;
      runCmd = path.join(tempDir, "main.exe");
      break;
    case "cpp":
      fileName = `main.cpp`;
      compileCmd = `g++ main.cpp -o main.exe`;
      runCmd = path.join(tempDir, "main.exe");
      break;
    case "python":
      fileName = `main.py`;
      runCmd = os.platform() === "win32" ? `python` : `python3`;
      break;
    case "java":
      const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = match ? match[1] : `Main`;
      fileName = `${className}.java`;
      compileCmd = `javac ${fileName}`;
      runCmd = `java ${className}`;
      break;
    default:
      await fsPromises
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {});
      return res.status(400).json({ run: { stderr: "Unsupported language" } });
  }

  const filePath = path.join(tempDir, fileName);
  await fsPromises.writeFile(filePath, code);

  let inputPath = null;
  if (input) {
    inputPath = path.join(tempDir, `input.txt`);
    await fsPromises.writeFile(inputPath, input);
  }

  let finalOutput = "";
  let finalError = "";
  let compileError = "";

  try {
    if (compileCmd) {
      try {
        await execPromise(compileCmd, { cwd: tempDir, timeout: 5000 });
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

        let childProcess;
        if (language === "python") {
          childProcess = spawn(runCmd, ["main.py"], {
            cwd: tempDir,
            shell: false,
          });
        } else if (language === "java") {
          childProcess = spawn("java", [className], {
            cwd: tempDir,
            shell: false,
          });
        } else {
          childProcess = spawn(runCmd, [], { cwd: tempDir, shell: false });
        }

        const timeoutId = setTimeout(() => {
          childProcess.kill();
          reject(new Error("Timeout or execution error"));
        }, 5000);

        if (input) {
          childProcess.stdin.on("error", () => {}); // ignore write errors if program exits early
          childProcess.stdin.write(input);
          childProcess.stdin.end();
        }

        childProcess.stdout.on("data", (data) => {
          stdoutData += data.toString();
        });
        childProcess.stderr.on("data", (data) => {
          stderrData += data.toString();
        });

        childProcess.on("close", (code) => {
          clearTimeout(timeoutId);
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

  res.json({
    run: {
      stdout: finalOutput,
      stderr: finalError,
    },
  });
});

// POST: Create a new issue/suggestion
// 1. apply validateAPIKey (Security)
// 2. apply issueLimiter (Rate Limiting)
// 3. apply strict validation (Input Validation & Sanitization)
app.post(
  "/api/issues",
  validateAPIKey,
  issueLimiter,
  [
    body("type")
      .isIn(["bug", "suggestion"])
      .withMessage("Invalid type (must be bug or suggestion)"),
    body("severity")
      .optional()
      .isIn(["minor", "moderate", "critical"])
      .withMessage("Invalid severity level"),
    body("name")
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .escape()
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email address"),
    body("title")
      .isString()
      .trim()
      .isLength({ min: 5, max: 100 })
      .escape()
      .withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .isString()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .escape()
      .withMessage("Description must be between 10 and 1000 characters"),
    // Reject unexpected fields
    (req, res, next) => {
      const allowedFields = [
        "type",
        "severity",
        "title",
        "description",
        "name",
        "email",
      ];
      const receivedFields = Object.keys(req.body);
      const extraFields = receivedFields.filter(
        (f) => !allowedFields.includes(f),
      );
      if (extraFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Unexpected fields: ${extraFields.join(", ")}`,
        });
      }
      next();
    },
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: true, errors: errors.array() });
    }

    try {
      const { type, severity, title, description, name, email } = req.body;

      // Duplicate Detection: Reject if same title+email submitted within the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const duplicate = await Issue.findOne({
        title: title,
        email: email,
        createdAt: { $gte: oneHourAgo },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "A similar report was already submitted recently. Please wait before submitting again.",
        });
      }

      const newIssue = new Issue({
        type,
        severity: type === "bug" ? severity : undefined,
        title,
        description,
        name,
        email,
      });

      const savedIssue = await newIssue.save();
      res.status(201).json({ success: true, data: savedIssue });
    } catch (error) {
      console.error("Error creating issue:", error);
      res.status(500).json({
        success: false,
        message: "A server error occurred. Please try again later.",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
);

// GET: Fetch all issues (admin password required)
app.get("/api/issues", validateAdminKey, async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE: Delete a specific issue by ID (admin password required)
app.delete("/api/issues/:id", validateAdminKey, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.json({
      success: true,
      message: "Issue deleted successfully",
      data: deletedIssue,
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Socket.io Collaboration Logic
io.on("connection", (socket) => {
  console.log(`User connected to collaboration socket: ${socket.id}`);

  // Join a specific program room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle incoming chat messages
  socket.on("send_message", (data) => {
    // We broadcast the message to everyone in the room (including sender if desired, or use 'to')
    // We send back to everyone in the room except the sender: socket.to(data.room).emit
    // Or to everyone including sender: io.to(data.room).emit
    io.to(data.room).emit("receive_message", data);
  });

  // Handle shared code/notes typing
  socket.on("send_code_update", (data) => {
    socket.to(data.room).emit("receive_code_update", data.code);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected from collaboration socket: ${socket.id}`);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running securely on http://127.0.0.1:${PORT}`);
});
