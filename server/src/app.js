import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// 1. Security headers on every response
app.use(helmet());

// 2. Only allow requests from our React app
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

// 3. Read JSON sent by the frontend (max 10kb so nobody can send huge data)
app.use(express.json({ limit: "10kb" }));

// Health check: a simple "are you alive?" route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404: runs only if no route above matched
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler: catches anything that crashed above
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;