export const ADDRESS_MIN = 5;
export const ADDRESS_MAX = 200;
export const NOTES_MAX = 500;

// Appointment start times offered to customers (8 AM to 4 PM).
export const timeSlotOptions = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

// "2026-10-25" + "09:00" (the user's local time) -> UTC ISO string
export function toScheduledAt(date, time) {
  return new Date(`${date}T${time}`).toISOString();
}

// UTC ISO string -> "Sun, Oct 25, 2026, 9:00 AM" in the user's local time
export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStartAndEnd(scheduledAt, durationMinutes) {
  const start = new Date(scheduledAt).getTime();
  const end = start + durationMinutes * 60 * 1000;
  return { start, end };
}

// One crew: two active bookings can't overlap in time.
export function findConflict(bookings, scheduledAt, durationMinutes, ignoreId) {
  const wanted = getStartAndEnd(scheduledAt, durationMinutes);

  return bookings.find((booking) => {
    if (booking.id === ignoreId || booking.status === "cancelled") {
      return false;
    }
    const existing = getStartAndEnd(booking.scheduledAt, booking.durationMinutes);
    return wanted.start < existing.end && existing.start < wanted.end;
  });
}

export function isUpcoming(booking) {
  return new Date(booking.scheduledAt).getTime() > Date.now();
}

export function canChangeBooking(booking) {
  return (
    (booking.status === "pending" || booking.status === "confirmed") &&
    isUpcoming(booking)
  );
}

export function validateBooking(values, { bookings, durationMinutes, ignoreId }) {
  const errors = {};

  if (!values.date) {
    errors.date = "Choose a date.";
  }

  if (!values.time) {
    errors.time = "Choose a time.";
  }

  if (values.date && values.time) {
    const scheduledAt = toScheduledAt(values.date, values.time);

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      errors.time = "Choose a time in the future.";
    } else if (findConflict(bookings, scheduledAt, durationMinutes, ignoreId)) {
      errors.time = "That time is already booked. Please choose another time.";
    }
  }

  if (values.address !== undefined) {
    const address = values.address.trim();
    if (!address) {
      errors.address = "Service address is required.";
    } else if (address.length < ADDRESS_MIN || address.length > ADDRESS_MAX) {
      errors.address = `Address must be ${ADDRESS_MIN} to ${ADDRESS_MAX} characters.`;
    }
  }

  if (values.notes !== undefined && values.notes.trim().length > NOTES_MAX) {
    errors.notes = `Notes must be ${NOTES_MAX} characters or less.`;
  }

  return errors;
}


function pad(number) {
  return String(number).padStart(2, "0");
}

// UTC ISO string -> "2026-10-25" in local time (for <input type="date">)
export function toDateInput(isoString) {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// UTC ISO string -> "09:00" in local time (for the time dropdown)
export function toTimeInput(isoString) {
  const date = new Date(isoString);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}