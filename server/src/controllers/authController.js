import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { validateLogin, validateRegister } from "../validators/authValidators.js";

const SALT_ROUNDS = 12;

// POST /api/auth/register
export async function register(req, res) {
  const details = validateRegister(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  // role is NOT taken from the request: public sign-ups are always customers.
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ token: generateToken(user), user });
}

// POST /api/auth/login
export async function login(req, res) {
  const details = validateLogin(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select("+passwordHash");

  const passwordMatches =
    user !== null && (await bcrypt.compare(req.body.password, user.passwordHash));

  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ token: generateToken(user), user });
}

// GET /api/auth/me  (requires a valid token)
export async function me(req, res) {
  res.json({ user: req.user });
}