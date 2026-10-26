import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  listAllServices,
  listServices,
  updateService,
} from "../controllers/serviceController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const adminOnly = [requireAuth, requireRole("admin")];

// Public
router.get("/", listServices);

// Admin (must come before "/:id" so "admin" isn't treated as an ID)
router.get("/admin/all", adminOnly, listAllServices);
router.post("/", adminOnly, createService);
router.patch("/:id", adminOnly, updateService);
router.delete("/:id", adminOnly, deleteService);

// Public
router.get("/:id", getServiceById);

export default router;