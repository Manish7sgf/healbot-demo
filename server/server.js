const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let latestResult = null;
const history = [];

app.post("/webhook", (req, res) => {
  const data = req.body;
  const result = {
    id: Date.now(),
    status: data.status || "unknown",
    error_log: data.error_log || "",
    ai_fix: data.ai_fix || "No fix provided",
    commit: data.commit || "unknown",
    branch: data.branch || "unknown",
    actor: data.actor || "unknown",
    repo: data.repo || "unknown",
    timestamp: data.timestamp || new Date().toISOString(),
  };

  latestResult = result;
  history.unshift(result);
  if (history.length > 20) history.pop();

  console.log(`Received: ${result.status} | ${result.commit}`);
  res.json({ ok: true });
});

app.get("/result", (req, res) => {
  if (!latestResult) return res.json({ waiting: true });
  res.json(latestResult);
});

app.get("/history", (req, res) => {
  res.json(history);
});

app.use(express.static(path.join(__dirname, "../dashboard")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard/index.html"));
});

app.listen(PORT, () => {
  console.log(`HealBot server running at http://localhost:${PORT}`);
});