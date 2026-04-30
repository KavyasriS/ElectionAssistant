import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/election-data", (req, res) => {
    const dataPath = path.join(process.cwd(), "src/data/election_data.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    res.json(data);
  });

  app.get("/api/election-schedule-2026", (req, res) => {
    const dataPath = path.join(process.cwd(), "src/data/national_election_2026.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    res.json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicGuide Server running on http://localhost:${PORT}`);
  });
}

startServer();
