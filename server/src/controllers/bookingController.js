import { Booking, BOOKING_STATUSES } from "../models/Booking.js";
import { Service } from "../models/Service.js";
import {
  ADMIN_STATUS_TRANSITIONS,
  canCustomerChange,
  findConflictingBooking,
  getEndTime,
} from "../services/bookingService.js";
import { isValidId } from "../utils/isValidId.js";
import {
  validateCreateBooking,
  validateReschedule,
} from "../validators/bookingValidators.js";

const CONFLICT_MESSAGE = "That time is already booked. Please choose another time";

// Loads a booking the current user is allowed to see (owner or admin).
// Sends 404 and returns null otherwise.
async function loadAllowedBooking(req, res) {
  const { id } = req.params;
  const booking = isValidId(id) ? await Booking.findById(id) : null;

  const allowed =
    booking !== null &&
    (req.user.role === "admin" || booking.user.equals(req.user._id));

  if (!allowed) {
    res.status(404).json({ error: "Booking not found" });
    return null;
  }
  return booking;
}

// POST /api/bookings  (customer)
export async function createBooking(req, res) {
  const details = validateCreateBooking(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  const service = await Service.findOne({ _id: req.body.serviceId, active: true });
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  const scheduledAt = new Date(req.body.scheduledAt);
  const endsAt = getEndTime(scheduledAt, service.durationMinutes);

  if (await findConflictingBooking(scheduledAt, endsAt)) {
    return res.status(409).json({ error: CONFLICT_MESSAGE });
  }

  const booking = await Booking.create({
    user: req.user._id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    service: service._id,
    serviceName: service.name,
    unit: service.unit,
    rate: service.rate,
    durationMinutes: service.durationMinutes,
    scheduledAt,
    endsAt,
    address: req.body.address.trim(),
    notes: (req.body.notes ?? "").trim(),
  });

  res.status(201).json(booking);
}

// GET /api/bookings/mine  (customer)
export async function listMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.user._id }).sort({ scheduledAt: 1 });
  res.json(bookings);
}

// GET /api/bookings  (admin, optional ?status=pending)
export async function listAllBookings(req, res) {
  const { status } = req.query;
  const filter = {};

  if (status !== undefined) {
    if (!BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    filter.status = status;
  }

  const bookings = await Booking.find(filter).sort({ scheduledAt: 1 });
  res.json(bookings);
}

// GET /api/bookings/:id  (owner or admin)
export async function getBooking(req, res) {
  const booking = await loadAllowedBooking(req, res);
  if (booking) {
    res.json(booking);
  }
}

// PATCH /api/bookings/:id/reschedule  (owner)
export async function rescheduleBooking(req, res) {
  const booking = await loadAllowedBooking(req, res);
  if (!booking) return;

  if (!canCustomerChange(booking)) {
    return res.status(400).json({ error: "This booking can no longer be changed" });
  }

  const details = validateReschedule(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  const scheduledAt = new Date(req.body.scheduledAt);
  const endsAt = getEndTime(scheduledAt, booking.durationMinutes);

  if (await findConflictingBooking(scheduledAt, endsAt, booking._id)) {
    return res.status(409).json({ error: CONFLICT_MESSAGE });
  }

  booking.scheduledAt = scheduledAt;
  booking.endsAt = endsAt;
  booking.status = "pending"; // the new time needs to be confirmed again
  await booking.save();

  res.json(booking);
}

// PATCH /api/bookings/:id/cancel  (owner or admin)
export async function cancelBooking(req, res) {
  const booking = await loadAllowedBooking(req, res);
  if (!booking) return;

  const allowed =
    req.user.role === "admin"
      ? ADMIN_STATUS_TRANSITIONS[booking.status].includes("cancelled")
      : canCustomerChange(booking);

  if (!allowed) {
    return res.status(400).json({ error: "This booking can no longer be cancelled" });
  }

  booking.status = "cancelled";
  await booking.save();

  res.json(booking);
}

// PATCH /api/bookings/:id/status  (admin)
export async function updateBookingStatus(req, res) {
  const booking = await loadAllowedBooking(req, res);
  if (!booking) return;

  const newStatus = req.body?.status;
  const allowedNext = ADMIN_STATUS_TRANSITIONS[booking.status] ?? [];

  if (!allowedNext.includes(newStatus)) {
    return res.status(400).json({
      error: `A ${booking.status} booking can't be changed to "${newStatus}"`,
    });
  }

  booking.status = newStatus;
  await booking.save();

  res.json(booking);
}