const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database("./team.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Available',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM team_members", (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO team_members (name, role, status) VALUES (?, ?, ?)"
      );
      [
        ["Ananya", "Frontend Developer", "Available"],
        ["Rahul", "Backend Developer", "Busy"],
        ["Priya", "UI/UX Designer", "Away"],
        ["Kiran", "ML Engineer", "Available"]
      ].forEach(member => stmt.run(member));
      stmt.finalize();
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/team", (req, res) => {
  db.all("SELECT * FROM team_members ORDER BY id", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.patch("/api/team/:id/status", (req, res) => {
  const allowed = ["Available", "Busy", "Away"];
  const { status } = req.body;

  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: "Status must be Available, Busy, or Away"
    });
  }

  db.run(
    `UPDATE team_members
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json({ message: "Status updated successfully" });
    }
  );
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Team Availability Tracker running on port ${PORT}`);
});