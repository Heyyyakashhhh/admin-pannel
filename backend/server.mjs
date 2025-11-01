
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// open sqlite DB
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, "data.db"),
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
})();

// Clients endpoints
app.get("/api/clients", async (req, res) => {
  try {
    const rows = await db.all("SELECT data FROM clients");
    const clients = rows.map(r => JSON.parse(r.data));
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const clients = req.body;
    if (!Array.isArray(clients)) return res.status(400).json({ error: "expected array" });
    const insert = await db.prepare("REPLACE INTO clients (id, data) VALUES (?, ?)");
    await db.run("BEGIN");
    for (const c of clients) {
      const id = c.id ?? c.client_identifier ?? c.clientId ?? String(Math.random());
      await insert.run(id, JSON.stringify(c));
    }
    await db.run("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    await db.run("ROLLBACK");
    res.status(500).json({ error: "db error" });
  }
});

// Single client create/update/delete
app.post("/api/clients/save", async (req, res) => {
  try {
    const c = req.body;
    const id = c.id ?? c.client_identifier ?? c.clientId ?? String(Math.random());
    await db.run("REPLACE INTO clients (id, data) VALUES (?, ?)", id, JSON.stringify(c));
    res.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.run("DELETE FROM clients WHERE id = ?", id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// KV endpoints for owner and welcome flag
app.get("/api/kv/:key", async (req, res) => {
  try {
    const row = await db.get("SELECT value FROM kv WHERE key = ?", req.params.key);
    res.json(row ? JSON.parse(row.value) : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

app.post("/api/kv/:key", async (req, res) => {
  try {
    const val = JSON.stringify(req.body);
    await db.run("REPLACE INTO kv (key, value) VALUES (?, ?)", req.params.key, val);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server listening on", PORT));
