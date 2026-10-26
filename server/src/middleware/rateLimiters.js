import rateLimit from "express-rate-limit";

// Slows down password guessing: max 20 login/register attempts per 15 minutes per IP.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in a few minutes" },
});