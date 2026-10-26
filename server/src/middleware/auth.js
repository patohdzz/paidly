import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Checks the "Authorization: Bearer <token>" header and loads the user.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Please log in to continue" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please log in again" });
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: "Your session has expired. Please log in again" });
  }

  req.user = user;
  next();
}

// Use AFTER requireAuth. Example: requireRole("admin")
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You don't have permission to do that" });
    }
    next();
  };
}