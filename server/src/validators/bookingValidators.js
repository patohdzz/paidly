import { isValidId } from "../utils/isValidId.js";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function checkScheduledAt(value) {
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    return [{ field: "scheduledAt", message: "Enter a valid date and time" }];
  }

  const time = new Date(value).getTime();

  if (time <= Date.now()) {
    return [{ field: "scheduledAt", message: "Choose a time in the future" }];
  }
  if (time > Date.now() + ONE_YEAR_MS) {
    return [{ field: "scheduledAt", message: "Bookings can be made up to 1 year ahead" }];
  }
  return [];
}

export function validateCreateBooking(body) {
  const { serviceId, scheduledAt, address, notes } = body ?? {};
  const details = [];

  if (!isValidId(serviceId)) {
    details.push({ field: "serviceId", message: "Choose a valid service" });
  }

  details.push(...checkScheduledAt(scheduledAt));

  if (
    typeof address !== "string" ||
    address.trim().length < 5 ||
    address.trim().length > 200
  ) {
    details.push({ field: "address", message: "Address must be 5 to 200 characters" });
  }

  if (notes !== undefined && (typeof notes !== "string" || notes.trim().length > 500)) {
    details.push({ field: "notes", message: "Notes must be 500 characters or less" });
  }

  return details;
}

export function validateReschedule(body) {
  return checkScheduledAt(body?.scheduledAt);
}