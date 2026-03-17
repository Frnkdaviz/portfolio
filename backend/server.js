const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ── CONFIG ──────────────────────────────────────────
const JWT_SECRET  = process.env.JWT_SECRET  || "frank_jwt_secret_change_in_prod";
const ADMIN_PASS  = process.env.ADMIN_PASS  || "frank@admin2025";
const DATA_FILE   = path.join(__dirname, "data", "portfolio.json");

// ── DATA HELPERS ────────────────────────────────────
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Read error:", e.message);
  }
  return require("./data/default.json");
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── AUTH MIDDLEWARE ──────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.replace("Bearer ", "");
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ── ROUTES ──────────────────────────────────────────

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Get portfolio data (public)
app.get("/api/portfolio", (req, res) => {
  res.json(readData());
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

// Update portfolio data (protected)
app.put("/api/portfolio", auth, (req, res) => {
  try {
    const current = readData();
    const updated = { ...current, ...req.body };
    writeData(updated);
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a specific section (protected)
app.put("/api/portfolio/:section", auth, (req, res) => {
  const { section } = req.params;
  const allowed = ["profile", "skills", "monitoringTools", "certifications", "roles", "experience", "contact"];
  if (!allowed.includes(section)) {
    return res.status(400).json({ error: "Invalid section" });
  }
  try {
    const current = readData();
    current[section] = req.body;
    writeData(current);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── START ────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

module.exports = app;
