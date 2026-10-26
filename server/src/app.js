import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();

// Render/Vercel sit behind a proxy: trust it so rate limiting sees real user IPs.
app.set("trust proxy", 1);

// 1. Security headers on every response
app.use(helmet());

// 2. Only allow requests from our React app
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

// 3. Read JSON sent by the frontend (max 10kb so nobody can send huge data)
app.use(express.json({ limit: "10kb" }));

// Health check: a simple "are you alive?" route
const dbStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: dbStates[mongoose.connection.readyState] ?? "unknown",
  });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

// 404: runs only if no route above matched
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler: catches anything that crashed above
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  // Mongoose schema rules failed
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ error: "Validation failed", details });
  }

  // Duplicate value in a unique field (e.g. same email signed up twice at once)
  if (err.code === 11000) {
    return res.status(409).json({ error: "That value is already in use" });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;