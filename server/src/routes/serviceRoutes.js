import { Router } from "express";
import { getServiceById, listServices } from "../controllers/serviceController.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getServiceById);

export default router;