import { Booking } from "../models/Booking.js";

// Only these statuses hold a time slot. Cancelled/completed ones don't block.
export const ACTIVE_STATUSES = ["pending", "confirmed"];

// Which status changes an admin may make from each status.
export const ADMIN_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function getEndTime(start, durationMinutes) {
  return new Date(start.getTime() + durationMinutes * 60 * 1000);
}

// One repair crew: two active bookings can't overlap.
// Overlap = existing starts before the new one ends AND ends after the new one starts.
export function findConflictingBooking(start, end, ignoreId) {
  const filter = {
    status: { $in: ACTIVE_STATUSES },
    scheduledAt: { $lt: end },
    endsAt: { $gt: start },
  };

  if (ignoreId) {
    filter._id = { $ne: ignoreId };
  }

  return Booking.findOne(filter);
}

// Customers can only change bookings that are still active and in the future.
export function canCustomerChange(booking) {
  return ACTIVE_STATUSES.includes(booking.status) && booking.scheduledAt > new Date();
}