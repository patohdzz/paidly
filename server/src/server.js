import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();