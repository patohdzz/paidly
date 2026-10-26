import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBooking,
  listAllBookings,
  listMyBookings,
  rescheduleBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Every booking route needs a logged-in user.
router.use(requireAuth);

router.post("/", requireRole("customer"), createBooking);
router.get("/mine", requireRole("customer"), listMyBookings);
router.get("/", requireRole("admin"), listAllBookings);
router.get("/:id", getBooking);
router.patch("/:id/reschedule", requireRole("customer"), rescheduleBooking);
router.patch("/:id/cancel", cancelBooking);
router.patch("/:id/status", requireRole("admin"), updateBookingStatus);

export default router;