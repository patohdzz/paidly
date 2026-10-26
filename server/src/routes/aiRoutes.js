import { Router } from "express";
import { getQuote } from "../controllers/aiController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/quote", requireAuth, requireRole("customer"), aiLimiter, getQuote);

export default router;