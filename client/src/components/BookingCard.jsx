import StatusBadge from "./StatusBadge";
import { formatDuration, formatRate } from "../utils/serviceUtils";
import { canChangeBooking, formatDateTime } from "../utils/bookingUtils";

function BookingCard({ booking, onReschedule, onCancel }) {
  const changeable = canChangeBooking(booking);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h2 className="h6 fw-semibold mb-0">{booking.serviceName}</h2>
          <StatusBadge status={booking.status} />
        </div>

        <div className="fw-medium mb-1">{formatDateTime(booking.scheduledAt)}</div>
        <div className="small text-secondary mb-1">{booking.address}</div>
        <div className="small text-muted">
          {formatRate(booking)} &middot; about{" "}
          {formatDuration(booking.durationMinutes)}
        </div>

        {booking.notes && (
          <p className="small text-secondary fst-italic mt-2 mb-0">
            &ldquo;{booking.notes}&rdquo;
          </p>
        )}

        {changeable && (
          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onReschedule(booking)}
            >
              Reschedule
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancel(booking)}
            >
              Cancel booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCard;