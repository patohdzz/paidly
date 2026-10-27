import { useState } from "react";
import { todayISO } from "../utils/formatUtils";
import {
  timeSlotOptions,
  toDateInput,
  toScheduledAt,
  toTimeInput,
  validateBooking,
} from "../utils/bookingUtils";

function RescheduleForm({ booking, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    date: toDateInput(booking.scheduledAt),
    time: toTimeInput(booking.scheduledAt),
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Quick checks here; the server checks for double-booking.
    const newErrors = validateBooking(values, {
      bookings: [],
      durationMinutes: booking.durationMinutes,
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toScheduledAt(values.date, values.time));
    } catch (error) {
      setErrors({ time: error.message });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        <p className="small text-secondary">
          Rescheduling sends your booking back to <strong>pending</strong> until
          we confirm the new time.
        </p>

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <label htmlFor="reschedule-date" className="form-label">
              New date
            </label>
            <input
              id="reschedule-date"
              name="date"
              type="date"
              min={todayISO()}
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              value={values.date}
              onChange={handleChange}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>

          <div className="col-12 col-sm-6">
            <label htmlFor="reschedule-time" className="form-label">
              New start time
            </label>
            <select
              id="reschedule-time"
              name="time"
              className={`form-select ${errors.time ? "is-invalid" : ""}`}
              value={values.time}
              onChange={handleChange}
            >
              <option value="">Choose a time</option>
              {timeSlotOptions.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
            {errors.time && (
              <div className="invalid-feedback">{errors.time}</div>
            )}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Keep current time
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save new time"}
        </button>
      </div>
    </form>
  );
}

export default RescheduleForm;