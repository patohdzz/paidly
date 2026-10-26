import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";

// Creates (or resets) the admin account from ADMIN_* values in server/.env.
// Admins can ONLY be created this way, never through public registration.
async function createAdmin() {
  const name = process.env.ADMIN_NAME || "Paidly Admin";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ characters) in server/.env");
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);

  await User.updateOne(
    { email },
    { $set: { name, email, passwordHash, role: "admin" } },
    { upsert: true, runValidators: true }
  );

  console.log(`Admin account ready: ${email}`);
}

createAdmin()
  .catch((error) => {
    console.error("Create admin failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });